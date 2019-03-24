import React from 'react';
import { View } from 'react-native';
import BaseComponent from '../../../Core/View/BaseComponent';
import ClubInfoListModel from '../../../Model/CLB/ClubInfoListModel';
import styles from '../../../Styles/Friends/Screens/StyleFriendScreen';
import ApiService from '../../../Networking/ApiService';
import Networking from '../../../Networking/Networking';
import Touchable from 'react-native-platform-touchable';
import CLBCheckPermissionModel from '../../../Model/CLB/CLBCheckPermissionModel';
import EmptyDataView from '../../../Core/Common/EmptyDataView';
import LoadingView from '../../../Core/Common/LoadingView';
import ListViewClub from '../Items/ListViewClub';
import InviteJoinClubList from '../Items/InviteJoinClubList';
import PopupConfirm from '../../Common/PopupConfirm';

import I18n from 'react-native-i18n';
require('../../../../I18n/I18n');

export default class CLBScreen extends BaseComponent {

    constructor(props) {
        super(props);
        this.page = 1;
        this.clbId = '';
        this.clbName = '';
        this.logoUrl = '';
        this.listDataCLB = [];
        this.inviteList = [];
        this.invitePermissionList = [];
        this.isSearching = false;

        //this.requestGetClubList();
        this.onAcceptJoinClub = this.onAcceptJoinClub.bind(this);
        this.onDenyJoinClub = this.onDenyJoinClub.bind(this);
        this.onConfirmCallback = this.onConfirmCallback.bind(this);
        this.onAcceptPermissionClub = this.onAcceptPermissionClub.bind(this);
        this.onDenyPermissionClub = this.onDenyPermissionClub.bind(this);
        this.state = {
            scrollY: this.props.screenProps.animatedScrollY
        };
    }

    static navigationOptions = () => ({
        title: I18n.t("clb_title"),
        tabBarLabel: I18n.t("clb_title"),
    });

    onSearchResponse(jsonData) {
        console.log("du lieu tim kiem club : ", jsonData);
        this.listViewClub.hideLoading();
        if (!this.isSearching) return;
        var listClubSearch = [];
        this.model = new CLBModel(this);
        this.model.parseData(jsonData);
        if (this.model.getErrorCode() === 0) {
            for (let objData of this.model.getListCLB()) {
                let obj = {
                    clbId: objData.getId(),
                    name: objData.getName(),
                    logoUrl: objData.getLogo(),
                    totalMember: objData.getTotalMember(),
                }
                listClubSearch.push(obj);
            }
            // this.setState({
            //     dataSource: this.state.dataSource.cloneWithRows(listClubSearch),
            // });
            if (listClubSearch.length) {
                this.emptyDataView.hideEmptyView();
            } else {
                this.emptyDataView.showEmptyView();
            }
            this.listViewClub.setFillData(listClubSearch, true);
        }
    }

    onCancelSearch() {
        this.isSearching = false;
        if (this.listDataCLB.length) {
            if (this.emptyDataView)
                this.emptyDataView.hideEmptyView();
        } else {
            if (this.emptyDataView)
                this.emptyDataView.showEmptyView();
        }
        if (this.listViewClub)
            this.listViewClub.setFillData(this.listDataCLB);
        // this.setState({
        //     dataSource: this.state.dataSource.cloneWithRows(listDataCLB),
        // });
    }

    /**
     * ham nay duoc goi sau khi render
     */
    componentDidMount() {
        let { screenProps } = this.props;
        this.parent = screenProps.parent;
        //this.parent.setType(Constant.FRIEND.TYPE.CLUB);
        this.parent.callbackResponse = this.onSearchResponse.bind(this);
        this.parent.clubResponeCallback = this.onSearchResponse.bind(this);
        this.parent.callbackCancelSearch = this.onCancelSearch.bind(this);
        this.parent.clubCancelCallback = this.onCancelSearch.bind(this);
        this.parent.callbackClubStartSearch = this.onStartSearch.bind(this);
        /////
        this.listViewClub.loadMoreCallback = this.onLoadMore.bind(this);
        // this.listViewClub.refreshCallback = this._onRefresh.bind(this);
        this.listViewClub.itemClickCallback = this.onCLBClick.bind(this);
        this.requestGetClubList();
    }

    onStartSearch() {
        this.isSearching = true;
        this.listViewClub.setFillData([], true);
        this.listViewClub.showLoading();
    }

    showCustomLoading() {
        if (this.customLoading) {
            this.customLoading.showLoading();
        }
    }

    hideCustomLoading() {
        if (this.customLoading) {
            this.customLoading.hideLoading();
        }
    }

    requestGetClubList() {
        //this.customLoading.showLoading();
        this.showCustomLoading();
        let url = this.getConfig().getBaseUrl() + ApiService.club_list_join(this.page);
        let self = this;
        console.log("url : ", url);
        Networking.httpRequestGet(url, this.onResponseData.bind(this), () => {
            //time out
            self.hideCustomLoading();
        });
    }

    onResponseData(jsonData) {
        this.hideCustomLoading();
        this.model = new ClubInfoListModel(this);
        this.model.parseData(jsonData);
        if (this.model.getErrorCode() === 0) {
            this.listDataCLB = this.model.getClubList();
            this.inviteList = this.model.getInviteClubList();
            this.invitePermissionList = this.model.getInvitePermissionClubList();
            if (this.listDataCLB.length || this.inviteList.length > 0) {
                this.emptyDataView.hideEmptyView();
                this.listViewClub.setFillData(this.listDataCLB);
                if (this.inviteList.length > 0 || this.invitePermissionList.length) {
                    this.refInviteJoinClubList.setInviteClubList(this.inviteList, this.invitePermissionList);
                }
            } else {
                this.emptyDataView.showEmptyView();
            }
        } else if (this.listDataCLB.length === 0) {
            this.emptyDataView.showEmptyView();
        }
        //this.customLoading.hideLoading();
    }

    onCLBClick(data) {
        let club = data.getClub() ? data.getClub() : {};
        this.clbId = club.getId();
        this.clbName = club.getName();
        this.logoUrl = club.getLogo();
        let totalMember = club.getTotalMember();
        let { screenProps } = this.props;
        if (screenProps && screenProps.parentNavigator) {
            // screenProps.parentNavigator.navigate('check_handicap_club_view',
            //     {
            //         clubId: this.clbId,
            //         refresh: this.onRefresh.bind(this),
            //         clubName: this.clbName,
            //         logoUrl: this.logoUrl,
            //         isAdmin: data.getIsUserAdmin(),
            //         isAccepted: data.getIsAccepted() === 1,
            //         isMember: data.getIsAccepted() === 1,
            //         invitation_id: data.getId(),
            //         totalMember: totalMember,
            //         callback: this.onClubDetailCallback.bind(this)
            //     });
            screenProps.parentNavigator.navigate('introduce_club_view',
                {
                    clubId: this.clbId,
                    refresh: this.onRefresh.bind(this),
                    clubName: this.clbName,
                    logoUrl: this.logoUrl,
                    isAdmin: data.getIsUserAdmin(),
                    isGeneralSecretary: data.getIsGeneralSecretary(),
                    isModerator: data.getIsModerator(),
                    isAccepted: data.getIsAccepted() === 1,
                    isMember: data.getIsAccepted() === 1,
                    invitation_id: data.getId(),
                    totalMember: totalMember,
                    callback: this.onClubDetailCallback.bind(this),
                    refreshCallback: this.onRefreshCallback.bind(this)
                });

        }
    }

    onClubDetailCallback(clubId) {
        if (this.listDataCLB && clubId) {
            let index = this.listDataCLB.findIndex((club) => {
                return clubId === club.clbId;
            });
            if (index != -1) {
                this.listDataCLB.splice(index, 1);
                this.listViewClub.setFillData(this.listDataCLB);
            }
        }

    }

    onRefreshCallback(clubId, logoUri) {
        if (this.listDataCLB && clubId) {
            let index = this.listDataCLB.findIndex((club) => {
                return clubId === club.clbId;
            });
            if (index != -1 && this.listDataCLB.length > index) {
                this.listDataCLB[index].club.logo = logoUri;
                this.listViewClub.setFillData(this.listDataCLB);
            }
        }
    }

    onRefresh() {
        this.listDataCLB = [];
        this.page = 1;
        this.listViewClub.setFillData(this.listDataCLB);
        this.requestGetClubList();
    }

    onLoadMore() {
        if (!this.customLoading) return;
        this.page++;
        this.requestGetClubList();
    }

    render() {
        return (
            <View style={styles.container}>
                <InviteJoinClubList ref={(refInviteJoinClubList) => { this.refInviteJoinClubList = refInviteJoinClubList; }}
                    onAcceptJoinClub={this.onAcceptJoinClub}
                    onDenyJoinClub={this.onDenyJoinClub}
                    onAcceptPermissionClub={this.onAcceptPermissionClub}
                    onDenyPermissionClub={this.onDenyPermissionClub} />
                <View style={styles.separator_listview} />
                <ListViewClub ref={(listViewClub) => { this.listViewClub = listViewClub; }}
                    scrollY={this.state.scrollY} />
                <EmptyDataView ref={(emptyDataView) => { this.emptyDataView = emptyDataView; }} />
                <LoadingView ref={(customLoading) => { this.customLoading = customLoading; }}
                    isShowOverlay={false} />
                <PopupConfirm
                    ref={(refPopupYesOrNo) => { this.refPopupYesOrNo = refPopupYesOrNo; }}
                    confirmText={this.t('agree')}
                    cancelText={this.t('cancel')}
                    onConfirmClick={this.onConfirmCallback} />
            </View>
        );
    }

    onConfirmCallback({ clubItem, index, type, permissionType }) {
        if (type === 0) {
            this.requestOutClub(clubItem, index);
        } else if (type === 1) {
            this.requestParticipateClub(clubItem, index);
        } else if (type === 2) {
            this.requestAcceptPermissionClub(clubItem, index, permissionType);
        } else if (type === 3) {
            this.requestRefusePermissionClub(clubItem, index);
        }
    }

    onAcceptJoinClub(clubItem, index) {
        let type = 1;
        this.refPopupYesOrNo.setContentAndShow(this.t('join_club_confirm'), { clubItem, index, type });
    }

    onDenyJoinClub(clubItem, index) {
        let type = 0;
        this.refPopupYesOrNo.setContentAndShow(this.t('out_of_club_confirm'), { clubItem, index, type });
    }

    onAcceptPermissionClub(clubItem, index, permissionType) {
        let type = 2;
        console.log('onAcceptPermissionClub', clubItem.club.name, clubItem)
        this.refPopupYesOrNo.setContentAndShow(permissionType === 1 ? this.t('invited_secretary_general_confirm').format(clubItem.club.name) : this.t('invited_moderator_club_confirm').format(clubItem.club.name), { clubItem, index, type, permissionType });
    }

    onDenyPermissionClub(clubItem, index, permissionType) {
        let type = 3;
        this.refPopupYesOrNo.setContentAndShow(permissionType === 1 ? this.t('invited_secretary_general_reject').format(clubItem.club.name) : this.t('invited_moderator_club_reject').format(clubItem.club.name), { clubItem, index, type, permissionType });
    }

    requestParticipateClub(clubItem, index) {
        let url = this.getConfig().getBaseUrl() + ApiService.club_accept_invitation(clubItem.id);
        let self = this;
        this.showCustomLoading();
        Networking.httpRequestGet(url, (jsonData) => {
            console.log('requestParticipateClub', jsonData)
            self.hideCustomLoading();
            if (jsonData.hasOwnProperty('error_code')) {
                let error_code = parseInt(jsonData['error_code']);
                if (error_code === 0) {
                    this.listDataCLB.push(clubItem);
                    this.listViewClub.setFillData(this.listDataCLB);
                    this.inviteList.splice(index, 1);
                    this.refInviteJoinClubList.setInviteClubList(this.inviteList, this.invitePermissionList);
                } else {
                    self.showErrorMsg(jsonData['error_msg']);
                }
            }
        }, () => {
            //time out
            self.hideCustomLoading();
            // self.popupTimeOut.showPopup();
        })
    }

    requestOutClub(clubItem, index) {
        let self = this;
        let url = this.getConfig().getBaseUrl() + ApiService.club_deni_invite(clubItem.id);
        this.showCustomLoading();
        Networking.httpRequestGet(url, (jsonData) => {
            console.log('requestOutClub', jsonData)
            self.hideCustomLoading();
            if (jsonData.hasOwnProperty('error_code')) {
                let error_code = parseInt(jsonData['error_code']);
                if (error_code === 0) {
                    this.inviteList.splice(index, 1);
                    this.refInviteJoinClubList.setInviteClubList(this.inviteList, this.invitePermissionList);
                } else {
                    self.showErrorMsg(jsonData['error_msg']);
                }
            }
        }, () => {
            //time out
            self.hideCustomLoading();
            // self.popupTimeOut.showPopup();
        });
    }

    requestAcceptPermissionClub(clubItem, index, permissionType) {
        let url = this.getConfig().getBaseUrl() + ApiService.club_accept_upgrade_permission(clubItem.club_id, permissionType);
        console.log('url', url)
        let self = this;
        this.showCustomLoading();
        Networking.httpRequestGet(url, (jsonData) => {
            console.log('requestParticipateClub', jsonData)
            self.hideCustomLoading();
            if (jsonData.hasOwnProperty('error_code')) {
                let error_code = parseInt(jsonData['error_code']);
                if (error_code === 0) {
                    let club = this.listDataCLB.find((item) => {
                        return item.club_id === clubItem.club_id;
                    })
                    if (club) {
                        if (permissionType === 1) {
                            club.is_moderator = 0;
                            club.is_general_secretary = 1;
                        } else if (permissionType === 2) {
                            club.is_moderator = 1;
                            club.is_general_secretary = 0;
                        }
                    }
                    this.listViewClub.setFillData(this.listDataCLB);
                    this.invitePermissionList.splice(index, 1);
                    this.refInviteJoinClubList.setInviteClubList(this.inviteList, this.invitePermissionList);
                } else {
                    self.showErrorMsg(jsonData['error_msg']);
                }
            }
        }, () => {
            //time out
            self.hideCustomLoading();
            // self.popupTimeOut.showPopup();
        })
    }

    requestRefusePermissionClub(clubItem, index) {
        let url = this.getConfig().getBaseUrl() + ApiService.club_reject_upgrade_permission(clubItem.club_id);
        let self = this;
        this.showCustomLoading();
        Networking.httpRequestGet(url, (jsonData) => {
            console.log('requestParticipateClub', jsonData)
            self.hideCustomLoading();
            if (jsonData.hasOwnProperty('error_code')) {
                let error_code = parseInt(jsonData['error_code']);
                if (error_code === 0) {
                    this.listDataCLB.push(clubItem);
                    this.listViewClub.setFillData(this.listDataCLB);
                    this.invitePermissionList.splice(index, 1);
                    this.refInviteJoinClubList.setInviteClubList(this.inviteList, this.invitePermissionList);
                } else {
                    self.showErrorMsg(jsonData['error_msg']);
                }
            }
        }, () => {
            //time out
            self.hideCustomLoading();
            // self.popupTimeOut.showPopup();
        })
    }
}
