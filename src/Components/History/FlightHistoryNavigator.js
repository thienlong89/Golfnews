import React from 'react';
import { View, BackHandler } from 'react-native';
import { TabNavigator, TabBarTop } from 'react-navigation';
import styles from '../../Styles/Friends/StylesFriendNavigator';

//import Header from './Header';
import BaseComponent from '../../Core/View/BaseComponent';
import I18n from 'react-native-i18n';
import { verticalScale, scale } from '../../Config/RatioScale';
import ChartScreen from './Screens/ChartScreen';
import StatisticalView from '../Statistical/StatisticalView';
import HeaderView from '../HeaderView';
import FlightHistoryView from './FlightHistoryView';
import FlightHistoryScreen from './Screens/FlightHistoryScreen';
import DataScreen from './Screens/DataScreen';
import NearbyScreen from '../Statistical/Screens/NearbyScreen';
import YearScreen from '../Statistical/Screens/YearScreen';
require('../../../I18n/I18n');

const Tab = TabNavigator(
    {
        History: {
            screen: FlightHistoryScreen,
            navigationOptions: {
                title: I18n.t('flight_history_title'),
            }
        },
        Chart: {
            screen: ChartScreen,
            navigationOptions: {
                title: I18n.t('statistical'),
            }
        },
        NearbyScreen: {
            screen: NearbyScreen,
            navigationOptions: {
                title: I18n.t('recent_figures'),
            }
        },
        YearScreen: {
            screen: YearScreen,
            navigationOptions: {
                title: I18n.t('figures_by_year'),
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
                <HeaderView
                    title={this.t('flight_history')}
                    handleBackPress={this.onBack} />
                <Tab screenProps = {{puid : this.puid, parentNavigation: this.props.navigation}}/>
            </View>
        );
    }
}