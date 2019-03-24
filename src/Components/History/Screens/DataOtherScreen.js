import React from 'react';
import {
    StyleSheet,
    View,
    Dimensions,
    Platform
} from 'react-native';
//import Touchable from 'react-native-platform-touchable';
import BaseComponent from '../../../Core/View/BaseComponent';

import { TabNavigator, TabBarTop } from 'react-navigation';
import I18n from 'react-native-i18n';
import { fontSize, scale, verticalScale } from '../../../Config/RatioScale';
import NearbyScreen from '../../Statistical/Screens/NearbyScreen';
import YearScreen from '../../Statistical/Screens/YearScreen';
import OtherScreen from '../../Statistical/Screens/OtherScreen';
require('../../../../I18n/I18n');


const screenWidth = Dimensions.get('window').width - 60;

let tabHeight = (Platform.OS === 'ios') ? 48 : 40;
let indicatorHeight = (Platform.OS === 'ios') ? tabHeight - 2 : tabHeight;

const Tab = TabNavigator(
    {
        nearby: {
            screen: OtherScreen,
            navigationOptions: {
                title: I18n.t('nearby'),
                fontSize: 10,
            }
        },
        year: {
            screen: YearScreen,
            navigationOptions: {
                title: I18n.t('by_year'),
                fontSize: 10,
            }
        },
    },
    {
        tabBarComponent: TabBarTop,
        navigationOptions: ({ navigation }) => ({
            header: null//<Header/>
        }),
        tabBarOptions: {
            allowFontScaling: false,
            activeTintColor: '#fff',
            inactiveTintColor: '#00aba7',
            upperCaseLabel: false,
            activeBackgroundColor: '#00aba7',
            inactiveBackgroundColor: 'fff',
            showLabel: true,
            //renderIndicator: () => null,
            labelStyle: {
                fontSize: fontSize(16, scale(2)),
                //textAlignVertical : 'center',
                textAlign: 'center'
            },

            tabStyle: {
                justifyContent: 'center',
                alignItems: 'center',
                height: tabHeight,
                width: screenWidth / 2,
                justifyContent: 'center'
            },
            style: {
                backgroundColor: '#fff',
                height: tabHeight,
                width: screenWidth,
                marginLeft: scale(30),
                marginTop: verticalScale(20),
                marginRight: scale(30),
                marginBottom: verticalScale(20),
                borderColor: '#424242',
                borderWidth: 0.5,
                borderRadius: verticalScale(3),
                //alignItems : 'center'
            },
            //iconStyle: styles.iconStyle,
            indicatorStyle: { backgroundColor: '#00aba7', height: indicatorHeight, marginTop: (Platform.OS === 'ios') ? 1 : null, marginBottom: (Platform.OS === 'ios') ? 1 : null, marginLeft: 0.5, alignSelf: 'center', marginRight: 0.5, width: screenWidth / 2 }
        },
        tabBarPosition: 'top',
        animationEnabled: false,
        swipeEnabled: true,
        lazy: true,
        backgroundColor: '#ffffff'
    }
);

export default class DataOtherScreen extends BaseComponent {
    constructor(props) {
        super(props);
        this.puid = this.props.screenProps.puid;
    }

    onBackClick() {
        let { navigation } = this.props;
        if (navigation) {
            navigation.goBack();
        }
        return true;
    }

    componentDidMount() {

    }

    render() {
        return (
            <View style={{ flex: 1 }}>
                <Tab screenProps={{ puid: this.puid }} />
            </View>
        );
    }
}