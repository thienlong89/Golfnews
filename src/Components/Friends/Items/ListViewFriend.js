import React from 'react';
import {
    StyleSheet,
    View,
    ListView,
    Platform,
    RefreshControl,
    Animated,
    FlatList
} from 'react-native';
import Touchable from 'react-native-platform-touchable';
import BaseComponent from '../../../Core/View/BaseComponent';
import FriendItem from './FriendItem';

import { scale, verticalScale, moderateScale } from '../../../Config/RatioScale';

const BOTTOM_HEIGHT = 120;
/**
 * Custom listvie trong man hình bạn bè
 */
export default class ListViewFriend extends BaseComponent {
    constructor(props) {
        super(props);
        this.itemClickCallback = null;
        this.loadMoreCallback = null;
        this.refreshCallback = null;
        this.isSearching = false;
        this.listData = [];
        this.refFriendItem = [];
        this.itemPosition = -1;
        this.ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
        this.state = {
            dataSource: this.ds.cloneWithRows([]),
            scrollY: this.props.scrollY
        }

        this.onRefresh = this.onRefresh.bind(this);
        this.onLoadMore = this.onLoadMore.bind(this);
        // this.onItemClick = this.onItemClick.bind(this);
        this.onChangeMyTeePress = this.onChangeMyTeePress.bind(this);
    }

    /**
     * Fill du lieu
     * @param {*} listData 
    */
    setFillData(listData, isSearching = false, teeSelected = {}, position = -1) {
        this.isSearching = isSearching;
        this.listData = listData;
        this.itemPosition = position;
        this.setState({
            dataSource: this.ds.cloneWithRows(listData)
        });
    }

    setTeeSelected(listData = [], teeSelected = {}) {
        this.setState({
            dataSource: this.ds.cloneWithRows(listData)
        });
    }

    /**
     * click vao 1 item
     * @param {*} data 
     */
    onItemClick(data) {
        if (this.itemClickCallback) {
            this.itemClickCallback(data);
        }
    }

    showLoading() {
        if (this.internalLoading) {
            this.internalLoading.showLoading();
        }
    }

    hideLoading() {
        if (this.internalLoading) {
            this.internalLoading.hideLoading();
        }
    }

    onLoadMore() {
        if (this.isSearching || this.listData.length < 10) return;
        if (this.loadMoreCallback) {
            this.loadMoreCallback();
        }
    }

    onRefresh() {
        if (this.refreshCallback) {
            this.refreshCallback();
        }
    }

    onChangeMyTeePress(friendModel) {
        // this.isCheckHandicapAll = false;
        // this.refPopupSelectTeeView.setVisible(this.teeListAvailable, { friendModel, index: -1, isMe: true });
        let { onChangeTeePress } = this.props;
        if (onChangeTeePress) {
            onChangeTeePress(friendModel);
            // this.renderItem(friendModel);
        }
    }

    /**
     * render lai item khi check cap
     * @param {*} data 
     */
    renderItem(data) {
        console.log('render item...................... ', data);
        if (Platform.OS === 'android') {
            if (!data && !data.length) return;
            let userId = data.userId.toLowerCase();
            let element = this.refFriendItem[userId];
            if (element) {
                console.log('render lai item');
                element.reRender();
            }
        } else {
            this.setFillData(this.listData);
        }
    }

    render() {
        return (
            <View style={{ flex: 1 }}>
                <ListView style={styles.container_body_listview}
                    dataSource={this.state.dataSource}
                    onEndReachedThreshold={5}
                    keyboardShouldPersistTaps='always'
                    renderSeparator={(sectionId, rowId) => <View key={rowId} style={styles.separator_view} />}
                    onEndReached={this.onLoadMore}
                    // enableEmptySections={true}
                    onScroll={Animated.event(
                        [{ nativeEvent: { contentOffset: { y: this.state.scrollY } } }],
                        // { useNativeDriver: true }
                    )}
                    renderRow={(rowData, s, index) =>
                        <Touchable onPress={this.onItemClick.bind(this, rowData.userId)}>
                            <FriendItem
                                ref={(itemRef) => { this.refFriendItem[rowData.userId.toLowerCase()] = itemRef; }}
                                onChangeTeePress={this.onChangeMyTeePress}
                                data={rowData} />
                        </Touchable>
                    }
                    refreshControl={
                        <RefreshControl
                            refreshing={false}
                            onRefresh={this.onRefresh}
                        />
                    }
                />
                {this.renderInternalLoading()}
            </View>
        );
    }

    onChangeTeePress(FriendModel, index) {
        if (this.props.onChangeTeePress) {
            this.props.onChangeTeePress(FriendModel, index);
        }
    }
}

const styles = StyleSheet.create({
    separator_view: {
        height: 1,
        backgroundColor: '#E3E3E3'
    },

    container_body_listview: {
        marginTop: verticalScale(1),
        paddingBottom: 1,
        paddingLeft: 0,
        paddingRight: 0,
    }
});