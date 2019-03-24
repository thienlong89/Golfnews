import React from 'react';
import {
    View,
    StyleSheet,
    BackHandler,
    Text,
    ScrollView,
    Linking,
    Alert,
    Platform,
    KeyboardAvoidingView
} from 'react-native';
import BaseComponent from "../../../Core/View/BaseComponent";
import HeaderView from '../../HeaderView';
import { fontSize, scale, verticalScale } from '../../../Config/RatioScale';
import TextCount from './Items/TextCount';
import { Rating } from 'react-native-elements';
import ReviewView from './Items/ReviewView';
import PopupReviewFacilityView from '../../Popups/PopupReviewFacilityView';
import ReviewManager from '../../../Services/ReviewManager';
import ApiService from '../../../Networking/ApiService';
import Networking from '../../../Networking/Networking';
import DescriptionView from './Items/DescriptionView';
import NewsFocusView from './Items/NewsFocusView';
import ReviewCourseVideo from './Items/ReviewCourseVideo';
import FacilityDetailModel from '../../../Model/Facility/FacilityDetailModel';
import { Location, Permissions } from '../../../Core/Common/ExpoUtils';
import IntentActivityAndroid from '../../../Core/Common/IntentActivityAndroid';
import openMap from 'react-native-open-maps';

/**
 * Review sân và đánh giá sân
 */
export default class ReviewFacilityView extends BaseComponent {
    constructor(props) {
        super(props);

        this.isIphoneX = this.getAppUtil().isIphoneX();
        let { params } = this.props.navigation.state;
        console.log('................params ', params);
        if (params) {
            this.id = params.id;
            this.title = params.title;
        } else {
            this.id = '';
            this.title = '';
        }
        // this.onBackClick = this.onBackClick.bind(this);
        this.onWriteReviewClick = this.onWriteReviewClick.bind(this);
        this.backHandler = null;
        this.reviewManager = new ReviewManager();
        this.name = 'facility';
        this.listReviews = [];
        this.sendReviewMsg = this.sendReviewMsg.bind(this);

        this.description = '';
        this.total_rate = 0;
        this.total_user_rate = 0;
        this.courseLat = 0;
        this.courseLong = 0;

        this.onBackPress = this.onBackPress.bind(this);
        this.onMapDirectionPress = this.onMapDirectionPress.bind(this);
    }

    onBackPress() {
        let { navigation } = this.props;
        if (navigation) {
            navigation.goBack();
        }
        return true;
    }

    /**
     * Lấy thông tin của 1 sân để review
     */
    requestReviewInfo() {
        let url = this.getConfig().getBaseUrl() + ApiService.facility_review_info(this.id);
        this.Logger().log('url review info : ', url);
        let self = this;
        this.showInternalLoading();
        Networking.httpRequestGet(url, (jsonData) => {
            // console.log('requestReviewInfo', jsonData)
            self.hideInternalLoading();
            self.model = new FacilityDetailModel(self);
            self.model.parseData(jsonData);

            if (self.model.getErrorCode() === 0) {
                self.description = self.model.description;
                self.total_rate = self.model.total_rate;
                self.total_user_rate = self.model.total_user_rate;
                self.courseLat = self.model.Facility.latitude;
                self.courseLong = self.model.Facility.longitude;

                self.refDescription.setDescription(self.description, self.total_rate);
                self.reviewView.updateCountReview(self.total_user_rate);
                self.refNewsFocusView.setUrlReviewImages(self.model.list_img_review);
                self.refReviewCourseVideo.setVideoUrl(self.model.video_review.video_link)
            } else {
                self.showErrorMsg(self.model.getErrorMsg());
            }
        }, () => {
            self.hideInternalLoading();
            self.showErrorMsg(self.t('time_out'));
        });
    }

    componentDidMount() {
        this.rotateToPortrait();
        this.registerMessageBar();
        this.handleHardwareBackPress();

        this.requestReviewInfo();
        this.init();
    }

    componentWillUnmount() {
        this.unregisterMessageBar();
        if (this.backHandler) {
            this.backHandler.remove();
        }
        this.reviewManager.offListeningChat();
        this.reviewManager.destroy();
    }

    handleHardwareBackPress() {
        let self = this;
        this.backHandler = BackHandler.addEventListener('hardwareBackPress', function () {
            self.onBackPress();
            return true;
        });
    }

    init() {
        if (!this.id) return;
        this.reviewManager.init(this.name, this.id, this.renderView.bind(this));
        this.reviewManager.handleSendReviewErrorCallback = this.handleSendReviewErrorCallback.bind(this);
        // this.reviewManager.loadMessanger();
        // this.reviewManager.listenForItems();
    }

    handleSendReviewErrorCallback(msg, error) {
        if (!error) {
            //thanh cong
            this.Logger().log('..... gui review den firebase thanh cong : ', msg);
            this.total_user_rate++;
            this.total_rate = (this.total_rate + msg.rate) / this.total_user_rate;
            this.total_rate = parseFloat(parseFloat(this.total_rate).toFixed(1));
            this.refCountUserRate.updateCommentNumber(this.total_user_rate);
            this.reviewView.updateCountReview(this.total_user_rate);
        }
    }

    renderView(listData) {
        this.listReviews = listData;
        this.reviewView.fillData(listData);
    }



    onWriteReviewClick() {
        this.popupReviewFacility.show();
    }

    sendReviewMsg(msg) {
        this.sendReviewData(msg);
        this.listReviews.push(msg);
        this.renderView(this.listReviews);
        this.reviewManager.sendMsg(msg);
    }

    /**
     * Gửi rate và review sân lên sever
     * @param {Object} msg
     * @property {number} rate
     * @property {string} content 
     */
    sendReviewData(msg) {
        let url = this.getConfig().getBaseUrl() + ApiService.facility_rate();
        let self = this;
        let formData = {
            "rate": msg.rate,
            "facility_id": this.id,
            "text_rate": msg.content
        }
        this.Logger().log('............ formData rate : ', formData);
        Networking.httpRequestPost(url, (jsonData) => {
            console.log('.................... post rate : ', jsonData);
            if (jsonData.hasOwnProperty('error_code')) {
                let error_code = parseInt(jsonData['error_code']);
                if (error_code === 0) {
                    self.showInfoMsg(jsonData.error_msg);
                } else {
                    self.showErrorMsg(jsonData.error_msg);
                }
            }
        }, formData, () => {

        });
    }

    onMapDirectionPress() {
        let latitude = this.getUserInfo().getLatitude();
        let longitude = this.getUserInfo().getLongitude();
        if (latitude && longitude) {
            this.requestDirection(latitude, longitude);
        } else {
            this._getLocationAsync();
        }
    }

    requestDirection(latitude, longitude) {
        console.log('requestDirection', latitude, longitude, this.courseLat, this.courseLong);
        openMap({ latitude: this.courseLat, longitude: this.courseLong });
    }

    _getLocationAsync = async () => {
        try {
            let { status } = await Permissions.askAsync(Permissions.LOCATION);
            if (status !== 'granted') {
                console.log('errorMessage', 'Permission to access location was denied');
            } else {
                console.log('Permission.accepted');

                Location.getCurrentPositionAsync({}, (location) => {
                    if (location.coords && location.coords.latitude && location.coords.longitude) {
                        // UserInfo.setLatitude(location.coords.latitude);
                        // UserInfo.setLongitude(location.coords.longitude);
                        // console.log('latitude', UserInfo.getLatitude(), 'longitude', UserInfo.getLongitude());
                        this.requestDirection(location.coords.latitude, location.coords.longitude);
                    }
                }, (errorCallback) => {
                    if (errorCallback && errorCallback.code === 2) {
                        Alert.alert(
                            this.t('gps_off'),
                            this.t('gps_for_app'),
                            [
                                { text: this.t('cancel'), onPress: () => { }, style: 'cancel' },
                                {
                                    text: this.t('ok'), onPress: () => {
                                        if (Platform.OS === 'ios') {
                                            Linking.openURL('app-settings:');
                                        } else {
                                            IntentActivityAndroid.startActivityAsync(IntentActivityAndroid.ACTION_LOCATION_SOURCE_SETTINGS);
                                        }
                                    }
                                }
                            ],
                            {
                                cancelable: true
                            }
                        );
                    }
                });

            }
        } catch (error) {
            console.log(error);
        }
    };

    render() {
        return (
            // <KeyboardAvoidingView style={styles.container}
            //     behavior="padding"
            //     enabled>
                <View style={[styles.container, this.isIphoneX? {paddingBottom: 15} : {}]}>
                    {/* <HeaderView ref={(headerView) => { this.headerView = headerView; }} /> */}
                    <HeaderView
                        title={this.title}
                        handleBackPress={this.onBackPress}
                        iconMenu={this.getResources().ic_map_header}
                        iconMenuStyle={styles.icon_menu}
                        onIconMenuClick={this.onMapDirectionPress} />
                    <ScrollView style={{ flex: 1 }}>
                        <ReviewCourseVideo
                            ref={(refReviewCourseVideo) => { this.refReviewCourseVideo = refReviewCourseVideo; }} />
                        <NewsFocusView
                            ref={(refNewsFocusView) => { this.refNewsFocusView = refNewsFocusView; }}
                            title={this.t('photo')} />
                        <DescriptionView ref={(refDescription) => { this.refDescription = refDescription; }} />

                        <ReviewView ref={(reviewView) => { this.reviewView = reviewView; }}
                            writeReviewClick={this.onWriteReviewClick} />
                        {this.renderInternalLoading()}
                    </ScrollView>

                    <PopupReviewFacilityView ref={(popupReviewFacility) => { this.popupReviewFacility = popupReviewFacility; }}
                        onConfirmClick={this.sendReviewMsg} />
                    {this.renderMessageBar()}
                </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white'
    },
    icon_menu: {
        width: scale(20),
        height: scale(20),
        resizeMode: 'contain'
    }
});