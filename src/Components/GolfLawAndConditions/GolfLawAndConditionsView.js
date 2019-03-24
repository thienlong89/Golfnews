import React from 'react';
import {
    View,
    StyleSheet,
    ListView,
    RefreshControl,
    Platform,
    BackHandler
} from 'react-native';
import BaseComponent from '../../Core/View/BaseComponent';
import Touchable from 'react-native-platform-touchable';
import HeaderView from '../Common/HeaderView';
import Item from './Items/Item';
import ApiService from '../../Networking/ApiService';
import Networking from '../../Networking/Networking';
import GolfLawAndConditionsModel from '../../Model/GolfLawAndConditions/GolfLawAndConditionsModel';
import EmptyDataView from '../../Core/Common/EmptyDataView';
import LoadingView from '../../Core/Common/LoadingView';

export default class GolfLawAndConditionsView extends BaseComponent {
    constructor(props) {
        super(props);
        this.page = 1;
        this.list_item = [];
        this.state = {
            refreshing: false,
            dataSource: new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 }),
        }

        this.onBackClick = this.onBackClick.bind(this);
    }

    onBackClick() {
        let { navigation } = this.props;
        if (navigation) {
            navigation.goBack();
        }
    }

    componentDidMount() {
        this.rotateToPortrait();
        if (this.headerView) {
            this.headerView.setTitle(this.t('term_condition'));
            this.headerView.callbackBack = this.onBackClick;
        }
        this.handleHardwareBackPress();
        this.sendRequestListTerm();
    }

	componentWillUnmount() {
        if (this.backHandler) {
            this.backHandler.remove();
        }
    }

    handleHardwareBackPress() {
        let self = this;
        this.backHandler = BackHandler.addEventListener('hardwareBackPress', function () {
            self.onBackClick();
            return true;
        });
    }

    showCustomLoading() {
        if (this.custumLoading) {
            this.custumLoading.showLoading();
        }
    }

    hideCustomLoading() {
        if (this.custumLoading) {
            this.custumLoading.hideLoading();
        }
    }

    sendRequestListTerm() {
        let url = this.getConfig().getBaseUrl() + ApiService.term_group_list();
        //this.custumLoading.showLoading();
        this.showCustomLoading();
        let self = this;
        Networking.httpRequestGet(url, (jsonData) => {
            self.hideCustomLoading();
            console.log("jsonData ", jsonData);
            self.model = new GolfLawAndConditionsModel(self);
            self.model.parseData(jsonData);
            if (self.model.getErrorCode() === 0) {
                self.list_item = self.list_item.concat(self.model.getListItem());
                console.log("list data ", self.list_item);
                if (self.list_item.length) {
                    self.emptyDataView.hideEmptyView();
                    self.setState({
                        dataSource: self.state.dataSource.cloneWithRows(self.list_item)
                    });
                } else {
                    self.emptyDataView.showEmptyView();
                }
            } else {
                self.emptyDataView.showEmptyView();
            }
            /// self.custumLoading.hideLoading();
        }, () => {
            //self.custumLoading.hideLoading();
            self.hideCustomLoading();
            self.popupTimeOut.showPopup();
        });
    }

    /**
     * refesh data
     */
    onRefresh() {
        this.list_item = [];
        this.sendRequestListTerm();
    }

    /**
     * Click vao item
     */
    onItemClick(data) {
        let { navigation } = this.props;
        if (!navigation) return;
        navigation.navigate('term_condition_group_view', { title: data.getTitle(), group_id: data.getId() });
    }

    render() {
        return (
            <View style={styles.container}>
                <HeaderView ref={(headerView) => { this.headerView = headerView; }} />
                <View style={{ flex: 1 }}>
                    <ListView style={styles.listview}
                        dataSource={this.state.dataSource}
                        onEndReachedThreshold={5}
                        keyboardShouldPersistTaps='always'
                        enableEmptySections={true}
                        renderSeparator={(sectionId, rowId) => <View key={rowId} style={styles.separator} />}
                        //onEndReached={this.onLoadMore.bind(this)}
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
                    <LoadingView ref={(custumLoading) => { this.custumLoading = custumLoading; }}
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
        height: (Platform.OS === 'ios') ? 1 : 0.5,
        backgroundColor: '#ebebeb'
    },

    listview: {
        flex: 1
    }
});