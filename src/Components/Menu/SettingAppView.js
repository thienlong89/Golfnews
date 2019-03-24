/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    Dimensions,
    BackHandler,
    ScrollView
} from 'react-native';
import Touchable from 'react-native-platform-touchable';
import BaseComponent from '../../Core/View/BaseComponent';
import HeaderView from '../Common/HeaderView';
import MyView from '../../Core/View/MyView';
import ModalDropdown from 'react-native-modal-dropdown';
import styles from '../../Styles/Menu/StyleSettingView';
import ApiService from '../../Networking/ApiService';
import Networking from '../../Networking/Networking';
import MyTextInput from '../Common/MyTextInput';
import MyListView from '../Common/MyListView';

import { scale, verticalScale, moderateScale } from '../../Config/RatioScale';
import NoticeView from './Items/NoticeView';

import PropsStatic from '../../Constant/PropsStatic';
import TextCount from '../Facilities/Reviews/Items/TextCount';
import { language } from '../../../Language';

// const TAG = "[Vhandicap-v1] SettingAppView : ";
const screenWidth = Dimensions.get('window').width;
/**
 * receive_notification
 * Nhận thông báo = 1, không nhận = 0
 */
export default class SettingAppView extends BaseComponent {
    constructor(props) {
        super(props);
        //this.lang = 'vi';
        // this.tee = '';
        this.lang = this.findLanguage(this.getUserInfo().getLang());
        this.total_block = 0;
        this.isChangLang = false;
        this.backHandler = null;
        this.state = {
            off_notify: (this.getUserInfo().getUserProfile().receive_notification === 1) ? false : true,
            hide_flight: false,
            tee: this.getUserInfo().getTeeDefault(),
            //lang: this.findLanguage(this.getUserInfo().getLang()),
            isLoad: false,
            msg_block: this.t('have_block').format(0)
        }

        this.onNoticeFlight = this.onNoticeFlight.bind(this);
        this.onNotceFlightFromFriend = this.onNotceFlightFromFriend.bind(this);
        this.onAddBlockClick = this.onAddBlockClick.bind(this);
        this.onHideFlightAllUser = this.onHideFlightAllUser.bind(this);
        this.onNoticeFromComment = this.onNoticeFromComment.bind(this);
        this.onNoticeFromChat = this.onNoticeFromChat.bind(this);
        this.onBackClick = this.onBackClick.bind(this);

        this.hideDropdownLang = this.hideDropdownLang.bind(this);
    }

    componentDidMount() {
        this.headerView.setTitle(this.t('setting'));
        this.headerView.callbackBack = this.onBackClick;
        // this.myTextInputLang.focusCallback = this.onLangFocus.bind(this);
        // this.myTextInputLang.submitCallback = this.onLangSubmit.bind(this);
        // this.myTextInputLang.enable();

        // this.myListViewLang.itemClickCallback = this.onSelectedLanguage.bind(this);
        this.backHandler = BackHandler.addEventListener('hardwareBackPress', this.onBackClick);

        if (this.changeSettingFriendFlight) {
            let is_hide_noti_flight_friends = this.getUserInfo().getUserProfile().data.is_hide_noti_flight_friends;
            let isOn = is_hide_noti_flight_friends ? false : true;
            this.changeSettingFriendFlight.setChange(isOn);
        }
       
        if(this.changeSettingFlight){
            let is_hide_noti_flight = this.getUserInfo().getUserProfile().data.is_hide_noti_flight;
            let isOn = is_hide_noti_flight ? false : true;
            this.changeSettingFlight.setChange(isOn);
        }
        if (this.changeSettingFromComment) {
            let is_hide_noti_comment = this.getUserInfo().getUserProfile().data.is_hide_noti_comment;
            let isOn = is_hide_noti_comment ? false : true;
            this.changeSettingFromComment.setChange(isOn);
        }
        if (this.changeSettingHideFlightAllUser) {
            let is_hide_flight_all = this.getUserInfo().getUserProfile().data.is_hide_flight_all;
            let isOn = is_hide_flight_all ? false : true;
            this.changeSettingHideFlightAllUser.setChange(isOn);
        }

        this.sendRequestDefaultSetting();
        this.sendRequestTotalBlock();
    }

    componentWillUnmount() {
        if (this.backHandler) {
            this.backHandler.remove();
        }
    }

    // /**
    //  * focus textinput lang
    //  */
    // onLangFocus() {
    //    // this.myListViewLang.setFillData(global.default_languages);
    // }

    confirmLang() {
        this.setState({
            msg_block: this.t('have_block').format(this.total_block)
        });
        this.headerView.setTitle(this.t('setting'));
    }

    // /**
    //  * 
    //  */
    // onLangSubmit(text) {
    //     let arr_lang = global.default_languages.filter(d => d.name.toLowerCase().indexOf(text.trim().toLowerCase()) >= 0);
    //     console.log("arr_lang : ", arr_lang);
    //     this.myListViewLang.setFillData(arr_lang);
    // }

    /**
     * Gửi request lấy danh sach cacs tees va ngôn ngữ có sẵn trên sever
     */
    sendRequestDefaultSetting() {
        if (global.default_tees.length && global.default_languages.length) {
            //nếu đã lấy rồi thì thôi không load lại lần nữa
            return;
        }
        let url = this.getConfig().getBaseUrl() + ApiService.default_setting();
        console.log('..........................default url : ', url);
        this.loading.showLoading();
        let self = this;
        Networking.httpRequestGet(url, (jsonData) => {
            console.log("default data : ", jsonData);
            if (jsonData.hasOwnProperty('error_code')) {
                let error_code = parseInt(jsonData['error_code']);
                //console.log("error_code : ",error_code);
                if (error_code === 0) {
                    if (jsonData.hasOwnProperty('data')) {
                        let data = jsonData['data'];
                        //console.log("data : ", data);
                        if (data.hasOwnProperty('default_tees')) {
                            //lưu vào biến global
                            global.default_tees = data['default_tees'];
                        }
                        if (data.hasOwnProperty('default_languages')) {
                            global.default_languages = data['default_languages'];
                        }
                        if (data.hasOwnProperty('contacts')) {
                            let contacts = data['contacts'];
                            if (contacts.hasOwnProperty('email')) {
                                self.getConfig().email = contacts['email'];
                            }
                            if (contacts.hasOwnProperty('youtube')) {
                                self.getConfig().youtube_forum = contacts['youtube'];
                            }
                            if (contacts.hasOwnProperty('facebook')) {
                                self.getConfig().facebook_forum = contacts['facebook'];
                            }
                            if (contacts.hasOwnProperty('hotline')) {
                                self.getConfig().hotline = contacts['hotline'];
                            }
                            if (contacts.hasOwnProperty('website')) {
                                self.getConfig().website = contacts['website'];
                            }
                            if (contacts.hasOwnProperty('ott')) {
                                self.getConfig().ott = contacts['ott'];
                            }
                        }
                        //console.log("update tee : ",global.default_tees);
                    }
                    self.setState({
                        isLoad: true
                    });
                    // self.myTextInputLang.enable();
                } else if (error_code === 2) {
                    self.onCheckErrorCode(2, '');
                }
            }
            self.loading.hideLoading();
        }, () => {
            //time out
            self.loading.hideLoading();
            self.popupTimeOut.showPopup();
        });
    }

    /**
     * Update notification
     */
    sendUpdateProfile(formData, callback = null) {
        this.loading.showLoading('bat loading man hinh setting');
        let url = this.getConfig().getBaseUrl() + ApiService.user_update_profile();
        let self = this;
        Networking.httpRequestPost(url, (jsonData) => {
            console.log("update profile ", jsonData);
            if (callback) {
                callback(jsonData);
            }
            self.loading.hideLoading('tat loading man hinh setting');
        }, formData, () => {
            self.loading.hideLoading();
        });
    }

    /**
     * tắt bật chức năng nhận thông báo
     */
    onOnNotify() {
        this.setState({
            off_notify: !this.state.off_notify
        });
        console.log("on notify");
        let formData = {
            "receive_notification": this.state.off_notify ? 0 : 1
        }
        console.log('...................................... receive_notification : ', formData);
        let self = this;
        this.sendUpdateProfile(formData, () => {
            self.getUserInfo().getUserProfile().receive_notification = self.state.off_notify ? 0 : 1;
        });
    }

    /**
     * tắt bật chức năng ẩn/hiện flight
     */
    onHideFlight() {
        this.setState({
            hide_flight: !this.state.hide_flight
        });
        let formData = {
            "hide_flight": this.state.hide_flight ? 1 : 0//1 la an 0- la hien
        };
        console.log('...................................... hide_flight : ', formData);
        this.sendUpdateProfile(formData);
    }

    /**
     * back laij man hinh truoc do thi gui yeu cau update
     */
    onBackClick() {
        if (!this.props.navigation) return;
        let { params } = this.props.navigation.state;
        if (params.refreshView && this.isChangLang) {
            params.refreshView();
        }
        this.props.navigation.goBack();
        return true;
    }

    refreshCountBlock() {
        this.sendRequestTotalBlock();
    }

    /**
     * check n
     */
    onAddBlockClick() {
        let { screenProps } = this.props;
        this.props.navigation.navigate('block_friend_view', { refresh: this.refreshCountBlock.bind(this) });
    }

    /**
     * Gửi request lấy tổng số người đã chặn
     */
    sendRequestTotalBlock() {
        let url = this.getConfig().getBaseUrl() + ApiService.block_count();
        let self = this;
        Networking.httpRequestGet(url, (jsonData) => {
            if (jsonData.hasOwnProperty('error_code')) {
                let error_code = parseInt(jsonData['error_code']);
                if (error_code === 0) {
                    if (jsonData.hasOwnProperty('data')) {
                        let data = jsonData['data'];
                        self.total_block = parseInt(data.total_blocked) || 0;
                        self.setState({
                            msg_block: self.t('have_block').format(self.total_block)
                        });
                    }
                } else if (error_code === 2) {
                    self.onCheckErrorCode(2, '');
                }
            }
        });
    }

    /**
     * Chon tee
     * @param {*} data 
     * @param {*} index 
     */
    onSelectedTee(data, index) {
        this.dropdown_tee.hide();
        //this.tee = data;
        // this.setState({
        //     tee: data
        // });
        let formData = {
            "default_tee_id": data
        }
        let self = this;
        this.sendUpdateProfile(formData, (jsonData) => {
            if (jsonData.hasOwnProperty('error_code')) {
                let error_code = parseInt(jsonData['error_code']);
                if (error_code === 0) {
                    this.getUserInfo().setTeeDefault(data);
                    this.setState({
                        tee: data
                    });
                } else if (error_code === 2) {
                    self.onCheckErrorCode(2, '');
                }
            }
        });
    }

    /**
     * Chon ngôn ngữ
     * @param {*} data 
     * @param {*} index 
     */
    onSelectedLanguage(data) {
        //this.dropdown_lang.hide();
        // this.setState({
        //     lang: data.sortname
        // });
        // this.myTextInputLang.setValue(data.name);
        this.lang = data.sortname.toLowerCase();
        this.getUserInfo().setLang(this.lang);
        this.setLanguage(this.lang);

        this.renderTextBottom();

        this.isChangLang = true;
        this.confirmLang();
        this.sendUpdateLanguage();
        this.changeGlobalSetting();
    }

    changeGlobalSetting() {
        global.DROPDOWN_SEX = [
            { id: 0, name: this.t('male') },
            { id: 1, name: this.t('female') }
        ];//0 - Nam , 1 - Nu
        global.preferred_hand = [
            { id: 0, name: this.t('tay_phai') },
            { id: 1, name: this.t('tay_trai') }
        ]

        global.statistical_mode = [
            { mode: '10', name: this.t('mode_10') },
            { mode: '20', name: this.t('mode_20') },
            { mode: '50', name: this.t('mode_50') },
            { mode: 'all', name: this.t('mode_all') },
        ]
    }

    sendUpdateLanguage() {
        let url = this.getConfig().getBaseUrl() + ApiService.change_language();
        Networking.httpRequestGet(url, (jsonData) => {
            console.log("update ngon ngu : ", jsonData);
        }, () => {

        });
    }

    /**
     * tim ngon ngu theo tu khoa
     * @param {*} key 
     */
    findLanguage(key) {
        //console.log("ngon ngu ",global.default_languages,key);
        console.log('............... languge : ', language);
        if (key) {
            let obj = language.find(d => d.key.toLowerCase().indexOf(key.toLowerCase()) >= 0);
            if (obj && Object.keys(obj).length) {
                return obj.name;
            }
        }

        return this.t('vietnamese');
    }

    hideDropdownLang() {
        // this.myListViewLang.switchShow(global.default_languages);
        let navigation = PropsStatic.getAppSceneNavigator();
        if (navigation) {
            navigation.navigate('language_list', {
                onLanguageCallback: this.onLanguageCallback.bind(this)
            });
        }
    }

    renderTextBottom(){
        let funcs = Object.values(PropsStatic.getObjectCallFun());
        if(funcs.length) funcs[0]();
        // for(let func of funcs){
        //     func();
        // }
    }

    onLanguageCallback(language) {
        // this.getUserInfo().setLang(language.key);
        // this.setLanguage(language.key);
        console.log(".....lang : ", language);

        this.lang = language.key.toLowerCase();
        this.getUserInfo().setLang(this.lang);
        this.setLanguage(this.lang);
        
        this.renderTextBottom();

        this.isChangLang = true;
        this.confirmLang();
        this.sendUpdateLanguage();
        this.changeGlobalSetting();

        this.refTextLang.updateValue(language.name);
        // this.setState({
        //     language: language,
        //     source: language.flag
        // }, () => {

        // })
    }

    /**
     * bật / tắt thông báo trận đánh
     */
    onNoticeFlight(type) {
        this.sendRequestSettingNoticeFlight(type);
    }

    /**
     * Gui yêu cầu thay đổi thông báo trận đánh
     * @param {*} type 
     */
    sendRequestSettingNoticeFlight(type) {
        let url = this.getConfig().getBaseUrl() + ApiService.change_setting_notice_flight(type);
        console.log('change setting flight url : ', url);
        let self = this;
        Networking.httpRequestGet(url, (jsonData) => {
            console.log('thay doi cai dat ', jsonData);
            if (jsonData.hasOwnProperty('error_code')) {
                let error_code = parseInt(jsonData['error_code']);
                if (error_code === 0) {
                    //cai dat thanh cong
                    let isSucces = (type === 1) ? false : true;
                    self.changeSettingFlight.setChange(isSucces);
                    self.getUserInfo().getUserProfile().data.is_hide_noti_flight = type;
                } else {
                    let isSucces = (type === 1) ? true : false;
                    self.changeSettingFriendFlight.setChange(isSucces);
                }
            }
        }, () => {
            let isSucces = (type === 1) ? true : false;
            self.changeSettingFriendFlight.setChange(isSucces);
        });
    }

    /**
     * bật / tắt thông báo trận đánh của bạn bè
     */
    onNotceFlightFromFriend(type) {
        this.sendRequestSettingNoticeFriendFlight(type);
    }

    /**
 * Gui yêu cầu thay đổi thông báo trận đánh
 * @param {*} type 
 */
    sendRequestSettingNoticeFriendFlight(type) {
        let url = this.getConfig().getBaseUrl() + ApiService.change_setting_noitice_flight_friend(type);
        console.log('change setting flight url : ', url);
        let self = this;
        Networking.httpRequestGet(url, (jsonData) => {
            console.log('thay doi cai dat ', jsonData);
            if (jsonData.hasOwnProperty('error_code')) {
                let error_code = parseInt(jsonData['error_code']);
                if (error_code === 0) {
                    //cai dat thanh cong
                    let isSucces = (type === 1) ? false : true;
                    self.changeSettingFriendFlight.setChange(isSucces);
                    self.getUserInfo().getUserProfile().data.is_hide_noti_flight_friends = type;
                } else {
                    //that bai
                    let isSucces = (type === 1) ? true : false;
                    self.changeSettingFriendFlight.setChange(isSucces);
                }
            }
        }, () => {
            let isSucces = (type === 1) ? true : false;
            self.changeSettingFriendFlight.setChange(isSucces);
        });
    }

    onHideFlightAllUser(type) {
        this.sendRequestHideFlightAllUser(type);
    }

    /**
     * Gửi yêu cầu thay đổi trạng thái cài đặt ẩn trận vs tất cả mọi người
     * @param {number} type 
     */
    sendRequestHideFlightAllUser(type) {
        //change_setting_hide_flight_all_user
        let url = this.getConfig().getBaseUrl() + ApiService.change_setting_hide_flight_all_user(type);
        console.log('change setting flight url : ', url);
        let self = this;
        Networking.httpRequestGet(url, (jsonData) => {
            console.log('thay doi cai dat ', jsonData);
            if (jsonData.hasOwnProperty('error_code')) {
                let error_code = parseInt(jsonData['error_code']);
                if (error_code === 0) {
                    //cai dat thanh cong
                    let isSucces = (type === 1) ? false : true;
                    self.changeSettingHideFlightAllUser.setChange(isSucces);
                    self.getUserInfo().getUserProfile().data.is_hide_noti_flight_friends = type;
                } else {
                    //that bai
                    let isSucces = (type === 1) ? true : false;
                    self.changeSettingHideFlightAllUser.setChange(isSucces);
                }
            }
        }, () => {
            let isSucces = (type === 1) ? true : false;
            self.changeSettingHideFlightAllUser.setChange(isSucces);
        });
    }

    /**
     * Thông báo từ binh luan luân
     * @param {*} type 
     */
    onNoticeFromComment(type) {
        this.sendRequestSettingNoticeFromComment(type);
    }

    sendRequestSettingNoticeFromComment(type) {
        let url = this.getConfig().getBaseUrl() + ApiService.change_setting_notice_from_comment(type);
        console.log('change setting comment url : ', url);
        let self = this;
        Networking.httpRequestGet(url, (jsonData) => {
            console.log('thay doi cai dat ', jsonData);
            if (jsonData.hasOwnProperty('error_code')) {
                let error_code = parseInt(jsonData['error_code']);
                if (error_code === 0) {
                    //cai dat thanh cong
                    let isSucces = (type === 1) ? false : true;
                    self.changeSettingFromComment.setChange(isSucces);
                    self.getUserInfo().getUserProfile().data.is_hide_noti_comment = type;
                } else {
                    //that bai
                    let isSucces = (type === 1) ? true : false;
                    self.changeSettingFromComment.setChange(isSucces);
                }
            }
        }, () => {
            let isSucces = (type === 1) ? true : false;
            self.changeSettingFromComment.setChange(isSucces);
        });
    }

    /**
     * Thông báo từ trò chuyện
     * @param {*} type 
     */
    onNoticeFromChat(type) {

    }

    render() {
        return (
            <View style={styles.container}>
                <HeaderView ref={(headerView) => { this.headerView = headerView; }} />
                {this.renderLoading()}
                <ScrollView>
                    {/* <View style={styles.item_view}>
                    <Image
                        style={styles.logo_image}
                        source={this.getResources().alert}
                    />
                    <Text allowFontScaling={global.isScaleFont} style={styles.alert_text}>{this.state.off_notify ? this.t('on_notify') : this.t('off_notify')}</Text>

                    <View style={styles.alert_icon_view}>
                        <Touchable onPress={this.onOnNotify.bind(this)}>
                            <Image
                                style={styles.alert_icon_image}
                                source={this.state.off_notify ? this.getResources().ic_off : this.getResources().ic_on}
                            />
                        </Touchable>
                    </View>
                </View> */}
                    <View style={{ height: verticalScale(50), alignItems: 'center', flexDirection: 'row' }}>
                        <Image
                            style={styles.logo_image}
                            source={this.getResources().alert}
                        />
                        <Text allowFontScaling={global.isScaleFont} style={styles.alert_text}> {this.t('notify')}</Text>

                        {/* <View style={styles.alert_icon_view}>
                        <Touchable onPress={this.onOnNotify.bind(this)}>
                            <Image
                                style={styles.alert_icon_image}
                                source={this.state.off_notify ? this.getResources().ic_off : this.getResources().ic_on}
                            />
                        </Touchable>
                    </View> */}
                    </View>
                    {/* <NoticeView style={styles.item_view_notify}
                        title={this.t('hide_flight_all_player_other')}
                        onClickCallback={this.onHideFlightAllUser} /> */}

                    <NoticeView
                        ref={(changeSettingFlight) => { this.changeSettingFlight = changeSettingFlight; }}
                        style={styles.item_view_notify}
                        title={this.t('notify_flight_setting')}
                        subTitle={this.t('subtitle_hide_flight')}
                        onClickCallback={this.onNoticeFlight} />
                    <NoticeView
                        ref={(changeSettingFriendFlight) => { this.changeSettingFriendFlight = changeSettingFriendFlight; }}
                        style={styles.item_view_notify}
                        title={this.t('notify_flight_friend_setting')}
                        subTitle={this.t('subtitle_hide_friend_flight')}
                        onClickCallback={this.onNotceFlightFromFriend} />
                    <NoticeView
                        ref={(changeSettingFromComment) => { this.changeSettingFromComment = changeSettingFromComment; }}
                        style={styles.item_view_notify}
                        title={this.t('notice_from_thao_luan')}
                        onClickCallback={this.onNoticeFromComment} />
                    {/* <NoticeView style={styles.item_view_notify}
                        title={this.t('notice_from_chat')}
                        onClickCallback={this.onNoticeFromChat} /> */}

                    <View style={[styles.item_view, { borderTopColor: '#ebebeb', borderTopWidth: 1 }]}>
                        <Image
                            style={styles.logo_image}
                            source={this.getResources().world}
                        />
                        <Text allowFontScaling={global.isScaleFont} style={styles.alert_text}>{this.t('language')}</Text>
                        <View style={{ flex: 1 }}></View>
                        <Touchable onPress={this.hideDropdownLang}>
                            <View style={styles.language_view}>
                                {/* <MyTextInput ref={(myTextInputLang) => { this.myTextInputLang = myTextInputLang; }}
                                style={styles.dropdown}
                                placeholder={this.lang} /> */}
                                <TextCount style={styles.text_lang} ref={(refTextLang) => { this.refTextLang = refTextLang; }} count={this.lang} />
                                {/* <Touchable style={{ width: scale(30), height: verticalScale(30), justifyContent: 'flex-end', alignItems: 'center' }} onPress={this.hideDropdownLang}> */}
                                <Image
                                    style={styles.language_arrow}
                                    source={this.getResources().arrow_right}
                                />
                                {/* </Touchable> */}
                            </View>
                        </Touchable>
                    </View>
                    <View style={styles.item_view}>
                        {/* <View style={[styles.tee_logo_view, { backgroundColor: this.state.tee }]} */}
                        <View style={[styles.tee_logo_view, { backgroundColor: '#fff' }]}
                        />
                        <Text allowFontScaling={global.isScaleFont} style={styles.alert_text}>{this.t('tee_default')}</Text>
                        <View style={styles.tee_modal_view}>
                            <ModalDropdown
                                defaultValue={this.state.tee}
                                ref={(dropdown_tee) => { this.dropdown_tee = dropdown_tee; }}
                                style={styles.dropdown_tee}
                                textStyle={styles.dropdown_text}
                                dropdownStyle={styles.dropdown_dropdown_tee}
                                options={global.default_tees}
                                renderRow={(rowData, index, isSelected) =>
                                    <View style={{ backgroundColor: isSelected ? '#99E6FF' : '#FFFFFF' }}>
                                        <Touchable onPress={() => this.onSelectedTee(rowData, index)}>
                                            <Text allowFontScaling={global.isScaleFont} style={styles.text_dropdown}>{rowData}</Text>
                                        </Touchable>
                                    </View>
                                }
                            />

                            <Image
                                style={styles.tee_image}
                                source={this.getResources().arrow_right}
                            />
                        </View>
                    </View>
                    <View style={[styles.item_view, { backgroundColor: '#ededed' }]}>
                        <Image
                            style={styles.private_image}
                            source={this.getResources().rieng_tu}
                        />
                        <Text allowFontScaling={global.isScaleFont} style={styles.alert_text}>{this.t('private')}</Text>
                    </View>
                    {/* <View style={styles.private_view}>
                    <View
                        style={styles.private_view_left}
                    />
                    <View style={styles.hide_flight_view}>
                        <Text allowFontScaling={global.isScaleFont} style={styles.hide_flight_text}>{this.t('hide_flight')}</Text>
                        <Touchable onPress={this.onHideFlight.bind(this)}>
                            <View style={styles.hide_flight_icon_view}>
                                <Image
                                    style={styles.hide_flight_icon_image}
                                    source={this.state.hide_flight ? this.getResources().ic_on : this.getResources().ic_off}
                                />
                            </View>
                        </Touchable>
                    </View>
                </View> */}
                    <View style={styles.private_view}>
                        {/* <View
                            style={styles.private_view_left}
                        /> */}
                        <Touchable onPress={this.onAddBlockClick}>
                            <View style={styles.block_obsever_view}>
                                <Text allowFontScaling={global.isScaleFont} style={styles.block_obsever_text}>{this.t('block_obsever')}</Text>
                                <Text allowFontScaling={global.isScaleFont} style={styles.block_have_text}>{this.state.msg_block}</Text>
                            </View>
                        </Touchable>
                    </View>
                    <NoticeView
                        ref={(changeSettingHideFlightAllUser) => { this.changeSettingHideFlightAllUser = changeSettingHideFlightAllUser; }}
                        style={styles.item_view_notify}
                        title={this.t('hide_flight_all_player_other')}
                        subTitle={this.t('hide_flight_all_user')}
                        onClickCallback={this.onHideFlightAllUser} />
                    {/* <MyListView ref={(myListViewLang) => { this.myListViewLang = myListViewLang; }}
                        left={screenWidth - scale(140)}
                        right={0}
                        top={verticalScale(180)} /> */}
                </ScrollView>
            </View>
        );
    }
}