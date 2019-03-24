import React from 'react';
import { Platform, StyleSheet, Text, View, Image, ScrollView , Animated,BackHandler} from 'react-native';
import BaseComponent from '../../Core/View/BaseComponent';
import HeaderView from '../HeaderView';
import Touchable from 'react-native-platform-touchable';
// import { StackNavigator } from 'react-navigation';
import PopupLogoutView from '../Popups/PopupLogoutView';
// import DataManager from '../../Core/Manager/DataManager';
import Constant from '../../Constant/Constant';

import { Constants as C } from '../../Core/Common/ExpoUtils';
import Tips from 'react-native-tips';
import ApiService from '../../Networking/ApiService';
import Networking from '../../Networking/Networking';
import MyView from '../../Core/View/MyView';
import PropsStatic from '../../Constant/PropsStatic';
import I18n from 'react-native-i18n';
require('../../../I18n/I18n');

// import PropsStatic from '../../Constant/PropsStatic';

import {scale, verticalScale, fontSize} from '../../Config/RatioScale';

export default class MenuView extends BaseComponent {
    constructor(props) {
        super(props);
        this.offsetTop = Platform.OS === 'ios' ? 0 : C.statusBarHeight;
        this.userProfile = //this.getUserInfo().getUserProfile();
        this.navigation = this.props.screenProps;
        this.state = {
            tipsVisible: global.isUpgradeTut,
            fadeIn: new Animated.Value(0),
        }
        this.sendRequestDefaultSetting();

        this.onLeaderboardClick = this.onLeaderboardClick.bind(this);
        this.onUserInfoClick = this.onUserInfoClick.bind(this);
        this.onFlightHistoryClick = this.onFlightHistoryClick.bind(this);
        this.onContactClick = this.onContactClick.bind(this);
        this.onPaymentClick = this.onPaymentClick.bind(this);
        this.onTermConditionClick = this.onTermConditionClick.bind(this);
        this.onSyncHandicapClick = this.onSyncHandicapClick.bind(this);
        this.onReportNewFacility = this.onReportNewFacility.bind(this);
        this.onSettingClick = this.onSettingClick.bind(this);
        this.onQAClick = this.onQAClick.bind(this);
        this.onReportUserClick = this.onReportUserClick.bind(this);
        this.onLogoutClick = this.onLogoutClick.bind(this);
        this.onCreateClubClick = this.onCreateClubClick.bind(this);
        this.onCreateTournamentClick = this.onCreateTournamentClick.bind(this);

        PropsStatic.setCallFun(Constant.NAVIGATOR_SCREEN.MENU, this.setTitle.bind(this));

        this.backHandler = null;
        this.onBackClick = this.onBackClick.bind(this);
    }

    // static navigationOptions = () => ({
    //     title: I18n.t("menu"),               // it stay in french whatever choosen langage
    //     tabBarLabel: I18n.t("menu"),
    // });

    static navigationOptions = ({navigation}) => {
        const {params} = navigation.state;
        console.log('...........................params : ',params);
        if(!params){
            return {
                title : I18n.t("menu"),
                tabBarLabel: I18n.t("menu")
            }
        }
        return {
            title: params.title,
            tabBarLabel: params.title
            // headerRight: <Button
            //                  title="Refresh"
            //                  onPress={ () => params.handleRefresh() } />

        };
    };

    setTitle(){
        console.log("........................set title : ",this.t('menu'));
        this.props.navigation.setParams({
            title: this.t('menu')
        });
    }

    /**
     * Gửi request lấy danh sach cacs tees va ngôn ngữ có sẵn trên sever
     */
    sendRequestDefaultSetting() {
        if (global.default_tees.length && global.default_languages.length) {
            //nếu đã lấy rồi thì thôi không load lại lần nữa
            return;
        }
        let url = this.getConfig().getBaseUrl() + ApiService.default_setting();
        // this.loading.showLoading();
        console.log("url setting : ", url);
        let self = this;
        Networking.httpRequestGet(url, (jsonData) => {
            // console.log("default data : ",jsonData);
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
                } else if (error_code === 2) {
                    self.onCheckErrorCode(2, '');
                }
            }
            // self.loading.hideLoading();
        }, () => {
            //time out
            //self.loading.hideLoading();
            //self.popupTimeOut.showPopup();
        });
    }

    fadeIn() {
        this.state.fadeIn.setValue(0);
        Animated.timing(
            this.state.fadeIn,
            {
                toValue: 1,
                duration: this.timeAnimationFadeIn,
            }
        ).start();
    }

    onBackClick(){
        let{navigation} = this.props;
        if(navigation){
            navigation.navigate('HomeView');
        }
        return true;
    }

    componentDidMount() {
        this.backHandler = BackHandler.addEventListener('hardwareBackPress',this.onBackClick);

        this.registerMessageBar();
        this.registerNotification();
        this.fadeIn();

        // PropsStatic.setCallFun(this.navigation.)
    }

    componentWillUnmount() {
        this.unregisterMessageBar();
    }

    /**
     * render lai menu neu thay đổi ngôn ngữ
     */
    refreshView() {
        console.log("refresh menuview");
        this.setState({});
    }

    render() {
        let{fadeIn} = this.state;
        return (
            <Animated.View style={[styles.container,{opacity : fadeIn}]} >
                {this.renderLoading()}
                <PopupLogoutView ref={(popupLogout) => { this.popupLogout = popupLogout; }} />
                <HeaderView ref={(refHeader)=>{this.refHeader = refHeader;}} title={this.t('menu')} handleBackPress={this.onBackClick}/>
                <ScrollView>
                    {/* <Touchable onPress={this.onUserInfoClick} >
                        <View style={styles.item_menu}>
                            <Image style={styles.icon_menu}
                                source={this.getResources().ic_user_info} />
                            <Text allowFontScaling={global.isScaleFont} style={styles.text_menu}>{this.t('user_info')}</Text>
                            <Image style={styles.arrow_right_menu}
                                source={this.getResources().ic_arrow_right} />
                        </View>
                    </Touchable>
                    <View style={styles.line_menu} /> */}

                    {/* <Touchable onPress={this.onLeaderboardClick}>
                        <View style={styles.item_menu}>
                            <Image style={styles.icon_menu}
                                source={this.getResources().ic_leaderboard} />
                            <Text allowFontScaling={global.isScaleFont} style={styles.text_menu}>{this.t('leaderboard_title')}</Text>
                            <Image style={styles.arrow_right_menu}
                                source={this.getResources().ic_arrow_right} />
                        </View>
                    </Touchable>
                    <View style={styles.line_menu} /> */}

                    {/* <Touchable onPress={this.onFlightHistoryClick}>
                        <View style={styles.item_menu}>
                            <Image style={styles.icon_menu}
                                source={this.getResources().ic_flight_history} />
                            <Text allowFontScaling={global.isScaleFont} style={styles.text_menu}>{this.t('flight_history')}</Text>
                            <Image style={styles.arrow_right_menu}
                                source={this.getResources().ic_arrow_right} />
                        </View>
                    </Touchable>
                    <View style={styles.line_menu} /> */}

                    <Touchable onPress={this.onContactClick}>
                        <View style={styles.item_menu}>
                            <Image style={styles.icon_menu}
                                source={this.getResources().ic_contact} />
                            <Text allowFontScaling={global.isScaleFont} style={styles.text_menu}>{this.t('contact')}</Text>
                            <Image style={styles.arrow_right_menu}
                                source={this.getResources().ic_arrow_right} />
                        </View>
                    </Touchable>
                    <View style={styles.line_menu} />

                    {/* <MyView hide={this.userProfile.getAllow_using_scorecard_image() === 1}>
                        <Tips
                            visible={this.state.tipsVisible}
                            text={this.t('tut_upgrade_menu_item')}
                            position="bottom"
                            offsetTop={-this.offsetTop}
                            enableChildrenInteraction={true}
                        // onRequestClose={this.onPaymentClick.bind(this)}
                        >
                            <Touchable onPress={this.onPaymentClick}>
                                <View style={styles.item_menu}>
                                    <Image style={styles.icon_menu}
                                        source={this.getResources().ic_payment} />
                                    <View style={styles.view_text_payment}>
                                        <Text allowFontScaling={global.isScaleFont} style={styles.text_payment}>{this.t('nang_cap_tai_khoan_vip')}</Text>
                                        <Image style={styles.icon_vip}
                                            source={this.getResources().ic_vip} />
                                    </View>

                                    <Image style={styles.arrow_right_menu}
                                        source={this.getResources().ic_arrow_right} />
                                </View>
                            </Touchable>
                        </Tips>
                        <View style={styles.line_menu} />
                    </MyView> */}


                    <Touchable onPress={this.onTermConditionClick}>
                        <View style={styles.item_menu}>
                            <Image style={styles.icon_menu}
                                source={this.getResources().ic_term_condition} />
                            <Text allowFontScaling={global.isScaleFont} style={styles.text_menu}>{this.t('term_condition')}</Text>
                            <Image style={styles.arrow_right_menu}
                                source={this.getResources().ic_arrow_right} />
                        </View>
                    </Touchable>
                    <View style={styles.line_menu} />

                    {/* <MyView hide={this.userProfile.getEhandicapClub() ? true : false}>
                        <Touchable onPress={this.onSyncHandicapClick}>
                            <View style={styles.item_menu}>
                                <Image style={styles.icon_menu}
                                    source={this.getResources().ic_sync} />
                                <Text allowFontScaling={global.isScaleFont} style={styles.text_menu}>{this.t('sync_handicap')}</Text>
                                <Image style={styles.arrow_right_menu}
                                    source={this.getResources().ic_arrow_right} />
                            </View>
                        </Touchable>
                        <View style={styles.line_menu} />
                    </MyView> */}

                    {/* <Touchable onPress={this.onReportErrorCourseClick.bind(this)}>
                        <View style={styles.item_menu}>
                            <Image style={styles.icon_menu}
                                source={this.getResources().ic_report_error} />
                            <Text allowFontScaling={global.isScaleFont} style={styles.text_menu}>{this.t('report_error_course')}</Text>
                            <Image style={styles.arrow_right_menu}
                                source={this.getResources().ic_arrow_right} />
                        </View>
                    </Touchable>
                    <View style={styles.line_menu} /> */}

                    {/* <Touchable onPress={this.onReportNewFacility}>
                        <View style={styles.item_menu}>
                            <Image style={styles.icon_menu}
                                source={this.getResources().ic_report_new_facility} />
                            <Text allowFontScaling={global.isScaleFont} style={styles.text_menu}>{this.t('report_new_facility')}</Text>
                            <Image style={styles.arrow_right_menu}
                                source={this.getResources().ic_arrow_right} />
                        </View>
                    </Touchable>
                    <View style={styles.line_menu} /> */}

                    <Touchable onPress={this.onSettingClick}>
                        <View style={styles.item_menu}>
                            <Image style={styles.icon_menu}
                                source={this.getResources().ic_settings} />
                            <Text allowFontScaling={global.isScaleFont} style={styles.text_menu}>{this.t('setting')}</Text>
                            <Image style={styles.arrow_right_menu}
                                source={this.getResources().ic_arrow_right} />
                        </View>
                    </Touchable>
                    <View style={styles.line_menu} />

                    <Touchable onPress={this.onQAClick}>
                        <View style={styles.item_menu}>
                            <Image style={styles.icon_menu}
                                source={this.getResources().q_a} />
                            <Text allowFontScaling={global.isScaleFont} style={styles.text_menu}>{this.t('q_a')}</Text>
                            <Image style={styles.arrow_right_menu}
                                source={this.getResources().ic_arrow_right} />
                        </View>
                    </Touchable>
                    <View style={styles.line_menu} />

                    {/* <Touchable onPress={this.onReportUserClick}>
                        <View style={styles.item_menu}>
                            <Image style={styles.icon_menu}
                                source={this.getResources().report_user} />
                            <Text allowFontScaling={global.isScaleFont} style={styles.text_menu}>{this.t('report_user')}</Text>
                            <Image style={styles.arrow_right_menu}
                                source={this.getResources().ic_arrow_right} />
                        </View>
                    </Touchable>
                    <View style={styles.line_menu} /> */}

                    <Touchable onPress={this.onCreateClubClick}>
                        <View style={styles.item_menu}>
                            <Image style={styles.icon_menu}
                                source={this.getResources().ic_club} />
                            <Text allowFontScaling={global.isScaleFont} style={styles.text_menu}>{this.t('create_club')}</Text>
                            <Image style={styles.arrow_right_menu}
                                source={this.getResources().ic_arrow_right} />
                        </View>
                    </Touchable>
                    <View style={styles.line_menu} />

                    <Touchable onPress={this.onCreateTournamentClick}>
                        <View style={styles.item_menu}>
                            <Image style={styles.icon_menu}
                                source={this.getResources().ic_tournament} />
                            <Text allowFontScaling={global.isScaleFont} style={styles.text_menu}>{this.t('create_tournament')}</Text>
                            <Image style={styles.arrow_right_menu}
                                source={this.getResources().ic_arrow_right} />
                        </View>
                    </Touchable>
                    <View style={styles.line_menu} />

                    <Touchable onPress={this.onLogoutClick}>
                        <View style={styles.item_menu}>
                            <Image style={styles.icon_menu}
                                source={this.getResources().ic_logout} />
                            <Text allowFontScaling={global.isScaleFont} style={styles.text_menu}>{this.t('signout')}</Text>
                            <Image style={styles.arrow_right_menu}
                                source={this.getResources().ic_arrow_right} />
                        </View>
                    </Touchable>
                    <View style={styles.line_menu} />
                </ScrollView>
                {this.renderMessageBar()}
            </Animated.View>
        );
    }

    //report_user
    onReportUserClick() {
        if (this.navigation) {
            this.navigation.navigate('report_user');
        }
    }

    onCreateClubClick(){
        if (this.navigation) {
            this.navigation.navigate('club_create_view');
        }
    }

    onCreateTournamentClick(){
        if (this.navigation) {
            this.navigation.navigate('create_tournaments_view');
        }
    }

    /**
     * click vao button Q&A
     */
    onQAClick() {
        if (this.navigation) {
            this.navigation.navigate('q_a_view');
        }
    }

    /**
     * Điều hướng sang màn hình thông tin cá nhân
     */
    onUserInfoClick() {
        console.log('onUserInfoClick');
        if (this.navigation != null) {
            this.navigation.navigate('persional_information');
        }
    }

    /**
     * Điều hướng sang màn hình bảng xếp hạng
     */
    onLeaderboardClick() {
        //console.log('onLeaderboardClick', navigation)
        if (this.navigation != null) {
            this.navigation.navigate('leaderboard');
        }
    }

    /**
     * Điều hướng sang màn hình lịch sử trận đánh
     */
    onFlightHistoryClick() {
        if (this.navigation != null) {
            this.navigation.navigate('flight_history');
        }
    }

    /**
     * Điều hướng sang màn hình liên hệ
     */
    onContactClick() {
        if (this.navigation) {
            this.navigation.navigate('contact');
        }
    }

    /**
     * Điều hướng sang màn hình thanh toán
     */
    onPaymentClick() {
        this.setState({
            tipsVisible: false
        })
        if (this.navigation) {
            this.navigation.navigate('payment', { onUpgradeSuccess: this.onUpgradeSuccess.bind(this) });
        }
    }

    onUpgradeSuccess() {
        this.refreshView();
    }

    /**
     * Luật golf và điều khoản
     */
    onTermConditionClick() {
        if (this.navigation) {
            this.navigation.navigate('golflaw_condition');
        }
    }

    /**
     * Điều hướng sang màn hình đồng bộ điểm từ ehandicap
     */
    onSyncHandicapClick() {
        if (this.navigation) {
            this.navigation.navigate('sys_handicap', { onSyncHandicapSuccess: this.onSyncHandicapSuccess.bind(this) });
        }
    }

    onSyncHandicapSuccess(){
        this.refreshView();
    }

    /**
     * điểu hướng sang màn hình báo lỗi thông tin sân
     */
    onReportErrorCourseClick() {
        if (this.navigation) {
            this.navigation.navigate('report_error_facility');
        }
    }

    /**
     * bao thong tin moi
     */
    onReportNewFacility() {
        if (this.navigation) {
            this.navigation.navigate('report_new_facility');
        }
    }

    /**
     * Điều hướng sang màn hình cài đặt
     */
    onSettingClick() {
        if (this.navigation) {
            this.navigation.navigate('setting_app', { refreshView: this.refreshView.bind(this) });
        }
    }

    /**
     * đăng xuất
     */
    onLogoutClick() {
        let navigation = PropsStatic.getParentNavigator();
        this.popupLogout.setNavigation(navigation);
        this.popupLogout.show();
    }

}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: '#FFFFFF'
    },
    item_menu: {
        flexDirection: 'row',
        //justifyContent: 'space-between',
        paddingTop: verticalScale(8),
        paddingBottom: verticalScale(8),
        paddingRight: scale(10),
        paddingLeft: scale(15),
        alignItems: 'center',
        backgroundColor: '#FFFFFF'
    },
    icon_menu: {
        height:scale(30),
        width: scale(30),
        resizeMode: 'contain'
    },
    text_menu: {
        flex: 1,
        color: '#707070',
        textAlignVertical: 'center',
        marginLeft: scale(15),
        fontSize : fontSize(16,scale(2))//16
    },
    arrow_right_menu: {
        width: scale(20),
        height: scale(20),
        resizeMode: 'contain',
    },
    line_menu: {
        height:  verticalScale(1),
        backgroundColor: '#E0E0E0'
    },
    view_text_payment: {
        flex: 1,
        flexDirection: 'row',
        marginLeft: scale(15),
        alignItems: 'center'
    },
    text_payment: {
        color: '#707070',
        textAlignVertical: 'center',
        fontSize : fontSize(16,scale(2))
    },
    icon_vip: {
        width: scale(27),
        height: scale(27),
        resizeMode: 'contain',
        marginLeft: scale(15)
    }

});

