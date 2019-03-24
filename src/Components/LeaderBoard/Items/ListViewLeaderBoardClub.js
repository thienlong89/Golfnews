import React from 'react';
import {
    StyleSheet,
    View,
    ListView,
    FlatList
} from 'react-native';
import Touchable from 'react-native-platform-touchable';
import BaseComponent from '../../../Core/View/BaseComponent';
import CLBItem from './LeaderBoardCLBItem';
import EmptyDataView from '../../../Core/Common/EmptyDataView';

/**
 * Custom listview trong man hình BXH
 */
export default class ListViewLearderBoard extends BaseComponent {
    constructor(props) {
        super(props);
        this.itemClickCallback = null;
        this.loadMoreCallback = null;
        this.refreshCallback = null;
        this.isSearching = false;
        this.listData = [];
        this.state = {
            dataSource: this.listData //new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 })
        }

        this.onLoadMore = this.onLoadMore.bind(this);
        this.onItemClick = this.onItemClick.bind(this);
    }

    /**
     * Fill du lieu
     * @param {*} listData 
    */
    setFillData(listData, isSearching = false) {
        console.log("list data : ", listData);
        this.isSearching = isSearching;
        this.listData = listData;
        // let dataSource = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
        this.setState({
            dataSource: listData //dataSource.cloneWithRows(listData)
        }, () => {
            if (listData.length) {
                this.emptyDataView.hideEmptyView();
            } else {
                this.emptyDataView.showEmptyView();
            }
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
        console.log("onLoadMore");
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

    render() {
        let {
            dataSource
        } = this.state;
        return (
            <View style={{ flex: 1 }}>
                <FlatList
                    data={dataSource}
                    onEndReached={this.onLoadMore}
                    onEndReachedThreshold={0.2}
                    keyboardShouldPersistTaps='always'
                    initialNumToRender={5}
                    ItemSeparatorComponent={(sectionId, rowId) => <View key={rowId} style={styles.separator_view} />}
                    enableEmptySections={true}
                    keyExtractor={item => item.id}
                    renderItem={({ item }) =>
                        <CLBItem
                            onItemClickCallback={this.onItemClick}
                            data={item}
                        />

                    }
                />
                <EmptyDataView ref={(emptyDataView) => { this.emptyDataView = emptyDataView; }} />
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