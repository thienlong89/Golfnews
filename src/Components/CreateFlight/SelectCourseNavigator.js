import React from 'react';
import { Text, View, StyleSheet, Image } from 'react-native';
import { TabNavigator, TabBarTop } from 'react-navigation';
import styles from '../../Styles/Friends/StylesFriendNavigator';

import FavoriteCourseTab from '../CreateFlight/Tab/FavoriteCourseTab';
import AroundCourseTab from '../CreateFlight/Tab/AroundCourseTab';
import AllCourseTab from '../CreateFlight/Tab/AllCourseTab';

import I18n from 'react-native-i18n';
require('../../../I18n/I18n');

export default TabNavigator(
    
    {
        FavoriteCourse: {
            screen: FavoriteCourseTab,
            navigationOptions: {
                title: I18n.t('favorite'),
                fontSize: 10
            }
        },
        AroundCourse: {
            screen: AroundCourseTab,//props => <AroundCourseTab {...props} />,
            navigationOptions: {
                title: I18n.t('around_me'),
                fontSize: 10,
            }
        },
        AllCourse: {
            screen: AllCourseTab,//props => <AllCourseTab {...props} />,
            navigationOptions: {
                title: I18n.t('all'),
                fontSize: 10
            }
        },
    },
    {
        tabBarComponent: TabBarTop,
        navigationOptions: ({ navigation }) => ({
            header : null
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