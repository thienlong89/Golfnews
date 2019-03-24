import React from 'react';
import { View, Image, TextInput } from 'react-native';
import { TabNavigator, TabBarTop } from 'react-navigation';
import styles from '../../Styles/Friends/StylesFriendNavigator';
import Touchable from 'react-native-platform-touchable';

import ClubAdminScreen from './Screens/ClubAdminScreen';
import ClubMemberScreen from './Screens/ClubMemberScreen';

//import Header from './Header';
import BaseComponent from '../../Core/View/BaseComponent';
import Constant from '../../Constant/Constant';
import ApiService from '../../Networking/ApiService';
import Networking from '../../Networking/Networking';
import HeaderView from '../HeaderView';

import I18n from 'react-native-i18n';
require('../../../I18n/I18n');

export default MemberTabNavigator = TabNavigator(
    {
        Member: {
            screen: props => <ClubMemberScreen {...props} />,
            navigationOptions: {
                title: I18n.t('member_title'),
                fontSize: 10
            }
        },
        Admin: {
            screen: props => <ClubAdminScreen {...props} />,
            navigationOptions: {
                title: I18n.t('admin'),
                fontSize: 10,
            }
        }
    },
    {
        tabBarComponent: TabBarTop,
        navigationOptions: ({ navigation }) => ({
            header: null//<Header/>
        }),
        tabBarOptions: {
            activeTintColor: '#00aba7',
            allowFontScaling: false,
            inactiveTintColor: '#424242',
            upperCaseLabel: false,
            activeBackgroundColor: '#424242',
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
