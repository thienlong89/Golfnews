import React from 'react';
import {
    StyleSheet,
    Text,
    View,
    ListView,
    RefreshControl,
    Platform,
    ImageBackground,
    ScrollView
} from 'react-native';
import Touchable from 'react-native-platform-touchable';
import BaseComponent from '../../../Core/View/BaseComponent';
import NotifyItem from '../Items/NotifyFriendItem';
import ApiService from '../../../Networking/ApiService';
import Networking from '../../../Networking/Networking';
import NotificationModel from '../../../Model/Notification/NotificationModel';
import AppUtil from '../../../Config/AppUtil';
import EmtyDataView from '../../../Core/Common/EmptyDataView';
import LoadingView from '../../../Core/Common/LoadingView';
import Files from '../../Common/Files';
import PopupYesOrNo from '../../Common/PopupYesOrNo';
import PopupConfirmView from '../../Popups/PopupConfirmView';
import SuggestFriendView from '../Items/SuggestFriendView';

import I18n from 'react-native-i18n';
import { verticalScale, fontSize, scale } from '../../../Config/RatioScale';
import MyView from '../../../Core/View/MyView';
require('../../../../I18n/I18n');

export default class NotifyFriendScreen extends BaseComponent {
    constructor(props) {
        super(props);
        this.page = 1;
        this.list_notification = [];
        this.refNotifyItems = [];
        this.onConfirmReject = this.onConfirmReject.bind(this);
        this.rejectIndex = '';
        this.state = {
            refreshing: false,
            dataSource: new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 }),
        }
    }

    componentDidMount() {
        global.change_notify = true;
        const { screenProps } = this.props;
        if (screenProps) {
            this.parent = screenProps.parent;
        }
        this.sendRequestListNotify();
        //this.props.navigation.re
    }

    /**
     * Update lai giao dien khi nguoi choi nhan vao button dong y hay tu choi loi moi
     * @param {*} rowData 
     */
    updateDataView(rowData) {
        //console.log("chay qua day");
        AppUtil.remove(this.list_notification, rowData);
        let dataSource = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
        this.setState({
            dataSource: dataSource.cloneWithRows(this.list_notification),
        });
        this.refeshView();
    }

    /**
     * Gửi yêu cầu lấy danh sách các thông báo bạn bè
     */
    sendRequestListNotify() {
        let url = this.getConfig().getBaseUrl() + ApiService.friend_list_request(this.page);
        console.log("url request friend : ", url);
        this.customLoading.showLoading();
        let self = this;
        Networking.httpRequestGet(url, (jsonData) => {
            self.model = new NotificationModel(self);
            self.model.parseData(jsonData);
            //console.log("ket ban : ",jsonData);
            if (self.model.getErrorCode() === 0) {
                for (let d of self.model.getListNotify()) {
                    let obj = {
                        "type": d.getType(),
                        "notification_type": d.getNotificationType(),
                        "message": d.getMessage(),
                        "display_image": d.getDisplayImage(),
                        "date_create_timestamp": d.getDateCreateTimestamp(),
                        "date_enter": d.getDateEnter(),
                        "date_enter_display": d.getDisplayDateEnter(),
                        "date_create_display": d.getDateCreateDisplay(),
                        "target_user": d.getTargetUser()
                    };
                    self.list_notification.push(obj);
                }
                global.count_friends = self.list_notification.length;
                if (self.parent) {
                    self.parent.refreshView();
                }
                if (self.list_notification.length) {
                    self.emtyDataView.hideEmptyView();
                    self.setState({
                        dataSource: self.state.dataSource.cloneWithRows(self.list_notification),
                    });
                } else {
                    if (self.page <= 1) {
                        self.emtyDataView.showEmptyView();
                    }
                }
            } else {
                if (self.page <= 1) {
                    self.emtyDataView.showEmptyView();
                }
            }
            self.customLoading.hideLoading();
        }, () => {
            self.customLoading.hideLoading();
            // self.popupTimeOut.showPopup();
        });
    }

    onLoadMore() {
        if (!this.customLoading || this.list_notification.length < 10 || (this.customLoading && this.customLoading.isLoading())) return;
        this.page++;
        this.sendRequestListNotify();
    }

    onRefresh() {
        if (!this.customLoading || (this.customLoading && this.customLoading.isLoading())) return;
        this.list_notification = [];
        this.page = 1;
        this.setState({
            dataSource: this.state.dataSource.cloneWithRows([])
        });
        this.sendRequestListNotify();
    }
    /**
     * refesh khi back lai tu man hinh notify
     */
    refresh_notify() {
        this.list_notification = [];
        this.page = 1;
        global.change_notify = true;
        this.setState({
            dataSource: this.state.dataSource.cloneWithRows([])
        });
        this.sendRequestListNotify();
    }

    refeshView() {
        global.count_friends = parseInt(global.count_friends);
        global.count_friends--;
        let { parent } = this.props.screenProps;
        if (this.parent) {
            parent.refreshView();
        }
    }

    onItemClick(data) {
        let target_user = data.target_user;
        let puid = target_user.id;
        let { parentNavigation } = this.props.screenProps;
        if (parentNavigation) {
            parentNavigation.navigate('player_info', { "puid": puid, refresh_notify: this.refresh_notify.bind(this) });
        }
    }

    onRejectFriend(index) {
        this.rejectIndex = index;
        this.popupConfirmView.okCallback = this.onConfirmReject.bind(this);
        this.popupConfirmView.setMsg(this.t('confirm_reject_friend'));
    }

    onConfirmReject() {
        if (this.rejectIndex < this.refNotifyItems.length) {
            this.refNotifyItems[this.rejectIndex].sendRequestDenied();
        }
    }

    render() {
        let {
            dataSource
        } = this.state;
        return (
            <View style={styles.container}>
                <ScrollView>
                    <MyView hide={dataSource.length === 0}>
                        <Text allowFontScaling={global.isScaleFont} style={styles.txt_suggest_friend}>{this.t('friend_request')}</Text>
                        <View style={styles.view_line} />
                    </MyView>
                    <ListView style={styles.list_view}
                        dataSource={this.state.dataSource}
                        enableEmptySections={true}
                        onEndReachedThreshold={5}
                        keyboardShouldPersistTaps='always'
                        renderSeparator={(sectionId, rowId) => <View key={rowId} style={styles.separator_view} />}
                        onEndReached={this.onLoadMore.bind(this)}
                        renderRow={(rowData, s1, index) =>
                            <Touchable onPress={this.onItemClick.bind(this, rowData)}>
                                <NotifyItem
                                    ref={(refNotifyItem) => { this.refNotifyItems[index] = refNotifyItem }}
                                    player={rowData.target_user}
                                    type={0}
                                    update={this.updateDataView.bind(this, rowData)}
                                    onRejectFriend={this.onRejectFriend.bind(this, index)}
                                />
                            </Touchable>
                        }
                        refreshControl={
                            <RefreshControl
                                refreshing={this.state.refreshing}
                                onRefresh={this.onRefresh.bind(this)}
                            />
                        }
                    />
                    <SuggestFriendView />
                </ScrollView>
                <EmtyDataView ref={(emtyDataView) => { this.emtyDataView = emtyDataView; }} />
                <LoadingView ref={(customLoading) => { this.customLoading = customLoading; }}
                    isShowOverlay={false} />
                <PopupConfirmView ref={(popupConfirmView) => { this.popupConfirmView = popupConfirmView; }} />
            </View>
        );
    }
}

const styles = StyleSheet.create({

    badge: {
        //height: 30,
        //position: 'absolute',
        alignItems: 'center',
        justifyContent: 'center',
        // backgroundColor : 'yellow',
        width: verticalScale(24),
        height: verticalScale(24),
        resizeMode: 'contain',
        marginRight: 1,
        //right : 1,
        // backgroundColor : 'red',
        // tintColor : 'red',
        //flex: 1
    },

    text_badge: {
        fontSize: fontSize(11, -scale(3)),
        color: "#ffffff",
        lineHeight: fontSize(14, scale(7))
    },

    container: {
        flex: 1,
        backgroundColor: '#fff'
    },

    list_view: {
        flex: 1
    },

    separator_view: {
        height: (Platform.OS === 'ios') ? 1 : 0.5,
        backgroundColor: '#ebebeb'
    },
    txt_suggest_friend: {
        color: '#6E6E6E',
        fontSize: 16,
        marginLeft: 10,
        marginRight: 10,
        marginTop: 8,
        marginBottom: 8,
        fontWeight: 'bold'
    },
    view_line: {
        height: 1,
        backgroundColor: '#D6D4D4'
    },
});