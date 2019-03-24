import React from 'react';
import {
    Platform,
    StyleSheet,
    Text,
    View,
    FlatList
} from 'react-native';
import Touchable from 'react-native-platform-touchable';
import BaseComponent from '../../../Core/View/BaseComponent';
import HeaderView from '../../HeaderView';
import Networking from '../../../Networking/Networking';
import ApiService from '../../../Networking/ApiService';
import LoadingView from '../../../Core/Common/LoadingView';
import ClubMemberModel from '../../../Model/CLB/ClubMemberModel';
import ClubMemberItem from '../Items/ClubMemberItem';
import EmptyDataView from '../../../Core/Common/EmptyDataView';

export default class ClubMemberScreen extends BaseComponent {

    constructor(props) {
        super(props);
        let { clubName, clubId, isAdmin } = this.props.screenProps.navigation.state.params;
        this.clubId = clubId;
        this.isAdmin = isAdmin;
        this.page = 1;
        this.state = {
            dataSource: []
        }
    }

    _keyExtractor = (item, index) => item.getUserId();

    render() {
        let { dataSource } = this.state;

        return (
            <View style={styles.container}>
                
                <FlatList
                    data={dataSource}
                    onEndReached={this.onLoadMoreData.bind(this)}
                    onEndReachedThreshold={5}
                    keyboardShouldPersistTaps='always'
                    ItemSeparatorComponent={(sectionId, rowId) => <View key={rowId} style={styles.separator_view} />}
                    enableEmptySections={true}
                    keyExtractor={this._keyExtractor}
                    renderItem={({ item }) =>
                        <ClubMemberItem
                            member={item} />
                    }
                />
                <EmptyDataView ref={(emptyDataView) => { this.emptyDataView = emptyDataView; }} />
                <LoadingView ref={(customLoading) => { this.customLoading = customLoading; }}
                    isShowOverlay={false} />
                {this.renderMessageBar()}
            </View>
        );
    }

    componentDidMount() {
        this.registerMessageBar();
        this.getListMember();
    }

    componentWillUnmount() {
        this.unregisterMessageBar();
    }

    onLoadMoreData() {
        console.log('onLoadMoreData')
        this.page++;
        console.log('onLoadMoreData.page', this.page)
        this.getListMember();
    }

    getListMember() {
        this.customLoading.showLoading();
        let url = this.getConfig().getBaseUrl() + ApiService.club_list_member_new(this.clubId, this.page);
        console.log("url ", url);
        let self = this;
        Networking.httpRequestGet(url, this.onResponseData.bind(this), () => {
            //time out
            self.customLoading.hideLoading();
            if (this.state.dataSource.length === 0) {
                self.emptyDataView.showEmptyView();
            }
        });
    }

    onResponseData(jsonData) {
        this.model = new ClubMemberModel(this);
        this.model.parseData(jsonData);
        if (this.model.getErrorCode() === 0) {
            if (this.model.getMemberList().length > 0) {
                this.setState({
                    dataSource: [...this.state.dataSource, ...this.model.getMemberList()]
                }, () => {
                    this.emptyDataView.hideEmptyView();
                })
            } else {
                if (this.state.dataSource.length === 0) {
                    this.emptyDataView.showEmptyView();
                } else {
                    this.emptyDataView.hideEmptyView();
                }
            }

        } else {
            this.showErrorMsg(this.model.getErrorMsg());
        }
        this.customLoading.hideLoading();
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    separator_view: {
        height: 1,
        backgroundColor: '#E3E3E3'
    },
});