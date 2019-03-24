import React from 'react';
import { View, BackHandler, StyleSheet } from 'react-native';
import { TabNavigator, TabBarTop } from 'react-navigation';
// import styles from '../../Styles/Friends/StylesFriendNavigator';
import I18n from 'react-native-i18n';
import { verticalScale, scale, fontSize } from '../../Config/RatioScale';
import ReviewFacilityScreen from './Reviews/Screens/ReviewFacilityScreen';
import ReportNewFacilityView from './Reviews/Screens/ReportNewFacilityScreen';
import ReportFacilityNavigator from './ReportFacilityNavigator';
import BaseComponent from '../../Core/View/BaseComponent';
import HeaderView from '../HeaderView';
import BookingView from '../Booking/BookingView';

require('../../../I18n/I18n');

import PropsStatic from '../../Constant/PropsStatic';
import Constant from '../../Constant/Constant';

const Tab = TabNavigator(
    {
        BookingView: {
            screen: BookingView,
            navigationOptions: {
                title: I18n.t('booking'),
            }
        },
        review: {
            screen: ReviewFacilityScreen,
            navigationOptions: {
                title: I18n.t('golf_travel'),
            }
        },
        ReportFacilityNavigator: {
            screen: ReportFacilityNavigator,
            navigationOptions: {
                title: I18n.t('report_error_course'),
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
            labelStyle: {
                fontSize: fontSize(16, scale(2)),// 18,
                fontWeight: 'bold',
                //color: '#858585',
                // height: (deviceHeight * 4) / 67,
                position: 'relative',
                alignSelf: 'center',
                marginTop: verticalScale(5),
            },
            tabStyle: {
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: verticalScale(40),
                paddingBottom: 1,
                paddingTop: 1,
                paddingLeft: 0,
                paddingRight: 0
            },
            style: {
                backgroundColor: '#fff',
                minHeight: verticalScale(40),
                padding: 0
            },
            iconStyle: {
                backgroundColor: "#858585"
            },
            indicatorStyle: {
                backgroundColor: '#00aba7'
            },
        },
        tabBarPosition: 'top',
        animationEnabled: false,
        swipeEnabled: true,
        lazy: true,
        backgroundColor: '#ffffff'
    }
);

export default class FacilityView extends BaseComponent {
    constructor(props) {
        super(props);
        this.backHandler = null;
        this.isScreenFocusSearching = false;
        PropsStatic.setCallFun(Constant.NAVIGATOR_SCREEN.COURSE, this.setTitle.bind(this));
        this.onBackPress = this.onBackPress.bind(this);
        this.screenCallback = this.screenCallback.bind(this);
        this.onParentEvent = null;

        this.screen_index = 0;
    }

    static navigationOptions = ({ navigation }) => {
        const { params } = navigation.state;
        console.log('...........................params : ', params);
        if (!params) {
            return {
                title: I18n.t("golf_course"),
                tabBarLabel: I18n.t("golf_course")
            }
        }
        return {
            title: params.title,
            tabBarLabel: params.title
        };
    };

    setTitle() {
        // console.log("........................set title : ",this.t('handicap'));
        this.props.navigation.setParams({
            title: this.t('golf_course')
        });
    }

    componentDidMount() {
        this.handleHardwareBackPress();
    }

    componentWillUnmount() {
        if (this.backHandler) this.backHandler.remove();
    }

    onBackPress() {
        let { navigation } = this.props;
        if (this.isScreenFocusSearching) {
            console.log('onBackPress', this.onParentEvent)
            this.isScreenFocusSearching = false;
            if (this.onParentEvent) {
                this.onParentEvent();
            }
        } else if (navigation) {
            navigation.goBack();
        }

    }

    handleHardwareBackPress() {
        let self = this;
        this.backHandler = BackHandler.addEventListener('hardwareBackPress', function () {
            self.onBackPress();
            return true;
        });
    }

    screenCallback(callback) {
        console.log('screenCallback');
        this.isScreenFocusSearching = callback;
    }

    _onNavigationStateChange = (prevState, newState) => {
        if (this.onParentEvent) {
            this.onParentEvent();
        }
        // this.textInputSearch.clear();
        // if (this.callbackCancelSearch) {
        //     this.callbackCancelSearch();
        // }
        // this.blur();
        console.log('_onNavigationStateChange', this.screen_index, newState.index)
        this.screen_index = newState.index;
        if(newState.index !== 1){
            //vao man hinh review thi hien button search
            this.setSearchHeaderHide();
        }else{
            this.setSearchHeader();
        }
        // switch (newState.index) {
        //     case 0:
        //         this.setType(Constant.FRIEND.TYPE.FRIEND);
        //         this.friendScreenConfig();
        //         break;
        //     case 1:
        //         this.setType(Constant.FRIEND.TYPE.GROUP);
        //         this.groupScreenConfig();
        //         break;
        //     case 2:
        //         this.setType(Constant.FRIEND.TYPE.CLUB);
        //         this.clubScreenConfig();
        //         break;
        //     default:
        //         break;
        // }
    }

    setSearchHeader(){
        console.log('setSearchHeader0')
        if(this.header){
            console.log('setSearchHeader1')
            this.header.setRightIcon(this.getResources().ic_Search);
            this.header.onIconMapClick = this.onSearchClick.bind(this);
        }
    }

    setSearchHeaderHide(){
        if(this.header){
            this.header.setHideRight();
        }
    }

    refreshScreen(){
        console.log('....................... screen index : ',this.screen_index);
        if(this.screen_index === 1){
            this.setSearchHeader();
        }else{
            this.setSearchHeaderHide();
        }
    }

    onSearchClick(){
        let navigation = PropsStatic.getAppSceneNavigator();
        if(navigation){
            navigation.navigate('search_facility_course_view',{refresh : this.refreshScreen.bind(this)});
        }
    }

    render() {
        return (
            <View style={{ flex: 1 }}>
                <HeaderView
                    ref={(header)=>{this.header = header;}}
                    title={this.t('golf_course')}
                    handleBackPress={this.onBackPress} />
                <Tab onNavigationStateChange={this._onNavigationStateChange}
                    screenProps={{ callback: this.screenCallback, parentEvent: this }} />
            </View>
        );
    }
}