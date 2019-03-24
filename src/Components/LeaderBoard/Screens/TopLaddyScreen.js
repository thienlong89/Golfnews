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
import styles from '../../../Styles/LeaderBoard/Screens/StyleTopSingleScreen';
import Networking from '../../../Networking/Networking';
import MyView from '../../../Core/View/MyView';
import LeaderBoardUserItem from '../Items/LeaderBoardUserItem';
import LeaderBoardUserItemModel from '../../../Model/LeaderBoard/LeaderBoardUserItemModel';
import ApiService from '../../../Networking/ApiService';
import LoadingView from '../../../Core/Common/LoadingView';

import ListViewLeaderBoard from '../Items/ListViewLeaderBoard';

// const TAG = "[Vhandicap-v1] SingleScreen : ";

import _ from 'lodash';
// import {
//     insertTopLady,
//     queryTopLady,
//     deleteAllTopLady,
// } from '../../../DbLocal/Leaderboard/TopLadyRealm';
// import { insertMyRanking, queryMyRanking } from '../../../DbLocal/Leaderboard/MyRankingRealm';
// import DataManager from '../../../Core/Manager/DataManager';
import Constant from '../../../Constant/Constant';
import StaticProps from '../../../Constant/PropsStatic';


const NUMBER_PAGING = 20;

export default class TopLaddyScreen extends BaseComponent {
    constructor(props) {
        super(props);
        this._parent = null;
        this.isSearch = false;
        this.page = 0;
        this.lodashData = [];
        this.listLaddyUsers = [];
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
        let url = this.getConfig().getBaseUrl() + ApiService.leaderboard_list(Constant.LEADER_BOARD.RANK_TYPE.LADDY, this.page + 1);
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
            parent.rank_type = Constant.LEADER_BOARD.RANK_TYPE.LADDY;
            parent.callbackStartSearch = this.onStartSearch.bind(this);

            parent.addToListCompleteCallback(Constant.LEADER_BOARD.SCREEN_INDEX.LADDY, this.fillDataSearch.bind(this));
            parent.addToListCancelCallback(Constant.LEADER_BOARD.SCREEN_INDEX.LADDY, this.cancelSearch.bind(this));
            parent.addToListStartCallback(Constant.LEADER_BOARD.SCREEN_INDEX.LADDY, this.onStartSearch.bind(this));

            this.isSearch = screenProps.is_search;
            //parent.clearSearch();
            if (!this.isSearch) {
                this.sendData();
                // this.showLoading();
                // queryTopLady()
                //     .then((topLadyList) => {
                //         if (topLadyList.length > 0) {
                //             DataManager.loadSingleLocalData(Constant.CACHE.SYNC_INTERVAL_LADY_TOP, (time) => {
                //                 try {
                //                     let date = (new Date()).getTime();
                //                     let interval = (date - time) / 1000;
                //                     if (time && interval > 60 * 60) {
                //                         this.sendData();
                //                     } else {
                //                         this.parseLocalData(topLadyList);
                //                     }
                //                 } catch (e) {
                //                     console.log('loadLocalData', e);
                //                     this.parseLocalData(topLadyList);
                //                 }
                //             }, ()=>{
                //                 this.parseLocalData(topLadyList);
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
                //         if (type === Constant.LEADER_BOARD.RANK_TYPE.LADDY) {
                //             this.setState({
                //                 me: data[0]
                //             })
                //         }
                //     }
                // }).catch(() => { })
            }
        }
    }

    parseLocalData(topLadyList) {
        let listData = [];
        topLadyList.map((round) => {
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
        this.listLaddyUsers = this.lodashData[this.page];
        if (this.listLaddyUsers.length) {
            this.listViewLeaderBoard.setFillData(this.listLaddyUsers);
        }
    }

    onStartSearch() {
        this.isSearch = true;
        this.listViewLeaderBoard.setFillData([], true);
        this.listViewLeaderBoard.showLoading();
    }

    //khi nguoi choi nhan huy tim kiem
    cancelSearch() {
        this.listViewLeaderBoard.setFillData(this.listLaddyUsers);
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
                // console.log("push : ", obj);
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
                this.listLaddyUsers.push(obj);
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
                    // insertMyRanking(this.state.me, Constant.LEADER_BOARD.RANK_TYPE.LADDY);
                });
            } else {
                this.setState({
                    me: {}
                });
            }
            if (length > 0) {
                this.listViewLeaderBoard.setFillData(this.listLaddyUsers);
                // if (this.page === 0) {
                //     deleteAllTopLady().then(() => {
                //         insertTopLady(this.model.getListUsers(), this.page);
                //     }).catch(() => { })
                // } else {
                //     insertTopLady(this.model.getListUsers(), this.page);
                // }

                // DataManager.saveSingleLocalData(Constant.CACHE.SYNC_INTERVAL_LADY_TOP, (new Date()).getTime().toString(), (error) => {
                //     console.log('SYNC_INTERVAL.error', error)
                // });
            } else if (this.page > 0) {
                this.isLoadCompleted = true;
            }
        }
        //this._parent.loading.hideLoading();
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
        if (!this.isSearch && this.listLaddyUsers.length > 10 && !this.isLoadCompleted) {
            if (this.page < this.lodashData.length - 1) {
                this.page++;
                this.listLaddyUsers = [...this.listLaddyUsers, ...this.lodashData[this.page]];
                this.listViewLeaderBoard.setFillData(this.listLaddyUsers);
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