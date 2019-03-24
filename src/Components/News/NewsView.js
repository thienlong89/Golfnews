import React from 'react';
import {
    StyleSheet,
    // Text,
    View,
    // Dimensions,
    // Alert,
    // Image,
    ListView,
    RefreshControl,
    Platform
} from 'react-native';
import Touchable from 'react-native-platform-touchable';
import BaseComponent from '../../Core/View/BaseComponent';
import HeaderView from '../Common/HeaderView';
import ApiService from '../../Networking/ApiService';
import Networking from '../../Networking/Networking';
import NewsModel from '../../Model/News/NewsModel';
import NewsItemModel from '../../Model/News/NewsItemModel';
import NewItem from './Items/NewsItem';
import EmptyDataView from '../../Core/Common/EmptyDataView';
import LoadingView from '../../Core/Common/LoadingView';
import { NavigationActions } from 'react-navigation';
import { insertNews, queryNews, updateNews, deleteNewsArrayId } from '../../DbLocal/NewsRealm';
import _ from 'lodash';
import DataManager from '../../Core/Manager/DataManager';
import Constant from '../../Constant/Constant';

import I18n from 'react-native-i18n';
require('../../../I18n/I18n');
const NUMBER_PAGING = 10;

export default class NewsView extends BaseComponent {
    constructor(props) {
        super(props);
        this.page = 0;
        this.list_news = [];
        this.list_id_readed = [];
        // DataManager.loadListNews(this.onLoadNewsReadedComplete.bind(this));

        this.lodashData = [];
        this.maxNewsId = 0;
        this.minNewsId = 0;
        this.state = {
            refreshing: false,
            dataSource: new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 }),
            //count_notify : 
        }

        this.onLoadMore = this.onLoadMore.bind(this);
        this.onRefresh = this.onRefresh.bind(this);
        this.onNewsClick = this.onNewsClick.bind(this);
    }

    onLoadNewsReadedComplete(err, result) {
        if (result) {
            let array_id = JSON.parse(result);
            console.log("list id new : ", array_id);
            this.list_id_readed = this.list_id_readed.concat(array_id);
            global.list_notify_id_readed = this.list_id_readed.slice(0);
        }
    }

    /**
     * back lại màn hình trước đó
     */
    onBackClick() {
        let { navigation } = this.props;
        if (navigation) {
            navigation.goBack();
        }
        return true;
    }

    componentDidMount() {
        global.change_notify = true;

        queryNews()
            .then(({ allNews, unReadCount }) => {
                console.log('unReadCount', unReadCount)
                if (allNews.length > 0) {
                    let newsList = [];
                    allNews.map((newItem) => {
                        // console.log('queryFinishFlight.round.jsonData', round.jsonData);
                        let obj = new NewsItemModel();
                        obj.parseData(JSON.parse(newItem.jsonData));
                        newsList.push(obj);
                    })
                    // console.log('queryFinishFlight.rounds', rounds);
                    this.lodashData = _.chunk(newsList, NUMBER_PAGING);
                    console.log('queryFinishFlight.lodashData', this.lodashData.length);
                    this.list_news = this.lodashData[this.page];
                    this.setState({
                        dataSource: this.state.dataSource.cloneWithRows(this.list_news)
                    }, () => {
                        this.maxNewsId = allNews.reduce(this.getMaxNewsReducer, allNews[0].id);
                        this.minNewsId = allNews.reduce(this.getMinNewsReducer, allNews[0].id);
                        console.log('this.maxNewsId', this.maxNewsId);
                        console.log('this.minNewsId', this.minNewsId);
                        this.saveMaxNewsId(this.maxNewsId.toString());
                        this.setUnReadNewsCount(unReadCount);
                        if (this.maxNewsId) {
                            this.requestRefreshListNews(true, true);
                        }
                    })
                } else {
                    this.sendRequestListNews();
                }
            })
            .catch(error => {
                console.log('queryNews.error', error);
                this.sendRequestListNews();
            });
    }

    saveNewsReaded() {
        let sortArray = this.list_id_readed.sort((r1, r2) => r1 - r2);
        global.list_notify_id_readed = sortArray;
        console.log("SAVE mang news id sau khi sap xep la : ", sortArray);
        DataManager.saveListNews(JSON.stringify(sortArray));
    }

    sendRequestListNews() {
        this.customLoading.showLoading();
        let self = this;
        let url = this.getConfig().getBaseUrl() + ApiService.news_list();
        console.log('news url : ', url);
        Networking.httpRequestGet(url, (jsonData) => {
            self.model = new NewsModel(self);
            self.model.parseData(jsonData);
            if (self.model.getErrorCode() === 0) {
                self.list_news = self.model.getListNews();
                if (self.list_news.length) {
                    self.list_news.reverse();
                    self.emptyDataView.hideEmptyView();
                    self.setState({
                        dataSource: self.state.dataSource.cloneWithRows(self.list_news),
                    }, () => {
                        insertNews(self.list_news);
                        self.maxNewsId = self.list_news.reduce(self.getMaxNewsReducer, self.list_news[0].id);
                        self.minNewsId = self.list_news.reduce(self.getMinNewsReducer, self.list_news[0].id);
                        console.log('this.maxNewsId', self.maxNewsId);
                        console.log('this.minNewsId', self.minNewsId);
                        self.saveMaxNewsId(self.maxNewsId.toString());
                    });
                } else {
                    if (self.page <= 1) {
                        self.emptyDataView.showEmptyView();
                    }
                }
            } else {
                if (self.page <= 1) {
                    self.emptyDataView.showEmptyView();
                }
            }
            self.customLoading.hideLoading();
        }, () => {
            //time out
            self.customLoading.hideLoading();
            //self.popupTimeOut.showPopup();
        });
    }

    requestRefreshListNews(isNew = true, hideLoading = false) {
        if (!hideLoading) {
            this.customLoading.showLoading();
        }

        let self = this;
        let url = this.getConfig().getBaseUrl() + ApiService.news_list_for_cache(isNew ? this.maxNewsId : this.minNewsId, isNew);
        console.log('news url : ', url);
        Networking.httpRequestGet(url, (jsonData) => {
            self.model = new NewsModel(self);
            self.model.parseData(jsonData);
            if (self.model.getErrorCode() === 0) {
                let newsList = self.model.getListNews();
                let removeList = self.model.getListRemove();
                console.log('requestRefreshListNews.newsList.length', newsList.length)
                if (newsList.length > 0) {
                    newsList.reverse();
                    if (removeList.length > 0 && isNew) {
                        deleteNewsArrayId(removeList)
                            .then(() => {
                                insertNews(newsList)
                                    .then(() => {
                                        self.updateView(isNew);
                                    })
                                    .catch(() => {
                                        self.updateView(isNew);
                                    });
                            })
                            .catch(() => {
                                insertNews(newsList)
                                    .then(() => {
                                        self.updateView(isNew);
                                    })
                                    .catch(() => {
                                        self.updateView(isNew);
                                    });
                            })
                    } else {
                        insertNews(newsList)
                            .then(() => {
                                self.updateView(isNew);
                            })
                            .catch(() => {
                                self.updateView(isNew);
                            });
                    }

                } else if (removeList.length > 0 && isNew) {
                    deleteNewsArrayId(removeList)
                        .then(() => {
                            self.updateView(isNew);
                        })
                        .catch(() => {
                            self.updateView(isNew);
                        })
                }
            }
            self.customLoading.hideLoading();
        }, () => {
            //time out
            self.customLoading.hideLoading();
            //self.popupTimeOut.showPopup();
        });
    }

    updateView(isNew = true) {
        queryNews()
            .then(({ allNews, unReadCount }) => {
                console.log('unReadCount', unReadCount)
                if (allNews.length > 0) {
                    let newsList = [];
                    this.lodashData = [];
                    this.list_news = [];
                    allNews.map((newItem) => {
                        // console.log('queryFinishFlight.round.jsonData', round.jsonData);
                        let obj = new NewsItemModel();
                        obj.parseData(JSON.parse(newItem.jsonData));
                        newsList.push(obj);
                    })
                    // console.log('queryFinishFlight.rounds', rounds);
                    this.lodashData = _.chunk(newsList, NUMBER_PAGING);
                    console.log('queryFinishFlight.lodashData', this.lodashData.length);
                    this.page = isNew || this.page >= this.lodashData.length ? 0 : this.page;
                    for (let i = 0; i <= this.page; i++) {
                        this.list_news = [...this.list_news, ...this.lodashData[i]];
                    }
                    this.setState({
                        dataSource: this.state.dataSource.cloneWithRows(this.list_news)
                    }, () => {
                        this.maxNewsId = allNews.reduce(this.getMaxNewsReducer, allNews[0].id);
                        this.minNewsId = allNews.reduce(this.getMinNewsReducer, allNews[0].id);
                        console.log('this.maxNewsId', this.maxNewsId);
                        console.log('this.minNewsId', this.minNewsId);
                        this.saveMaxNewsId(this.maxNewsId.toString());
                        this.setUnReadNewsCount(unReadCount);
                    })
                }
            })
            .catch(error => {
                console.log('queryNews.error', error);
            });
    }

    /**
     * load thêm dữ liệu
     */
    onLoadMore() {
        if (!this.customLoading || this.list_news.length < 10 || (this.customLoading && this.customLoading.isLoading())) return;
        console.log('onLoadMore', this.lodashData.length, this.page)
        if (this.page < this.lodashData.length - 1) {
            this.page++;
            this.list_news = [...this.list_news, ...this.lodashData[this.page]];
            this.setState({
                dataSource: this.state.dataSource.cloneWithRows(this.list_news)
            })
        } else {
            this.requestRefreshListNews(false);
        }

    }

    /**
     * refresh lai dữ liệu
     */
    onRefresh() {
        if (!this.customLoading || (this.customLoading && this.customLoading.isLoading())) return;
        this.requestRefreshListNews(true);
    }

    /**
     * Xem chi tiet tin tuc
     * @param {*} data 
     */
    onNewsClick(data) {
        // this.list_id_readed.push(data.id);
        // this.saveNewsReaded();

        let count = parseInt(global.count_news);
        count--;
        this.setUnReadNewsCount(count);

        updateNews(data);
    }

    setUnReadNewsCount(count) {
        console.log("chang count : ", count);
        // let { parent } = this.props.screenProps;
        // if(!parent) return;
        global.count_news = count;
        global.change_notify = true;
        // parent.refreshView();
    }

    render() {
        return (
            <View style={styles.container}>
                {/* {this.renderLoading()} */}

                <ListView style={styles.list_view}
                    dataSource={this.state.dataSource}
                    // enableEmptySections={true}
                    onEndReachedThreshold={5}
                    // keyboardShouldPersistTaps={false}
                    renderSeparator={(sectionId, rowId) => <View key={rowId} style={styles.separator_view} />}
                    onEndReached={this.onLoadMore}
                    renderRow={(rowData) =>
                        // <Touchable onPress={this.onNewsClick.bind(this, rowData)}>
                        <NewItem
                            // ref={(itemRef)=>{this.refs[`news_item_${rowData.id}`]}}
                            data={rowData}
                            save={this.onNewsClick}
                            // navigation={this.props.screenProps.parentNavigation} 
                            />
                        // </Touchable>
                    }
                    refreshControl={
                        <RefreshControl
                            refreshing={this.state.refreshing}
                            onRefresh={this.onRefresh}
                        />
                    }
                />
                <EmptyDataView ref={(emptyDataView) => { this.emptyDataView = emptyDataView; }} />
                <LoadingView ref={(customLoading) => { this.customLoading = customLoading; }}
                    isShowOverlay={false} />
            </View>
        );
    }

    getMaxNewsReducer = (newsId, news) => Math.max(newsId, news.id);

    getMinNewsReducer = (newsId, news) => Math.min(newsId, news.id);

    saveMaxNewsId(newsId) {
        DataManager.saveSingleLocalData(Constant.CACHE.MAX_NEWS_ID, newsId, (error) => {
            console.log('saveLocalFlightId.error', error)
        });
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff'
    },

    list_view: {
        flex: 1
    },

    separator_view: {
        height: (Platform.OS === 'ios') ? 1 : 0.5,
        backgroundColor: '#ebebeb'
    }
});