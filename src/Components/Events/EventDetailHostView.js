import React from 'react';
import {
    StyleSheet,
    Text,
    View,
    ListView,
    RefreshControl,
    BackHandler,
    Image,
    TextInput,
    Dimensions
} from 'react-native';
import Touchable from 'react-native-platform-touchable';
import BaseComponent from '../../Core/View/BaseComponent';
import HeaderView from './Header/Header';
import EventDetailHeader from './Header/EventDetailHeader';
import EventUserItem from './Items/EventUserItem';
import EventMemberModel from '../../Model/Events/EventMemberModel';
import EmptyDataView from '../../Core/Common/EmptyDataView';
import ApiService from '../../Networking/ApiService';
import Networking from '../../Networking/Networking';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import MyInputView from '../Common/MyTextInput';
import MyListView from '../Common/MyListView';
import MyView from '../../Core/View/MyView';
import ListViewUser from './Items/ListViewUser';
import FriendsModel from '../../Model/Friends/FriendsModel';
// import EventModel from '../../Model/Events/EventModel';
import {scale, verticalScale, fontSize} from '../../Config/RatioScale';
// let{width,height} = Dimensions.get('window');

/**
 * chia màn hình host và user bình thường cho dễ quản lý
 * Man hình chi tiết event dành cho user la host
 */
const screenHeight = 2 * (Dimensions.get('window').height / 3);
const screenWidth = Dimensions.get('window').width;
export default class EventDetailView extends BaseComponent {
    constructor(props) {
        super(props);
        this.list_users = [];
        this.data = null;
        this.page = 1;
        this.backHandler = null;
        this.list_users_search = [];
        this.event_id = '';
        this.state = {
            total_join: 0,
            refreshing: false,
            dataSource: new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 }),
            showSearch: false
        };
    }

    componentDidMount() {
        let { data } = this.props.navigation.state.params;
        console.log("params event host : ", data);
        this.data = data;
        this.backHandler = BackHandler.addEventListener('hardwareBackPress', this.onBackClick.bind(this));
        if (this.headerView) {
            this.headerView.setTitle(this.t('event'));
            this.headerView.setRightType(false);
            this.headerView.callbackBack = this.onBackClick.bind(this);
            this.headerView.setRightCallback(this.onRightClick.bind(this));
        }
        this.sendRequestListMemberEvent();
    }

    componentWillUnmount() {
        if (this.backHandler) {
            this.backHandler.remove();
        }
    }

    /**
     * Click button back lai màn hình trước đó
     */
    onBackClick() {
        let { navigation } = this.props;
        if (navigation) {
            navigation.goBack();
        }
        return true;
    }

    /**
     * Chuyển tới màn hình tiếp theo
     */
    onRightClick() {
        let { navigation } = this.props;
        navigation.navigate('event_share', { data: this.data, list_users: this.list_users });
    }

    onItemClick() {

    }

    onLoadMore() {
        if (!this.internalLoading || this.list_users.length < 10) return;
        this.page++;
        this.sendRequestListMemberEvent();
    }

    onRefresh() {
        this.list_users = [];
        let dataSource = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
        this.setState({
            dataSource: dataSource.cloneWithRows([])
        });
        this.page = 1;
        this.sendRequestListMemberEvent();
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

    sendRequestListMemberEvent() {
        let url = this.getConfig().getBaseUrl() + ApiService.event_list_members(this.data.id, this.page);
        console.log("url event : ", url);
        // this.internalLoading.showLoading();
        this.showLoading();
        let self = this;
        Networking.httpRequestGet(url, (jsonData) => {
            //console.log("event data : ", jsonData.data.users);
            self.hideLoading();
            let model = new EventMemberModel(self);
            model.parseData(jsonData);
            if (model.getErrorCode() === 0) {
                self.list_users = self.list_users.concat(model.getListMember());
                self.state.total_join = self.list_users.length;
                if (self.list_users.length) {
                    self.setState({
                        dataSource: self.state.dataSource.cloneWithRows(self.list_users),
                    });
                }
            }
        }, () => {
            //time out
            self.hideLoading();
        });
    }

    removeFromListView(data) {
        this.list_users = this.getAppUtil().remove(this.list_users, data);
        let dataSource = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
        this.setState({
            total_join : this.list_users.length,
            dataSource: dataSource.cloneWithRows(this.list_users)
        });
    }

    onSearchClick() {

    }

    onChangeText(text) {
        let url = this.getConfig().getBaseUrl() + ApiService.user_search(text, 1, 20, this.data.id);
        console.log("url search ? ", url);
        let self = this;
        this.listViewSearchUser.showLoading();
        Networking.httpRequestGet(url, (jsonData) => {
            //console.log('data search : ',jsonData);
            self.listViewSearchUser.hideLoading();
            let model = new FriendsModel(self);
            model.parseData(jsonData);
            if (model.getErrorCode() === 0) {
                let listUser = model.getListFriendData();
                //console.log("listUser ",listUser);
                self.listViewSearchUser.setFillData(listUser, self.data.id, self.closeKeyboard.bind(self));
            }
        }, () => {
            self.listViewSearchUser.hideLoading();
        });
    }

    onFocus() {
        this.setState({
            showSearch: true
        });
    }

    onCheckBoxClick() {
        this.closeKeyboard();
        if (this.inputText) {
            this.inputText.clear();
        }
        this.setState({
            showSearch: !this.state.showSearch
        });
        this.onRefresh();
    }

    closeKeyboard() {
        if (this.inputText) {
            this.inputText.blur();
        }
    }

    render() {
        let { total_join, showSearch } = this.state;
        let { data } = this.props.navigation.state.params;
        //console.log("goi ham render === ");
        return (
            <View style={{ flex: 1, backgroundColor: '#fff' }}>
                <HeaderView ref={(headerView) => { this.headerView = headerView; }} />
                <EventDetailHeader data={data} />
                <View style={{ height: verticalScale(5), backgroundColor: '#f0e9e9', marginTop: verticalScale(15) }}></View>
                <View style={{ height: verticalScale(40), flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderBottomWidth: verticalScale(0.5), borderBottomColor: '#d6d4d4' }}>
                    <Text allowFontScaling={global.isScaleFont} style={{ fontSize: fontSize(14), color: '#828282', marginLeft: scale(8) }}>{this.t('event_nguoi_se_tham_gia')} ({total_join})</Text>
                </View>
                <View style={{ flex: 1 }}>
                    <ListView style={styles.list_view}
                        dataSource={this.state.dataSource}
                        onEndReachedThreshold={5}
                        enableEmptySections={true}
                        keyboardShouldPersistTaps='always'
                        renderSeparator={(sectionId, rowId) => <View key={rowId} style={styles.separator_view} />}
                        onEndReached={this.onLoadMore.bind(this)}
                        renderRow={(rowData) =>
                            // <Touchable onPress={this.onItemClick.bind(this, rowData)}>
                            <EventUserItem data={rowData}
                                isHost={true}
                                event_name={data.name}
                                event_id={data.id}
                                removeFromListView={this.removeFromListView.bind(this, rowData)}
                                onItemClick={this.onItemClick.bind(this, rowData)} />
                            // </Touchable>
                        }
                        refreshControl={
                            <RefreshControl
                                refreshing={this.state.refreshing}
                                onRefresh={this.onRefresh.bind(this)}
                            />
                        }
                    />
                    <EmptyDataView ref={(emptyDataView) => { this.emptyDataView = emptyDataView; }} />
                    {this.renderInternalLoading()}
                </View>
                {/* <KeyboardAwareScrollView 
                    style={{backgroundColor : 'rgba(226,254,253,255)' }}
                    enableOnAndroid={true}
                    animated={true}
                    keyboardShouldPersistTaps='always'
                    extraScrollHeight={50}> */}
                <View style={{ justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(226,254,253,255)' }}>
                    <View style={{ height: verticalScale(60), width: screenWidth, flexDirection: 'row', alignItems: 'center',marginBottom : verticalScale(15) }}>
                        <View style={styles.search_container}>
                            <Touchable onPress={this.onSearchClick.bind(this)}>
                                <Image
                                    style={styles.icon_search}
                                    source={this.getResources().ic_Search}
                                />
                            </Touchable>
                            <TextInput allowFontScaling={global.isScaleFont}
                                ref={(inputText) => { this.inputText = inputText; }}
                                style={styles.input_search}
                                onChangeText={(text) => { this.onChangeText(text) }}
                                //value={this.state.textSearch}
                                placeholder={this.t('find_add_to_event')}
                                placeholderTextColor='#a1a1a1'
                                onFocus={this.onFocus.bind(this)}
                                // onSubmitEditing={this.onSearchClick.bind(this)}
                                underlineColorAndroid='rgba(0,0,0,0)'
                            >
                            </TextInput>
                            {/* <Touchable onPress={this.onCheckBoxClick.bind(this)}>
                            <Image
                                style={styles.dropdown_image}
                                source={this.getResources().s_normal}
                            />
                        </Touchable> */}
                        </View>
                        <Touchable onPress={this.onCheckBoxClick.bind(this)}>
                            <MyView style={{width : verticalScale(30),height : verticalScale(30),justifyContent : 'center',alignItems : 'center'}} hide={!this.state.showSearch}>
                                <Image
                                    style={{ width: verticalScale(30), height: verticalScale(30), resizeMode: 'contain' }}
                                    source={this.getResources().ic_x}
                                />
                            </MyView>
                        </Touchable>
                    </View>
                    <MyView style={{ height: screenHeight, justifyContent: 'center', alignItems: 'center' }} hide={!showSearch}>
                        <MyListView ref={(listViewUser) => { this.listViewUser = listViewUser; }} />
                        <ListViewUser ref={(listViewSearchUser) => { this.listViewSearchUser = listViewSearchUser; }} />
                    </MyView>
                </View>
                {/* </KeyboardAwareScrollView> */}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {

    },

    icon_search: {
        width: verticalScale(20),
        height: verticalScale(20),
        marginLeft: scale(10),
        resizeMode: 'contain',
        alignSelf: 'center'
    },

    input_search: {
        flex: 1,
        height: verticalScale(40),
        paddingLeft: scale(6),
        marginLeft: scale(10),
        paddingTop: 0,
        paddingBottom: 0,
        backgroundColor: '#fff',
        fontSize : fontSize(14),// 14,
        lineHeight : fontSize(16,scale(4)),
    },

    dropdown_image: {
        width: scale(40),
        height: verticalScale(48),
        resizeMode: 'contain'
    },

    search_container: {
        //height: 50,
        flex : 1,
        //width: screenWidth - 70,
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        borderColor: '#ababab',
        backgroundColor: '#fff',
        borderRadius: verticalScale(5),
        borderWidth: 1,
        marginTop: verticalScale(10),
        marginLeft: scale(10),
        marginRight: scale(10),
        marginBottom: verticalScale(15)
    },

    separator_view: {
        height: verticalScale(1),
        backgroundColor: '#E3E3E3'
    },

    list_view: {
        flex: 1,
        marginTop: verticalScale(5)
    }
});