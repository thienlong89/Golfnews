import React from 'react';
import {
    Platform,
    StyleSheet,
    Text,
    View,
    ListView,
    RefreshControl,
    Dimensions,
    FlatList
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
import { insertFriendFlight, queryFriendFlight, deleteFriendFlightArray, updateFlight } from '../../../DbLocal/FriendFlightRealm';
import _ from 'lodash';
import DataManager from '../../../Core/Manager/DataManager';
import Constant from '../../../Constant/Constant';
import LikeCommentHomeView from '../../Common/LikeCommentHomeView';

const NUMBER_PAGING = 10;
export default class FriendFlightView extends BaseComponent {

    constructor(props) {
        super(props);
        this.friendFlightPage = 1;
        this.friendFlightList = [];
        this.page = 0;
        this.lodashData = [];
        this.isloading = false;
        this.maxFlightId = '';
        this.minFlightId = '';
        this.refLikeComment = [];
        this.shouldUpdate = true;
        this.state = {
            refreshing: false,
            dataSource: this.friendFlightList//ds.cloneWithRows(this.friendFlightList)
        }

        this.refreshFriendList = this.refreshFriendList.bind(this);
        this.loadMoreFriendFlight = this.loadMoreFriendFlight.bind(this);
    }

    // shouldComponentUpdate() {
    //     return this.shouldUpdate;
    // }

    render() {
        console.log('FriendFlightView.render');
        this.shouldUpdate = false;

        return (
            <View style={styles.container}>
                <FlatList
                    refreshControl={
                        <RefreshControl
                            refreshing={this.state.refreshing}
                            onRefresh={this.refreshFriendList}
                        />
                    }
                    onEndReached={this.loadMoreFriendFlight}
                    onEndReachedThreshold={0.2}
                    initialNumToRender={3}
                    onScrollBeginDrag={() => {
                        console.log('onScrollBeginDrag');
                        this.canAction = true;
                    }}
                    onScrollEndDrag={() => {
                        console.log('onScrollEndDrag');
                        this.canAction = false;
                    }}
                    onMomentumScrollBegin={() => {
                        console.log('onMomentumScrollBegin');
                        this.canAction = true;
                    }}
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
                                        <Text allowFontScaling={global.isScaleFont} style={styles.flight_time} numberOfLines={1}>{this.getUtils().getFormatAgoTime(item.getDatePlayedTimestamp())}</Text>
                                    </View>
                                    <FriendFlightItem friend_flight={item} />
                                    <LikeCommentHomeView
                                        ref={(refLikeCommentHomeView) => { this.refLikeComment[index] = refLikeCommentHomeView }}
                                        onCommentClick={this.onCommentClick.bind(this, item, index)}
                                        postStatus={item.getPostStatus()}
                                        flight_id={item.getId()}
                                        onViewInteractUserPress={this.onViewInteractUserPress.bind(this, item.getId())}
                                        likeCallback={this.onLikeCallback.bind(this, item)} />
                                </View>
                            </Touchable>
                        </View>
                    }
                />

                <EmptyDataView
                    ref={(emptyFriendView) => { this.emptyFriendView = emptyFriendView; }}
                />
                {this.renderInternalLoading()}
            </View>
        );
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

    checkLoadData() {
        this.showLoading();
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
                    this.friendFlightList = this.lodashData[this.page];

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
                        if (listData.length > 100) {
                            let sliceList = listData.slice(100, listData.length);
                            deleteFriendFlightArray(sliceList);
                        }
                        if (this.maxFlightId) {
                            this.requestNewFriendFlightList(true);
                        }

                    })
                } else {
                    this.friendFlightPage = 1;
                    this.requestFriendFlightList();

                }
                this.hideLoading();
            })
            .catch(error => {
                console.log('queryFriendFlight.error', error);
                this.hideLoading();
                this.friendFlightPage = 1;
                this.requestFriendFlightList();

            });

    }

    loadMoreFriendFlight() {
        if(!this.canAction) return;
        this.canAction = false;
        if (this.page < this.lodashData.length - 1) {
            this.page++;
            this.friendFlightList = [...this.friendFlightList, ...this.lodashData[this.page]];
            this.shouldUpdate = true;
            this.setState({
                dataSource: this.friendFlightList//this.state.dataSource.cloneWithRows(this.friendFlightList)
            })
        } else if (this.minFlightId) {
            this.requestNewFriendFlightList();
        }
    }

    requestNewFriendFlightList(isNew = false) {
        this.showLoading();
        let url = this.getConfig().getBaseUrl() + ApiService.list_friends_flight_for_cache(isNew ? this.maxFlightId : this.minFlightId, isNew);
        let self = this;
        console.log('.......................url', url);
        Networking.httpRequestGet(url, (jsonData) => {
            self.hideLoading();
            self.model = new FriendFlightModel(self);
            self.model.parseData(jsonData);
            if (self.model.getErrorCode() === 0) {
                let newFlightData = self.model.getFriendFlightList();
                // this.Logger().log('............................. newFlightData : ',newFlightData);
                if (newFlightData.length > 0) {
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
        });
    }

    requestFriendFlightList() {
        this.isloading = true;
        this.showLoading();
        let url = this.getConfig().getBaseUrl() + ApiService.list_friends_flight(this.friendFlightPage);
        let self = this;
        console.log('url', url);
        Networking.httpRequestGet(url, this.onResponseFriendFlightList.bind(this), () => {
            //time out
            this.friendFlightList = [];
            this.friendFlightPage = 1;
            // let dataSource = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 })
            // self.setState({
            //     dataSource: this.friendFlightList//dataSource.cloneWithRows(this.friendFlightList)
            // });
            self.isloading = false;
            self.hideLoading();
            self.emptyFriendView.showEmptyView();
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
            this.friendFlightList = [...this.friendFlightList, ...newFlightData];

            this.friendFlightList = this.friendFlightList.sort((f1, f2) => {
                return f2.date_played_timestamp - f1.date_played_timestamp;
            });

            if (this.friendFlightList.length > 0) {
                this.emptyFriendView.hideEmptyView();
                this.setListFriendFlight(this.friendFlightList, newFlightData);

            } else {
                this.emptyFriendView.showEmptyView();
                this.friendFlightPage = -1;
            }
        } else {
            if (!this.friendFlightList.length) {
                this.emptyFriendView.showEmptyView();
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
        this.requestNewFriendFlightList(true);
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
        if (this.props.onItemFriendFlightClick) {
            this.props.onItemFriendFlightClick(flight);
        }
    }

    saveFlightId(flightId) {
        DataManager.saveSingleLocalData(Constant.CACHE.MAX_FRIEND_FLIGHT_ID, flightId, (error) => {
            console.log('saveLocalFlightId.error', error)
        });
    }

    onCommentClick(flight, itemId) {
        // if (this.props.onCommentClick) {
        //     this.props.onCommentClick(flight);
        // }
        this.props.navigation.navigate('comment_flight_view',
            {
                onCommentBack: this.onCommentBackListener.bind(this, itemId),
                'flight': flight
            });
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
        if (this.props.onViewInteractUserPress) {
            this.props.onViewInteractUserPress(flightId);
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
        fontSize: fontSize(14),
        textAlignVertical: 'center'
    },
    flight_time: {
        flex: 1,
        color: '#B8B8B8',
        fontSize: fontSize(12, -2),
        textAlignVertical: 'center',
        textAlign: 'right'
    }
});