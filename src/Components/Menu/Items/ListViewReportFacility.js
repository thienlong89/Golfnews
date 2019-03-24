import React from 'react';
import {
    StyleSheet,
    Text,
    View,
    ListView
} from 'react-native';
import Touchable from 'react-native-platform-touchable';
import BaseComponent from '../../../Core/View/BaseComponent';
import MyView from '../../../Core/View/MyView';
import Loading from '../../../Core/Common/LoadingView';
import EmptyDataView from '../../../Core/Common/EmptyDataView';
import { verticalScale, scale, fontSize } from '../../../Config/RatioScale';
import FacilityCourseItem from '../../Facilities/FacilityCourseItem';
// import ApiService from '../../Networking/ApiService';
// import Networking from '../../Networking/Networking';

/**
 * Hiển thị các kết quả tìm kiếm như tìm thành phố, quốc gia...
 */
export default class ListViewReportFacility extends BaseComponent {
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
    setFillData(listData) {
        this.dataSource = this.dataSource.cloneWithRows(listData);
        this.show();
    }

    /**
     * An listview
    */
    hide() {
        console.log("hide view-----------------------", this.state.isSearching);
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
        let {
            customStyle
        } = this.props;
        return (
            <MyView hide={!this.state.isSearching} style={customStyle ? customStyle : styles.myview}>
                <ListView style={styles.list_spinner}
                    renderSeparator={(sectionId, rowId) => <View key={rowId} style={styles.listview_separator} />}
                    dataSource={this.dataSource}
                    keyboardShouldPersistTaps='always'
                    renderRow={(rowData, sectionID, itemId) =>
                        <Touchable onPress={this.onItemClick.bind(this, rowData, itemId)}>
                            <FacilityCourseItem facilityCourseModel={rowData} />
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
    myview: {
        position: "absolute",
        top: verticalScale(170),
        left: scale(10),
        right: scale(10),
        bottom: verticalScale(70),
        backgroundColor: '#fff',
        borderColor: '#000',
        borderWidth: 1
    },

    item: {
        height: verticalScale(30),
        //width: screenWidth,
        fontSize: fontSize(14),
        color: '#000',
        marginLeft: scale(5),
        textAlignVertical: 'center',
    },

    list_spinner: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0
    },

    listview_separator: {
        height: 1,
        backgroundColor: '#E3E3E3',
    }
});