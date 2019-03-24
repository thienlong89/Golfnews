import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    Platform,
    Image,
    Dimensions,
    ScrollView,
    BackHandler
} from 'react-native';
import BaseComponent from '../../../../Core/View/BaseComponent';
import CountryDropdown from '../../../CreateFlight/Tab/Items/CountryDropdow';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import MyListView from '../../../Common/MyListView';
import ListCourseView from '../../../CreateFlight/Tab/Items/ListCourseView';
import ApiService from '../../../../Networking/ApiService';
import Networking from '../../../../Networking/Networking';
import FacilityListModel from '../../../../Model/Facility/FacilityListModel';
import FacilityReviewFocus from '../../../../Model/Facility/FacilityReviewFocus';
import { scale, verticalScale, fontSize } from '../../../../Config/RatioScale';
import SearchFacilityView from '../../../CreateFlight/Tab/Items/SearchFacilityView';
// import styles from '../../../../Styles/CreateFlight/StyleAllCourseTab';
import NoDataView from '../../../CreateFlight/Tab/Items/NoDataView';
import PropStatic from '../../../../Constant/PropsStatic';
import NewsFocusView from '../Items/NewsFocusView';
import EmptyDataView from '../../../../Core/Common/EmptyDataView';

const { width, height } = Dimensions.get('window');

export default class ReviewFacilityScreen extends BaseComponent {
    constructor(props) {
        super(props);

        this.searchList = [];
        this.listFacility = [];
        this.isSearching = false;
        this.state = {
            isState: false,
            imgReviewUrl: []
        }

        this.onChangeInputSearchFacility = this.onChangeInputSearchFacility.bind(this);
        // this.onCourseDropDownClick = this.onCourseDropDownClick.bind(this);
        this.onFacilityPress = this.onFacilityPress.bind(this);
        this.onSearchFacilityFocus = this.onSearchFacilityFocus.bind(this);
    }

    componentDidMount() {
        let { screenProps } = this.props;
        if (screenProps.parentEvent) {
            screenProps.parentEvent.onParentEvent = this.onBackCallback.bind(this);
            // screenProps.parentEvent.setSearchHeader();
        }

        this.requestFacilityReview();
    }

    onBackCallback() {
        this.isSearching = false;
        if (this.refNewsFocusView) {
            this.refNewsFocusView.setVisible(true);
        }
        if (this.refSearchFacilityView) {
            this.refSearchFacilityView.clearFocus();
        }
    }

    onSearchFacilityFocus() {
        this.isSearching = true;
        let { screenProps } = this.props;
        if (screenProps.callback) {
            screenProps.callback(true);
        }
        if (this.refNewsFocusView) {
            this.refNewsFocusView.setVisible(false);
        }
        // this.requestSearchFacility('');
    }

    onChangeInputSearchFacility(input) {
        this.requestSearchFacility(input);
    }

    requestSearchFacility(input) {
        let self = this;
        let url = this.getConfig().getBaseUrl() + ApiService.search_facility_review(input);
        console.log('url', url);
        Networking.httpRequestGet(url, (jsonData) => {
            self.model = new FacilityListModel();
            self.model.parseData(jsonData);
            if (self.model.getErrorCode() === 0) {
                self.courseList = self.model.getFacilityList();
                console.log('self.courseList.length', self.courseList.length)
                if (self.courseList.length > 0) {
                    self.refListCourseView.setFillData(self.courseList);
                    self.emptyDataView.hideEmptyView();
                } else if (input) {
                    self.refListCourseView.setFillData([]);
                    self.emptyDataView.showEmptyView();
                }

            } else {
                self.showErrorMsg(self.model.getErrorMsg());
            }
        }, (error) => {
            self.showErrorMsg(self.t('time_out'));
        });
    }

    onCourseItemClick(facilityCourseModel, itemId) {
        let navigation = PropStatic.getAppSceneNavigator();
        if (navigation) {
            navigation.navigate('review_facility', { id: facilityCourseModel.getId(), title: facilityCourseModel.getSubTitle() });
        }
    }

    requestFacilityReview() {
        let url = this.getConfig().getBaseUrl() + ApiService.facility_review_focus();
        this.Logger().log('url', url);
        this.internalLoading.showLoading();
        let self = this;
        Networking.httpRequestGet(url,
            (jsonData) => {
                try {
                    self.internalLoading.hideLoading();
                    self.model = new FacilityReviewFocus(self);
                    self.model.parseData(jsonData);
                    if (self.model.getErrorCode() === 0) {
                        self.listFacility = self.model.getFacilityList();
                        console.log('requestFacilityReview.urlList', self.listFacility.length);
                        if (self.listFacility.length > 0) {
                            self.refNewsFocusView.setFacilityList(self.listFacility);
                        }
                    } else {
                        self.showErrorMsg(self.model.getErrorMsg());
                    }
                } catch (error) {
                    console.log('requestFacilityReview', error);
                }
            }, () => {
                self.internalLoading.hideLoading();
                //self.popupTimeOut.showPopup();
            });
    }

    onFacilityPress(facilityObj) {
        let navigation = PropStatic.getAppSceneNavigator();
        if (navigation && facilityObj) {
            navigation.navigate('review_facility', { id: facilityObj.Facility.id, title: facilityObj.Facility.sub_title });
        }
    }

    render() {
        let { isState } = this.state;
        return (
            <View style={{ flex: 1, backgroundColor: 'white' }}>
                <View style={styles.big_line} />
                {/* <ScrollView
                    ref={(refScrollView) => { this.refScrollView = refScrollView }}> */}
                    <NewsFocusView
                        ref={(refNewsFocusView) => { this.refNewsFocusView = refNewsFocusView }}
                        isShowInfo={true}
                        onFacilityPress={this.onFacilityPress} />
                    {/* <Text allowFontScaling={global.isScaleFont} style={styles.txt_title}>{this.t('search_course').toUpperCase()}</Text>

                    <View style={styles.search_group}>
                        <SearchFacilityView ref={(refSearchFacilityView) => { this.refSearchFacilityView = refSearchFacilityView; }}
                            onChangeInputSearchFacility={this.onChangeInputSearchFacility}
                            onCourseDropDownClick={this.onCourseDropDownClick}
                            onSearchFacilityFocus={this.onSearchFacilityFocus}
                            isShow={true}
                        />
                        <ListCourseView ref={(refListCourseView) => { this.refListCourseView = refListCourseView; }}
                            style={styles.list_course}
                            onCourseItemClick={this.onCourseItemClick} />

                        <EmptyDataView ref={(emptyDataView) => { this.emptyDataView = emptyDataView; }} />
                    </View> */}
                {/* </ScrollView> */}

                {this.renderInternalLoading()}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    country: {
        backgroundColor: '#F5F5F5',
        borderColor: '#DBDBDB',
        flexDirection: 'row',
        borderWidth: (Platform.OS === 'ios') ? 1 : 0.5,
        borderRadius: 5,
        marginRight: scale(10),
        marginTop: verticalScale(10),
        marginLeft: scale(10),
        height: verticalScale(40)
    },

    search_group: {
        marginRight: scale(10),
        marginTop: verticalScale(15),
        marginLeft: scale(10),
        flex: 1,
        minHeight: 300
        //height: 40
    },

    list_course: {
        marginLeft: 0,//15,
        marginRight: 0,//15,
        marginTop: verticalScale(5),
    },
    txt_title: {
        fontSize: fontSize(17, scale(6)),
        color: '#424242',
        fontWeight: 'bold',
        marginLeft: scale(10),
        marginTop: scale(10)
    },
    img_course: {
        width: width - scale(20),
        height: width * 2 / 3,
        resizeMode: 'contain'
    },
    big_line: {
        color: '#DADADA',
        height: scale(5)
    }
});