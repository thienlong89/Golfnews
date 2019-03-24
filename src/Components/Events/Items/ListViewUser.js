import React from 'react';
import {
    StyleSheet,
    Text,
    View,
    ListView
} from 'react-native';
import Touchable from 'react-native-platform-touchable';
import BaseComponent from '../../../Core/View/BaseComponent';
import Loading from '../../../Core/Common/LoadingView';
import EmptyDataView from '../../../Core/Common/EmptyDataView';
import EventUserAddMember from './EventUserAddMember';

export default class ListViewUser extends BaseComponent {
    constructor(props) {
        super(props);
        this.addCallback = null;
        this.event_id = '';
        this.closeKeyboard = null;
        this.state = {
            dataSource: new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 }),
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

    setFillData(data,event_id,closeKeyboard = null) {
        this.event_id = event_id;
        this.closeKeyboard = closeKeyboard;
        if (!data.length) {
            this.setState({
                dataSource: dataSource.cloneWithRows([])
            });
            this.emptyDataView.showEmptyView();
        } else {
            this.emptyDataView.hideEmptyView();
            let dataSource = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
            this.setState({
                dataSource: dataSource.cloneWithRows(data)
            });
        }
    }

    render() {
        return (
            <View style={{ flex: 1, marginTop: 10 }}>
                <View style={styles.listview_separator}>

                </View>
                <ListView style={{ flex: 1 }}
                    renderSeparator={(sectionId, rowId) => <View key={rowId} style={styles.listview_separator} />}
                    dataSource={this.state.dataSource}
                    keyboardShouldPersistTaps='always'
                    renderRow={(rowData, sectionID, itemId) =>
                        <EventUserAddMember data={rowData} event_id={this.event_id} closeKeyboard = {this.closeKeyboard}/>
                    }
                />
                <EmptyDataView ref={(emptyDataView) => { this.emptyDataView = emptyDataView; }} />
                <Loading ref={(searchLoading) => { this.searchLoading = searchLoading; }}
                    isShowOverlay={false} />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    listview_separator: {
        height: 1,
        backgroundColor: '#adadad'
    }
})