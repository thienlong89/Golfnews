/**
 * Màn hình thông báo và tin tức
 */

import React from 'react';
import {
    StyleSheet,
    View,
    Dimensions,
    Platform,
    ImageBackground,
    Text,
    Animated,
    BackHandler
} from 'react-native';
import BaseComponent from '../../Core/View/BaseComponent';
import HeaderView from '../HeaderView';
import NotificationScreen from './Screens/NotificationScreen';
import NewsScreen from '../News/NewsView';
import FriendScreen from './Screens/NotifyFriendScreen';

import { TabNavigator, TabBarTop } from 'react-navigation';
import Files from '../Common/Files';
import I18n from 'react-native-i18n';
require('../../../I18n/I18n');
import { Constants } from '../../Core/Common/ExpoUtils';

import { scale, verticalScale, fontSize } from '../../Config/RatioScale';
let { width, height } = Dimensions.get('window');

const screenWidth = Dimensions.get('window').width - verticalScale(30);
let tabHeight = (Platform.OS === 'ios') ? verticalScale(48) : verticalScale(40);

const Tab = TabNavigator(
    {
        notify: {
            screen: NotificationScreen,
            navigationOptions: {
                //title: I18n.t('notify')
                tabBarLabel: I18n.t('notify_flight')
                // ({ tintColor, focused }) => {
                //     // let count = parseInt(global.count_notifycation);
                //     // if (count > 0) {
                //     //     return (
                //     //         <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center' }}>
                //     //             <Text style={{ fontSize: 14, fontWeight: 'bold', marginRight: 3 }}>{I18n.t('notify')}</Text>
                //     //             <ImageBackground style={{ alignItems: 'center', justifyContent: 'center', width: 24, height: 24, marginRight: 1 }}
                //     //                 source={Files.sprites.bg_notifi_count}>
                //     //                 <Text style={{ fontSize: 11, color: "#ffffff", lineHeight: 12 }}>{global.count_notifycation}</Text>
                //     //             </ImageBackground>
                //     //         </View>
                //     //     )
                //     // } else {
                //     return (
                //         <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                //             <Text allowFontScaling={global.isScaleFont} style={{ fontSize: fontSize(12, -scale(2)), fontWeight: 'bold', color: '#000' }}>{I18n.t('notify_flight')}</Text>
                //         </View>
                //     )
                //     // }
                // }
            }
        },
        notify_friend: {
            screen: FriendScreen,
            navigationOptions: {
                //title: I18n.t('add_friend')
                tabBarLabel: I18n.t('notify_friend')
                // ({ tintColor, focused }) => {
                //     let count = parseInt(global.count_friends);
                //     if (count > 0) {
                //         return (<View style={{ flex: 1, flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center' }}>
                //             <Text allowFontScaling={global.isScaleFont} style={{ fontSize: fontSize(12, -scale(2)), fontWeight: 'bold', marginRight: scale(3), color: '#000' }}>{I18n.t('notify_friend')}</Text>
                //             <ImageBackground style={{ alignItems: 'center', justifyContent: 'center', width: scale(24), height: scale(24), marginRight: scale(1) }}
                //                 source={Files.sprites.bg_notifi_count}>
                //                 <Text allowFontScaling={global.isScaleFont} style={{ fontSize: fontSize(10, -scale(5)), color: "#ffffff" }}>{global.count_friends}</Text>
                //             </ImageBackground>
                //         </View>)
                //     } else {
                //         return (
                //             <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                //                 <Text allowFontScaling={global.isScaleFont} style={{ fontSize: fontSize(12, -scale(2)), fontWeight: 'bold', color: '#000' }}>{I18n.t('notify_friend')}</Text>
                //             </View>
                //         );
                //     }
                // }
            }
        },
        news: {
            screen: NewsScreen,
            navigationOptions: {
                //title: I18n.t('news')
                tabBarLabel: I18n.t('notify_system')
                // ({ tintColor, focused }) => {
                //     let count = parseInt(global.count_news);
                //     if (count > 0) {
                //         return (
                //             <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center' }}>
                //                 <Text allowFontScaling={global.isScaleFont} style={{ fontSize: fontSize(12, -scale(2)), fontWeight: 'bold', marginRight: verticalScale(3), color: '#000' }}>{I18n.t('notify_system')}</Text>
                //                 <ImageBackground style={{ alignItems: 'center', justifyContent: 'center', width: scale(24), height: scale(24), marginRight: 1 }}
                //                     source={Files.sprites.bg_notifi_count}>
                //                     <Text allowFontScaling={global.isScaleFont} style={{ fontSize: fontSize(10, -scale(5)), color: "#ffffff" }}>{global.count_news}</Text>
                //                 </ImageBackground>
                //             </View>
                //         )
                //     } else {
                //         return (
                //             <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                //                 <Text allowFontScaling={global.isScaleFont} style={{ fontSize: fontSize(12, -scale(2)), fontWeight: 'bold', color: '#000' }}>{I18n.t('notify_system')}</Text>
                //             </View>
                //         )
                //     }
                // }
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
            allowFontScaling: false,
            inactiveTintColor: '#858585',
            upperCaseLabel: false,
            activeBackgroundColor: '#424242',
            inactiveBackgroundColor: 'white',
            showLabel: true,
            labelStyle: {
                fontSize: fontSize(14, -scale(2)),// 18,
                fontWeight: 'bold',
                position: 'relative',
                alignSelf: 'center',
                marginTop: verticalScale(5),
            },
            tabStyle: {
                justifyContent: 'center',
                alignItems: 'center',
                height: 45,
            },
            style: {
                backgroundColor: '#fff',
                height: 45,
            },
            // iconStyle: styles.iconStyle,
            indicatorStyle: {
                backgroundColor: '#00aba7'
            }
        },
        tabBarPosition: 'top',
        animationEnabled: false,
        swipeEnabled: true,
        lazy: true,
        backgroundColor: '#ffffff',
        initialRouteName: 'notify'
    }
);

const InitTab = TabNavigator(
    {
        notify: {
            screen: NotificationScreen,
            navigationOptions: {
                //title: I18n.t('notify')
                tabBarLabel: I18n.t('notify_flight')
            }
        },
        notify_friend: {
            screen: FriendScreen,
            navigationOptions: {
                //title: I18n.t('add_friend')
                tabBarLabel: I18n.t('notify_friend')
            }
        },
        news: {
            screen: NewsScreen,
            navigationOptions: {
                //title: I18n.t('news')
                tabBarLabel: I18n.t('notify_system')
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
            allowFontScaling: false,
            inactiveTintColor: '#858585',
            upperCaseLabel: false,
            activeBackgroundColor: '#424242',
            inactiveBackgroundColor: 'white',
            showLabel: true,
            labelStyle: {
                fontSize: fontSize(14, -scale(2)),// 18,
                fontWeight: 'bold',
                position: 'relative',
                alignSelf: 'center',
                marginTop: verticalScale(5),
            },
            tabStyle: {
                justifyContent: 'center',
                alignItems: 'center',
                height: 45,
            },
            style: {
                backgroundColor: '#fff',
                height: 45,
            },
            // iconStyle: styles.iconStyle,
            indicatorStyle: {
                backgroundColor: '#00aba7'
            }
        },
        tabBarPosition: 'top',
        animationEnabled: false,
        swipeEnabled: true,
        lazy: true,
        backgroundColor: '#ffffff',
        initialRouteName: 'notify_friend'
    }
);

export default class NotifyAndNewsView extends BaseComponent {
    constructor(props) {
        super(props);
        this.navigation = this.props.parentNavigator;
        this.isNewUser = this.props.navigation.state.params ? this.props.navigation.state.params.isNewUser : false;
        console.log('this.isNewUser', this.isNewUser)
        this.onBackPress = this.onBackPress.bind(this);
    }

    onBackPress() {
        if (this.props.navigation) {
            if (!this.isNewUser) {
                this.props.navigation.goBack();
            } else {
                this.props.navigation.replace('LeaderBoardView', { 'isNewUser': true });
            }

        }
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

    refreshView() {
        console.log("refresh view : ");
        this.setState({});
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

    renderTab() {
        if (!this.isNewUser) {
            return <Tab screenProps={{ parentNavigation: this.navigation, parent: this }} />
        } else {
            return <InitTab screenProps={{ parentNavigation: this.navigation, parent: this }} />
        }
    }

    render() {
        // let{fadeIn} = this.state;
        return (
            <View style={styles.container}>
                <HeaderView
                    title={this.t('notify')}
                    handleBackPress={this.onBackPress} />
                <View style={styles.tab_navigation}>
                    {this.renderTab()}
                </View>
                {this.renderMessageBar()}
            </View>
        );
    }
}

const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: '#00aba7'
    },

    tab_navigation: {
        flex: 1
    },
    labelStyle: {
        fontSize: fontSize(18, scale(2)),// 18,
        fontWeight: 'bold',
        //color: '#858585',
        // height: (deviceHeight * 4) / 67,
        position: 'relative',
        alignSelf: 'center',
        // padding: 6,
        marginTop: verticalScale(5),
    },
    tabStyle: {
        justifyContent: 'center',
        alignItems: 'center',
        height: 40,
    },
    style: {
        backgroundColor: '#fff',
        height: 40,
    },
    iconStyle: {
        backgroundColor: "#858585"
    },
    indicatorStyle: {
        backgroundColor: '#00aba7'
    },
});