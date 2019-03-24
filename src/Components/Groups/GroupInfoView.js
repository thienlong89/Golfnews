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
import GroupMemberListView from './Items/GroupMemberListView';
import PopupAttachImage from '../Common/PopupAttachImage';
import GroupMemberHeaderView from './Items/GroupMemberHeaderView';
import PopupRemoteMemberGroup from './Items/PopupRemoteMemberGroup';
import PopupYesOrNo from '../Common/PopupYesOrNo';
import { verticalScale, scale, fontSize } from '../../Config/RatioScale';
import RegisterListennerChat from '../../Services/RegisterListennerChat';

// const HEADER_COLLAPSED_HEIGHT = 0;
// const { height } = Dimensions.get('window');

export default class GroupInfoView extends BaseComponent {

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
        this.logoUpdateCallback = this.logoUpdateCallback.bind(this);
        this.onChangeGroupName = this.onChangeGroupName.bind(this);
        this.onAddAdminPress = this.onAddAdminPress.bind(this);
        this.onSetAdministrator = this.onSetAdministrator.bind(this);

        this.data = this.props.navigation.state.params.data;
        let{show_chat} = this.props.navigation.state.params;
        this.show_chat = show_chat ? true : false;
        console.log('....................group info data : ',this.show_chat);
        this.isAdmin = this.data.host;
        this.groupId = this.data.groupId;
        this.backUpdate = false;
        this.playerSelected = {};
        this.state = {
            logoGroup: this.data.logoUrl ? this.data.logoGroup : this.data.image_path,
            scrollY: new Animated.Value(0),
            header_expanded_height: verticalScale(130)
        }
    }

    render() {
        let {
            header_expanded_height,
            scrollY
         } = this.state;

        // let translateY = scrollY.interpolate({
        //     inputRange: [0, header_expanded_height],
        //     outputRange: [0, -header_expanded_height + HEADER_COLLAPSED_HEIGHT],
        //     // outputRange: [0, 0],
        //     extrapolate: 'clamp'
        // });

        // const headerHeight = scrollY.interpolate({
        //     inputRange: [0, header_expanded_height - HEADER_COLLAPSED_HEIGHT],
        //     outputRange: [header_expanded_height, HEADER_COLLAPSED_HEIGHT],
        //     extrapolate: 'clamp'
        // });
        // // const headerTitleOpacity = scrollY.interpolate({
        // //     inputRange: [0, header_expanded_height - HEADER_COLLAPSED_HEIGHT],
        // //     outputRange: [0, 1],
        // //     extrapolate: 'clamp'
        // // });
        // const heroTitleOpacity = scrollY.interpolate({
        //     inputRange: [0, header_expanded_height - HEADER_COLLAPSED_HEIGHT],
        //     outputRange: [1, 0],
        //     extrapolate: 'clamp'
        // });

        return (
            <View style={styles.container}>
                <HeaderView
                    ref={(header)=>{this.header = header;}}
                    title={this.data.groupName}
                    handleBackPress={this.onBackPress}
                />

                <View style={{ flex: 1 }}>
                    {/* <Animated.View style={[{
                        backgroundColor: 'rgba(0,0,0,0)',
                        transform: [{ translateY: translateY }], overflow: 'hidden'
                    }, {}]}> */}


                    {/* <Animated.View style={[{ opacity: heroTitleOpacity }]}> */}
                    <GroupMemberHeaderView
                        ref={(refGroupMemberHeaderView) => { this.refGroupMemberHeaderView = refGroupMemberHeaderView; }}
                        groupName={this.data.groupName}
                        groupId={this.groupId}
                        onChangeLogo={this.onChangeLogo}
                        logoGroup={this.data.logoUrl ? this.data.logoUrl : this.data.image_path}
                        isAllowEdit={this.isAdmin}
                        isCreate={false}
                        logoUpdateCallback={this.logoUpdateCallback}
                        onChangeGroupName={this.onChangeGroupName} />

                    <View style={styles.view_line}></View>
                    {/* </Animated.View> */}
                    {/* </Animated.View> */}

                    {/* <Animated.View style={{
                        flex: 0,
                        transform: [{ translateY: translateY }],
                        overflow: 'hidden',
                        height: height
                    }}> */}
                    <GroupMemberListView
                        ref={(refGroupMemberListView) => { this.refGroupMemberListView = refGroupMemberListView; }}
                        groupId={this.data.groupId}
                        logoGroup={this.data.logoUrl}
                        isAdmin={this.isAdmin}
                        onPlayerLongPress={this.onPlayerLongPress}
                        onAddMember={this.onAddMemberPress}
                        onAddAdminPress={this.onAddAdminPress}
                        onScroll={Animated.event(
                            [{ nativeEvent: { contentOffset: { y: scrollY } } }],
                            {
                                // useNativeDriver: true,
                                // listener: event => {
                                //     const offsetY = event.nativeEvent.contentOffset.y
                                //     // do something special
                                //     // this.isCloseToBottom(event.nativeEvent)

                                // },
                            },
                        )}

                        scrollEventThrottle={16}
                    />
                    {/* </Animated.View> */}
                </View>

                <PopupRemoteMemberGroup
                    ref={(refPopupRemoteMember) => { this.refPopupRemoteMember = refPopupRemoteMember; }}
                    onSetAdministrator={this.onSetAdministrator}
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
            navigation.goBack();
        }
        if (navigation.state.params.refreshCallBack) {
            navigation.state.params.refreshCallBack(this.backUpdate, this.data.groupName);
        }
    }

    componentDidMount() {
        this.rotateToPortrait();
        this.registerMessageBar();
        this.handleHardwareBackPress();
        if(this.show_chat){
            this.header.props.onIconMapClick = this.onChatClick.bind(this);
            this.header.setRightIcon(this.getResources().ic_chat_info);
        }
    }

    //{ id: data.id, type: type, name: data.name, categoriz: 'group', refresh: this.refresh.bind(this, data), data: data });
    //this.data : chat : ', { host: false, groupId: 1122, logoUrl: '', groupName: 'Hihi' }
    onChatClick(){
        let {navigation} = this.props;
        console.log('................... this.data : chat : ',this.data);
        
        if(navigation){
            navigation.replace('global_chat',{ id: this.data.groupId, 
                type: 2, name: this.data.groupName, categoriz: 'group', refresh: this.refresh.bind(this,this.data), data: this.data })
        }
    }

    refresh(data){
        RegisterListennerChat.listGroup.push(data);
        RegisterListennerChat.listChats.push(data);
        // if(RegisterListennerChat.renderViewCallback){
        //     RegisterListennerChat.renderViewCallback();
        // }
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

    onAddAdminPress() {
        this.props.navigation.navigate('group_add_admin_view', {
            groupId: this.groupId,
            // course: this.courseData,
            // memberFlightList: this.state.memberFlightList
            AddAdminCallback: this.onAddAdminCallback.bind(this)
        })
    }

    onAddAdminCallback() {
        this.refGroupMemberListView.refresh();
        // this.backUpdate = true;
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
        // console.log('onAddMemberCallback')
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
        console.log('onPlayerLongPress')
        this.playerSelected = player;
        this.refPopupRemoteMember.show(this.isAdmin, section.title);
    }

    onSetAdministrator() {
        this.refPopupYesOrNo.setContent(this.t('set_team_owner_confirm').format(`${this.playerSelected.getFullName()} - ${this.playerSelected.getUserId()}`), 0);
    }

    onRemoveMemberClick() {
        this.refPopupYesOrNo.setContent(this.t('remove_member_group').format(`${this.playerSelected.getFullName()} - ${this.playerSelected.getUserId()}`), 1);
    }

    onPopupConfirmClick(extrasData) {
        switch (extrasData) {
            case 0:
                this.refGroupMemberListView.setAdministrator(this.playerSelected);
                break;
            case 1:
                this.backUpdate = true;
                this.refGroupMemberListView.removeMember(this.playerSelected);
                break;
            default:
                break;
        }

    }

    onViewProfileClick() {
        if (this.props.navigation) {
            this.props.navigation.navigate('player_info', { "puid": this.playerSelected.getId() });
        }
    }

    onChangeGroupName(groupName) {
        this.data.groupName = groupName;
        this.setState({

        }, () => {
            this.backUpdate = true;
            // refreshCallBack
        })
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