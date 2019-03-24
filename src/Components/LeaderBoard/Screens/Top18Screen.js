/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React from 'react';
import {
    Text,
    View,
} from 'react-native';
import Touchable from 'react-native-platform-touchable';
import LeaderBoardModel from '../../../Model/LeaderBoard/LeaderBoardModel';
import styles from '../../../Styles/LeaderBoard/Screens/StyleTopSingleScreen';
import BaseComponent from '../../../Core/View/BaseComponent';
import Networking from '../../../Networking/Networking';
import MyView from '../../../Core/View/MyView';
import LeaderBoardUserItem from '../Items/LeaderBoardUserItem';
import ApiService from '../../../Networking/ApiService';
import LeaderBoardUserItemModel from '../../../Model/LeaderBoard/LeaderBoardUserItemModel';
import LoadingView from '../../../Core/Common/LoadingView';
import ListViewLeaderBoard from '../Items/ListViewLeaderBoard';

// const TAG = "[Vhandicap-v1] Top18Screen : ";

import _ from 'lodash';
import {
    insertTopEighteen,
    queryTopEighteen,
    deleteAllTopEighteen,
} from '../../../DbLocal/Leaderboard/TopEighteenRealm';
import { insertMyRanking, queryMyRanking } from '../../../DbLocal/Leaderboard/MyRankingRealm';
import DataManager from '../../../Core/Manager/DataManager';
import Constant from '../../../Constant/Constant';
import StaticProps from '../../../Constant/PropsStatic';

const NUMBER_PAGING = 20;

export default class Top18Screen extends BaseComponent {
    constructor(props) {
        super(props);
        this.listTop18Users = [];
        this.isSearch = false;
        this.page = 0;
        this.lodashData = [];
        this.isLoadCompleted = false;
        this.state = {
            me: {
            }
        };
    }

    componentDidMount() {
        console.log("back top 18");
        const { screenProps } = this.props;
        this.listViewLeaderBoard.loadMoreCallback = this.onLoadMore.bind(this);
        this.listViewLeaderBoard.itemClickCallback = this.onItemClick.bind(this);
        if (screenProps != null) {
            let parent = screenProps.parent;
            this._parent = parent;
            parent.completeSearchCallback = this.fillDataSearch.bind(this);
            parent.cancelSearchCallback = this.cancelSearch.bind(this);

            parent.callbackStartSearch = this.onStartSearch.bind(this);
            parent.addToListCompleteCallback(Constant.LEADER_BOARD.SCREEN_INDEX.TOP_18, this.fillDataSearch.bind(this));
            parent.addToListCancelCallback(Constant.LEADER_BOARD.SCREEN_INDEX.TOP_18, this.cancelSearch.bind(this));
            parent.addToListStartCallback(Constant.LEADER_BOARD.SCREEN_INDEX.TOP_18, this.onStartSearch.bind(this));

            parent.rank_type = Constant.LEADER_BOARD.RANK_TYPE.TOP_18;
            this.isSearch = screenProps.is_search;
            //parent.clearSearch();
            if (!this.isSearch) {
                this.sendData();
                // this.showLoading();
                // queryTopEighteen()
                //     .then((topEighteenList) => {
                //         if (topEighteenList.length > 0) {
                //             DataManager.loadSingleLocalData(Constant.CACHE.SYNC_INTERVAL_18_TOP, (time) => {
                //                 try {
                //                     let date = (new Date()).getTime();
                //                     let interval = (date - time) / 1000;
                //                     if (time && interval > 60 * 60) {
                //                         this.sendData();

                //                     } else {
                //                         this.parseLocalData(topEighteenList);
                //                     }
                //                 } catch (e) {
                //                     console.log('loadLocalData', e);
                //                     this.parseLocalData(topEighteenList);
                //                 }
                //             }, ()=>{
                //                 this.parseLocalData(topEighteenList);
                //             });
                //             this.hideLoading();
                //         } else {
                //             this.sendData();
                //         }
                //     })
                //     .catch(error => {
                //         console.log('queryFinishFlight.error', error);
                //         this.sendData();
                //     });

                // queryMyRanking().then((data) => {
                //     if (data.length > 0) {
                //         let type = data[0].type;
                //         if (type === Constant.LEADER_BOARD.RANK_TYPE.TOP_18) {
                //             this.setState({
                //                 me: data[0]
                //             })
                //         }
                //     }
                // }).catch(() => { })
            }
        }
    }

    parseLocalData(topEighteenList) {
        let listData = [];
        topEighteenList.map((round) => {
            let item = new LeaderBoardUserItemModel();
            item.paserData(JSON.parse(round.jsonData));
            let obj = {
                userId: item.getUserId(),
                eHandicap_member_id: item.getMemberId(),
                fullname: item.getFullName(),
                avatar: item.getAvatar(),
                handicap: item.getHandicap(),
                ranking: item.getRanking(),
                system_ranking: item.getRankingSystem(),
                system_manners: item.getRankingManners(),
                country_img: item.getCountryImage()
            }
            listData.push(obj);
        })
        this.lodashData = _.chunk(listData, NUMBER_PAGING);
        console.log('queryTopSingle.lodashData', this.lodashData.length);
        this.listTop18Users = this.lodashData[this.page];
        if (this.listTop18Users.length) {
            this.listViewLeaderBoard.setFillData(this.listTop18Users);
        }
    }

    onStartSearch() {
        this.isSearch = true;
        this.listViewLeaderBoard.setFillData([], true);
        this.listViewLeaderBoard.showLoading();
    }

    //khi nguoi choi nhan huy tim kiem
    cancelSearch() {
        this.isSearch = false;
        this.listViewLeaderBoard.setFillData(this.listTop18Users);
    }

    //filldu lieu khi tim kiem
    fillDataSearch(jsonData) {
        // this.isSearch = true;
        this.listViewLeaderBoard.hideLoading();
        if (!this.isSearch) return;
        this.model = new LeaderBoardModel(this);
        this.model.parseData(jsonData);
        var listSearch = [];
        if (this.model.getErrorCode() === 0) {
            for (let item of this.model.getListUsers()) {
                let obj = {
                    userId: item.getUserId(),
                    eHandicap_member_id: item.getMemberId(),
                    fullname: item.getFullName(),
                    avatar: item.getAvatar(),
                    handicap: item.getHandicap(),
                    ranking: item.getRanking(),
                    system_ranking: item.getRankingSystem(),
                    system_manners: item.getRankingManners(),
                    country_img: item.getCountryImage()
                }
                //console.log("push : ", obj);
                listSearch.push(obj);
            }
            this.listViewLeaderBoard.setFillData(listSearch, true);
        }
    }

    showLoading() {
        if (this.loading2) {
            this.loading2.showLoading();
        }
    }

    hideLoading() {
        if (this.loading2) {
            this.loading2.hideLoading();
        }
    }

    sendData() {
        //this._parent.loading.showLoading();
        // this.showLoading();
        let self = this;
        let url = this.getConfig().getBaseUrl() + ApiService.leaderboard_list(Constant.LEADER_BOARD.RANK_TYPE.TOP_18, this.page + 1);
        Networking.httpRequestGet(url, this.onResponse.bind(this), () => {
            // self._parent.loading.hideLoading();
            // self._parent.popupTimeOut.showPopup();
            self.hideLoading();
        });
    }

    onResponse(jsonData) {
        this.hideLoading();
        this.model = new LeaderBoardModel(this);
        this.model.parseData(jsonData);
        if (this.model.getErrorCode() === 0) {
            let dataList = this.model.getListUsers();
            for (let item of dataList) {
                let obj = {
                    userId: item.getUserId(),
                    eHandicap_member_id: item.getMemberId(),
                    fullname: item.getFullName(),
                    avatar: item.getAvatar(),
                    handicap: item.getHandicap(),
                    ranking: item.getRanking(),
                    system_ranking: item.getRankingSystem(),
                    system_manners: item.getRankingManners(),
                    country_img: item.getCountryImage()
                }
                //console.log("push : ", obj);
                this.listTop18Users.push(obj);
            }
            if (this.model.getItemMe()) {
                this.setState({
                    me: {
                        userId: this.model.getItemMe().getUserId(),
                        eHandicap_member_id: this.model.getItemMe().getMemberId(),
                        fullname: this.model.getItemMe().getFullName(),
                        avatar: this.model.getItemMe().getAvatar(),
                        handicap: this.model.getItemMe().getHandicap(),
                        ranking: this.model.getItemMe().getRanking(),
                        system_ranking: this.model.getItemMe().getRankingSystem(),
                        system_manners: this.model.getItemMe().getRankingManners(),
                        country_img: this.model.getItemMe().getCountryImage()
                    }
                }, () => {
                    // insertMyRanking(this.state.me, Constant.LEADER_BOARD.RANK_TYPE.TOP_18);
                });
            } else {
                this.setState({
                    me: {}
                });
            }
            if (dataList.length > 0) {
                this.listViewLeaderBoard.setFillData(this.listTop18Users);
                // if (this.page === 0) {
                //     deleteAllTopEighteen().then(() => {
                //         insertTopEighteen(this.model.getListUsers(), this.page);
                //     }).catch(() => { })
                // } else {
                //     insertTopEighteen(this.model.getListUsers(), this.page);
                // }

                // DataManager.saveSingleLocalData(Constant.CACHE.SYNC_INTERVAL_18_TOP, (new Date()).getTime().toString(), (error) => {
                //     console.log('SYNC_INTERVAL.error', error)
                // });
            } else if (this.page > 0) {
                this.isLoadCompleted = true;
            }
        }
        //this._parent.loading.hideLoading();
    }

    onItemClick(data) {
        // const { screenProps } = this.props;
        let navigation = StaticProps.getAppSceneNavigator();
        if (!navigation) return;
        let isMe = (this.getAppUtil().replaceUser(data.userId) === this.getUserInfo().getId()) ? true : false;
        if (isMe) {
            navigation.navigate('persional_information', { puid: data.userId })
        } else {
            navigation.navigate('player_info', { "puid": data.userId });
        }
        // screenProps.parentNavigation.navigate('player_info', { "puid": data.userId });
    }

    onLoadMore() {
        if (!this.isSearch && !this.isLoadCompleted) {//load more khi khong o man hinh tim kiem
            if (this.page < this.lodashData.length - 1) {
                this.page++;
                this.listTop18Users = [...this.listTop18Users, ...this.lodashData[this.page]];
                this.listViewLeaderBoard.setFillData(this.listTop18Users);
            } else {
                this.page++;
                this.sendData();
            }
        } else {
            console.log('dismissLoading')
            this.listViewLeaderBoard.dismissLoading();
        }
    }

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.header}>
                    <Text allowFontScaling={global.isScaleFont} style={styles.rank}>{this.t('rank_title')}</Text>
                    <Text allowFontScaling={global.isScaleFont} style={styles.name}>{this.t('name_title')}</Text>
                    <Text allowFontScaling={global.isScaleFont} style={styles.hdc}>{this.t('handicap_title')}</Text>
                    <Text allowFontScaling={global.isScaleFont} style={styles.system_rank}>{this.t('system_ranking_title')}</Text>
                </View>
                <View style={styles.body}>
                    <ListViewLeaderBoard ref={(listViewLeaderBoard) => { this.listViewLeaderBoard = listViewLeaderBoard; }} />
                    <MyView style={styles.view_hide} hide={!Object.keys(this.state.me).length ? true : false}>
                        <Touchable onPress={this.onItemClick.bind(this, this.state.me)}>
                            <LeaderBoardUserItem
                                data={this.state.me}
                            // userId={this.state.me.userId}
                            // fullname={this.state.me.fullname}
                            // eHandicap_member_id={this.state.me.eHandicap_member_id}
                            // avatar={this.state.me.avatar}
                            // handicap={this.state.me.handicap}
                            // ranking={this.state.me.ranking}
                            // system_ranking={this.state.me.system_ranking}
                            // system_manners={this.state.me.system_manners}
                            />
                        </Touchable>
                    </MyView>
                    <LoadingView ref={(loading2) => { this.loading2 = loading2; }}
                        isShowOverlay={false} />
                </View>
            </View>
        );
    }
}
