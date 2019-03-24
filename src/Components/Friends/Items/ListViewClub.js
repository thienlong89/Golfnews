import React from 'react';
import {
    StyleSheet,
    View,
    ListView,
    Animated
} from 'react-native';
import Touchable from 'react-native-platform-touchable';
import BaseComponent from '../../../Core/View/BaseComponent';
import CLBItem from './CLBItem';

const BOTTOM_HEIGHT = 110;

export default class ListViewClub extends BaseComponent {
    constructor(props) {
        super(props);
        this.itemClickCallback = null;
        this.loadMoreCallback = null;
        this.refreshCallback = null;
        this.isSearching = false;
        this.listData = [];
        this.state = {
            dataSource: new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 }),
            scrollY: this.props.scrollY
        }

        this.onLoadMore = this.onLoadMore.bind(this);
        this.onItemClick = this.onItemClick.bind(this);
    }

    /**
     * Fill du lieu
     * @param {*} listData 
    */
    setFillData(listData, isSearching = false) {
        //console.log("list data : ", listData);
        this.isSearching = isSearching;
        this.listData = listData;

        let dataSource = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
        this.setState({
            dataSource: dataSource.cloneWithRows(listData)
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
        console.log(" -- ", this.isSearching, this.listData.length);
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
        return (
            <View style={{ flex: 1 }}>
                <ListView style={styles.container_body_listview}
                    dataSource={this.state.dataSource}
                    onEndReachedThreshold={5}
                    keyboardShouldPersistTaps='always'
                    renderSeparator={(sectionId, rowId) => <View key={rowId} style={styles.separator_view} />}
                    onEndReached={this.onLoadMore}
                    enableEmptySections={true}
                    onScroll={Animated.event(
                        [{ nativeEvent: { contentOffset: { y: this.state.scrollY } } }],
                        // { useNativeDriver: true }
                    )}
                    renderRow={(rowData) =>
                        // <Touchable onPress={this.onItemClick.bind(this, rowData)}>
                        <CLBItem
                            data={rowData}
                            onItemClickCallback={this.onItemClick}
                            clbId={rowData.getClub().getId()}
                            clbName={rowData.getClub().getName()}
                            totalMember={rowData.getClub().getTotalMember()}
                            logoUrl={rowData.getClub().getLogo()} />
                        // </Touchable>
                    }
                // refreshControl={
                //     <RefreshControl
                //         refreshing={false}
                //         onRefresh={this.onRefresh.bind(this)}
                //     />
                // }
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