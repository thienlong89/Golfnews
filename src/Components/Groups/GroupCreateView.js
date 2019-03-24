import React from 'react';
import {
    StyleSheet,
    View,
    BackHandler,
    Animated,
    Dimensions
} from 'react-native';
import BaseComponent from '../../Core/View/BaseComponent';
import HeaderView from '../HeaderView';
import GroupAddMemberList from './Items/GroupAddMemberList';
import PopupAttachImage from '../Common/PopupAttachImage';
import GroupMemberHeaderView from './Items/GroupMemberHeaderView';
import PopupRemoteMember from '../CLB/Items/PopupRemoteMember';
import PopupYesOrNo from '../Common/PopupYesOrNo';
import { verticalScale, scale, fontSize } from '../../Config/RatioScale';
import ApiService from '../../Networking/ApiService';
import Networking from '../../Networking/Networking';
import GroupChatManager from '../../Services/GroupChatManager';

// const HEADER_COLLAPSED_HEIGHT = 0;
// const { height } = Dimensions.get('window');

export default class GroupCreateView extends BaseComponent {

    constructor(props) {
        super(props);

        this.onBackPress = this.onBackPress.bind(this);
        this.onAddMemberPress = this.onAddMemberPress.bind(this);
        this.onChangeLogo = this.onChangeLogoPress.bind(this);
        this.onTakePhotoClick = this.onTakePhotoClick.bind(this);
        this.onImportGalleryClick = this.onImportGalleryClick.bind(this);
        this.onPopupConfirmClick = this.onPopupConfirmClick.bind(this);
        this.onViewProfileClick = this.onViewProfileClick.bind(this);
        this.logoUpdateCallback = this.logoUpdateCallback.bind(this);
        this.onMenuHeaderClick = this.onMenuHeaderClick.bind(this);
        this.onChangeGroupName = this.onChangeGroupName.bind(this);

        this.onAddAminClick = this.onAddAminClick.bind(this);

        this.groupId = '';
        this.logoUrl = '';
        this.isAdmin = true;
        this.groupName = '';
        this.localPath = '';
        this.isGroupCreated = false;
        this.playerList = [];
        this.state = {
        }

        this.groupChatManager = new GroupChatManager();
        this.group = {};
        this.userProfile = this.getUserInfo().getUserProfile();

        this.adminList = [
            this.userProfile
        ];
    }

    render() {

        return (
            <View style={styles.container}>
                <HeaderView
                    ref={(refHeaderView) => { this.refHeaderView = refHeaderView }}
                    title={this.t('create_new_group_title')}
                    handleBackPress={this.onBackPress}
                    menuTitle={this.t('done')}
                    isEnable={false}
                    onMenuHeaderClick={this.onMenuHeaderClick}
                />

                <View style={{ flex: 1 }}>

                    <GroupMemberHeaderView
                        ref={(refGroupMemberHeaderView) => { this.refGroupMemberHeaderView = refGroupMemberHeaderView; }}
                        onChangeLogo={this.onChangeLogo}
                        logoUpdateCallback={this.logoUpdateCallback}
                        isAllowEdit={true}
                        groupId={this.groupId}
                        groupName={this.groupName}
                        isCreate={true}
                        onChangeGroupName={this.onChangeGroupName} />

                    <View style={styles.view_line} />

                    <GroupAddMemberList
                        ref={(refGroupAddMemberList) => { this.refGroupAddMemberList = refGroupAddMemberList; }}
                        groupId={this.groupId}
                        logoGroup={this.logoUrl}
                        isAdmin={this.isAdmin}
                        // onPlayerLongPress={this.onPlayerLongPress}
                        onAddMember={this.onAddMemberPress}
                        onAddAmin={this.onAddAminClick}
                        scrollEventThrottle={16}
                    />

                    {this.renderInternalLoading()}
                </View>

                <PopupAttachImage
                    ref={(popupAttachImage) => { this.popupAttachImage = popupAttachImage; }}
                    onTakePhotoClick={this.onTakePhotoClick}
                    onImportGalleryClick={this.onImportGalleryClick} />
                <PopupYesOrNo
                    ref={(refPopupYesOrNo) => { this.refPopupYesOrNo = refPopupYesOrNo; }}
                    content={''}
                    confirmText={this.t('agree')}
                    cancelText={this.t('cancel')}
                    onConfirmClick={this.onPopupConfirmClick} />
                {this.renderMessageBar()}
            </View>
        );
    }

    onDone() {
        let { navigation } = this.props;
        // if (navigation) {
        //     if (this.isGroupCreated) {
        //         let data = {};
        //         data.groupId = this.groupId;
        //         data.groupName = this.groupName;
        //         data.host = true;
        //         navigation.replace('group_detail',
        //             {
        //                 data: data,
        //                 isMustUpdate: true,
        //                 // refresh: this.props.navigation.state.params.refresh()
        //             })
        //     } else {
        //         navigation.goBack();
        //     }
        // }

        if (navigation) {
            let data = {};
            data.id = this.groupId;
            data.groupName = this.groupName;
            data.host = true;
            data.type = 2;
            let { list_msg_chat_new } = data;
            if (list_msg_chat_new) {
                let length = list_msg_chat_new.length;
                RegisterListenerChat.total_msg = RegisterListenerChat.total_msg - length;
                RegisterListenerChat.updateTotalMsg();
            }
            this.isRender = false;
            // let{onRefresh} = navigation.state.params;
            navigation.replace('chat_group', {isMustUpdate: true, id: this.groupId, type: 3, name: this.groupName, categoriz: 'group',data: this.group});//,refresh : this.onRefresh.bind(this),isRefresh : true });
        }
    }

    onRefresh(){
        let{onRefresh} = this.props.navigation.state.params;
        if(onRefresh){
            onRefresh(this.group);
        }
    }

    onBackPress() {
        let { navigation } = this.props;
        if (navigation) {
            if (this.isGroupCreated) {
                let data = {};
                data.id = this.groupId;
                data.name = this.groupName;
                data.host = true;
                navigation.replace('group_detail',
                    {
                        data: data,
                        isMustUpdate: true,
                        // refresh: this.props.navigation.state.params.refresh()
                    })
            } else {
                navigation.goBack();
            }
        }
    }

    componentDidMount() {
        this.rotateToPortrait();
        this.registerMessageBar();
        this.handleHardwareBackPress();
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

    onChangeLogoPress() {
        this.popupAttachImage.show();
    }

    logoUpdateCallback() {
        this.backUpdate = true;
    }

    onAddMemberPress() {
        this.props.navigation.navigate('group_add_player_view', {
            groupId: this.groupId,
            // course: this.courseData,
            // memberFlightList: this.state.memberFlightList
            list_choosen : this.playerList,//[...this.playerList,...this.adminList],
            list_check : [...this.playerList,...this.adminList],
            AddMemberCallback: this.onAddMemberCallback.bind(this)
        })
    }

    onAddAminClick(){
        this.props.navigation.navigate('group_add_player_view', {
            groupId: this.groupId,
            // course: this.courseData,
            // memberFlightList: this.state.memberFlightList
            list_choosen : this.adminList,// [...this.playerList,...this.adminList],
            list_check : [...this.playerList,...this.adminList],
            AddMemberCallback: this.onAddAdminCallback.bind(this)
        })
    }

    onAddAdminCallback(playerList) {
        // console.log('onAddMemberCallback')
        // this.refGroupAddMemberList.refresh();
        // this.backUpdate = true;
        this.adminList = playerList;
        this.refGroupAddMemberList.updateData(this.adminList, this.playerList);
    }

    onAddMemberCallback(playerList) {
        // console.log('onAddMemberCallback')
        // this.refGroupAddMemberList.refresh();
        // this.backUpdate = true;
        this.playerList = playerList;
        this.refGroupAddMemberList.updateData(this.adminList, this.playerList);
    }

    onTakePhotoClick = async () => {
        let imageUri = await this.getAppUtil().onTakePhotoClick(true);
        // console.log('imageUri', imageUri);
        if (!imageUri.didCancel) {
            // this.requestUploadLogo(imageUri);
            // this.refGroupMemberHeaderView.requestUploadLogo(imageUri);
            if (this.isGroupCreated) {
                this.refGroupMemberHeaderView.requestUploadLogo(imageUri);
            } else {
                this.localPath = imageUri;
                this.refGroupMemberHeaderView.setLogoUpdate(imageUri.path);
            }

        }

    }

    onImportGalleryClick = async () => {
        let imageUri = await this.getAppUtil().onImportGalleryClick(true);
        // console.log('imageUri', Platform.OS === 'android' ? 'file://' + imageUri.path : imageUri);
        if (!imageUri.didCancel) {
            // this.refGroupMemberHeaderView.requestUploadLogo(imageUri);
            // this.requestUploadLogo(imageUri);
            console.log('...................... isGroupCreated',this.isGroupCreated);
            if (this.isGroupCreated) {
                this.refGroupMemberHeaderView.requestUploadLogo(imageUri);
            } else {
                this.localPath = imageUri;
                this.refGroupMemberHeaderView.setLogoUpdate(imageUri.path);
            }
        }
    }


    onPopupConfirmClick() {
        this.backUpdate = true;
        this.refGroupAddMemberList.removeMember(this.playerSelected);
    }

    onViewProfileClick() {
        if (this.props.navigation) {
            this.props.navigation.navigate('player_info', { "puid": this.playerSelected.getId() });
        }
    }

    onChangeGroupName(groupName) {
        this.groupName = groupName;
        this.refHeaderView.setMenuEnable(true);
        // this.requestCreateGroup();
    }

    onMenuHeaderClick() {
        this.requestCreateGroup();
    }

    createChatForGroup() {

    }

    requestCreateGroup() {
        let self = this;
        this.internalLoading.showLoading();
        // this.customLoadingView.setVisible(true);
        let url = this.getConfig().getBaseUrl() + ApiService.group_create();
        let uids = this.playerList.map((player) => {
            return player.getId();
        });
        // uids.push(this.getUserInfo().getId());
        let admins = this.adminList.map((player)=>{
            return player.getId();
        });

        admins = admins.filter(d=>d !== this.getUserInfo().getId());
        console.log('......................... admins list : ',admins);

        let formData = {
            name: this.groupName,
            user_ids: uids,
            users_ids_admin : admins
        };
        console.log('requestCreateGroup.url', url);
        console.log('requestCreateGroup.formData', formData);
        Networking.httpRequestPost(url, (jsonData) => {
            self.internalLoading.hideLoading();
            console.log('sendRequestCreateGroup', jsonData);
            // self.customLoadingView.setVisible(false);
            if (jsonData.hasOwnProperty('error_code')) {
                let error_code = parseInt(jsonData['error_code']);
                if (error_code === 0) {
                    //ok
                    /**
                     * 'sendRequestCreateGroup', { error_code: 0,
                        data:
                        { group:
                        { image_path: '',
                        host_user_id: 4,
                        total_member: 4,
                        id: 1038,
                        name: 'T├⌐t nh├│m mß╗¢i',
                        updated_at: '14:18:30,13-02-2019',
                        created_at: '14:18:30,13-02-2019' } },
                        error_msg: null }
                     */
                    if (jsonData.hasOwnProperty('data')) {
                        let data = jsonData['data'];
                        if (data.hasOwnProperty('group')) {
                            let group = data['group'];
                            group.createdAt = (new Date()).getTime();
                            group.type = 3;
                            group.type_chat = 1;
                            this.group = group;
                          
                            this.groupId = group['id'];
                            this.groupName = group['name'];
                            //thanh cong thi tao group tren firebase
                            // this.groupChatManager.init(this.groupId,this.groupName, null);
                            // this.groupChatManager.createGroupChat(uids,group);
                            
                            this.isGroupCreated = true;
                            console.log('........................... this.localPath.length ,',this.localPath.length);
                            if (this.localPath.length && this.refGroupMemberHeaderView) {
                                console.log('........................... this.localPath.length 2,',this.localPath.length);
                                this.refGroupMemberHeaderView.requestUploadLogo(this.localPath);
                                console.log('........................... this.localPath.length 3,',this.localPath.length);
                            }
                            // this.onBackPress();
                            this.onDone();
                            
                        }
                    }
                } else {
                    // self.popupNotify.setMsg(jsonData['error_msg']);
                    self.showErrorMsg(jsonData['error_msg']);
                }
            }

        }, formData, () => {
            //time out
            self.internalLoading.hideLoading();
            self.showErrorMsg(self.t('time_out'));
            //self.popupTimeOut.showPopup();
            // self.customLoadingView.setVisible(false);
        });
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    icon_menu_style: {
        width: verticalScale(25),
        height: verticalScale(25),
        resizeMode: 'contain'
    },
    view_header: {
        height: verticalScale(130),
        flexDirection: 'row',
        alignItems: 'center',
        paddingLeft: scale(10)
    },
    view_line: {
        backgroundColor: '#DADADA',
        height: verticalScale(8)
    },
    txt_group_name: {
        color: '#fff',
        fontSize: fontSize(17, scale(3)),
        marginLeft: scale(10)
    }
});