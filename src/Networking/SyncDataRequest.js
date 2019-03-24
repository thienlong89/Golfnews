import FriendFlightModel from '../Model/Home/FriendFlightModel';
import AppUtil from '../Config/AppUtil';
import Config from '../Config/Config';
import ApiService from '../Networking/ApiService';
import Networking from '../Networking/Networking';
import { insertFriendFlight } from '../DbLocal/FriendFlightRealm';
import { insertFinishFlight } from '../DbLocal/FinishFlightRealm';
import { insertNews } from '../DbLocal/NewsRealm';
import { insertNotification } from '../DbLocal/NotificationRealm';
import { insertTopSingle, deleteAllTopSingle } from '../DbLocal/Leaderboard/TopSingleRealm';
import { insertTopBogey, deleteAllTopBogey } from '../DbLocal/Leaderboard/TopBogeyRealm';
import { insertTopEighteen, deleteAllTopEighteen } from '../DbLocal/Leaderboard/TopEighteenRealm';
import { insertTopLady, deleteAllTopLady } from '../DbLocal/Leaderboard/TopLadyRealm';
import { insertTopPro, deleteAllTopPro } from '../DbLocal/Leaderboard/TopProRealm';
import { insertMyRanking } from '../DbLocal/Leaderboard/MyRankingRealm';
import DataManager from '../Core/Manager/DataManager';
import Constant from '../Constant/Constant';
import FinishFlightModel from '../Model/Home/FinishFlightModel';
import NewsModel from '../Model/News/NewsModel';
import NotificationModel from '../Model/Notification/NotificationModel';
import LeaderBoardModel from '../Model/LeaderBoard/LeaderBoardModel';

module.exports.syncNewFriendFlightList = () => {
    DataManager.loadSingleLocalData(Constant.CACHE.MAX_FRIEND_FLIGHT_ID, (flightId) => {
        console.log('MAX_FRIEND_FLIGHT_ID', flightId);
        if (flightId) {
            let url = Config.getBaseUrl() + ApiService.list_friends_flight_for_cache(flightId, true);
            console.log('url', url);
            Networking.httpRequestGet(url, (jsonData) => {
                console.log('requestNewFriendFlightList', jsonData);
                let model = new FriendFlightModel();
                model.parseData(jsonData);
                if (model.getErrorCode() === 0) {
                    let newFlightData = model.getFriendFlightList();
                    if (newFlightData.length > 0) {
                        insertFriendFlight(newFlightData);
                        let maxFlightId = newFlightData.reduce(AppUtil.getMaxReducer, flightId);
                        DataManager.saveLocalData([[Constant.CACHE.MAX_FRIEND_FLIGHT_ID, maxFlightId.toString()]], (error) => console.log('saveLocalData', error));
                    }

                }
            }, () => {
                //time out
            });
        }

    });

}

module.exports.syncNewFinishFlightList = () => {
    DataManager.loadSingleLocalData(Constant.CACHE.MAX_FINISH_FLIGHT_ID, (flightId) => {
        console.log('MAX_FINISH_FLIGHT_ID', flightId);
        if (flightId) {
            let url = Config.getBaseUrl() + ApiService.home_list_all_rounds_for_cache(flightId, true);
            console.log('url', url);
            Networking.httpRequestGet(url, (jsonData) => {
                console.log('requestNewFinishFlightList', jsonData);
                let finishFlightModel = new FinishFlightModel();
                finishFlightModel.parseData(jsonData);
                if (finishFlightModel.getErrorCode() === 0) {
                    let newFlightData = finishFlightModel.getRoundList();

                    if (newFlightData.length > 0) {
                        insertFinishFlight(newFlightData);
                        let maxFlightId = newFlightData.reduce(AppUtil.getMaxRoundReducer, flightId);
                        DataManager.saveLocalData([[Constant.CACHE.MAX_FINISH_FLIGHT_ID, maxFlightId.toString()]], (error) => console.log('saveLocalData', error));
                    }

                }
            }, () => {
                //time out
            });
        }
    });

}

module.exports.syncHandicapNews = () => {
    console.log('syncHandicapNews');
    DataManager.loadSingleLocalData(Constant.CACHE.MAX_NEWS_ID, (newId) => {
        console.log('MAX_NEWS_ID', newId);
        if (newId) {
            let url = Config.getBaseUrl() + ApiService.news_list_for_cache(newId, true);
            console.log('news url : ', url);
            Networking.httpRequestGet(url, (jsonData) => {
                let model = new NewsModel();
                model.parseData(jsonData);
                if (model.getErrorCode() === 0) {
                    let newsList = model.getListNews();
                    if (newsList.length > 0) {
                        newsList.reverse();
                        insertNews(newsList);
                        let maxNewsId = newsList.reduce(AppUtil.getMaxNewsReducer, newsList[0].id);
                        DataManager.saveLocalData([[Constant.CACHE.MAX_NEWS_ID, maxNewsId.toString()]], (error) => console.log('saveLocalData', error));
                    }
                }
            }, () => {
                //time out
            });
        }
    });

}

module.exports.syncNotification = () => {
    console.log('syncNotification');
    DataManager.loadSingleLocalData(Constant.CACHE.MAX_NOTIFICATION_ID, (notificationId) => {
        console.log('MAX_NOTIFICATION_ID', notificationId);
        if (notificationId) {
            let url = Config.getBaseUrl() + ApiService.notification_list_for_cache(notificationId, true);
            console.log('url: ', url);
            Networking.httpRequestGet(url, (jsonData) => {
                console.log('syncNotification.data: ', jsonData);
                let model = new NotificationModel();
                model.parseData(jsonData);
                if (model.getErrorCode() === 0) {
                    let notifications = model.getListNotify();
                    if (notifications.length > 0) {
                        insertNotification(notifications);
                        let maxNewsId = notifications.reduce(AppUtil.getMaxNotificationReducer, notifications[0].id);
                        DataManager.saveLocalData([[Constant.CACHE.MAX_NOTIFICATION_ID, maxNewsId.toString()]], (error) => console.log('saveLocalData', error));
                    }
                }
            }, () => {
                //time out
            });
        }
    });

}

module.exports.syncLeaderBoard = (leaderboardType = '') => {
    // console.log('syncLeaderBoard', leaderboardType);
    let url = Config.getBaseUrl() + ApiService.leaderboard_list(leaderboardType, 1, 40);
    console.log("syncLeaderBoard: ", url);
    Networking.httpRequestGet(url, (jsonData) => {
        console.log('syncLeaderBoard.jsonData', jsonData.error_code);
        try {
            let model = new LeaderBoardModel();
            model.parseData(jsonData);
            if (model.getErrorCode() === 0) {
                let listUser = model.getListUsers();
                let me = model.getItemMe();
                if (listUser.length > 0) {
                    if (leaderboardType === Constant.LEADER_BOARD.RANK_TYPE.SINGLE) {
                        deleteAllTopSingle().then(() => {
                            insertTopSingle(listUser);
                            if (me) {
                                insertMyRanking(me);
                            }
                        }).catch((error) => { console.log('deleteAllTopSingle.error', error) });

                    } else if (leaderboardType === Constant.LEADER_BOARD.RANK_TYPE.BOGEY) {
                        let listData = [];
                        for (let item of listUser) {
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
                            listData.push(obj);
                        }

                        deleteAllTopBogey().then(() => {
                            insertTopBogey(listData);
                            if (me) {
                                insertMyRanking(me);
                            }
                        }).catch((error) => { console.log('deleteAllTopBogey.error', error) });
                    } else if (leaderboardType === Constant.LEADER_BOARD.RANK_TYPE.LADDY) {
                        deleteAllTopLady().then(() => {
                            insertTopLady(listUser);
                            if (me) {
                                insertMyRanking(me);
                            }
                        }).catch((error) => { console.log('deleteAllTopLady.error', error) });
                    } else if (leaderboardType === Constant.LEADER_BOARD.RANK_TYPE.TOP_18) {
                        deleteAllTopEighteen().then(() => {
                            insertTopEighteen(listUser);
                            if (me) {
                                insertMyRanking(me);
                            }
                        }).catch((error) => { console.log('deleteAllTopEighteen.error', error) });
                    } else if (leaderboardType === Constant.LEADER_BOARD.RANK_TYPE.PRO) {
                        deleteAllTopPro().then(() => {
                            insertTopPro(listUser);
                            if (me) {
                                insertMyRanking(me);
                            }
                        }).catch((error) => { console.log('deleteAllTopPro.error', error) });
                    }
                }
            }
        } catch (error) {
            console.log('syncLeaderBoard.error', error)
        }

    }, () => {
        //time out
    });

}