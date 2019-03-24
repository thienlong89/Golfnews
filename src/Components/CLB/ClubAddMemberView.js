import React from 'react';
import { Text, View, Image, TextInput, ListView } from 'react-native';
import BaseComponent from '../../Core/View/BaseComponent';
import Networking from '../../Networking/Networking';
import Touchable from 'react-native-platform-touchable';
import MyView from '../../Core/View/MyView';
//import GroupItemAdd from './GroupItemAdd';
import FriendModel from '../../Model/Friends/FriendsModel';
//import UserInfo from '../../Config/UserInfo';
import UserChoosen from '../Groups/GroupChoosenItem';
import styles from '../../Styles/Group/StyleAddMemberView';
import AppUtil from '../../Config/AppUtil';
import ApiService from '../../Networking/ApiService';
import ClubItemAdd from './Items/ClubItemAdd';
import HeaderView from '../Common/HeaderView';
import ClubMemberCircle from './Items/ClubItemCircle';

/**
 * "club_member": {
          "id": 3,
          "user_id": 3,
          "club_id": 3,
          "is_user_admin": 1,
          "created_at": null,
          "updated_at": null,
          "invited_by_user_id": 0,
          "is_accepted": 1
        }
    neu club_member rong thi thnah vien chua nam trong clb
    neu is_accept = 0 la minh gui nhung nguoi kia chua dong y
 */

export default class ClubAddMemberView extends BaseComponent {
    constructor(props) {
        super(props);
        this.club_id = 0;
        this.page = 1;
        this.listMemberClub = [];
        this.listUsers = [];
        //this.sendData();
        this.state = {
            dataSource: new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 }),
            textSearch: '',
            refreshing: false,
            dataSourceBody: new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 }),
            groupId: ''
        }
        this.rowRefs = [];
    }

    // saveAddMember() {
    //     this.sendAddMember(this.state.groupId);
    // }

    /**
     * gửi request lấy các thành viên trong club
     * @param {*} club_id 
     */
    sendListMemberRequest(club_id) {
        let self = this;
        this.loading.showLoading();
        let url = this.getConfig().getBaseUrl() + ApiService.club_list_member(club_id, this.page);
        Networking.httpRequestGet(url, this.onResponeListMember.bind(this), () => {
            //time out
            self.loading.hideLoading();
            self.popupTimeOut.showPopup();
        });
    }

    /**
     * response trả về khi lấy danh sách thành viên
     * @param {*} jsonData 
     */
    onResponeListMember(jsonData) {
        this.model = new FriendModel(this);
        this.model.parseData(jsonData);
        if (this.model.getErrorCode() === 0) {
            for (let objData of this.model.getListFriendData()) {
                //console.log('obj data : ', objData);
                let obj = {
                    avatar: objData.getAvatar(),
                    fullname: objData.getFullname(),
                    userId: objData.getUserId(),
                    handicap: objData.getHandicap(),
                    member_id: objData.getMemberId(),
                    club_member: objData.getClubMember(),
                }
                //let obj_clone = Object.assign({},obj);
                //listMemberClub.push(obj_clone);
                this.listMemberClub.push(obj);
            }
            this.setState({
                dataSource: this.state.dataSource.cloneWithRows(this.listMemberClub),
            });
        }
        this.loading.hideLoading();
    }

    sendSearchRequest(club_id, text) {
        let self = this;
        //this.loading.showLoading();
        let url = this.getConfig().getBaseUrl() + ApiService.club_search_member(club_id, text);
        console.log("url = ", url);
        Networking.httpRequestGet(url, this.onResponse.bind(this), () => {
            //self.loading.hideLoading();
            //self.popupTimeOut.showPopup();
        });
    }

    setFocus() {
        this.textInputUser.focus();
    }

    sendAddMember(groupId) {
        //let url = this.getConfig().getBaseUrl() + ApiService.group_add_member(this.getUserInfo().getUserId(), groupId);
        //Networking.httpRequestPost(url, this.onResponeAddMember.bind(this), { "user_ids": listMemberAdd.map(d => d.userId) });
    }

    //onRemoveMember

    onResponeAddMember(jsonData) {
        console.log("json add member", jsonData);
        if (jsonData.hasOwnProperty('error_code')) {
            let error_code = jsonData['error_code'];
            if (error_code === 0) {
                this.listMemberClub = [];
                this.setState({
                    dataSource: this.state.dataSource.cloneWithRows(this.listMemberClub),
                });
                let groupName = '';
                if (jsonData.hasOwnProperty('data')) {
                    let data = jsonData['data'];
                    if (data.hasOwnProperty('group')) {
                        let group = data['group'];
                        groupName = group['name'];
                    }
                }
                //console.log("group name ", groupName);
                //them thanh vien thanh cong thi chuyen sang man hinh cua nhom do
                this.props.navigation.navigate('group_detail', { groupId: self.state.groupId, groupName: groupName });
            }
        }
    }

    onBackClick() {
        if (this.props.navigation) {
            this.props.navigation.goBack();
        }
        return true;
    }

    //luu lai thanh vien sau khi save
    onSaveInfo() {

    }

    componentDidMount() {
        if (this.headerView) {
            this.headerView.setTitle(this.t('add_member'));
            this.headerView.callbackBack = this.onBackClick.bind(this);
            this.headerView.setSaveButton();
            this.headerView.callbackRight = this.onSaveInfo.bind(this);
        }

        const { params } = this.props.navigation.state;
        if (params && params.club_id) {
            this.club_id = params.club_id;
        }
        this.sendListMemberRequest(this.club_id);
        //this.sendSearchRequest(this.club_id);

        //console.log(this.rowRefs.length);
        //console.log("chay vao day ", params);
        //this.setState({ groupId: params.groupId });
        //this.setFocus();
    }

    onResponse(jsonData) {
        this.listUsers = [];
        console.log("json data ", jsonData);
        this.model = new FriendModel(this);
        this.model.parseData(jsonData);
        if (this.model.getErrorCode() === 0) {
            for (let objData of this.model.getListFriendData()) {
                //console.log('obj data : ', objData);
                let obj = {
                    id: objData.getId(),
                    avatar: objData.getAvatar(),
                    fullname: objData.getFullname(),
                    userId: objData.getUserId(),
                    handicap: objData.getHandicap(),
                    member_id: objData.getMemberId(),
                    club_member: objData.getClubMember(),
                }
                this.listUsers.push(obj);
            }
            //console.log("du lieu list friends : ", listUsers.length);
            let dataSourceBody =  new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
            this.setState({
                dataSourceBody: dataSourceBody.cloneWithRows(this.listUsers),
            });
            // console.log("lenght item : ", self.rowRefs.length);
            // self.setCallback();
        }
        //this.loading.hideLoading();
    }

    onSearchClick() {
        //this.sendSearchRequest(this.club_id);
        //this.textInputUser.clear();
    }

    onChangeText(textSearch) {
        console.log("change text search : ================= ");
        this.sendSearchRequest(this.club_id, textSearch);
    }

    onAddMember(user) {
        this.listMemberClub.push(user);
        this.setState({
            dataSource: this.state.dataSource.cloneWithRows(this.listMemberClub),
        });
        this.listUsers = AppUtil.removeObjectUser(this.listUsers, user);
        let ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });

        this.setState({
            dataSourceBody: ds.cloneWithRows(this.listUsers),
        });
    }

    onRemoveMember(user) {
        console.log("xoa user ", user);
        //let obj = {userId : userId};
        this.listMemberClub = AppUtil.removeObjectUser(this.listMemberClub, user);
        let ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
        this.setState({
            dataSource: ds.cloneWithRows(this.listMemberClub),
        });

        ///listUsers.push(rowData);
        //ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
        // this.setState({
        //dataSourceBody: ds.cloneWithRows(listUsers),
        // });
    }

    /**
     * load thêm thành viên
     */
    onLoadMoreMember() {

    }

    render() {
        return (
            <View style={styles.container}>
                {this.renderLoading()}
                <HeaderView ref={(headerView) => { this.headerView = headerView; }} />
                <MyView style={styles.list_member_choosen_view} hide={this.listMemberClub.length ? false : true}>
                    <ListView style={styles.member_choosen_listview}
                        horizontal={true}
                        enableEmptySections={true}
                        onEndReachedThreshold={5}
                        keyboardShouldPersistTaps='always'
                        onEndReached={this.onLoadMoreMember.bind(this)}
                        dataSource={this.state.dataSource}
                        renderRow={(rowData) =>
                            <ClubMemberCircle userId={rowData.userId}
                                club_id={this.club_id}
                                callbackRemoveMember={this.onRemoveMember.bind(this)}
                                avatar={rowData.avatar} />
                        }
                    />
                </MyView>
                <View style={styles.search_view}>
                    <Touchable style={styles.search_touchable} onPress={this.onSearchClick.bind(this)}>
                        <Image style={styles.search_image}
                            source={this.getResources().ic_Search} />
                    </Touchable>
                    <TextInput allowFontScaling={global.isScaleFont} ref={(textInputUser) => { this.textInputUser = textInputUser; }}
                        style={styles.search_input_text}
                        placeholder={this.t('input_name_search')}
                        placeholderTextColor='#a1a1a1'
                        underlineColorAndroid='rgba(0,0,0,0)'
                        multiline={false}
                        // onSubmitEditing={this.onSearchClick.bind(this)}
                        onChangeText={(text) => this.onChangeText(text)}
                    //value={this.state.textSearch}
                    >
                    </TextInput>
                </View>
                <View style={[styles.separator_view, { marginTop: 5 }]}></View>
                <View style={styles.container_bottom}>
                    <ListView ref={'listView'}
                        style={styles.container_bottom_listview}
                        dataSource={this.state.dataSourceBody}
                        keyboardShouldPersistTaps='always'
                        renderSeparator={(sectionId, rowId) => <View key={rowId} style={styles.separator_view} />}
                        enableEmptySections={true}
                        renderRow={(rowData) =>
                            <ClubItemAdd
                                club_id={this.club_id}
                                data={rowData} 
                                isMember={(rowData.club_member && Object.keys(rowData.club_member).length) ? true : false}/>
                        }
                    />
                </View>
            </View>
        );
    }
}