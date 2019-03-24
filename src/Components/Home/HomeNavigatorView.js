import React from 'react';
import {
    // StyleSheet,
    View,
    Dimensions,
    // Platform,
    // ImageBackground,
    // Text,
    Image
} from 'react-native';
// import Touchable from 'react-native-platform-touchable';

import { TabNavigator, TabBarTop, TabBarBottom } from 'react-navigation';

import Files from '../Common/Files';
// import I18n from 'react-native-i18n';
import { verticalScale, fontSize, scale } from '../../Config/RatioScale';
require('../../../I18n/I18n');
// import FinishFlightView from './Item/FinishFlightView';
// import FriendFlightView from './Item/FriendFlightView';
// import PlayerInfoView from '../PlayerInfo/PlayerInfoView';
import NotifyNewsView from '../News/NewsView';
import ProfileScreen from './Screens/ProfileScreen';
// import EventView from '../Events/EventView';
import FinishFlightScreen from './Screens/FinishFlightScreen';
import FriendFlightScreen from './Screens/FriendFlightScreen';
import NewsScreen from './Screens/NewsScreen';

import EventView from '../Events/EventHomeView';
import NotificationScreen from './Screens/NotificationScreen';
import ComponentBadgeChat from '../Badges/ComponentBadgeChat';
import ApiService from '../../Networking/ApiService';
import Networking from '../../Networking/Networking';
import Config from '../../Config/Config';

import PropsStatic from '../../Constant/PropsStatic';

let { width } = Dimensions.get('window');
let tabWidth = width / 6;
let new_width = (2 * tabWidth) / 3;
let event_width = 24;// tabWidth / 3;
tabWidth = 26;// Math.round(tabWidth / 3);
let flight_width = verticalScale(32);
let flight_height = verticalScale(26);
let friend_width = verticalScale(32);
let friend_height = verticalScale(62);
let news_width = scale(36);
let news_height = verticalScale(32);

const tabHeight = verticalScale(45);
let tWidth = width / 6;
// let { width } = Dimensions.get('window');
// let tabWidth = width / 6;
// import { Constants } from '../../Core/Common/ExpoUtils';

// const screenWidth = Dimensions.get('window').width;
// let tabHeight = (Platform.OS === 'ios') ? 48 : 40;

const HomeTabNavigator = TabNavigator(
    {
        finish_flight: {
            screen: props => <FinishFlightScreen {...props} />,
            navigationOptions: {
                tabBarIcon: ({ tintColor }) => (
                    <Image
                        source={Files.sprites.golf_player}
                        style={[{ width: flight_width, height: flight_height, resizeMode: 'contain', tintColor: tintColor }]}
                    />
                )
            },
        },
        friend_flight: {
            screen: props => <FriendFlightScreen {...props} />,
            navigationOptions: {
                tabBarIcon: ({ tintColor }) => (
                    <Image
                        source={Files.sprites.ic_friend_select}
                        style={[{ width: 1.3 * tabWidth, height: 1.5 * tabWidth, resizeMode: 'contain', tintColor: tintColor }]}
                    // style={[{ width: friend_width, height: friend_height, resizeMode: 'contain', tintColor: tintColor }]}
                    />
                )
            }
        },
        profile: {
            screen: props => <ProfileScreen {...props} />,
            navigationOptions: {
                tabBarIcon: ({ tintColor }) => (
                    <Image
                        source={Files.sprites.profile}
                        style={[{ width: 1.4 * tabWidth, height: tabWidth, resizeMode: 'contain', tintColor: tintColor }]}
                    />
                )
            }
        },
        notify_notification: {
            screen: NotificationScreen,
            navigationOptions: {
                tabBarIcon: ({ tintColor }) => {
                    return (
                        <Image
                            source={Files.sprites.icon_home_noti}
                            style={[{ width: tabWidth, height: tabWidth, resizeMode: 'contain', tintColor: tintColor }]}
                        />
                    );

                    // if (global.count_notifycation <= 0) {
                    //     return (<Image
                    //         source={Files.sprites.icon_home_noti}
                    //         style={[{ width: verticalScale(tabWidth), height: verticalScale(tabWidth), resizeMode: 'contain', tintColor: tintColor }]}
                    //     />);
                    // } else {
                    //     return (
                    //         <View>
                    //             <Image
                    //                 style={{ width: verticalScale(tabWidth), height: verticalScale(tabWidth), resizeMode: 'contain', tintColor: tintColor }}
                    //                 source={Files.sprites.icon_home_noti} />
                    //             <ImageBackground style={{ position: 'absolute', top: -5, right: -6, width: verticalScale(20), height: verticalScale(20), justifyContent: 'center', alignItems: 'center' }}
                    //                 resizeMode={'contain'}
                    //                 source={Files.sprites.bg_notifi_count}
                    //             >
                    //                 <Text style={{ fontSize: fontSize(11, -scale(3)), color: 'white', textAlign: 'center' }}>
                    //                     {global.count_notifycation}
                    //                 </Text>
                    //             </ImageBackground>
                    //         </View>
                    //     )
                    // }
                }
            }
        },
        news: {
            screen: NewsScreen,
            navigationOptions: {
                tabBarIcon: ({ tintColor }) => (
                    <Image
                        source={Files.sprites.GolfNews_Logo}
                        style={[{ width: news_width, height: news_height, resizeMode: 'contain', tintColor: tintColor }]}
                    />
                )
            }
        },
        event: {
            screen: EventView,
            navigationOptions: {
                tabBarIcon: ({ tintColor }) => {
                    return (
                        <Image
                            source={Files.sprites.event}
                            style={[{ width: event_width, height: event_width, resizeMode: 'contain', tintColor: tintColor }]}
                        />
                    );
                    // global.event_count = 2;//fake
                    // if (!global.event_count) {
                    //     return (
                    //         <Image
                    //             source={Files.sprites.event}
                    //             style={[{ width: tabWidth, height: tabWidth, resizeMode: 'contain', tintColor: tintColor }]}
                    //         />
                    //     );
                    // } else {
                    //     return (
                    //         <View>
                    //             <Image
                    //                 style={{ width: tabWidth, height: tabWidth, resizeMode: 'contain', tintColor: tintColor }}
                    //                 source={Files.sprites.event} />
                    //             <ImageBackground style={{ position: 'absolute', zIndex: 100, top: -5, right: -6, width: verticalScale(20), height: verticalScale(20), justifyContent: 'center', alignItems: 'center' }}
                    //                 resizeMode={'contain'}
                    //                 source={Files.sprites.bg_notifi_count}
                    //             >
                    //                 <Text style={{ fontSize: fontSize(11, -scale(3)), color: 'white', textAlign: 'center' }}>
                    //                     {global.event_count}
                    //                 </Text>
                    //             </ImageBackground>
                    //         </View>
                    //     );
                    // }
                }
            }
        },
    },
    {
        tabBarComponent: TabBarTop,
        navigationOptions: ({ navigation }) => ({
            header: null//<Header/>
        }),
        tabBarOptions: {
            activeTintColor: '#00aba7',
            inactiveTintColor: '#ABABAB',
            upperCaseLabel: false,
            activeBackgroundColor: '#F3F2F4',
            inactiveBackgroundColor: '#F3F2F4',
            allowFontScaling: false,
            showLabel: false,
            showIcon: true,
            style: {
                backgroundColor: '#fff',
                // borderBottomWidth: 0,
                // borderBottomColor: '#fff',

                elevation: 0, // remove shadow on Android
                shadowOpacity: 0, // remove shadow on iOS
            },
            iconStyle: {
                height: scale(45),
                width: scale(45),
                resizeMode: 'contain',
            },
            indicatorStyle: {
                backgroundColor: 'transparent',
                height: 0
            },
            tabStyle: {
                // paddingTop: 5,
                // paddingBottom: 5,
                paddingLeft: 0,
                paddingRight: 0,
                borderBottomWidth: 0,
                borderTopWidth: 0,
                height: tabHeight,
                justifyContent: 'center',
                backgroundColor: '#fff'
                // marginBottom: scale(5),
                // backgroundColor: 'red'
                // elevation: 0, // remove shadow on Android
                // shadowOpacity: 0, // remove shadow on iOS
            },
        },
        tabBarPosition: 'top',
        animationEnabled: false,
        swipeEnabled: true,
        backBehavior: 'none',
        lazy: true,
        lazyLoad: true,
        // shadowHidden : true
        backgroundColor: '#fff'
    }
);

export default class HomeTabView extends React.Component {
    constructor() {
        super();
        // this.scrollCallback = null;
        this.scroll = this.scroll.bind(this);
        this.waiting_for_request_count_notify = false;
    }

    scroll(isTop) {
        if (this.props.scrollCallback)
            this.props.scrollCallback(isTop);
    }

    componentDidMount() {
        PropsStatic.setMainAppComponent(this);
        this.interval = setInterval(() => {
            this.checkRequestCountNotify();//3 giay check 1 phat neu thay doi thi request len sever
        }, 3000);
        this.sendRequestCountNotification();
    }

    componentWillUnmount() {
        PropsStatic.setMainAppComponent(null);
        if (this.interval) {
            clearInterval(this.interval);
        }
    }

    /**
     * Update count thông báo(hệ thống,bạn bè)
     */
    updateCountSystemNotify(_count, isRemove = false) {
        if (!this.refBadgeNotification) return;
        if (!isRemove) {
            this.refBadgeNotification.updateView(_count);
        } else {
            this.refBadgeNotification.removeCount(_count);
        }
    }

    /**
     * Update tổng số sự kiện sắp diễn ra
     * @param {Number} _count Tổng số sự kiện sắp diễn ra 
     */
    updateCountEventComingsoom(_count) {
        if (!this.refBadgeEvent) return;
        this.refBadgeEvent.updateView(_count);
    }

    /**
     * Update tổng số tin tức mới
     * @param {Number} _count Tổng số tin tức
     */
    updateCountNews(_count) {
        if (!this.refBadgeNews) return;
        this.refBadgeNews.updateView(_count);
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
        let url = Config.getBaseUrl() + ApiService.notification_count();
        console.log("url count notify : ", url);
        let self = this;
        Networking.httpRequestGet(url, (jsonData) => {
            // console.log("jsonData : ", jsonData);
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
                        self.updateCountSystemNotify(count_notifycation);
                        self.updateCountNews(count_news);
                        // global.count_friends = data['friend_count_display'];
                    }
                    //friend count
                    // self.setState({
                    //     count_notification: total,
                    // });
                }
            }
        }, () => {
            self.waiting_for_request_count_notify = false;
        });
    }

    render() {
        return (
            <View style={{ flex: 1 }}>
                <HomeTabNavigator screenProps={{ scroll: this.scroll }} />
                <View style={{ position: 'absolute', width: width, height: tabHeight, flexDirection: 'row', alignItems: 'center', top: 0, left: 0 }}
                    pointerEvents={'none'}>
                    <View pointerEvents="none" style={{ width: tWidth, height: tabHeight, backgroundColor: 'transparent' }}></View>
                    <View pointerEvents="none" style={{ width: tWidth, height: tabHeight, backgroundColor: 'transparent' }}></View>
                    <View pointerEvents="none" style={{ width: tWidth, height: tabHeight, backgroundColor: 'transparent' }}></View>
                    <ComponentBadgeChat ref={(refBadgeNotification) => { this.refBadgeNotification = refBadgeNotification; }} tabWidth={tWidth} tabHeight={tabHeight} />
                    <ComponentBadgeChat ref={(refBadgeNews) => { this.refBadgeNews = refBadgeNews; }} tabWidth={tWidth} tabHeight={tabHeight} />
                    <ComponentBadgeChat ref={(refBadgeEvent) => { this.refBadgeEvent = refBadgeEvent; }} tabWidth={tWidth} tabHeight={tabHeight} />
                </View>
            </View>
        );
    }
}