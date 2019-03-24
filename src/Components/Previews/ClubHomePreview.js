/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    ListView,
    RefreshControl,
    BackHandler,
} from 'react-native';
import Touchable from 'react-native-platform-touchable';
import BaseComponent from '../../Core/View/BaseComponent';
import HeaderView from '../Common/HeaderView';
import ApiService from '../../Networking/ApiService';
import Networking from '../../Networking/Networking';
import CheckHandicapView from '../Common/CheckHandicapView';
import MyView from '../../Core/View/MyView';
import ClubMember from '../CLB/Items/ClubMember';
import FriendModel from '../../Model/Friends/FriendsModel';
import AcceptDeniView from '../CLB/Items/ClubAcceptDeniView';
import AppUtil from '../../Config/AppUtil';
import LoadingView from '../../Core/Common/LoadingView';
import EmptyDataView from '../../Core/Common/EmptyDataView';
import ListShowView from '../Common/ListViewShow';
import { Avatar } from 'react-native-elements';
import PopupLoadImage from '../Popups/PopupSelectImageFull';
import ProgressUpload from '../Common/ProgressUpload';
import PopupNotify from '../Popups/PopupNotificationView';

import {scale, verticalScale, fontSize} from '../../Config/RatioScale';

//const TAG = "[Vhandicap-v1] ClubHomeView : ";

export default class ClubHomePreview extends BaseComponent {
    constructor(props) {
        super(props);
        this.page = 1;
        this.clubId = '';
        this.clubTitle = '';
        this.array_handicap = [];
        this.listDataFriend = [];
        this.backHandler = null;
        this.facility_name = '';
        this.isCheckedHandicap = false;
        this.state = {
            refreshing: false,
            isAdmin: false,
            isMember: false,
            isAccepted: false,
            dataSource: new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 }),//).cloneWithRows(listDataFriend),
            logoUrl: ''
        }

        this.onLoadMore = this.onLoadMore.bind(this);
        this.onRefresh = this.onRefresh.bind(this);
        this.onShareClick = this.onShareClick.bind(this);
        this.onAceeptClick = this.onAceeptClick.bind(this);
        this.onDeniedClick = this.onDeniedClick.bind(this);
    }

    /**
     * Tao event cho club
     */
    onCreateEvent() {
        //console.log("props : ",this.props);
        let { screenProps } = this.props;
        screenProps.parentNavigator.navigate('event_create', { mode: 'club' });
    }

    onBackClick() {
        let { navigation } = this.props;
        if (navigation) {
            let { refresh } = navigation.state.params;
            if (refresh) {
                refresh();
            }
            navigation.goBack();
        }
        return true;
    }

    /**
     * tim kiem cap san
     * @param {*} array_handicap 
     */
    findHandicap() {
        for (let d of this.listDataFriend) {
            let user_id = AppUtil.replaceUser(d.userId);
            let handicap_obj = this.array_handicap.find(d => parseInt(d.user_id) === user_id);
            if (handicap_obj) {
                d.facility_handicap = handicap_obj.display_course.value;
            }
        }
        // console.log("list sau khi check ",listDataFriend);
        this.isCheckedHandicap = true;
        let dataSource = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
        this.setState({
            dataSource: dataSource.cloneWithRows(this.listDataFriend),
        });
    }

    /**
     * gui yeu cau check cap san
     * @param {*} formData 
     */
    sendCheckHandicap(formData) {
        let url = this.getConfig().getBaseUrl() + ApiService.check_handicap_facility();
        this.customLoading.showLoading();
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
            self.customLoading.hideLoading();
        }, formData, () => {
            self.customLoading.hideLoading();
        });
    }

    onChangeAvatarClick() {
        this.popupSelectImage.show();
        this.popupSelectImage.onTakePhotoCallback = this.onTakePhotoClick.bind(this);
        this.popupSelectImage.onImportGalleryCallback = this.onImportGalleryClick.bind(this);
    }

    async onTakePhotoClick() {
        let imageUri = await AppUtil.onTakePhotoClick(true);
        this.sendUploadLogo(imageUri);
    }

    async onImportGalleryClick() {
        let imageUri = await AppUtil.onImportGalleryClick(true);
        this.sendUploadLogo(imageUri);
    }

    setTimeOut() {
        this.intervalId = setInterval(() => {
            if (this.progressUpload) {
                this.progressUpload.hideLoading();
            }
            if (this.intervalId) {
                clearInterval(this.intervalId);
            }
        }, 15000);
    }

    /**
     * upload logo
     */
    sendUploadLogo(imageUri) {
        let url = this.getConfig().getBaseUrl() + ApiService.club_upload_logo();
        let self = this;
        this.progressUpload.showLoading();
        //time out up anh
        this.setTimeOut();
        AppUtil.upload(url, imageUri, (jsonData) => {
            if (self.intervalId) {
                clearInterval(self.intervalId);
            }
            self.progressUpload.hideLoading();
            console.log('upload club avatar : ', jsonData);
            if (jsonData.hasOwnProperty('error_code')) {
                let error_code = parseInt(jsonData['error_code']);
                if (error_code === 0) {
                    let data = jsonData['data'];
                    let array_paths = data['image_paths'];
                    let image_obj = array_paths.length ? array_paths[array_paths.length - 1] : {};
                    if (image_obj.hasOwnProperty('path')) {
                        self.sendUpdateEventLogo(image_obj.path, image_obj.url);
                    }
                }
                else {
                    self.popupNofity.setMsg(jsonData['error_msg']);
                }
            }
        }, () => {
            if (self.intervalId) {
                clearInterval(self.intervalId);
            }
            self.progressUpload.hideLoading();
            self.popupNofity.setMsg(this.t('upload_image_error'));
        }, (progress) => {
            self.progressUpload.setProgress(progress);
        });
    }

    showLoading() {
        if (this.customLoading) {
            this.customLoading.showLoading();
        }
    }

    hideLoading() {
        if (this.customLoading) {
            this.customLoading.hideLoading();
        }
    }

    sendUpdateEventLogo(urlImage, pathUrl) {
        let url = this.getConfig().getBaseUrl() + ApiService.club_update(this.clubId);
        this.showLoading();
        let self = this;
        let formData = {
            logo_url_path: urlImage
        }
        console.log("formData chang club avatar ", formData, pathUrl);
        Networking.httpRequestPost(url, (jsondData) => {
            self.hideLoading();
            console.log("update club : ", jsondData);
            if (jsondData.hasOwnProperty('error_code')) {
                let error_code = jsondData['error_code'];
                if (error_code === 0) {
                    self.props.navigation.state.params.logoUrl = pathUrl;
                    //console.log("path : ",self.props.navigation.state.params.logoUrl = pathUrl);
                    self.setState({});
                }
                else {
                    self.popupNofity.setMsg(jsondData['error_msg']);
                }
            }
        }, formData, () => {
            self.hideLoading();
        });
    }

    onShareClick() {
        let { navigation } = this.props;
        if (navigation) {
            let data = { club_name: this.clubTitle, facility_name: this.facility_name }
            navigation.navigate('club_share', { data: data, list_users: this.listDataFriend });
        }
    }

    renderView() {
        const { isAdmin, isAccepted, isMember, logoUrl, clubName, invitation_id } = this.props.navigation.state.params;
        //let { logoUrl, clubName } = this.props.navigation.state.params;
        console.log("ccheck permission..................... : ", isMember,isAccepted,isAdmin);
        if (isAdmin) {
            return <View style={styles.container}>
                <HeaderView ref={(headerView) => { this.headerView = headerView; }} />
                <PopupNotify ref={(popupNofity) => { this.popupNofity = popupNofity; }} />
                <View style={{ height: verticalScale(85), alignItems: 'center', flexDirection: 'row' }}>
                    <Touchable onPress={this.onChangeAvatarClick.bind(this)}>
                        <Avatar
                            width={verticalScale(70)}
                            height={verticalScale(70)}
                            // avatarStyle={{ borderColor: '#00aba7', borderWidth: 2 }}
                            containerStyle={{ marginLeft: scale(10), marginTop: verticalScale(10) }}
                            rounded={true}
                            source={{ uri: logoUrl }}
                        />
                    </Touchable>
                    <Text allowFontScaling={global.isScaleFont} style={{ fontSize: fontSize(28,scale(14)), color: '#000', marginLeft: scale(10) }}>{clubName}</Text>
                </View>
                <View style={{ flex: 1 }}>
                    <CheckHandicapView ref={(checkHandicap) => { this.checkHandicap = checkHandicap; }} />
                    <MyView style={styles.add_member_container} hide={!isAdmin}>
                        <Touchable onPress={this.onAddClubMemberClick.bind(this)}>
                            <View style={styles.add_member_view}>
                                <Image
                                    style={styles.add_member_image}
                                    source={this.getResources().icon_add_member}
                                />
                            </View>
                        </Touchable>
                        <Text allowFontScaling={global.isScaleFont} style={styles.add_member_text}>{this.t('add_member')}</Text>
                    </MyView>
                    <MyView style={styles.line_view} hide={!isAdmin}></MyView>
                    <View style={{ flex: 1 }}>
                        <ListView style={styles.list_view}
                            dataSource={this.state.dataSource}
                            enableEmptySections={true}
                            onEndReachedThreshold={5}
                            keyboardShouldPersistTaps='always'
                            onEndReached={this.onLoadMore}
                            renderSeparator={(sectionId, rowId) => <View key={rowId} style={styles.separator_view} />}
                            renderRow={(rowData) =>
                                // <Touchable onPress={this.onUserClick.bind(this, rowData.userId)}>
                                    <ClubMember data={rowData}
                                    />
                                // </Touchable>
                            }
                            refreshControl={
                                <RefreshControl
                                    refreshing={this.state.refreshing}
                                    onRefresh={this.onRefresh}
                                />
                            }
                        />
                        <EmptyDataView ref={(emptyDataView) => { this.emptyDataView = emptyDataView; }} />
                        {/* <Touchable onPress={this.onCreateEvent.bind(this)}>
                            <MyView style={styles.create_event_view} hide={this.state.isAdmin ? false : true}>
                                <Image
                                    style={styles.create_event_image}
                                    source={this.getResources().ic_event}
                                ></Image>
                                <Text allowFontScaling={global.isScaleFont} style={styles.create_event_text}>{this.t('create_event_club')}</Text>
                            </MyView>
                        </Touchable> */}
                        <Touchable onPress={this.onShareClick}>
                            <MyView style={styles.share_view} hide={!this.isCheckedHandicap}>
                                <Image
                                    style={styles.share_image}
                                    source={this.getResources().share_logo}
                                ></Image>
                                <Text allowFontScaling={global.isScaleFont} style={styles.share_text}>{this.t('share')}</Text>
                            </MyView>
                        </Touchable>
                        <LoadingView ref={(customLoading) => { this.customLoading = customLoading; }}
                            isShowOverlay={false} />
                    </View>
                    <ListShowView ref={(listShow) => { this.listShow = listShow; }} />
                </View>
                <PopupLoadImage ref={(popupSelectImage) => { this.popupSelectImage = popupSelectImage; }} />
                <ProgressUpload
                    ref={(progressUpload) => { this.progressUpload = progressUpload; }}
                />
            </View>
        } else if (isMember) {
            //check xem nguoi choi da accepted chua
            if (isAccepted) {
                return <View style={styles.container}>
                    <HeaderView ref={(headerView) => { this.headerView = headerView; }} />
                    <View style={{ flex: 1 }}>
                        <CheckHandicapView ref={(checkHandicap) => { this.checkHandicap = checkHandicap; }} />
                        <View style={styles.line_view}></View>
                        <View style={{ flex: 1 }}>
                            <ListView style={styles.list_view}
                                dataSource={this.state.dataSource}
                                enableEmptySections={true}
                                onEndReachedThreshold={5}
                                keyboardShouldPersistTaps='always'
                                onEndReached={this.onLoadMore}
                                renderSeparator={(sectionId, rowId) => <View key={rowId} style={styles.separator_view} />}
                                renderRow={(rowData) =>
                                    // <Touchable onPress={this.onUserClick.bind(this, rowData.userId)}>
                                        <ClubMember data={rowData}
                                        />
                                    // </Touchable>
                                }
                                refreshControl={
                                    <RefreshControl
                                        refreshing={this.state.refreshing}
                                        onRefresh={this.onRefresh}
                                    />
                                }
                            />
                            <EmptyDataView ref={(emptyDataView) => { this.emptyDataView = emptyDataView; }} />
                            <Touchable onPress={this.onShareClick}>
                                <MyView style={styles.share_view} hide={(!isAccepted || !this.isCheckedHandicap)}>
                                    <Image
                                        style={styles.share_image}
                                        source={this.getResources().share_logo}
                                    ></Image>
                                    <Text allowFontScaling={global.isScaleFont} style={styles.share_text}>{this.t('share')}</Text>
                                </MyView>
                            </Touchable>
                            <LoadingView ref={(customLoading) => { this.customLoading = customLoading; }}
                                isShowOverlay={false} />
                        </View>
                        <ListShowView ref={(listShow) => { this.listShow = listShow; }} />
                    </View>
                </View>
            } else {
                //chua accept
                return <View style={styles.container}>
                    <HeaderView ref={(headerView) => { this.headerView = headerView; }} />
                    <AcceptDeniView invitation_id={invitation_id}
                        acceptCallback={this.onAceeptClick}
                        deniedCallback={this.onDeniedClick} />
                    <MyView style={{ height: verticalScale(30), backgroundColor: '#ebebeb', justifyContent: 'center' }} hide={isAdmin}>
                        <Text allowFontScaling={global.isScaleFont} style={{ marginLeft: scale(10), color: '#828282', fontSize: fontSize(14)}}>{this.t('danh_sach_thanh_vien')}</Text>
                    </MyView>
                    <View style={{ flex: 1 }}>
                        <ListView style={styles.list_view}
                            dataSource={this.state.dataSource}
                            enableEmptySections={true}
                            onEndReachedThreshold={5}
                            keyboardShouldPersistTaps='always'
                            onEndReached={this.onLoadMore}
                            renderSeparator={(sectionId, rowId) => <View key={rowId} style={styles.separator_view} />}
                            renderRow={(rowData) =>
                                // <Touchable onPress={this.onUserClick.bind(this, rowData.userId)}>
                                    <ClubMember data={rowData} />
                                // </Touchable>
                            }
                            refreshControl={
                                <RefreshControl
                                    refreshing={this.state.refreshing}
                                    onRefresh={this.onRefresh}
                                />
                            }
                        />
                        <EmptyDataView ref={(emptyDataView) => { this.emptyDataView = emptyDataView; }} />
                        <LoadingView ref={(customLoading) => { this.customLoading = customLoading; }}
                            isShowOverlay={false} />
                    </View>
                </View>
            }
        }
        return <View style={styles.container}>
            <HeaderView ref={(headerView) => { this.headerView = headerView; }} />
            <View style={{ flex: 1 }}>
                <CheckHandicapView ref={(checkHandicap) => { this.checkHandicap = checkHandicap }} />
                <LoadingView ref={(customLoading) => { this.customLoading = customLoading; }}
                    isShowOverlay={false} />
                <ListShowView ref={(listShow) => { this.listShow = listShow; }} />
            </View>
        </View>
    }

    /**
    * show du lieu khi tim kiem xong
    * @param {*} listData 
    */
    onSearchCheckHandicap(listData) {
        //console.log("data search : ",listData);
        if (this.listShow) {
            this.listShow.hideLoading();
            this.listShow.setFillData(listData);
            if (!this.listShow.itemClickCallback) {
                this.listShow.itemClickCallback = this.onSelectedFacility.bind(this);
            }
        }
    }

    /**
     * show popup
     */
    onCheckListClick() {
        this.listShow.switchShow()
    }

    onSelectedFacility(data) {
        console.log("chon san co id la : ", data);
        this.checkHandicap.setDataSearch(data);
        let formData = {
            "club_id": this.clubId,
            "course" : data.getCourse()
            // "course": {
            //     "facility_id": data.getId(),
            //     "path_id1": data.getPathId1(),
            //     "path_id2": data.getPathId2(),
            //     "title": data.getTitle(),
            //     "black_slope": data.getBlackSlope(),
            //     "gold_slope": data.getGoldSlope(),
            //     "blue_slope": data.getBlueSlope(),
            //     "white_slope": data.getWhiteSlope(),
            //     "red_slope": data.getRedSlope()
            // }
        }
        this.facility_name = data.getTitle();
        //console.log('formData check cap ',formData);
        this.sendCheckHandicap(formData);
    }

    componentDidMount() {
        const { clubId, clubName, isAdmin, isAccepted, isMember, invitation_id } = this.props.navigation.state.params;
        //console.log("club name : ", clubName, isAdmin);
        this.headerView.setTitle(clubName);
        this.headerView.callbackBack = this.onBackClick.bind(this);
        // this.checkHandicap.selectedCallback = this.onSelectedFacility.bind(this);
        this.clubId = clubId;
        this.clubTitle = clubName;
        this.invitation_id = invitation_id;//id cua lời mời
        this.backHandler = BackHandler.addEventListener('hardwareBackPress', this.onBackClick.bind(this));
        //console.log("check handicap view : ",this.checkHandicap);
        if (this.checkHandicap) {
            this.checkHandicap.completeCallback = this.onSearchCheckHandicap.bind(this);
            this.checkHandicap.showPopupCallback = this.onCheckListClick.bind(this);
            this.checkHandicap.enableLoadingCallback = this.enableLoadingSearch.bind(this);
        }
        if (this.listShow) {
            this.listShow.itemClickCallback = this.onSelectedFacility.bind(this);
        }
        // console.log("callback list : ", this.listShow.itemClickCallback);
        this.state.isAdmin = isAdmin;
        this.state.isMember = isMember;
        this.state.isAccepted = isAccepted;

        // if (isAdmin) {
        //     this.headerView.setRight(true, this.onCreateEvent.bind(this));
        //     this.headerView.setEventButton();
        // }
        this.sendRequestListMember(this.clubId);
    }

    enableLoadingSearch() {
        if(!this.listShow) return;
        this.listShow.show();
        this.listShow.showLoading();
        this.listShow.setFillData([]);
    }

    componentWillUnmount() {
        if (this.backHandler) {
            this.backHandler.remove();
        }
    }

    sendRequestListMember(clubId) {
        this.customLoading.showLoading();
        let url = this.getConfig().getBaseUrl() + ApiService.club_list_member(clubId, this.page);
        console.log("url ", url);
        let self = this;
        Networking.httpRequestGet(url, this.onResponseData.bind(this), () => {
            //time out
            self.customLoading.hideLoading();
            self.popupTimeOut.showPopup();
        });
    }

    onResponseData(jsonData) {
        this.model = new FriendModel(this);
        this.model.parseData(jsonData);
        if (this.model.getErrorCode() === 0) {
            //console.log("leng friends : ",length);
            for (let objData of this.model.getListFriendData()) {
                let obj = {
                    avatar: objData.getAvatar(),
                    fullname: objData.getFullname(),
                    userId: objData.getUserId(),
                    handicap: objData.getHandicap(),
                    member_id: objData.getMemberId(),
                    "is_friend": objData.isFriend(),
                    "is_waiting_friend_request": objData.isWaitingForAccept(),
                }
                let handicap_obj;
                if (this.array_handicap.length) {
                    handicap_obj = this.array_handicap.find(d => d.user_id === AppUtil.replaceUser(objData.getUserId()));
                }
                if (handicap_obj) {
                    obj.facility_handicap = handicap_obj.display_course.value;
                }
                this.listDataFriend.push(obj);
            }
            // console.log("du lieu list friends : ", listUsers.length);
            if (this.listDataFriend.length) {
                this.setState({
                    dataSource: this.state.dataSource.cloneWithRows(this.listDataFriend),
                });
            }
            // self.setCallback();
        }
        this.customLoading.hideLoading();
    }

    onUserClick() {

    }

    onLoadMore() {
        if (!this.customLoading) return;
        this.page++;
        this.sendRequestListMember(this.clubId);
    }

    onRefresh() {
        //refesh lai data
        this.page = 1;
        this.listDataFriend = [];
        this.setState({
            dataSource: this.state.dataSource.cloneWithRows(this.listDataFriend),
        });
        this.sendRequestListMember(this.clubId);
    }

    onAddClubMemberClick() {
        if (!this.props.navigation) return;
        this.props.navigation.navigate('club_add_member', { club_id: this.clubId });
    }

    onAceeptClick() {
        // const { isAdmin, isAccepted, isMember, logoUrl, clubName,invitation_id } = this.props.navigation.state.params;
        this.props.navigation.state.params.isMember = true;
        this.props.navigation.state.params.isAccepted = true;
        this.setState({
            isMember: true,
            isAccepted: true
        });
        this.onRefresh();
    }

    onDeniedClick() {
        this.props.navigation.goBack();
    }

    render() {
        return (
            this.renderView()
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff'
    },

    add_member_container: {
        height: verticalScale(50),
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        marginTop: verticalScale(10)
    },

    add_member_view: {
        width: verticalScale(40),
        height: verticalScale(40),
        borderRadius: verticalScale(20),
        marginLeft: scale(10),
        borderWidth: verticalScale(2),
        borderColor: 'green',
        justifyContent: 'center',
        alignItems: 'center'
    },

    add_member_image: {
        width: verticalScale(24),
        height: verticalScale(24),
        resizeMode: 'contain'
    },

    add_member_text: {
        fontSize: fontSize(17,scale(1)),// 17,
        marginLeft: scale(10)
    },

    line_view: {
        backgroundColor: "#e3e3e3",
        height: 1,
        marginTop: verticalScale(10)
    },

    list_view: {
        flex: 1,
        marginBottom: verticalScale(10)
    },

    separator_view: {
        flex: 1,
        height: 1,
        backgroundColor: '#E3E3E3'
    },

    create_event_view: {
        height: verticalScale(40),
        marginBottom: verticalScale(10),
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#00aba7',
        marginLeft: scale(10),
        marginRight: scale(10)
    },

    create_event_image: {
        width: scale(30),
        height: verticalScale(20),
        resizeMode: 'contain'
    },

    create_event_text: {
        marginLeft: scale(8),
        color: 'white',
        textAlign: 'center',
        fontSize: fontSize(20,scale(4)),// 20
    },

    share_view: {
        height: verticalScale(50),
        marginBottom: verticalScale(10),
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#00aba7',
        marginLeft: scale(10),
        marginRight: scale(10)
    },

    share_image: {
        width: scale(30),
        height: verticalScale(20),
        resizeMode: 'contain'
    },

    share_text: {
        marginLeft: scale(8),
        color: 'white',
        textAlign: 'center',
        fontSize: fontSize(20,scale(4)),// 20
    }
});