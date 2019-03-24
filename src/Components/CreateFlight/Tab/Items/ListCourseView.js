import React from 'react';
import BaseComponent from "../../../../Core/View/BaseComponent";
import { ListView, StyleSheet,View, Platform } from 'react-native';
import FacilityCourseItem from '../../../Facilities/FacilityCourseItem';
import { verticalScale, scale } from '../../../../Config/RatioScale';
import EmptyDataView from '../../../../Core/Common/EmptyDataView';
import Touchable from 'react-native-platform-touchable';

export default class ListCourseView extends BaseComponent {
    constructor(props) {
        super(props);
        let ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
        this.state = {
            dataSource: ds.cloneWithRows([]),
            isState: false
        }
    }

    onCourseItemClick(facilityCourseModel, itemId) {
        let { onCourseItemClick } = this.props;
        if (onCourseItemClick) {
            onCourseItemClick(facilityCourseModel, itemId);
        }
    }

    setFillData(listData) {
        let ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
        this.setState({
            dataSource: ds.cloneWithRows(listData)
        });
        // if(listData.length){
        //     this.refEmptyDataView.hideEmptyView();
        // }else{
        //     this.refEmptyDataView.showEmptyView();
        // }
    }

    render() {
        let { dataSource, style } = this.state;
        return (
            <View style={{flex : 1,marginTop : verticalScale(7),marginLeft : 0,marginRight : 0, marginBottom : 0}}>
                <ListView
                    style={[style,
                        dataSource.getRowCount() === 0 ? { borderColor: '#FFFFFF', borderWidth: 0 } : { borderColor: '#DBDBDB', borderWidth: (Platform.OS === 'ios') ? 1 : 0.5 }]}
                    renderSeparator={(sectionId, rowId) => <View key={rowId} style={styles.listview_separator} />}
                    dataSource={dataSource}
                    enableEmptySections={true}
                    keyboardShouldPersistTaps='always'
                    renderRow={(rowData, sectionID, itemId) =>
                            <Touchable onPress={this.onCourseItemClick.bind(this, rowData, itemId)}>
                                <FacilityCourseItem facilityCourseModel={rowData} />
                            </Touchable>
                    }
                />
            {/* //     <EmptyDataView ref={(refEmptyDataView)=>{this.refEmptyDataView = refEmptyDataView;}}/> */}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    listview_separator: {
        //flex: 1,
        height: verticalScale(1),
        backgroundColor: '#E3E3E3',
    }
});