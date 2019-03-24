import React from 'react';
import {
    StyleSheet,
    View,
    RefreshControl,
    ListView
} from 'react-native';
import Touchable from 'react-native-platform-touchable';
import BaseComponent from '../../../Core/View/BaseComponent';
import EventInviteItem from '../Items/EventInviteGroupItem';
import ApiService from '../../../Networking/ApiService';
import Networking from '../../../Networking/Networking';
import GroupModel from '../../../Model/Group/GroupModel';
import EmptyDataView from '../../../Core/Common/EmptyDataView';

export default class EventListGroupScreen extends BaseComponent {
    constructor(props) {
        super(props);
        this.page = 1;
        this.list_group = [];
        this.state = {
            dataSource: new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 }),
        }
    }

    componentDidMount() {
        let { screenProps } = this.props;
        this.event_id = screenProps.event_id;
        this.sendRequestListData();
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

    /**
     * lay du lieu danh sách nhóm
     */
    sendRequestListData() {
        let url = this.getConfig().getBaseUrl() + ApiService.event_list_group(this.event_id, this.page);
        this.showLoading();
        let self = this;
        Networking.httpRequestGet(url, (jsonData) => {
            self.hideLoading();
            self.model = new GroupModel(self);
            self.model.parseData(jsonData);
            console.log("jsonData ", jsonData);
            if (this.model.getErrorCode() === 0) {
                self.list_group = self.list_group.concat(self.model.getListGroup())
                if (self.list_group.length) {
                    self.emptyDataView.hideEmptyView();
                    self.setState({
                        dataSource: self.state.dataSource.cloneWithRows(self.list_group),
                    });
                } else {
                    self.emptyDataView.showEmptyView();
                }
            }
            //self.internalLoading.hideLoading();
        }, () => {
            //time out
            self.hideLoading();
            //self.internalLoading.hideLoading();
            // self.popupTimeOut.showPopup();
        });
    }

    onLoadMore() {
        if (!this.internalLoading || this.list_group.length < 10) return;
        this.page++;
        this.sendRequestListData();
    }

    onRefresh() {
        this.page = 1;
        this.list_group = [];
        this.sendRequestListData();
    }

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.line} />
                {/* {this.renderLoading()} */}
                <ListView style={styles.container}
                    dataSource={this.state.dataSource}
                    onEndReachedThreshold={5}
                    enableEmptySections={true}
                    keyboardShouldPersistTaps='always'
                    renderSeparator={(sectionId, rowId) => <View key={rowId} style={styles.separator_view} />}
                    onEndReached={this.onLoadMore.bind(this)}
                    renderRow={(rowData) =>
                        <EventInviteItem data={rowData}
                            event_id={this.event_id} />
                    }
                    refreshControl={
                        <RefreshControl
                            refreshing={false}
                            onRefresh={this.onRefresh.bind(this)}
                        />
                    }
                />
                <EmptyDataView ref={(emptyDataView) => { this.emptyDataView = emptyDataView }} />
                {this.renderInternalLoading()}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    separator_view: {
        height: 1,
        backgroundColor: '#ebebeb'
    },
    line: {
        height: 1,
        backgroundColor: '#D6D4D4',
        marginTop: 10
    },
});