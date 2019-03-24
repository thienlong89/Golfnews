import React, { Component, PureComponent } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    Dimensions,
    FlatList
} from 'react-native';
// import Touchable from 'react-native-platform-touchable';
import BaseComponent from '../../Core/View/BaseComponent';
import MyView from '../../Core/View/MyView';
// import ApiService from '../../Networking/ApiService';
// import Networking from '../../Networking/Networking';
// import FacilityCourseModel from '../../Model/Facility/FacilityCourseModel';
import CheckHandicapItem from './CheckHandicapItem';
import SearchLoading from '../../Core/Common/LoadingView';

import { scale, verticalScale, moderateScale } from '../../Config/RatioScale';
// let{width,height} = Dimensions.get('window');

/**
 * hiển thị kết quả tìm kiếm ra listview, component này đi chung với component CheckHandicapView
 */
export default class ListViewShow extends PureComponent {
    constructor(props) {
        super(props);
        this.itemClickCallback = null;
        this.state = {
            isSearching: false,
            dataSource: []
        }

        this.onItemClick = this.onItemClick.bind(this);
    }

    /**
     * Fill du lieu
     * @param {*} listData 
     */
    setFillData(listData) {
        // let dataSource = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
        // this.dataSource = dataSource.cloneWithRows(listData);
        // this.show();
        this.setState({
            dataSource: listData,
            isSearching: true
        })
    }

    /**
     * An listview
     */
    hide() {
        this.setState({
            isSearching: false
        });
    }

    show() {
        //console.log("list view -- show : ");
        this.setState({
            isSearching: true
        });
    }

    switchShow() {
        this.setState({
            isSearching: !this.state.isSearching
        });
    }

    /**
     * Hiện thị màn hình loading data
     */
    showLoading() {
        if (this.searchLoading) {
            this.searchLoading.showLoading();
        }
    }

    /**
     * Tắt màn hình loading data
     */
    hideLoading() {
        if (this.searchLoading) {
            this.searchLoading.hideLoading();
        }
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

    render() {
        let { dataSource } = this.state;
        let { customStyle } = this.props;
        return (
            <MyView hide={!this.state.isSearching} style={customStyle ? customStyle : styles.view_contain}>
                <FlatList style={styles.list_spinner}
                    ItemSeparatorComponent={(sectionId, rowId) => <View key={rowId} style={styles.listview_separator} />}
                    data={dataSource}
                    enableEmptySections={true}
                    keyboardShouldPersistTaps='always'
                    renderItem={({ item, index }) =>
                        <CheckHandicapItem
                            facilityCourseModel={item}
                            onItemClickCallback={this.onItemClick} />
                    }
                />
                <SearchLoading ref={(searchLoading) => { this.searchLoading = searchLoading; }}
                    isShowOverlay={false} />
            </MyView>
        );
    }
}

const styles = StyleSheet.create({
    list_spinner: {
        position: 'absolute',
        top: 0,
        bottom: 50,
        left: 0,
        right: 0,
        borderColor: '#C7C7C7',
        backgroundColor: '#fff',
        borderWidth: 1,
        marginLeft: scale(10),
        marginRight: scale(10)
    },
    listview_separator: {
        height: 1,
        backgroundColor: '#E3E3E3',
    },
    view_contain: {
        position: 'absolute',
        backgroundColor: '#FFFFFF',
        left: 0,
        right: 0,
        top: verticalScale(60),
        backgroundColor: '#fff',
        bottom: 0
    }
});