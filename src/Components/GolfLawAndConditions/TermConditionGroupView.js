import React from 'react';
import {View, StyleSheet, ListView, RefreshControl } from 'react-native';
import BaseComponent from '../../Core/View/BaseComponent';
import Touchable from 'react-native-platform-touchable';
import HeaderView from '../Common/HeaderView';
import ApiService from '../../Networking/ApiService';
import Networking from '../../Networking/Networking';
import TermConditionModel from '../../Model/GolfLawAndConditions/TermConditionModel';
import Item from './Items/TermConditionItemView';
import EmptyDataView from '../../Core/Common/EmptyDataView';
import LoadingView from '../../Core/Common/LoadingView';

export default class TermConditionGroupView extends BaseComponent {
    constructor(props) {
        super(props);
        this.page = 1;
        this.group_id = 0;
        this.list_item = [];
        this.isLoading = false;
        this.state = {
            refreshing: false,
            dataSource: new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 }),
        }
    }

    onBackClick() {
        let { navigation } = this.props;
        if (navigation) {
            navigation.goBack();
        }
        return true;
    }

    componentDidMount() {
        let { params } = this.props.navigation.state;
        this.group_id = params.group_id ? params.group_id : 0;
        if (this.headerView) {
            this.headerView.setTitle(params.title ? params.title : this.t('term_condition'));
            this.headerView.callbackBack = this.onBackClick.bind(this);
        }
        this.sendRequestListTerm();
    }

    showCustomLoading(){
        if(this.customLoading){
            this.customLoading.showLoading();
        }
    }

    hideCustomLoading(){
        if(this.customLoading){
            this.customLoading.hideLoading();
        }
    }

    /**
     *  request lấy danh sách các điều khoản và luật golf 
     */
    sendRequestListTerm() {
        this.isLoading = true;
        //this.customLoading.showLoading();
        this.showCustomLoading();
        let self = this;
        let url = this.getConfig().getBaseUrl() + ApiService.term_list(this.group_id, this.page);
        Networking.httpRequestGet(url, (jsonData) => {
            self.hideCustomLoading();
            self.model = new TermConditionModel(self);
            self.model.parseData(jsonData);
            self.isLoading = false;
            if (self.model.getErrorCode() === 0) {
                self.list_item = self.list_item.concat(self.model.getListItem());
                if (self.list_item.length) {
                    self.emptyDataView.hideEmptyView();
                    self.setState({
                        dataSource: self.state.dataSource.cloneWithRows(self.list_item)
                    });
                }else{
                    self.emptyDataView.showEmptyView();
                }
            }else{
                self.emptyDataView.showEmptyView();
            }
            //self.customLoading.hideLoading();
        }, () => {
           // self.customLoading.hideLoading();
            self.hideCustomLoading();
            self.popupTimeOut.showPopup();
            self.isLoading = false;
        });
    }

    /**
     * load thêm dữ liệu
     */
    onLoadMore() {
        if(this.isLoading || !this.customLoading || this.list_item.length < 10) return;
        this.page++;
        this.sendRequestListTerm();
    }

    /**
     * load lại dữ liệu
     */
    onRefresh() {
        if(this.isLoading) return;
        this.page = 1;
        this.list_item = [];
        this.sendRequestListTerm();
    }

    onItemClick(data) {
        let { navigation } = this.props;
        if (!navigation) return;
        navigation.navigate('term_condition_detail', { title: data.getTitle(), url: data.getUrl() });
    }

    render() {
        return (
            <View style={styles.container}>
                <HeaderView ref={(headerView) => { this.headerView = headerView; }} />
                <View style={{ flex: 1 }}>
                    <ListView style={styles.listview}
                        dataSource={this.state.dataSource}
                        onEndReachedThreshold={5}
                        enableEmptySections={true}
                        keyboardShouldPersistTaps='always'
                        renderSeparator={(sectionId, rowId) => <View key={rowId} style={styles.separator} />}
                        onEndReached={this.onLoadMore.bind(this)}
                        renderRow={(rowData) =>
                            <Touchable onPress={this.onItemClick.bind(this, rowData)}>
                                <Item data={rowData} />
                            </Touchable>
                        }
                        refreshControl={
                            <RefreshControl
                                refreshing={this.state.refreshing}
                                onRefresh={this.onRefresh.bind(this)}
                            />
                        }
                    />
                    <EmptyDataView ref={(emptyDataView) => { this.emptyDataView = emptyDataView; }} />
                    <LoadingView ref={(customLoading) => { this.customLoading = customLoading; }}
                        isShowOverlay={false} />
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff'
    },

    separator: {
        height: 0.5,
        backgroundColor: '#ebebeb'
    },

    listview: {
        flex: 1
    }
})