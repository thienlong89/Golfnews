import React from 'react';
import { View, BackHandler } from 'react-native';
import { TabNavigator, TabBarTop } from 'react-navigation';
import styles from '../../Styles/Friends/StylesFriendNavigator';
import FlightHistoryView from './FlightHistoryView';

//import Header from './Header';
import BaseComponent from '../../Core/View/BaseComponent';
import I18n from 'react-native-i18n';
import { verticalScale, scale } from '../../Config/RatioScale';
import ChartScreen from './Screens/ChartScreen';
import StatisticalOtherUserView from '../Statistical/StatisticalOtherUserView';
import HeaderView from '../Common/HeaderView';
import FlightHistoryScreen from './Screens/FlightHistoryScreen';
import DataOtherScreen from './Screens/DataOtherScreen';
require('../../../I18n/I18n');

const Tab = TabNavigator(
    {
        History: {
            screen: FlightHistoryScreen,
            navigationOptions: {
                title: I18n.t('history'),//'Bạn bè',
            }
        },
        // Chart: {
        //     screen: ChartScreen,
        //     navigationOptions: {
        //         title: I18n.t('statistical'),//'Nhóm',
        //     }
        // },
        Data: {
            screen: DataOtherScreen,
            navigationOptions: {
                title: I18n.t('so_lieu'),//'CLB',
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

export default class HistoryNavigatorView extends BaseComponent {
    constructor(props) {
        super(props);
        this.onBack = this.onBack.bind(this);
        this.backHandler = null;
        this.puid = this.props.navigation.state.params.puid;
    }

    componentDidMount(){
        if(this.headerView){
            this.headerView.callbackBack = this.onBack;
            this.headerView.setTitle(this.t('flight_history'));
        }
        this.backHandler = BackHandler.addEventListener('hardwareBackPress',this.onBack);
    }

    componentWillUnmount(){
        if(this.backHandler) this.backHandler.remove();
    }

    /**
     * tat ban phim
     */
    onBack() {
        let {navigation} = this.props;
        if(navigation){
            navigation.goBack();
        }
        return true;
    }

    render() {
        return (
            <View style={styles.container}>
                <HeaderView ref={(headerView)=>{this.headerView = headerView;}} />
                <Tab screenProps = {{puid : this.puid}}/>
            </View>
        );
    }
}