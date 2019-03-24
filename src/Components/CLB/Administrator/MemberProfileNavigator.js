import React from 'react';
import {
    Platform,
    StyleSheet,
    Text,
    View,
    BackHandler
} from 'react-native';
import BaseComponent from '../../../Core/View/BaseComponent';
import HeaderView from '../../HeaderView';
import styles from '../../../Styles/Clubs/styleAdministratorClub';
import { scale, verticalScale, moderateScale, fontSize } from '../../../Config/RatioScale';
import { TabNavigator, TabBarTop } from 'react-navigation';
import I18n from 'react-native-i18n';
import MemberProfileView from './ProfileTabs/MemberProfileView';
import MemberFlightHistoryView from './ProfileTabs/MemberFlightHistoryView';

const TabScreen = TabNavigator(
    {
        MemberProfileView: {
            screen: MemberProfileView,
            navigationOptions: {
                title: I18n.t('profile'),
                fontSize: 10
            }
        },
        MemberFlightHistoryView: {
            screen: MemberFlightHistoryView,
            navigationOptions: {
                title: I18n.t('flight_history'),
                fontSize: 10,
            }
        },
    },
    {
        tabBarComponent: TabBarTop,
        navigationOptions: ({ navigation }) => ({
            header: null,

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
            indicatorStyle: styles.indicatorStyle,
        },
        tabBarPosition: 'top',
        animationEnabled: false,
        swipeEnabled: true,
        lazy: true,
        backgroundColor: '#ffffff'
    }
);

export default class MemberProfileNavigator extends BaseComponent {

    static defaultProps = {

    }

    constructor(props) {
        super(props);
        let { player } = this.props.navigation.state.params;
        this.player = player;
        
        this.state = {

        }

        this.onBackPress = this.onBackPress.bind(this);
    }

    render() {
        return (
            <View style={styles.container}>
                <HeaderView
                    title={this.player.getFullName()}
                    handleBackPress={this.onBackPress} />

                <TabScreen screenProps = {{...this.props}}/>

                {this.renderMessageBar()}
            </View>
        );
    }

    onBackPress() {
        if (this.props.navigation) {
            this.props.navigation.goBack();
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

}
