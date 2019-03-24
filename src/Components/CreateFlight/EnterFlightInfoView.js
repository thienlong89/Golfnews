import React from 'react';
import { Platform, StyleSheet, Text, View, Image, TouchableOpacity, ScrollView, AsyncStorage, Modal, Dimensions, BackHandler } from 'react-native';
import Touchable from 'react-native-platform-touchable';
import BaseComponent from '../../Core/View/BaseComponent';
import styles from '../../Styles/CreateFlight/StyleEnterFLightInfo';
import HeaderView from '../HeaderView';
import MyView from '../../Core/View/MyView';
import DatePicker from 'react-native-datepicker';
import FriendItem from '../Friends/Items/FriendItem';
// import PopupDialog, { SlideAnimation } from 'react-native-popup-dialog';
import Networking from '../../Networking/Networking';
import ApiService from '../../Networking/ApiService';
import ListPathModel from '../../Model/CreateFlight/ListPathModel';
import PopupNotifyView from '../Common/PopupNotifyView';
import moment from 'moment';
import FlightDetailModel from '../../Model/CreateFlight/Flight/FlightDetailModel';
import HandicapFacilityModel from '../../Model/Facility/HandicapFacilityModel';
import DataManager from '../../Core/Manager/DataManager';
import Constant from '../../Constant/Constant';
import BtnStartCreateFlight from './Items/BtnStartCreateFlight';
import { Constants } from '../../Core/Common/ExpoUtils';
import Tips from 'react-native-tips';
import WeatherInfoView from '../Common/WeatherInfoView';
import { scale, verticalScale, fontSize } from '../../Config/RatioScale';
import TeeViewHorizontal from '../Common/TeeViewHorizontal';
import PopupUpgradeVip from '../Common/PopupUpgradeVip';
import HideFlightSetting from './Items/HideFlightSetting';
import CoursePathSelectView from './Items/CoursePathSelectView';
import PlayersFlightView from './Items/PlayersFlightView';
// let { width, height } = Dimensions.get('window');

const TIME_FORMAT = 'HH:mm, DD/MM/YYYY';

// const tips = ['datetime', 'course', 'tee', 'addplayer', 'final'];

// const screenWidth = Dimensions.get('window').width;

export default class EnterFlightInfoView extends BaseComponent {

    constructor(props) {
        super(props);
        this.isIphoneX = this.getAppUtil().isIphoneX();
        const timestamp = Date.now();
        let minDate = new Date(timestamp - 3 * 24 * 60 * 60 * 1000);
        let maxDate = new Date(timestamp);
        this.strMinDate = `00:00, ${minDate.getDate()}/${minDate.getMonth() + 1}/${minDate.getFullYear()}`;
        this.strMaxDate = `${maxDate.getHours()}:${maxDate.getMinutes()}, ${maxDate.getDate()}/${maxDate.getMonth() + 1}/${maxDate.getFullYear()}`;

        this.offsetTop = Platform.OS === 'ios' ? 0 : Constants.statusBarHeight;

        DataManager.loadLocalData([Constant.USER.INPUT_SCORE_TYPE], this.onLoadLocalComplete.bind(this));
        this.userProfile = this.getUserInfo().getUserProfile();
        this.uid = this.userProfile.getId()
        this.listPathModel = null;
        this.path1_selected = null;
        this.path2_selected = null;
        this.path3_selected = null;
        this.course_selected = null;
        this.teeListAvailable = [];
        this.tipPosition = -1;
        this.tutOffset = this.isIphoneX ? 24 : 0;
        this.user_ids = [this.uid];
        this.holeType = 1;
        this.isHideFlight = false;
        //refresh teeObject trong profile
        this.userProfile ? this.userProfile.teeObject = { tee: this.userProfile.getDefaultTeeID(), color: this.userProfile.getDefaultTeeID() } : '';
        this.playerList = [this.userProfile];
        this.teeColor = this.userProfile ? this.userProfile.getDefaultTeeID() : '';
        this.isLayoutChanged = false;
        this.state = {
            tipsVisible: -1,
            facilityModel: this.props.navigation.state.params != null ? this.props.navigation.state.params.Facility : '',

            group_display: 0,
            isHideTeeList: false,
            date_time: '',
            isHideUpgrade: true,
            isHideUpgradeClick: true,

            isSkip: false,
            teeGroupPosition: 0,
            addPlayerBtnPosition: 0,
            startBtnPosition: 0
        }

        this.onCourseCallback = this.onCourseCallback.bind(this);

        this.onDateChange = this.onDateChange.bind(this);
        this.onOpenDatePicker = this.onOpenDatePicker.bind(this);
        this.onConfirmAddDateClick = this.onConfirmAddDateClick.bind(this);
        this.onBackPress = this.onBackPress.bind(this);
        this.onStartUploadFlightImage = this.onStartUploadFlightImage.bind(this);
        this.onSwipeLeftToEnter = this.onSwipeLeftToEnter.bind(this);
        this.onSwipeRightToUpload = this.onSwipeRightToUpload.bind(this);
        this.onStartCreateFlight = this.onStartCreateFlight.bind(this);
        this.onConfirmUpgrade = this.onConfirmUpgrade.bind(this);
        this.requestUpgrade = this.requestUpgrade.bind(this);
        this.onPlayerChangeCallback = this.onPlayerChangeCallback.bind(this);
        this.onHideFlightCallback = this.onHideFlightCallback.bind(this);
    }

    renderDateTime(date_time, facilityModel) {
        return (
            <View style={[styles.flight_time_group, styles.border_shadow]}>
                <Image
                    style={styles.img_calendar}
                    source={this.getResources().ic_calender} />

                <DatePicker
                    ref={(datePicker) => { this.datePicker = datePicker; }}
                    style={styles.datepicker}
                    mode='datetime'
                    allowFontScaling={global.isScaleFont}
                    date={date_time}
                    placeholder={this.t('enter_play_time')}
                    format={TIME_FORMAT}
                    minDate={`${this.strMinDate}`}
                    maxDate={`${this.strMaxDate}`}
                    confirmBtnText={this.t('agree')}
                    cancelBtnText={this.t('cancel')}
                    androidMode='spinner'
                    showIcon={false}
                    // iconSource={this.getResources().ic_calender}
                    customStyles={{
                        dateInput: {
                            borderWidth: 0,
                            justifyContent: 'flex-start',
                            flexDirection: 'row',
                        },
                        placeholderText: {
                            fontSize: fontSize(16),
                            color: '#FF0000',
                        },
                        dateText: {
                            fontSize: fontSize(16),
                            color: '#979797',
                            fontWeight: 'bold'
                        },
                    }}
                    onDateChange={this.onDateChange}
                    onOpenModal={this.onOpenDatePicker}
                />

                <WeatherInfoView
                    ref={(weatherInfoView) => { this.weatherInfoView = weatherInfoView; }}
                    hide={true}
                    facilityId={facilityModel.getId()}
                />
            </View>
        )
    }

    render() {
        let {
            date_time,
            facilityModel,
        } = this.state;

        return (
            <View style={styles.container}>
                {this.renderLoading()}
                <PopupNotifyView
                    ref={(popupDialog) => { this.popupDialog = popupDialog; }}
                    content={this.t('require_enter_flight_time')}
                    confirmText={this.t('agree')}
                    onConfirmClick={this.onConfirmAddDateClick} />

                <HeaderView
                    title={this.state.facilityModel.getSubTitle()}
                    handleBackPress={this.onBackPress}
                />

                <ScrollView
                    ref={(scrollView) => { this.scrollView = scrollView; }}
                    style={{ flex: 1 }}
                    onContentSizeChange={(contentWidth, contentHeight) => {
                        if (this.isLayoutChanged) {
                            this.scrollView.scrollToEnd({ animated: true });
                        }
                        this.isLayoutChanged = false;

                    }}>

                    {/* Date time group */}
                    {this.renderDateTime(date_time, facilityModel)}

                    {/* <HideFlightSetting
                        isHideFlight={this.onHideFlightCallback} /> */}

                    {/* Course group */}
                    <View style={[styles.border_shadow]}>
                        <CoursePathSelectView
                            facilityModel={facilityModel}
                            onCourseCallback={this.onCourseCallback}
                            teeColor={this.teeColor}
                        />
                    </View>
                    {/* End Course group */}

                    <View style={[styles.border_shadow]}>
                        <PlayersFlightView
                            ref={(refPlayersFlightView) => { this.refPlayersFlightView = refPlayersFlightView; }}
                            navigation={this.props.navigation}
                            playerList={this.playerList}
                            teeColor={this.teeColor}
                            user_ids={this.user_ids}
                            onPlayerChange={this.onPlayerChangeCallback} />
                    </View>
                    {/* End player group */}

                </ScrollView>

                {/* nut bat dau */}
                <BtnStartCreateFlight
                    ref={(btnStartCreateFlight) => { this.btnStartCreateFlight = btnStartCreateFlight; }}
                    userProfile={this.userProfile}
                    onStartUploadFlightImage={this.onStartUploadFlightImage}
                    onSwipeLeftToEnter={this.onSwipeLeftToEnter}
                    onSwipeRightToUpload={this.onSwipeRightToUpload}
                    onStartCreateFlight={this.onStartCreateFlight}
                    requestUpgrade={this.requestUpgrade}
                    defaultIndex={this.userProfile.getAllow_using_scorecard_image() != 1 ? 1 : 0}
                />

                {this.renderMessageBar()}

                <PopupUpgradeVip
                    ref={(popupUpdateVip) => { this.popupUpdateVip = popupUpdateVip; }}
                    onConfirmClick={this.onConfirmUpgrade} />
            </View>
        );
    }

    onBackPress() {
        if (this.props.navigation != null) {
            this.props.navigation.goBack();
        }
        return true;
    }

    componentDidMount() {
        this.rotateToPortrait();
        this.registerMessageBar();
        this.handleHardwareBackPress();
    }

    componentWillUnmount() {
        this.unregisterMessageBar();
        if (this.backHandler) {
            this.backHandler.remove();
        }
    }

    handleHardwareBackPress() {
        let self = this;
        this.backHandler = BackHandler.addEventListener('hardwareBackPress', function () {
            self.onBackPress();
            return true;
        });
    }

    onIconMapClick() {
        this.props.navigation.navigate('golf_course_map', { 'facilityModel': this.state.facilityModel })
    }

    onDateChange(date) {
        this.setState({ date_time: date });
        let time = moment(date, 'HH:mm, DD/MM/YYYY');
        let timestamp = (new Date(time)).getTime();
        this.weatherInfoView.setDateTime(timestamp);
    }

    onOpenDatePicker() {
        console.log('onOpenDatePicker')
        if (Platform.OS === 'ios' && this.state.tipsVisible != -1) {
            this.setState({
                tipsVisible: -1
            }, () => this.datePicker.onPressDate());
        }

    }

    onLoadLocalComplete(err, result) {
        // console.log('onLoadLocalComplete', result);
        let key = result[0][0];
        if (key === Constant.USER.INPUT_SCORE_TYPE) {
            // console.log('onLoadLocalComplete', result[0][1]);
            if (result[0][1] === '0') {
                this.setState({ isEnterScore: true });
            } else {
                this.setState({ isEnterScore: false });
            }

        }
    }

    requestUpgrade() {
        this.popupUpdateVip.show();
    }

    onConfirmUpgrade() {
        // if (this.props.navigation.state.params.onStartTutorialUpgrade) {
        //     this.props.navigation.state.params.onStartTutorialUpgrade();
        // }
        // this.props.navigation.goBack();
        // this.props.navigation.replace('persional_information', { "puid": this.uid });
        if (this.props.navigation) {
            this.props.navigation.navigate('benefits_vip_member',
                {
                    onUpgradeCallback: this.onUpgradeSuccess.bind(this),
                });
        }
    }

    onUpgradeSuccess(isVipAccount){
        this.setState({})
    }

    onSaveInputScoreType(type = 0) {
        DataManager.saveLocalData([[Constant.USER.INPUT_SCORE_TYPE, type.toString()]], (error) => console.log('saveLocalData', error));
    }

    onSwipeLeftToEnter(gestureState) {
        this.onSaveInputScoreType(0);
    }

    onSwipeRightToUpload(gestureState) {
        this.onSaveInputScoreType(1);
        // this.onStartUploadFlightImage();
    }

    onCourseCallback(select_type, teeListAvailable, course_selected, path1_selected, path2_selected, path3_selected, listPathModel, listPath, holeType) {

        if (select_type == 1 || holeType === 1 && path1_selected && path2_selected
            || holeType === 2 && path1_selected
            || holeType === 3 && path1_selected && path2_selected && path3_selected) {
            this.btnStartCreateFlight.onChangeState(false);
        } else {
            this.btnStartCreateFlight.onChangeState(true);
        }
        console.log('onCourseCallback', JSON.stringify(listPathModel))
        this.teeListAvailable = teeListAvailable;
        this.course_selected = course_selected;
        this.path1_selected = path1_selected;
        this.path2_selected = path2_selected;
        this.path3_selected = path3_selected;
        this.listPathModel = listPathModel;
        this.holeType = holeType;
        if (teeListAvailable && course_selected) {
            this.refPlayersFlightView.setData(teeListAvailable, course_selected, select_type, this.path1_selected, this.path2_selected, this.path3_selected);
        }
        this.isLayoutChanged = true;
    }

    onConfirmAddDateClick() {
        this.popupDialog.dismiss();
        this.datePicker.onPressDate();
    }

    onPlayerChangeCallback(playerList) {
        this.playerList = playerList;
        this.isLayoutChanged = true;
    }

    onHideFlightCallback(isHideFlight) {
        console.log('onHideFlightCallback', isHideFlight);
        this.isHideFlight = isHideFlight;
    }

    checkTeeValid() {
        let player = this.playerList.find((player, index) => {
            let checkTee = this.teeListAvailable.find((teeObj, index) => {
                return teeObj.tee.toLowerCase() === player.teeObject.tee.toLowerCase()
            })
            
            return checkTee === null || typeof checkTee === 'undefined'
        })
        if(player){
            this.showErrorMsg(this.t('player_tee_invalid').format(player.teeObject.tee, player.fullname));
            return false;
        }
        return true;
    }

    /**
     * Create flight by image
     */
    onStartUploadFlightImage() {
        let {
            date_time,
            facilityModel
        } = this.state;

        if (date_time != null && date_time != '') {
            if (this.checkTeeValid()) {
                let time = moment(date_time, 'HH:mm, DD/MM/YYYY');
                let timestamp = (new Date(time)).getTime();

                let players = this.playerList.map((player, index) => {
                    return index === 0 ? {
                        "user_id": player.getId(),
                        "tee_id": player.teeObject.tee.toLowerCase()
                    } : {
                            "user_id": player.id,
                            "tee_id": player.teeObject.tee.toLowerCase()
                        }
                });

                let formData = {
                    "path1": this.path1_selected,
                    "path2": this.path2_selected,
                    "path3": this.path3_selected,
                    "players": players,
                    "teetime": timestamp,
                    "is_hide_this_flight": this.isHideFlight ? 1 : 0,
                    "type": this.holeType
                };

                this.props.navigation.navigate('upload_flight_image', { 'Facility': facilityModel, 'FromData': formData });
            }

        } else {
            this.popupDialog.show();
        }
    }

    /**
     * 
     * @param {*} suggestType 0: tao tran luon; 1: lay goi y gop tran
     */
    onStartCreateFlight(suggestType) {

        let {
            date_time,
        } = this.state;

        if (date_time != null && date_time != '') {
            if (this.checkTeeValid()) {
                let self = this;
                this.loading.showLoading();
                let time = moment(date_time, 'HH:mm, DD/MM/YYYY');
                let timestamp = (new Date(time)).getTime();

                let players = this.playerList.map((player, index) => {
                    return index === 0 ? {
                        "user_id": player.getId(),
                        "tee_id": player.teeObject.tee.toLowerCase()
                    } : {
                            "user_id": player.id,
                            "tee_id": player.teeObject.tee.toLowerCase()
                        }
                });

                let url = this.getConfig().getBaseUrl() + ApiService.create_flight(suggestType, this.holeType);
                console.log("url : ", url);
                let formData = {
                    "path1": this.path1_selected,
                    "path2": this.path2_selected,
                    "path3": this.path3_selected,
                    "players": players,
                    "teetime": timestamp,
                    "is_hide_this_flight": this.isHideFlight ? 1 : 0
                };
                console.log('formData', JSON.stringify(formData));
                Networking.httpRequestPost(url, this.onCreateFlightResponse.bind(this), formData, () => {
                    //time out
                    self.loading.hideLoading();
                    self.showErrorMsg(self.t('time_out'))
                });
            }

        } else {
            this.popupDialog.show();
        }
    }

    onCreateFlightResponse(jsonData) {
        // console.log('onCreateFlightResponse', JSON.stringify(jsonData));
        this.loading.hideLoading();

        this.model = new FlightDetailModel();
        this.model.parseData(jsonData);
        if (this.model.getErrorCode() === 0) {
            if (this.model.getSimilarFlights().length > 0) {
                // goi y merge tran
                this.props.navigation.navigate('flight_suggested_view', {
                    onFLightSuggestSelected: this.onFLightSuggestSelected.bind(this),
                    'FLightSuggested': this.model.getSimilarFlights(),
                    "Date": this.model.getSimilarText()
                });
            } else {
                // tao tran luon
                this.model.setFlightPath(this.listPathModel);
                this.props.navigation.navigate('enter_flight_score_view',
                    {
                        'FlightDetailModel': this.model,
                        'isHostUser': true,
                        'isJustCreated': true
                    });
                // this.saveFlightLocal(this.model.getFlight());
            }
        } else {
            console.log('showErrorMsg1')
            this.showErrorMsg(jsonData['error_msg']);
        }
    }

    onFLightSuggestSelected(flight) {
        if (flight) {
            this.requestMergeFlight(flight);
        } else {
            this.onStartCreateFlight(0);
        }
    }

    requestMergeFlight(flight) {
        this.loading.showLoading();
        let self = this;
        let players = this.playerList.map((player, index) => {
            return index === 0 ? {
                "user_id": player.getId(),
                "tee_id": player.teeObject.tee.toLowerCase()
            } : {
                    "user_id": player.id,
                    "tee_id": player.teeObject.tee.toLowerCase()
                }
        });

        let url = this.getConfig().getBaseUrl() + ApiService.merge_flight(flight.getId());
        console.log("url : ", url);
        let formData = {
            "players": players
        };
        // console.log('requestMergeFlight', JSON.stringify(formData));
        Networking.httpRequestPost(url, this.onMergeFlightResponse.bind(this), formData, () => {
            //time out
            self.loading.hideLoading();
            self.showErrorMsg(self.t('time_out'))
        });
    }

    onMergeFlightResponse(jsonData) {
        this.model = new FlightDetailModel();
        this.model.parseData(jsonData);
        if (this.model.getErrorCode() === 0) {
            this.model.setFlightPath(this.listPathModel);

            let userRounds = this.model.getFlight().getUserRounds();
            let user = userRounds.find((userRound) => {
                return this.getAppUtil().replaceUser(userRound.getUserId()) === this.getAppUtil().replaceUser(this.userProfile.getId());
            });
            setTimeout(() => {
                this.loading.hideLoading();
                if (user && user.getSubmitted() === 1) {
                    this.openScoreView(0, this, this.model);
                } else {
                    this.openScoreView(1, this, this.model);
                }
            }, 1000);
        } else {
            this.loading.hideLoading();
            this.showErrorMsg(jsonData['error_msg']);
        }
    }

    onCloseScorecardListener() {
        this.Mxpo.ScreenOrientation.allow(this.Mxpo.ScreenOrientation.Orientation.PORTRAIT);
    }

    openScoreView(type, self, FlightDetailModel) {
        let flight = FlightDetailModel.getFlight();
        let playerList = flight.getUserRounds();
        let indexMe = playerList.findIndex((user) => {
            return this.getAppUtil().replaceUser(user.getUserId()) === this.getAppUtil().replaceUser(self.uid);
        });
        let isHostUser = false;
        if (indexMe != -1) {
            playerList.splice(0, 0, ...playerList.splice(indexMe, 1));
            try {
                if (playerList.length > 0 && playerList[0].getSttUser() === 1) {
                    isHostUser = true;
                }
            } catch (error) {
                console.log('parseCourseData.isHostUser.error', error);
            }

        }

        if (type === 0) {
            self.props.navigation.replace('scorecard_view',
                {
                    onCloseScorecard: self.onCloseScorecardListener.bind(self),
                    'FlightDetailModel': FlightDetailModel,
                    'isHostUser': isHostUser
                });
        } else {
            self.props.navigation.replace('enter_flight_score_view',
                {
                    'FlightDetailModel': FlightDetailModel,
                    'isHostUser': isHostUser
                });
        }
    }
}