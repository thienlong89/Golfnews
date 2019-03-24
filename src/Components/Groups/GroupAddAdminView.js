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
import BaseComponent from '../../Core/View/BaseComponent';
import HeaderView from '../HeaderView';
import Networking from '../../Networking/Networking';
import ApiService from '../../Networking/ApiService';
import SearchInputText from '../Common/SearchInputText';
import MemberAddItem from '../CLB/Items/MemberAddItem';
import FriendModel from '../../Model/Friends/FriendsModel';

export default class GroupAddAdminView extends BaseComponent {

    static defaultProps = {

    }

    constructor(props) {
        super(props);
        this.groupId = this.props.navigation.state.params.groupId || '';
        this.textSearch = '';
        this.page = 1;
        this.isFocus = false;
        this.addList = [];
        this.state = {
            dataSource: []
        }

        this.onBackPress = this.onBackPress.bind(this);
        this.onMenuHeaderClick = this.onMenuHeaderClick.bind(this);
        this.onChangeSearchText = this.onChangeSearchText.bind(this);
        this.onLoadMoreData = this.onLoadMoreData.bind(this);
        this.onFocus = this.onFocus.bind(this);
        this.onBlur = this.onBlur.bind(this);
    }

    onFocus() {
        this.isFocus = true;
        this.Logger().log('............................. focues ', this.isFocus);
        this.page = 1;
    }

    onBlur() {
        this.isFocus = false;
    }

    render() {

        let { dataSource } = this.state;

        return (
            <View style={styles.container}>
                <HeaderView
                    ref={(refHeaderView) => { this.refHeaderView = refHeaderView }}
                    title={this.t('add_team_owner')}
                    handleBackPress={this.onBackPress}
                    menuTitle={this.t('done')}
                    onMenuHeaderClick={this.onMenuHeaderClick}
                    isEnable={false} />

                <View style={{ flex: 1 }}>

                    <SearchInputText
                        ref={(searchView) => { this.searchView = searchView; }}
                        placeholder={this.t('input_name_search')}
                        autoFocus={false}
                        onBlur={this.onBlur}
                        onFocus={this.onFocus}
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
                        renderItem={({ item }) =>
                            <MemberAddItem
                                player={item}
                                onMemberItemPress={this.onMemberItemPress.bind(this, item)} />

                        }
                    />
                    {this.renderInternalLoading()}
                </View>

                {this.renderMessageBar()}

            </View>
        );
    }

    onBackPress() {
        let { navigation } = this.props;
        if (navigation) {
            navigation.goBack();
        }
        this.setCallBack();
        return true;
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
        if (input && input.length > 0) {
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

    }

    onLoadMoreData() {
        this.page++;
        if (!this.textSearch.length) {
            this.searchView.blur();
            this.isFocus = false;
        }
        this.requestSearchPlayer(this.textSearch);
    }

    requestSearchPlayer(text) {
        let self = this;
        this.internalLoading.showLoading();
        let url = this.getConfig().getBaseUrl() + ApiService.list_member_group_to_add_permission(this.groupId, text, this.page);
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
                let listData = this.isFocus ? this.model.getListFriendData() : [...this.state.dataSource, ...checkList];
                this.setState({
                    dataSource: listData
                });
            }

        } else {
            this.showErrorMsg(this.model.getErrorMsg());
        }
        this.internalLoading.hideLoading();
    }

    // checkListPlayerSelected(listData) {
    //     return listData.filter(d=>!d.IsGroupMember());
    // }

    checkListPlayerSelected(listData) {
        for (let id of this.addList) {
            for (let player of listData) {
                if (id === player.getId()) {
                    player.isSelected = true;
                    //xoa cac thanh vien da trong nhom
                    // this.getAppUtil().remove(listData,player);
                }
            }
        }

        return listData;
    }


    onRequestInvites() {
        this.internalLoading.showLoading();
        let url = this.getConfig().getBaseUrl() + ApiService.add_permission_group(this.groupId);
        console.log('url', url);
        let fromData = {
            "user_ids": this.addList
        }
        console.log('onRequestInvites.fromData', fromData);
        Networking.httpRequestPost(url, (jsonData) => {
            this.internalLoading.hideLoading();
            if (jsonData.error_code === 0) {
                this.onBackPress();
            } else {
                this.showErrorMsg(jsonData.error_msg);
            }
        }, fromData, () => {
            //time out
            this.internalLoading.hideLoading();
        });
    }

    setCallBack() {
        let { params } = this.props.navigation.state;
        if (params.AddAdminCallback) {
            params.AddAdminCallback();
        }
        if (params.refresh) {
            params.refresh();
        }
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    separator_view: {
        backgroundColor: '#D6D4D4',
        height: 1,
        marginLeft: 43
    }
});