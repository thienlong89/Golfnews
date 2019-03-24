import React from 'react';
import { Text, View, Image, ScrollView, BackHandler, Dimensions } from 'react-native';
import styles from '../../Styles/PlayerInfo/StylePlayerInfo';
import Networking from '../../Networking/Networking';
import BaseComponent from '../../Core/View/BaseComponent';
import Touchable from 'react-native-platform-touchable';
import ApiService from '../../Networking/ApiService';
import PopupCaptcha from '../Common/PopupCaptcha';
import PlayerInfoItem from './PlayerInfoItem';
import { verticalScale, scale, fontSize } from '../../Config/RatioScale';
// import StatisticsItemView from './Items/StatisticsItemView';
import DialogConfirm from '../Popups/DialogConfirm';
// import AcceptRejectInviteFriend from './Items/AcceptRejectInviteFriend';
import ComCheckHandicap from '../Home/Screens/coms/ComCheckHandicap';
import ComClubJoind from '../Home/Screens/coms/ComClubJoind';
import ComButtonHistory from '../Home/Screens/coms/ComButtonHistory';
import ComAward from '../Home/Screens/coms/ComAward';
import ComChat from '../Home/Screens/coms/ComChat';
import ComAcceptFriend from '../Home/Screens/coms/ComAcceptFriend';
import BaseComponentAddLoading from '../../Core/View/BaseComponentAddLoading';
import PlayerInfoModel from '../../Model/PlayerInfo/PlayerInfoModel';
import StaticProps from '../../Constant/PropsStatic';
import PersonalAccessories from '../Users/Items/PersonalAccessories';
import PopupNotificationFullView from '../Popups/PopupNotificationFullView';

// const HEADER_EXPANDED_HEIGHT = 320;
// const HEADER_COLLAPSED_HEIGHT = 80;
// const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;

// var courseList = [];
export default class PlayerInfoView extends BaseComponentAddLoading {

    constructor(props) {
        super(props);
        this.isIphoneX = this.getAppUtil().isIphoneX();
        this.uid = this.getUserInfo().getId();
        const { params } = this.props.navigation.state;
        this.puid = params.puid || '';
        this.friend_status = 0;
        this.isMe = (this.getAppUtil().replaceUser(this.puid) === this.uid) ? true : false;
        this.isRequestFLightHistory = false;
        this.backHandler = null;
        // this.teeListAvailable = [];
        this.userProfile = '';
        // this.state = {
        //     // course_name: '',
        //     // teeColor: '#4294F7',
        //     // handicap_facility: 0,
        //     isHideHistoryBtn: false,
        //     // isHideClubJoin: false,
        //     // clubList: [],
        //     isSearching: false,
        //     // onCourseSearchQuery: '',
        //     // isHideHandicap: true,

        //     // dataSource: new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 }),
        //     // showIconAddFriend: true,
        //     // icon_add_friend: '',
        //     isCanViewHistory: true,
        //     // isZoomOut: false,
        //     // isShowInvite: false,
        //     // userName: '',

        //     // scrollY: new Animated.Value(0),
        //     // header_expanded_height: 260
        // }

        // this.onCategoryPress = this.onCategoryPress.bind(this);
        this.onAcceptInviteFriendClick = this.onAcceptInviteFriendClick.bind(this);
        this.onRejectInviteFriendClick = this.onRejectInviteFriendClick.bind(this);
        this.onFlightHistoryClick = this.onFlightHistoryClick.bind(this);
        this.onBackPress = this.onBackPress.bind(this);

        this.showPopupAddFriend = this.showPopupAddFriend.bind(this);

        this.onCertificateClick = this.onCertificateClick.bind(this);
        this.onCompareClick = this.onCompareClick.bind(this);
        this.onPopupCaptchaConfirm = this.onPopupCaptchaConfirm.bind(this);
    }

    onCertificateClick() {
        let navigation = StaticProps.getAppSceneNavigator();
        if (navigation) {
            if (this.isMe) {
                navigation.navigate('certificate', { orientationPortrait: this.rotateToPortraitScreen.bind(this) });
            } else {
                navigation.navigate('certificate_user_other', {
                    puid: this.puid,
                    profile: this.userProfile,
                    orientationPortrait: this.rotateToPortraitScreen.bind(this)
                });
            }
        }
    }

    rotateToPortraitScreen() {
        this.rotateToPortrait();
    }

    onCompareClick() {
        let navigation = StaticProps.getAppSceneNavigator();
        if (navigation) {
            navigation.navigate('compare_performance', {
                puid: this.puid,
                isMe: false,
                playerProfile: this.userProfile
            });
        }
    }

    onChatClick() {
        let id_firebase = this.userProfile.data.id_firebase;
        console.log('.............................. id_firebase chat : ', id_firebase);
        if (!id_firebase && this.refPopupNotify) {
            this.refPopupNotify.setMsg(this.t('disable_chat').format(this.userProfile.fullname, this.userProfile.fullname));
            return;
        }

        let navigation = StaticProps.getAppSceneNavigator();
        if (navigation) {
            //userid: data.id, categoriz: 'friend', name: data.fullname, id_firebase: data.id_firebase, is_friends: data.is_friends, refresh: this.refresh 
            navigation.navigate('chat_private', { name: this.userProfile.fullname, categoriz: 'friend', userid: this.puid, id_firebase: this.userProfile.data.id_firebase });
        }
    }

    sendRequestGetUserProfile() {
        if (!this.puid) return;
        // this.showCustomLoading();
        let url = this.getConfig().getBaseUrl() + ApiService.user_profile(this.puid);
        console.log("....................... url : ", url);
        let self = this;
        Networking.httpRequestGet(url, (jsonData) => {
            // self.hideCustomLoading();
            self.model = new PlayerInfoModel(self);
            self.model.parseData(jsonData);
            if (self.model.getErrorCode() === 0) {
                // self.updatePlayerInfo(self.model);
                self.updateData(self.model);
            } else {
                self.showErrorMsg(self.model.getErrorMsg());
            }
        }, () => {
            // self.hideCustomLoading();
        });
    }

    updatePlayerInfo(playerInfo) {
        if (this.playerInfoItem) {
            this.playerInfoItem.updatePlayerInfo(playerInfo);
        }
    }

    updateData(playerInfo) {
        let puid = playerInfo.getPuid();
        let friend_status = playerInfo.getFriendStatus();
        let listClubs = playerInfo.getClubList();
        this.userProfile = playerInfo.getPlayerProfile();

        this.friend_status = friend_status;

        this.updatePlayerInfo(playerInfo);
        this.refComCheckcap.updateTeeDefault(this.userProfile.default_tee_id);
        this.refComAcceptFriend.updateData(friend_status, puid);
        if (this.friend_status === 1 || this.isMe) {
            //ban be thi show thanh tich
            this.refComAward.updateData(puid);
        }
        this.refComButtonHistory.updateData(playerInfo);
        this.refComChat.updateData(friend_status, this.isMe);
        this.refComClub.updateData(listClubs);
    }

    /**
     * Đồng ý lời mời kết bạn
     */
    onAcceptClick() {
        let content = this.t('content_accept_invite_friend').format(`${this.userProfile.fullname}-${this.userProfile.getUserId()}`);
        this.dialogConfirm.confirmCallback = this.onAcceptInviteFriendClick.bind(this);
        this.dialogConfirm.setContent(content);
    }

    /**
     * Từ chối lời mời kết bạn
     */
    onRejectClick() {
        let content = this.t('content_reject_invite_friend').format(`${this.userProfile.fullname}-${this.userProfile.getUserId()}`);
        this.dialogConfirm.confirmCallback = this.onRejectInviteFriendClick.bind(this);
        this.dialogConfirm.setContent(content);
    }

    showPopupAddFriend() {
        // let { params } = this.props.navigation.state;
        // console.log('.................................. ', this.userProfile, params);
        let content = '';
        if (this.friend_status === -1) {
            //dang la ban thi la button moi ket ban
            content = this.t('content_send_add_friend').format(`${this.userProfile.fullname}-${this.puid}`);
            this.dialogConfirm.confirmCallback = this.sendRequestAddFriend.bind(this);
        } else if (this.friend_status === 0) {
            content = this.t('cancel_send_request_invite').format(`${this.userProfile.fullname}-${this.puid}`);
            this.dialogConfirm.confirmCallback = this.sendRequestRemoveFriend.bind(this);
        }
        else {
            //tam check cav truong hop con lai
            content = this.t('content_send_unfriend').format(`${this.userProfile.fullname}-${this.puid}`);
            this.dialogConfirm.confirmCallback = this.sendRequestRemoveFriend.bind(this);
        }
        this.dialogConfirm.setContent(content);

    }

    onViewAvatarHD() {
        let { navigation } = this.props;
        if (navigation) {
            navigation.navigate('player_detail_info_view', {
                'userProfile': this.userProfile,
                'isPortrait': true,
                'isMe': this.isMe
            });
        }
    }

    getElementManner() {
        if (this.isMe) {
            return (
                <Touchable onPress={this.onCertificateClick}>
                    <View style={{
                        flexDirection: 'row', marginTop: verticalScale(10), height: verticalScale(50),
                        borderColor: 'rgba(0,0,0,0.25)',
                        borderRadius: 5,
                        borderWidth: 1,
                        marginLeft: scale(10),
                        marginRight: scale(10),
                        alignItems: 'center'
                    }}>

                        <Image
                            style={styles.btn_img}
                            source={this.getResources().ic_certificate}
                        />
                        <Text allowFontScaling={global.isScaleFont} style={styles.btn_text}>{this.t('certificate')}</Text>

                    </View>
                </Touchable >
            );
        } else {
            return (
                <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: verticalScale(10) }}>
                    <Touchable onPress={this.onCompareClick}>
                        <View style={styles.view_btn}>
                            <Image
                                style={styles.btn_img}
                                source={this.getResources().ic_compare_level}
                            />
                            <Text allowFontScaling={global.isScaleFont} style={[styles.btn_text, { flex: 1 }]}>{this.t('compare_performance')}</Text>
                        </View>
                    </Touchable>
                    <Touchable onPress={this.onCertificateClick}>
                        <View style={styles.view_btn}>
                            <Image
                                style={styles.btn_img}
                                source={this.getResources().ic_certificate}
                            />
                            <Text allowFontScaling={global.isScaleFont} style={styles.btn_text}>{this.t('certificate')}</Text>
                        </View>
                    </Touchable>
                </View>
            );
        }
    }

    render() {
        return (
            <View style={[styles.container, this.isIphoneX ? { paddingBottom: 10 } : {}]} >

                <PlayerInfoItem
                    ref={(playerInfoItem) => { this.playerInfoItem = playerInfoItem; }}
                    puid={this.puid}
                    isMe={false}
                />

                <ScrollView
                    ref={(refScrollView) => { this.refScrollView = refScrollView; }}
                    contentContainerStyle={{ flexGrow: 1 }}
                    // style={isSearching ? { position: 'absolute', top: 30, left: 0, right: 0, bottom: 0, backgroundColor: '#fff' } : {}}
                    style={{ marginTop: verticalScale(10) }}
                    scrollEventThrottle={16}>
                    <View style={{ flex: 1 }}>

                        <ComCheckHandicap ref={(refComCheckcap) => { this.refComCheckcap = refComCheckcap; }} isMe={false} />
                        <ComClubJoind ref={(refComClub) => { this.refComClub = refComClub; }} listClubs={[]} />

                        <ComAcceptFriend ref={(refComAcceptFriend) => { this.refComAcceptFriend = refComAcceptFriend; }} />

                        <ComChat ref={(refComChat) => { this.refComChat = refComChat; }} />

                        {/* <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: verticalScale(10) }}>
                            <Touchable onPress={this.onCompareClick}>
                                <View style={styles.view_btn}>
                                    <Image
                                        style={styles.btn_img}
                                        source={this.getResources().ic_compare_level}
                                    />
                                    <Text allowFontScaling={global.isScaleFont} style={[styles.btn_text, { flex: 1 }]}>{this.t('compare_performance')}</Text>
                                </View>
                            </Touchable>
                            <Touchable onPress={this.onCertificateClick}>
                                <View style={styles.view_btn}>
                                    <Image
                                        style={styles.btn_img}
                                        source={this.getResources().ic_certificate}
                                    />
                                    <Text allowFontScaling={global.isScaleFont} style={styles.btn_text}>{this.t('certificate')}</Text>
                                </View>
                            </Touchable>
                        </View> */}
                        {this.getElementManner()}

                        <Touchable onPress={this.onFlightHistoryClick}>
                            <ComButtonHistory isMe={this.isMe} ref={(refComButtonHistory) => { this.refComButtonHistory = refComButtonHistory; }} />
                        </Touchable>
                        <ComAward ref={(refComAward) => { this.refComAward = refComAward; }} data={[]} isShow={(this.friend_status === 1 || this.isMe) ? true : false} />
                        <PersonalAccessories
                            puid={this.puid}
                            isMe={false} />
                    </View>
                </ScrollView>
                <Touchable style={[styles.touchable_back, { zIndex: 3 }]}
                    onPress={this.onBackPress}>
                    <Image style={styles.icon_back}
                        source={this.getResources().ic_back_large}
                    />
                </Touchable>

                <DialogConfirm ref={(dialogConfirm) => { this.dialogConfirm = dialogConfirm; }}
                    cancelText={this.t('cancel')}
                    confirmText={this.t('confirm')} />
                <PopupNotificationFullView
                    ref={(popupNotify) => { this.refPopupNotify = popupNotify; }}
                />

                <PopupCaptcha
                    ref={(popupCaptcha) => { this.popupCaptcha = popupCaptcha; }}
                    puid={this.puid}
                    onConfirmClick={this.onPopupCaptchaConfirm} />
                {this.renderMessageBar()}
                {this.renderCustomLoading(50)}
            </View>
        );
    }

    componentDidMount() {
        // console.log("xem thong tin puid ", this.puid);
        this.backHandler = BackHandler.addEventListener('hardwareBackPress', this.onBackPress.bind(this));
        this.sendRequestGetUserProfile();
        // this.refAccept.acceptCallback = this.onAcceptClick.bind(this);
        // this.refAccept.rejectCallback = this.onRejectClick.bind(this);
        if (this.refComAcceptFriend) {
            this.refComAcceptFriend.onAcceptCallback = this.onAcceptClick.bind(this);
            this.refComAcceptFriend.onDenyCallback = this.onRejectClick.bind(this);
        }
        if (this.refComChat) {
            this.refComChat.onChatCallback = this.onChatClick.bind(this);
            this.refComChat.onFriendIconCallback = this.showPopupAddFriend.bind(this);
        }

        if (this.playerInfoItem) {
            this.playerInfoItem.onViewDetailAvatarCallback = this.onViewAvatarHD.bind(this);
        }

        this.registerMessageBar();
    }

    componentWillUnmount() {
        if (this.backHandler) {
            this.backHandler.remove();
        }
        this.unregisterMessageBar();
    }

    showMesange(msg) {
        this.showErrorMsg(msg);
    }

    // onFriendStatus(status, userName, userProfile) {
    //     console.log('onFriendStatus', userName)
    //     this.friend_status = status;
    //     this.userProfile = userProfile;
    //     // this.setState({
    //     //     isShowInvite: status === 2 ? true : false,
    //     //     userName: userName
    //     //     // header_expanded_height: 400
    //     // })
    // }


    onFlightHistoryClick() {
        if (this.isMe) {
            this.showFlightHistory();
            return
        }
        if (this.friend_status === 1) {
            this.popupCaptcha.show();
        }
        //  else {
        //     this.setState({
        //         isHideHistoryBtn: true,
        //         isCanViewHistory: false
        //     });
        // }
    }

    onPopupCaptchaConfirm() {
        // this.setState({
        //     // isHideHistoryBtn: true,
        //     isCanViewHistory: true
        // }, () => {
        this.showFlightHistory();
        // });

    }

    showFlightHistory() {
        let { navigation } = this.props;
        if (!navigation) return;
        if (this.isMe) {
            navigation.navigate('flight_history_navigator_view', { puid: this.puid });
        } else {
            navigation.navigate('flight_history', { puid: this.puid });
        }
        // if (this.props.navigation) {
        //     this.props.navigation.navigate('flight_history',
        //         {
        //             puid: this.puid
        //         });
        // }
    }

    onBackPress() {
        let { navigation } = this.props;
        if (navigation) {
            //console.log("refresh_notify ",navigation);
            let { refresh_notify, refreshFriend } = navigation.state.params;
            //đi từ màn hình bạn bè
            if (refreshFriend) {
                refreshFriend();
            }
            //refesh di tu man hinh notify
            if (refresh_notify) {
                refresh_notify();
            }
            navigation.goBack();
        }
        return true;
    }

    // onFocusSearch() {
    //     console.log('onFocusSearch')
    //     this.setState({
    //         isSearching: true,
    //     }, () => {
    //         // let yValue = this.state.isShowInvite ? this.state.header_expanded_height : this.state.header_expanded_height - 80;
    //         this.refScrollView.scrollTo({ x: 0, y: 0, animated: true });
    //         console.log('courseSearchFocus')
    //         setTimeout(() => {
    //             this.courseSearchFocus('');
    //         }, 300);
    //     });
    // }

    // courseSearchFocus(input) {

    //     let url = this.getConfig().getBaseUrl() + ApiService.search_course(input);
    //     console.log('url', url);
    //     Networking.httpRequestGet(url, this.onCourseSearchResponse.bind(this));

    // }

    // onChangeTeeAll() {
    //     // this.isCheckHandicapAll = true;
    //     // this.refPopupSelectTeeView.setVisible(this.teeListAvailable);
    // }

    // onTeeSelected(teeObject, extrasData) {
    //     this.teeSelected = teeObject;
    //     this.courseSearchBar.setTeeSelected(teeObject);
    //     this.requestCheckHandicap(teeObject.tee, this.facilityCourseModel);
    // }

    // onCourseSearchResponse(jsonData) {
    //     this.model = new FacilityCourseModel(this);
    //     this.model.parseData(jsonData);
    //     if (this.model.getErrorCode() === 0) {
    //         courseList = [];
    //         this.setState({
    //             dataSource: this.state.dataSource.cloneWithRows(courseList),
    //         });
    //         courseList = this.model.getListFacilityCourse();
    //         if (this.model.getListFacilityCourse().length > 0) {
    //             this.setState({
    //                 dataSource: this.state.dataSource.cloneWithRows(courseList),
    //             });
    //         } else {
    //             this.setState({
    //                 dataSource: this.state.dataSource.cloneWithRows([])
    //             });
    //         }
    //     }
    // }

    // onCourseItemClick(facilityCourseModel, itemId) {
    //     this.setState({
    //         isSearching: false,
    //         courseList: [],
    //         // isHideHandicap: false,
    //     }, () => {
    //         this.teeListAvailable = facilityCourseModel.getTeeList();
    //         this.teeSelected = this.teeListAvailable.find((teeObject) => {
    //             console.log('teeObject.tee', teeObject.tee, this.userProfile.getDefaultTeeID())
    //             return teeObject.tee === this.userProfile.getDefaultTeeID();
    //         })
    //         this.teeSelected = this.teeSelected ? this.teeSelected : this.teeListAvailable.length > 0 ? this.teeListAvailable[0] : {};
    //         this.courseSearchBar.setTeeSelected(this.teeSelected);

    //         this.facilityCourseModel = Object.assign({}, facilityCourseModel);
    //         if (this.courseSearchBar) {
    //             this.courseSearchBar.onBlur();//tat ban phim search course
    //         }
    //         this.requestCheckHandicap('', this.facilityCourseModel);
    //     });
    // }

    // requestCheckHandicap(teeName, facilityCourseModel) {
    //     let formData = {
    //         "user_ids": [this.puid ? this.getAppUtil().replaceUser(this.puid) : this.getUserInfo().getUserProfile().getId()],
    //         "tee": teeName,
    //         "course": facilityCourseModel.course_object
    //     }
    //     console.log('formData--------------------------- ', formData);
    //     let url = this.getConfig().getBaseUrl() + ApiService.check_handicap_facility();
    //     console.log('url', url);
    //     // this.showLoading();
    //     let self = this;
    //     Networking.httpRequestPost(url, (jsonData) => {
    //         // console.log('jsonData check cap .......................................... ', jsonData);
    //         if (jsonData.hasOwnProperty('error_code')) {
    //             let error_code = parseInt(jsonData['error_code']);
    //             if (error_code === 0) {
    //                 let data = jsonData['data'];
    //                 if (data['courses_handicap'].length > 0) {
    //                     let handicap = data['courses_handicap'][0];
    //                     // self.updateHandicapData(handicap, friendModel, index, isMe);
    //                     self.viewCheckHandicap.setDataCourse(this.teeSelected.color, self.text_check_handicap + ' ' + facilityCourseModel.title + ':', handicap.display_course.value);
    //                 }
    //             }
    //         }
    //         // self.hideLoading();
    //     }, formData, () => {
    //         // self.hideLoading();
    //     });
    // }

    /**
     * Gửi yêu cầu kết bạn
     */
    sendRequestAddFriend() {
        let self = this;
        this.showCustomLoading();
        let url = this.getConfig().getBaseUrl() + ApiService.friend_add(this.puid);
        Networking.httpRequestGet(url, (jsonData) => {
            if (jsonData.hasOwnProperty('error_code')) {
                let error_code = parseInt(jsonData['error_code']);
                if (error_code === 0) {
                    self.showSuccessMsg(jsonData['error_msg']);
                    self.friend_status = 0;
                    self.refComChat.updateData(self.friend_status, self.isMe);
                    // self.playerInfoItem.setChangeState(this.friend_status);
                    // self.refAccept.hide(self.friend_status);
                } else {
                    self.showErrorMsg(jsonData['error_msg']);
                }
            }
            self.hideCustomLoading();
        }, () => {
            //time out
            self.hideCustomLoading();
        });
    }

    /**
     * ic_unfriend
     * huy yeu cau ket ban
     */
    sendRequestRemoveFriend() {
        let self = this;
        this.showCustomLoading();
        let url = this.getConfig().getBaseUrl() + ApiService.friend_remove(this.puid);
        Networking.httpRequestGet(url, (jsonData) => {
            console.log("remove friend : ", jsonData);
            if (jsonData.hasOwnProperty('error_code')) {
                let error_code = parseInt(jsonData['error_code']);
                if (error_code === 0) {
                    self.showSuccessMsg(jsonData['error_msg']);
                    self.friend_status = -1;
                    self.refComChat.updateData(self.friend_status, self.isMe);
                    // self.playerInfoItem.setChangeState(this.friend_status);
                    // self.refAccept.hide(self.friend_status);
                } else {
                    self.showErrorMsg(jsonData['error_msg']);
                }
            }
            self.hideCustomLoading();
        }, () => {
            //time out
            self.hideCustomLoading();
        });
    }

    /**
     * Đồng ý lời mời kết bạn
     */
    onAcceptInviteFriendClick() {
        let url = this.getConfig().getBaseUrl() + ApiService.friend_accept(this.puid);
        this.showCustomLoading();
        let self = this;
        Networking.httpRequestGet(url, (jsonData) => {
            if (jsonData.hasOwnProperty('error_code')) {
                let error_code = parseInt(jsonData['error_code']);
                if (error_code === 0) {
                    self.showSuccessMsg(jsonData['error_msg']);
                    self.friend_status = 1;
                    self.refComChat.updateData(self.friend_status, self.isMe);
                    // self.playerInfoItem.setChangeState(this.friend_status);
                    // self.refAccept.hide(self.friend_status);
                    // self.setState({
                    //     isShowInvite: false
                    // })
                } else {
                    self.showErrorMsg(jsonData['error_msg']);
                }
            }
            self.hideCustomLoading();
        }, () => {
            //time out
            self.hideCustomLoading();
        });
    }

    onRejectInviteFriendClick() {
        let url = this.getConfig().getBaseUrl() + ApiService.friend_denied(this.puid);
        this.showCustomLoading();
        let self = this;
        Networking.httpRequestGet(url, (jsonData) => {
            console.log('onRejectInviteFriendClick', jsonData)
            if (jsonData.hasOwnProperty('error_code')) {
                let error_code = parseInt(jsonData['error_code']);
                if (error_code === 0) {
                    self.showSuccessMsg(jsonData['error_msg']);
                    self.friend_status = -1;
                    // self.playerInfoItem.setChangeState(this.friend_status);
                    // self.refAccept.hide(self.friend_status);
                    self.refComChat.updateData(self.friend_status, self.isMe);
                    // self.setState({
                    //     isShowInvite: false
                    // })
                } else {
                    self.showErrorMsg(jsonData['error_msg']);
                }
            }
            self.hideCustomLoading();
        }, () => {
            //time out
            self.hideCustomLoading();
        });
    }
}
