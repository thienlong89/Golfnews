import React from 'react';
import { View, Text, Image, Dimensions, StyleSheet } from 'react-native';
import BaseComponent from '../../../../Core/View/BaseComponent';
import { fontSize, scale, verticalScale } from '../../../../Config/RatioScale';
import MyView from '../../../../Core/View/MyView';
let { width } = Dimensions.get('window');
import PlayerInfoModel from '../../../../Model/PlayerInfo/PlayerInfoModel';
import Touchable from 'react-native-platform-touchable';
// let view_width = width - scale(20);
let btn_width = parseInt((width - scale(30)) / 2);

const FRIEND_STATUS = {
    NOT_FRIEND: -1,
    FRIEND: 1,
    WAITING_FOR_ACCEPT: 2,
    SENT_REQUEST: 0
}
/**
 * friend status 1 - friend, 2 no gui cho minh
 */

export default class ComChat extends BaseComponent {
    constructor(props) {
        super(props);
        this.state = {
            showIconFriend: false,
            icon: this.getResources().ic_unfriend,
            txt: this.t('reject_add_friend')
        }
        this.onFriendIconClick = this.onFriendIconClick.bind(this);
        this.onFriendIconCallback = null;

        this.onChatClick = this.onChatClick.bind(this);
        this.onChatCallback = null;

        this.isMe = false;
    }

    /**
     * kích vào button chat
     */
    onChatClick() {
        if (this.onChatCallback) {
            this.onChatCallback();
        }
    }

    /**
     * Icon kết bạn hoặc hủy lời mời...
     */
    onFriendIconClick() {
        if (this.onFriendIconCallback) {
            this.onFriendIconCallback();
        }
    }

    /**
     * Trạng thái bạn bè giữa 2 người icon
     * @param {Number} friend_status 
     */
    getIconStatusFriend(friend_status) {
        console.log('............................ check trang thai ban be : ', friend_status);
        let icon = null;
        switch (friend_status) {
            case FRIEND_STATUS.FRIEND:
                icon = this.getResources().icon_unfr;//icon huy ket ban
                break;
            case FRIEND_STATUS.NOT_FRIEND:
                icon = this.getResources().icon_addFr;
                break;
            case FRIEND_STATUS.SENT_REQUEST:
                icon = this.getResources().send_invite;
                break;
            default:
                break;
        }
        return icon;
    }

    /**
     * Trạng thái bạn bè giữa 2 người text
     * @param {Number} friend_status 
     */
    getNameStatusFriend(friend_status) {
        let name = '';
        switch (friend_status) {
            case FRIEND_STATUS.FRIEND:
                name = this.t('reject_add_friend');//icon huy ket ban
                break;
            case FRIEND_STATUS.NOT_FRIEND:
                name = this.t('add_friend');
                break;
            case FRIEND_STATUS.SENT_REQUEST:
                name = this.t('cancel_invite');
                break;
            default:
                break;
        }
        return name;
    }

    /**
     * Update data va view
     * @param {PlayerInfoModel} playerInfo 
     */
    updateData(friend_status,isMe=false) {
        this.isMe = isMe;
        if(isMe){
            this.setState({});
            return;
        }
        // this.userProfile = playerInfo.getPlayerProfile();
        // let puid = playerInfo.getPuid();
        // let friend_status = playerInfo.getFriendStatus();
        if (friend_status !== 2) {
            this.setState({
                showIconFriend: true,
                icon: this.getIconStatusFriend(friend_status),
                txt: this.getNameStatusFriend(friend_status),
            });
        } else {
            let { showIconFriend } = this.state;
            if (!showIconFriend) return;
            this.state = {
                showIconFriend: false,
            }
        }
    }

    render() {
        if(this.isMe) return null;
        let { showIconFriend, icon, txt } = this.state;
        return (
            <View style={{ flexDirection: 'row', alignItems: 'center', paddingLeft: scale(10), marginTop: verticalScale(10),paddingRight : scale(10) }}>
                <Touchable style={{flex:1}} onPress={this.onChatClick}>
                    <View style={{ flex: 1, maxHeight: verticalScale(50),minWidth : btn_width, borderColor: 'rgba(0, 0, 0, 0.3)', borderWidth: 1, borderRadius: 5, flexDirection: 'row', alignItems: 'center', paddingBottom: verticalScale(15), paddingTop: verticalScale(15) }}>
                        <Image style={styles.btn_img}
                            source={this.getResources().ic_discuss} />
                        <Text allowFontScaling={global.isScaleFont} style={styles.btn_text}>{this.t('chat')}</Text>
                    </View>
                </Touchable>
                <Touchable onPress={this.onFriendIconClick}>
                    <MyView style={styles.view_btn} hide={!showIconFriend}>
                        <Image style={styles.btn_img}
                            source={icon} />
                        <Text allowFontScaling={global.isScaleFont} style={styles.btn_text}>{txt}</Text>
                    </MyView>
                </Touchable>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    btn_text: {
        marginLeft: scale(15),
        fontSize: fontSize(16, scale(2)),
        color: '#343434'
    },

    view_btn: {
        width: btn_width,
        height: verticalScale(50),
        borderColor: 'rgba(0,0,0,0.3)',
        borderRadius: 5,
        borderWidth: 1,
        marginLeft: scale(10),
        flexDirection: 'row',
        alignItems: 'center'
    },

    btn_img: {
        width: verticalScale(30),
        height: verticalScale(30),
        marginLeft: scale(15),
        resizeMode: 'contain',
        tintColor: '#282828'
    }
});