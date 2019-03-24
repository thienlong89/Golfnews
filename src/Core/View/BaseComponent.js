/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
    View,
    StyleSheet,
    BackHandler,
    ToastAndroid,
    NetInfo,
    Dimensions,
    Alert,
    Platform
} from 'react-native';
import I18n from 'react-native-i18n';
import Config from '../../Config/Config';
import utils from '../../Utils';
import userInfo from '../../Config/UserInfo';
import LoadingView from '../Common/LoadingView';

import {
    Notifications,
    Constants,
    Expo,
    SQLite
} from '../../Core/Common/ExpoUtils';
var MessageBarAlert = require('react-native-message-bar').MessageBar;
var MessageBarManager = require('react-native-message-bar').MessageBarManager;
// var Analytics = require('react-native-firebase-analytics');

import Files from '../../Components/Common/Files';
import AppUtil from '../../Config/AppUtil';
import DataManager from '../Manager/DataManager';
import PropsStatic from '../../Constant/PropsStatic';
// import Constant from '../../Constant/Constant';

import Debug from '../Debug/Logger';
// const FBSDK = require('react-native-fbsdk');
// const {
//   AppEventsLogger
// } = FBSDK;

// const TAG = "[Vhandicap-v1] BaseComponent : ";
String.prototype.format = function () {
    var formatted = this;
    for (var i = 0; i < arguments.length; i++) {
        var regexp = new RegExp('\\{' + i + '\\}', 'gi');
        formatted = formatted.replace(regexp, arguments[i]);
    }
    return formatted;
};

const DURATION_DISMISS = 3000;

const alertType = {
    success: "success",
    error: 'error',
    warning: 'warning',
    extra: 'extra',
    custom: 'custom'
};
//Thời gian được tính cho 1 double click tinh bang milisecond
const DOUBLE_CLICK_TIME = 3000;

const configGesture = {
    velocityThreshold: 0.3,
    directionalOffsetThreshold: 40
};

// const db = SQLite.openDatabase('VHandicap');
import {scale, verticalScale, moderateScale} from '../../Config/RatioScale';

//console.log("width : =========================== ",width,height,fontSize);

const COLOR_STATUS = ['#555555', '#00ABA7', '#D1403F', '#005B59'];
const TIME_OUT_FOR_REQUEST = 30000;//30 giây

const HOME_PAGE_TITLE_PADDING_TOP = verticalScale(170);
const HOME_PAGE_SCROLL_PADDING_TOP = verticalScale(205);

export default class BaseComponent extends Component {
    constructor(props) {
        super(props);
        this.Mxpo = Expo;
        this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
        this.startTime = 0;
        this.model = null;
        // this.Analytics = Analytics;
        // I18n.changeLanguage(this.getUserInfo().getLang());

        this.timeAnimationFadeIn = 700;
        this.home_page_title_padding_top = HOME_PAGE_TITLE_PADDING_TOP;
        this.home_page_scroll_padding_top = HOME_PAGE_SCROLL_PADDING_TOP;
    }

    Logger(){
        return Debug;
    }

    getRatioAspect(){
        return {scale, verticalScale, moderateScale};
    }

    t(text) {
        return I18n.t(text);
    }
    // logEvent
    // firebaseAsetUserId(userid){
    //     Analytics.setUserId(''+userid);

    // Analytics.setUserId('1231231231');
    //      Analytics.setUserProperty('propertyName', 'propertyValue');

    //      Analytics.logEvent('view_home', {
    //        'item_id': 'login'
    //      });
    // }

    rotateToLandscape() {
        this.Mxpo.ScreenOrientation.allow(this.Mxpo.ScreenOrientation.Orientation.LANDSCAPE);
    }

    rotateToPortrait() {
        this.Mxpo.ScreenOrientation.allow(this.Mxpo.ScreenOrientation.Orientation.PORTRAIT);
    }

    // setLanguage(lang) {
    //     console.log("setLanguage click", lang);
    //     I18n.changeLanguage(lang);
    //     //this.setState({});
    //     DataManager.saveSingleLocalData(Constant.LANGUAGE, lang, (error) => {
    //     });
    // }

    getGestureConfig() {
        return configGesture;
    }

    getDatabase() {
        // return db;
    }

    getAppEventsLogger() {
        return AppEventsLogger;
    }

    clearGlobal() {
        global.count_friends = '0';
        global.count_news = 0;
        global.home_list_friend_flight_logout = true;
        global.home_list_history_flight_logout = true;
        global.list_notify_id_readed = [];
    }

    loginOtherDevice(navigation) {
        this.getUserInfo().clearProfile();
        DataManager.clear();
        this.clearGlobal();
        navigation.replace('login_screen', { login_other_device: true });
    }

    /**
     * Xóa event back trong android, gọi khi thoat app
     */
    removeEventBack() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
    }

    /**
     * Đăng ký sự kiện nhấn nut back trong android
     */
    addEventBack() {
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
    }

    showToastAndroid(msg) {
        //ToastAndroid.show(msg, ToastAndroid.LONG);
        ToastAndroid.showWithGravity(
            msg,
            ToastAndroid.SHORT,
            ToastAndroid.BOTTOM
        );
    }

    /**
    * Xu ly button back
    */
    handleBackButtonClick() {
        console.log("click lan nua de thoat app!!");
        if (this.startTime === 0) {
            this.startTime = (new Date()).getTime();
            this.showToastAndroid(this.t('toast_back'));
        } else {
            let endTime = (new Date()).getTime();
            if (endTime - this.startTime <= DOUBLE_CLICK_TIME) {
                //doule click
                this.removeEventBack();
                BackHandler.exitApp();
            } else {
                //refesh lai data
                this.startTime = (new Date()).getTime();
                this.showToastAndroid(this.t('toast_back'));
            }
        }
        return true;
    }

    /**
     * Add event handler kết nối mạng
     */
    addEventInternetConnection() {
        NetInfo.addEventListener('connectionChange', this.onConnectionChange.bind(this));
    }

    /**
     * remove event handler kết nối mạng
     */
    removeEventInternetConenction() {
        NetInfo.removeEventListener('connectionChange', this.onConnectionChange.bind(this));
    }

    /**
     * handler tín hiệu mạng
     * @param {*} connectionType 
     */
    onConnectionChange(connectionType) {
        console.log("connectTion Tyle ", connectionType);
        NetInfo.isConnected.fetch().then(isConnected => {
            if (!isConnected) {
                Alert.alert(
                    this.t('thong_bao'),
                    this.t('network_connection_error'),
                    [
                        { text: this.t('ok'), onPress: () => BackHandler.exitApp() },
                    ],
                    { cancelable: false }
                )
            } else {
                // DataManager.loadLocalData(KEYS, this.onLoadLocalComplete.bind(this));
            }
        });
        // if (connectionType === 'none' && connectionType === 'unknown') {
        //     Alert.alert(
        //         this.t('thong_bao'),
        //         this.t('network_connection_error'),
        //         [
        //             { text: this.t('ok'), onPress: () => BackHandler.exitApp() },
        //         ],
        //         { cancelable: false }
        //     )
        // }
    }

    /**
     * trả về tài nguyên của app - default là chỉ có images
     */
    getResources() {
        return Files.sprites;
    }

    getResourceGolfnews(){
        return Files.golfnews;
    }

    getResourcesIconChat(){
        return Files.icon_chat;
    }

    getResourcesIconChatView(){
        return Files.icon_chat_view;
    }

    /**
     * Handler mã lỗi server trả về
     * @param {*} error_code 
     * @param {*} error_msg 
     */
    onCheckErrorCode(error_code, error_msg) {
        this.Logger().log("error code tra ve la : ", error_code);
        if (error_code === 2) {
            let _navigation = PropsStatic.getNavigator();
            if (_navigation) {
                this.Logger().log("props static not null");
                this.loginOtherDevice(_navigation);
                return;
            }
            //thoat ra man hinh login
            let { screenProps } = this.props;
            // console.log("screenProps : ",screenProps);
            if (screenProps) {
                let { grandparentNavigation } = screenProps;
                this.Logger().log("grandparentNavigation baseComponent1 : ", grandparentNavigation);
                if (grandparentNavigation) {
                    this.loginOtherDevice(grandparentNavigation);
                    return;
                }
            }
            let { grandparentNavigation } = this.props;
            this.Logger().log("grandparentNavigation baseComponent2 : ", grandparentNavigation);
            if (grandparentNavigation) {
                this.loginOtherDevice(grandparentNavigation);
                return;
            }
        } else if (error_code === 1) {
            if (this.refs.alert) {
                this.showErrorMsg(error_msg);
            }
        }
    }

    getConfig() {
        return Config;
    }

    getUtils() {
        return utils;
    }

    getUserInfo() {
        return userInfo;
    }

    getAppUtil() {
        return AppUtil;
    }

    getColorStatus() {
        return COLOR_STATUS;
    }

    getResourceStatus(){
        return [this.getResources().ic_like, this.getResources().ic_like, this.getResources().ic_heart, this.getResources().ic_dislike];
    }

    getTxtStatus(){
        return [this.t('like'), this.t('like'), this.t('love'), this.t('dislike')];
    }

    getStateFriend(isFriend, is_waiting_friend_request) {
        // console.log("trang thai ket ban ======================= : ",isFriend,is_waiting_friend_request);
        if (isFriend) {
            return this.t('is_friend');
        } else if (is_waiting_friend_request) {
            return this.t('is_waiting_friend_request');
        }
        return this.t('add_friend');
    }

    /**
     * Hiển thị loading internal có check timeout
     */
    showInternalLoading(){
        if(!this.internalLoading) return;
        this.internalLoading.showLoading();
        this.setInternalTimeOut();
    }

    /**
     * Ẩn hiển thị loading internal tắt cả timeout
     */
    hideInternalLoading(){
        if(!this.internalLoading) return;
        this.internalLoading.hideLoading();
        if (this.intervalId) {
            clearInterval(this.intervalId);
        }
    }

    /**
     * Hàm set thời gian timeout của một request lên sever
     * @param {number} time - thời gian timeout
     * @default {TIME_OUT_FOR_REQUEST}
     */
    setInternalTimeOut(time = TIME_OUT_FOR_REQUEST) {
        this.intervalId = setInterval(() => {
            if (this.internalLoading) {
                this.internalLoading.hideLoading();
            }
            clearInterval(this.intervalId);
        }, time);
    }

    renderInternalLoading() {
        return (
            <LoadingView ref={(internalLoading) => { this.internalLoading = internalLoading; }}
                isShowOverlay={false} />
        )
    }

    renderMessageBar() {
        return (
            <MessageBarAlert ref="alert" />
        );
    }

    registerNotification() {
        // Notifications.addListener((notification) => {
        //     console.log('Notifications', notification);
        //     this.showInfoMsg(notification.data.title, notification.data.body);
        // });
    }

    registerMessageBar() {
        if (MessageBarManager)
            MessageBarManager.registerMessageBar(this.refs.alert);
    }

    unregisterMessageBar() {
        if (MessageBarManager)
            MessageBarManager.unregisterMessageBar();
    }

    getMessageBar() {
        return MessageBarManager;
    }

    showMessageBar(alertType = 'info',
        content = '',
        onTapped = null,
        style = null,
        position = 'bottom',
        animationType = 'SlideFromBottom',
        onShow = null,
        onHide = null,
        messageStyle = null,
        title = '',
        titleStyle = null) {

        titleStyle = titleStyle ? titleStyle : { color: '#FFFFFF', fontSize: 18, fontWeight: 'bold' };
        if (MessageBarManager) {
            let option = {
                title: title,
                message: content,
                alertType: alertType,
                animationType: animationType,
                position: position,
                duration: parseInt(DURATION_DISMISS),
                onTapped: onTapped,
                onShow: onShow,
                onHide: onHide,
                stylesheetInfo: style, // Default are blue colors
                stylesheetSuccess: style, // Default are Green colors
                stylesheetWarning: style, // Default are orange colors
                stylesheetError: style, // Default are red colors
                stylesheetExtra: style, // Default are blue colors, same as info
                messageStyle: { color: '#FFFFFF', fontSize: 15, paddingTop: 5, paddingBottom: 5 },
                titleStyle: titleStyle,
                messageNumberOfLines: 5
            }
            MessageBarManager.showAlert(option);
        } else {
            console.log('MessageBarManager error');
        }
    }

    hideMessageBar() {
        if (MessageBarManager)
            MessageBarManager.hideAlert();
    }

    showErrorMsg(error_msg = '', onTapped = null) {
        this.showMessageBar(global.alertType.error, error_msg, onTapped);
    }

    showSuccessMsg(msg = '', onTapped = null) {
        this.showMessageBar(global.alertType.success, msg, onTapped);
    }

    showWarningMsg(msg = '', onTapped = null) {
        this.showMessageBar(global.alertType.warning, msg, onTapped);
    }

    showInfoMsg(title = '', msg = '', onTapped = null) {
        this.showMessageBar(global.alertType.info, msg, onTapped, null, 'top', 'SlideFromTop',
            null, null, null, title, { color: '#FFFFFF', fontSize: 18, fontWeight: 'bold', paddingTop: Constants.statusBarHeight });
    }
}
