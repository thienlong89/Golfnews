import React from 'react';
import { Text, View, Image } from 'react-native';
import BaseComponent from '../../../Core/View/BaseComponent';
import GroupModel from '../../../Model/Group/GroupModel';
import styles from '../../../Styles/Friends/Screens/StyleGroupScreen';
import Networking from '../../../Networking/Networking';
import Touchable from 'react-native-platform-touchable';
import ApiService from '../../../Networking/ApiService';
import PopupCreate from '../../Popups/PopupGroupCreate';
import EmptyDataView from '../../../Core/Common/EmptyDataView';
import LoadingView from '../../../Core/Common/LoadingView';
import ListViewGroup from '../Items/ListViewGroup';
import FloatBtnActionView from '../../Common/FloatBtnActionView';
import PopupRemoteGroup from '../../Groups/Items/PopupRemoteGroup';
import PopupConfirmView from '../../Popups/PopupConfirmView';

import I18n from 'react-native-i18n';
require('../../../../I18n/I18n');

export default class GroupScreen extends BaseComponent {
    constructor(props) {
        super(props);

        this.uid = this.getUserInfo().getId();
        this.flatListOffset = 0;
        this.isShowBtn = true;
        this.page = 1;
        this.parent = null;
        this.isSearch = false;
        this.listGroupItem = [];
        this.state = {
            isCreate: false,
            nameGroup: '',
        };

        this.onCreateNewGroupClick = this.onCreateNewGroupClick.bind(this);
        this.createGroupCallback = this.createGroupCallback.bind(this);
        this.scrollCallback = this.scrollCallback.bind(this);
        this.onItemLongPress = this.onItemLongPress.bind(this);
        this.onLeaveGroupPress = this.onLeaveGroupPress.bind(this);
        this.onRemoveGroupPress = this.onRemoveGroupPress.bind(this);
        this.onViewGroupInfoPress = this.onViewGroupInfoPress.bind(this);
        this.onCreateGroupChat = this.onCreateGroupChat.bind(this);
    }

    static navigationOptions = () => ({
        title: I18n.t("group"),               // it stay in french whatever choosen langage
        tabBarLabel: I18n.t("group"),
    });

    onSearchResponse(jsonData) {
        //this.isSearch = true;
        this.listViewGroup.hideLoading();
        // console.log("isSearch : ", this.isSearch);
        if (!this.isSearch) return;
        let listGroupSearch = [];
        this.model = new GroupModel(this);
        this.model.parseData(jsonData);
        // console.log("jsonData search group", jsonData);
        if (this.model.getErrorCode() === 0) {
            // for (let objData of this.model.getListGroup()) {
            //     let _obj = {
            //         'user_host': objData.getHost(),
            //         'groupId': objData.getId(),
            //         "groupName": objData.getName(),
            //         "logoUrl": objData.getLogo(),
            //         "totalMember": objData.getTotalMember(),
            //         "created_at": objData.getCreateAt()
            //     }
            //     listGroupSearch.push(_obj);
            // }
            listGroupSearch = this.model.getListGroup();
            if (listGroupSearch.length) {
                //this.emptyDataView.hideEmptyView();
                this.emptyDataHide();
            } else {
                //this.emptyDataView.showEmptyView();
                this.emptyDataShow();
            }
            this.listViewGroup.setFillData(listGroupSearch, true);
            // this.setState({
            //     dataSource: this.state.dataSource.cloneWithRows(listGroupSearch),
            // });
        }
    }

    onCancelSearch() {
        this.isSearch = false;
        // this.setState({
        //     dataSource: dataSource.cloneWithRows(listGroupItem),
        // });
        // console.log("cancel search group ", this.isSearch);
        if (this.listGroupItem.length) {
            // this.emptyDataView.hideEmptyView();
            this.emptyDataHide();
        } else {
            //this.emptyDataView.showEmptyView();
            this.emptyDataShow();
        }
        this.listViewGroup.setFillData(this.listGroupItem);
    }

    componentDidMount() {
        this.registerMessageBar();
        let { screenProps } = this.props;
        this.parent = screenProps.parent;
        this.parent.callbackResponse = this.onSearchResponse.bind(this);
        this.parent.groupResponeCallback = this.onSearchResponse.bind(this);
        this.page.callbackCancelSearch = this.onCancelSearch.bind(this);
        this.parent.groupCancelCallback = this.onCancelSearch.bind(this);
        this.parent.callbackStartSearch = this.onStartSearch.bind(this);
        this.parent.callbackGroupStartSearch = this.onStartSearch.bind(this);
        //this.parent.setType(Constant.FRIEND.TYPE.GROUP);

        // this.popupCreate.navigation = screenProps.navigation;
        // this.popupCreate.refresh = this.refresh.bind(this);
        /////////////////
        this.listViewGroup.loadMoreCallback = this.onLoadMore.bind(this);
        this.listViewGroup.refreshCallback = this.refresh.bind(this);
        this.listViewGroup.itemClickCallback = this.onItemClick.bind(this);
        // this.listViewGroup.itemClickCallback = this.onItemClick.bind(this);

        this.requestGetGroupList();
        this.refFloatActionView.setVisible(true);
    }

    componentWillUnmount() {
        this.unregisterMessageBar();
    }

    onStartSearch() {
        this.isSearch = true;
        this.listViewGroup.setFillData([], true);
        this.listViewGroup.showLoading();
    }

    /**
     * request lay danh sach group
     */
    requestGetGroupList() {
        //this.customLoading.showLoading();
        this.showCustomLoading();
        let self = this;
        let url = this.getConfig().getBaseUrl() + ApiService.group_list(this.page);
        console.log('url group', url);
        Networking.httpRequestGet(url, this.onResponeData.bind(this), () => {
            //time out
            //this.customLoading.hideLoading();
            self.hideCustomLoading();
            // self.popupTimeOut.showPopup();
            self.showErrorMsg(self.t('time_out'))
        });
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

    onResponeData(jsonData) {
        //this.customLoading.hideLoading();
        this.hideCustomLoading();
        this.model = new GroupModel(this);
        this.model.parseData(jsonData);
        //console.log("jsonData ", jsonData);
        if (this.model.getErrorCode() === 0) {
            // for (let objData of this.model.getListGroup()) {
            //     let _obj = {
            //         'user_host': objData.getHost(),
            //         'groupId': objData.getId(),
            //         "groupName": objData.getName(),
            //         "logoUrl": objData.getLogo(),
            //         "totalMember": objData.getTotalMember(),
            //         "created_at": objData.getCreateAt()
            //     }
            //     //console.log("obj ",_obj);
            //     this.listGroupItem.push(_obj);
            // }
            let listGroup = this.model.getListGroup();
            if (listGroup.length > 0) {
                this.listGroupItem = [...this.listGroupItem, ...listGroup];
                // this.emptyDataView.hideEmptyView();
                this.emptyDataHide();
                this.listViewGroup.setFillData(this.listGroupItem);
                // this.setState({
                //     dataSource: this.state.dataSource.cloneWithRows(listGroupItem),
                // });
            } else if (this.page === 1) {
                // this.emptyDataView.showEmptyView();
                this.emptyDataShow();
            }
        } else {
            this.showErrorMsg(this.model.getErrorMsg());
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

    onItemClick(data) {
        const { screenProps } = this.props;
        if (screenProps) {
            let dataGroup = {
                host: data.is_user_admin === 1,
                groupId: data.id,
                logoUrl: data.logo,
                groupName: data.name
            }
            screenProps.parentNavigator.navigate('group_detail', { data: dataGroup, refresh: this.refresh.bind(this) });
        }

    }

    refresh() {
        console.log("refesh data on goback");
        this.page = 1;
        this.listGroupItem = [];
        // this.listViewGroup.setFillData(this.listGroupItem);
        this.requestGetGroupList();
    }

    onLoadMore() {
        if (!this.customLoading) return;
        if (!this.isSearch) {
            this.page++;
            this.requestGetGroupList();
        }
    }

    render() {
        return (
            <View style={styles.container}>
                {/* {this.renderLoading()} */}
                
                <PopupConfirmView ref={(popupConfirmView) => { this.popupConfirmView = popupConfirmView; }} />

                <View style={styles.container_body}>
                    <ListViewGroup
                        ref={(listViewGroup) => { this.listViewGroup = listViewGroup; }}
                        scrollY={this.scrollCallback}
                        onItemLongPress={this.onItemLongPress} />
                    <EmptyDataView ref={(emptyDataView) => { this.emptyDataView = emptyDataView; }} />
                    <LoadingView ref={(customLoading) => { this.customLoading = customLoading; }}
                        isShowOverlay={false} />
                </View>

                <FloatBtnActionView
                    ref={(refFloatActionView) => { this.refFloatActionView = refFloatActionView; }}
                    icon={this.getResources().ic_add_group}
                    onFloatActionPress={this.onCreateNewGroupClick} />

                <PopupRemoteGroup
                    ref={(refPopupRemoteGroup) => { this.refPopupRemoteGroup = refPopupRemoteGroup }}
                    onLeaveGroupPress={this.onLeaveGroupPress}
                    onRemoveGroupPress={this.onRemoveGroupPress}
                    onViewGroupInfoPress={this.onViewGroupInfoPress}
                    onCreateGroupChat={this.onCreateGroupChat}
                />
                {this.renderMessageBar()}

            </View>
        );
    }

    scrollCallback(event) {
        const currentOffset = event.nativeEvent.contentOffset.y;
        const direction = (currentOffset > 0 && currentOffset > this.flatListOffset)
            ? 'down'
            : 'up'
        // If the user is scrolling down (and the action-button is still visible) hide it
        const isActionButtonVisible = direction === 'up'
        if (isActionButtonVisible !== this.isShowBtn) {
            this.isShowBtn = isActionButtonVisible;
            if (this.refFloatActionView) {
                this.refFloatActionView.setVisible(this.isShowBtn);
            }
        }
        // Update your scroll position
        console.log('scrollCallback', direction)
        this.flatListOffset = currentOffset
    }

    /**
     * click button tao group moi
     */
    onCreateNewGroupClick() {
        // this.popupCreate.show();
        const { screenProps } = this.props;
        try {
            screenProps.parentNavigator.navigate('group_create_view', { refresh: this.refresh.bind(this) });
        } catch (error) {
            console.log('createGroupCallback.error', error)
        }
    }

    createGroupCallback(groupId) {
        const { screenProps } = this.props;
        try {
            screenProps.parentNavigator.navigate('group_add_member_view', { groupId: groupId, new_group: true, refresh: this.refresh.bind(this) });
        } catch (error) {
            console.log('createGroupCallback.error', error)
        }

    }

    onItemLongPress(data, index) {
        console.log('onItemLongPress', data, index);
        let isAdmin = data.is_user_admin === 1;
        this.refPopupRemoteGroup.show(isAdmin, { data, index });
    }

    onLeaveGroupPress({ data, index }) {
        console.log('onLeaveGroupPress', data, index);
        this.popupConfirmView.okCallback = this.requestLeaveGroup.bind(this, data, index);
        this.popupConfirmView.setMsg(this.t('out_group_msg').format(data.name));
    }

    onRemoveGroupPress({ data, index }) {
        console.log('onRemoveGroupPress', data, index);
        this.popupConfirmView.okCallback = this.requestRemoveGroup.bind(this, data, index);
        this.popupConfirmView.setMsg(this.t('delete_group_msg').format(data.name));
    }

    onViewGroupInfoPress({ data, index }) {
        console.log('onViewGroupInfoPress', data, index);
        const { screenProps } = this.props;
        if (screenProps) {
            let dataGroup = {
                host: data.is_user_admin === 1,
                groupId: data.id,
                logoUrl: data.logo,
                groupName: data.name
            }
            screenProps.parentNavigator.navigate('group_info_view', {
                data: dataGroup,
                refreshCallBack: this.onRefreshCallBack.bind(this)
            })
        }

    }

    onCreateGroupChat(){
        
    }

    requestLeaveGroup(data, index) {
        let url = this.getConfig().getBaseUrl() + ApiService.group_leave(data.id);
        let self = this;
        this.showCustomLoading();
        console.log("url ==== ", url);
        Networking.httpRequestGet(url, (jsonData) => {
            self.hideCustomLoading();
            console.log("jsonData === : ", jsonData);
            if (jsonData.hasOwnProperty('error_code')) {
                let error_code = jsonData['error_code'];
                if (error_code === 0) {
                    this.listGroupItem.splice(index, 1);
                    this.listViewGroup.setFillData(this.listGroupItem);
                }
            } else {
                self.setState({
                    isLoading: false
                });
                self.showErrorMsg(jsonData.error_msg);
            }
        }, () => {
            self.hideCustomLoading();
            self.showErrorMsg(self.t('time_out'));
        });
    }

    requestRemoveGroup(data, index) {
        let url = this.getConfig().getBaseUrl() + ApiService.group_delete(data.id);
        let self = this;
        this.showCustomLoading();
        console.log("url ==== ", url);
        Networking.httpRequestGet(url, (jsonData) => {
            self.hideCustomLoading();
            console.log("jsonData === : ", jsonData);
            if (jsonData.hasOwnProperty('error_code')) {
                let error_code = jsonData['error_code'];
                if (error_code === 0) {
                    this.listGroupItem.splice(index, 1);
                    this.listViewGroup.setFillData(this.listGroupItem);
                }
            } else {
                self.setState({
                    isLoading: false
                });
                self.showErrorMsg(jsonData.error_msg);
            }
        }, () => {
            self.hideCustomLoading();
            self.showErrorMsg(self.t('time_out'));
        });
    }

    onRefreshCallBack() {
        this.refresh();
    }
}
