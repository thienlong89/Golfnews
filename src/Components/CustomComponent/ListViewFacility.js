import React from 'react';
import {
    StyleSheet,
    View,
    Dimensions,
    ListView
} from 'react-native';
import Touchable from 'react-native-platform-touchable';
import BaseComponent from '../../Core/View/BaseComponent';
import MyView from '../../Core/View/MyView';
import Loading from '../../Core/Common/LoadingView';
import FacilityItem from '../Events/Items/EventFacilityItem';

/**
 * Hiển thị các kết quả tìm kiếm facility
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
    setFillData(listData) {
        //console.log("list data : ", listData);
        this.dataSource = this.dataSource.cloneWithRows(listData);
        this.show();
    }

    /**
     * An listview
    */
    hide() {
        this.setState({
            isSearching: false
        });
    }

    componentDidMount(){
       // this.searchLoading.showLoading();
    }

    show() {
        this.setState({
            isSearching: true
        });
        //this.searchLoading.showLoading();
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

    showLoading(){
        if(this.searchLoading){
            this.searchLoading.showLoading();
        }
    }

    hideLoading(){
        if(this.searchLoading){
            this.searchLoading.hideLoading();
        }
    }

    render() {
        return (
            <MyView hide={!this.state.isSearching} style={{ position: 'absolute', backgroundColor: '#FFF', left: this.props.left ? this.props.left : 0, right: this.props.right ? this.props.right :  this.getRatioAspect().scale(5), top: this.props.top, bottom: this.props.bottom, height: (this.props.bottom) ? null :  this.getRatioAspect().verticalScale(200) }}>
                <ListView style={styles.list_spinner}
                    renderSeparator={(sectionId, rowId) => <View key={rowId} style={styles.listview_separator} />}
                    dataSource={this.dataSource}
                    enableEmptySections={true}
                    keyboardShouldPersistTaps='always'
                    renderRow={(rowData, sectionID) =>
                        <Touchable onPress={this.onItemClick.bind(this, rowData)}>
                                <FacilityItem facilityCourseModel={rowData} />
                        </Touchable>
                    }
                />
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