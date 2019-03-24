import React from 'react';
import {
    Platform,
    StyleSheet,
    Text,
    View,
    ImageBackground,
    Image,
    AppState,
    TouchableOpacity,
    Animated,
    InteractionManager
} from 'react-native';
import Touchable from 'react-native-platform-touchable';
import BasePureComponent from '../../../Core/View/BasePureComponent';
import Networking from '../../../Networking/Networking';
import ApiService from '../../../Networking/ApiService';
import { Avatar } from 'react-native-elements';
import LoadingView from '../../../Core/Common/LoadingView';
import styles from '../../../Styles/Home/StyleHomeView';
import CountEvent from './CountEvent';
import HomeLoading from '../HomeLoadingView';
import UserProfile from '../../../Model/Home/UserProfileModel';
import CategoryItemView from './CategoryItemView';
import PopupMemoryView from '../../Common/PopupMemoryView';
import DataManager from '../../../Core/Manager/DataManager';
import Constant from '../../../Constant/Constant';
import { verticalScale, scale } from '../../../Config/RatioScale';
import { getStatusBarHeight } from 'react-native-iphone-x-helper';

import registerListenerChat from '../../../Services/RegisterListennerChat';
import StaticProps from '../../../Constant/PropsStatic';

const headerBar = getStatusBarHeight();
// console.log('...................... headerBar : ',headerBar);

export default class UserHomeView extends BasePureComponent {

    constructor(props) {
        super(props);

        this.userProfile = this.getUserInfo().getUserProfile();
        this.userProfile = this.userProfile && Object.keys(this.userProfile).length > 0 ? this.userProfile : ''
        this.eagles = [];
        this.HIO = [];
        this.best_net = [];
        this.best_score = [];
        this.currentMemory = null;
        let usgaHcIndex = this.userProfile ? this.userProfile.getUsgaHcIndex() : '';
        this.state = {
            user_name: this.userProfile ? this.userProfile.getFullName() : '',
            user_id: this.userProfile ? this.userProfile.getUserId() : '',
            user_handicap: this.userProfile ? (this.checkNumberHandicap(usgaHcIndex) ? (usgaHcIndex > 0 ? '' : '+') + Math.abs(usgaHcIndex) : usgaHcIndex) : '',
            user_avatar_uri: this.userProfile ? this.userProfile.getAvatar() : '',
            country_image: this.userProfile ? this.userProfile.getCountryImage() : '',
            isVipAccount: this.userProfile ? this.userProfile.getAllow_using_scorecard_image() === 1 ? true : false : false,
            appState: AppState.currentState
        }

        this.onAvatarClick = this.onAvatarClick.bind(this);
        this.onHandicapFlagClick = this.onHandicapFlagClick.bind(this);
        // this.onCategoryPress = this.onCategoryPress.bind(this);
        this.onViewScorecard = this.onViewScorecard.bind(this);
        this.onMemoryPopupClose = this.onMemoryPopupClose.bind(this);
        this.onOpenUpgradeAccount = this.onOpenUpgradeAccount.bind(this);
        this.onSearchEverythingPress = this.onSearchEverythingPress.bind(this);

    }

    checkNumberHandicap(_handicap) {
        return typeof _handicap === 'number' ? true : false;
    }

    renderUpgradeBtn(isVipAccount) {
        if (!isVipAccount) {
            return (
                <TouchableOpacity style={styles.view_upgrade}
                    onPress={this.onAvatarClick}>
                    <Image
                        style={styles.img_arrow_up}
                        source={this.getResources().ic_arrow_up_2} />
                </TouchableOpacity>
            )
        } else {
            return null
        }

    }

    updateUserProfile() {
        this.userProfile = this.getUserInfo().getUserProfile();
        if (global.isProfileDidUpdate && this.userProfile) {
            // console.log('updateAvatar', this.getUserInfo().getUserProfile())
            let usgaHcIndex = this.userProfile.getUsgaHcIndex();
            this.setState({
                user_name: this.userProfile.getFullName(),
                user_id: this.userProfile.getUserId(),
                user_handicap: this.checkNumberHandicap(usgaHcIndex) ? (usgaHcIndex > 0 ? '' : '+') + Math.abs(usgaHcIndex) : usgaHcIndex,
                user_avatar_uri: this.userProfile.getAvatar(),
                country_image: this.userProfile.getCountryImage(),
                isVipAccount: this.userProfile.getAllow_using_scorecard_image() === 1 ? true : false,
            }, () => {
                global.isProfileDidUpdate = false;
            })
        }

    }

    render() {

        let {
            user_name,
            user_id,
            user_handicap,
            user_avatar_uri,
            isVipAccount
        } = this.state;
        // console.log('UserHomeView.renderXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX');
        console.log('user_handicap', user_handicap)
        return (
            <Animated.View style={[styles.background_home]}
            // source={this.getResources().bg_home}
            // resizeMethod={'resize'}
            >
                <Image
                    source={this.getResources().ic_bg_home}
                    style={styles.img_bg_grass}
                    resizeMethod={'resize'} />
                <View style={styles.view_content}>
                    <View style={styles.line} />
                    <View style={{ flex: 1 }}>

                        <View style={styles.user_group} >
                            <View >
                                <Avatar
                                    width={verticalScale(80)}
                                    width={verticalScale(80)}
                                    rounded={true}
                                    containerStyle={styles.avatar_container}
                                    avatarStyle={styles.avatar_style}
                                    source={{ uri: user_avatar_uri }}
                                    onPress={this.onAvatarClick}
                                />
                                {this.renderUpgradeBtn(isVipAccount)}
                            </View>
                            <View style={{ flex: 1, justifyContent: 'center', marginTop: verticalScale(10), marginLeft: scale(5) }}>
                                {/* <Text allowFontScaling={global.isScaleFont} style={styles.user_name} >
                                    {user_name}
                                    <Text allowFontScaling={global.isScaleFont} style={styles.user_id} >{`  ${user_id}`}</Text>
                                </Text> */}
                                <Text numberOfLines={1} allowFontScaling={global.isScaleFont} style={styles.user_name} >
                                    {user_name}
                                </Text>
                                {/* <Text numberOfLines={1} allowFontScaling={global.isScaleFont} style={styles.user_id} >{`${user_id}`}</Text> */}
                                <View style={[styles.view_row]}>
                                    <Text numberOfLines={1} allowFontScaling={global.isScaleFont} style={styles.user_id} >{`${user_id}`}</Text>
                                    <TouchableOpacity style={{ paddingRight: scale(5), paddingLeft: scale(15)}}
                                    onPress={this.onSearchEverythingPress}>
                                        <Image
                                            style={styles.img_search}
                                            source={this.getResources().ic_Search} />
                                    </TouchableOpacity>
                                </View>
                            </View>

                        </View>

                        {/* <View style={styles.handicap_group} > */}
                        <Touchable onPress={this.onHandicapFlagClick} style={[styles.handicap_group, { marginRight: this.getRatioAspect().scale(10) }]}>
                            <ImageBackground style={styles.handicap_bg}
                                resizeMode='contain'
                                source={this.getResources().ic_flag}>
                                <Text allowFontScaling={global.isScaleFont} style={styles.handicap_text} >{user_handicap}</Text>
                            </ImageBackground>
                        </Touchable>

                        {/* </View> */}

                        <Avatar
                            // containerStyle={{ position: 'absolute', left: this.getRatioAspect().scale(110), top: this.getRatioAspect().verticalScale(10), justifyContent: 'center', alignItems: 'center' }}
                            containerStyle={{ position: 'absolute', left: scale(10), top: verticalScale(8), justifyContent: 'center', alignItems: 'center' }}
                            width={this.getRatioAspect().verticalScale(35)}
                            height={this.getRatioAspect().verticalScale(35)}
                            rounded={true}
                            // avatarStyle={{resizeMode : 'contain'}}
                            source={this.state.country_image.length ? { uri: this.state.country_image } : ''}
                        />

                    </View>
                </View>

                <PopupMemoryView
                    ref={(refPopupMemoryView) => { this.refPopupMemoryView = refPopupMemoryView }}
                    onViewScorecard={this.onViewScorecard}
                    onClose={this.onMemoryPopupClose} />
                <HomeLoading ref={(homeLoading) => { this.homeLoading = homeLoading; }} />
                {/* {this.renderLoading()} */}
            </Animated.View>
        );
    }

    componentDidMount() {
        console.log('UserHomeView.componentDidMount', global.isAppJustActive)
        AppState.addEventListener('change', this._handleAppStateChange);

        if (!this.userProfile || !Object.keys(this.userProfile).length || global.isAppJustActive === true) {
            global.isAppJustActive = false;
            global.load_refresh_profile = false;
            this.requestUserHome();
        }

    }

    componentWillUnmount() {
        AppState.removeEventListener('change', this._handleAppStateChange);
    }

    _handleAppStateChange = (nextAppState) => {
        // if (nextAppState.match(/background/) && this.state.appState === 'active') {
        //     console.log('HomeView.active');
        //     global.isAppJustActive = false;
        //     // isHomeLoading = false;
        //     this.requestUserHome();
        // }
        // this.setState({ appState: next\ });
    }

    onAvatarClick() {
        if (this.props.onAvatarClick) {
            this.props.onAvatarClick();
        }
    }

    onHandicapFlagClick() {
        if (this.props.onHandicapFlagClick) {
            this.props.onHandicapFlagClick();
        }
    }


    requestUserHome() {
        this.showHomeLoading();
        let url = this.getConfig().getBaseUrl() + ApiService.user_profile();
        console.log("url : ", url);
        let self = this;
        Networking.httpRequestGet(url, this.onResponseUserHome.bind(this), () => {
            //self.homeLoading.setVisible(false);
            self.hideHomeLoading();
        });
    }

    onResponseUserHome(jsonData) {
        //this.homeLoading.setVisible(false);
        this.hideHomeLoading();
        if (jsonData) {
            // console.log('onResponseUserHome', JSON.stringify(jsonData));
            this.userProfile = new UserProfile();
            this.userProfile.parseUserData(jsonData);
            if (this.userProfile.getErrorCode() === 0) {
                this.getUserInfo().setQA(this.userProfile.getQAUrl());
                // global.event_count = this.userProfile.getEventCountComing();
                let event_count = this.userProfile.getEventCountComing();
                let _com = StaticProps.getMainAppComponent();
                if (_com) {
                    _com.updateCountEventComingsoom(event_count);
                }
                // StaticProps.getMainAppComponent().updateCountEventComingsoom(event_count);

                let id_firebase = this.userProfile.data.id_firebase;
                if (id_firebase) {
                    this.getUserInfo().setFuid(id_firebase);
                    // registerListenerChat.initListener('chat',StaticProps.getObjectCallFun()[Constant.NAVIGATOR_SCREEN.HOME]);
                    registerListenerChat.setStateKeyReaded(this.getUserInfo().getId());
                    registerListenerChat.initListener('chat', StaticProps.getBadgeChat());
                }

                // this.countEventView.setEventCount(event_count);
                this.onUpdateUserUI(this.userProfile);
                this.getUserInfo().setUserProfile(this.userProfile);
                global.is_profile_loaded = true;
                // this.showMemoryPopup();
            } else {
                this.showErrorMsg(this.userProfile.getErrorMsg());
            }
        }
    }

    onUpdateUserUI(userProfile) {
        // this.popupUserHandicap.setDataChange(userProfile);
        let handicap = userProfile.getUsgaHcIndex();
        let isVip = userProfile.getAllow_using_scorecard_image() === 1;
        global.isVipAccount = isVip;
        this.setState({
            user_name: userProfile.getFullName(),
            user_id: userProfile.getUserId(),
            user_handicap: typeof handicap === 'number' ? (handicap > 0 ? userProfile.getUsgaHcIndex().toString() : '+' + Math.abs(userProfile.getUsgaHcIndex())) : handicap,
            user_avatar_uri: userProfile.getAvatar(),
            country_image: userProfile.getCountryImage(),
            isVipAccount: isVip
        }, () => {
            if (this.props.userProfileCallback) {
                this.props.userProfileCallback(userProfile);
            }
        });
        // this.countEventView.setEventCount(userProfile.getEventCountComing());
    }

    sendRequestRefeshProfile() {
        if (!this.countEventView) return;
        let url = this.getConfig().getBaseUrl() + ApiService.user_profile();
        console.log("url : ", url);
        let self = this;
        Networking.httpRequestGet(url, (jsonData) => {
            let userProfile = new UserProfile();
            userProfile.parseUserData(jsonData);
            if (userProfile.getErrorCode() === 0) {
                // self.getUserInfo().setQA(userProfile.getQAUrl());

                let fuid = jsonData.data.personal.id_firebase;
                if (fuid) {
                    this.getUserInfo().setFuid(fuid);
                }

                event_count = userProfile.getEventCountComing();
                if (self.countEventView) {
                    self.countEventView.setEventCount(event_count);
                }
                //self.onUpdateUserUI(userProfile);
                //self.getUserInfo().setUserProfile(userProfile);
                global.is_profile_loaded = true;
            } else {
                //self.showErrorMsg(userProfile.getErrorMsg());
            }
        });
    }

    showHomeLoading() {
        if (this.homeLoading) {
            this.homeLoading.setVisible(true);
        }
    }

    hideHomeLoading() {
        if (this.homeLoading) {
            this.homeLoading.setVisible(false);
        }
    }

    showMemoryPopup() {
        DataManager.loadSingleLocalData(Constant.MEMORY_POPUP, (time) => {
            try {
                let date = new Date();
                console.log('showMemoryPopup.time', date.getDate(), time);
                if (!time || time != date.getDate()) {
                    this.requestAchievement();
                    DataManager.saveSingleLocalData(Constant.MEMORY_POPUP, date.getDate().toString(), (error) => {
                        console.log('showMemoryPopup.error', error)
                    });
                }
            } catch (e) {

            }
        }, () => {

        });

    }

    requestAchievement() {
        let url = this.getConfig().getBaseUrl() + ApiService.user_achievement();
        console.log("url : ", url);
        let self = this;
        Networking.httpRequestGet(url, (jsonData) => {
            console.log('requestAchievement.jsonData', jsonData)
            if (jsonData.error_code === 0) {
                let data = jsonData.data;
                if (data) {
                    this.eagles = data['eagles'];
                    this.HIO = data['HIO'];
                    this.best_net = data['best_net'];
                    this.best_score = data['best_score'];

                    this.ShowPopup();
                }
            }
        }, () => {
            //self.homeLoading.setVisible(false);
            //0912939929‬ 
        });
    }

    ShowPopup() {
        console.log('ShowPopup', this.HIO)
        if (this.HIO.length > 0) {
            this.currentMemory = this.HIO[0];
            if (this.refPopupMemoryView)
                this.refPopupMemoryView.setContentAndShow({
                    achievement: 'HIO',
                    score: this.currentMemory.over
                });
            this.HIO.shift();
            console.log('ShowPopup', this.HIO)
            return true;
        }
        if (this.eagles.length > 0) {
            this.currentMemory = this.eagles[0];
            if (this.refPopupMemoryView)
                this.refPopupMemoryView.setContentAndShow({
                    achievement: 'EAGLE',
                    score: this.currentMemory.over
                });
            this.eagles.shift();
            return true;
        }
        if (this.best_net.length > 0) {
            this.currentMemory = this.best_net[0];
            if (this.refPopupMemoryView)
                this.refPopupMemoryView.setContentAndShow({
                    achievement: 'BEST NET',
                    score: this.currentMemory.over
                });
            this.best_net.shift();
            return true;
        }
        if (this.best_score.length > 0) {
            this.currentMemory = this.best_score[0];
            if (this.refPopupMemoryView)
                this.refPopupMemoryView.setContentAndShow({
                    achievement: 'BEST SCORE',
                    score: this.currentMemory.over
                });
            this.best_score.shift();
            return true;
        }
    }

    onMemoryPopupClose() {
        this.ShowPopup();
    }

    onViewScorecard() {
        if (this.currentMemory) {
            if (this.props.onViewScorecard) {
                this.props.onViewScorecard(this.currentMemory.flight_id);
            }
        }
    }

    onOpenUpgradeAccount() {
        if (this.props.onOpenUpgradeAccount) {
            this.props.onOpenUpgradeAccount();
        }
    }

    onSearchEverythingPress(){
        if (this.props.onSearchEverythingPress) {
            this.props.onSearchEverythingPress();
        }
    }

    refreshUpgradeSuccess() {
        this.setState({
            isVipAccount: true
        })
    }
}