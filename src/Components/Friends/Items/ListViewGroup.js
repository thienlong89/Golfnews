import React from 'react';
import {
    StyleSheet,
    View,
    FlatList,
    RefreshControl,
    Animated
} from 'react-native';
import Touchable from 'react-native-platform-touchable';
import BaseComponent from '../../../Core/View/BaseComponent';
import GroupItem from './GroupItem';

const BOTTOM_HEIGHT = 110;

export default class ListViewGroup extends BaseComponent {
    constructor(props) {
        super(props);
        this.itemClickCallback = null;
        this.loadMoreCallback = null;
        this.refreshCallback = null;
        this.isSearching = false;
        this.listData = [];
        this.state = {
            dataSource: this.listData, //new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 }),
            scrollY: this.props.scrollY
        }

        this.onItemClick = this.onItemClick.bind(this);
        this.onLoadMore = this.onLoadMore.bind(this);
        this.onRefresh = this.onRefresh.bind(this);
        this.removeListView = this.removeListView.bind(this);
        this.onScrollCallback = this.onScrollCallback.bind(this);
        this.onItemLongPress = this.onItemLongPress.bind(this);
    }

    /**
     * Fill du lieu
     * @param {*} listData 
    */
    setFillData(listData, isSearching = false) {
        //console.log("list data : ", listData);
        this.isSearching = isSearching;
        this.listData = listData;
        // let dataSource = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
        this.setState({
            dataSource: this.listData //dataSource.cloneWithRows(listData)
        });
    }

    /**
     * click vao 1 item
     * @param {*} data 
     */
    onItemClick(data) {
        console.log("click group item data : ", data);
        if (this.itemClickCallback) {
            this.itemClickCallback(data);
        }
    }

    onItemLongPress(data, index) {
        if (this.props.onItemLongPress) {
            this.props.onItemLongPress(data, index);
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

    removeListView(data) {
        console.log("remove from listview ", data);
        this.listData = this.getAppUtil().remove(this.listData, data);
        // let dataSource = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
        this.setState({
            dataSource: this.listData //dataSource.cloneWithRows(this.listData)
        });
    }

    onScrollCallback(event) {
        if (this.props.scrollY) {
            this.props.scrollY(event);
        }
    }

    render() {
        let {
            dataSource
        } = this.state;

        return (
            <View style={{ flex: 1 }}>
                <FlatList style={styles.container_body_listview}
                    data={dataSource}
                    onEndReachedThreshold={5}
                    keyboardShouldPersistTaps='always'
                    ItemSeparatorComponent={(sectionId, rowId) => <View key={rowId} style={styles.separator_view}></View>}
                    onEndReached={this.onLoadMore}
                    enableEmptySections={true}
                    renderItem={({ item, index }) =>
                        // <Touchable onPress={this.onItemClick.bind(this, rowData)}>
                        <GroupItem
                            // groupId={rowData.groupId}
                            // groupName={rowData.groupName}
                            // totalMember={rowData.totalMember}
                            // logoUrl={rowData.logoUrl}
                            // created_at={rowData.created_at}
                            data={item}
                            index={index}
                            onItemClick={this.onItemClick}
                            // isHost= {(this.getAppUtil().replaceUser(this.getUserInfo().getId()) === this.getAppUtil().replaceUser(rowData['user_host'])) ? true : false}
                            removeListView={this.removeListView}
                            onItemLongPress={this.onItemLongPress}
                        />
                        // </Touchable>
                    }
                    refreshControl={
                        <RefreshControl
                            refreshing={false}
                            onRefresh={this.onRefresh}
                        />
                    }
                    onScroll={this.onScrollCallback}
                />
                {this.renderInternalLoading()}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    separator_view: {
        height: 1,
        backgroundColor: '#E3E3E3'
    },

    container_body_listview: {
        marginTop: 1,
        paddingBottom: 1,
        paddingLeft: 0,
        paddingRight: 0
    }
});