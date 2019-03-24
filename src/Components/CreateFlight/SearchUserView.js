import React from 'react';
import { Platform, StyleSheet, Text, View, ListView, BackHandler } from 'react-native';
import Touchable from 'react-native-platform-touchable';
import BaseComponent from '../../Core/View/BaseComponent';
import HeaderSearchView from '../HeaderSearchView';
import PlayerSearchItem from './Items/PlayerSearchItem';
import ApiService from '../../Networking/ApiService';
import Networking from '../../Networking/Networking';
import FriendsModel from '../../Model/Friends/FriendsModel';
import EmptyDataView from '../../Core/Common/EmptyDataView';
import LoadingView from '../../Core/Common/LoadingView';
import Toast, { DURATION } from 'react-native-easy-toast'

export default class SearchUserView extends BaseComponent {

    constructor(props) {
        super(props);
        this.page = 1;
        const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
        this.userList = [];
        this.recentFriendList = [];
        this.state = {
            user_ids: this.props.navigation.state.params != null ? this.props.navigation.state.params.user_ids : '',
            dataSource: ds.cloneWithRows([]),
        }
        this.onChangeSearchText = this.onChangeSearchText.bind(this);
        this.onCancelSearchClick = this.onCancelSearchClick.bind(this);
        this.onLoadMorePaging = this.onLoadMorePaging.bind(this);
    }

    render() {
        console.log('user_ids', this.state.user_ids);
        return (
            <View style={styles.container}>
                {/* {this.renderLoading()} */}
                <HeaderSearchView
                    isHideCancelBtn={false}
                    onChangeSearchText={this.onChangeSearchText}
                    onCancelSearch={this.onCancelSearchClick} />
                <View>
                    <LoadingView ref={(loadingView) => { this.loadingView = loadingView; }}
                        isShowOverlay={false} />
                    <ListView
                        onEndReached={this.onLoadMorePaging}
                        onEndReachedThreshold={5}
                        keyboardShouldPersistTaps='always'
                        renderSeparator={(sectionId, rowId) => <View key={rowId} style={styles.listview_separator} />}
                        dataSource={this.state.dataSource}
                        renderRow={(rowData, session, itemId) =>
                            <Touchable onPress={() => this.onUserSelected(rowData, itemId)}>
                                <PlayerSearchItem
                                    avatar={rowData.getAvatar()}
                                    isAdd={false}
                                    fullname={rowData.getFullname()}
                                    handicap={rowData.getHandicap()}
                                    eHandicap_member_id={rowData.getMemberId()}
                                    userId={rowData.getUserId()}
                                    data={rowData} />
                            </Touchable>
                        }
                    />
                </View>
                <Toast
                    ref="toast"
                    position='top'
                    positionValue={200}
                    fadeInDuration={750}
                    fadeOutDuration={1000}
                    opacity={0.8}
                />
                <EmptyDataView
                    ref={(emptyDataView) => { this.emptyDataView = emptyDataView; }}
                />
            </View>
        );
    }

    componentDidMount() {
        let self = this;
        this.requestGetFriendsRecent();
        this.backHandler = BackHandler.addEventListener('hardwareBackPress', function () {
            self.props.navigation.state.params.onSearchCallback(null);
            self.props.navigation.goBack();
            return true;
        });
    }

    componentWillUnmount() {
        if (this.backHandler) {
            this.backHandler.remove();
        }
    }

    requestGetFriendsRecent() {
        let url = this.getConfig().getBaseUrl() + ApiService.friends_recent();
        console.log('requestGetFriendsRecent', url)
        Networking.httpRequestGet(url, this.onFriendsRecent.bind(this));
    }

    /**
     * check user trung
     * @param {*} target là các trận trong mảng mới
     */
    checkDuplicate(target) {
        let user_ids = this.state.user_ids;
        if (!user_ids || !user_ids.length) return [...target];
        try {
            for (let userId of user_ids) {
                console.log('................. check user : ', userId);
                let obj_check = target.find(d => this.getAppUtil().replaceUser(d.userId) === this.getAppUtil().replaceUser(userId));
                if (obj_check) {
                    target = this.getAppUtil().remove(target, obj_check);
                    // this.Logger().log('...................... tim thay tran trung target con lai ', target.map(d => d.getFlight().id));
                    // this.Logger().log('.................................array ', array.map(d => d.getFlight().id));
                    // this.Logger().log('.................................soursw ', source.map(d => d.getFlight().id));
                }
            }
        } catch (error) {
            console.log('checkDuplicate.error', error)
        }

        //them mang luu cac gia tri de tang hieu nang tim kiem
        // this.Logger().log('.................................sourse ban dau ', source.map(d => d.getFlight().id));

        //tim kiem xong
        return [...target];
    }

    onFriendsRecent(jsonData) {
        this.model = new FriendsModel();
        this.model.parseData(jsonData);
        if (this.model.getErrorCode() === 0) {
            if (this.model.getListFriendData().length > 0) {
                this.recentFriendList = this.model.getListFriendData();
                this.emptyDataView.hideEmptyView();
            } else {
                this.emptyDataView.showEmptyView();
            }
            //them ngay 12-5 bo cac user trung ben kia
            this.recentFriendList = this.checkDuplicate(this.recentFriendList);
            this.setState({
                dataSource: this.state.dataSource.cloneWithRows(this.recentFriendList)
            });

        }
    }

    onChangeSearchText(input) {
        this.userList = [];
        if (input) {
            this.loadingView.showLoading();
            // console.log('onChangeSearchText', input);
            let self = this;
            this.page = 1;
            let url = this.getConfig().getBaseUrl() + ApiService.user_search(input, 1, 20);
            Networking.httpRequestGet(url, this.onSearchResponse.bind(this), () => {
                //time out
                self.loadingView.hideLoading();
                self.refs.toast.show(self.t('time_out'), DURATION.LENGTH_SHORT);
            });
        } else {
            console.log('onChangeSearchText', this.userList.length)
            if (this.recentFriendList.length > 0 || this.userList.length > 0) {
                this.emptyDataView.hideEmptyView();
                this.setState({
                    dataSource: this.state.dataSource.cloneWithRows(this.recentFriendList)
                });
            } else {
                this.setState({
                    dataSource: this.state.dataSource.cloneWithRows([])
                }, () => {
                    this.emptyDataView.showEmptyView();
                });

            }

        }

    }

    onSearchResponse(jsonData) {
        this.loadingView.hideLoading();
        this.model = new FriendsModel();
        this.model.parseData(jsonData);
        if (this.model.getErrorCode() === 0) {
            if (this.model.getListFriendData().length > 0) {
                this.userList = [...this.userList, ...this.model.getListFriendData()];
                this.page++;
                this.emptyDataView.hideEmptyView();
            } else {
                this.page = 1;
                if (this.userList.length === 0) {
                    this.emptyDataView.showEmptyView();
                }

            }
            //them ngay 12-5 bo cac user trung
            this.userList = this.checkDuplicate(this.userList);
            this.setState({
                dataSource: this.state.dataSource.cloneWithRows(this.userList)
            });

        }
    }

    onLoadMorePaging() {

    }

    onUserSelected(data, index) {
        if (this.state.user_ids && this.state.user_ids.includes(data.getId())) {
            this.refs.toast.show(this.t('player_selected'), DURATION.LENGTH_SHORT);
        } else {
            this.props.navigation.state.params.onSearchCallback(data);
            this.props.navigation.goBack();
        }

    }

    onCancelSearchClick() {
        this.props.navigation.state.params.onSearchCallback(null);
        this.props.navigation.goBack();
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    listview_separator: {
        flex: 1,
        height: 1,
        backgroundColor: '#E3E3E3',
    },
});