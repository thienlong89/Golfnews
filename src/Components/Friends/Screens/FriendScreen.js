import React from 'react';
import {
    View,
    BackHandler
} from 'react-native';
import BaseComponent from '../../../Core/View/BaseComponent';
import FriendItem from './../Items/FriendItem';
import Networking from '../../../Networking/Networking';
import FriendModel from '../../../Model/Friends/FriendsModel';
import CheckHandicapView from '../../Common/CheckHandicapView';
import Touchable from 'react-native-platform-touchable';
import styles from '../../../Styles/Friends/Screens/StyleFriendScreen';
import ApiService from '../../../Networking/ApiService';
import AppUtil from '../../../Config/AppUtil';
import EmptyDataView from '../../../Core/Common/EmptyDataView';
import ListViewShow from '../../Common/ListViewShow';
import ListViewFriend from '../Items/ListViewFriend';
import PopupSelectTeeView from '../../Common/PopupSelectTeeView';
import StaticProps from '../../../Constant/PropsStatic';
import HeaderSearchView from '../../Common/HeaderSearchView';

import I18n from 'react-native-i18n';
require('../../../../I18n/I18n');

export default class FriendScreen extends BaseComponent {
    constructor(props) {
        super(props);
        this.isIphoneX = this.getAppUtil().isIphoneX();
        this.parent = null;
        this.page = 1;
        this.array_handicap = [];
        this.listDataFriend = [];
        this.isSearching = false;
        this.teeListAvailable = [];
        this.teeSelected = null;
        this.isCheckHandicapAll = true;
        this.courseData = '';
        this.state = {
            textInput: '',
            meData: {
                userId: '',
                fullname: '',
                avatar: '',
                handicap: '',
                member_id: '',
                default_tee_id: ''
            },
            scrollY: this.props.screenProps.animatedScrollY
        };

        this.onBackPress = this.onBackPress.bind(this);
        this.onChangeTeeAll = this.onChangeTeeAll.bind(this);
        this.onTeeSelected = this.onTeeSelected.bind(this);
        this.onChangeTeeFriendPress = this.onChangeTeeFriendPress.bind(this);
        this.onChangeMyTeePress = this.onChangeMyTeePress.bind(this);
        this.onScreenDidFocus = this.onScreenDidFocus.bind(this);
        this.onChangeSearchText = this.onChangeSearchText.bind(this);
        this.cancelSearchPress = this.onCancelSearch.bind(this);
    }

    componentDidMount() {
        this.rotateToPortrait();
        this.registerMessageBar();
        this.handleHardwareBackPress();

        this.checkHandicap.completeCallback = this.onSearchCheckHandicap.bind(this);
        this.checkHandicap.showPopupCallback = this.onCheckListClick.bind(this);
        this.checkHandicap.enableLoadingCallback = this.enableLoadingSearch.bind(this);
        this.listShow.itemClickCallback = this.onSelectedFacility.bind(this);
        /////////
        this.listViewFriend.loadMoreCallback = this.onLoadMore.bind(this);
        this.listViewFriend.refreshCallback = this._onRefresh.bind(this);
        this.listViewFriend.itemClickCallback = this.onUserClick.bind(this);
        // this.props.navigation.setParams({title: this.t('is_friend') });
        this.requestGetFriendList();
        // console.log('this.parent', this.parent)
        // screenProps.parent.navigation.addListener('didFocus', this.onScreenDidFocus);
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

    onBackPress() {
        if (this.isSearching) {
            this.onCancelSearch();
            this.refHeaderSearchView.cancelSearch();
        } else {
            if (this.props.navigation) {
                this.props.navigation.goBack();
            }
        }

    }

    static navigationOptions = () => ({
        title: I18n.t("is_friend"),
        tabBarLabel: I18n.t("is_friend"),
    });

    onScreenDidFocus() {
        console.log('FriendScreenss.onScreenDidFocus')
        if (global.isProfileDidUpdate2) {
            global.isProfileDidUpdate2 = false;
            this.onPersonalCallback();
        }

    }

    /**
     * show du lieu khi tim kiem xong
     * @param {*} listData 
     */
    onSearchCheckHandicap(listData) {
        if (this.listShow) {
            this.listShow.hideLoading();
            this.listShow.setFillData(listData);
        }
    }

    onSearchResponse(jsonData) {
        this.listViewFriend.hideLoading();
        if (!this.isSearching) return;
        var listUserSearch = [];
        this.model = new FriendModel(this);
        this.model.parseData(jsonData);
        if (this.model.getErrorCode() === 0) {
            for (let objData of this.model.getListFriendData()) {
                let obj = {
                    id: objData.getId(),
                    avatar: objData.getAvatar(),
                    fullname: objData.getFullname(),
                    userId: objData.getUserId(),
                    handicap: objData.getHandicap(),
                    member_id: objData.getMemberId(),
                    default_tee_id: objData.getDefaulTeeId(),
                    teeObject: {}
                }
                let handicap_obj;
                if (this.array_handicap.length) {
                    handicap_obj = this.array_handicap.find(d => d.user_id === AppUtil.replaceUser(objData.getUserId()));
                }
                if (handicap_obj) {
                    obj.facility_handicap = handicap_obj.display_course.value;
                }
                listUserSearch.push(obj);
            }

            if (listUserSearch.length) {
                this.emptyDataHide();
            } else {
                this.emptyDataShow();
            }
            this.listViewFriend.setFillData(listUserSearch, true, this.teeSelected);
        }
    }

    onCancelSearch() {
        this.isSearching = false;
        if (this.listDataFriend.length) {
            this.emptyDataHide();
        } else {
            this.emptyDataShow();
        }
        if (this.listViewFriend && this.listDataFriend)
            this.listViewFriend.setFillData(this.listDataFriend, false, this.teeSelected);
    }

    showLoading() {
        if (this.internalLoading) {
            this.internalLoading.showLoading();
        }
    }

    hideLoading() {
        if (this.internalLoading) {
            this.internalLoading.hideLoading();
        }
    }

    emptyDataShow() {
        if (this.emptyDataView) {
            this.emptyDataView.showEmptyView();
        }
    }

    emptyDataHide() {
        if (this.emptyDataView) {
            this.emptyDataView.hideEmptyView();
        }
    }

    onChangeSearchText(text) {
        this.isSearching = true;
        this.requestSearch(text);
    }

    requestSearch(query) {
        let self = this;
        this.listViewFriend.showLoading();

        let url = this.getConfig().getBaseUrl() + ApiService.user_search(query)
        console.log("url friend search ", url);
        Networking.httpRequestGet(url, this.onSearchResponse.bind(this), () => {
            //time out
            self.internalLoading.hideLoading();
            //self.popupTimeOut.showPopup();
        });
    }

    onStartSearch() {
        this.isSearching = true;
        this.listViewFriend.setFillData([], true, {});
        this.listViewFriend.showLoading();
    }

    enableLoadingSearch() {
        this.listShow.show();
        this.listShow.showLoading();
        this.listShow.setFillData([]);
    }

    /**
     * an list course khi nhan nut back
     */
    back() {
        if (this.listShow) {
            this.checkHandicap.blur();
            this.listShow.hide();
        }
    }

    render() {
        let { meData } = this.state;
        return (
            <View style={[styles.container, this.isIphoneX? {paddingBottom: 10}: {}]}>
                <HeaderSearchView
                    ref={(refHeaderSearchView) => { this.refHeaderSearchView = refHeaderSearchView }}
                    title={this.t('is_friend')}
                    handleBackPress={this.onBackPress}
                    onChangeSearchText={this.onChangeSearchText}
                    cancelSearchPress={this.cancelSearchPress} />

                <CheckHandicapView ref={(checkHandicap) => { this.checkHandicap = checkHandicap; }}
                    onChangeTeeAll={this.onChangeTeeAll} />
                <View style={styles.container_body}>
                    <View style={styles.container_body_view_me}>
                        <Touchable onPress={this.onUserClick.bind(this, meData.userId)}>
                            <FriendItem
                                fullname={meData.fullname}
                                ref={(itemMe) => { this.itemMe = itemMe }}
                                me={true}
                                data={meData}
                                onChangeTeePress={this.onChangeMyTeePress} />
                        </Touchable>
                    </View>
                    <ListViewFriend ref={(listViewFriend) => { this.listViewFriend = listViewFriend; }}
                        onChangeTeePress={this.onChangeTeeFriendPress}
                        scrollY={this.state.scrollY} />
                    <EmptyDataView ref={(emptyDataView) => { this.emptyDataView = emptyDataView; }} />
                    {this.renderInternalLoading()}
                    <ListViewShow ref={(listShow) => { this.listShow = listShow; }} 
                    customStyle={styles.facility_list}/>
                </View>

                <PopupSelectTeeView
                    ref={(refPopupSelectTeeView) => { this.refPopupSelectTeeView = refPopupSelectTeeView; }}
                    onTeeSelected={this.onTeeSelected} />
                {this.renderMessageBar()}
            </View>
        );
    }

    /**
     * refresh khi back lai tu man hinh khac
     */
    requestGetFriendListWhenBack() {
        let self = this;
        // this.showLoading();
        let url = this.getConfig().getBaseUrl() + ApiService.friend_list(this.page);
        //console.log("url friends ", url);
        Networking.httpRequestGet(url, (jsonData) => {
            //console.log('jsonData Friends : ',jsonData);
            self.hideLoading();
            self.model = new FriendModel(self);
            self.model.parseData(jsonData);
            if (self.model.getErrorCode() === 0) {
                let data_friend_clone = [];
                for (let objData of self.model.getListFriendData()) {
                    let obj = {
                        id: objData.getId(),
                        avatar: objData.getAvatar(),
                        fullname: objData.getFullname(),
                        userId: objData.getUserId(),
                        handicap: objData.getHandicap(),
                        member_id: objData.getMemberId(),
                        default_tee_id: objData.getDefaulTeeId(),
                        teeObject: self.teeSelected
                    }
                    let obj_check = self.listDataFriend.find(function (d) {
                        return (d.userId.toLowerCase().trim() === obj.userId.toLowerCase().trim());
                    });
                    // console.log('check object friend clone : ',obj_check);
                    if (obj_check) {
                        data_friend_clone.push(obj_check);
                    }
                }
                if (self.listDataFriend.length === data_friend_clone.length) {
                    return;
                } else {
                    self.listDataFriend = [];
                    self.listDataFriend = data_friend_clone.slice(0);
                    // console.log('render refesh list friend.......................');
                    if (self.listDataFriend.length) {
                        //self.emptyDataView.hideEmptyView();
                        self.emptyDataHide();
                        self.listViewFriend.setFillData(self.listDataFriend);
                    } else {
                        //self.emptyDataView.showEmptyView();
                        self.emptyDataShow();
                    }
                }
            }
        }, () => {
            //request timeout
            self.hideLoading();
            self.showErrorMsg(self.t('time_out'));
            // self.popupTimeOut.showPopup();
        });
    }

    requestGetFriendList() {
        let self = this;
        this.showLoading();
        let url = this.getConfig().getBaseUrl() + ApiService.friend_list(this.page);
        //console.log("url friends ", url);
        Networking.httpRequestGet(url, (jsonData) => {
            //console.log('jsonData Friends : ',jsonData);
            self.hideLoading();
            self.model = new FriendModel(self);
            self.model.parseData(jsonData);
            if (self.model.getErrorCode() === 0) {
                if (self.page === 1) {
                    let obj_me = {
                        id: self.model.getMeData().getId(),
                        userId: self.model.getMeData().getUserId(),
                        fullname: self.model.getMeData().getFullname(),
                        avatar: self.model.getMeData().getAvatar(),
                        handicap: self.model.getMeData().getHandicap(),
                        member_id: self.model.getMeData().getMemberId(),
                        default_tee_id: self.model.getMeData().getDefaulTeeId(),
                        teeObject: self.teeSelected
                    }
                    let handicap_obj;
                    if (self.array_handicap.length) {
                        handicap_obj = self.array_handicap.find(d => d.user_id === AppUtil.replaceUser(obj_me.userId));
                    }
                    if (handicap_obj) {
                        obj_me.facility_handicap = handicap_obj.display_course.value;
                    }
                    self.setState({
                        meData: obj_me
                    });
                }
                for (let objData of self.model.getListFriendData()) {
                    let obj = {
                        id: objData.getId(),
                        avatar: objData.getAvatar(),
                        fullname: objData.getFullname(),
                        userId: objData.getUserId(),
                        handicap: objData.getHandicap(),
                        member_id: objData.getMemberId(),
                        default_tee_id: objData.getDefaulTeeId(),
                        teeObject: self.teeSelected
                    }
                    let handicap_obj;
                    if (self.array_handicap.length) {
                        handicap_obj = self.array_handicap.find(d => d.user_id === AppUtil.replaceUser(objData.getUserId()));
                    }
                    if (handicap_obj) {
                        obj.facility_handicap = handicap_obj.display_course.value;
                    }
                    //console.log("obj = ",obj);
                    self.listDataFriend.push(obj);
                }
                //console.log("du lieu list friends : ", listDataFriend.length);
                if (self.listDataFriend.length) {
                    //self.emptyDataView.hideEmptyView();
                    self.emptyDataHide();
                    self.listViewFriend.setFillData(self.listDataFriend);
                } else {
                    //self.emptyDataView.showEmptyView();
                    self.emptyDataShow();
                }
            }
            //self.hideLoading();
        }, () => {
            //request timeout
            self.hideLoading();
            // self.popupTimeOut.showPopup();
            self.showErrorMsg(self.t('time_out'));
        });
    }

    onSelectedFacility(data) {
        this.courseData = data;
        this.teeListAvailable = data.getTeeInfoGender();
        this.checkHandicap.setDataSearch(data, this.teeSelected);

        this.requestCheckHandicapAll();
    }

    requestCheckHandicapAll(teeName) {
        let formData = {
            "friend_user_id": this.getUserInfo().getId(),
            "tee": teeName ? teeName : undefined,
            "course": this.courseData.getCourse()
        }

        this.formData = formData;
        console.log('formData check cap ', formData);
        let url = this.getConfig().getBaseUrl() + ApiService.check_handicap_facility();
        console.log('url', url);
        this.showLoading();
        let self = this;
        Networking.httpRequestPost(url, (jsonData) => {
            //console.log('check cap san : ',jsonData);
            if (jsonData.hasOwnProperty('error_code')) {
                let error_code = parseInt(jsonData['error_code']);
                if (error_code === 0) {
                    let data = jsonData['data'];
                    this.array_handicap = data['courses_handicap'];
                    self.findHandicap();
                }
            }
            self.hideLoading();
        }, formData, () => {
            self.hideLoading();
        });
    }

    /**
     * tim kiem cap san
     * @param {*} array_handicap 
     */
    findHandicap() {
        //me
        let handicap_me = this.array_handicap.find(d => this.getAppUtil().replaceUser(d.user_id) === this.getAppUtil().replaceUser(this.getUserInfo().getId()));
        //console.log("handicap me : ",handicap_me,this.array_handicap);
        if (handicap_me) {
            this.state.meData.facility_handicap = handicap_me.display_course.value;
            this.state.meData.teeObject = this.teeSelected ? this.teeSelected : { tee: this.state.meData.default_tee_id, color: this.state.meData.default_tee_id };
            this.setState({});
        }
        for (let d of this.listDataFriend) {
            d.teeObject = this.teeSelected ? this.teeSelected : { tee: d.default_tee_id, color: d.default_tee_id };
            let user_id = AppUtil.replaceUser(d.userId);
            let handicap_obj = this.array_handicap.find(d => parseInt(d.user_id) === user_id);
            if (handicap_obj) {
                d.facility_handicap = handicap_obj.display_course.value;
            }
        }

        this.listViewFriend.setFillData(this.listDataFriend, false, this.teeSelected);
    }

    onLoadMore() {
        if (this.isSearching || !this.internalLoading || this.listDataFriend.length < 10) return;
        this.page++;
        this.requestGetFriendList();
        // console.log("load more friend : ", this.page);
    }

    _onRefresh() {
        this.listDataFriend = [];
        this.page = 1;
        this.listViewFriend.setFillData(this.listDataFriend, false, this.teeSelected);
        this.requestGetFriendList();
        // console.log("refresh data ", listDataFriend.length);
    }

    /**
     * refresh khi back lai tu man hinh khac
     */
    refreshWhenBack(isReload = true) {
        console.log('.............................. reload ban be', isReload);
        if (!isReload) return;
        this.page = 1;
        this.requestGetFriendListWhenBack();
    }

    /**
     * show popup
     */
    onCheckListClick() {
        this.listShow.switchShow()
    }

    onUserClick(userId) {
        // const { screenProps } = this.props;
        // if (screenProps != null) {
        //     screenProps.parentNavigator.navigate('player_info', { refreshFriend: this.refreshWhenBack.bind(this), "puid": userId });
        // }

        let navigation = StaticProps.getAppSceneNavigator();
        if (!navigation) return;
        let isMe = (this.getAppUtil().replaceUser(userId) === this.getUserInfo().getId()) ? true : false;
        if (isMe) {
            navigation.navigate('persional_information', {
                puid: userId,
                personalCallback: this.onPersonalCallback.bind(this)
            })
        } else {
            navigation.navigate('player_info', { refreshFriend: this.refreshWhenBack.bind(this), "puid": userId });
        }
    }

    onPersonalCallback() {
        let {
            meData
        } = this.state;
        if (this.getUserInfo().getUserProfile()) {
            meData.fullname = this.getUserInfo().getUserProfile().getFullName();
            meData.avatar = this.getUserInfo().getUserProfile().getAvatar();
            this.itemMe.reRender();
        }
    }

    onChangeTeeAll() {
        this.isCheckHandicapAll = true;
        this.refPopupSelectTeeView.setVisible(this.teeListAvailable);
    }

    onChangeMyTeePress(friendModel) {
        this.isCheckHandicapAll = false;
        this.refPopupSelectTeeView.setVisible(this.teeListAvailable, { friendModel, index: -1, isMe: true });
    }

    onChangeTeeFriendPress(friendModel, index) {
        this.isCheckHandicapAll = false;
        this.refPopupSelectTeeView.setVisible(this.teeListAvailable, { friendModel, index, isMe: false });
    }

    onTeeSelected(teeObject, extrasData) {
        this.teeSelected = teeObject;

        if (this.isCheckHandicapAll) {
            this.checkHandicap.setTeeSelected(teeObject);
            this.requestCheckHandicapAll(teeObject.tee);
        } else {
            this.requestCheckHandicapFriend(teeObject.tee, extrasData);
        }
    }

    requestCheckHandicapFriend(teeName, { friendModel, index, isMe }) {
        let formData = {
            "user_ids": friendModel.id,
            "tee": teeName,
            "course": this.courseData.getCourse()
        }
        let url = this.getConfig().getBaseUrl() + ApiService.check_handicap_facility();
        console.log('url', url);
        // this.showLoading();
        let self = this;
        Networking.httpRequestPost(url, (jsonData) => {
            if (jsonData.hasOwnProperty('error_code')) {
                let error_code = parseInt(jsonData['error_code']);
                if (error_code === 0) {
                    let data = jsonData['data'];
                    if (data['courses_handicap'].length > 0) {
                        let handicap = data['courses_handicap'][0];
                        self.updateHandicapData(handicap, friendModel, index, isMe);
                    }
                }
            }
            // self.hideLoading();
        }, formData, () => {
            // self.hideLoading();
        });
    }

    onChangeTeeAll() {
        this.isCheckHandicapAll = true;
        this.refPopupSelectTeeView.setVisible(this.teeListAvailable);
    }

    onChangeMyTeePress(friendModel) {
        this.isCheckHandicapAll = false;
        this.refPopupSelectTeeView.setVisible(this.teeListAvailable, { friendModel, index: -1, isMe: true });
    }

    updateHandicapData(handicap, friendModel, index, isMe) {
        if (isMe) {
            // this.state.meData.teeObject = this.teeSelected;
            // this.state.meData.facility_handicap = handicap.display_course.value;
            // this.setState({
            //     meData: this.state.meData
            // })
            let { data } = this.itemMe.props;
            data.facility_handicap = handicap.display_course.value;
            data.teeObject = this.teeSelected;
            this.itemMe.reRender();
        } else {
            // this.listDataFriend[index].facility_handicap = handicap.display_course.value;
            // this.listDataFriend[index].teeObject = this.teeSelected;
            // this.listViewFriend.setFillData(this.listDataFriend, false, this.teeSelected, index);
            friendModel.facility_handicap = handicap.display_course.value;
            friendModel.teeObject = this.teeSelected;
            this.listViewFriend.renderItem(friendModel);
        }

    }
}