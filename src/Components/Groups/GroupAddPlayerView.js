import React from 'react';
import {
    Platform,
    StyleSheet,
    Text,
    View,
    BackHandler,
    FlatList,
    ListView
} from 'react-native';
import Touchable from 'react-native-platform-touchable';
import BaseComponent from '../../Core/View/BaseComponent';
import HeaderView from '../HeaderView';
import Networking from '../../Networking/Networking';
import ApiService from '../../Networking/ApiService';
import SearchInputText from '../Common/SearchInputText';
import GroupAddMemberItem from './Items/GroupAddMemberItem';
import GroupMemberModel from '../../Model/Group/GroupMemberModel';
import { scale, verticalScale } from '../../Config/RatioScale';
import GroupItemChoosen from './Items/GroupItemChoosen';
import ListViewMemberItem from './GroupAdds/ListViewMemberItem';
import HeaderGroup from './GroupAdds/HeaderGroup';
import ListViewChoosen from './GroupAdds/ListViewChoosen';

export default class GroupAddPlayerView extends BaseComponent {

    static defaultProps = {

    }

    constructor(props) {
        super(props);
        this.textSearch = '';
        this.page = 1;
        this.isFocus = false;
        this.addList = [];
        this.state = {
            dataSource: [],
            dataSourceChoosen: (new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 })).cloneWithRows([
                // { avatar: 'https://staging-api-s2.golfervn.com/api/v3/avatar?type=normal&imagename=./images/14-1-2018/normal/resize/ZGNiMDQ' },
                // { avatar: 'https://staging-api-s2.golfervn.com/api/v3/avatar?type=normal&imagename=./images/14-1-2018/normal/resize/ZGNiMDQ' },
                // { avatar: 'https://staging-api-s2.golfervn.com/api/v3/avatar?type=normal&imagename=./images/14-1-2018/normal/resize/ZGNiMDQ' }
            ])
        }

        this.onBackPress = this.onBackPress.bind(this);
        this.onMenuHeaderClick = this.onMenuHeaderClick.bind(this);
        // this.onChangeSearchText = this.onChangeSearchText.bind(this);
        this.onLoadMoreData = this.onLoadMoreData.bind(this);
        this.onFocus = this.onFocus.bind(this);
        this.onBlur = this.onBlur.bind(this);

        this.onMemberItemPress = this.onMemberItemPress.bind(this);
        this.listMember = [];
        this.onRemoveItem = this.onRemoveItem.bind(this);
        this.listChoosen = [];
        this.listCheck = [];
        let { params } = this.props.navigation.state;
        if (params && params.list_choosen) {
            this.listChoosen = params.list_choosen;
        }
        if (params && params.list_check) {
            this.listCheck = params.list_check;
        }
    }

    onFocus() {
        this.isFocus = true;
        this.Logger().log('............................. focues ', this.isFocus);
        this.page = 1;
    }

    onBlur() {
        this.isFocus = false;
    }

    onRemoveItem(item) {
        this.getAppUtil().remove(this.listChoosen, item);
        this.getAppUtil().remove(this.listCheck, item);
        this.listMember.push(item);
        this.refListChoosen.setFillData(this.listChoosen);
        this.refListMember.setFillData(this.listMember);
    }

    render() {

        let { dataSource } = this.state;

        return (
            <View style={styles.container}>
                {/* <HeaderView
                    ref={(refHeaderView) => { this.refHeaderView = refHeaderView }}
                    title={this.t('add_member')}
                    handleBackPress={this.onBackPress}
                    menuTitle={this.t('done')}
                    onMenuHeaderClick={this.onMenuHeaderClick}
                    isEnable={false} /> */}
                <HeaderGroup
                    ref={(header) => { this.refHeaderView = header }}
                    title={this.t('add_member')}
                    righClick={this.onMenuHeaderClick}
                    backClick={this.onBackPress}
                />

                <View style={{ flex: 1 }}>

                    {/* <SearchInputText
                        ref={(searchView) => { this.searchView = searchView; }}
                        placeholder={this.t('input_name_search')}
                        autoFocus={false}
                        onBlur={this.onBlur}
                        onFocus={this.onFocus}
                        onChangeSearchText={this.onChangeSearchText}
                    /> */}
                    <View style={{ minHeight: verticalScale(60), marginTop: verticalScale(5), justifyContent: 'center' }}>
                        {/* <ListView
                            ref={(flatList) => { this.flatList = flatList; }}
                            // style={styles.container_body_listview}
                            dataSource={this.state.dataSourceChoosen}
                            onEndReachedThreshold={5}
                            keyboardShouldPersistTaps='always'
                            horizontal={true}
                            // renderSeparator={(sectionId, rowId) => <View key={rowId} style={styles.separator_view} />}
                            enableEmptySections={true}
                            renderRow={(rowData) =>
                                <GroupItemChoosen data={rowData} />
                            } /> */}
                        <ListViewChoosen ref={(refListChoosen) => { this.refListChoosen = refListChoosen }} onRemoveItem={this.onRemoveItem} />
                    </View>

                    <View style={{ height: 1, backgroundColor: '#D6D4D4' }} />

                    {/* <FlatList
                            data={dataSource}
                            onEndReached={this.onLoadMoreData}
                            onEndReachedThreshold={0.2}
                            keyboardShouldPersistTaps='always'
                            ItemSeparatorComponent={(sectionId, rowId) => <View key={rowId} style={styles.separator_view} />}
                            enableEmptySections={true}
                            // keyExtractor={item => item.id}
                            renderItem={({ item }) =>
                                <GroupAddMemberItem
                                    player={item}
                                    onMemberItemPress={this.onMemberItemPress.bind(this, item)} />

                            }
                        />
                        {this.renderInternalLoading()} */}
                    <ListViewMemberItem
                        ref={(refListMember) => { this.refListMember = refListMember; }}
                        onMemberItemPress={this.onMemberItemPress}
                        onLoadMoreData={this.onLoadMoreData}
                    />
                </View>

                {this.renderMessageBar()}

            </View>
        );
    }

    onBackPress() {
        if (this.props.navigation.state.params.AddMemberCallback) {
            this.props.navigation.state.params.AddMemberCallback(this.listChoosen);
        }
        let { navigation } = this.props;
        if (navigation) {
            navigation.goBack();
        }
        return true;
    }

    componentDidMount() {
        this.rotateToPortrait();
        this.registerMessageBar();
        this.handleHardwareBackPress();
        if (this.refHeaderView) {
            this.refHeaderView.searchCallback = this.onChangeSearchText.bind(this);
        }
        console.log('............................ listChoosen : ', this.listChoosen);
        // if (this.listChoosen && this.listChoosen.length) {
        if (this.listChoosen) {
            this.refListChoosen.setFillData(this.listChoosen);
        }
        this.requestSearchPlayer('');
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
        // if (this.props.navigation.state.params.AddMemberCallback) {
        //     this.props.navigation.state.params.AddMemberCallback(this.addList);
        // }
        this.onBackPress();
    }

    onMemberItemPress(player, isAdded) {
        console.log('onMemberItemPress', isAdded)
        this.listChoosen.push(player);
        this.listCheck.push(player);
        // this.getAppUtil().remove(this.listMember,player);
        for (let i = 0; i < this.listMember.length; i++) {
            let p = this.listMember[i];
            if (p.getId() === player.getId()) {
                this.listMember.splice(i, 1);
                break;
            }
        }

        this.refListMember.setFillData(this.listMember);
        this.refListChoosen.setFillData(this.listChoosen);
        // if (isAdded) {
        //     this.addList.push(player);
        //     this.listMember.find((data) => {
        //         return data.getId() === player.getId()
        //     }).isSelected = true;
        // } else {
        //     let index = this.addList.findIndex((playerItem) => {
        //         return playerItem.getId() === player.getId();
        //     })
        //     if (index != -1)
        //         this.addList.splice(index, 1)

        //     this.listMember.find((data) => {
        //         return data.getId() === player.getId()
        //     }).isSelected = false;
        // }
        // this.refHeaderView.setMenuEnable(this.addList.length > 0 ? true : false);

    }

    onLoadMoreData() {
        // this.page++;
        // if (!this.textSearch.length) {
        //     this.searchView.blur();
        //     this.isFocus = false;
        // }
        // this.requestSearchPlayer(this.textSearch);
    }

    showLoading() {
        if (this.refListMember) {
            this.refListMember.showLoading();
        }
    }

    hideLoading() {
        if (this.refListMember) {
            this.refListMember.hideInternalLoading();
        }
    }

    requestSearchPlayer(text) {
        let self = this;
        this.showLoading();
        let url = this.getConfig().getBaseUrl() + ApiService.search_member_to_add_new_group(text, this.page);
        console.log("url = ", url);
        Networking.httpRequestGet(url, this.onSearchPlayerResponse.bind(this), () => {
            self.hideLoading();
            //self.popupTimeOut.showPopup();
        });
    }

    onSearchPlayerResponse(jsonData) {
        // console.log("json data ", jsonData);
        this.model = new GroupMemberModel(this);
        this.model.parseData(jsonData);
        if (this.model.getErrorCode() === 0) {
            if (this.model.getPlayerList() && this.model.getPlayerList().length > 0) {
                let checkList = this.checkListPlayerSelected(this.model.getPlayerList());
                console.log('this.isFocus', this.isFocus, checkList.length);
                this.listMember = this.page === 1 ? checkList : [...this.listMember, ...checkList];
                this.refListMember.setFillData(this.listMember);
                // this.setState({
                //     dataSource: listData
                // });
            }

        } else {
            this.showErrorMsg(this.model.getErrorMsg());
        }
        this.hideLoading();
    }

    checkListPlayerSelected(listData) {
        // for (let playerItem of this.listChoosen) {
        for (let playerItem of this.listCheck) {
            let i = 0;
            while (i < listData.length) {
                let player = listData[i];
                console.log('.................. check duplicate user : ', playerItem.getId(), player.getId(), i);
                if (playerItem.getId() === player.getId()) {
                    listData.splice(i, 1);
                } else {
                    i++;
                }
            }
            // for (let player of listData) {
            //     if (playerItem.getId() === player.getId()) {
            //         // player.isSelected = true;
            //         //xoa cac thanh vien da trong nhom
            //         this.getAppUtil().remove(listData,player);
            //     }
            // }
        }

        return listData;
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
        marginLeft: scale(43)
    }
});