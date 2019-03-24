import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    Dimensions,
    ListView
} from 'react-native';
import Touchable from 'react-native-platform-touchable';
import BaseComponent from '../../Core/View/BaseComponent';
import MyView from '../../Core/View/MyView';
import Loading from '../../Core/Common/LoadingView';
import EmptyDataView from '../../Core/Common/EmptyDataView';

import { scale, verticalScale, fontSize } from '../../Config/RatioScale';
let { width, height } = Dimensions.get('window');
// import ApiService from '../../Networking/ApiService';
// import Networking from '../../Networking/Networking';

/**
 * Hiển thị các kết quả tìm kiếm như tìm thành phố, quốc gia...
 */
export default class MyListView extends BaseComponent {
    constructor(props) {
        super(props);
        this.dataSource = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
        this.itemClickCallback = null;
        this.state = {
            isSearching: false,
        }
    }

    /**
     * Fill du lieu
     * @param {*} listData 
    */
    setFillData(listData, isShow = true) {
        if (!listData.length) {
            this.hide();
            return;
        }
        this.dataSource = this.dataSource.cloneWithRows(listData);
        if (isShow)
            this.show();
    }

    /**
     * An listview
    */
    hide() {
        if (!this.state.isSearching) return;
        this.setState({
            isSearching: false
        });
    }

    show() {
        this.setState({
            isSearching: true
        });
    }

    switchShow(listData = null) {
        if (listData) {
            this.setFillData(listData);
        }
        this.setState({
            isSearching: !this.state.isSearching
        });
    }

    /**
     * click vao 1 item
     * @param {*} data 
     */
    onItemClick(data) {
        this.hide();
        if (this.itemClickCallback) {
            this.itemClickCallback(data);
        }
    }

    getShowMsg(rowData) {
        //console.log("rowData : ",rowData);
        if (rowData.name) {
            return rowData.name;
        }
        if (rowData.userId) {
            return `${rowData.getUserId()} - ${rowData.getFullname()}`;
        }
        if (rowData.sub_title) {
            return rowData.getSubTitle();
        }
        if (rowData.sortname) {
            return rowData.sortname;
        }
    }

    showLoading() {
        if (this.searchLoading) {
            this.searchLoading.showLoading();
        }
    }

    hideLoading() {
        if (this.searchLoading) {
            this.searchLoading.hideLoading();
        }
    }

    render() {
        return (
            <MyView hide={!this.state.isSearching} style={{ position: 'absolute', backgroundColor: '#FFF', left: this.props.left ? this.props.left : 0, right: this.props.right ? this.props.right : scale(5), top: this.props.top, bottom: this.props.bottom, height: (this.props.bottom) ? null : verticalScale(200) }}>
                <ListView style={styles.list_spinner}
                    renderSeparator={(sectionId, rowId) => <View key={rowId} style={styles.listview_separator} />}
                    dataSource={this.dataSource}
                    keyboardShouldPersistTaps='always'
                    renderRow={(rowData, sectionID, itemId) =>
                        <Touchable onPress={this.onItemClick.bind(this, rowData)}>
                            <View style={{ height: verticalScale(40), justifyContent: 'center' }}>
                                <Text allowFontScaling={global.isScaleFont} style={{ marginLeft: scale(10), fontSize: fontSize(14), color: '#000' }}>{this.getShowMsg(rowData)}</Text>
                            </View>
                        </Touchable>
                    }
                />
                <EmptyDataView ref={(emptyDataView) => { this.emptyDataView = emptyDataView; }} />
                <Loading ref={(searchLoading) => { this.searchLoading = searchLoading; }}
                    isShowOverlay={false} />
            </MyView>
        );
    }
}

const styles = StyleSheet.create({
    list_spinner: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        borderColor: '#000',
        backgroundColor: '#fff',
        borderWidth: 1,
        // marginLeft: 10,
        // marginRight: 10
    },
    listview_separator: {
        height: 1,
        backgroundColor: '#E3E3E3',
    }
});