import React from 'react';
import {
    Platform,
    StyleSheet,
    Text,
    View,
    ListView,
    RefreshControl,
    AppState,
    FlatList
} from 'react-native';
import Touchable from 'react-native-platform-touchable';
import BaseComponent from '../../../Core/View/BaseComponent';
import FinishedFlightItem from '../FinishedFlightItem';
import EmptyDataView from '../../../Core/Common/EmptyDataView';
import FinishFlightModel from '../../../Model/Home/FinishFlightModel';
import RoundItemModel from '../../../Model/Home/RoundItemModel';
import ApiService from '../../../Networking/ApiService';
import Networking from '../../../Networking/Networking';
import LoadingView from '../../../Core/Common/LoadingView';
import { insertFinishFlight, queryFinishFlight, updateFlight, deleteFinishFlightArray, deleteFinishFlightArrayId } from '../../../DbLocal/FinishFlightRealm';
import { deleteFriendFlightArrayId } from '../../../DbLocal/FriendFlightRealm';
import _ from 'lodash';
import DataManager from '../../../Core/Manager/DataManager';
import Constant from '../../../Constant/Constant';
import LikeCommentHomeView from '../../Common/LikeCommentHomeView';
import { scale } from '../../../Config/RatioScale';
import StaticProps from '../../../Constant/PropsStatic';

// var finishFlightList = [];
const NUMBER_PAGING = 10;

export default class FinishFlightView extends BaseComponent {


    constructor(props) {
        super(props);
        this.refreshFinishedFlightList = this.refreshFinishedFlightList.bind(this);
        this.loadMoreFinishFlight = this.loadMoreFinishFlight.bind(this);

        this.shouldUpdate = true;
        this.isLoading = false;
        this.isRefresh = false;
        this.finishFLightPage = 1;
        this.lodashData = [];
        this.page = 0;
        this.maxFlightId = 0;
        this.minFlightId = 0;
        this.allRound = [];
        this.disableLoading = true;
        this.finishFlightList = [];
        this.refLikeComment = [];
        this.state = {
            refreshing: false,
            dataSource: this.finishFlightList//ds.cloneWithRows(this.finishFlightList)
        }

    }

    render() {
        console.log('FinishFlightView.render------------------------------------------------');
        this.shouldUpdate = false;
        let { refreshing, dataSource } = this.state;

        return (
            <View style={styles.container}>

                <FlatList
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={this.refreshFinishedFlightList}
                        />
                    }
                    onEndReached={this.loadMoreFinishFlight}
                    onEndReachedThreshold={0.2}
                    initialNumToRender={3}
                    ItemSeparatorComponent={(sectionId, rowId) => <View key={rowId} style={styles.listview_separator} />}
                    data={dataSource}
                    enableEmptySections={true}
                    keyboardShouldPersistTaps='always'
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
                    // onMomentumScrollEnd={() => {
                    //     console.log('onMomentumScrollEnd');
                    //     this.canAction = false;
                    // }}
                    renderItem={({ item, index }) =>
                        <Touchable onPress={this.onItemFinishFlightClick.bind(this, item)}>
                            <View>
                                <FinishedFlightItem
                                    finishedFlight={item}
                                    onDeleteFlight={this.onDeleteFlightClick.bind(this, item)} />
                                <LikeCommentHomeView
                                    ref={(refLikeCommentHomeView) => { this.refLikeComment[index] = refLikeCommentHomeView }}
                                    onCommentClick={this.onCommentClick.bind(this, item, index)}
                                    flight_id={item.getFlight().getId()}
                                    postStatus={item.getPostStatus()}
                                    bgColor={(item.getType().indexOf('unfinished') >= 0) ? '#F5F5FA' : '#FFFFFF'}
                                    onViewInteractUserPress={this.onViewInteractUserPress.bind(this, item.getFlight().getId())}
                                    likeCallback={this.onLikeCallback.bind(this, item)} />
                            </View>

                        </Touchable>
                    }
                />
                <EmptyDataView
                    ref={(emptyFinishView) => { this.emptyFinishView = emptyFinishView; }}
                />
                <LoadingView ref={(loading2) => { this.loading2 = loading2; }}
                    isShowOverlay={false}
                />
            </View>
        );
    }

    // shouldComponentUpdate(nextProps, nextState){
    //     return this.shouldUpdate;
    // }

    componentDidMount() {
        console.log('FinishFlightView.componentDidMount');
        this.finishFLightPage = 1;
        this.disableLoading = true;
        // this.refreshFinishedFlightList();
        queryFinishFlight()
            .then(({ listData, unFinishCount }) => {

                if (listData.length > 0) {
                    // console.log('queryFinishFlight.listData', listData[0]);
                    // console.log('queryFinishFlight.lodash', lodash)
                    listData.map((round) => {
                        let obj = new RoundItemModel();
                        obj.parseData(JSON.parse(round.jsonData));
                        this.allRound.push(obj);
                    })
                    // console.log('queryFinishFlight.rounds', rounds);
                    this.lodashData = _.chunk(this.allRound, NUMBER_PAGING);
                    console.log('queryFinishFlight.lodashData', this.lodashData.length);
                    this.finishFlightList = this.lodashData[this.page];
                    this.shouldUpdate = true;
                    this.setState({
                        dataSource: this.finishFlightList
                    }, () => {
                        this.maxFlightId = this.allRound.reduce(this.getAppUtil().getMaxRoundReducer, this.allRound[0].Flight.id);
                        this.minFlightId = this.allRound[this.allRound.length - 1].Flight.date_played_timestamp;
                        console.log('this.maxFlightId', this.maxFlightId);
                        console.log('this.minFlightIdsss', this.minFlightId);
                        this.saveMaxFlightId(this.maxFlightId.toString());
                        this.updateCounter(unFinishCount);
                        if (listData.length > 100) {
                            let sliceList = listData.slice(100, listData.length);
                            deleteFinishFlightArray(sliceList);
                        }
                        this.refreshFinishedFlightList(true);
                    })
                } else {
                    this.requestFinishFlightList();
                }
            })
            .catch(error => {
                console.log('queryFinishFlight.error', error);
                this.requestFinishFlightList();
            });

        console.log('global.shouldUpdateFinishFlight', global.shouldUpdateFinishFlight, global.flightIdRefresh)

        this.syncFinishFlightList();

    }

    syncFinishFlightList() {
        if (global.flightIdRefresh != '') {
            let self = this;
            let url = this.getConfig().getBaseUrl() + ApiService.view_details_round_for_cache(global.flightIdRefresh);
            console.log('syncFinishFlightList.url', url)
            Networking.httpRequestGet(url, (jsonData) => {
                console.log('syncFinishFlightList.jsonData', JSON.stringify(jsonData))
                if (jsonData.error_code === 0) {
                    let round = new RoundItemModel();
                    round.parseData(jsonData.data);
                    updateFlight(round)
                        .then(() => {
                            self.refreshView(true);
                        }).catch(() => {
                            self.refreshView(true);
                        });
                    // let index = this.allRound.findIndex((roundItem) => {
                    //     console.log('syncFinishFlightList.id', roundItem.id, round.id)
                    //     return roundItem.id === round.id;
                    // });
                    // console.log('syncFinishFlightList.index', index)
                    // if (index != -1) {
                    //     this.allRound.splice(index, 1, round);
                    // } else {
                    //     this.allRound.unshift(round);
                    // }
                    // try {
                    //     this.allRound = this.allRound.sort((flight1, flight2) => {
                    //         console.log('flight2', flight2)
                    //         return flight2.getFlight().getDate_played_timestamp() - flight1.getFlight().getDate_played_timestamp();
                    //     });
                    //     let unFinish = this.allRound.filter((flight) =>
                    //         flight.getType().indexOf('unfinished') > -1
                    //     )
                    //     let finish = this.allRound.filter((flight) =>
                    //         flight.getType().indexOf('unfinished') <= -1
                    //     )
                    //     this.allRound = [...unFinish, ...finish];
                    //     this.lodashData = _.chunk(this.allRound, NUMBER_PAGING);
                    //     this.page = 0;
                    //     this.finishFlightList = this.lodashData[this.page];
                    //     this.shouldUpdate = true;
                    //     console.log('syncFinishFlightList.finishFlightList', JSON.stringify(this.finishFlightList[0]))
                    //     this.setState({
                    //         dataSource: this.finishFlightList //ds.cloneWithRows(this.finishFlightList)
                    //     }, () => {
                    //         insertFinishFlight([round]);
                    //         this.updateCounter(unFinish.length);
                    //     });
                    // } catch (error) {
                    //     console.log('syncFinishFlightList.error', error)
                    // }

                }

            }, () => {

            });

            global.flightIdRefresh = '';
        }

    }

    requestFinishFlightList() {
        //this.loading.showLoading();
        if (this.isRefresh) {
            this.finishFLightPage = 1;
        }
        if (this.loading2)
            this.loading2.showLoading();
        this.isLoading = true;
        let self = this;
        let url = this.getConfig().getBaseUrl() + ApiService.home_list_all_rounds(this.finishFLightPage);
        console.log('home_list_all_rounds.url', url);
        Networking.httpRequestGet(url, this.onResponseFinishFlightList.bind(this), () => {
            //time out
            self.isLoading = false;
            self.finishFlightList = [];
            self.finishFLightPage = 1;

            if (self.loading2)
                self.loading2.hideLoading();
            self.emptyFinishView.showEmptyView();
            self.showErrorMsg(self.t('time_out'));
        });
    }

    onResponseFinishFlightList(jsonData) {
        //this.loading.hideLoading();
        this.isLoading = false;
        if (this.loading2)
            this.loading2.hideLoading();
        this.model = new FinishFlightModel(this);
        this.model.parseData(jsonData);
        if (this.model.getErrorCode() === 0) {
            let newFlightData = this.model.getRoundList();
            if (this.isRefresh || this.finishFLightPage === 1) {
                this.finishFlightList = [];
                this.isRefresh = false;
            }
            this.finishFlightList = [...this.finishFlightList, ...newFlightData];
            //them ngay 1-11-2018 copy ra mang allround fix loi tran bi mat khi back tu man hinh nhap diem
            this.allRound = [...this.finishFlightList];
            //end
            insertFinishFlight(newFlightData);

            if (this.finishFlightList.length > 0) {
                this.shouldUpdate = true;
                this.setState({
                    dataSource: this.finishFlightList
                }, () => {
                    this.emptyFinishView.hideEmptyView();
                    this.finishFLightPage++;
                    this.maxFlightId = newFlightData.reduce(this.getAppUtil().getMaxRoundReducer, this.maxFlightId);
                    this.saveMaxFlightId(this.maxFlightId.toString());

                    this.minFlightId = newFlightData[newFlightData.length - 1].Flight.date_played_timestamp; //newFlightData.reduce(this.getAppUtil().getMinRoundReducer, newFlightData[0].Flight.id);
                    console.log('onResponseFinishFlightList.minFlightId', this.minFlightId);
                })

            } else {
                this.emptyFinishView.showEmptyView();
                this.finishFLightPage = 1;
                this.shouldUpdate = true;
                this.setState({
                    dataSource: []
                })
            }
            this.updateCounter(this.model.getUnfinishCount());

        } else {
            if (!this.finishFlightList.length) {
                this.emptyFinishView.showEmptyView();
                this.showErrorMsg(this.model.getErrorMsg());
            }
        }
    }

    requestNewFinishFlightList(isNew = false) {
        if (this.loading2 && !this.disableLoading)
            this.loading2.showLoading();
        this.disableLoading = false;
        let url = this.getConfig().getBaseUrl() + ApiService.home_list_all_rounds_for_cache(isNew ? this.maxFlightId : this.minFlightId, isNew);
        let self = this;
        console.log('url', url);
        Networking.httpRequestGet(url, (jsonData) => {
            if (self.loading2)
                self.loading2.hideLoading();

            self.model = new FinishFlightModel(self);
            self.model.parseData(jsonData);
            if (self.model.getErrorCode() === 0) {
                let newFlightData = self.model.getRoundList();
                let listRemove = self.model.getListRemove();
                console.log('listRemove', listRemove)
                if (listRemove.length > 0 && isNew) {
                    deleteFinishFlightArrayId(listRemove)
                        .then(() => {
                            insertFinishFlight(self.model.getRoundList())
                                .then(() => {
                                    self.refreshView(isNew);
                                }).catch(() => {
                                    self.refreshView(isNew);
                                });
                        })
                        .catch(() => {
                            insertFinishFlight(self.model.getRoundList())
                                .then(() => {
                                    self.refreshView(isNew);
                                }).catch(() => {
                                    self.refreshView(isNew);
                                });
                        })
                    deleteFriendFlightArrayId(listRemove);
                } else if (newFlightData.length > 0) {
                    insertFinishFlight(self.model.getRoundList())
                        .then(() => {
                            self.refreshView(isNew);
                        }).catch(() => {
                            self.refreshView(isNew);
                        });
                }

            }
        }, () => {
            //time out
            if (self.loading2)
                self.loading2.hideLoading();
        });
    }

    refreshView(isNew = true) {
        queryFinishFlight()
            .then(({ listData, unFinishCount }) => {
                console.log('queryFinishFlight.unFinishCount', unFinishCount);
                this.allRound = [];
                this.lodashData = [];
                if (listData.length > 0) {
                    listData.map((round) => {
                        let obj = new RoundItemModel();
                        obj.parseData(JSON.parse(round.jsonData));
                        this.allRound.push(obj);
                    })
                    this.lodashData = _.chunk(this.allRound, NUMBER_PAGING);
                    this.page = isNew ? 0 : this.page;
                    console.log('queryFinishFlight.lodashData', this.page, this.lodashData.length);
                    if (this.page < this.lodashData.length) {
                        this.finishFlightList = [];
                        for (let i = 0; i <= this.page; i++) {
                            this.finishFlightList = [...this.finishFlightList, ...this.lodashData[i]];
                        }
                    } else {
                        this.page = 0;
                        this.finishFlightList = this.lodashData[this.page];
                    }
                    this.shouldUpdate = true;
                    this.setState({
                        dataSource: this.finishFlightList //this.state.dataSource.cloneWithRows(this.finishFlightList)
                    }, () => {
                        this.maxFlightId = this.allRound.reduce(this.getAppUtil().getMaxRoundReducer, this.allRound[0].Flight.id);
                        this.minFlightId = this.allRound[this.allRound.length - 1].Flight.date_played_timestamp;
                        console.log('this.maxFlightId', this.maxFlightId);
                        console.log('this.minFlightIdsss', this.minFlightId);
                        this.saveMaxFlightId(this.maxFlightId.toString());
                        this.updateCounter(unFinishCount);

                    })
                }
            })
            .catch(error => {
                console.log('queryFinishFlight.error', error);

            });

    }


    updateData(isNew, newFlightData) {
        if (isNew) {
            console.log('requestNewFinishFlightList', this.allRound.length)
            let checkDuplicate = this.checkDuplicate(this.allRound, newFlightData);

            let unFinish = checkDuplicate.filter((flight) =>
                flight.getType().indexOf('unfinished') > -1
            )

            try {
                unFinish = unFinish.sort((f1, f2) => {
                    if (f1.getFlight().getDate_played_timestamp() > f2.getFlight().getDate_played_timestamp()) {
                        return -1;
                    }
                    if (f1.getFlight().getDate_played_timestamp() < f2.getFlight().getDate_played_timestamp()) {
                        return 1;
                    }

                    return 0;
                })
            } catch (error) {
                console.log('checkDuplicate.error', error)
            }


            let finish = checkDuplicate.filter((flight) =>
                flight.getType().indexOf('unfinished') <= -1
            );

            finish = finish.sort(function (f1, f2) {
                if (f1.getFlight().getDate_played_timestamp() > f2.getFlight().getDate_played_timestamp()) {
                    return -1;
                }
                if (f1.getFlight().getDate_played_timestamp() < f2.getFlight().getDate_played_timestamp()) {
                    return 1;
                }

                return 0;
            });

            this.allRound = [...unFinish, ...finish];
            this.lodashData = _.chunk(this.allRound, NUMBER_PAGING);
            this.finishFlightList = this.lodashData[this.page];
            this.updateCounter(unFinish.length);
        } else {
            this.finishFlightList = [...this.finishFlightList, ...newFlightData];
        }
        this.shouldUpdate = true;
        this.setState({
            dataSource: this.finishFlightList //this.state.dataSource.cloneWithRows(this.finishFlightList)
        }, () => {
            try {
                // insertFinishFlight(self.model.getRoundList());

                if (isNew) {
                    this.maxFlightId = newFlightData.reduce(this.getAppUtil().getMaxRoundReducer, this.maxFlightId);
                    this.saveMaxFlightId(this.maxFlightId.toString());
                } else {
                    this.minFlightId = newFlightData.reduce(this.getAppUtil().getMinRoundReducer, this.minFlightId);
                }
            } catch (error) {
                console.log('insertFinishFlight.error', error)
            }

        })
    }

    /**
     * check ca tran trung giua 2 mang
     * @param {*} source là các trận trong mảng ban đầu(mảng cũ)
     * @param {*} target là các trận trong mảng mới
     */
    checkDuplicate(source, target) {
        let array = [];
        try {
            let i = 0;
            while (i < source.length) {
                let obj = source[i];
                let flight_id = obj.getFlight().id;
                // this.Logger().log('................................ flight id check ',flight_id);
                let obj_check = target.find(d => d.getFlight().id === flight_id);
                if (obj_check) {
                    array.push(obj_check);
                    target = this.getAppUtil().remove(target, obj_check);
                    // this.Logger().log('...................... tim thay tran trung target con lai ', target.map(d => d.getFlight().id));
                    source.splice(i, 1);
                    // this.Logger().log('.................................array ', array.map(d => d.getFlight().id));
                    // this.Logger().log('.................................soursw ', source.map(d => d.getFlight().id));
                } else {
                    i++;
                }
            }
        } catch (error) {
            console.log('checkDuplicate.error', error)
        }

        //them mang luu cac gia tri de tang hieu nang tim kiem
        // this.Logger().log('.................................sourse ban dau ', source.map(d => d.getFlight().id));

        //tim kiem xong
        return [...source, ...array, ...target];
    }

    requestGetOldFlight() {
        if (this.loading2)
            this.loading2.showLoading();
        let url = this.getConfig().getBaseUrl() + ApiService.list_round_finished_by_date(this.minFlightId);
        let self = this;
        console.log('url', url);
        Networking.httpRequestGet(url, (jsonData) => {
            if (self.loading2)
                self.loading2.hideLoading();

            self.model = new FinishFlightModel(self);
            self.model.parseData(jsonData);
            if (self.model.getErrorCode() === 0) {
                let newFlightData = self.model.getRoundList();
                if (newFlightData.length > 0) {
                    insertFinishFlight(newFlightData)
                        .then(() => {
                            self.refreshView(false);
                        }).catch(() => {
                            self.refreshView(false);
                        });
                }

            }
        }, () => {
            //time out
            if (self.loading2)
                self.loading2.hideLoading();
        });
    }

    loadMoreFinishFlight() {
        if (!this.canAction) return;
        this.canAction = false;
        console.log('loadMoreFinishFlight');
        if (this.page < this.lodashData.length - 1) {
            this.page++;
            console.log('loadMoreFriendFlight', this.page, this.lodashData.length, this.finishFlightList.length);
            this.finishFlightList = [...this.finishFlightList, ...this.lodashData[this.page]];
            console.log('loadMoreFriendFlight2', this.finishFlightList.length);
            this.shouldUpdate = true;
            this.setState({
                dataSource: this.finishFlightList //this.state.dataSource.cloneWithRows(this.finishFlightList)
            })
        } else if (this.minFlightId) {
            this.requestGetOldFlight();
        }
    }

    refreshFinishedFlightList() {
        if (this.isLoading)
            return;
        this.isRefresh = true;
        this.requestNewFinishFlightList(true);
    }

    onRemoveFlight(flightId) {

        let index = this.finishFlightList.findIndex((round) => {
            return flightId === round.flight_id;
        });
        console.log('onRemoveFlight.flightId', flightId, index);
        if (index != -1) {
            this.finishFlightList.splice(index, 1)
        }
        //them ngay 2-11-2018 fix loi chua xoa tran trong allRound
        index = this.allRound.findIndex((round) => {
            return flightId === round.flight_id;
        });
        if (index != -1) {
            this.allRound.splice(index, 1);
        }
        //end

        let unFinish = this.finishFlightList.filter((flight) =>
            flight.getType().indexOf('unfinished') > -1
        );
        //update lai count khi xoa flight
        this.updateCounter(unFinish.length);

        // sua loi xoa item tren dau view ma listview ko update lai
        // let ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
        this.shouldUpdate = true;
        this.setState({
            dataSource: this.finishFlightList //ds.cloneWithRows(this.finishFlightList)
        })
    }

    onItemFinishFlightClick(flight) {
        if (this.props.onItemFinishFlightClick) {
            this.props.onItemFinishFlightClick(flight);
        }
    }

    onDeleteFlightClick(flight) {
        if (this.props.onDeleteFlightClick) {
            this.props.onDeleteFlightClick(flight);
        }
    }

    saveMaxFlightId(flightId) {
        DataManager.saveSingleLocalData(Constant.CACHE.MAX_FINISH_FLIGHT_ID, flightId, (error) => {
            console.log('saveLocalFlightId.error', error)
        });
    }

    updateCounter(count) {
        if (this.props.updateUnFinishCounter) {
            this.props.updateUnFinishCounter(count);
        }
    }

    onCommentClick(round, itemId) {
        // if (this.props.onCommentClick) {
        //     this.props.onCommentClick(round);
        // }
        let navigation = StaticProps.getAppSceneNavigator();
        if (navigation) {
            navigation.navigate('comment_flight_view',
                {
                    onCommentBack: this.onCommentBackListener.bind(this, itemId),
                    'flight': round
                });
        }
    }

    onCommentBackListener(itemId, round) {
        updateFlight(round);
        let total_feel = round.getPostStatus();
        let type = round.getUserStatus();
        if (this.refLikeComment[itemId]) {
            this.refLikeComment[itemId].setStatus({ total_feel, type })
        }
        this.finishFlightList[itemId] = round;
    }

    onViewInteractUserPress(flightId) {
        if (this.props.onViewInteractUserPress) {
            this.props.onViewInteractUserPress(flightId);
        }
    }

    onLikeCallback(round, { total_feel, type }) {
        console.log('onLikeCallback1', JSON.stringify(round));
        round.setPostStatus(total_feel);
        round.setUserStatus(type);
        console.log('onLikeCallback2', JSON.stringify(round));
        updateFlight(round);
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
});