import React from 'react';
import {
    Keyboard,
    Platform,
    View,
    Image,
    StyleSheet,
    Dimensions,
    AppState
} from 'react-native';
import { TabNavigator, TabBarBottom, SafeAreaView } from 'react-navigation';//TabBarBottom
import BaseComponent from '../Core/View/BaseComponent';
import HomeView from '../Components/Home/HomeView';
import ShoppingView from '../Components/Shop/ShoppingView';
import MenuView from '../Components/Menu/MenuView';
import FirebaseNotificationsAsync from '../Components/Common/FirebaseNotificationsAsync';
import DataManager from '../Core/Manager/DataManager';
import Constant from '../Constant/Constant';
// import SocialNewsView from '../Components/CLB/SocialNewsView';
import I18n from 'react-native-i18n';
require('../../I18n/I18n');
import Files from '../Components/Common/Files';
// import LeaderBoardView from '../Components/LeaderBoard/LeaderBoardView';
import FacilityView from '../Components/Facilities/FacilityNavigatorView';

import PropsStatic from '../Constant/PropsStatic';
import ListChatScreen from '../Components/Chats/ListChats/Screen/ListChatScreen';
import { fontSize, scale, verticalScale } from '../Config/RatioScale';
import ApiService from '../Networking/ApiService';
import Networking from '../Networking/Networking';
import TopLeaderboardView from '../Components/LeaderBoard/TopLeaderboardView';
import DialogConfirm from '../Components/Popups/DialogConfirm';
import StaticProps from '../Constant/PropsStatic';
// import ListenerChatMessager from '../Services/ListenerChatMessager';
// import { load_fuid_firebase } from '../Core/Manager/DataManager';

// import registerListenerChat from '../Services/RegisterListennerChat';
import ComponentBadgeChat from '../Components/Badges/ComponentBadgeChat';
import PopupMessage from '../Components/Popups/PopupMessage';
// import RegisterListennerChat from '../Services/RegisterListennerChat';

const tabHeight = verticalScale(60);
let { width } = Dimensions.get('window');
let tabWidth = width / 6;

// const db = SQLite.openDatabase('VHandicap');

const TabScreen = TabNavigator(
    {
        HomeView: {
            screen: HomeView,
            navigationOptions: {
                title: I18n.t('home'),
                tabBarIcon: ({ tintColor }) => (
                    <Image
                        source={Files.sprites.ic_home_focus}
                        style={[styles.icon, { tintColor: tintColor }]}
                    />
                )
            }
        },
        ListChatScreen: {
            screen: ListChatScreen,
            navigationOptions: {
                title: I18n.t('chat'),

                tabBarIcon: ({ tintColor }) => {
                    global.total_chat = 10;
                    if (global.total_chat > 0) {
                        return (
                            <Image
                                source={Files.sprites.ic_home_disccuss}
                                style={[styles.icon, { tintColor: tintColor }]}
                            />
                        );
                    } else {
                        return (
                            <Image
                                source={Files.sprites.ic_home_disccuss}
                                style={[styles.icon, { tintColor: tintColor }]}
                            />
                        );
                    }
                }
            }
        },
        // FriendView: {
        //     screen: FriendView,
        //     navigationOptions: {
        //         title: I18n.t('handicap'),
        //         tabBarIcon: ({ tintColor }) => (
        //             <Image
        //                 source={Files.sprites.ic_home_hdc}
        //                 style={[styles.icon, { tintColor: tintColor }]}
        //             />
        //         )
        //     }
        // },
        LeaderBoardView: {
            screen: TopLeaderboardView,
            navigationOptions: {
                title: I18n.t('leaderboard_title'),
                tabBarIcon: ({ tintColor }) => (
                    <Image
                        source={Files.sprites.ic_home_leaderboard}
                        style={[styles.icon, { tintColor: tintColor }]}
                    />
                )
            }
        },

        FacilityView: {
            screen: FacilityView,
            navigationOptions: {
                title: I18n.t('golf_course'),
                tabBarIcon: ({ tintColor }) => (
                    <Image
                        source={Files.sprites.ic_home_course}
                        style={[styles.icon, { tintColor: tintColor }]}
                    />
                )
            }
        },
        ShoppingView: {
            screen: ShoppingView,
            navigationOptions: {
                title: I18n.t('shop'),
                tabBarIcon: ({ tintColor }) => (
                    <Image
                        source={Files.sprites.ic_shopping}
                        style={[styles.icon, { tintColor: tintColor }]}
                    />
                )
            }
        },

        MenuView: {
            screen: MenuView,
            navigationOptions: {
                title: I18n.t('menu'),
                tabBarIcon: ({ tintColor }) => (
                    <Image
                        source={Files.sprites.ic_menu}
                        style={[styles.icon, { tintColor: tintColor }]}
                    />
                )
            }
        }
    },
    {
        tabBarComponent: TabBarBottom,
        navigationOptions: ({ navigation }) => ({
            header: null//<Header/>
        }),
        tabBarOptions: {
            activeTintColor: '#00aba7',
            allowFontScaling: false,
            inactiveTintColor: '#ABABAB',
            upperCaseLabel: false,
            activeBackgroundColor: '#F3F2F4',
            inactiveBackgroundColor: '#F3F2F4',
            showLabel: true,
            showIcon: true,
            labelStyle: {
                fontSize: fontSize(12, -2),
                // marginTop: scale(5),
                marginBottom: scale(7),
                // backgroundColor : 'green'
            },
            // tabStyle: styles.tabStyle,
            style: {
                height: tabHeight,
            },
            iconStyle: {
                // marginTop : scale(7),
                // width : 22,
                // height : 22,
                // backgroundColor : 'red'
            },
            // indicatorStyle: styles.indicatorStyle
        },
        tabBarPosition: 'bottom',
        animationEnabled: false,
        swipeEnabled: true,
        lazy: true,
        // backgroundColor: 'rgba(249, 249, 249, 0.8)'
    }
);

export default class AppScene extends BaseComponent {

    constructor(props) {
        super(props);
        this.fuid = '';
        this.isIphoneX = this.getAppUtil().isIphoneX();
    }

    /**
     * Load id firebase tu local
     * @param {String} fuid id firebase của user 
     */
    loadFuidFromLocal(fuid) {
        this.getUserInfo().setFuid(fuid);
        this.fuid = fuid;
        // this.listenerChatMessager.initListener('chat',PropsStatic.getObjectCallFun()[Constant.NAVIGATOR_SCREEN.CHAT]);
        console.log('...................local load : ', fuid);
    }

    handleAppStateChange = (nextAppState) => {
        if (nextAppState === 'inactive') {
            console.log('the app is closed');
            // RegisterListennerChat.destroy();
        }
    }

    componentWillUnmount() {
        this.unregisterMessageBar();

        AppState.removeEventListener('change', this.handleAppStateChange);
        // AppStateIOS.removeEventListener('change',this.handleAppStateChange);

        // if (this.interval) {
        //     clearInterval(this.interval);
        // }

        // if (registerListenerChat) {
        //     registerListenerChat.unRegisterHandle();
        // }
    }

    switchScreen(index) {
        if (this.state.index != index) {
            this.setState({
                index: index
            });
        }

    }
    parentNavigator() {
        this.props.navigation.navigate('main_menu', {
            'parentNavigator': this.props.navigation, 'phone': '09'
        }
        );
    }

    updateBadgeChat(_countChat) {
        if (this.refBadgeChat) {
            this.refBadgeChat.updateView(_countChat);
        }
    }

    render() {
        return (
            <View style={[{ flex: 1, backgroundColor: '#FFFFFF' }, this.isIphoneX ? { paddingBottom: 0 } : {}]}>
                {/* <AppComponent
                    ref={(appComponent) => { this.appComponent = appComponent; }}
                    parentNavigator={this.props.navigation}
                    grandparentNavigation={this.props.screenProps.grandparentNavigation}
                    onStartTutorialUpgrade={this.onStartTutorialUpgrade} />
                <BottomMenu
                    ref={(bottomMenu) => { this.bottomMenu = bottomMenu; }}
                    switchMenuCallback={this.switchScreen}
                    onStartTutorialUpgradeNext={this.onStartTutorialUpgradeNext}
                /> */}
                <TabScreen screenProps={this.props.navigation} grandparentNavigation={this.props.screenProps.grandparentNavigation} />
                {this.renderMessageBar()}
                <DialogConfirm ref={(dialogConfirm) => { this.dialogConfirm = dialogConfirm; }}
                    cancelText={this.t('cancel')}
                    confirmText={this.t('confirm')} />
                <PopupMessage ref={(dialogMessage) => { this.dialogMessage = dialogMessage; }} />
                <View style={[styles.view_absolute, this.isIphoneX ? { bottom: 35 } : { bottom: 0 }]}
                    pointerEvents={'none'}>
                    <View pointerEvents="none" style={styles.view_item}></View>
                    <ComponentBadgeChat ref={(refBadgeChat) => { this.refBadgeChat = refBadgeChat; }} tabWidth={tabWidth} tabHeight={tabHeight} />
                    <View pointerEvents="none" style={styles.view_item}></View>
                    <View pointerEvents="none" style={styles.view_item}></View>
                    {/* <View pointerEvents="none" style={{ width: tabWidth, height: tabHeight, backgroundColor: 'transparent' }}>
                        {this.getElementCountChat()}
                    </View> */}
                    <View pointerEvents="none" style={styles.view_item}></View>
                    <View pointerEvents="none" style={styles.view_item}></View>
                </View>
            </View>
        );
    }

    onStartTutorialUpgrade() {
        console.log('onStartTutorialUpgrade.AppScene');
        this.bottomMenu.setChangeState(true);
    }

    onStartTutorialUpgradeNext() {
        console.log('onStartTutorialUpgradeNext.AppScene');
    }

    checkRequestCountNotify() {
        // this.Logger().log("refresh count notify ",global.change_notify);
        if (global.change_notify && !this.waiting_for_request_count_notify) {
            this.sendRequestCountNotification();
            this.waiting_for_request_count_notify = true;
        }
    }

    /**
      * Gửi request lấy số lượng notification
      */
    sendRequestCountNotification() {
        // reyturn;
        let url = this.getConfig().getBaseUrl() + ApiService.notification_count();
        console.log("url count notify : ", url);
        let self = this;
        Networking.httpRequestGet(url, (jsonData) => {
            console.log("jsonData : ", jsonData);
            if (jsonData.hasOwnProperty('error_code')) {
                let error_code = jsonData['error_code'];
                // let total = 0;
                if (error_code === 0) {
                    if (jsonData.hasOwnProperty('data')) {
                        let data = jsonData['data'];
                        // total = data['total_count_display'];// || 0;
                        global.change_notify = false;
                        self.waiting_for_request_count_notify = false;
                        //
                        //NotifyConstant.setCountNotifyFriend(data['friend_count_display']);
                        // global.count_notifycation = data['notification_count_display'];
                        // global.count_news = data['magazine_count_display'];
                        // global.count_friends = data['friend_count_display'];

                        let count_notifycation = data['total_count_display'];
                        let count_news = data['magazine_count_display'];
                        let _app = PropsStatic.getMainAppComponent();
                        if (_app) {
                            _app.updateCountSystemNotify(count_notifycation);
                            _app.updateCountNews(count_news);
                        }
                        // global.count_friends = data['friend_count_display'];
                    }
                }
            }
        }, () => {
            self.waiting_for_request_count_notify = false;
        });
    }

    componentDidMount() {
        PropsStatic.setAppSceneNavigator(this.props.navigation);
        PropsStatic.setParentNavigator(this.props.screenProps.grandparentNavigation);

        // this.handleBackButtonClick();

        FirebaseNotificationsAsync();

        AppState.addEventListener('change', this.handleAppStateChange);
        // AppStateIOS.addEventListener('change',this.handleAppStateChange)

        PropsStatic.setBadgeChat(this.updateBadgeChat.bind(this));

        this.rotateToPortrait();

        if (this.dialogConfirm) {
            StaticProps.setDialogApp(this.dialogConfirm);
        }
        if (this.dialogMessage) {
            StaticProps.setDialogMessageApp(this.dialogMessage);
        }

        // this.interval = setInterval(() => {
        //     this.checkRequestCountNotify();//3 giay check 1 phat neu thay doi thi request len sever
        // }, 3000);
        // this.sendRequestCountNotification();
        // db.transaction(tx => {
        //     tx.executeSql(
        //         `create table if not exists ${global.db_table[0].name} (${global.db_table[0].colum[0]} text, ${global.db_table[0].colum[1]} text);`
        //     );
        // });
        Keyboard.dismiss();
        this.registerMessageBar();
        DataManager.loadSingleLocalData(Constant.LANGUAGE, (language) => {

            if (language) {
                this.getUserInfo().setLang(language);
                this.setLanguage(language);
            } else {
                this.getUserInfo().setLang('vn');
                this.setLanguage('vn');
            }

        }, () => {
            this.getUserInfo().setLang('vn');
            this.setLanguage('vn');
        });
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column'
    },
    icon: {
        width: scale(22),
        height: scale(22),
        resizeMode: 'contain'
    },
    view_item: {
        width: tabWidth,
        height: tabHeight,
        backgroundColor: 'transparent'
    },
    view_absolute: {
        position: 'absolute',
        width: width,
        height: tabHeight,
        flexDirection: 'row',
        alignItems: 'center',
        left: 0
    }
});