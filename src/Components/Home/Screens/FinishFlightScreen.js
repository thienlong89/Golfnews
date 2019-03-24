import React from 'react';
import {
    Platform,
    StyleSheet,
    Text,
    View,
    ListView,
    RefreshControl,
    AppState,
    FlatList,
    Dimensions,
    BackHandler,
    Animated,
    InteractionManager,
    NetInfo
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
import {
    insertFinishFlight,
    queryFinishFlight,
    updateFlight,
    deleteFinishFlightArray,
    deleteFinishFlightArrayId,
    deleteFlightById,
    queryFinishFlightLimited
} from '../../../DbLocal/FinishFlightRealm';
import { deleteFriendFlightArrayId } from '../../../DbLocal/FriendFlightRealm';
import _ from 'lodash';
import DataManager from '../../../Core/Manager/DataManager';
import Constant from '../../../Constant/Constant';
import LikeCommentHomeView from '../../Common/LikeCommentHomeView';
import { scale, fontSize, verticalScale } from '../../../Config/RatioScale';
import StaticProps from '../../../Constant/PropsStatic';
import HeaderScreen from './HeaderScreen';
import FlightDetailModel from '../../../Model/CreateFlight/Flight/FlightDetailModel';
import PopupYesOrNo from '../../Popups/PopupPaymentView';
import FooterComponent from '../Item/FooterComponent';
// import { OptimizedFlatList } from 'react-native-optimized-flatlist'
import BaseComponentAddBackHandler from '../../../Core/View/BaseComponentAddBackHandler';
import PopupUpgradeVip from '../../Common/PopupUpgradeVip';

let { width } = Dimensions.get('window');
let line_w = 2 * width / 3;

const NUMBER_PAGING = 10;

export default class FinishFlightView extends BaseComponentAddBackHandler {


    constructor(props) {
        super(props);
        this.userProfile = this.getUserInfo().getUserProfile();
        this.uid = this.getUserInfo().getId();
        this.refreshFinishedFlightList = this.refreshFinishedFlightList.bind(this);
        this.loadMoreFinishFlight = this.loadMoreFinishFlight.bind(this);

        this.flightDeleted;
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
        this.isOnNetwork = true;
        this.state = {
            refreshing: false,
            dataSource: this.finishFlightList,
            scrollY: this.props.scrollY
        }

        let { screenProps } = this.props;
        if (screenProps) {
            this.scroll = screenProps.scroll;
        } else {
            this.scroll = null;
        }

        this.onFlatlistScroll = this.onFlatlistScroll.bind(this);
        this.flatListOffset = 0;

        this.onEnterScoreListener = this.onEnterScoreListener.bind(this);
        this.onCloseScorecardListener = this.onCloseScorecardListener.bind(this);
        this.onItemFinishFlightClick = this.onItemFinishFlightClick.bind(this);
        this.onConfirmUpgrade = this.onConfirmUpgrade.bind(this);
        // this.props.navigation.addListener('didFocus', this._handleStateChange.bind(this));
        // this.props.navigation.addListener('didBlur', this._handleDidBlur.bind(this));
    }

    _handleStateChange = state => {
        console.log('FinishFlightView._onNavigatorEvent');
        // this.setChange();
    };

    _handleDidBlur() {
        console.log('FinishFlightView._handleDidBlur');
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

    // shouldComponentUpdate(){
    //     return false;
    // }

    render() {
        console.log('FinishFlightView.render------------------------------------------------');
        this.shouldUpdate = false;
        let { refreshing, dataSource } = this.state;

        return (
            <View style={styles.container}>
                {/* <Animated.View style={{ transform: [{ translateY: this.props.tabY }], zIndex: 2, position: 'absolute', top: this.home_page_title_padding_top, backgroundColor: '#fff' }}> */}
                <HeaderScreen ref={(headerScreen) => { this.headerScreen = headerScreen; }} title={this.t('finish_flight').toUpperCase()} color={'red'} />
                {/* </Animated.View> */}
                <FlatList
                    ref={(refFlatList) => { this.refFlatList = refFlatList; }}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={this.refreshFinishedFlightList}
                        />
                    }
                    removeClippedSubviews={true}
                    onEndReached={this.loadMoreFinishFlight}
                    onEndReachedThreshold={0.2}
                    initialNumToRender={5}
                    ItemSeparatorComponent={(sectionId, rowId) => <View key={rowId} style={styles.listview_separator} />}
                    data={dataSource}
                    enableEmptySections={true}
                    ListFooterComponent={() => <FooterComponent ref={(refFooterComponent) => { this.refFooterComponent = refFooterComponent; }} />}
                    keyboardShouldPersistTaps='always'
                    // onScrollBeginDrag={() => {
                    //     console.log('onScrollBeginDrag');
                    //     // this.canAction = true;
                    // }}
                    // onScrollEndDrag={() => {
                    //     console.log('onScrollEndDrag');
                    //     // this.canAction = false;
                    // }}
                    // onMomentumScrollBegin={() => {
                    //     console.log('onMomentumScrollBegin');
                    //     // this.canAction = true;
                    // }}
                    // onMomentumScrollEnd={() => {
                    //     console.log('onMomentumScrollEnd');
                    //     // this.canAction = false;
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
                    scrollEventThrottle={16}
                    // getItemLayout={(data, index) => {
                    //     return {
                    //         length: 70,
                    //         offset: 70 * index,
                    //         index
                    //     }
                    // }}
                    keyExtractor={item => item.getFlight().getId()}
                    renderItem={({ item, index }) =>
                        // <Touchable onPress={this.onItemFinishFlightClick.bind(this, item)}>
                        <View>
                            <FinishedFlightItem
                                finishedFlight={item}
                                onViewDetailClick={this.onItemFinishFlightClick}
                                onDeleteFlight={this.onDeleteFlightClick.bind(this, item)} />
                            <LikeCommentHomeView
                                ref={(refLikeCommentHomeView) => { this.refLikeComment[index] = refLikeCommentHomeView }}
                                onCommentClick={this.onCommentClick.bind(this, item, index)}
                                flight_id={item.getFlight().getId()}
                                postStatus={item.getPostStatus()}
                                isDisable={item.getType().indexOf('unfinished') >= 0}
                                bgColor={(item.getType().indexOf('unfinished') >= 0) ? '#F5F5FA' : '#FFFFFF'}
                                onViewInteractUserPress={this.onViewInteractUserPress.bind(this, item.getFlight().getId())}
                                likeCallback={this.onLikeCallback.bind(this, item)}
                                showImgComment={true}
                                data={item}
                                onOpenOtherPress={this.onItemFinishFlightClick} />
                        </View>

                        // </Touchable>
                    }
                // contentContainerStyle={{ paddingTop: this.home_page_scroll_padding_top }}
                />
                <EmptyDataView
                    ref={(emptyFinishView) => { this.emptyFinishView = emptyFinishView; }}
                />

                <LoadingView ref={(loading2) => { this.loading2 = loading2; }}
                    isShowOverlay={false}
                />
                <PopupYesOrNo
                    ref={(popupDeleteFlight) => { this.popupDeleteFlight = popupDeleteFlight; }} />

                <PopupUpgradeVip
                    ref={(popupUpdateVip) => { this.popupUpdateVip = popupUpdateVip; }}
                    onConfirmClick={this.onConfirmUpgrade} />
                {this.renderLoading()}
                {this.renderMessageBar()}
            </View>
        );
    }

    // shouldComponentUpdate(nextProps, nextState){
    //     return this.shouldUpdate;
    // }

    // setTabChange(offset) {
    //     console.log('Screen1.setChange')
    //     if (this.refFlatList)
    //         this.refFlatList.scrollToOffset({ offset: verticalScale(110), animated: true });
    // }

    showLoading() {
        if (this.loading) {
            this.loading.showLoading();
        }
    }

    hideLoading() {
        if (this.loading) {
            this.loading.hideLoading();
        }
    }

    componentDidMount() {
        // console.log('FinishFlightView.componentDidMount');
        this.popupDeleteFlight.setMsg(this.t('delete_flight_content'));
        this.popupDeleteFlight.okCallback = this.onConfirmDeleteFlight.bind(this);
        this.disableLoading = true;

        this.addListenerBackHandler(true);
        // this.refreshFinishedFlightList();
        // queryFinishFlight()
        //     .then(({ listData, unFinishCount }) => {

        //         if (listData.length > 0) {
        //             // console.log('queryFinishFlight.lodash', lodash)
        //             listData.map((round) => {
        //                 let obj = new RoundItemModel();
        //                 obj.parseData(JSON.parse(round.jsonData));
        //                 this.allRound.push(obj);
        //             })
        //             // console.log('queryFinishFlight.rounds', rounds);
        //             this.lodashData = _.chunk(this.allRound, NUMBER_PAGING);
        //             console.log('queryFinishFlight.lodashData', this.lodashData.length);
        //             this.finishFlightList = this.lodashData[this.page];
        //             this.shouldUpdate = true;
        //             this.setState({
        //                 dataSource: this.finishFlightList
        //             }, () => {
        //                 this.maxFlightId = this.allRound.reduce(this.getAppUtil().getMaxRoundReducer, this.allRound[0].Flight.id);
        //                 this.minFlightId = this.allRound[this.allRound.length - 1].Flight.date_played_timestamp;
        //                 console.log('this.maxFlightId', this.maxFlightId);
        //                 console.log('this.minFlightIdsss', this.minFlightId);
        //                 this.saveMaxFlightId(this.maxFlightId.toString());
        //                 console.log('............................. unfinish count : ', unFinishCount);
        //                 this.updateCounter(unFinishCount);
        //                 if (listData.length > 100) {
        //                     let sliceList = listData.slice(100, listData.length);
        //                     deleteFinishFlightArray(sliceList);
        //                 }
        //                 this.refreshFinishedFlightList(true);
        //             })
        //         } else {
        //             this.requestFinishFlightList();
        //         }
        //     })
        //     .catch(error => {
        //         console.log('queryFinishFlight.error', error);
        //         this.requestFinishFlightList();
        //     });
        // if (!global.flightIdRefresh) {
        //     this.syncFinishFlightList();
        // } else {
        // this.checkInternet();
        // }
        this.checkInternet();

        console.log('global.shouldUpdateFinishFlight', global.shouldUpdateFinishFlight, global.flightIdRefresh)


        // InteractionManager.runAfterInteractions(() => {
        //     this.setTabChange();
        // })
    }

    componentWillUnmount() {
        // this.unregisterMessageBar();
        // this.removeListenerBackHandler();
    }

    checkInternet() {
        NetInfo.getConnectionInfo().then((connectionInfo) => {
            if (connectionInfo.type != 'none' && connectionInfo.type != 'unknown') {
                this.isOnNetwork = true;
                if (this.refFooterComponent) {
                    this.refFooterComponent.setLoadingState(true);
                }
                this.requestFinishFlightList();
                queryFinishFlightLimited()
                    .then(({ listData, unFinishCount }) => {

                        if (listData.length > 0) {
                            // console.log('queryFinishFlight.lodash', lodash)
                            // listData.map((round) => {
                            //     let obj = new RoundItemModel();
                            //     obj.parseData(JSON.parse(round.jsonData));
                            //     this.allRound.push(obj);
                            // })
                            for (let round of listData) {
                                let obj = new RoundItemModel();
                                obj.parseData(JSON.parse(round.jsonData));
                                this.allRound.push(obj);
                            }

                            this.setState({
                                dataSource: this.allRound
                            }, () => {
                                // this.requestFinishFlightList();
                                this.maxFlightId = this.allRound.reduce(this.getAppUtil().getMaxRoundReducer, this.allRound[0].Flight.id);
                                this.saveMaxFlightId(this.maxFlightId.toString());
                                console.log('............................. unfinish count : ', unFinishCount);
                                this.updateCounter(unFinishCount);
                                if (listData.length > 100) {
                                    let sliceList = listData.slice(100, listData.length);
                                    deleteFinishFlightArray(sliceList);
                                }
                            })
                        } else {
                            // this.requestFinishFlightList();
                        }
                    })
                    .catch(error => {
                        console.log('queryFinishFlight.error', error);
                        // this.requestFinishFlightList();
                    });
            } else {
                this.isOnNetwork = false;
                this.loadCacheData();
            }

        });
    }

    loadCacheData() {
        queryFinishFlight()
            .then(({ listData, unFinishCount }) => {

                if (listData.length > 0) {
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
                        console.log('............................. unfinish count : ', unFinishCount);
                        this.updateCounter(unFinishCount);
                        // if (listData.length > 100) {
                        //     let sliceList = listData.slice(100, listData.length);
                        //     deleteFinishFlightArray(sliceList);
                        // }
                        // this.refreshFinishedFlightList(true);
                    })
                } else {
                    // this.requestFinishFlightList();
                }
            })
            .catch(error => {
                console.log('queryFinishFlight.error', error);
                // this.requestFinishFlightList();
            });
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
                    let index = this.finishFlightList.findIndex((roundFlight, index) => {
                        return round.flight_id === roundFlight.flight_id;
                    });
                    console.log('syncFinishFlightList.index', index)
                    if (index != -1) {
                        this.finishFlightList[index] = round;
                        console.log('syncFinishFlightList.round', this.finishFlightList[index])
                        this.setState({
                            dataSource: this.finishFlightList
                        }, () => {
                            updateFlight(round)
                        })
                    }
                    // updateFlight(round)
                    //     .then(() => {
                    //         self.refreshView(true);
                    //     }).catch(() => {
                    //         self.refreshView(true);
                    //     });

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
        // if (this.loading2)
        //     this.loading2.showLoading();
        this.isLoading = true;
        let self = this;
        let url = this.getConfig().getBaseUrl() + ApiService.home_list_all_rounds(this.finishFLightPage);
        console.log('home_list_all_rounds.url', url);
        Networking.httpRequestGet(url, this.onResponseFinishFlightList.bind(this), () => {
            //time out
            self.isLoading = false;
            console.log('home_list_all_rounds.url', self.finishFLightPage, self.allRound.length);
            if (self.finishFLightPage > 1) {
                self.finishFLightPage--;
            } else if (self.emptyFinishView && self.allRound.length === 0) {
                self.emptyFinishView.showEmptyView();
            } else {
                self.emptyFinishView.hideEmptyView();
            }
            if (self.refFooterComponent) {
                self.refFooterComponent.setLoadingState(false);
            }
            if (self.loading2)
                self.loading2.hideLoading();

            self.showErrorMsg(self.t('time_out'));
        });
    }

    onResponseFinishFlightList(jsonData) {
        //this.loading.hideLoading();
        // console.log('onResponseFinishFlightList', jsonData)
        try {
            this.isLoading = false;
            if (this.loading2)
                this.loading2.hideLoading();
            this.model = new FinishFlightModel(this);
            this.model.parseData(jsonData);
        } catch (error) {
            console.log('FinishFlightModel.error', error)
        }

        if (this.model.getErrorCode() === 0) {
            try {
                let newFlightData = this.model.getRoundList();
                if (this.isRefresh || this.finishFLightPage === 1) {
                    this.finishFlightList = [];
                    this.isRefresh = false;
                }

                //them ngay 1-11-2018 copy ra mang allround fix loi tran bi mat khi back tu man hinh nhap diem
                // this.allRound = [...this.finishFlightList];
                //end

                if (newFlightData.length > 0) {
                    this.finishFlightList = [...this.finishFlightList, ...newFlightData];
                    this.setState({
                        dataSource: this.finishFlightList
                    }, () => {
                        this.maxFlightId = newFlightData.reduce(this.getAppUtil().getMaxRoundReducer, this.maxFlightId);
                        this.saveMaxFlightId(this.maxFlightId.toString());
                        this.updateCounter(this.model.getUnfinishCount());
                        insertFinishFlight(newFlightData);
                    })
                } else {
                    if (this.finishFLightPage === 1 && this.allRound && this.allRound.length === 0) {
                        this.emptyFinishView.showEmptyView();
                    } else {
                        this.emptyFinishView.hideEmptyView();
                    }
                    this.finishFLightPage = 0;
                    if (this.refFooterComponent) {
                        this.refFooterComponent.setLoadingState(false);
                    }
                }
                // insertFinishFlight(newFlightData);

                // if (this.finishFlightList.length > 0) {
                //     this.shouldUpdate = true;
                //     this.setState({
                //         dataSource: this.finishFlightList
                //     }, () => {
                //         this.emptyFinishView.hideEmptyView();
                //         this.finishFLightPage++;
                //         this.maxFlightId = newFlightData.reduce(this.getAppUtil().getMaxRoundReducer, this.maxFlightId);
                //         this.saveMaxFlightId(this.maxFlightId.toString());

                //         this.minFlightId = newFlightData[newFlightData.length - 1].Flight.date_played_timestamp;
                //         console.log('onResponseFinishFlightList.minFlightId', this.minFlightId);
                //     })

                // } else {
                //     this.emptyFinishView.showEmptyView();
                //     this.finishFLightPage = 1;
                //     this.shouldUpdate = true;
                //     this.setState({
                //         dataSource: []
                //     })
                // }

            } catch (error) {
                console.log('onResponseFinishFlightList.error', error);
            }
        } else {
            if (!this.finishFlightList.length && this.allRound.length === 0) {
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
        // if (this.loading2)
        //     this.loading2.showLoading();
        let url = this.getConfig().getBaseUrl() + ApiService.list_round_finished_by_date(this.minFlightId);
        let self = this;
        console.log('url', url);
        Networking.httpRequestGet(url, (jsonData) => {
            // if (self.loading2)
            //     self.loading2.hideLoading();
            if (self.refFooterComponent) {
                self.refFooterComponent.setLoadingState(false);
            }

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
            // if (self.loading2)
            //     self.loading2.hideLoading();
            if (self.refFooterComponent) {
                self.refFooterComponent.setLoadingState(false);
            }
        });
    }

    loadMoreFinishFlight() {
        // if (!this.canAction) return;
        // this.canAction = false;
        console.log('loadMoreFinishFlight');
        // if (this.refFooterComponent) {
        //     this.refFooterComponent.setLoadingState(true);
        // }

        if (this.isOnNetwork) {
            if (this.finishFLightPage != 0) {
                this.finishFLightPage++;
                this.requestFinishFlightList();
            }

        } else {
            if (this.page < this.lodashData.length - 1) {
                this.page++;
                console.log('loadMoreFriendFlight', this.page, this.lodashData.length, this.finishFlightList.length);
                this.finishFlightList = [...this.finishFlightList, ...this.lodashData[this.page]];
                console.log('loadMoreFriendFlight2', this.finishFlightList.length);
                this.shouldUpdate = true;
                this.setState({
                    dataSource: this.finishFlightList //this.state.dataSource.cloneWithRows(this.finishFlightList)
                }, () => {
                    if (this.page === this.lodashData.length - 1) {
                        if (this.refFooterComponent)
                            this.refFooterComponent.setLoadingState(false);
                    }

                })
            }
            //  else if (this.minFlightId) {
            //     this.requestGetOldFlight();
            // }
        }

    }

    refreshFinishedFlightList() {
        if (this.isLoading)
            return;

        NetInfo.getConnectionInfo().then((connectionInfo) => {
            if (connectionInfo.type != 'none' && connectionInfo.type != 'unknown') {
                console.log('refreshFinishedFlightList')
                this.isOnNetwork = true;
                this.isRefresh = true;
                this.finishFLightPage = 1;
                if (this.loading2)
                    this.loading2.showLoading();
                this.requestFinishFlightList();
            }

        });

        // this.requestNewFinishFlightList(true);
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
        this.userProfile = this.getUserInfo().getUserProfile();
        let navigation = StaticProps.getAppSceneNavigator();
        // if (this.props.onItemFinishFlightClick) {
        //     this.props.onItemFinishFlightClick(flight);
        // }
        if (flight.getFlight() && flight.getFlight().getSource() === 'image' && flight.getType() === 'unfinished') {
            console.log('upload_flight_image', JSON.stringify(flight));
            navigation.navigate('upload_flight_image', { 'RoundItemModel': flight });
        } else {
            this.showLoading();
            let url = this.getConfig().getBaseUrl() + ApiService.view_flight_detail(flight.getFlightId());
            let self = this;
            console.log('url', url);
            Networking.httpRequestGet(url, (jsonData) => {
                // console.log('onItemFriendFlightClick', JSON.stringify(jsonData));
                self.hideLoading();
                try {

                    self.model = new FlightDetailModel(self);
                    self.model.parseData(jsonData);
                    //console.log("view flight : ",self.model.getErrorMsg());
                    if (self.model.getErrorCode() === 0) {
                        let userRounds = self.model.getFlight().getUserRounds();
                        let user = userRounds.find((userRound) => {
                            return userRound.getUserId() === self.userProfile.getId();
                        });
                        if (user && user.getSubmitted() === 1) {
                            self.openScoreView(0, self, self.model);
                        } else {
                            self.openScoreView(1, self, self.model);
                        }
                    } else {
                        self.showErrorMsg(self.model.getErrorMsg());
                    }
                } catch (error) {
                    console.log('onItemFinishFlightClick.error', error)
                }
            }, () => {
                //time out
                self.hideLoading();
                self.showErrorMsg(self.t('time_out'));
            });
        }
    }

    openScoreView(type, self, FlightDetailModel) {
        let navigation = StaticProps.getAppSceneNavigator();

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
            navigation.navigate('scorecard_view',
                {
                    onCloseScorecard: self.onCloseScorecardListener,
                    'FlightDetailModel': FlightDetailModel,
                    'isHostUser': isHostUser
                });
        } else {
            navigation.navigate('enter_flight_score_view',
                {
                    'FlightDetailModel': FlightDetailModel,
                    'isHostUser': isHostUser,
                    onDispatchCallback: self.onEnterScoreListener
                });
        }

    }

    onCloseScorecardListener() {
        this.rotateToPortrait();
        this.syncFinishFlightList();
    }

    onEnterScoreListener() {
        this.syncFinishFlightList();
    }

    onDeleteFlightClick(flight) {
        // if (this.props.onDeleteFlightClick) {
        //     this.props.onDeleteFlightClick(flight);
        // }
        this.flightDeleted = flight;
        this.popupDeleteFlight.show();
    }

    onConfirmDeleteFlight() {
        // this.loading.showLoading();
        let self = this;
        let url = this.getConfig().getBaseUrl() + ApiService.out_flight(this.flightDeleted.getFlightId());
        console.log('url', url, this.flightDeleted.getId());
        Networking.httpRequestGet(url, this.onDeleteFlightResponse.bind(this, this.flightDeleted.getFlightId()), () => {
            //time out
            // self.loading.hideLoading();
            self.showErrorMsg(self.t('time_out'));
        });
    }

    onDeleteFlightResponse(flightId, jsonData) {
        console.log('onDeleteFlightResponse', jsonData);
        // this.loading.hideLoading();
        try {
            let error_code;
            if (jsonData != null && jsonData.hasOwnProperty('error_code')) {
                error_code = jsonData['error_code'];
            }
            if (error_code != null && error_code === 0) {
                if (jsonData.hasOwnProperty("error_msg")) {
                    let error = jsonData['error_msg']; //"Bạn đã ra khỏi flight thành công"
                    this.showSuccessMsg(error);
                }
                deleteFlightById(flightId);
                this.onRemoveFlight(flightId);
            } else {
                if (jsonData.hasOwnProperty("error_msg")) {
                    this.showErrorMsg(jsonData['error_msg']);
                }
            }
        } catch (error) {
            console.log('onDeleteFlightResponse.error', error);
        }
    }

    saveMaxFlightId(flightId) {
        DataManager.saveSingleLocalData(Constant.CACHE.MAX_FINISH_FLIGHT_ID, flightId, (error) => {
            console.log('saveLocalFlightId.error', error)
        });
    }

    updateCounter(count) {
        // if (this.props.updateUnFinishCounter) {
        //     this.props.updateUnFinishCounter(count);
        // }
        if (this.headerScreen) {
            this.headerScreen.updateCount(count);
        }
    }

    onCommentClick(round, itemId) {
        if (global.isVipAccount) {
            let navigation = StaticProps.getAppSceneNavigator();
            if (navigation) {
                navigation.navigate('comment_flight_view',
                    {
                        onCommentBack: this.onCommentBackListener.bind(this, itemId),
                        'flight': round
                    });
            }
        } else {
            this.popupUpdateVip.show();
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

    onUpgradeCallback(isSuccess = false) {
        // if (isSuccess) {
        //     this.setState({})
        // }
    }

    onCommentBackListener(itemId, round) {
        updateFlight(round);
        let total_feel = round.getPostStatus();
        console.log('onCommentBackListener', total_feel)
        let type = round.getUserStatus();
        if (this.refLikeComment[itemId]) {
            this.refLikeComment[itemId].setStatus({ total_feel, type })
        }
        this.finishFlightList[itemId] = round;
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

    onLikeCallback(round, { total_feel, type }) {
        console.log('onLikeCallback1', total_feel, type);
        // total_feel.myStatus
        round.setPostStatus(total_feel);
        round.setUserStatus(type);
        console.log('onLikeCallback2', JSON.stringify(round));
        updateFlight(round);
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
    },
    listview_separator: {
        flex: 1,
        height: scale(4),
        backgroundColor: '#E3E3E3',
    },
});