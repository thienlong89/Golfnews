import React from 'react';
import {
    Platform,
    Text,
    View,
    StatusBar,
    Linking,
    Alert,
    Animated,
    Easing,
    ScrollView,
    Dimensions,
    TouchableOpacity,
    Image,
    ImageBackground
} from 'react-native';
import styles from '../../Styles/Home/StyleHomeView';
// import Touchable from 'react-native-platform-touchable';
import Networking from '../../Networking/Networking';
import BaseComponent from '../../Core/View/BaseComponent';
// import Swiper from 'react-native-swiper';
// import UserProfile from '../../Model/Home/UserProfileModel';
import ApiService from '../../Networking/ApiService';
import PopupYesOrNo from '../Popups/PopupPaymentView';
import FlightDetailModel from '../../Model/CreateFlight/Flight/FlightDetailModel';
import PopupNotify from '../Popups/PopupNotificationView';
import PopupNotificationFull from '../Popups/PopupMessage';
import PopupUserHandicap from './Item/PopupUserHandicap';
// import FinishFlightView from './Item/FinishFlightView';
// import IndicatorHomeView from './Item/IndicatorHomeView';
// import FriendFlightView from './Item/FriendFlightView';
// import LoadingView from '../../Core/Common/LoadingView';
// import CountEvent from './Item/CountEvent';
import { Location, Permissions } from '../../Core/Common/ExpoUtils';
import UserInfo from '../../Config/UserInfo';
import IntentActivityAndroid from '../../Core/Common/IntentActivityAndroid';
// import FCM, { FCMEvent } from 'react-native-fcm';
import UserHomeView from './Item/UserHomeView';
// import { deleteFlightById } from '../../DbLocal/FinishFlightRealm';
// import FirebaseNotificationsAsync from '../Common/FirebaseNotificationsAsync';
// import CustomAvatar from '../Common/CustomAvatar';
// import MyView from '../../Core/View/MyView';
// import DrawerView from '../Common/DrawerView';
// import InteractiveTabView from '../Social/InteractiveTabView';
import ButtonChatInHome from '../Chats/ButtonChatInHome';
import { notification } from '../../Services/NotificationManager';
// import firebase from '../../Services/firebase';
// import siginFirebase from '../../Services/SignInFirebase';
import HomeNavigatorView from './HomeNavigatorView';
import FloatBtnActionView from '../Common/FloatBtnActionView';
import Constant from '../../Constant/Constant';
import PropsStatic from '../../Constant/PropsStatic';
// import ChatManager from '../../Services/ChatManager';
let { height } = Dimensions.get('window');
// import ListButtonHome from './ListButtonView';
import DialogConfirm from '../Popups/DialogConfirm';
import DataManager from '../../Core/Manager/DataManager';
import I18n from 'react-native-i18n';
require('../../../I18n/I18n');
import { Body, Header, List, ListItem as Item, ScrollableTab, Tab, TabHeading, Tabs, Title, Icon } from "native-base";
import HeaderScreen from './Screens/HeaderScreen';
import FinishFlightScreen from './Screens/FinishFlightScreen';
import ProfileScreen from './Screens/ProfileScreen';
import FriendFlightScreen from './Screens/FriendFlightScreen';
import NewsScreen from './Screens/NewsScreen';
import EventView from '../Events/EventHomeView';
import NotificationScreen from './Screens/NotificationScreen';
import { verticalScale } from '../../Config/RatioScale';
import ComponentBadgeChat from '../Badges/ComponentBadgeChat';

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const HOME_HEADER_HEIGHT = verticalScale(130);
const STATUSBAR_HEIGHT = 25;
const SCROLL_HEIGHT = HOME_HEADER_HEIGHT - STATUSBAR_HEIGHT;

const tabHeight = verticalScale(40);
const tWidth = SCREEN_WIDTH/6;

export default class HomeViewTest extends BaseComponent {

    nScroll = new Animated.Value(0);
    scroll = new Animated.Value(0);

    tabY = this.nScroll.interpolate({
        inputRange: [0, SCROLL_HEIGHT],
        outputRange: [0, -SCROLL_HEIGHT],
        extrapolate: 'clamp'
    });

    imgOpacity = this.nScroll.interpolate({
        inputRange: [0, SCROLL_HEIGHT],
        outputRange: [1, 0],
    });

    constructor(props) {
        super(props);
        this.userProfile = this.getUserInfo().getUserProfile();
        this.uid = this.getUserInfo().getId();
        this.navigation = this.props.screenProps;
        this.onDeleteFlightClick = this.onDeleteFlight.bind(this);
        this.flightDeleted;
        this.isLoadFlight = false;
        this.unFinishCount = '';
        this.flatListOffset = 0;
        this.createFlightShowing = true;
        // this.state = {
        //     fadeIn: new Animated.Value(0),
        //     // fadeOut: new Animated.Value(1),
        // };

        this.onAvatarClick = this.onAvatarClick.bind(this);
        this.onViewDetailHandicapIndex = this.onViewDetailHandicapIndex.bind(this);
        this.onCertificateClick = this.onCertificateClick.bind(this);
        this.onHandicapFlagClick = this.onHandicapFlagClick.bind(this);
        // this.onCategoryPress = this.onCategoryPress.bind(this);
        this.updateUnFinishCounter = this.updateUnFinishCounter.bind(this);
        // this.onItemFinishFlightClick = this.onItemFinishFlightClick.bind(this);
        // this.onItemFriendFlightClick = this.onItemFriendFlightClick.bind(this);
        this.userProfileCallback = this.userProfileCallback.bind(this);
        this.onViewPagerChange = this.onViewPagerChange.bind(this);
        // this.onEnterScoreListener = this.onEnterScoreListener.bind(this);
        this.onCloseScorecardListener = this.onCloseScorecardListener.bind(this);
        this.onViewMemoryScorecard = this.onViewMemoryScorecard.bind(this);
        this.onFriendCloseScorecardListener = this.onFriendCloseScorecardListener.bind(this);
        this.onViewInteractUserPress = this.onViewInteractUserPress.bind(this);
        this.onChatClick = this.onChatClick.bind(this);
        this.onOpenUpgradeAccount = this.onOpenUpgradeAccount.bind(this);
        this.onSystemRankingPress = this.onSystemRankingPress.bind(this);

        this.showDetailTimeHandicap = this.showDetailTimeHandicap.bind(this);
        // this.chatManager = new ChatManager();
        // this.chatManager.initListingMsg();
        //this.event_count = 0;
        //event_count = 0;
        this.isScroll = false;
        this.state = {
            user_id: '',
            user_handicap: '',
            isShowInteractive: false,
            // scrollY: new Animated.Value(0),
        }
        PropsStatic.setCallFun(Constant.NAVIGATOR_SCREEN.HOME, this.setTitle.bind(this));
    }

    static navigationOptions = ({ navigation }) => {
        const { params } = navigation.state;
        console.log('...........................params : ', params);
        if (!params) {
            return {
                title: I18n.t("home"),
                tabBarLabel: I18n.t("home")
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

    setTitle() {
        console.log("........................set title : ", this.t('home'));
        this.props.navigation.setParams({
            title: this.t('home')
        });
    }

    /**
     * Hiển thị chi tiết về điểm handicap index
     */
    onViewDetailHandicapIndex() {
        if (this.getUserInfo().getUserProfile().getUrlInfoHandicap().length) {
            this.navigation.navigate('handicap_info');
        }
    }

    // /**
    //  * render lai button hien thi so tin nhan
    //  */
    // renderView() {
    //     if (this.btnChatInHome) {
    //         this.btnChatInHome.setCountNotify(notification.countNotification);
    //     }
    // }
                            
    /**
     * Update count thông báo(hệ thống,bạn bè)
     */
    updateCountSystemNotify(_count,isRemove = false){
        if(!this.refBadgeNotification) return;
        if(!isRemove){
            this.refBadgeNotification.updateView(_count);
        }else{
            this.refBadgeNotification.removeCount(_count);
        }
    }

    /**
     * Update tổng số sự kiện sắp diễn ra
     * @param {Number} _count Tổng số sự kiện sắp diễn ra 
     */
    updateCountEventComingsoom(_count){
        if(!this.refBadgeEvent) return;
        this.refBadgeEvent.updateView(_count);
    }

    /**
     * Update tổng số tin tức mới
     * @param {Number} _count Tổng số tin tức
     */
    updateCountNews(_count){
        if(!this.refBadgeNews) return;
        this.refBadgeNews.updateView(_count);
    }

    onChatClick() {
        // this.navigation.navigate('list_chat');//chart
        this.navigation.navigate('select_course_view');//chart
    }

    shouldComponentUpdate() {
        return false;
    }

    showDetailTimeHandicap() {
        this.popupNotificationFull.setMsg(this.t('time_calculate_handicap'));
    }

    /**
     * Xem chi tiết về hạng tổng
     */
    onSystemRankingPress() {
        let dialog = PropsStatic.getDialogMessageApp();
        if (dialog) {
            dialog.setMsg(this.t('system_ranking_popup'))
        } else {
            this.popupNotificationFull.setMsg(this.t('system_ranking_popup'));
        }
    }

    renderTabIcon(page, active) {
        switch (page) {
            case 0:
                return (
                    <Image
                        source={this.getResources().golf_player}
                        style={[{ width: 25, height: 25, resizeMode: 'contain', tintColor: active ? '#00aba7' : '#A5A5A5' }]}
                    />
                )
            case 1:
                return (
                    <Image
                        source={this.getResources().ic_friend_select}
                        style={[{ width: 35, height: 35, resizeMode: 'contain', tintColor: active ? '#00aba7' : '#A5A5A5' }]}
                    />
                )
            case 2:
                return (
                    <Image
                        source={this.getResources().profile}
                        style={[{ width: 25, height: 25, resizeMode: 'contain', tintColor: active ? '#00aba7' : '#A5A5A5' }]}
                    />
                )
            case 3:
                if (global.count_notifycation <= 0) {
                    return (
                        <Image
                            source={this.getResources().icon_home_noti}
                            style={[{ width: 25, height: 25, resizeMode: 'contain', tintColor: active ? '#00aba7' : '#A5A5A5' }]}
                        />
                    )
                } else {
                    return (
                        <View>
                            <Image
                                style={{ width: 25, height: 25, resizeMode: 'contain', tintColor: active ? '#00aba7' : '#A5A5A5' }}
                                source={this.getResources().icon_home_noti} />
                            {/* <ImageBackground style={{ position: 'absolute', top: -5, right: -6, width: 20, height: 20, justifyContent: 'center', alignItems: 'center' }}
                                resizeMode={'contain'}
                                source={this.getResources().bg_notifi_count}
                            >
                                <Text style={{ fontSize: 11, color: 'white', textAlign: 'center' }}>
                                    {global.count_notifycation}
                                </Text>
                            </ImageBackground> */}
                        </View>
                    )
                }
            case 4:
                return (
                    <Image
                        source={this.getResources().GolfNews_Logo}
                        style={[{ width: 35, height: 35, resizeMode: 'contain', tintColor: active ? '#00aba7' : '#A5A5A5' }]}
                    />
                )
            case 5:
                global.event_count = 2;
                if (!global.event_count) {
                    return (
                        <Image
                            source={this.getResources().event}
                            style={[{ width: 25, height: 25, resizeMode: 'contain', tintColor: active ? '#00aba7' : '#A5A5A5' }]}
                        />
                    );
                } else {
                    return (
                        <View>
                            <Image
                                style={{ width: 25, height: 25, resizeMode: 'contain', tintColor: active ? '#00aba7' : '#A5A5A5' }}
                                source={this.getResources().event} />
                            {/* <ImageBackground style={{
                                position: 'absolute', zIndex: 100, top: -5, right: -6,
                                width: 20, height: 20, justifyContent: 'center', alignItems: 'center'
                            }}
                                resizeMode={'contain'}
                                source={this.getResources().bg_notifi_count}
                            >
                                <Text style={{ fontSize: 11, color: 'white', textAlign: 'center' }}>
                                    {global.event_count}
                                </Text>
                            </ImageBackground> */}
                        </View>
                    );
                }
            // return (
            //     <Image
            //         source={this.getResources().golf_player}
            //         style={[{ width: 25, height: 25, resizeMode: 'contain', tintColor: active ? '#00aba7' : '#A5A5A5' }]}
            //     />
            // )

            default:
                return null
        }

    }

    render() {
        // console.log('HomeView.render+++++++++++++++++++++++++++++++++++++++++')
        let {
            isShowInteractive,
            user_id,
            user_handicap,
            // scrollY,
        } = this.state;

        return (
            <View style={styles.container} >
                {this.renderLoading()}
                <PopupNotify ref={(popupNotify) => { this.popupNotify = popupNotify; }} />
                <StatusBar hidden={false} />

                <PopupUserHandicap
                    ref={(popupUserHandicap) => { this.popupUserHandicap = popupUserHandicap; }}
                    onCertificateClick={this.onCertificateClick}
                    onViewDetaiTimeHandicap={this.showDetailTimeHandicap}
                    onViewDetailHandicapIndex={this.onViewDetailHandicapIndex}
                    onSystemRankingPress={this.onSystemRankingPress} />

                {/* <Animated.View style={[{
                    backgroundColor: 'rgba(0,0,0,0)',
                    // position: 'absolute',
                    // right: 0,
                    // top: 0,
                    // left: 0,
                    transform: [{ translateY: translateY }], overflow: 'hidden'
                }, {}]}>

                    <Animated.View style={[{ opacity: heroTitleOpacity }]}> */}
                <Animated.View style={{
                    transform: [{ translateY: this.tabY }],
                    backgroundColor: '#00ABA7',
                    // opacity: this.imgOpacity,
                    zIndex: 1,
                    position: 'absolute',
                    left: 0,
                    right: 0,
                    top: 0,
                }}>
                    <Animated.View style={[{ opacity: this.imgOpacity }]}>
                        <UserHomeView
                            ref={(refUserHomeView) => { this.refUserHomeView = refUserHomeView; }}
                            onAvatarClick={this.onAvatarClick}
                            onHandicapFlagClick={this.onHandicapFlagClick}
                            // onCategoryPress={this.onCategoryPress}
                            userProfileCallback={this.userProfileCallback}
                            onOpenUpgradeAccount={this.onOpenUpgradeAccount}
                            onViewScorecard={this.onViewMemoryScorecard} />
                    </Animated.View>
                </Animated.View>
                {/* </Animated.View>
                </Animated.View> */}

                <Tabs
                    prerenderingSiblingsNumber={0}
                    onChangeTab={({ i }) => {
                        //   this.setState({height: this.heights[i], activeTab: i})
                        if (this.refFinishFlightScreen)
                            this.refFinishFlightScreen.setTabChange(this.offset);
                        if (this.refFriendFlightScreen)
                            this.refFriendFlightScreen.setTabChange(this.offset);
                        if (this.refProfileScreen)
                            this.refProfileScreen.setTabChange(this.offset);
                        if (this.refNotificationScreen)
                            this.refNotificationScreen.setTabChange(this.offset);
                        if (this.refNewsScreen)
                            this.refNewsScreen.setTabChange(this.offset);
                        if (this.refEventView)
                            this.refEventView.setTabChange(this.offset);
                    }}
                    // locked={true}
                    tabBarUnderlineStyle={{ backgroundColor: "white", height: 0 }}
                    renderTabBar={(props) => <Animated.View
                        style={{ transform: [{ translateY: this.tabY }], zIndex: 2, position: 'absolute', top: HOME_HEADER_HEIGHT, width: "100%", backgroundColor: "white" }}>
                        <ScrollableTab {...props}
                            style={{ backgroundColor: "white", borderWidth: 0, height: verticalScale(40) }}
                            renderTab={(name, page, active, onPress, onLayout) => (
                                <TouchableOpacity key={page}
                                    onPress={() => onPress(page)}
                                    onLayout={onLayout}
                                    activeOpacity={0.4}>
                                    <TabHeading
                                        style={{
                                            backgroundColor: "transparent",
                                            width: SCREEN_WIDTH / 6
                                        }}
                                        active={active}>
                                        {this.renderTabIcon(page, active)}

                                    </TabHeading>
                                </TouchableOpacity>
                            )}
                            underlineStyle={{ backgroundColor: 'rgba(0,0,0,0)' }}

                        />
                        <View style={{ position: 'absolute', width: SCREEN_WIDTH, height: tabHeight, flexDirection: 'row', alignItems: 'center', top: 0, left: 0 }}>
                            <View pointerEvents="none" style={{ width: tWidth, height: tabHeight, backgroundColor: 'transparent' }}></View>
                            <View pointerEvents="none" style={{ width: tWidth, height: tabHeight, backgroundColor: 'transparent' }}></View>
                            <View pointerEvents="none" style={{ width: tWidth, height: tabHeight, backgroundColor: 'transparent' }}></View>
                            <ComponentBadgeChat ref={(refBadgeNotification) => { this.refBadgeNotification = refBadgeNotification; }} tabWidth={tWidth} tabHeight={tabHeight} />
                            <ComponentBadgeChat ref={(refBadgeNews) => { this.refBadgeNews = refBadgeNews; }} tabWidth={tWidth} tabHeight={tabHeight} />
                            <ComponentBadgeChat ref={(refBadgeEvent) => { this.refBadgeEvent = refBadgeEvent; }} tabWidth={tWidth} tabHeight={tabHeight} />
                        </View>
                    </Animated.View>
                    }>

                    <Tab heading="Tab 1">
                        <FinishFlightScreen
                            ref={(refFinishFlightScreen) => { this.refFinishFlightScreen = refFinishFlightScreen; }}
                            scrollY={this.nScroll}
                            tabY={this.tabY} />
                    </Tab>
                    <Tab heading="Tab 2">
                        <FriendFlightScreen
                            ref={(refFriendFlightScreen) => { this.refFriendFlightScreen = refFriendFlightScreen; }}
                            scrollY={this.nScroll}
                            tabY={this.tabY} />
                    </Tab>
                    <Tab heading="Tab 3">
                        <ProfileScreen
                            ref={(refProfileScreen) => { this.refProfileScreen = refProfileScreen; }}
                            scrollY={this.nScroll}
                            tabY={this.tabY} />
                    </Tab>
                    <Tab heading="Tab 4">
                        <NotificationScreen
                            ref={(refNotificationScreen) => { this.refNotificationScreen = refNotificationScreen; }}
                            scrollY={this.nScroll}
                            tabY={this.tabY} />
                    </Tab>
                    <Tab heading="Tab 5">
                        <NewsScreen
                            ref={(refNewsScreen) => { this.refNewsScreen = refNewsScreen; }}
                            scrollY={this.nScroll}
                            tabY={this.tabY} />
                    </Tab>
                    <Tab heading="Tab 6">
                        <EventView
                            ref={(refEventView) => { this.refEventView = refEventView; }}
                            scrollY={this.nScroll}
                            tabY={this.tabY} />
                    </Tab>
                </Tabs>

                {/* <Animated.View style={{
                    flex: 0,
                    transform: [{ translateY: TabsTranslateY }],
                    overflow: 'hidden',
                    height: height - 100
                }}>

                    <HomeNavigatorView ref={(refHomeNavigator) => { this.refHomeNavigator = refHomeNavigator; }}
                        screenProps={this.navigation}
                        scrollCallback={Animated.event(
                            [{ nativeEvent: { contentOffset: { y: scrollY } } }],
                            // {useNativeDriver: true},
                            // {
                            //     // useNativeDriver: true,
                            //     listener: event => {
                            //         const offsetY = event.nativeEvent.contentOffset.y
                            //         // do something special
                            //         // this.isCloseToBottom(event.nativeEvent)
                            //         // console.log('scrollCallback', offsetY)
                            //         // let currentOffset = event.nativeEvent.contentOffset.y;
                            //         let isUp = (offsetY > 0 && offsetY > this.flatListOffset)
                            //             ? false
                            //             : true;
                            //         if (this.btnChatInHome && isUp !== this.createFlightShowing) {
                            //             console.log('............................... scorll : ', isUp);
                            //             this.btnChatInHome.setVisible(isUp);
                            //             this.createFlightShowing = isUp;
                            //         }

                            //         // Update your scroll position
                            //         this.flatListOffset = offsetY
                            //     },
                            // },
                        )}
                    />
                </Animated.View> */}
                {/* <IndicatorHomeView
                    ref={(indicatorHomeView) => { this.indicatorHomeView = indicatorHomeView; }}
                /> */}

                {/* <View style={styles.viewpaget_style}>
                    <Swiper showsButtons={false} loop={false} showsPagination={false} onIndexChanged={this.onViewPagerChange}>

                        <FinishFlightView
                            ref={(finishFlightView) => { this.finishFlightView = finishFlightView; }}
                            updateUnFinishCounter={this.updateUnFinishCounter}
                            onItemFinishFlightClick={this.onItemFinishFlightClick}
                            onDeleteFlightClick={this.onDeleteFlightClick}
                            onViewInteractUserPress={this.onViewInteractUserPress}
                            navigation={this.navigation}
                        />
                        <FriendFlightView
                            ref={(friendFlightView) => { this.friendFlightView = friendFlightView; }}
                            onItemFriendFlightClick={this.onItemFriendFlightClick}
                            onViewInteractUserPress={this.onViewInteractUserPress}
                            navigation={this.navigation} />
                    </Swiper>
                </View> */}
                <ButtonChatInHome ref={(btnChatInHome) => { this.btnChatInHome = btnChatInHome; }} chatClickCallback={this.onChatClick} />

                <PopupYesOrNo
                    ref={(popupDeleteFlight) => { this.popupDeleteFlight = popupDeleteFlight; }} />
                {this.renderMessageBar()}

                {/* <MyView hide={!isShowInteractive}
                    style={{ position: 'absolute', bottom: 0, top: 0, right: 0, left: 0 }}>
                    <DrawerView
                        ref={(refDrawerView) => this.refDrawerView = refDrawerView}
                        initialDrawerSize={0.6}
                        drawerBg='rgba(0,0,0,0)'
                        renderContainerView={() => <View style={{ flex: 1, backgroundColor: '#000000', opacity: 0.6 }} />}
                        renderDrawerView={() => (
                            <InteractiveTabView
                                ref={(refInteractiveTabView) => { this.refInteractiveTabView = refInteractiveTabView }}
                                uid={this.uid} />
                        )}
                        renderInitDrawerView={() => (<View style={{ marginTop: 25, height: 30, justifyContent: 'center', alignItems: 'center' }}>
                            <View style={{ height: 7, width: 80, borderRadius: 5, backgroundColor: '#FFF' }} />
                        </View>)}
                        onRequestClose={this.onRequestClose.bind(this)}
                    />
                </MyView> */}

                <PopupNotificationFull ref={(popupNotificationFull) => { this.popupNotificationFull = popupNotificationFull; }} />
                {/* <HomeLoading ref={(homeLoading) => { this.homeLoading = homeLoading; }} /> */}

                <DialogConfirm ref={(refDialogConfirm) => { this.refDialogConfirm = refDialogConfirm }} />
            </View>
        );
    }

    fadeOut() {
        this.state.fadeIn.setValue(1);
        Animated.timing(
            this.state.fadeIn,
            {
                toValue: 0,
                duration: 400,
            }
        ).start();
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

    /**
     * phong do
     */
    onAwardClick() {
        if (this.navigation) {
            this.navigation.navigate('award_view');
        }
    }

    /**
     * Vao man hinh notification
     */
    onNotifyClick() {
        if (this.navigation) {
            this.navigation.navigate('notification_view');
        }
    }

    /**
     * review san
     */
    onFacilityClick() {
        if (this.navigation) {
            this.navigation.navigate('facility_view');
        }
    }

    /**
    * click vào button tạo sự kiện
    */
    openEventScreen() {
        if (!global.is_profile_loaded) {
            return;
        }
        if (this.navigation) {
            this.navigation.navigate('club_event_view',
                {
                    'refresh_count_event': this.sendRequestRefeshProfile.bind(this),
                    "view_all": true,
                    "isPersonal": true
                });
        }
    }

    openLeaderboardScreen() {
        if (!global.is_profile_loaded) {
            return;
        }
        if (this.navigation) {
            this.navigation.navigate('leaderboard');
        }
    }

    openNotificationScreen() {
        if (!global.is_profile_loaded) {
            return;
        }
        if (this.navigation) {
            this.navigation.navigate('notification_view');
        }
    }

    sendRequestRefeshProfile() {
        this.refUserHomeView.sendRequestRefeshProfile();
    }

    componentDidMount() {
        // console.log('HomeView.componentDidMount')
        PropsStatic.setMainAppComponent(this);
        this.registerMessageBar();
        // notification.setRenderView(this.renderView.bind(this));
        // this.popupDeleteFlight.setMsg(this.t('delete_flight_content'));
        // this.popupDeleteFlight.okCallback = this.onConfirmDeleteFlight.bind(this);

        /**
         * refresh lai man hinh profile
         */
        if (global.load_refresh_profile) {
            this.sendRequestRefeshProfile();
            global.load_refresh_profile = false;
            return;
        }

        this.registerNotification();
        if (Platform.OS === 'ios') {
            DataManager.loadCheckLocalPermission((result) => {
                global.check_location = (result === 'true') ? true : false;
                if (!global.check_location) {

                    // if(this.refDialogConfirm){
                    //     this.refDialogConfirm.confirmCallback = this.getLocation.bind(this);
                    //     let content = this.t('localtion_permission');
                    //     this.refDialogConfirm.setContent(content);
                    // }
                    if (this.refDialogConfirm) {
                        let content = this.t('localtion_permission');
                        this.refDialogConfirm.okCallback = this.getLocation.bind(this);
                        this.refDialogConfirm.cancelCallback = this.cancelGetLocaltion.bind(this);
                        this.refDialogConfirm.setContent(content);
                    }
                }
            });
        }

        // global.check_location = check_location;

        // this.refHomeNavigator.scrollCallback = this.onScroll.bind(this);

        //TextStylePropTypes
        // this.Analytics.setUserId(this.state.user_id);

        // this.Analytics.logEvent('view_home', {
        //     'item_id': 'login'
        // });
        // firebase.analytics().setUserId('')
        // setTimeout(()=>{
        //     this.refUserHomeView.animationUnexpan();
        // },5000);
    }

    onScroll(isTop) {
        Animated.event(
            [{ nativeEvent: { contentOffset: { y: this.state.scrollY } } }],
            {
                // useNativeDriver: true,
                listener: event => {
                    const offsetY = event.nativeEvent.contentOffset.y
                    // do something special
                    // this.isCloseToBottom(event.nativeEvent)
                    // console.log('onScroll.offsetY', offsetY)
                },
            },
        )

        // if (!isTop) {
        //     this.refUserHomeView.animationUnexpan();
        // } else {
        //     this.refUserHomeView.animationExpan();
        // }
    }

    componentWillUnmount() {
        this.unregisterMessageBar();
        PropsStatic.setMainAppComponent(null);
        console.log('..................... HomeView out');
        // this.fadeOut();
    }


    // this._getLocationAsync();
    // global.check_location = true;
    // }

    //TextStylePropTypes
    // this.Analytics.setUserId(this.state.user_id);

    onOpenUpgradeAccount() {
        this.navigation.navigate('payment', { onUpgradeSuccess: this.onUpgradeSuccess.bind(this) });
    }

    onUpgradeSuccess(isVipAccount) {
        if (isVipAccount && this.refUserHomeView)
            this.refUserHomeView.refreshUpgradeSuccess();
    }

    //     _getLocationAsync = async () => {
    //         try {
    //             let { status } = await Permissions.askAsync(Permissions.LOCATION);
    //             if (status !== 'granted') {
    //                 console.log('errorMessage', 'Permission to access location was denied');
    //             } else {
    //                 console.log('Permission.accepted');

    //                 Location.getCurrentPositionAsync({}, this.saveLocation.bind(this), (errorCallback) => {
    //                     if (errorCallback && errorCallback.code === 2) {
    //                         Alert.alert(
    //                             this.t('gps_off'),
    //                             this.t('gps_for_app'),
    //                             [
    //                                 { text: this.t('cancel'), onPress: () => { }, style: 'cancel' },
    //                                 {
    //                                     text: this.t('ok'), onPress: () => {
    //                                         if (Platform.OS === 'ios') {
    //                                             Linking.openURL('app-settings:');
    //                                         } else {
    //                                             IntentActivityAndroid.startActivityAsync(IntentActivityAndroid.ACTION_LOCATION_SOURCE_SETTINGS);
    //                                         }
    //     // this.Analytics.logEvent('view_home', {
    //     //     'item_id': 'login'
    //     // });
    //     // firebase.analytics().setUserId('')

    // }

    getLocation() {
        this._getLocationAsync();
        DataManager.saveLocation(true);
        global.check_location = true;
        // global.check_location = true;
    }

    cancelGetLocaltion() {
        DataManager.saveLocation(true);
        global.check_location = true;
    }

    userProfileCallback(userProfile) {
        this.userProfile = userProfile;
        this.popupUserHandicap.setDataChange(userProfile);
    }

    _getLocationAsync = async () => {
        try {
            let { status } = await Permissions.askAsync(Permissions.LOCATION);
            if (status !== 'granted') {
                console.log('errorMessage', 'Permission to access location was denied');
            } else {
                console.log('Permission.accepted');

                Location.getCurrentPositionAsync({}, this.saveLocation.bind(this), (errorCallback) => {
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


    saveLocation(location) {
        if (location.coords && location.coords.latitude && location.coords.longitude) {
            UserInfo.setLatitude(location.coords.latitude);
            UserInfo.setLongitude(location.coords.longitude);
            // console.log('latitude', UserInfo.getLatitude(), 'longitude', UserInfo.getLongitude());
        }

    }
    onCertificateClick() {
        this.navigation.navigate('certificate', { orientationPortrait: this.orientationPortrait.bind(this) });
    }

    orientationPortrait() {
        this.rotateToPortrait();
    }

    onViewPagerChange(index) {
        console.log('onViewPagerChange')
        this.indicatorHomeView.setDataChange(index, this.unFinishCount)
        if (!this.isLoadFlight) {
            this.friendFlightView.checkLoadData();
            this.isLoadFlight = true;
        }
    }

    onAvatarClick() {
        console.log('onAvatarClick');
        if (!global.is_profile_loaded) {
            return;
        }
        if (this.navigation != null) {
            this.navigation.navigate('persional_information', { "puid": this.uid });
        }
    }

    onHandicapFlagClick() {
        if (!global.is_profile_loaded) {
            return;
        }
        this.popupUserHandicap.show();
    }

    showLoading() {
        if (this.loading) {
            this.loading.showLoading();
        }
    }

    hideLoading() {
        if (this.loading) {
            this.loading.hideLoading();
        }
    }

    /**
     * Các trận của bạn bè
     */
    // onItemFriendFlightClick(flight) {
    //     this.showLoading();
    //     let url = this.getConfig().getBaseUrl() + ApiService.view_flight_detail(flight.getId());
    //     console.log('url', url);
    //     let self = this;
    //     Networking.httpRequestGet(url, (jsonData) => {
    //         self.hideLoading();
    //         self.model = new FlightDetailModel(self);
    //         self.model.parseData(jsonData);
    //         if (self.model.getErrorCode() === 0) {
    //             self.props.parentNavigator.navigate('scorecard_view', { onCloseScorecard: self.onFriendCloseScorecardListener.bind(self), 'FlightDetailModel': self.model });
    //         } else {
    //             self.popupNotify.setMsg(self.model.getErrorMsg())
    //         }
    //     }, () => {
    //         //time out
    //         self.hideLoading();
    //         self.showErrorMsg(self.t('time_out'));
    //     });
    // }

    /**
     * Các trận của bạn bè
     */
    onItemFriendFlightClick(flight) {
        this.onOpenScorecard(flight.getId());
    }

    onFriendCloseScorecardListener() {
        this.rotateToPortrait();
    }

    onCloseScorecardListener() {
        this.rotateToPortrait();
        // this.requestFriendFlightList();
        this.finishFlightView.syncFinishFlightList();
    }

    /**
     * Các trận đã chơi/chưa hoàn thành
     */

    updateUnFinishCounter(count) {
        this.unFinishCount = count;
        this.indicatorHomeView.setDataChange(0, count);
    }

    // onItemFinishFlightClick(flight) {
    //     if (flight.getFlight() && flight.getFlight().getSource() === 'image' && flight.getType() === 'unfinished') {
    //         this.navigation.navigate('upload_flight_image', { 'RoundItemModel': flight });
    //     } else {
    //         this.showLoading();
    //         let url = this.getConfig().getBaseUrl() + ApiService.view_flight_detail(flight.getFlightId());
    //         let self = this;
    //         console.log('url', url);
    //         Networking.httpRequestGet(url, (jsonData) => {
    //             // console.log('onItemFriendFlightClick', JSON.stringify(jsonData));
    //             self.hideLoading();
    //             try {

    //                 self.model = new FlightDetailModel(self);
    //                 self.model.parseData(jsonData);
    //                 //console.log("view flight : ",self.model.getErrorMsg());
    //                 if (self.model.getErrorCode() === 0) {
    //                     let userRounds = self.model.getFlight().getUserRounds();
    //                     let user = userRounds.find((userRound) => {
    //                         return userRound.getUserId() === self.userProfile.getId();
    //                     });
    //                     if (user && user.getSubmitted() === 1) {
    //                         self.openScoreView(0, self, self.model);
    //                     } else {
    //                         self.openScoreView(1, self, self.model);
    //                     }
    //                 } else {
    //                     self.popupNotify.setMsg(self.model.getErrorMsg());
    //                 }
    //             } catch (error) {
    //                 console.log('onItemFinishFlightClick.error', error)
    //             }
    //         }, () => {
    //             //time out
    //             self.hideLoading();
    //             self.showErrorMsg(self.t('time_out'));
    //         });
    //     }

    // }

    // openScoreView(type, self, FlightDetailModel) {
    //     let flight = FlightDetailModel.getFlight();
    //     let playerList = flight.getUserRounds();
    //     let indexMe = playerList.findIndex((user) => {
    //         return self.uid.toString().indexOf('VGA') > -1 ? user.getUser().getUserId() === self.uid : user.getUserId() === self.uid;
    //     });
    //     let isHostUser = false;
    //     if (indexMe != -1) {
    //         playerList.splice(0, 0, ...playerList.splice(indexMe, 1));
    //         try {
    //             if (playerList.length > 0 && playerList[0].getSttUser() === 1) {
    //                 isHostUser = true;
    //             }
    //         } catch (error) {
    //             console.log('parseCourseData.isHostUser.error', error);
    //         }

    //     }

    //     if (type === 0) {
    //         self.navigation.navigate('scorecard_view',
    //             {
    //                 onCloseScorecard: self.onCloseScorecardListener,
    //                 'FlightDetailModel': FlightDetailModel,
    //                 'isHostUser': isHostUser
    //             });
    //     } else {
    //         self.navigation.navigate('enter_flight_score_view',
    //             {
    //                 'FlightDetailModel': FlightDetailModel,
    //                 'isHostUser': isHostUser,
    //                 onDispatchCallback: self.onEnterScoreListener
    //             });
    //     }

    // }

    onViewMemoryScorecard(flightId) {
        this.onOpenScorecard(flightId);
    }

    onOpenScorecard(flightId) {
        this.showLoading();
        let url = this.getConfig().getBaseUrl() + ApiService.view_flight_detail(flightId);
        console.log('url', url);
        let self = this;
        Networking.httpRequestGet(url, (jsonData) => {
            self.hideLoading();
            self.model = new FlightDetailModel(self);
            self.model.parseData(jsonData);
            if (self.model.getErrorCode() === 0) {
                self.props.parentNavigator.navigate('scorecard_view', { onCloseScorecard: self.onFriendCloseScorecardListener, 'FlightDetailModel': self.model });
            } else {
                self.popupNotify.setMsg(self.model.getErrorMsg())
            }
        }, () => {
            //time out
            self.hideLoading();
            self.showErrorMsg(self.t('time_out'));
        });
    }

    // onEnterScoreListener() {
    //     this.finishFlightView.syncFinishFlightList();
    // }

    onDeleteFlight(flight) {
        this.flightDeleted = flight;
        this.popupDeleteFlight.show();
    }

    // onConfirmDeleteFlight() {
    //     // this.loading.showLoading();
    //     let self = this;
    //     let url = this.getConfig().getBaseUrl() + ApiService.out_flight(this.flightDeleted.getFlightId());
    //     console.log('url', url, this.flightDeleted.getId());
    //     Networking.httpRequestGet(url, this.onDeleteFlightResponse.bind(this, this.flightDeleted.getFlightId()), () => {
    //         //time out
    //         // self.loading.hideLoading();
    //         self.showErrorMsg(self.t('time_out'));
    //     });
    // }

    // onDeleteFlightResponse(flightId, jsonData) {
    //     console.log('onDeleteFlightResponse', jsonData);
    //     // this.loading.hideLoading();
    //     try {
    //         let error_code;
    //         if (jsonData != null && jsonData.hasOwnProperty('error_code')) {
    //             error_code = jsonData['error_code'];
    //         }
    //         if (error_code != null && error_code === 0) {
    //             if (jsonData.hasOwnProperty("error_msg")) {
    //                 let error = jsonData['error_msg']; //"Bạn đã ra khỏi flight thành công"
    //                 this.showSuccessMsg(error);
    //             }
    //             deleteFlightById(flightId);
    //             this.finishFlightView.onRemoveFlight(flightId);
    //         } else {
    //             if (jsonData.hasOwnProperty("error_msg")) {
    //                 this.showErrorMsg(jsonData['error_msg']);
    //             }
    //         }
    //     } catch (error) {
    //         console.log('onDeleteFlightResponse.error', error);
    //     }
    // }

    //interactive_players 
    onViewInteractUserPress(flightId) {

        this.setState({
            isShowInteractive: true
        }, () => {
            if (this.refInteractiveTabView)
                this.refInteractiveTabView.setFlightId(flightId);
            if (this.refDrawerView)
                this.refDrawerView.slideUp();
        })
    }

    onRequestClose() {
        if (this.refDrawerView)
            this.refDrawerView.slideDown();
        setTimeout(() => {
            this.setState({
                isShowInteractive: false
            })
        }, 500)

    }
}


