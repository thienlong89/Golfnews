import React from 'react';
import { View, Image, TextInput, Dimensions, Animated, BackHandler, Keyboard } from 'react-native';
import { TabNavigator, TabBarTop } from 'react-navigation';
import styles from '../../Styles/Friends/StylesFriendNavigator';
import Touchable from 'react-native-platform-touchable';
import FriendScreen from './Screens/FriendScreen';
import GroupScreen from './Screens/GroupScreen';
import CLBScreen from './Screens/CLBScreen';
import JoinFlightScreen from './Screens/JoinFlightScreen';

//import Header from './Header';
import BaseComponent from '../../Core/View/BaseComponent';
import Constant from '../../Constant/Constant';
import ApiService from '../../Networking/ApiService';
import Networking from '../../Networking/Networking';
import I18n from 'react-native-i18n';
import { verticalScale, scale } from '../../Config/RatioScale';
require('../../../I18n/I18n');
import { fromLeft, fadeIn } from 'react-navigation-transitions';

const { height } = Dimensions.get('window');

function getTitle() {
    return I18n.t('is_friend');
}

const Tab = TabNavigator(
    {
        Friends: {
            screen: FriendScreen,
            navigationOptions: {
                title: getTitle(),//'Bạn bè',
                fontSize: 10
            }
        },
        Group: {
            screen: GroupScreen,
            navigationOptions: {
                title: I18n.t('group'),//'Nhóm',
                fontSize: 10,
            }
        },
        GroupCLB: {
            screen: CLBScreen,
            navigationOptions: {
                title: I18n.t('clb_title'),//'CLB',
                fontSize: 10
            }
        },
        // JoinFlight: {
        //     screen: JoinFlightScreen,
        //     navigationOptions: {
        //         title: I18n.t('join_flight'),//'Join flight',
        //         fontSize: 10
        //     }
        // }
        
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

export default class FriendNavigator extends BaseComponent {
    constructor(props) {
        super(props);
        this.type = Constant.FRIEND.TYPE.FRIEND;
        this.callbackResponse = null;
        this.callbackCancelSearch = null;
        this.callbackStartSearch = null;
        this.startTime = 0;

        this.friendResponeCallback = null;
        this.friendCancelCallback = null;

        this.groupResponeCallback = null;
        this.groupCancelCallback = null;

        this.clubResponeCallback = null;
        this.clubCancelCallback = null;

        this.callbackFriendStartSearch = null;
        this.callbackGroupStartSearch = null;
        this.callbackClubStartSearch = null;
        this.state = {
            textSearch: '',
            scrollY: new Animated.Value(0)
        }

        this.onSearchClick = this.onSearchClick.bind(this);
        this.onBack = this.onBack.bind(this);
        this.backPressCallback = null;

        let { screenProps } = this.props;
        if (screenProps && screenProps.navigation) {
            this.navigation = screenProps.navigation;
        }

        this.backHandler = null;

        this.keyboardShow = false;
    }

    componentDidMount() {
        this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this._keyboardDidShow.bind(this));
        this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this._keyboardDidHide.bind(this));
        this.backHandler = BackHandler.addEventListener('hardwareBackPress', this.onBack);
    }

    componentWillUnmount() {
        if (this.keyboardDidHideListener) this.keyboardDidHideListener.remove();
        if (this.keyboardDidShowListener) this.keyboardDidShowListener.remove();
        if (this.backHandler) this.backHandler.remove();
    }

    /**
     * Ban phim an
     * @param {*} e 
     */
    _keyboardDidHide(e) {
        this.keyboardShow = false;
    }

    /**
     * ban phim show
     * @param {*} e 
     */
    _keyboardDidShow(e) {
        this.keyboardShow = true;
    }

    setType(type) {
        this.type = type;
        this.setState({
            textSearch: ''
        });
    }

    /**
     * tat ban phim
     */
    onBack() {
        if (this.callbackCancelSearch) {
            this.callbackCancelSearch();
        }
        if (this.backPressCallback) {
            this.backPressCallback();
        }
        if (this.keyboardShow) {
            this.blur();
            this.textInputSearch.clear();
        }else{
            if(this.navigation){
                this.navigation.goBack();
            }
        }
        return true;
    }

    friendScreenConfig() {
        if (this.friendResponeCallback) {
            this.callbackResponse = this.friendResponeCallback;
        }
        if (this.friendCancelCallback) {
            this.callbackCancelSearch = this.friendCancelCallback;
        }
        if (this.callbackFriendStartSearch) {
            this.callbackStartSearch = this.callbackFriendStartSearch;
        }
    }

    groupScreenConfig() {
        if (this.groupResponeCallback) {
            this.callbackResponse = this.groupResponeCallback;
        }
        if (this.groupCancelCallback) {
            this.callbackCancelSearch = this.groupCancelCallback;
        }
        if (this.callbackGroupStartSearch) {
            this.callbackStartSearch = this.callbackGroupStartSearch;
        }
    }

    clubScreenConfig() {
        if (this.clubResponeCallback) {
            this.callbackResponse = this.clubResponeCallback;
        }
        if (this.clubCancelCallback) {
            this.callbackCancelSearch = this.clubCancelCallback;
        }
        if (this.callbackClubStartSearch) {
            this.callbackStartSearch = this.callbackClubStartSearch;
        }
    }

    getUrl(type, query) {
        let url = this.getConfig().getBaseUrl();
        switch (type) {
            case Constant.FRIEND.TYPE.FRIEND:
                url = url + ApiService.user_search(query);
                break;
            case Constant.FRIEND.TYPE.GROUP:
                url = url + ApiService.group_search(query);
                break;
            case Constant.FRIEND.TYPE.CLUB:
                url = url + ApiService.club_search(query);
                break;
            default:
                break;
        }
        return url;
    }

    onSearchClick() {
        // this.onSubmmitEditing();
    }

    onChangeText(text) {
        this.changeText(text);
    }

    changeText(text) {
        console.log("tim kiem ");
        if (!text.trim().length) {
            //this.startTime = (new Date()).getTime();
            if (this.callbackCancelSearch) {
                this.callbackCancelSearch();
            }
            return;
        }
        if (this.callbackStartSearch) {
            this.callbackStartSearch();
        }

        let self = this;
        //this.cus.showLoading();
        let url = this.getUrl(this.type, text);
        console.log("url friend search ", url);
        Networking.httpRequestGet(url, (jsonData) => {
            console.log("search friens : ", self.callbackResponse, self.type);
            if (self.callbackResponse) {
                self.callbackResponse(jsonData);
            }
            //self.loading.hideLoading();
        }, () => {
            if (self.callbackResponse) {
                self.callbackResponse(jsonData);
            }
            //time out
            //self.loading.hideLoading();
            //self.popupTimeOut.showPopup();
        });
    }

    _onNavigationStateChange = (prevState, newState) => {
        //console.log("back state : ",prevState.index,newState.index);
        this.textInputSearch.clear();
        if (this.callbackCancelSearch) {
            this.callbackCancelSearch();
        }
        this.blur();
        switch (newState.index) {
            case 0:
                this.setType(Constant.FRIEND.TYPE.FRIEND);
                this.friendScreenConfig();
                break;
            case 1:
                this.setType(Constant.FRIEND.TYPE.GROUP);
                this.groupScreenConfig();
                break;
            case 2:
                this.setType(Constant.FRIEND.TYPE.CLUB);
                this.clubScreenConfig();
                break;
            default:
                break;
        }
    }

    blur() {
        this.textInputSearch.blur();
    }

    refreshView() {
        this.setState({});
    }

    render() {
        const { screenProps } = this.props;
        let translateY = this.state.scrollY.interpolate({
            inputRange: [0, 150],
            outputRange: [0, 0],
            extrapolate: 'clamp'
        });

        let TabsTranslateY = this.state.scrollY.interpolate({
            inputRange: [0, 150],
            outputRange: [0, -50],
            extrapolate: 'clamp'
        });

        return (
            <View style={styles.container}>
                {/* {this.renderLoading()} */}
                {/* <Animated.View style={{ transform: [{ translateY: translateY }], overflow: 'hidden' }}> */}
                    <View style={styles.header}>
                        <Touchable onPress={this.onBack}>
                            <Image style={styles.back_img} source={this.getResources().ic_back_large} />
                        </Touchable>
                        <View style={styles.header_search}>
                            <Touchable onPress={this.onSearchClick}>
                                <View style={styles.search_view}>
                                    <Image
                                        style={styles.search_image}
                                        source={this.getResources().ic_Search}
                                    />
                                </View>
                            </Touchable>
                            <TextInput allowFontScaling={global.isScaleFont} style={styles.input_search}
                                ref={(textInputSearch) => { this.textInputSearch = textInputSearch; }}
                                placeholder={this.t('input_friend_navigator')}
                                placeholderTextColor='#60CCC9'
                                underlineColorAndroid='rgba(0,0,0,0)'
                                //onSubmitEditing={this.onSubmmitEditing.bind(this)}
                                onChangeText={(text) => {
                                    this.onChangeText(text)
                                }}>
                            </TextInput>
                        </View>
                    </View>
                {/* </Animated.View> */}
                {/* <Animated.View style={{
                    flex: 0,
                    transform: [{ translateY: TabsTranslateY }],
                    height: height
                }}> */}
                    <Tab onNavigationStateChange={this._onNavigationStateChange}
                        screenProps={{ parent: this, navigation: this.props.navigation, parentNavigator: screenProps.parentNavigator, animatedScrollY: this.state.scrollY }} />
                {/* </Animated.View> */}
            </View>
        );
    }
}