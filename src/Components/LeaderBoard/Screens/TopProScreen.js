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
// import {
//     insertTopPro,
//     queryTopPro,
//     deleteAllTopPro,
// } from '../../../DbLocal/Leaderboard/TopProRealm';
// import { insertMyRanking, queryMyRanking } from '../../../DbLocal/Leaderboard/MyRankingRealm';
// import DataManager from '../../../Core/Manager/DataManager';
import Constant from '../../../Constant/Constant';
import StaticProps from '../../../Constant/PropsStatic';

const NUMBER_PAGING = 20;

export default class TopProScreen extends BaseComponent {
    constructor(props) {
        super(props);
        this.listTopProUsers = [];
        this.isSearch = false;
        this.page = 0;
        this.lodashData = [];
        this.isLoadCompleted = false;
        this.state = {
            me: {
            }
        };

        this.onItemClickMe = this.onItemClickMe.bind(this,this.state.me);
    }

    componentDidMount() {
        // console.log("back top 18");
        const { screenProps } = this.props;
        this.listViewLeaderBoard.loadMoreCallback = this.onLoadMore.bind(this);
        this.listViewLeaderBoard.itemClickCallback = this.onItemClick.bind(this);
        if (screenProps != null) {
            let parent = screenProps.parent;
            this._parent = parent;
            parent.completeSearchCallback = this.fillDataSearch.bind(this);
            parent.cancelSearchCallback = this.cancelSearch.bind(this);

            parent.callbackStartSearch = this.onStartSearch.bind(this);
            parent.addToListCompleteCallback(Constant.LEADER_BOARD.SCREEN_INDEX.PRO, this.fillDataSearch.bind(this));
            parent.addToListCancelCallback(Constant.LEADER_BOARD.SCREEN_INDEX.PRO, this.cancelSearch.bind(this));
            parent.addToListStartCallback(Constant.LEADER_BOARD.SCREEN_INDEX.PRO, this.onStartSearch.bind(this));

            parent.rank_type = Constant.LEADER_BOARD.RANK_TYPE.PRO;
            this.isSearch = screenProps.is_search;

            let {router} = screenProps;
            console.log('....................router ',router);
            if(router && router !== Constant.LEADER_BOARD.ROUTER_NAME.PRO){
                this.props.navigation.navigate(router);
            }

            //parent.clearSearch();
            if (!this.isSearch) {
                this.sendData();
                // this.showLoading();
                // queryTopPro()
                //     .then((topProList) => {
                //         if (topProList.length > 0) {
                //             DataManager.loadSingleLocalData(Constant.CACHE.SYNC_INTERVAL_PRO_TOP, (time) => {
                //                 try {
                //                     let date = (new Date()).getTime();
                //                     let interval = (date - time) / 1000;
                //                     if (time && interval > 60 * 60) {
                //                         this.sendData();
                //                     } else {
                //                         this.parseLocalData(topProList);
                //                     }
                //                 } catch (e) {
                //                     console.log('loadLocalData', e);
                //                     this.parseLocalData(topProList);
                //                 }
                //             }, ()=>{
                //                 this.parseLocalData(topProList);
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
                //         if (type === Constant.LEADER_BOARD.RANK_TYPE.PRO) {
                //             this.setState({
                //                 me: data[0]
                //             })
                //         }
                //     }
                // }).catch(() => { })
            }
        }
    }

    parseLocalData(topProList){
        let listData = [];
        topProList.map((round) => {
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
        this.listTopProUsers = this.lodashData[this.page];
        if (this.listTopProUsers.length) {
            this.listViewLeaderBoard.setFillData(this.listTopProUsers);
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
        this.listViewLeaderBoard.setFillData(this.listTopProUsers);
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
        let url = this.getConfig().getBaseUrl() + ApiService.leaderboard_list(Constant.LEADER_BOARD.RANK_TYPE.PRO, this.page + 1);
        console.log('url', url)
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
            let listData = this.model.getListUsers();
            for (let item of listData) {
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
                this.listTopProUsers.push(obj);
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
                    // insertMyRanking(this.state.me, Constant.LEADER_BOARD.RANK_TYPE.PRO);
                });
            } else {
                this.setState({
                    me: {}
                });
            }
            if (listData.length>0) {
                this.listViewLeaderBoard.setFillData(this.listTopProUsers);
                // if (this.page === 0) {
                //     deleteAllTopPro().then(() => {
                //         insertTopPro(this.model.getListUsers(), this.page);
                //     }).catch(() => { })
                // } else {
                //     insertTopPro(this.model.getListUsers(), this.page);
                // }
                
                // DataManager.saveSingleLocalData(Constant.CACHE.SYNC_INTERVAL_PRO_TOP, (new Date()).getTime().toString(), (error) => {
                //     console.log('SYNC_INTERVAL.error', error)
                // });
                
            } else if (this.page > 0){
                this.isLoadCompleted = true;
            }
        }
        //this._parent.loading.hideLoading();
    }

    onItemClick(data) {
        // const { screenProps } = this.props;
        // console.log('data.userId ', data.userId, data )
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

    onItemClickMe(data) {
        const { screenProps } = this.props;
        console.log('data.userId ', data.userId, data )
        if (screenProps != null) {
            screenProps.parentNavigation.navigate('player_info', { "puid": data.userId });
        }
    }

    onLoadMore() {
        if (!this.isSearch&& !this.isLoadCompleted) {//load more khi khong o man hinh tim kiem
            if (this.page < this.lodashData.length - 1) {
                this.page++;
                this.listTopProUsers = [...this.listTopProUsers, ...this.lodashData[this.page]];
                this.listViewLeaderBoard.setFillData(this.listTopProUsers);
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
                        <Touchable onPress={this.onItemClickMe}>
                            <LeaderBoardUserItem
                                data={this.state.me}
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
