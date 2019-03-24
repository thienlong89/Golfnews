import React from 'react';
import {
    Platform,
    StyleSheet,
    Text,
    View,
    BackHandler
} from 'react-native';
import BaseComponent from '../../../Core/View/BaseComponent';
import ClubHeaderView from './ClubHeaderView';
import styles from '../../../Styles/Clubs/styleAdministratorClub';
import { scale, verticalScale, moderateScale, fontSize } from '../../../Config/RatioScale';
import { TabNavigator, TabBarTop } from 'react-navigation';
import I18n from 'react-native-i18n';
import AllMemberTabView from './Tabs/AllMemberTabView';
import CheckHdcTabView from './Tabs/CheckHdcTabView';
import BirthdayTabView from './Tabs/BirthdayTabView';
import FeeClubTabView from './Tabs/FeeClubTabView';
import MannerTopTabView from './Tabs/MannerTopTabView';
import { Container, Header, Tab, Tabs, ScrollableTab, TabHeading } from 'native-base';

const TabScreen = TabNavigator(
    {
        AllMemberTabView: {
            screen: AllMemberTabView,
            navigationOptions: {
                title: I18n.t('all'),
                fontSize: 10
            }
        },
        CheckHdcTabView: {
            screen: CheckHdcTabView,
            navigationOptions: {
                title: I18n.t('check_hdc'),
                fontSize: 10,
            }
        },
        BirthdayTabView: {
            screen: BirthdayTabView,
            navigationOptions: {
                title: I18n.t('birthday_tab'),
                fontSize: 10
            }
        },
        FeeClubTabView: {
            screen: FeeClubTabView,
            navigationOptions: {
                title: I18n.t('pay_fee'),
                fontSize: 10
            }
        },
        MannerTopTabView: {
            screen: MannerTopTabView,
            navigationOptions: {
                title: I18n.t('top_manner'),
                fontSize: 10
            }
        }

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
            scrollEnabled: true
        },
        tabBarPosition: 'top',
        animationEnabled: false,
        swipeEnabled: true,
        lazy: true,
        backgroundColor: '#ffffff'
    }
);

export default class AdminClubTabNavigator extends BaseComponent {

    static defaultProps = {

    }

    constructor(props) {
        super(props);
        let { clubName, clubId, logoUrl, totalMember, isAdmin, isModerator } = this.props.navigation.state.params;
        this.clubName = clubName;
        this.clubId = clubId;
        this.isAdmin = isAdmin;
        this.isModerator = isModerator;
        this.totalMember = totalMember;
        this.state = {

        }

        this.onBackPress = this.onBackPress.bind(this);
        this.onSearchMemberPress = this.onSearchMemberPress.bind(this);
        this.jumpToBirthday = this.jumpToBirthday.bind(this);
    }

    render() {
        return (
            <View style={styles.container}>
                <ClubHeaderView
                    title={this.clubName}
                    subTitle={`${this.totalMember} ${this.t('member')}`}
                    handleBackPress={this.onBackPress}
                    iconMenu={this.getResources().ic_Search}
                    onIconMenuClick={this.onSearchMemberPress}
                    iconMenuStyle={styles.img_share} />

                {/* <TabScreen screenProps = {{...this.props}}/> */}
                <Tabs
                    ref={(refTab) =>{this.refTab = refTab}}
                    renderTabBar={() => <ScrollableTab
                        style={{ backgroundColor: "#fff" }}
                        underlineStyle={{ backgroundColor: '#00ABA7' }}
                        inactiveTextColor={'#9F9F9F'}
                        activeTextColor={'#00ABA7'} />}
                    style={{ backgroundColor: '#fff' }}>

                    <Tab heading={this.t('all')}
                        tabStyle={{ backgroundColor: '#fff' }}
                        activeTabStyle={{ backgroundColor: '#fff' }}
                        textStyle={{ fontSize: fontSize(15), color: '#9F9F9F' }}
                        activeTextStyle={{ fontSize: fontSize(15), color: '#00ABA7' }}>
                        <AllMemberTabView screenProps={{ ...this.props }}
                        jumpToBirthday={this.jumpToBirthday} />
                    </Tab>
                    <Tab heading={this.t('check_hdc')}
                        tabStyle={{ backgroundColor: '#fff' }}
                        activeTabStyle={{ backgroundColor: '#fff' }}
                        textStyle={{ fontSize: fontSize(15), color: '#9F9F9F' }}
                        activeTextStyle={{ fontSize: fontSize(15), color: '#00ABA7' }}>
                        <CheckHdcTabView screenProps={{ ...this.props }} />
                    </Tab>
                    <Tab heading={this.t('birthday_tab')}
                        tabStyle={{ backgroundColor: '#fff' }}
                        activeTabStyle={{ backgroundColor: '#fff' }}
                        textStyle={{ fontSize: fontSize(15), color: '#9F9F9F' }}
                        activeTextStyle={{ fontSize: fontSize(15), color: '#00ABA7' }}>
                        <BirthdayTabView screenProps={{ ...this.props }} />
                    </Tab>
                    <Tab heading={this.t('pay_fee')}
                        tabStyle={{ backgroundColor: '#fff' }}
                        activeTabStyle={{ backgroundColor: '#fff' }}
                        textStyle={{ fontSize: fontSize(15), color: '#9F9F9F' }}
                        activeTextStyle={{ fontSize: fontSize(15), color: '#00ABA7' }}>
                        <FeeClubTabView screenProps={{ ...this.props }} />
                    </Tab>
                    <Tab heading={this.t('top_manner')}
                        tabStyle={{ backgroundColor: '#fff' }}
                        activeTabStyle={{ backgroundColor: '#fff' }}
                        textStyle={{ fontSize: fontSize(15), color: '#9F9F9F' }}
                        activeTextStyle={{ fontSize: fontSize(15), color: '#00ABA7' }}>
                        <MannerTopTabView screenProps={{ ...this.props }} />
                    </Tab>
                </Tabs>

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

    onSearchMemberPress() {
        if (this.props.navigation) {
            this.props.navigation.navigate('admin_list_member_view',
                {
                    clubId: this.clubId
                })
        }
    }

    jumpToBirthday(){
        console.log('jumpToBirthday');
        this.refTab.goToPage(2)
    }

}
