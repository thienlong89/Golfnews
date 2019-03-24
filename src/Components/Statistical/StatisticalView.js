import React from 'react';
import {
    StyleSheet,
    View,
    Dimensions,
    Platform
} from 'react-native';
//import Touchable from 'react-native-platform-touchable';
import BaseComponent from '../../Core/View/BaseComponent';
import HeaderView from '../Common/HeaderView';
import NearbyScreen from './Screens/NearbyScreen';
import YearScreen from './Screens/YearScreen';

import { TabNavigator, TabBarTop } from 'react-navigation';
import I18n from 'react-native-i18n';
import { fontSize, scale, verticalScale } from '../../Config/RatioScale';
require('../../../I18n/I18n');


const screenWidth = Dimensions.get('window').width-scale(60);

let tabHeight = (Platform.OS === 'ios') ? verticalScale(48) : verticalScale(40);
let indicatorHeight = (Platform.OS === 'ios') ? tabHeight-2 : tabHeight;

const Tab = TabNavigator(
    {
        nearby: {
            screen: NearbyScreen,
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
            allowFontScaling : false,
            activeTintColor: '#fff',
            inactiveTintColor: '#00aba7',
            upperCaseLabel: false,
            activeBackgroundColor: '#00aba7',
            inactiveBackgroundColor: 'fff',
            showLabel: true,
            //renderIndicator: () => null,
            labelStyle: {
                fontSize: fontSize(16,scale(2)),
                //textAlignVertical : 'center',
                textAlign : 'center'
            },
            
            tabStyle: {
                justifyContent: 'center',
                alignItems: 'center',
                height : tabHeight,
                width : screenWidth/2,
                justifyContent : 'center'
            },
            style: {
                backgroundColor: '#fff',
                height : tabHeight,
                width : screenWidth,
                marginLeft : scale(30),
                marginTop : verticalScale(16),
                marginRight : scale(30),
                marginBottom : verticalScale(10),
                borderColor : '#424242',
                borderWidth : 0.5,
                borderRadius : verticalScale(3),
                //alignItems : 'center'
            },
            //iconStyle: styles.iconStyle,
            indicatorStyle: {backgroundColor: '#00aba7',height : indicatorHeight,marginTop : (Platform.OS === 'ios') ?  1 : null,marginBottom : (Platform.OS === 'ios') ? 1 : null,marginLeft : 0.5,alignSelf : 'center',marginRight : 0.5,width : screenWidth/2}
        },
        tabBarPosition: 'top',
        animationEnabled: false,
        swipeEnabled: true,
        lazy: true,
        backgroundColor: '#ffffff'
    }
);

export default class StatisticalView extends BaseComponent{
    constructor(props){
        super(props);
    }

    onBackClick(){
        let {navigation} = this.props;
        if(navigation){
            navigation.goBack();
        }
        return true;
    }

    componentDidMount(){
        if(this.headerView){
            this.headerView.setTitle(this.t('thong_ke'));
            this.headerView.callbackBack = this.onBackClick.bind(this);
        }
    }

    render(){
        return(
            <View style={{flex : 1,backgroundColor : 'white'}}>
                <HeaderView ref={(headerView)=>{this.headerView = headerView;}}/>
                <View style={{flex : 1}}>
                    <Tab screenProps={{parentNavigation : this.props.navigation}}/>
                </View>
            </View>
        );
    }
}