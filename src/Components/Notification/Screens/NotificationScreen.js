import React from 'react';
import {
    StyleSheet,
    View,
    ListView,
    RefreshControl,
    Platform
} from 'react-native';
import Touchable from 'react-native-platform-touchable';
import BaseComponent from '../../../Core/View/BaseComponent';
import ApiService from '../../../Networking/ApiService';
import Networking from '../../../Networking/Networking';
import NotifyItem from '../Items/NotifyItem';
import NotificationModel from '../../../Model/Notification/NotificationModel';
import NotifyItemModel from '../../../Model/Notification/NotifyItemModel';
import FlightDetailModel from '../../../Model/CreateFlight/Flight/FlightDetailModel';
import EmptyDataView from '../../../Core/Common/EmptyDataView';
import LoadingView from '../../../Core/Common/LoadingView';
import _ from 'lodash';
import {
    insertNotification,
    queryNotifications,
    updateNotification,
    deleteNotifyByNotifyId,
    deleteNotifyArrayByNotifyId
} from '../../../DbLocal/NotificationRealm';
import DataManager from '../../../Core/Manager/DataManager';
import Constant from '../../../Constant/Constant';

const NUMBER_PAGING = 10;

export default class NotificationScreen extends BaseComponent {
    constructor(props) {
        super(props);
        this.uid = this.getUserInfo().getId();
        this.page = 0;
        this.list_notification = [];
        this.parent = '';
        this.is_refresh = false;

        this.lodashData = [];
        this.maxNotificationId = 0;
        this.minNotificationId = 0;
        this.state = {
            refreshing: false,
            dataSource: new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 }),
        }

        this.onLoadMore = this.onLoadMore.bind(this);
        this.onRefresh = this.onRefresh.bind(this);
        this.onItemClick = this.onItemClick.bind(this);
        this.onRemoveItem = this.onRemoveItem.bind(this);
    }

    componentDidMount() {
        global.change_notify = true;
        const { screenProps } = this.props;
        if (screenProps) {
            this.parent = screenProps.parent;
        }
        this.registerMessageBar();

        queryNotifications()
            .then(({ allNotification }) => {
                if (allNotification.length > 0) {

                    let notificationList = [];
                    allNotification.map((round) => {
                        // console.log('queryFinishFlight.round.jsonData', round.jsonData);
                        let obj = new NotifyItemModel();
                        obj.parseData(JSON.parse(round.jsonData));
                        notificationList.push(obj);
                    })
                    // console.log('queryFinishFlight.rounds', rounds);
                    this.lodashData = _.chunk(notificationList, NUMBER_PAGING);
                    console.log('queryFinishFlight.lodashData', this.lodashData.length);
                    this.list_notification = this.lodashData[this.page];
                    this.setState({
                        dataSource: this.state.dataSource.cloneWithRows(this.list_notification)
                    }, () => {
                        this.maxNotificationId = notificationList.reduce(this.getAppUtil().getMaxNotificationReducer, notificationList[0].id);
                        this.minNotificationId = notificationList.reduce(this.getAppUtil().getMinNotificationReducer, notificationList[0].id);
                        console.log('this.maxNotificationId', this.maxNotificationId);
                        console.log('this.minNotificationId', this.minNotificationId);
                        this.saveMaxNotificationId(this.maxNotificationId.toString());
                        // this.updateCounter(unFinishCount);
                        console.log('isNewNotifyReceived', global.isNewNotifyReceived);
                        if (this.maxNotificationId) {
                            //     global.isNewNotifyReceived = false;
                            this.requestRefreshListNotify(true, true);
                        }
                    })
                } else {
                    this.sendRequestListNotification();
                }
            })
            .catch(error => {
                console.log('queryFinishFlight.error', error);
                this.sendRequestListNotification();
            });


    }

    componentWillUnmount() {
        this.unregisterMessageBar();
    }

    /**
     * Xoay lai man hinh
     */
    onCloseScorecardListener() {
        this.Mxpo.ScreenOrientation.allow(this.Mxpo.ScreenOrientation.Orientation.PORTRAIT);
    }

    /**
     * lay flight
     * @param {*} flight_id 
     */
    sendRequestFlight(flight_id, notifyId) {
        //let { parentNavigation } = this.props.screenProps;
        this.customLoading.showLoading();
        let url = this.getConfig().getBaseUrl() + ApiService.view_flight_detail(flight_id);
        //console.log("view url ",url);
        let self = this;
        Networking.httpRequestGet(url, (jsonData) => {
            //console.log('flight data',jsonData);
            self.customLoading.hideLoading();
            self.model = new FlightDetailModel(self);
            self.model.parseData(jsonData);
            //console.log('sendRequestFlight')
            if (self.model.getErrorCode() === 0) {
                let userRounds = self.model.getFlight().getUserRounds();
                let user = userRounds.find((userRound) => {
                    return userRound.getUserId() === self.uid;
                });
                if (!user || user.getSubmitted() === 1) {
                    self.openScoreView(0, self, self.model, notifyId);
                } else {
                    self.openScoreView(1, self, self.model, notifyId);
                }
            } else {
                self.showErrorMsg(self.model.getErrorMsg())
            }
        }, () => {
            self.customLoading.hideLoading();
        });
    }

    openScoreView(type, self, FlightDetailModel, notifyId) {
        let { parentNavigation } = this.props.screenProps;
        let flight = FlightDetailModel.getFlight();
        let playerList = flight.getUserRounds();
        let indexMe = playerList.findIndex((user) => {
            return self.uid.toString().indexOf('VGA') > -1 ? user.getUser().getUserId() === self.uid : user.getUserId() === self.uid;

        });
        let isHostUser = false;
        if (indexMe != -1) {
            playerList.splice(0, 0, ...playerList.splice(indexMe, 1));
            try {
                if (playerList.length > 0 && playerList[0].getSttUser() === 1) {
                    isHostUser = true;
                }
            } catch (error) {
                console.log('parseCourseData.isHostUser.error', error);
            }

        }

        if (type === 0) {
            parentNavigation.navigate('scorecard_view',
                {
                    onCloseScorecard: self.onCloseScorecardListener.bind(self),
                    'FlightDetailModel': FlightDetailModel,
                    'isHostUser': isHostUser,
                    'notifyId': notifyId,
                    refresh: self.onRefreshCallback.bind(self)
                });
        } else {
            parentNavigation.navigate('enter_flight_score_view',
                {
                    'FlightDetailModel': FlightDetailModel,
                    'isHostUser': isHostUser,
                    'notifyId': notifyId,
                    refresh: self.onRefreshCallback.bind(self)
                });
        }

    }

    onRefreshCallback(notifyId) {
        if (notifyId) {
            let index = this.list_notification.findIndex((notification) => {
                return notifyId === notification.id;
            });
            if (index != -1) {
                this.list_notification.splice(index, 1);
                this.setState({
                    dataSource: this.state.dataSource.cloneWithRows(this.list_notification)
                })
            }

        }

    }

    /**
     * Gửi yêu cầu lấy list notification
     */
    sendRequestListNotification() {
        this.customLoading.showLoading();
        let self = this;
        let url = this.getConfig().getBaseUrl() + ApiService.notification_list();
        console.log('url.............................. ', url);
        Networking.httpRequestGet(url, (jsonData) => {
            console.log("data notify , ", jsonData);
            self.model = new NotificationModel(self);
            self.model.parseData(jsonData);
            if (self.model.getErrorCode() === 0) {
                let newListData = self.model.getListNotify();
                if (newListData.length > 0) {
                    self.list_notification = [...self.list_notification, ...newListData];

                    self.emptyDataView.hideEmptyView();
                    self.setState({
                        dataSource: self.state.dataSource.cloneWithRows(self.list_notification),
                    }, () => {
                        insertNotification(newListData);
                        self.maxNotificationId = newListData.reduce(self.getAppUtil().getMaxNotificationReducer, newListData[0].id);
                        self.minNotificationId = newListData.reduce(self.getAppUtil().getMinNotificationReducer, newListData[0].id);
                        console.log('this.maxNotificationId', self.maxNotificationId);
                        console.log('this.minNotificationId', self.minNotificationId);
                        self.saveMaxNotificationId(self.maxNotificationId.toString());
                    });
                } else {
                    if (self.page <= 1) {
                        self.emptyDataView.showEmptyView();
                    }
                }
            } else {
                if (self.page <= 1) {
                    self.emptyDataView.showEmptyView();
                }
            }
            self.customLoading.hideLoading();
        }, () => {
            //time out
            self.customLoading.hideLoading();
            //self.popupTimeOut.showPopup();
        });
    }

    /**
     * load them data
     */
    onLoadMore() {
        if (!this.customLoading || this.list_notification.length < 10 || (this.customLoading && this.customLoading.isLoading())) return;
        console.log('onLoadMore', this.lodashData.length, this.page)
        if (this.page < this.lodashData.length - 1) {
            this.page++;
            this.list_notification = [...this.list_notification, ...this.lodashData[this.page]];
            this.setState({
                dataSource: this.state.dataSource.cloneWithRows(this.list_notification)
            })
        } else {
            this.requestRefreshListNotify(false);
        }
    }

    requestRefreshListNotify(isNew = true, hideLoading = false) {
        if (!hideLoading) {
            this.customLoading.showLoading();
        }

        let self = this;
        let url = this.getConfig().getBaseUrl() + ApiService.notification_list_for_cache(isNew ? this.maxNotificationId : this.minNotificationId, isNew);
        console.log('news url : ', url);
        Networking.httpRequestGet(url, (jsonData) => {
            self.model = new NotificationModel(self);
            self.model.parseData(jsonData);
            if (self.model.getErrorCode() === 0) {
                let newsList = self.model.getListNotify();
                let listIdRemove = self.model.getListIdRemove();
                if (listIdRemove.length > 0 && isNew) {
                    deleteNotifyArrayByNotifyId(listIdRemove)
                        .then(() => {
                            global.change_notify = true;
                            insertNotification(newsList)
                                .then(() => {
                                    self.updateView(isNew);
                                })
                                .catch(() => {
                                    self.updateView(isNew);
                                });
                        })
                        .catch(() => {
                            global.change_notify = true;
                            insertNotification(newsList)
                                .then(() => {
                                    self.updateView(isNew);
                                })
                                .catch(() => {
                                    self.updateView(isNew);
                                });
                        })
                } else if (newsList.length > 0) {
                    global.change_notify = true;
                    insertNotification(newsList)
                        .then(() => {
                            self.updateView(isNew);
                        })
                        .catch(() => {
                            self.updateView(isNew);
                        });
                }
                // if (newsList.length > 0) {
                //     global.change_notify = true;
                //     self.list_notification = isNew ? [...newsList, ...self.list_notification] : [...self.list_notification, ...newsList];
                //     self.setState({
                //         dataSource: self.state.dataSource.cloneWithRows(self.list_notification),
                //     }, () => {
                //         insertNotification(newsList);
                //         if (isNew) {
                //             self.maxNotificationId = newsList.reduce(self.getAppUtil().getMaxNotificationReducer, newsList[0].id);
                //             self.saveMaxNotificationId(self.maxNotificationId.toString());
                //         }
                //         self.emptyDataView.hideEmptyView();
                //     });
                // }
            }
            self.customLoading.hideLoading();
        }, () => {
            //time out
            self.customLoading.hideLoading();
            //self.popupTimeOut.showPopup();
        });
    }

    updateView(isNew = true) {
        queryNotifications()
            .then(({ allNotification }) => {
                if (allNotification.length > 0) {
                    this.lodashData = [];
                    let notificationList = [];
                    this.list_notification = [];
                    allNotification.map((round) => {
                        // console.log('queryFinishFlight.round.jsonData', round.jsonData);
                        let obj = new NotifyItemModel();
                        obj.parseData(JSON.parse(round.jsonData));
                        notificationList.push(obj);
                    })
                    // console.log('queryFinishFlight.rounds', rounds);
                    this.lodashData = _.chunk(notificationList, NUMBER_PAGING);
                    console.log('queryFinishFlight.lodashData', this.lodashData.length);
                    this.page = isNew || this.page >= this.lodashData.length ? 0 : this.page;
                    for (let i = 0; i <= this.page; i++) {
                        this.list_notification = [...this.list_notification, ...this.lodashData[i]];
                    }
                    this.setState({
                        dataSource: this.state.dataSource.cloneWithRows(this.list_notification)
                    }, () => {
                        this.maxNotificationId = notificationList.reduce(this.getAppUtil().getMaxNotificationReducer, notificationList[0].id);
                        this.minNotificationId = notificationList.reduce(this.getAppUtil().getMinNotificationReducer, notificationList[0].id);
                        console.log('this.maxNotificationId', this.maxNotificationId);
                        console.log('this.minNotificationId', this.minNotificationId);
                        this.saveMaxNotificationId(this.maxNotificationId.toString());
                        // this.updateCounter(unFinishCount);
                        console.log('isNewNotifyReceived', global.isNewNotifyReceived);
                        if (this.maxNotificationId) {
                            //     global.isNewNotifyReceived = false;
                            this.requestRefreshListNotify(true, true);
                        }
                    })
                }
            })
            .catch(error => {
            });
    }

    /**
     * check neu refresh dc count notify thi refresh header
     */
    checkRefeshCountNotify() {
        let self = this;
        var refreshIntervalId = setInterval(() => {
            if (!global.change_notify) {
                // self.parent.refreshView();
                self.refreshView();
                clearInterval(refreshIntervalId);
            }
        }, 300);
    }

    /**
     * load lai data
     */
    onRefresh() {
        if (!this.customLoading || (this.customLoading && this.customLoading.isLoading())) return;

        this.requestRefreshListNotify(true);
    }

    refreshView() {
        if (this.parent) {
            this.parent.refreshView();
        }
    }

    /**
     * remove item
     * @param {*} data 
     */
    onRemoveItem(data) {
        let index = this.list_notification.findIndex((notification) => {
            return data.id === notification.id;
        });
        if (index != -1) {
            this.list_notification.splice(index, 1);
            console.log('onRemoveItem.index', index, this.list_notification);
            let ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 })
            this.setState({
                dataSource: ds.cloneWithRows(this.list_notification)
            }, () => {
                global.change_notify = true;
                global.count_notifycation--;
                this.refreshView();
                deleteNotifyByNotifyId(data.id);
            });
        }
    }

    onItemClick(data) {
        let flight_id = data.getFlightId();
        if (flight_id > 0) {
            this.sendRequestFlight(flight_id, data.id);
        }
    }

    render() {
        return (
            <View style={styles.container}>
                {this.renderMessageBar()}
                <ListView style={styles.list_view}
                    dataSource={this.state.dataSource}
                    enableEmptySections={true}
                    onEndReachedThreshold={5}
                    keyboardShouldPersistTaps='always'
                    renderSeparator={(sectionId, rowId) => <View key={rowId} style={styles.separator_view} />}
                    onEndReached={this.onLoadMore}
                    renderRow={(rowData) =>
                        // <Touchable onPress={this.onItemClick.bind(this, rowData)}>
                        <NotifyItem data={rowData}
                            onItemClickCallback={this.onItemClick}
                            remove={this.onRemoveItem} />
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
        );
    }

    saveMaxNotificationId(notifyId) {
        DataManager.saveSingleLocalData(Constant.CACHE.MAX_NOTIFICATION_ID, notifyId, (error) => {
            console.log('saveLocalFlightId.error', error)
        });
    }
}

const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: '#fff'
    },

    list_view: {
        flex: 1,
    },

    separator_view: {
        height: (Platform.OS === 'ios') ? 1 : 0.5,
        backgroundColor: '#ebebeb'
    }
});