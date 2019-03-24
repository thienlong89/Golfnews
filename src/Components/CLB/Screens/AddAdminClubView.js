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
import AddAdminItemView from '../Items/AddAdminItemView';
import FriendModel from '../../../Model/Friends/FriendsModel';

export default class AddAdminClubView extends BaseComponent {

    static defaultProps = {

    }

    constructor(props) {
        super(props);
        this.clubId = this.props.navigation.state.params.clubId || '';
        this.isSecretaryGeneral = this.props.navigation.state.params.isSecretaryGeneral || false;
        this.textSearch = '';
        this.page = 1;
        this.addList = [];
        this.refList = [];
        this.isMustUpdate = false;
        this.oldIndex = 0;
        this.state = {
            dataSource: []
        }

        this.onBackPress = this.onBackPress.bind(this);
        this.onMenuHeaderClick = this.onMenuHeaderClick.bind(this);
        this.onChangeSearchText = this.onChangeSearchText.bind(this);
        this.onLoadMoreData = this.onLoadMoreData.bind(this);
    }

    render() {
        let { dataSource } = this.state;

        return (
            <View style={styles.container}>
                <HeaderView
                    ref={(refHeaderView) => { this.refHeaderView = refHeaderView }}
                    title={this.isSecretaryGeneral ? this.t('add_secretary') : this.t('add_admin')}
                    handleBackPress={this.onBackPress}
                    menuTitle={this.t('done')}
                    onMenuHeaderClick={this.onMenuHeaderClick}
                    isEnable={false} />

                <View style={{ flex: 1 }}>

                    <SearchInputText
                        placeholder={this.t('input_name_search')}
                        autoFocus={false}
                        onChangeSearchText={this.onChangeSearchText}
                    />

                    <View style={{ height: 1, backgroundColor: '#D6D4D4' }} />

                    <FlatList
                        data={dataSource}
                        onEndReached={this.onLoadMoreData}
                        onEndReachedThreshold={1}
                        keyboardShouldPersistTaps='always'
                        ItemSeparatorComponent={(sectionId, rowId) => <View key={rowId} style={styles.separator_view} />}
                        enableEmptySections={true}
                        keyExtractor={item => item.id}
                        renderItem={({ item, section, index }) =>
                            <AddAdminItemView
                                ref={(refAddAdminItemView) => { this.refList[index] = refAddAdminItemView }}
                                player={item}
                                onMemberItemPress={this.onMemberItemPress.bind(this, item, index)} />

                        }
                    />

                    {this.renderInternalLoading()}
                </View>
                {this.renderMessageBar()}
                {this.renderLoading()}
            </View>
        );
    }

    onBackPress() {
        if (this.props.navigation) {
            this.props.navigation.goBack();
            let { params } = this.props.navigation.state;
            if (this.isMustUpdate && params.updateCallback) {
                params.updateCallback();
            }
        }
    }

    componentDidMount() {
        this.rotateToPortrait();
        this.registerMessageBar();
        this.handleHardwareBackPress();

        this.requestSearchMember('');
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
            this.requestSearchMember(input);
            this.textSearch = input;
        } else {
            this.requestSearchMember('');
            this.textSearch = '';
        }

    }

    onMenuHeaderClick() {
        this.onRequestInvites();
    }

    onMemberItemPress(player, index, isAdded) {
        if (isAdded) {
            if (this.addList.length > 0) {
                this.addList.splice(0, 1, player.getId());
                this.state.dataSource.find((data) => {
                    return data.getId() === player.getId()
                }).isSelected = true;
                if (this.refList[this.oldIndex])
                    this.refList[this.oldIndex].resetState(false);
                this.oldIndex = index;
            } else {
                this.addList.push(player.getId());
                this.state.dataSource.find((data) => {
                    return data.getId() === player.getId()
                }).isSelected = true;
                this.oldIndex = index;
            }

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
        this.requestSearchMember(this.textSearch);
    }

    requestSearchMember(input) {
        let self = this;
        this.internalLoading.showLoading();

        let url = this.getConfig().getBaseUrl() + ApiService.club_search_member_set_permission(this.clubId, this.isSecretaryGeneral ? 1 : 2, input, this.page);
        console.log("url ", url);
        Networking.httpRequestGet(url, this.onResponseData.bind(this), () => {
            //time out
            self.internalLoading.hideLoading();
        });
    }

    onResponseData(jsonData) {
        // console.log("json data ", jsonData);
        this.model = new FriendModel(this);
        this.model.parseData(jsonData);
        if (this.model.getErrorCode() === 0) {
            let listFriend = this.model.getListFriendData();
            let checkList = this.checkListPlayerSelected(listFriend);

            let listData = this.page === 1 ? listFriend : [...this.state.dataSource, ...checkList];
            console.log('onResponseData', this.page, listData.length);
            this.setState({
                dataSource: listData
            })

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
        let url = this.getConfig().getBaseUrl() + ApiService.club_set_moderator(this.clubId, this.addList[0], 1);
        if (this.isSecretaryGeneral) {
            url = this.getConfig().getBaseUrl() + ApiService.club_set_secretary(this.clubId, this.addList[0], 1);
        }
        console.log('club_set_moderator', url)
        Networking.httpRequestGet(url, this.onResponseInvite.bind(this)
            , () => {
                //time out
                this.loading.hideLoading();
            });
    }

    onResponseInvite(jsonData) {
        console.log('onResponseInvite', jsonData);
        this.loading.hideLoading();
        if (jsonData.error_code === 0) {
            this.isMustUpdate = true;
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