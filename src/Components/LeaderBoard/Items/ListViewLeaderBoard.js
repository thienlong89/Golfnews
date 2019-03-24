import React from 'react';
import {
    StyleSheet,
    View,
    ListView,
    FlatList
} from 'react-native';
import Touchable from 'react-native-platform-touchable';
import BaseComponent from '../../../Core/View/BaseComponent';
import LeaderBoardUserItem from './LeaderBoardUserItem';
import FooterComponent from '../../Home/Item/FooterComponent'
import { verticalScale } from '../../../Config/RatioScale';

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
            dataSource: []//new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 })
        }

        this.onLoadMore = this.onLoadMore.bind(this);
    }

    componentDidMount() {
        this.showLoading();
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
            dataSource: listData//dataSource.cloneWithRows(listData)
        }, () => {
            if (this.refFooterComponent)
                this.refFooterComponent.setLoadingState(false);
        });
    }

    showLoading() {
        if (this.refFooterComponent)
            this.refFooterComponent.setLoadingState(true);
    }

    dismissLoading() {
        console.log('refFooterComponent')
        if (this.refFooterComponent)
            this.refFooterComponent.setLoadingState(false);
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

    // showLoading() {
    //     if (this.internalLoading) {
    //         this.internalLoading.showLoading();
    //     }
    // }

    hideLoading() {
        if (this.internalLoading) {
            this.internalLoading.hideLoading();
        }
    }

    onLoadMore() {
        console.log(" -- ", this.isSearching, this.listData.length);
        if (this.isSearching || this.listData.length < 10) return;
        if (this.loadMoreCallback) {
            this.loadMoreCallback();
            this.showLoading();
        }
    }

    onRefresh() {
        if (this.refreshCallback) {
            this.refreshCallback();
        }
    }

    render() {
        return (
            <View style={{ flex: 1 }}>
                <FlatList style={styles.container_body_listview}
                    data={this.state.dataSource}
                    onEndReachedThreshold={0.2}
                    ItemSeparatorComponent={(sectionId, rowId) => <View key={rowId} style={styles.separator_view} />}
                    onEndReached={this.onLoadMore}
                    enableEmptySections={true}
                    initialNumToRender={5}
                    keyboardShouldPersistTaps='always'
                    keyExtractor={item => item.id}
                    // getItemLayout={(data, index) => ({
                    //     length: verticalScale(60),
                    //     offset: verticalScale(60) * index,
                    //     index
                    // })}
                    ListFooterComponent={() => <FooterComponent ref={(refFooterComponent) => { this.refFooterComponent = refFooterComponent; }} />}
                    renderItem={({ item, index }) =>
                        <Touchable onPress={this.onItemClick.bind(this, item)}>
                            <LeaderBoardUserItem
                                data={item}
                            />
                        </Touchable>
                    }
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