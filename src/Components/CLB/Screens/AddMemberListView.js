import React from 'react';
import {
    Platform,
    StyleSheet,
    Text,
    View,
    BackHandler,
    FlatList
} from 'react-native';
import Touchable from 'react-native-platform-touchable';
import BaseComponent from '../../../Core/View/BaseComponent';
import HeaderView from '../../HeaderView';
import Networking from '../../../Networking/Networking';
import ApiService from '../../../Networking/ApiService';
import SearchInputText from '../../Common/SearchInputText';
import MemberAddItem from '../Items/MemberAddItem';
import FriendModel from '../../../Model/Friends/FriendsModel';

export default class AddMemberListView extends BaseComponent {

    static defaultProps = {

    }

    constructor(props) {
        super(props);
        this.clubId = this.props.navigation.state.params.clubId || '';
        this.textSearch = '';
        this.page = 1;
        this.addList = [];
        this.state = {
            dataSource: []
        }
    }

    render() {

        let { dataSource } = this.state;

        return (
            <View style={styles.container}>
                {this.renderLoading()}
                <HeaderView
                    ref={(refHeaderView) => { this.refHeaderView = refHeaderView }}
                    title={this.t('add_member')}
                    handleBackPress={this.onBackPress.bind(this)}
                    menuTitle={this.t('done')}
                    onMenuHeaderClick={this.onMenuHeaderClick.bind(this)}
                    isEnable={false} />

                <SearchInputText
                    placeholder={this.t('input_name_search')}
                    autoFocus={false}
                    onChangeSearchText={this.onChangeSearchText.bind(this)}
                />

                <View style={{ height: 1, backgroundColor: '#D6D4D4' }} />

                <FlatList
                    data={dataSource}
                    onEndReached={this.onLoadMoreData.bind(this)}
                    onEndReachedThreshold={1}
                    keyboardShouldPersistTaps='always'
                    ItemSeparatorComponent={(sectionId, rowId) => <View key={rowId} style={styles.separator_view} />}
                    enableEmptySections={true}
                    keyExtractor={item => item.id}
                    renderItem={({ item }) =>
                        <MemberAddItem
                            player={item}
                            onMemberItemPress={this.onMemberItemPress.bind(this, item)} />

                    }
                />

                {this.renderMessageBar()}
                {this.renderInternalLoading()}
            </View>
        );
    }

    onBackPress() {
        if (this.props.navigation) {
            this.props.navigation.goBack();
        }
    }

    componentDidMount() {
        this.rotateToPortrait();
        this.registerMessageBar();
        this.handleHardwareBackPress();

        this.requestSearchPlayer('')
    }

    componentWillUnmount() {
        this.unregisterMessageBar();
        if (this.backHandler) {
            this.backHandler.remove();
        }
    }

    handleHardwareBackPress() {
        let self = this;
        this.backHandler = BackHandler.addEventListener('hardwareBackPress', function () {
            self.onBackPress();
            return true;
        });
    }

    onChangeSearchText(input) {
        this.page = 1;
        if (input.length > 0) {
            this.requestSearchPlayer(input);
            this.textSearch = input;
        } else {
            this.requestSearchPlayer('');
            this.textSearch = '';
        }

    }

    onMenuHeaderClick() {
        this.onRequestInvites();
    }

    onMemberItemPress(player, isAdded) {
        if (isAdded) {
            this.addList.push(player.getId());
            this.state.dataSource.find((data) => {
                return data.getId() === player.getId()
            }).isSelected = true;
        } else {
            let index = this.addList.findIndex((id) => {
                return id === player.getId();
            })
            if (index != -1)
                this.addList.splice(index, 1)

            this.state.dataSource.find((data) => {
                return data.getId() === player.getId()
            }).isSelected = false;
        }
        this.refHeaderView.setMenuEnable(this.addList.length > 0 ? true : false);

        console.log('onMemberItemPress', this.addList)
    }

    onLoadMoreData() {
        this.page++;
        console.log('onLoadMoreData', this.page)
        this.requestSearchPlayer(this.textSearch);
    }

    requestSearchPlayer(text) {
        let self = this;
        this.internalLoading.showLoading();
        let url = this.getConfig().getBaseUrl() + ApiService.club_search_member(this.clubId, text, this.page);
        console.log("url = ", url);
        Networking.httpRequestGet(url, this.onSearchPlayerResponse.bind(this), () => {
            self.internalLoading.hideLoading();
            //self.popupTimeOut.showPopup();
        });
    }

    onSearchPlayerResponse(jsonData) {
        // console.log("json data ", jsonData);
        this.model = new FriendModel(this);
        this.model.parseData(jsonData);
        if (this.model.getErrorCode() === 0) {
            if (this.model.getListFriendData().length > 0) {
                let checkList = this.checkListPlayerSelected(this.model.getListFriendData());
                let listData = this.page === 1 ? this.model.getListFriendData() : [...this.state.dataSource, ...checkList];
                this.setState({
                    dataSource: listData
                })
            }

        } else {
            this.showErrorMsg(this.model.getErrorMsg());
        }
        this.internalLoading.hideLoading();
    }

    checkListPlayerSelected(listData) {
        for (let id of this.addList) {
            for (let player of listData) {
                if (id === player.getId()) {
                    player.isSelected = true;
                }
            }
        }

        return listData;
    }

    // timeout(ms) {
    //     return new Promise(resolve => setTimeout(resolve, ms));
    // }

    onRequestInvites() {
        this.loading.showLoading();
        let url = this.getConfig().getBaseUrl() + ApiService.club_send_multi_invite(this.clubId);
        Networking.httpRequestPost(url, this.onResponseInvite.bind(this), { "user_ids": this.addList }, () => {
            //time out
            this.loading.hideLoading();
        });
    }

    onResponseInvite(jsonData) {
        console.log('onResponseInvite', jsonData);
        this.loading.hideLoading();
        if (jsonData.error_code === 0) {
            this.onBackPress();
        } else {
            this.showErrorMsg(jsonData.error_msg);
        }
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    separator_view: {
        height: 1,
        backgroundColor: '#D6D4D4',
        marginLeft: 43
    }
});