import React from 'react';
import {
    StyleSheet,
    View,
    FlatList,
    RefreshControl,
    InteractionManager,
    Animated
} from 'react-native';
// import Touchable from 'react-native-platform-touchable';
// import BaseComponent from '../../../Core/View/BaseComponent';
import ApiService from '../../../Networking/ApiService';
import Networking from '../../../Networking/Networking';
import NotifyItem from '../../Notification/Items/NotifyItem';
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
import HeaderScreen from './HeaderScreen';
import { verticalScale } from '../../../Config/RatioScale';
import BaseComponentAddLoading from '../../../Core/View/BaseComponentAddLoading';
import NotificationNoCacheModel from '../../../Model/Notification/NotificationNoCacheModel';
import DialogConfirm from '../../Popups/DialogConfirm';
import StaticProps from '../../../Constant/PropsStatic';
import PopupNotificationView from '../../Popups/PopupNotificationView';
import I18n from 'react-native-i18n';
import ClubEventItemModel from '../../../Model/Events/ClubEventItemModel';

const NUMBER_PAGING = 10;

const option_keys = {
    CHOOSEN_IS_READED: 'choosen_is_readed',
    ALL: 'ALL',
    FLIGHT: 'Flight',
}

const options = [
    {
        key: option_keys.ALL,
        value: I18n.t('all'),
    },
    {
        key: option_keys.FLIGHT,
        value: I18n.t('flight_key'),
    },
    {
        key: 'Event',
        value: I18n.t('event_key'),
    },
    {
        key: 'Group',
        value: I18n.t('group'),
    },
    {
        key: 'Commend',
        value: I18n.t('commen_key'),
    },
    {
        key: 'Friend',
        value: I18n.t('is_friend'),
    },
    {
        key: 'Club',
        value: I18n.t('club_key')
    },
    {
        key: option_keys.CHOOSEN_IS_READED,
        value: I18n.t('tick_all_readed')
    }
]

export default class NotificationScreen extends BaseComponentAddLoading {
    constructor(props) {
        super(props);
        this.uid = this.getUserInfo().getId();
        this.page = 1;
        this.list_notification = [];
        this.parent = '';
        this.is_refresh = false;

        this.lodashData = [];
        this.maxNotificationId = 0;
        this.minNotificationId = 0;
        this.state = {
            refreshing: false,
            dataSource: [],//new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 }),
            scrollY: this.props.scrollY
        }

        this.onLoadMore = this.onLoadMore.bind(this);
        this.onRefresh = this.onRefresh.bind(this);
        this.onItemClick = this.onItemClick.bind(this);
        this.onRemoveItem = this.onRemoveItem.bind(this);

        //=========================================END======================================
        let { screenProps } = this.props;
        if (screenProps) {
            this.scroll = screenProps.scroll;
        } else {
            this.scroll = null;
        }

        this.onFlatlistScroll = this.onFlatlistScroll.bind(this);
        this.flatListOffset = 0;

        this.obj_page_filter = {};

        this.type_filter = 'ALL';

        this.obj_list_fillter = {};

        this.onAddFriendClick = this.onAddFriendClick.bind(this);
        this.onRejectFriendClick = this.onRejectFriendClick.bind(this);

        this.dialogConfirm = StaticProps.getDialogApp();
    }

    componentDidMount() {
        global.change_notify = true;

        this.addListenerBackHandler();

        const { screenProps } = this.props;
        if (screenProps) {
            this.parent = screenProps.parent;
        }
        this.header.filterCallback = this.handleFilter.bind(this);
        this.registerMessageBar();

        // queryNotifications()
        //     .then(({ allNotification }) => {
        //         if (allNotification.length > 0) {

        //             let notificationList = [];
        //             allNotification.map((round) => {
        //                 // console.log('queryFinishFlight.round.jsonData', round.jsonData);
        //                 let obj = new NotifyItemModel();
        //                 obj.parseData(JSON.parse(round.jsonData));
        //                 notificationList.push(obj);
        //             })
        //             // console.log('queryFinishFlight.rounds', rounds);
        //             this.lodashData = _.chunk(notificationList, NUMBER_PAGING);
        //             console.log('queryFinishFlight.lodashData', this.lodashData.length);
        //             this.list_notification = this.lodashData[this.page];
        //             this.setState({
        //                 dataSource: this.state.dataSource.cloneWithRows(this.list_notification)
        //             }, () => {
        //                 this.maxNotificationId = notificationList.reduce(this.getAppUtil().getMaxNotificationReducer, notificationList[0].id);
        //                 this.minNotificationId = notificationList.reduce(this.getAppUtil().getMinNotificationReducer, notificationList[0].id);
        //                 console.log('this.maxNotificationId', this.maxNotificationId);
        //                 console.log('this.minNotificationId', this.minNotificationId);
        //                 this.saveMaxNotificationId(this.maxNotificationId.toString());
        //                 // this.updateCounter(unFinishCount);
        //                 console.log('isNewNotifyReceived', global.isNewNotifyReceived);
        //                 if (this.maxNotificationId) {
        //                     //     global.isNewNotifyReceived = false;
        //                     this.requestRefreshListNotify(true, true);
        //                 }
        //             })
        //         } else {
        //             this.sendRequestListNotification();
        //         }
        //     })
        //     .catch(error => {
        //         console.log('queryFinishFlight.error', error);
        //         this.sendRequestListNotification();
        //     });
        //bo cache
        this.sendRequestListNotification();
        // InteractionManager.runAfterInteractions(() => {
        //     this.setTabChange();
        // })
    }

    componentWillUnmount() {
        this.removeListenerBackHandler();
        this.unregisterMessageBar();
    }

    // setTabChange(offset) {
    //     console.log('setTabChange')
    //     if (this.refFlatList)
    //         this.refFlatList.scrollToOffset({ offset: verticalScale(110), animated: true });
    // }

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
        // this.customLoading.showLoading();
        this.showCustomLoading();
        let url = this.getConfig().getBaseUrl() + ApiService.view_flight_detail(flight_id);
        console.log("view url ", url);
        let self = this;
        Networking.httpRequestGet(url, (jsonData) => {
            //console.log('flight data',jsonData);
            // self.customLoading.hideLoading();
            self.hideCustomLoading();

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
            // self.customLoading.hideLoading();
            self.hideCustomLoading();
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
            let navigation = StaticProps.getAppSceneNavigator();
            if (navigation) {
                navigation.navigate('scorecard_view',
                    {
                        onCloseScorecard: self.onCloseScorecardListener.bind(self),
                        'FlightDetailModel': FlightDetailModel,
                        'isHostUser': isHostUser,
                        'notifyId': notifyId,
                        refresh: self.onRefreshCallback.bind(self)
                    });
            }
        } else {

            let navigation = StaticProps.getAppSceneNavigator();
            if (navigation) {
                navigation.navigate('enter_flight_score_view',
                    {
                        'FlightDetailModel': FlightDetailModel,
                        'isHostUser': isHostUser,
                        'notifyId': notifyId,
                        refresh: self.onRefreshCallback.bind(self)
                    });
            }
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
                    dataSource: this.list_notification //this.state.dataSource.cloneWithRows(this.list_notification)
                })
            }

        }

    }

    /**
     * Gửi yêu cầu lấy list notification
     */
    sendRequestListNotification() {
        // this.customLoading.showLoading();
        this.showCustomLoading();

        let self = this;
        let url = this.getConfig().getBaseUrl() + ApiService.notification_list(this.page);
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
                        dataSource: self.list_notification //self.state.dataSource.cloneWithRows(self.list_notification),
                    }, () => {
                        // insertNotification(newListData);
                        // self.maxNotificationId = newListData.reduce(self.getAppUtil().getMaxNotificationReducer, newListData[0].id);
                        // self.minNotificationId = newListData.reduce(self.getAppUtil().getMinNotificationReducer, newListData[0].id);
                        // console.log('this.maxNotificationId', self.maxNotificationId);
                        // console.log('this.minNotificationId', self.minNotificationId);
                        // self.saveMaxNotificationId(self.maxNotificationId.toString());
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
            // self.customLoading.hideLoading();
            self.hideCustomLoading();
        }, () => {
            //time out
            // self.customLoading.hideLoading();
            self.hideCustomLoading();
            //self.popupTimeOut.showPopup();
        });
    }

    /**
     * load them data
     */
    onLoadMore() {
        if (!this.customLoading || this.list_notification.length < 10) return;
        console.log('onLoadMore', this.lodashData.length, this.page)

        if (this.type_filter === 'ALL') {

            // if (this.page < this.lodashData.length - 1) {
            //     this.page++;
            //     this.list_notification = [...this.list_notification, ...this.lodashData[this.page]];
            //     this.setState({
            //         dataSource: this.state.dataSource.cloneWithRows(this.list_notification)
            //     })
            // } else {
            //     this.requestRefreshListNotify(false);
            // }
            this.page++;
            this.sendRequestListNotification();
        } else {
            //load more theo filter
            this.obj_page_filter[this.type_filter]++;
            this.requestFilterNotification(this.type_filter);
        }
    }

    requestRefreshListNotify(isNew = true, hideLoading = false) {
        if (!hideLoading) {
            // this.customLoading.showLoading();
            this.showCustomLoading();
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
            // self.customLoading.hideLoading();
            self.hideCustomLoading();
        }, () => {
            //time out
            // self.customLoading.hideLoading();
            self.hideCustomLoading();
            //self.popupTimeOut.showPopup();
        });
    }

    handleFilter(type) {
        switch (type) {
            case option_keys.CHOOSEN_IS_READED:
                this.requestTickIsReaded();
                break;
            default:
                this.requestFilterNotification(type);
                break;
        }
    }

    /**
     * Đánh dấu là đã đọc hết các tin nhắn
     */
    requestTickIsReaded() {
        let url = this.getConfig().getBaseUrl() + ApiService.notification_view_all();
        console.log('................. url is readed all : ', url);
        this.showCustomLoading();
        let self = this;
        Networking.httpRequestGet(url, (jsonData) => {
            self.hideCustomLoading();
            // console.log('.................. danh dau la da doc : ',jsonData);
            let { error_code, data, error_msg } = jsonData;
            if (error_code === 0) {
                for (let notify of this.list_notification) {
                    notify.is_view = 1;
                }
                let keys = Object.keys(self.obj_list_fillter);
                for (let key of keys) {
                    let list = self.obj_list_fillter[key];
                    list.forEach(d => d.is_view = 1);
                    self.obj_list_fillter[key] = list;
                }

                if (self.type_filter === option_keys.ALL) {
                    self.setState({
                        dataSource: self.list_notification
                    })
                } else {
                    let list = self.obj_list_fillter[self.type_filter];
                    self.setState({
                        dataSource: list
                    });
                }

                self.hideCountNoti();
            }
        }, () => {
            self.hideCustomLoading();
        })
    }

    hideCountNoti() {
        let _component = StaticProps.getMainAppComponent();
        if (_component) {
            _component.updateCountSystemNotify(0);
        }
    }

    requestFilterNotification(type) {
        let page = 1;
        let number = 20;
        let key = type.toUpperCase();//.toString();
        this.type_filter = type;
        if (this.type_filter === option_keys.ALL) {
            // let ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
            this.setState({
                dataSource: this.list_notification //ds.cloneWithRows(this.list_notification)
            });
            if (this.list_notification.length) {
                this.emptyDataView.hideEmptyView();
            }
            return;
        }

        if (this.obj_page_filter.hasOwnProperty(key)) {
            page = this.obj_page_filter[key];
            // page++;
            // this.obj_page_filter[key]++;
        } else {
            this.obj_page_filter[key] = page;
        }
        let url = this.getConfig().getBaseUrl() + ApiService.notification_filter(Constant.FILTER_TYPE[key], page, number);
        console.log('............................. url filter : ', url);
        this.showCustomLoading();
        let self = this;
        Networking.httpRequestGet(url, (jsonData) => {
            self.hideCustomLoading();

            let model = new NotificationNoCacheModel(self);
            model.parseData(jsonData);
            if (model.getErrorCode() === 0) {
                let listFilter = model.getListNotify();
                // let ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });

                // console.log('............filter lenght : ',listFilter.length);

                if (self.obj_list_fillter.hasOwnProperty(self.type_filter)) {
                    let list = self.obj_list_fillter[self.type_filter];

                    // console.log('............list length : ',list.length);
                    listFilter = [...list, ...listFilter];
                    self.obj_list_fillter[self.type_filter] = [...listFilter];
                } else {
                    //luu lai vao mang
                    self.obj_list_fillter[self.type_filter] = listFilter;
                }

                // console.log('...................listFilter after : ',listFilter.length);

                if (listFilter.length) {
                    self.emptyDataView.hideEmptyView();
                    self.setState({
                        dataSource: listFilter //ds.cloneWithRows(listFilter)
                    });
                } else {
                    self.setState({
                        dataSource: [] //ds.cloneWithRows([])
                    });
                    self.emptyDataView.showEmptyView();
                }
            }
        }, () => {
            self.hideCustomLoading();
        });
    }

    // updateView(isNew = true) {
    //     queryNotifications()
    //         .then(({ allNotification }) => {
    //             if (allNotification.length > 0) {
    //                 this.lodashData = [];
    //                 let notificationList = [];
    //                 this.list_notification = [];
    //                 allNotification.map((round) => {
    //                     // console.log('queryFinishFlight.round.jsonData', round.jsonData);
    //                     let obj = new NotifyItemModel();
    //                     obj.parseData(JSON.parse(round.jsonData));
    //                     notificationList.push(obj);
    //                 })
    //                 // console.log('queryFinishFlight.rounds', rounds);
    //                 this.lodashData = _.chunk(notificationList, NUMBER_PAGING);
    //                 console.log('queryFinishFlight.lodashData', this.lodashData.length);
    //                 this.page = isNew || this.page >= this.lodashData.length ? 0 : this.page;
    //                 for (let i = 0; i <= this.page; i++) {
    //                     this.list_notification = [...this.list_notification, ...this.lodashData[i]];
    //                 }
    //                 this.setState({
    //                     dataSource: this.state.dataSource.cloneWithRows(this.list_notification)
    //                 }, () => {
    //                     this.maxNotificationId = notificationList.reduce(this.getAppUtil().getMaxNotificationReducer, notificationList[0].id);
    //                     this.minNotificationId = notificationList.reduce(this.getAppUtil().getMinNotificationReducer, notificationList[0].id);
    //                     console.log('this.maxNotificationId', this.maxNotificationId);
    //                     console.log('this.minNotificationId', this.minNotificationId);
    //                     this.saveMaxNotificationId(this.maxNotificationId.toString());
    //                     // this.updateCounter(unFinishCount);
    //                     console.log('isNewNotifyReceived', global.isNewNotifyReceived);
    //                     if (this.maxNotificationId) {
    //                         //     global.isNewNotifyReceived = false;
    //                         this.requestRefreshListNotify(true, true);
    //                     }
    //                 })
    //             }
    //         })
    //         .catch(error => {
    //         });
    // }

    /**
     * load lai data
     */
    onRefresh() {
        if (!this.customLoading || (this.customLoading.isLoading())) return;

        if (this.type_filter === 'ALL') {
            // this.requestRefreshListNotify(true);
            this.page = 1;
            this.list_notification = [];
            this.sendRequestListNotification();
        } else {
            // let page = this.obj_page_filter[this.type_filter];
            // page++;
            this.obj_page_filter[this.type_filter] = 1;
            this.requestFilterNotification(this.type_filter);
        }
    }

    refreshView() {
        // if (this.parent) {
        //     this.parent.refreshView();
        // }
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
            // let ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 })
            this.setState({
                dataSource: this.list_notification //ds.cloneWithRows(this.list_notification)
            }, () => {
                global.change_notify = true;
                global.count_notifycation--;
                let _com = StaticProps.getMainAppComponent();
                if (_com) {
                    _com.updateCountSystemNotify(1, true);
                }
                // this.refreshView();
                deleteNotifyByNotifyId(data.id);
            });
        }
    }

    /**
     * this.navigation.navigate('club_event_detail_view', {
                eventProps: event,
                isAppointment: true,
                onScreenCallback: this.onScreenCallback
            })
     * @param {*} event_id 
     */
    sendRequestClubEvent(event_id) {
        let navigation = StaticProps.getAppSceneNavigator();
        if (!navigation) return;
        let url = this.getConfig().getBaseUrl() + ApiService.get_event_info_details(event_id);
        let self = this;
        this.showCustomLoading();
        console.log('........................ club event  :', url);
        Networking.httpRequestGet(url, (jsonData) => {
            self.hideCustomLoading();
            let { error_code, data } = jsonData;
            if (error_code === 0) {
                let model = new ClubEventItemModel();
                model.parseData(data);
                navigation.navigate('club_event_detail_view', {
                    eventProps: model,
                    isAppointment: false
                });
            }
        }, () => {
            self.hideCustomLoading();
        });
    }

    //FLIGHT : [1,2,3,4,5,6,7,10,12,], EVENT : [14], FRIEND : [9], STATUS : [17,18,19,20,21,22,23,24,25,26], CLUB : [11,15,16], GROUP : [13]
    //// thông báo về upload ảnh trong Flight
    //ADD_IMG_FLIGHT: 27,
    // thông báo về upload ảnh trong Flight
    //ADD_IMG_EVENT_CLUB: 28,
    onItemClick(data) {
        let flight_id = data.getFlightId();
        let navigation = StaticProps.getAppSceneNavigator();
        console.log('......................flight_id : ', flight_id);
        if (flight_id > 0) {
            this.sendRequestFlight(flight_id, data.id);
        } else {
            let { id_stt, notification_type } = data;
            if (!navigation) return;
            switch (notification_type) {
                case 13:
                    this.sendRequestGroup(id_stt);
                    break;
                case 14:
                    this.sendRequestYourEvent(id_stt);
                    break;
                case 11:
                    this.sendRequestClubInfo(id_stt);
                    break;
                case 15:
                    break;
                case 16:
                    this.sendRequestClubEvent(id_stt);
                    break;
                case 27:
                    break;
                case 28:
                    break;
                default:
                    break;
            }
        }
    }

    /**
     * this.navigation.navigate('club_event_detail_view', {
                eventProps: event,
                isAppointment: true,
                onScreenCallback: this.onScreenCallback
            })
     * @param {*} event_id 
     */
    sendRequestYourEvent(event_id) {
        let url = this.getConfig().getBaseUrl() + ApiService.event_detail(event_id);
        console.log('..........................event detail : ', url);
    }

    checkIsAccepted(uid_in_club) {
        if (!uid_in_club) return false;
        let { is_accepted } = uid_in_club;
        return is_accepted === 1 ? true : false;
    }

    checkIsMember(uid_in_club) {
        if (!uid_in_club) return false;
        let { is_accepted } = uid_in_club;
        return is_accepted === 1 ? true : false;
    }

    sendRequestClubInfo(clubId) {
        let url = this.getConfig().getBaseUrl() + ApiService.get_club_info(clubId);
        console.log('........................... info club : ', url);
        let self = this;
        let navigation = StaticProps.getAppSceneNavigator();
        if (!navigation) return;
        this.showCustomLoading();
        Networking.httpRequestGet(url, (jsonData) => {
            self.hideCustomLoading();
            let { error_code, data } = jsonData;
            if (error_code === 0) {
                let { club } = data;
                if (club) {
                    let { id, name, logo_url_path, total_member, list_user_admin_club, list_user_moderator_club, list_user_general_secretary_club, uid_in_club } = club;
                    navigation.navigate('introduce_club_view', {
                        clubId: id,
                        clubName: name,
                        logoUrl: logo_url_path,
                        isAdmin: self.checkIsAdminClub(list_user_admin_club),
                        isGeneralSecretary: self.checkIsGeneralSecretaryClub(list_user_general_secretary_club),
                        isModerator: self.checkIsModeratorClub(list_user_moderator_club),
                        isAccepted: this.checkIsAccepted(uid_in_club),
                        isMember: this.checkIsMember(uid_in_club),
                        totalMember: total_member
                    });
                }
            }
        }, () => {
            self.hideCustomLoading();
        });
    }

    checkIsAdminClub(listAdmin) {
        if (!listAdmin.length) return false;
        let admin = listAdmin.find(d => this.getUserInfo().getId() === d._id);
        if (admin) return true;
        return false;
    }

    //isModerator
    checkIsModeratorClub(listModerator) {
        if (!listModerator.length) return false;
        let moderator = listModerator.find(d => this.getUserInfo().getId() === d._id);
        if (moderator) return true;
        return false;
    }

    //isGeneralSecretary
    checkIsGeneralSecretaryClub(listSecreatary) {
        if (!listSecreatary.length) return false;
        let secreatary = listSecreatary.find(d => this.getUserInfo().getId() === d._id);
        if (secreatary) return true;
        return false;
    }

    sendRequestGroup(group_id) {
        let navigation = StaticProps.getAppSceneNavigator();
        if (!navigation) return;
        let url = this.getConfig().getBaseUrl() + ApiService.group_detail(group_id);
        console.log('.................... group detail : ', url);
        let self = this;
        this.showCustomLoading();
        Networking.httpRequestGet(url, (jsonData) => {
            self.hideCustomLoading();
            let { error_code, data } = jsonData;
            if (error_code === 0) {
                if (data && data.group) {
                    let group = data.group;
                    let dataGroup = {
                        host: (group.host_user_id === this.getUserInfo().getId() || (group.is_user_admin === 1)) ? true : false,
                        groupId: group.id,
                        logoUrl: group.image_path,
                        groupName: group.name,
                        totalMember: group.total_member,
                        can_delete: 1,
                        "type": 2,
                        "created_at": group.created_at,
                        "updated_at": group.updated_at,
                    }
                    navigation.navigate('group_detail', { show_chat: true, data: dataGroup });
                }
            }
        }, () => {
            self.hideCustomLoading();
        });
    }

    onFlatlistScroll(event) {
        // let currentOffset = event.nativeEvent.contentOffset.y;
        // let isUp = (currentOffset > 0 && currentOffset > this.flatListOffset)
        //     ? false
        //     : true;
        // if (this.scroll) {
        //     // console.log('............................... scorll : ', isUp);
        //     this.scroll(isUp);
        // }

        // // Update your scroll position
        // this.flatListOffset = currentOffset
        this.scroll(event);
    }

    onAddFriendClick(data) {
        let content = this.t('content_accept_invite_friend').format(`${data.fullname}-${data.id}`);
        this.dialogConfirm.confirmCallback = this.sendRequestAccept.bind(this, data);
        this.dialogConfirm.setContent(content);
    }

    /**
     * Gui yeu cau dong y ket ban
     */
    sendRequestAccept(data) {
        // let { update } = this.props;
        // let { SourceUser } = this.props.data;
        let url = this.getConfig().getBaseUrl() + ApiService.friend_accept(data.SourceUser._id);
        console.log('.................dong y loi moi : ', url);
        let self = this;
        Networking.httpRequestGet(url, (jsonData) => {
            console.log("dong y loi moi", jsonData);
            if (jsonData.hasOwnProperty('error_code')) {
                let error_code = parseInt(jsonData['error_code']);
                if (error_code === 0) {
                    //thanh cong thi update lai giao dien
                    self.updateView(data);
                } else {
                    self.popupNotify.setMsg(jsonData['error_msg']);
                }
            }
        });
    }

    onRejectFriendClick(data) {
        let content = this.t('content_reject_invite_friend').format(`${data.fullname}-${data.id}`);
        this.dialogConfirm.confirmCallback = this.sendRequestAccept.bind(this, data);
        this.dialogConfirm.setContent(content);
    }

    updateView(data) {
        let list = [];
        if (this.obj_list_fillter.hasOwnProperty(this.type_filter)) {
            list = this.obj_list_fillter[this.type_filter];
        }
        list = this.getAppUtil().remove(list, data);
        // let ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 })
        this.setState({
            dataSource: list //ds.cloneWithRows(list)
        }, () => {
            global.change_notify = true;
            global.count_notifycation--;
            let _com = StaticProps.getMainAppComponent();
            if (_com) {
                _com.updateCountSystemNotify(1, true);
            }
            // this.refreshView();
            deleteNotifyByNotifyId(data.id);
        });
    }

    /**
     * Gửi yêu cầu hủy lời mời kết bạn
     */
    sendRequestDenied(data) {
        // let { update } = this.props;
        // let { SourceUser } = this.props.data;
        let url = this.getConfig().getBaseUrl() + ApiService.friend_denied(data.SourceUser._id);
        let self = this;
        Networking.httpRequestGet(url, (jsonData) => {
            if (jsonData.hasOwnProperty('error_code')) {
                let error_code = parseInt(jsonData['error_code']);
                if (error_code === 0) {
                    //thanh cong thi update lai giao dien
                    self.updateView(data);
                } else {
                    self.popupNotify.setMsg(jsonData['error_msg']);
                }
            }
        });
    }

    render() {
        return (
            <View style={styles.container}>
                {/* <Animated.View style={{ transform: [{ translateY: this.props.tabY }], zIndex: 2, position: 'absolute', top: this.home_page_title_padding_top, backgroundColor: '#fff' }}> */}
                <HeaderScreen ref={(header) => { this.header = header; }} title={this.t('notify').toUpperCase()} show={true} color={'#00aba7'} options={options} />
                {/* </Animated.View> */}
                {this.renderMessageBar()}
                <FlatList
                    ref={(refFlatList) => { this.refFlatList = refFlatList; }}
                    style={styles.list_view}
                    data={this.state.dataSource}
                    enableEmptySections={true}
                    onEndReachedThreshold={5}
                    onScroll={this.onFlatlistScroll}
                    // onScroll={Animated.event(
                    //     [{ nativeEvent: { contentOffset: { y: this.state.scrollY } } }],
                    //     // { useNativeDriver: true }
                    //     {
                    //         listener: event => {
                    //             const offsetY = event.nativeEvent.contentOffset.y
                    //             // do something special
                    //             console.log('scrollCallback', offsetY)
                    //             if (this.props.onScrollOffset) {
                    //                 this.props.onScrollOffset(offsetY);
                    //             }
                    //         },
                    //     },
                    // )}
                    keyboardShouldPersistTaps='always'
                    ItemSeparatorComponent={(sectionId, rowId) => <View key={rowId} style={styles.separator_view} />}
                    onEndReached={this.onLoadMore}
                    onEndReachedThreshold={0.2}
                    renderItem={({ item, index }) =>
                        // <Touchable onPress={this.onItemClick.bind(this, rowData)}>
                        <NotifyItem data={item}
                            onRejectFriend={this.onRejectFriendClick}
                            onAddFriend={this.onAddFriendClick}
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
                // contentContainerStyle={{ paddingTop: this.home_page_scroll_padding_top }}
                />
                <EmptyDataView
                    ref={(emptyDataView) => { this.emptyDataView = emptyDataView; }}
                // customStyle={{ paddingTop: this.home_page_scroll_padding_top }}
                />
                <LoadingView ref={(customLoading) => { this.customLoading = customLoading; }}
                    isShowOverlay={false} />
                {this.renderCustomLoading()}
                <PopupNotificationView ref={(popupNotify) => { this.popupNotify = popupNotify; }} />
                {/* <DialogConfirm ref={(dialogConfirm) => { this.dialogConfirm = dialogConfirm; }}
                    cancelText={this.t('cancel')}
                    confirmText={this.t('confirm')} */}
                {/* /> */}
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
        height: verticalScale(1.5),
        backgroundColor: '#ebebeb'
    }
});