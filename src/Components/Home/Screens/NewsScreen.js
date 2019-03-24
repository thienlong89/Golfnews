import React from 'react';
import {
    StyleSheet,
    // InteractionManager,
    View,
    // Dimensions,
    // Alert,
    // Image,
    // ListView,
    RefreshControl,
    Platform,
    // Animated,
    FlatList
} from 'react-native';
// import Touchable from 'react-native-platform-touchable';
// import BaseComponent from '../../../Core/View/BaseComponent';
// import HeaderView from '../../Common/HeaderView';
import ApiService from '../../../Networking/ApiService';
import Networking from '../../../Networking/Networking';
import NewsModel from '../../../Model/News/NewsModel';
import NewsItemModel from '../../../Model/News/NewsItemModel';
import NewItem from '../../News/Items/NewsItem';//'../..//Items/NewsItem';
import EmptyDataView from '../../../Core/Common/EmptyDataView';
import LoadingView from '../../../Core/Common/LoadingView';
import { NavigationActions } from 'react-navigation';
import { insertNews, queryNews, updateNews, deleteNewsArrayId } from '../../../DbLocal/NewsRealm';
import _ from 'lodash';
import DataManager from '../../../Core/Manager/DataManager';
import Constant from '../../../Constant/Constant';
import HeaderScreen from './HeaderScreen';

import I18n from 'react-native-i18n';
import BaseComponentAddBackHandler from '../../../Core/View/BaseComponentAddBackHandler';
import { verticalScale } from '../../../Config/RatioScale';
require('../../../../I18n/I18n');
const NUMBER_PAGING = 10;

const option_keys = {
    CHOOSEN_IS_READED: 'choosen_is_readed',
}

const options = [
    {
        key: 'all',
        value: I18n.t('all')
    },
    {
        key: 'notify',
        value: I18n.t('notify'),
    },
    {
        key: 'advertising',
        value: I18n.t('advertising'),
    },
    {
        key: 'tournaments',
        value: I18n.t('tournaments'),
    },
    {
        key: 'news',
        value: I18n.t('news')
    },
    {
        key: option_keys.CHOOSEN_IS_READED,
        value: I18n.t('tick_all_readed')
    }
]

export default class NewsScreen extends BaseComponentAddBackHandler {
    constructor(props) {
        super(props);
        this.page = 1;
        this.list_news = [];
        this.list_id_readed = [];

        this.lodashData = [];
        this.maxNewsId = 0;
        this.minNewsId = 0;
        this.state = {
            refreshing: false,
            dataSource: [],//new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 }),
            scrollY: this.props.scrollY
            //count_notify : 
        }

        this.onLoadMore = this.onLoadMore.bind(this);
        this.onRefresh = this.onRefresh.bind(this);
        this.onNewsClick = this.onNewsClick.bind(this);

        //=========================================END======================================
        let { screenProps } = this.props;
        if (screenProps) {
            this.scroll = screenProps.scroll;
        } else {
            this.scroll = null;
        }

        this.onFlatlistScroll = this.onFlatlistScroll.bind(this);
        this.flatListOffset = 0;

        this.obj_page_filter = {};

        this.type_filter = 'ALL';

        this.obj_list_fillter = {};

        this.obj_filter_lock = {};

        this.lock_page = false;
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

    /**
     * Đánh dấu là đã đọc hết các tin nhắn
     */
    requestTickIsReaded() {
        let url = this.getConfig().getBaseUrl() + ApiService.view_all();
        console.log('................. url news is readed all : ', url);
        this.customLoading.showLoading();
        let self = this;
        Networking.httpRequestGet(url, (jsonData) => {
            self.customLoading.hideLoading();
            // console.log('.................. danh dau la da doc : ',jsonData);
            let { error_code, data, error_msg } = jsonData;
            if (error_code === 0) {
                for (let notify of this.list_notification) {
                    notify.is_view = 1;
                }
                let keys = Object.keys(self.obj_list_fillter);
                for (let key of keys) {
                    let list = self.obj_list_fillter[key];
                    list.forEach(d => d.is_view = 1);
                    self.obj_list_fillter[key] = list;
                }

                if (self.type_filter === option_keys.ALL) {
                    self.setState({
                        dataSource: self.list_news
                    })
                } else {
                    let list = self.obj_list_fillter[self.type_filter];
                    self.setState({
                        dataSource: list
                    });
                }

                self.hideCountNoti();
            }
        }, () => {
            self.customLoading.hideLoading();
        })
    }

    hideCountNoti() {
        let _component = StaticProps.getMainAppComponent();
        if (_component) {
            _component.updateCountNews(0);
        }
    }

    handleFilter(type) {
        switch (type) {
            case option_keys.CHOOSEN_IS_READED:
                this.requestTickIsReaded();
                break;
            default:
                this.requestFilterNews(type);
                break;
        }
    }

    requestFilterNews(type) {
        let page = 1;
        let number = 20;
        let key = type.toUpperCase();//.toString();
        this.type_filter = key;
        if (this.type_filter === 'ALL') {
            // let ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
            this.setState({
                dataSource: this.list_news //ds.cloneWithRows(this.list_notification)
            });
            if (this.list_news.length) {
                this.emptyDataView.hideEmptyView();
            }
            return;
        }

        if (this.obj_page_filter.hasOwnProperty(key)) {
            page = this.obj_page_filter[key];
            // page++;
            // this.obj_page_filter[key]++;
        } else {
            this.obj_page_filter[key] = page;
        }
        let url = this.getConfig().getBaseUrl() + ApiService.news_filter(Constant.NEWS_FILTE_TYPE[key], page, number);
        console.log('............................. url filter : ', url, this.type_filter);
        this.customLoading.showLoading();
        let self = this;
        Networking.httpRequestGet(url, (jsonData) => {
            self.customLoading.hideLoading();

            let model = new NewsModel(self);
            model.parseData(jsonData);
            if (model.getErrorCode() === 0) {
                let listFilter = model.getListNews();
                //fake tam
                listFilter.forEach(d => {
                    d.type = (self.type_filter === 'ADVERTISING') ? 2 : 1;
                });

                if (!listFilter.length) {
                    self.obj_filter_lock[self.type_filter] = true;
                }
                // let ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });

                // console.log('............filter lenght : ', listFilter.length,listFilter);

                if (self.obj_list_fillter.hasOwnProperty(self.type_filter)) {
                    let list = self.obj_list_fillter[self.type_filter];

                    // console.log('............list length : ',list.length);
                    listFilter = [...list, ...listFilter];
                    self.obj_list_fillter[self.type_filter] = [...listFilter];
                } else {
                    //luu lai vao mang
                    self.obj_list_fillter[self.type_filter] = listFilter;
                }

                // console.log('...................listFilter after : ',listFilter.length);

                if (listFilter.length) {
                    self.emptyDataView.hideEmptyView();
                    self.setState({
                        dataSource: listFilter //ds.cloneWithRows(listFilter)
                    });
                } else {
                    self.setState({
                        dataSource: [] //ds.cloneWithRows([])
                    });
                    self.emptyDataView.showEmptyView();
                }
            }
        }, () => {
            self.customLoading.hideLoading();
        });
    }

    componentDidMount() {
        global.change_notify = true;
        this.addListenerBackHandler();
        this.header.filterCallback = this.handleFilter.bind(this);
        this.sendRequestListNews();
        // queryNews()
        //     .then(({ allNews, unReadCount }) => {
        //         console.log('unReadCount', unReadCount)
        //         if (allNews.length > 0) {
        //             let newsList = [];
        //             allNews.map((newItem) => {
        //                 // console.log('queryFinishFlight.round.jsonData', round.jsonData);
        //                 let obj = new NewsItemModel();
        //                 obj.parseData(JSON.parse(newItem.jsonData));
        //                 newsList.push(obj);
        //             })
        //             // console.log('queryFinishFlight.rounds', rounds);
        //             this.lodashData = _.chunk(newsList, NUMBER_PAGING);
        //             console.log('queryFinishFlight.lodashData', this.lodashData.length);
        //             this.list_news = this.lodashData[this.page];
        //             this.setState({
        //                 dataSource: this.list_news//this.state.dataSource.cloneWithRows(this.list_news)
        //             }, () => {
        //                 this.maxNewsId = allNews.reduce(this.getMaxNewsReducer, allNews[0].id);
        //                 this.minNewsId = allNews.reduce(this.getMinNewsReducer, allNews[0].id);
        //                 console.log('this.maxNewsId', this.maxNewsId);
        //                 console.log('this.minNewsId', this.minNewsId);
        //                 this.saveMaxNewsId(this.maxNewsId.toString());
        //                 this.setUnReadNewsCount(unReadCount);
        //                 if (this.maxNewsId) {
        //                     this.requestRefreshListNews(true, true);
        //                 }
        //             })
        //         } else {
        //             this.sendRequestListNews();
        //         }
        //     })
        //     .catch(error => {
        //         console.log('queryNews.error', error);
        //         this.sendRequestListNews();
        //     });
        // InteractionManager.runAfterInteractions(() => {
        //     this.setTabChange();
        // })
    }

    componentWillUnmount() {
        this.removeListenerBackHandler();
    }

    // setTabChange(offset) {
    //     console.log('setTabChange')
    //     if (this.refFlatList)
    //         this.refFlatList.scrollToOffset({ offset: verticalScale(110), animated: true });
    // }

    saveNewsReaded() {
        let sortArray = this.list_id_readed.sort((r1, r2) => r1 - r2);
        global.list_notify_id_readed = sortArray;
        console.log("SAVE mang news id sau khi sap xep la : ", sortArray);
        DataManager.saveListNews(JSON.stringify(sortArray));
    }

    sendRequestListNews() {
        this.customLoading.showLoading();
        let self = this;
        let url = this.getConfig().getBaseUrl() + ApiService.news_list(this.page);
        console.log('news url : ', url);
        Networking.httpRequestGet(url, (jsonData) => {
            self.customLoading.hideLoading();
            self.model = new NewsModel(self);
            self.model.parseData(jsonData);
            if (self.model.getErrorCode() === 0) {
                let news = self.model.getListNews();
                console.log('........................... news : ', news.length);
                if (news.length) {
                    // self.list_news.reverse();
                    self.list_news = [...self.list_news, ...news];
                    self.emptyDataView.hideEmptyView();
                    self.setState({
                        dataSource: self.list_news//self.state.dataSource.cloneWithRows(self.list_news),
                    }, () => {
                        // insertNews(self.list_news);
                        // self.maxNewsId = self.list_news.reduce(self.getMaxNewsReducer, self.list_news[0].id);
                        // self.minNewsId = self.list_news.reduce(self.getMinNewsReducer, self.list_news[0].id);
                        // console.log('this.maxNewsId', self.maxNewsId);
                        // console.log('this.minNewsId', self.minNewsId);
                        // self.saveMaxNewsId(self.maxNewsId.toString());
                    });
                } else {
                    self.lock_page = true;
                    if (self.page <= 1) {
                        self.emptyDataView.showEmptyView();
                    }
                }
            } else {
                if (self.page <= 1) {
                    self.emptyDataView.showEmptyView();
                }
            }
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
                        dataSource: this.list_news//this.state.dataSource.cloneWithRows(this.list_news)
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
        // console.log('.......................... length : ', this.list_news.length);
        // if (!this.customLoading || this.list_news.length < 10 || (this.customLoading && this.customLoading.isLoading())) return;
        // this.page++;
        // this.sendRequestListNews();
        if (!this.customLoading || this.list_news.length < 10) return;
        // console.log('onLoadMore', this.lodashData.length, this.page)

        if (this.type_filter === 'ALL') {

            // if (this.page < this.lodashData.length - 1) {
            //     this.page++;
            //     this.list_notification = [...this.list_notification, ...this.lodashData[this.page]];
            //     this.setState({
            //         dataSource: this.state.dataSource.cloneWithRows(this.list_notification)
            //     })
            // } else {
            //     this.requestRefreshListNotify(false);
            // }
            if (this.lock_page) return;
            this.page++;
            this.sendRequestListNews();
        } else {
            //load more theo filter
            if (this.obj_filter_lock[this.type_filter]) return;
            this.obj_page_filter[this.type_filter]++;
            this.requestFilterNews(this.type_filter);
        }

    }

    /**
     * refresh lai dữ liệu
     */
    onRefresh() {
        // if (!this.customLoading || (this.customLoading && this.customLoading.isLoading())) return;
        // // this.requestRefreshListNews(true);
        // this.page = 1;
        // this.list_news = [];
        // this.sendRequestListNews();

        if (!this.customLoading || (this.customLoading.isLoading())) return;

        if (this.type_filter === 'ALL') {
            // this.requestRefreshListNotify(true);
            this.lock_page = false;
            this.page = 1;
            this.list_news = [];
            this.sendRequestListNews();
        } else {
            // let page = this.obj_page_filter[this.type_filter];
            // page++;
            this.obj_filter_lock[this.type_filter] = false;
            this.obj_page_filter[this.type_filter] = 1;
            this.requestFilterNews(this.type_filter);
        }
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
                {/* <Animated.View style={{ transform: [{ translateY: this.props.tabY }], zIndex: 2, position: 'absolute', top: this.home_page_title_padding_top, backgroundColor: '#fff' }}> */}
                <HeaderScreen ref={(header) => { this.header = header; }} count={0} title={this.t('news').toUpperCase()} show={true} color={'#00aba7'} options={options} />
                {/* </Animated.View> */}
                <FlatList
                    ref={(refFlatList) => { this.refFlatList = refFlatList; }}
                    style={styles.list_view}
                    data={this.state.dataSource}
                    // enableEmptySections={true}
                    onEndReachedThreshold={5}
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
                    // keyboardShouldPersistTaps={false}
                    // renderSeparator={(sectionId, rowId) => <View key={rowId} style={styles.separator_view} />}
                    onEndReached={this.onLoadMore}
                    renderItem={({ item, index }) =>
                        // <Touchable onPress={this.onNewsClick.bind(this, rowData)}>
                        <NewItem
                            // ref={(itemRef)=>{this.refs[`news_item_${rowData.id}`]}}
                            data={item}
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
                // contentContainerStyle={{ paddingTop: this.home_page_scroll_padding_top }}
                />
                <EmptyDataView
                    ref={(emptyDataView) => { this.emptyDataView = emptyDataView; }}
                // customStyle={{ paddingTop: this.home_page_scroll_padding_top }}
                />
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
        flex: 1,
        // marginBottom: 100
    },

    separator_view: {
        height: (Platform.OS === 'ios') ? 1 : 0.5,
        backgroundColor: '#ebebeb'
    }
});