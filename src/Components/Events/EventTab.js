import React from 'react';
import {
    StyleSheet,
    Dimensions,
    Platform
} from 'react-native';
import { TabNavigator, TabBarTop } from 'react-navigation';
import GroupScreen from './Screens/EventListGroupScreen';
import ClubScreen from './Screens/EventListClubScreen';
import I18n from 'react-native-i18n';
require('../../../I18n/I18n');
import { scale, verticalScale, moderateScale, fontSize } from '../../Config/RatioScale';
let { width, height } = Dimensions.get('window');

//const screenWidth = Dimensions.get('window').width;
var tabHeight = (Platform.OS === 'ios') ? verticalScale(47) : verticalScale(40);



export default Tab = TabNavigator(
    {
        club_event: {
            screen: ClubScreen,
            navigationOptions: {
                title: I18n.t('clb_title'),
            }
        },
        group_event: {
            screen: GroupScreen,
            navigationOptions: {
                title: I18n.t('group'),
            }
        },
    },
    {
        tabBarComponent: TabBarTop,
        navigationOptions: ({ navigation }) => ({
            header: null//<Header/>
        }),
        tabBarOptions: {
            activeTintColor: '#fff',
            inactiveTintColor: '#00aba7',
            upperCaseLabel: false,
            showLabel: true,
            labelStyle: {
                fontSize: fontSize(16),
                textAlignVertical: 'center',
                fontWeight: 'bold',
            },

            tabStyle: {
                justifyContent: 'center',
                alignItems: 'center',
                height: tabHeight,
                width: width / 2 - 15,
            },
            style: {
                backgroundColor: '#fff',
                height: tabHeight,
                width: width - 30,
                borderWidth: 1.5,
                borderRadius: 5,
                borderColor: '#00aba7',
                marginLeft: 15,
                // marginRight: scale(15),
            },
            indicatorStyle: { backgroundColor: '#00aba7', height: tabHeight}
        },
        tabBarPosition: 'top',
        animationEnabled: false,
        swipeEnabled: true,
        lazy: true,
    }
);