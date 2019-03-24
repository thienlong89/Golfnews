import React from 'react';
import { TabNavigator, TabBarTop } from 'react-navigation';

import TopSingleScreen from './Screens/TopSingleScreen';
import TopBogeyScreen from './Screens/TopBogeyScreen';
import Top18Screen from './Screens/Top18Screen';
import TopCLBScreen from './Screens/TopCLBScreen';
import TopLaddyScreen from './Screens/TopLaddyScreen';
import TopProScreen from './Screens/TopProScreen';
import styles from '../../Styles/LeaderBoard/StyleLeaderBoardTabNavigator';

import I18n from 'react-native-i18n';
require('../../../I18n/I18n');


export default TabNavigator(
    {
        Pro : {
            screen : TopProScreen,
            navigationOptions: {
                title: I18n.t('top_pro'),
                fontSize: 8,
            }
        },
        Single: {
            screen: TopSingleScreen,
            navigationOptions: {
                title: I18n.t('top_single'),
                fontSize: 8,
            }
        },
        Bogey: {
            screen: TopBogeyScreen,
            navigationOptions: {
                title: I18n.t('top_bogey'),
                fontSize: 8,
            }
        },
        Top18: {
            screen: Top18Screen,
            navigationOptions: {
                title: I18n.t('top_18'),
                fontSize: 8
            }
        },
        Laddy : {
            screen : TopLaddyScreen,
            navigationOptions: {
                title: I18n.t('top_laddy'),
                fontSize: 8
            }
        },
        CLB: {
            screen: TopCLBScreen,
            navigationOptions: {
                title: I18n.t('top_club'),
                fontSize: 8
            }
        }
    },
    {
        tabBarComponent: TabBarTop,
        navigationOptions: ({ navigation }) => ({
            // tabBarOnPress: (scene, jumpToIndex) => {
            //    // console.log('onPress:', scene.route, scene.index);
            //     //Single.screen.onItemClick('');
            // },
        }),
        tabBarOptions: {
            activeTintColor: '#00aba7',
            allowFontScaling : false,
            inactiveTintColor: '#858585',
            upperCaseLabel: false,
            activeBackgroundColor: '#858585',
            inactiveBackgroundColor: 'white',
            showLabel: true,
            labelStyle: styles.labelStyle,
            tabStyle: styles.tabStyle,
            style: styles.style,
            iconStyle: styles.iconStyle,
            indicatorStyle: styles.indicatorStyle
        },
        tabBarPosition: 'top',
        animationEnabled: false,
        swipeEnabled: true,
        lazy: true,
        backgroundColor: '#ffffff'
    }
);
