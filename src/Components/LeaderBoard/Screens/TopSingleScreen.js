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
import BaseComponent from '../../../Core/View/BaseComponent';
import LeaderBoardModel from '../../../Model/LeaderBoard/LeaderBoardModel';
import LeaderBoardUserItemModel from '../../../Model/LeaderBoard/LeaderBoardUserItemModel';
import styles from '../../../Styles/LeaderBoard/Screens/StyleTopSingleScreen';
import Networking from '../../../Networking/Networking';
import MyView from '../../../Core/View/MyView';
import LeaderBoardUserItem from '../Items/LeaderBoardUserItem';
import ApiService from '../../../Networking/ApiService';
import LoadingView from '../../../Core/Common/LoadingView';

import ListViewLeaderBoard from '../Items/ListViewLeaderBoard';

import _ from 'lodash';
// import {
//     insertTopSingle,
//     queryTopSingle,
//     deleteAllTopSingle,
// } from '../../../DbLocal/Leaderboard/TopSingleRealm';
// import { insertMyRanking, queryMyRanking } from '../../../DbLocal/Leaderboard/MyRankingRealm';
// import DataManager from '../../../Core/Manager/DataManager';
import Constant from '../../../Constant/Constant';
import StaticProps from '../../../Constant/PropsStatic';

// const TAG = "[Vhandicap-v1] SingleScreen : ";
// const NUMBER_PAGING = 20;
let time = (new Date()).getTime();
const time_cache = 2*60*1000;//2p

var listSingleUsers = [];
let page = 1;
export default class TopSingleScreen extends BaseComponent {
    constructor(props) {
        super(props);
        this._parent = null;
        this.isSearch = false;
        // this.page = 0;
        // this.lodashData = [];
        this.isLoadCompleted = false;
        this.state = {
            me: {
            },
        };
    }

    static defaultProps = {
        _parent: null
    }

    showLoading() {
        if (this.loading2) {
            this.loading2.showLoading();
            this.setRequestTimeOut();
        }
    }

    hideLoading() {
        if (this.loading2) {
            this.loading2.hideLoading();
        }
        if (this.modalInterval) {
            clearInterval(this.modalInterval);
        }
    }

     /**
     * Hàm set thời gian timeout của một request lên sever
     * @param {number} time - thời gian timeout
     * @default {TIME_OUT_FOR_REQUEST}
     */
    setRequestTimeOut(time = 30000) {
        this.modalInterval = setInterval(() => {
            if (this.loading2) {
                this.loading2.hideLoading();
            }
            clearInterval(this.modalInterval);
        }, time);
    }

    sendData() {
        //this._parent.loading.showLoading();
        this.showLoading();
        let self = this;
        let url = this.getConfig().getBaseUrl() + ApiService.leaderboard_list(Constant.LEADER_BOARD.RANK_TYPE.SINGLE, page);
        console.log("top single url : ", url);
        Networking.httpRequestGet(url, this.onResponse.bind(this), () => {
            //time out
            self.hideLoading();
        });
    }

    componentDidMount() {
        const { screenProps } = this.props;
        this.listViewLeaderBoard.loadMoreCallback = this.onLoadMore.bind(this);
        this.listViewLeaderBoard.itemClickCallback = this.onItemUserClick.bind(this);
        //
        if (screenProps != null) {
            let parent = screenProps.parent;
            this._parent = parent;
            parent.completeSearchCallback = this.fillDataSearch.bind(this);
            parent.cancelSearchCallback = this.cancelSearch.bind(this);
            parent.rank_type = Constant.LEADER_BOARD.RANK_TYPE.SINGLE;
            parent.callbackStartSearch = this.onStartSearch.bind(this);

            parent.addToListCompleteCallback(Constant.LEADER_BOARD.SCREEN_INDEX.SINGLE, this.fillDataSearch.bind(this));
            parent.addToListCancelCallback(Constant.LEADER_BOARD.SCREEN_INDEX.SINGLE, this.cancelSearch.bind(this));
            parent.addToListStartCallback(Constant.LEADER_BOARD.SCREEN_INDEX.SINGLE, this.onStartSearch.bind(this));

            this.isSearch = screenProps.is_search;
            //parent.clearSearch();
            if (!this.isSearch) {
                this.startTime = (new Date()).getTime();
                console.log('............time cache ',(this.startTime - time));
                if(listSingleUsers.length && this.startTime - time <= time_cache){
                    this.listViewLeaderBoard.setFillData(listSingleUsers);
                    return;
                }
                time = this.startTime;
                this.sendData();
                // this.showLoading();
                // await queryTopSingle()
                //     .then((topSingleList) => {
                //         if (topSingleList.length > 0) {
                //             DataManager.loadSingleLocalData(Constant.CACHE.SYNC_INTERVAL_SINGLE_TOP, (time) => {
                //                 try {
                //                     let date = (new Date()).getTime();
                //                     let interval = (date - time) / 1000;
                //                     console.log('loadLocalData.interval', interval, date);
                //                     if (time && interval > 60 * 60) {
                //                         this.sendData();
                //                     } else {
                //                         this.parseLocalData(topSingleList);
                //                     }
                //                 } catch (e) {
                //                     console.log('loadLocalData', e);
                //                     this.parseLocalData(topSingleList);
                //                 }
                //             }, () => {
                //                 this.parseLocalData(topSingleList);
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
                //         if (type === Constant.LEADER_BOARD.RANK_TYPE.SINGLE) {
                //             this.setState({
                //                 me: data[0]
                //             })
                //         }
                //     }
                // }).catch(() => { })
            }
        }
    }

    parseLocalData(topSingleList) {

        let listData = [];
        topSingleList.map((round) => {
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
        // this.lodashData = _.chunk(listData, NUMBER_PAGING);
        // console.log('queryTopSingle.lodashData', this.lodashData.length);
        // listSingleUsers = this.lodashData[this.page];
        if (listSingleUsers.length) {
            this.listViewLeaderBoard.setFillData(listSingleUsers);
        }
    }

    onStartSearch() {
        this.isSearch = true;
        this.listViewLeaderBoard.setFillData([], true);
        this.listViewLeaderBoard.showLoading();
    }

    //khi nguoi choi nhan huy tim kiem
    cancelSearch() {
        this.listViewLeaderBoard.setFillData(listSingleUsers);
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
            let i = 0, length = this.model.getListUsers().length;
            for (; i < length; i++) {
                let item = this.model.getListUsers()[i];
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
                console.log("push : ", obj);
                listSearch.push(obj);
            }
            this.listViewLeaderBoard.setFillData(listSearch, true);
        }
    }

    onResponse(jsonData) {
        this.hideLoading();
        this.model = new LeaderBoardModel(this);
        this.model.parseData(jsonData);
        if (this.model.getErrorCode() === 0) {
            let i = 0, length = this.model.getListUsers().length;
            for (; i < length; i++) {
                let item = this.model.getListUsers()[i];
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
                listSingleUsers.push(obj);
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
                    // insertMyRanking(this.state.me, Constant.LEADER_BOARD.RANK_TYPE.SINGLE);
                });
            } else {
                this.setState({
                    me: {}
                });
            }
            if (length > 0) {
                this.listViewLeaderBoard.setFillData(listSingleUsers);
                // if (this.page === 0) {
                //     deleteAllTopSingle().then(() => {
                //         insertTopSingle(this.model.getListUsers(), this.page);
                //     }).catch(() => { })
                // } else {
                //     insertTopSingle(this.model.getListUsers(), this.page);
                // }

                // DataManager.saveSingleLocalData(Constant.CACHE.SYNC_INTERVAL_SINGLE_TOP, (new Date()).getTime().toString(), (error) => {
                //     console.log('SYNC_INTERVAL.error', error)
                // });
            } else if (page > 0) {
                this.isLoadCompleted = true;
            }
        }
    }

    onItemUserClick(data) {
        // const { screenProps } = this.props;
        // if (screenProps != null) {
        //     screenProps.parentNavigation.navigate('player_info', { "puid": data.userId });
        // }
        // console.log("single scene");
        let navigation = StaticProps.getAppSceneNavigator();
        if (!navigation) return;
        let isMe = (this.getAppUtil().replaceUser(data.userId) === this.getUserInfo().getId()) ? true : false;
        if (isMe) {
            navigation.navigate('persional_information', { puid: data.userId })
        } else {
            navigation.navigate('player_info', { "puid": data.userId });
        }
    }

    onLoadMore() {
        if (!this.isSearch && !this.isLoadCompleted) {
            console.log('onLoadMore', this.isLoadCompleted)
            // page++;
            // this.sendData();
            // console.log("load more friend : ", page);
            // if (this.page < this.lodashData.length - 1) {
            //     this.page++;
            //     listSingleUsers = [...listSingleUsers, ...this.lodashData[this.page]];
            //     this.listViewLeaderBoard.setFillData(listSingleUsers);
            // } else {
                // this.page++;
                page++;
                this.sendData();
            // }
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
                        <Touchable onPress={this.onItemUserClick.bind(this, this.state.me)} >
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