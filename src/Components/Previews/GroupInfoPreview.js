import React from 'react';
import {
    Platform,
    StyleSheet,
    Text,
    View,
    BackHandler,
    ImageBackground
} from 'react-native';
import BaseComponent from '../../Core/View/BaseComponent';
import HeaderView from '../HeaderView';
import GroupMemberListView from '../Groups/Items/GroupMemberListView';//'./Items/GroupMemberListView';
import PopupAttachImage from '../Common/PopupAttachImage';
import GroupMemberHeaderView from '../Groups/Items/GroupMemberHeaderView';//'./Items/GroupMemberHeaderView';
import PopupRemoteMember from '../CLB/Items/PopupRemoteMember';
import PopupYesOrNo from '../Common/PopupYesOrNo';
import { verticalScale, scale, fontSize } from '../../Config/RatioScale';

export default class GroupInfoPreview extends BaseComponent {

    constructor(props) {
        super(props);
        this.onBackPress = this.onBackPress.bind(this);
        this.onAddMemberPress = this.onAddMemberPress.bind(this);
        this.onChangeLogo = this.onChangeLogoPress.bind(this);
        this.onTakePhotoClick = this.onTakePhotoClick.bind(this);
        this.onImportGalleryClick = this.onImportGalleryClick.bind(this);
        this.onPlayerLongPress = this.onPlayerLongPress.bind(this);
        this.onRemoveMemberClick = this.onRemoveMemberClick.bind(this);
        this.onPopupConfirmClick = this.onPopupConfirmClick.bind(this);
        this.onViewProfileClick = this.onViewProfileClick.bind(this);

        this.data = this.props.navigation.state.params.data;
        console.log('GroupInfoView', this.data)
        this.isAdmin = this.data.host;
        this.groupId = this.data.groupId;
        this.backUpdate = false;
        this.playerSelected = {};
        this.state = {
            logoGroup: this.data.logoUrl
        }
    }

    render() {
        let { logoGroup } = this.state;

        return (
            <View style={styles.container}>
                <HeaderView
                    title={this.data.groupName}
                    handleBackPress={this.onBackPress}
                />

                <View style={{ flex: 1 }}>

                    <GroupMemberHeaderView
                        ref={(refGroupMemberHeaderView) => { this.refGroupMemberHeaderView = refGroupMemberHeaderView; }}
                        groupName={this.data.groupName}
                        onChangeLogo={this.onChangeLogo} />

                    <View style={styles.view_line}></View>

                    <GroupMemberListView
                        ref={(refGroupMemberListView) => { this.refGroupMemberListView = refGroupMemberListView; }}
                        groupId={this.data.groupId}
                        logoGroup={this.data.logoUrl}
                        isAdmin={this.isAdmin}
                        onPlayerLongPress={this.onPlayerLongPress}
                        onAddMember={this.onAddMemberPress}
                    />
                </View>

                <PopupRemoteMember
                    ref={(refPopupRemoteMember) => { this.refPopupRemoteMember = refPopupRemoteMember; }}
                    // onSetAdminClick={this.onSetAdminClick.bind(this)}
                    onRemoveMemberClick={this.onRemoveMemberClick}
                    onViewProfileClick={this.onViewProfileClick}
                // onSendMessageClick={this.onSendMessageClick.bind(this)}
                />

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

    onBackPress() {
        let { navigation } = this.props;
        if (navigation) {
            navigation.replace('app_screen');
        }
        // if (navigation) {
        //     navigation.goBack();
        // }
        // if (navigation.state.params.refreshCallBack) {
        //     navigation.state.params.refreshCallBack(this.backUpdate);
        // }
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

    onAddMemberPress() {
        this.props.navigation.navigate('group_add_member_view', {
            groupId: this.groupId,
            // course: this.courseData,
            // memberFlightList: this.state.memberFlightList
            AddMemberCallback: this.onAddMemberCallback.bind(this)
        })
    }

    onAddMemberCallback() {
        console.log('onAddMemberCallback')
        this.refGroupMemberListView.refresh();
        this.backUpdate = true;
    }

    onTakePhotoClick = async () => {
        let imageUri = await this.getAppUtil().onTakePhotoClick(true);
        // console.log('imageUri', imageUri);
        if (!imageUri.didCancel) {
            // this.requestUploadLogo(imageUri);
            this.refGroupMemberHeaderView.requestUploadLogo(imageUri);
        }

    }

    onImportGalleryClick = async () => {
        let imageUri = await this.getAppUtil().onImportGalleryClick(true);
        // console.log('imageUri', Platform.OS === 'android' ? 'file://' + imageUri.path : imageUri);
        if (!imageUri.didCancel) {
            this.refGroupMemberHeaderView.requestUploadLogo(imageUri);
            // this.requestUploadLogo(imageUri);
        }
    }

    onPlayerLongPress(section, player) {
        this.playerSelected = player;
        if (section.title === 0) {
            this.refPopupRemoteMember.show(false);
        } else {
            this.refPopupRemoteMember.show(this.isAdmin);
        }
    }

    onRemoveMemberClick() {
        this.refPopupYesOrNo.setContent(this.t('remove_member_group').format(`${this.playerSelected.getUserId()} - ${this.playerSelected.getFullName()}`), 1);
    }

    onPopupConfirmClick() {
        this.backUpdate = true;
        this.refGroupMemberListView.removeMember(this.playerSelected);
    }

    onViewProfileClick() {
        if (this.props.navigation) {
            this.props.navigation.navigate('player_info', { "puid": this.playerSelected.getId() });
        }
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
        fontSize: fontSize(17,scale(14)),
        marginLeft: scale(10)
    }
});