import React from 'react';
import {
    StyleSheet,
    View,
    Dimensions,
    Platform,
    ImageBackground,
    Text,
    Image
} from 'react-native';
import Touchable from 'react-native-platform-touchable';

import PublicNewsView from './Discuss/PublicNewsView';
import ClubNewsView from './Discuss/ClubNewsView';
import NotifyNewsView from './Discuss/NotifyNewsView';
import ListChatGroupView from '../Chats/ListChats/Screen/ListChatScreen';

import { TabNavigator, TabBarTop } from 'react-navigation';

import Files from '../Common/Files';
import I18n from 'react-native-i18n';
import { verticalScale, fontSize, scale } from '../../Config/RatioScale';
require('../../../I18n/I18n');
// import { Constants } from '../../Core/Common/ExpoUtils';

// const screenWidth = Dimensions.get('window').width;
// let tabHeight = (Platform.OS === 'ios') ? 48 : 40;

export default NewsTabNavigator = TabNavigator(
    {
        list_group_chat: {
            screen: props => <ListChatGroupView {...props} />,
            navigationOptions: {
                tabBarLabel:
                    ({ tintColor, focused }) => {
                        return (
                            <View style={styles.view_item_tab} >
                                <Text allowFontScaling={global.isScaleFont}
                                    style={[styles.txt_label_tab, { color: focused ? '#00ABA7' : '#ABABAB' }]}>
                                    {I18n.t('chat')}
                                </Text>
                            </View>
                        );

                    }
            },
        },
        public_news: {
            screen: props => <PublicNewsView {...props} />,
            navigationOptions: {
                tabBarLabel:
                    ({ tintColor, focused }) => {
                        let count = 1;//parseInt(global.public_count);
                        if (count > 0) {
                            return (
                                <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center',padding : 0 }}>
                                    <Text allowFontScaling={global.isScaleFont}
                                        style={[styles.txt_label_tab, styles.txt_with_count, { color: focused ? '#00ABA7' : '#ABABAB' }]}>
                                        {I18n.t('public')}
                                    </Text>

                                    <ImageBackground style={styles.img_bg_count}
                                        source={Files.sprites.bg_notifi_count}>
                                        <Text allowFontScaling={global.isScaleFont} style={styles.txt_count}>{count}</Text>
                                    </ImageBackground>
                                </View>
                            )
                        } else {
                            return (
                                <View style={styles.view_item_tab}>
                                    <Text allowFontScaling={global.isScaleFont}
                                        style={[styles.txt_label_tab, { color: focused ? '#00ABA7' : '#ABABAB' }]}>
                                        {I18n.t('public')}
                                    </Text>
                                </View>
                            )
                        }
                    }
            }
        },
        club_news: {
            screen: props => <ClubNewsView {...props} />,
            navigationOptions: {
                tabBarLabel:
                    ({ tintColor, focused }) => {
                        let count = parseInt(global.clb_count);
                        if (count > 0) {
                            return (<View style={{ flex: 1, flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center',padding : 0 }}>
                                <Text allowFontScaling={global.isScaleFont}
                                    style={[styles.txt_label_tab, styles.txt_with_count, { color: focused ? '#00ABA7' : '#ABABAB' }]}>
                                    {I18n.t('notice_clb')}
                                </Text>

                                <ImageBackground style={styles.img_bg_count}
                                    source={Files.sprites.bg_notifi_count}>
                                    <Text allowFontScaling={global.isScaleFont} style={styles.txt_count}>{count}</Text>
                                </ImageBackground>
                            </View>)
                        } else {
                            return (
                                <View style={styles.view_item_tab}>
                                    <Text allowFontScaling={global.isScaleFont}
                                        style={[styles.txt_label_tab, { color: focused ? '#00ABA7' : '#ABABAB' }]}>
                                        {I18n.t('notice_clb')}
                                    </Text>
                                </View>
                            );
                        }
                    }
            }
        },
        notify_news: {
            screen: NotifyNewsView,
            navigationOptions: {
                tabBarLabel:
                    ({ tintColor, focused }) => {
                        // let count = parseInt(global.count_news);
                        // if (count > 0) {
                        //     return (
                        //         <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center' }}>
                        //             <Image
                        //                 style={styles.img_notify}
                        //                 source={Files.sprites.ic_notifications} />
                        //         </View>
                        //     )
                        // } else {
                        return (
                            // <View style={styles.view_item_tab}>
                            //     <Image
                            //         style={[styles.img_notify, focused ? { tintColor: '#00ABA7' } : { tintColor: '#ABABAB' }]}
                            //         source={Files.sprites.ic_notifications} />
                            // </View>
                            <View style={styles.view_item_tab}>
                                <Text allowFontScaling={global.isScaleFont}
                                    style={[styles.txt_label_tab, { color: focused ? '#00ABA7' : '#ABABAB' }]}>
                                    {I18n.t('notice_discussion')}
                                </Text>
                            </View>
                        )
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
            activeBackgroundColor: '#00aba7',
            inactiveBackgroundColor: '#fff',
            showLabel: true,
            showIcon: false,
            style: {
                backgroundColor: '#fff',
            },
            iconStyle: { marginLeft: 2 },
            indicatorStyle: {
                backgroundColor: '#00aba7',
                height: 2
            }, 
            tabStyle: {
                paddingTop : 5,
                paddingBottom : 5,
                paddingLeft : 0,
                paddingRight : 0
            },
        },
        tabBarPosition: 'top',
        animationEnabled: false,
        swipeEnabled: true,
        lazy: true,
        lazyLoad: true
        //backgroundColor: '#00aba7'
    }
);


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#00aba7'
    },
    img_notify: {
        width: verticalScale(20),
        height: verticalScale(20),
        resizeMode: 'contain',
        tintColor: '#ABABAB'
    },
    view_item_tab: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        padding : 0
    },
    txt_label_tab: {
        fontSize: fontSize(14),
        fontWeight: 'bold',
        textAlign: 'center'
    },
    txt_count: {
        fontSize: fontSize(12,-scale(2)),
        color: "#ffffff",
        lineHeight: fontSize(17,scale(3)),
    },
    img_bg_count: {
        alignItems: 'center',
        justifyContent: 'center',
        width: verticalScale(20),
        height: verticalScale(20),
        marginRight: 1
    },
    txt_with_count: {
        marginRight:  scale(5)
    }
});