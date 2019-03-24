import React from 'react';
import {
    Platform,
    StyleSheet,
    Text,
    View,
    ListView,
    RefreshControl,
    Dimensions,
    FlatList,
    Animated,
    InteractionManager,
    NetInfo
} from 'react-native';
import Touchable from 'react-native-platform-touchable';
import BaseComponent from '../../../Core/View/BaseComponent';
import FriendFlightItem from '../FriendFlightItem';
import EmptyDataView from '../../../Core/Common/EmptyDataView';
import FriendFlightModel from '../../../Model/Home/FriendFlightModel';
import ApiService from '../../../Networking/ApiService';
import Networking from '../../../Networking/Networking';
import LoadingView from '../../../Core/Common/LoadingView';
import FlightSummaryModel from '../../../Model/CreateFlight/Flight/FlightSummaryModel';
import { scale, verticalScale, fontSize } from '../../../Config/RatioScale';
import {
    insertFriendFlight,
    queryFriendFlight,
    deleteFriendFlightArray,
    updateFlight,
    deleteFriendFlightArrayId,
    queryFriendFlightLimited
} from '../../../DbLocal/FriendFlightRealm';
import _ from 'lodash';
import DataManager from '../../../Core/Manager/DataManager';
import Constant from '../../../Constant/Constant';
import LikeCommentHomeView from '../../Common/LikeCommentHomeView';
import HeaderScreen from './HeaderScreen';
import FlightDetailModel from '../../../Model/CreateFlight/Flight/FlightDetailModel';
import StaticProps from '../../../Constant/PropsStatic';
import FooterComponent from '../Item/FooterComponent';
import BaseComponentAddBackHandler from '../../../Core/View/BaseComponentAddBackHandler';
import PopupUpgradeVip from '../../Common/PopupUpgradeVip';

const { width, height } = Dimensions.get('window');
const NUMBER_PAGING = 10;
export default class FriendFlightScreen extends BaseComponentAddBackHandler {

    constructor(props) {
        super(props);
        this.uid = this.getUserInfo().getId();

        this.friendFlightPage = 1;
        this.friendFlightList = [];
        this.page = 0;
        this.lodashData = [];
        this.isloading = false;
        this.maxFlightId = '';
        this.minFlightId = '';
        this.refLikeComment = [];
        this.shouldUpdate = true;
        this.isOnNetwork = true;
        this.rounds = [];
        this.state = {
            refreshing: false,
            dataSource: this.friendFlightList,
            scrollY: this.props.scrollY
        }

        this.refreshFriendList = this.refreshFriendList.bind(this);
        this.loadMoreFriendFlight = this.loadMoreFriendFlight.bind(this);
        //=========================================END======================================
        let { screenProps } = this.props;
        if (screenProps) {
            this.scroll = screenProps.scroll;
        } else {
            this.scroll = null;
        }

        this.onFlatlistScroll = this.onFlatlistScroll.bind(this);
        this.flatListOffset = 0;

        this.onFriendCloseScorecardListener = this.onFriendCloseScorecardListener.bind(this);
        this.onConfirmUpgrade = this.onConfirmUpgrade.bind(this);
        // this.props.navigation.addListener('didFocus', this._handleStateChange.bind(this));
        // this.props.navigation.addListener('didBlur', this._handleDidBlur.bind(this));
    }

    _handleStateChange = state => {
        console.log('FriendFlightView._onNavigatorEvent');
        // this.setChange();
    };

    _handleDidBlur() {
        console.log('FriendFlightView._handleDidBlur');
        // this.setChange();
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

    // shouldComponentUpdate() {
    //     return this.shouldUpdate;
    // }


    render() {
        console.log('FriendFlightView.render');
        this.shouldUpdate = false;

        return (
            <View style={styles.container}>

                {/* <Animated.View style={{ transform: [{ translateY: this.props.tabY }], zIndex: 2, position: 'absolute', top: this.home_page_title_padding_top, backgroundColor: '#fff' }}> */}
                <HeaderScreen ref={(refHeader) => { this.refHeader = refHeader; }} count={0} title={this.t('friend_flight').toUpperCase()} />
                {/* </Animated.View> */}
                <FlatList
                    ref={(refFlatList) => { this.refFlatList = refFlatList; }}
                    refreshControl={
                        <RefreshControl
                            refreshing={this.state.refreshing}
                            onRefresh={this.refreshFriendList}
                        />
                    }
                    onEndReached={this.loadMoreFriendFlight}
                    onEndReachedThreshold={0.2}
                    initialNumToRender={5}
                    ListFooterComponent={() => <FooterComponent ref={(refFooterComponent) => { this.refFooterComponent = refFooterComponent; }} />}
                    // onScrollBeginDrag={() => {
                    //     console.log('onScrollBeginDrag');
                    //     this.canAction = true;
                    // }}

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

                    // onScrollEndDrag={() => {
                    //     console.log('onScrollEndDrag');
                    //     this.canAction = false;
                    // }}
                    // onMomentumScrollBegin={() => {
                    //     console.log('onMomentumScrollBegin');
                    //     this.canAction = true;
                    // }}
                    ItemSeparatorComponent={(sectionId, rowId) => <View key={rowId} style={styles.listview_separator} />}
                    data={this.state.dataSource}
                    enableEmptySections={true}
                    keyboardShouldPersistTaps='always'
                    renderItem={({ item, index }) =>
                        <View >
                            <Touchable onPress={this.onItemFriendFlightClick.bind(this, item)}>

                                <View style={styles.item_friend_flight_container}>
                                    <View style={styles.item_friend_flight}>
                                        <Text allowFontScaling={global.isScaleFont} style={styles.flight_name} numberOfLines={1}>{item.getFlightName()}</Text>
                                        <Text allowFontScaling={global.isScaleFont} style={styles.flight_time} numberOfLines={1}>{this.getUtils().relativeDate(item.getDatePlayedTimestamp())}</Text>
                                    </View>
                                    <FriendFlightItem friend_flight={item} />
                                    <LikeCommentHomeView
                                        ref={(refLikeCommentHomeView) => { this.refLikeComment[index] = refLikeCommentHomeView }}
                                        onCommentClick={this.onCommentClick.bind(this, item, index)}
                                        postStatus={item.getPostStatus()}
                                        flight_id={item.getId()}
                                        showImgComment={true}
                                        onViewInteractUserPress={this.onViewInteractUserPress.bind(this, item.getId())}
                                        likeCallback={this.onLikeCallback.bind(this, item)} />
                                </View>
                            </Touchable>
                        </View>
                    }
                />

                <EmptyDataView
                    ref={(emptyFriendView) => { this.emptyFriendView = emptyFriendView; }}
                // customStyle={{ paddingTop: this.home_page_scroll_padding_top }}
                />
                <PopupUpgradeVip
                    ref={(popupUpdateVip) => { this.popupUpdateVip = popupUpdateVip; }}
                    onConfirmClick={this.onConfirmUpgrade} />
                {this.renderInternalLoading()}
                {this.renderLoading()}
                {this.renderMessageBar()}
            </View>
        );
    }

    componentDidMount() {
        this.addListenerBackHandler();
        this.checkInternet();
        // this.checkLoadData();
        // InteractionManager.runAfterInteractions(() => {
        //     this.setTabChange();
        // })
    }

    componentWillUnmount() {
        // this.unregisterMessageBar();
        this.removeListenerBackHandler();
    }

    checkInternet() {
        NetInfo.getConnectionInfo().then((connectionInfo) => {
            if (connectionInfo.type != 'none' && connectionInfo.type != 'unknown') {
                this.isOnNetwork = true;
                this.requestFriendFlightList();
                queryFriendFlightLimited()
                    .then(listData => {
                        if (listData.length > 0) {
                            for (let round of listData) {
                                let obj = new FlightSummaryModel();
                                obj.parseData(JSON.parse(round.jsonData));
                                this.rounds.push(obj);
                            }

                            this.rounds = this.rounds.sort((f1, f2) => {
                                return f2.date_played_timestamp - f1.date_played_timestamp;
                            });
                            this.setState({
                                dataSource: this.rounds
                            }, () => {
                                // this.requestFriendFlightList();
                                this.maxFlightId = this.rounds.reduce(this.getAppUtil().getMaxReducer, this.rounds[0].id);
                                this.saveFlightId(this.maxFlightId.toString());

                                if (listData.length > 100) {
                                    let sliceList = listData.slice(100, listData.length);
                                    deleteFriendFlightArray(sliceList);
                                }

                            })
                        } else {
                            // this.requestFriendFlightList();
                        }
                    })
                    .catch(error => {
                        console.log('queryFriendFlight.error', error);
                        // this.requestFriendFlightList();

                    });
            } else {
                this.isOnNetwork = false;
                this.loadCacheData();
            }

        });
    }

    // setTabChange(offset) {
    //     console.log('Screen1.setChange')
    //     if (this.refFlatList)
    //         this.refFlatList.scrollToOffset({ offset: verticalScale(110), animated: true });
    // }

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

    loadCacheData() {
        this.showLoading();
        queryFriendFlight()
            .then(listData => {
                if (listData.length > 0) {
                    let rounds = [];
                    // console.log('queryFinishFlight.lodash', lodash)
                    listData.map((round) => {
                        // console.log('queryFinishFlight.round.jsonData', round.jsonData);
                        let obj = new FlightSummaryModel();
                        obj.parseData(JSON.parse(round.jsonData));
                        rounds.push(obj);
                    })
                    rounds = rounds.sort((f1, f2) => {
                        return f2.date_played_timestamp - f1.date_played_timestamp;
                    });
                    this.lodashData = _.chunk(rounds, NUMBER_PAGING);
                    // console.log('queryFinishFlight.lodashData', this.lodashData.length);
                    this.friendFlightList = this.lodashData[this.page];

                    this.shouldUpdate = true;
                    this.setState({
                        dataSource: this.friendFlightList//this.state.dataSource.cloneWithRows(this.friendFlightList)
                    }, () => {
                        this.maxFlightId = rounds.reduce(this.getAppUtil().getMaxReducer, rounds[0].id);
                        this.minFlightId = rounds.reduce(this.getAppUtil().getMinReducer, rounds[0].id);
                        this.Logger().log('this.maxFlightId', this.maxFlightId);
                        this.Logger().log('this.minFlightId', this.minFlightId);
                        this.saveFlightId(this.maxFlightId.toString());
                        // if (listData.length > 100) {
                        //     let sliceList = listData.slice(100, listData.length);
                        //     deleteFriendFlightArray(sliceList);
                        // }
                        // if (this.maxFlightId) {
                        //     this.requestNewFriendFlightList(true);
                        // }

                    })
                } else {
                    // this.friendFlightPage = 1;
                    // this.requestFriendFlightList();

                }
                this.hideLoading();
            })
            .catch(error => {
                console.log('queryFriendFlight.error', error);
                this.hideLoading();
                // this.friendFlightPage = 1;
                // this.requestFriendFlightList();

            });

    }

    loadMoreFriendFlight() {
        // if (!this.canAction) return;
        // this.canAction = false;
        if (this.isOnNetwork) {
            this.friendFlightPage++;
            this.requestFriendFlightList();
        } else {
            if (this.page < this.lodashData.length - 1) {
                if (this.refFooterComponent) {
                    this.refFooterComponent.setLoadingState(true);
                }
                this.page++;
                this.friendFlightList = [...this.friendFlightList, ...this.lodashData[this.page]];
                this.shouldUpdate = true;
                this.setState({
                    dataSource: this.friendFlightList//this.state.dataSource.cloneWithRows(this.friendFlightList)
                }, () => {
                    if (this.refFooterComponent) {
                        this.refFooterComponent.setLoadingState(false);
                    }
                })
            }
            //  else if (this.minFlightId) {
            //     this.requestNewFriendFlightList();
            // }
        }

    }

    requestNewFriendFlightList(isNew = false) {
        if (isNew) {
            this.showLoading();
        } else {
            if (this.refFooterComponent) {
                this.refFooterComponent.setLoadingState(true);
            }
        }

        let url = this.getConfig().getBaseUrl() + ApiService.list_friends_flight_for_cache(isNew ? this.maxFlightId : this.minFlightId, isNew);
        let self = this;
        console.log('.......................url', url);
        Networking.httpRequestGet(url, (jsonData) => {
            self.hideLoading();
            if (self.refFooterComponent) {
                self.refFooterComponent.setLoadingState(false);
            }
            self.model = new FriendFlightModel(self);
            self.model.parseData(jsonData);
            if (self.model.getErrorCode() === 0) {
                let newFlightData = self.model.getFriendFlightList();
                let listRemove = self.model.getListRemove();

                if (listRemove.length > 0 && isNew) {
                    deleteFriendFlightArrayId(listRemove)
                        .then(() => {
                            insertFriendFlight(newFlightData)
                                .then(() => {
                                    self.mergeDataFlight(isNew);
                                }).catch(() => {
                                    self.mergeDataFlight(isNew);
                                });
                        })
                        .catch(() => {
                            insertFriendFlight(newFlightData)
                                .then(() => {
                                    self.mergeDataFlight(isNew);
                                }).catch(() => {
                                    self.mergeDataFlight(isNew);
                                });
                        })
                } else if (newFlightData.length > 0) {
                    insertFriendFlight(newFlightData).then(() => {
                        self.mergeDataFlight(isNew);
                    }).catch(() => {
                        self.mergeDataFlight(isNew);
                    });
                }

            }
        }, () => {
            //time out
            self.hideLoading();
            if (self.refFooterComponent) {
                self.refFooterComponent.setLoadingState(false);
            }
        });
    }

    requestFriendFlightList() {
        this.isloading = true;
        // this.showLoading();
        let url = this.getConfig().getBaseUrl() + ApiService.list_friends_flight(this.friendFlightPage);
        let self = this;
        console.log('url', url);
        Networking.httpRequestGet(url, this.onResponseFriendFlightList.bind(this), () => {
            //time out
            if (self.friendFlightPage > 1) {
                self.friendFlightPage--;
            } else if (this.rounds.length === 0) {
                self.emptyFriendView.showEmptyView();
                self.friendFlightList = [];
                self.friendFlightPage = 1;
            }

            self.isloading = false;
            self.hideLoading();

        });
    }

    onResponseFriendFlightList(jsonData) {
        //this.loading.hideLoading();
        this.hideLoading();
        this.isloading = false;
        this.model = new FriendFlightModel(this);
        this.model.parseData(jsonData);
        if (this.model.getErrorCode() === 0) {
            let newFlightData = this.model.getFriendFlightList();

            if (newFlightData.length > 0) {
                this.friendFlightList = [...this.friendFlightList, ...newFlightData];

                this.friendFlightList = this.friendFlightList.sort((f1, f2) => {
                    return f2.date_played_timestamp - f1.date_played_timestamp;
                });

                this.shouldUpdate = true;
                this.setState({
                    dataSource: this.friendFlightList//ds.cloneWithRows(this.friendFlightList)
                }, () => {
                    this.friendFlightPage++;
                    this.maxFlightId = newFlightData.reduce(this.getAppUtil().getMaxReducer, newFlightData[0].id);
                    this.saveFlightId(this.maxFlightId.toString());
                    insertFriendFlight(newFlightData);
                    this.emptyFriendView.hideEmptyView();
                });

            } else {
                if (this.friendFlightPage === 1) {
                    this.emptyFriendView.showEmptyView();
                } else {
                    this.emptyFriendView.hideEmptyView();
                }
                this.friendFlightPage = 0;
                if (this.refFooterComponent) {
                    this.refFooterComponent.setLoadingState(false);
                }
            }


        } else {
            if (this.friendFlightPage > 1) {
                this.friendFlightPage--;
                this.showErrorMsg(this.model.getErrorMsg());
            }
        }
    }

    setListFriendFlight(friendFlightList, newFlightData) {
        // let ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
        this.shouldUpdate = true;
        this.setState({
            dataSource: this.friendFlightList//ds.cloneWithRows(this.friendFlightList)
        }, () => {
            this.friendFlightPage++;
            this.maxFlightId = newFlightData.reduce(this.getAppUtil().getMaxReducer, newFlightData[0].id);
            this.minFlightId = newFlightData.reduce(this.getAppUtil().getMinReducer, newFlightData[0].id);
            this.Logger().log('setListFriendFlight.maxFlightId', this.maxFlightId);
            this.Logger().log('setListFriendFlight.minFlightId', this.minFlightId);
            this.saveFlightId(this.maxFlightId.toString());
            insertFriendFlight(newFlightData);
        });
    }

    refreshFriendList() {
        if (this.isloading) return;

        NetInfo.getConnectionInfo().then((connectionInfo) => {
            if (connectionInfo.type != 'none' && connectionInfo.type != 'unknown') {
                this.isOnNetwork = true;
                this.friendFlightPage = 1;
                this.showLoading();
                this.requestFriendFlightList();
            }
        });
        // this.requestNewFriendFlightList(true);
    }

    mergeDataFlight(isNew = true) {
        queryFriendFlight()
            .then(listData => {
                // console.log('queryFinishFlight.done');
                if (listData.length > 0) {
                    let rounds = [];
                    // console.log('queryFinishFlight.lodash', lodash)
                    listData.map((round) => {
                        // console.log('queryFinishFlight.round.jsonData', round.jsonData);
                        let obj = new FlightSummaryModel();
                        obj.parseData(JSON.parse(round.jsonData));
                        rounds.push(obj);
                    })
                    rounds = rounds.sort((f1, f2) => {
                        return f2.date_played_timestamp - f1.date_played_timestamp;
                    });
                    this.lodashData = _.chunk(rounds, NUMBER_PAGING);
                    // console.log('queryFinishFlight.lodashData', this.lodashData.length);
                    this.page = isNew ? 0 : this.page;
                    if (this.page < this.lodashData.length) {
                        this.friendFlightList = [];
                        for (let i = 0; i <= this.page; i++) {
                            this.friendFlightList = [...this.friendFlightList, ...this.lodashData[i]];
                        }

                    } else {
                        this.page = 0;
                        this.friendFlightList = this.lodashData[this.page];
                    }


                    this.friendFlightList = this.friendFlightList.sort((f1, f2) => {
                        return f2.date_played_timestamp - f1.date_played_timestamp;
                    });
                    this.shouldUpdate = true;
                    this.setState({
                        dataSource: this.friendFlightList//this.state.dataSource.cloneWithRows(this.friendFlightList)
                    }, () => {
                        this.maxFlightId = rounds.reduce(this.getAppUtil().getMaxReducer, rounds[0].id);
                        this.minFlightId = rounds.reduce(this.getAppUtil().getMinReducer, rounds[0].id);
                        this.Logger().log('this.maxFlightId', this.maxFlightId);
                        this.Logger().log('this.minFlightId', this.minFlightId);
                        this.saveFlightId(this.maxFlightId.toString());


                    })
                }
                this.hideLoading();
            })
            .catch(error => {
                console.log('queryFriendFlight.error', error);
                this.hideLoading();

            });
    }

    onItemFriendFlightClick(flight) {
        // if (this.props.onItemFriendFlightClick) {
        //     this.props.onItemFriendFlightClick(flight);
        // }
        this.onOpenScorecard(flight.getId());
    }

    onOpenScorecard(flightId) {
        let navigation = StaticProps.getAppSceneNavigator();
        if (this.loading) {
            this.loading.showLoading();
        }
        let url = this.getConfig().getBaseUrl() + ApiService.view_flight_detail(flightId);
        console.log('url', url);
        let self = this;
        Networking.httpRequestGet(url, (jsonData) => {
            if (self.loading) {
                self.loading.hideLoading();
            }
            try {
                self.model = new FlightDetailModel(self);
                self.model.parseData(jsonData);
                if (self.model.getErrorCode() === 0) {
                    navigation.navigate('scorecard_view', { onCloseScorecard: self.onFriendCloseScorecardListener, 'FlightDetailModel': self.model });
                } else {
                    self.showErrorMsg(self.model.getErrorMsg())
                }
            } catch (error) {
                console.log('error', error);
            }
        }, () => {
            //time out
            if (self.loading) {
                self.loading.hideLoading();
            }
            self.showErrorMsg(self.t('time_out'));
        });
    }

    onFriendCloseScorecardListener() {
        this.rotateToPortrait();
    }

    saveFlightId(flightId) {
        DataManager.saveSingleLocalData(Constant.CACHE.MAX_FRIEND_FLIGHT_ID, flightId, (error) => {
            console.log('saveLocalFlightId.error', error)
        });
    }

    onCommentClick(flight, itemId) {
        if (global.isVipAccount) {
            let navigation = StaticProps.getAppSceneNavigator();
            if (navigation) {
                navigation.navigate('comment_flight_view',
                    {
                        onCommentBack: this.onCommentBackListener.bind(this, itemId),
                        'flight': flight
                    });
            }
        } else {
            this.popupUpdateVip.show();
        }

    }

    onUpgradeCallback(isSuccess = false) {
        if (isSuccess) {
            this.isVip = 1;
            this.setState({})
        }
    }

    onConfirmUpgrade() {
        let navigation = StaticProps.getAppSceneNavigator();
        if (navigation) {
            navigation.navigate('benefits_vip_member',
                {
                    onUpgradeCallback: this.onUpgradeCallback.bind(this),
                });
        }
    }

    onCommentBackListener(itemId, flight) {
        updateFlight(flight);
        let total_feel = flight.getPostStatus();
        let type = flight.getUserStatus();
        if (this.refLikeComment[itemId]) {
            this.refLikeComment[itemId].setStatus({ total_feel, type })
        }
        this.friendFlightList[itemId] = flight;
    }

    onViewInteractUserPress(flightId) {
        // if (this.props.onViewInteractUserPress) {
        //     this.props.onViewInteractUserPress(flightId);
        // }
        let navigation = StaticProps.getAppSceneNavigator();
        if (navigation) {
            navigation.navigate('interactive_tab_view', {
                'flightId': flightId,
                'uid': this.uid,
                'statusType': 1
            })
        }
    }

    onLikeCallback(flight, { total_feel, type }) {
        flight.setPostStatus(total_feel);
        flight.setUserStatus(type);
        updateFlight(flight);
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    listview_separator: {
        flex: 1,
        height: scale(4),
        backgroundColor: '#E3E3E3',
    },
    item_friend_flight_container: {
        flex: 1,
        paddingTop: verticalScale(10)
    },
    item_friend_flight: {
        flex: 1,
        flexDirection: 'row',
        height: verticalScale(30),
        justifyContent: 'space-between',
        marginLeft: scale(5),
        marginRight: scale(5)
    },
    flight_name: {
        flex: 3,
        color: '#1A1A1A',
        fontSize: fontSize(13),
        textAlignVertical: 'center'
    },
    flight_time: {
        flex: 1,
        color: '#B8B8B8',
        fontSize: fontSize(11, -3),
        textAlignVertical: 'center',
        textAlign: 'right'
    }
});