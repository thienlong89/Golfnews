import React from 'react';
import { ListView, RefreshControl, FlatList, View, Dimensions } from "react-native";
import 'core-js/es6/symbol';
import 'core-js/fn/symbol/iterator';
import ItemNews from './ItemNews';
import BaseComponent from '../../../../../Core/View/BaseComponent';
import CustomLoadingView from '../../../../Common/CustomLoadingView';
import PropStatic from '../../../../../Constant/PropsStatic';
import ItemVideo from './ItemVideo';


export default class ListSearchView extends BaseComponent {
    constructor(props) {
        super(props);
        this.loadMoreCallback = null;
        this.data = [];
        this.onLoadMore = this.onLoadMore.bind(this);
        this.getLayoutItem = this.getLayoutItem.bind(this);
        this.viewabilityConfig = {
            waitForInteraction: true,
            viewAreaCoveragePercentThreshold: 95
        }

        this.onItemClick = this.onItemClick.bind(this);
        this.type = this.props.type;
        this.onItemVideoClick = this.onItemVideoClick.bind(this);
        this.mode_share = this.props.mode_share;

        this.onRefresh = this.onRefresh.bind(this);
        this.onRefreshCallback = null;
    }

    /**
     * fill dữ liệu lên view
     * @param {Array} listData 
     * @param {*} enableScroll 
     * @param {*} index 
     */
    fillData(listData,more, callback = null) {
        console.log('....................fill data length : ', listData.length);
        this.hideLoading();
        this.data = more ? [...this.data,...listData] : [...listData];//.reverse();

        this.setState({
            // dataSource: dataSource.cloneWithRows(listData)
        }, () => {
            setTimeout(() => {
                if(callback){
                    callback();
                }
            }, 200);
        });
    }

    scrollEnd() {
        if (this.listView) {
            this.listView.scrollToEnd({ animated: true });
        }
    }

    scrollToIndex(index) {
        if (this.listView && index >= 0) {
            this.listView.scrollToIndex({ animated: true, index: index, viewPosition: 1 });
        }
    }

    /**
     * Load tin nhan truoc do
     */
    onLoadMore() {
        if(this.data.length < 10) return;
        if (this.loadMoreCallback) {
            // this.showLoading();
            this.loadMoreCallback();
        }
    }

    onRefresh(){
        if(this.onRefreshCallback){
            this.onRefreshCallback();
        }
    }

    onItemClick(data) {
        let navigation = PropStatic.getAppSceneNavigator();
        if (!navigation) return;
        navigation.navigate('news_detail', { title: data.category.title ? data.category.title : '', slug: data.slug ? data.slug : null });
    }

    _keyExtractor = (item, index) => index;

    renderCommentItem = ({ item }) => (
        <ItemNews
            // ref={(itemView) => { this.refs[`news_item_${item.createdAt}`] = itemView; }}
            data={item}
            onItemClick={this.onItemClick}
        />);

    renderItemVideo = ({ item }) => {
        return (
            <ItemVideo
                // ref={(itemView) => { this.refs[`news_item_${item.createdAt}`] = itemView; }}
                data={item}
                onItemClick={this.onItemVideoClick}
            />
        );
    }

    renderItemView = ({ item }) => {
        if (!item.category || !item.category.parent || !item.category.parent.slug) return null;
        if (item.category.parent.slug.toLowerCase() === 'tin-tuc') {
            return (
                <ItemNews
                    // ref={(itemView) => { this.refs[`news_item_${item.createdAt}`] = itemView; }}
                    mode_share={this.mode_share ? this.mode_share : null}
                    data={item}
                    onItemClick={this.onItemClick}
                />
            );
        } else if (item.category.parent.slug.toLowerCase() === 'video') {
            return (
                <ItemVideo
                    // ref={(itemView) => { this.refs[`news_item_${item.createdAt}`] = itemView; }}
                    data={item}
                    mode_share={this.mode_share ? this.mode_share : null}
                    onItemClick={this.onItemVideoClick}
                />
            );
        }
        return null;
    }



    onItemVideoClick(data) {
        let navigation = PropStatic.getAppSceneNavigator();
        if (!navigation) return;
        navigation.navigate('video_play', { youtube_id: data.youtubeId, title: data.category.title ? data.category.title : '', slug: data.slug ? data.slug : null });
    }

    renderRow(data) {
        let name = 'new_item_' + data.createdAt;
        console.log("__________________________renderRow ", name);
        let com = this.refs[name];
        console.log("renderRow name : ", name);
        if (com) {
            //render item
            let data = com.props.data;
            console.log("render row item ", data);
            data.send_status = true;
            // com.setState({});
            com.updateStateSend();
        }
    }

    getLayoutItem(data, index) {
        // this.scrollEnd();
        console.log("getLayout Item.........................", data.length, index);
        // this.scrollToIndex(this.indexScroll);
        return { length: data.length, offset: 0, index }
    }

    /**
    * Hiển thị loading internal có check timeout
    */
    showLoading() {
        console.log('..................................... load more show : 1');
        if (!this.custumLoading) return;
        this.custumLoading.showLoading();
        this.setLoadingTimeOut();
    }

    /**
     * Ẩn hiển thị loading internal tắt cả timeout
     */
    hideLoading() {
        if (!this.custumLoading) return;
        this.custumLoading.hideLoading();
        if (this.loadingInterval) {
            clearInterval(this.loadingInterval);
        }
    }

    scrollToTop() {
        console.log('...................... scrollToTop 0');
        if (this.listView) {
            console.log('...................... scrollToTop 1');
            this.listView.scrollToOffset({ offset: 0, animated: true });
        }
    }

    /**
     * Hàm set thời gian timeout của một request lên sever
     * @param {number} time - thời gian timeout
     * @default {TIME_OUT_FOR_REQUEST}
     */
    setLoadingTimeOut(time = 30000) {
        this.loadingInterval = setInterval(() => {
            if (this.custumLoading) {
                this.custumLoading.hideLoading();
            }
            clearInterval(this.loadingInterval);
        }, time);
    }

    render() {
        let data = this.data;
        return (
            <View style={{ flex: 1, paddingBottom: 10 }}>
                <FlatList
                    // viewabilityConfig={this.viewabilityConfig}
                    // onLayout={(event)=>{
                    //     const { x, y, width, height } = event.nativeEvent.layout;
                    //     console.log('.............................. list manager chat : ',x,y,height);
                    // }}
                    style={{ flex: 1 }}
                    ref={(listView) => { this.listView = listView; }}
                    data={data}
                    shouldItemUpdate={(props, nextProps) => {
                        return props.item !== nextProps.item
                    }}
                    // extraData={this.state}
                    // refreshing={false}
                    disableVirtualization={true}

                    // contentOffset={{ x: 0, y: scr_h }}

                    onEndReachedThreshold={2}
                    // initialNumToRender={8}
                    // maxToRenderPerBatch={2}
                    keyboardShouldPersistTaps={false}//'always'
                    enableEmptySections={true}
                    onEndReached={this.onLoadMore}
                    legacyImplementation={false}
                    // onRefresh={this.onLoadPreChat.bind(this)}
                    refreshing={false}
                    keyExtractor={this._keyExtractor}
                    // initialScrollIndex={this.enableScroll ? data.length-1 : null}
                    // onViewableItemsChanged={this.onItemsChanges}
                    // renderItem={this.type === 2 ? this.renderItemVideo : this.renderCommentItem}
                    renderItem={this.renderItemView}

                    // scrollsToTop={false}
                    scrollEnabled={true}
                    // onContentSizeChange={(w, h) => {
                    //     // console.log('...........................w,h : ', w, h);
                    //     this.preHeight = h;
                    //     setTimeout(() => {
                    //         this.preHeight = h;
                    //         if (this.listView) {
                    //             this.listView.scrollToEnd({ animated: true });
                    //         }
                    //     }, 200);
                    // }}

                    // removeClippedSubviews={true}
                    // getItemLayout={this.getLayoutItem}
                    // inverted
                    refreshControl={
                        <RefreshControl
                            refreshing={false}
                            onRefresh={this.onRefresh}
                        />
                    }
                />
                <CustomLoadingView backgroundColor={'white'} top={3} ref={(custumLoading) => { this.custumLoading = custumLoading; }} />
            </View>
        );
    }
}