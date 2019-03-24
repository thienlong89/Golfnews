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
// import LeaderBoardUserItemModel from '../../../Model/LeaderBoard/LeaderBoardUserItemModel';
import ApiService from '../../../Networking/ApiService';
import LoadingView from '../../../Core/Common/LoadingView';
import ListViewLeaderBoard from '../Items/ListViewLeaderBoard';

// const TAG = "[Vhandicap-v1] BogeyScreen : ";

import _ from 'lodash';
// import {
//     insertTopBogey,
//     queryTopBogey,
//     deleteAllTopBogey,
// } from '../../../DbLocal/Leaderboard/TopBogeyRealm';
// import { insertMyRanking, queryMyRanking } from '../../../DbLocal/Leaderboard/MyRankingRealm';
// import DataManager from '../../../Core/Manager/DataManager';
import Constant from '../../../Constant/Constant';
import StaticProps from '../../../Constant/PropsStatic';

const NUMBER_PAGING = 20;

export default class TopBogeyScreen extends BaseComponent {
    constructor(props) {
        super(props);
        this.isSearch = false;
        this._parent = null;
        this.page = 0;
        this.lodashData = [];
        this.listBogeyUsers = [];
        this.isLoadCompleted = false;
        this.state = {
            me: {}
        };
    }

    componentDidMount() {
        const { screenProps } = this.props;
        this.listViewLeaderBoard.loadMoreCallback = this.onLoadMore.bind(this);
        this.listViewLeaderBoard.itemClickCallback = this.onItemUserClick.bind(this);
        if (screenProps != null) {
            let parent = screenProps.parent;
            this._parent = parent;
            parent.completeSearchCallback = this.fillDataSearch.bind(this);
            parent.cancelSearchCallback = this.cancelSearch.bind(this);
            parent.rank_type = Constant.LEADER_BOARD.RANK_TYPE.BOGEY;

            parent.callbackStartSearch = this.onStartSearch.bind(this);
            parent.addToListCompleteCallback(Constant.LEADER_BOARD.SCREEN_INDEX.BOGEY, this.fillDataSearch.bind(this));
            parent.addToListCancelCallback(Constant.LEADER_BOARD.SCREEN_INDEX.BOGEY, this.cancelSearch.bind(this));
            parent.addToListStartCallback(Constant.LEADER_BOARD.SCREEN_INDEX.BOGEY, this.onStartSearch.bind(this));

            this.isSearch = screenProps.is_search;
            //parent.clearSearch();
            console.log("is search ", this.isSearch);
            if (!this.isSearch) {
                // let endTime = (new Date()).getTime();
                // if (startTime && (endTime - startTime) > Constant.LEADER_BOARD.CACHE_TIME) {
                //     //lơn hơn tgian cache thi load lại
                //     listBogeyUsers = [];
                //     page = 1;
                //     startTime = endTime;
                //     this.sendData();
                // } else {
                //     if (listBogeyUsers.length) {
                //         this.listViewLeaderBoard.setFillData(listBogeyUsers);
                //         return;//chi load 1 lan
                //     }
                //     page = 1;
                //     startTime = endTime;
                //     this.sendData();
                // }
                this.sendData();
                // this.showLoading();
                // console.log('queryTopBogey.start')
                // await queryTopBogey()
                //     .then((topBogeyList) => {
                //         console.log('queryTopBogey.done')
                //         if (topBogeyList.length > 0) {
                //             this.hideLoading();
                //             DataManager.loadSingleLocalData(Constant.CACHE.SYNC_INTERVAL_BOGEY_TOP, (time) => {
                //                 try {
                //                     let date = (new Date()).getTime();
                //                     let interval = (date - time) / 1000;
                //                     if (time && interval > 60 * 60) {
                //                         this.sendData();

                //                     } else {
                //                         this.parseLocalData(topBogeyList);
                //                     }
                //                 } catch (e) {
                //                     console.log('loadLocalData', e);
                //                     this.parseLocalData(topBogeyList);
                //                 }
                //             }, ()=>{
                //                 this.parseLocalData(topBogeyList);
                //             });
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
                //         if (type === Constant.LEADER_BOARD.RANK_TYPE.BOGEY) {
                //             this.setState({
                //                 me: data[0]
                //             })
                //         }
                //     }
                // }).catch(() => { })
            }
        }
    }

    parseLocalData(topBogeyList) {
        this.lodashData = _.chunk(topBogeyList, NUMBER_PAGING);
        this.listBogeyUsers = this.lodashData[this.page];
        if (this.listBogeyUsers.length) {
            this.listViewLeaderBoard.setFillData(this.listBogeyUsers);
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
        this.listViewLeaderBoard.setFillData(this.listBogeyUsers);
    }

    //filldu lieu khi tim kiem
    fillDataSearch(jsonData) {
        this.listViewLeaderBoard.hideLoading();
        if (!this.isSearch) return;
        this.model = new LeaderBoardModel(this);
        this.model.parseData(jsonData);
        var listSearch = [];
        if (this.model.getErrorCode() === 0) {
            for (let item of this.model.getListUsers()) {
                let obj = {
                    _id: item.get_Id(),
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
        let url = this.getConfig().getBaseUrl() + ApiService.leaderboard_list(Constant.LEADER_BOARD.RANK_TYPE.BOGEY, this.page + 1);
        Networking.httpRequestGet(url, this.onResponse.bind(this), () => {
            //time out
            //self._parent.loading.hideLoading();
            //self._parent.popupTimeOut.hidePopup();
            self.hideLoading();
        });
    }

    onItemUserClick(data) {
        // const { screenProps } = this.props;
        // if (screenProps != null) {
        //     screenProps.parentNavigation.navigate('player_info', { "puid": data.userId });
        // }
        let navigation = StaticProps.getAppSceneNavigator();
        if (!navigation) return;
        let isMe = (this.getAppUtil().replaceUser(data.userId) === this.getUserInfo().getId()) ? true : false;
        if (isMe) {
            navigation.navigate('persional_information', { puid: data.userId })
        } else {
            navigation.navigate('player_info', { "puid": data.userId });
        }
    }

    onResponse(jsonData) {
        //console.log("bogey : ",jsonData);
        this.hideLoading();
        this.model = new LeaderBoardModel(this);
        this.model.parseData(jsonData);
        if (this.model.getErrorCode() === 0) {
            let dataList = this.model.getListUsers();
            for (let item of dataList) {
                let obj = {
                    _id: item.get_Id(),
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
                this.listBogeyUsers.push(obj);
            }
            //console.log("me : ",this.model.getItemMe())
            if (this.model.getItemMe()) {
                let self = this;
                this.setState({
                    me: {
                        _id: self.model.getItemMe().get_Id(),
                        userId: self.model.getItemMe().getUserId(),
                        eHandicap_member_id: self.model.getItemMe().getMemberId(),
                        fullname: self.model.getItemMe().getFullName(),
                        avatar: self.model.getItemMe().getAvatar(),
                        handicap: self.model.getItemMe().getHandicap(),
                        ranking: self.model.getItemMe().getRanking(),
                        system_ranking: self.model.getItemMe().getRankingSystem(),
                        system_manners: self.model.getItemMe().getRankingManners(),
                        country_img: self.model.getItemMe().getCountryImage()
                    }
                }, () => {
                    // insertMyRanking(this.state.me, Constant.LEADER_BOARD.RANK_TYPE.BOGEY);
                });
            } else {
                this.setState({
                    me: {}
                });
            }
            if (dataList.length > 0) {
                this.listViewLeaderBoard.setFillData(this.listBogeyUsers);
                // if (this.page === 0) {
                //     deleteAllTopBogey().then(() => {
                //         insertTopBogey(this.listBogeyUsers, this.page);
                //     }).catch(() => { })
                // } else {
                //     insertTopBogey(this.listBogeyUsers, this.page);
                // }

                // DataManager.saveSingleLocalData(Constant.CACHE.SYNC_INTERVAL_BOGEY_TOP, (new Date()).getTime().toString(), (error) => {
                //     console.log('SYNC_INTERVAL.error', error)
                // });
            } else if (this.page > 0) {
                this.isLoadCompleted = true;
            }
        }
    }

    onLoadMore() {
        if (!this.isSearch && !this.isLoadCompleted) {//load more khi khong o man hinh tim kiem
            if (this.page < this.lodashData.length - 1) {
                this.page++;
                this.listBogeyUsers = [...this.listBogeyUsers, ...this.lodashData[this.page]];
                this.listViewLeaderBoard.setFillData(this.listBogeyUsers);
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
        let { me } = this.state;
        //console.log("me data : ",me);
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
                    <MyView style={styles.view_hide} hide={!Object.keys(me).length ? true : false}>
                        <Touchable onPress={this.onItemUserClick.bind(this, me)}>
                            <LeaderBoardUserItem
                                data={me}
                            // userId={me.userId}
                            // fullname={me.fullname}
                            // eHandicap_member_id={me.eHandicap_member_id}
                            // avatar={me.avatar}
                            // handicap={me.handicap}
                            // ranking={me.ranking}
                            // system_ranking={me.system_ranking}
                            // system_manners={me.system_manners}
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
