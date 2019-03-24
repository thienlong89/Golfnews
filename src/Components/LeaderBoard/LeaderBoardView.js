import React from 'react';
import { View, BackHandler } from 'react-native';
import BaseComponent from '../../Core/View/BaseComponent';
import LeaderBoardTab from './LeaderBoardTabNavigator';
import styles from '../../Styles/LeaderBoard/StyleLeaderboardView';
import Constant from '../../Constant/Constant';
import ApiService from '../../Networking/ApiService';
import Networking from '../../Networking/Networking';
import LeaderBoardHeader from './LeaderBoardHeader';

import PropsStatic from '../../Constant/PropsStatic';
import I18n from 'react-native-i18n';
require('../../../I18n/I18n');


export default class LeaderBoardView extends BaseComponent {
    constructor(props) {
        super(props);
        //khai bao search complete callback, toi uu code sau
        this.isIphoneX = this.getAppUtil().isIphoneX();
        this.isNewUser = this.props.navigation.state.params ? this.props.navigation.state.params.isNewUser : false;
        this.completeSearchCallback = null;
        this.cancelSearchCallback = null;
        this.rank_type = Constant.LEADER_BOARD.RANK_TYPE.SINGLE;
        this.isSearchClick = false;
        this.callbackStartSearch = null;

        this.list_complete_search_callback = [];
        this.list_cancel_search_callback = [];
        this.list_start_search_callback = [];

        this.backHandler = null;

        // PropsStatic.setCallFun(Constant.NAVIGATOR_SCREEN.LEADERBOARD, this.setTitle.bind(this));
        let {params} = this.props.navigation.state;
        if(params && params.router){
            this.router = params.router;
        }else{
            this.router = null
        }
        // this.router = router;
    }

    static navigationOptions = ({navigation}) => {
        const {params} = navigation.state;
        console.log('...........................params : ',params);
        if(!params || !params.title){
            return {
                title : I18n.t("leaderboard_title"),
                tabBarLabel: I18n.t("leaderboard_title")
            }
        }
        return {
            title: params.title,
            tabBarLabel: params.title
            // headerRight: <Button
            //                  title="Refresh"
            //                  onPress={ () => params.handleRefresh() } />

        };
    };

    setTitle(){
        // console.log("........................set title : ",this.t('handicap'));
        this.props.navigation.setParams({
            title: this.t('leaderboard_title')
        });
    }

    /**
     * key la thứ tự màn hình screen
     * @param {*} key 
     * @param {*} callback 
     */
    addToListCompleteCallback(key, callback) {
        this.addToListCallback(this.list_complete_search_callback, key, callback);
    }

    addToListCancelCallback(key, callback) {
        this.addToListCallback(this.list_cancel_search_callback, key, callback);
    }

    addToListStartCallback(key, callback) {
        this.addToListCallback(this.list_start_search_callback, key, callback);
    }
    /**
     * add callback vao list
     * @param {*} list 
     * @param {*} key 
     * @param {*} callback 
     */
    addToListCallback(list, key, callback) {
        let obj = list.find(d => d.key === key);
        if (obj && typeof obj === 'object' && Object.keys(obj).length) return;
        let obj_callback = { key: key, value: callback };
        list.push(obj_callback);
    }

    static defaultProps = {
        // onBackCallback : null
    }

    onBackClick() {
        console.log("back click bxh");
        if (this.props.navigation) {
            if (!this.isNewUser) {
                this.props.navigation.goBack();
            } else {
                this.props.navigation.replace('app_screen');
            }
        }

        return true;
    }

    onSearchComplete(jsonData) {
        //console.log("json search ",this.completeSearchCallback);
        //this.loading.hideLoading();
        if (this.completeSearchCallback) {
            this.completeSearchCallback(jsonData);
        }
    }

    setConfigRankType(rank_type) {
        this.rank_type = rank_type;
    }

    onCancelClick() {
        this.isSearchClick = false;
        if (this.cancelSearchCallback) {
            this.cancelSearchCallback();
        }
        //console.log("cancel click : ", this.state.isSearchClick);
    }

    onChangeText(textInput) {
        if (textInput.trim().length) {
            if (this.callbackStartSearch) {
                this.callbackStartSearch();
            }
            this.sendSearch(textInput);
        }
    }

    sendSearch(query) {
        //default la tim kiem user
        //this.loading.showLoading();
        let url = this.getConfig().getBaseUrl() + ApiService.leaderboard_search(query, this.rank_type);
        if (this.rank_type.indexOf(Constant.LEADER_BOARD.RANK_TYPE.CLUB) >= 0) {
            url = this.getConfig().getBaseUrl() + ApiService.club_search(query);
        }
        console.log("search url : ", url)
        Networking.httpRequestGet(url, this.onSearchComplete.bind(this), () => {
            //time out
            /// this.loading.hideLoading();
            //this.popupTimeOut.showPopup();
        });
    }

    componentDidMount() {
        //this.setConfigHeader(this.state.rank_type);
        this.backHandler = BackHandler.addEventListener('hardwareBackPress', this.onBackClick.bind(this));
        if (this.header) {
            this.header.searchCallback = this.onChangeText.bind(this);
            this.header.cancelCallback = this.onCancelClick.bind(this);
            this.header.backCallback = this.onBackClick.bind(this);
            this.header.searchClickCallback = this.onSearchClick.bind(this);
        }
    }

    componentWillUnmount() {
        if (this.backHandler) {
            this.backHandler.remove();
        }
    }

    clearSearch() {
        this.header.clearSearch();
    }

    switchRankType(screen_index) {
        switch (screen_index) {
            case Constant.LEADER_BOARD.SCREEN_INDEX.PRO:
                this.rank_type = Constant.LEADER_BOARD.RANK_TYPE.PRO;
                break;
            case Constant.LEADER_BOARD.SCREEN_INDEX.SINGLE:
                this.rank_type = Constant.LEADER_BOARD.RANK_TYPE.SINGLE;
                break;
            case Constant.LEADER_BOARD.SCREEN_INDEX.BOGEY:
                this.rank_type = Constant.LEADER_BOARD.RANK_TYPE.BOGEY;
                break;
            case Constant.LEADER_BOARD.SCREEN_INDEX.TOP_18:
                this.rank_type = Constant.LEADER_BOARD.RANK_TYPE.TOP_18;
                break;
            case Constant.LEADER_BOARD.SCREEN_INDEX.LADDY:
                this.rank_type = Constant.LEADER_BOARD.RANK_TYPE.LADDY;
                break;
            case Constant.LEADER_BOARD.SCREEN_INDEX.CLUB:
                this.rank_type = Constant.LEADER_BOARD.RANK_TYPE.CLUB;
                break;
            default:
                break;
        }
    }

    screenConfig(screen_index) {
        this.switchRankType(screen_index);
        let obj = this.list_cancel_search_callback.find(d => d.key === screen_index);
        console.log('.....................screenConfig : ',obj);
        if (obj && typeof obj === 'object' && Object.keys(obj).length) {
            this.cancelSearchCallback = obj.value;
        }

        obj = this.list_complete_search_callback.find(d => d.key === screen_index);
        if (obj && typeof obj === 'object' && Object.keys(obj).length) {
            this.completeSearchCallback = obj.value;
        }

        obj = this.list_start_search_callback.find(d => d.key === screen_index);
        if (obj && typeof obj === 'object' && Object.keys(obj).length) {
            this.callbackStartSearch = obj.value;
        }
    }

    _onNavigationStateChange = (prevState, newState) => {
        //console.log("back state : ",prevState.index,newState.index);
        if(this.cancelSearchCallback){
            this.cancelSearchCallback();
        }
        this.clearSearch();
        this.screenConfig(newState.index);
        this.onCancelClick();
    }

    render() {

        return (
            <View style={styles.container}>
                <LeaderBoardHeader ref={(header) => { this.header = header; }} />
                <View style={[styles.container_content, this.isIphoneX ? { paddingBottom: 20 } : {}]}>
                    <LeaderBoardTab onNavigationStateChange={this._onNavigationStateChange} screenProps={{ parentNavigation: this.props.navigation, parent: this, is_search: this.isSearchClick , router : this.router ? this.router : undefined }} />
                </View>
            </View>
        );
    }

    onSearchClick() {
        console.log("search global !!");
        this.isSearchClick = true;
    }
}