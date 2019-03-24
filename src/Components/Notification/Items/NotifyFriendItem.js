import React from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image
} from 'react-native';
import Touchable from 'react-native-platform-touchable';
import BaseComponent from '../../../Core/View/BaseComponent';
// import MyView from '../../../Core/View/MyView';
import ApiService from '../../../Networking/ApiService';
import Networking from '../../../Networking/Networking';
import PopupNotify from '../../Popups/PopupNotificationView';
import HtmlText from '../../../Core/Common/HtmlBoldText';
import MyImage from '../../../Core/Common/MyImage';

import { scale, verticalScale, fontSize } from '../../../Config/RatioScale';
import { Avatar } from 'react-native-elements';

const NOTIFY_TYPE = {
    INVITE: 'invite_friend',
}

export default class NotifyFriendItem extends BaseComponent {
    constructor(props) {
        super(props);
        this.onAcceptClick = this.onAcceptClick.bind(this);
        this.onDeleteClick = this.onDeleteClick.bind(this);
        this.onDeniedClick = this.onDeniedClick.bind(this);
    }

    static defaultProps = {
        player: '',
        type: 0 // 0: receive invite friend; 1: suggest friend
    }

    /**
     * Gui yeu cau dong y ket ban
     */
    sendRequestAccept() {
        let { update } = this.props;
        let { SourceUser } = this.props.data;
        let url = this.getConfig().getBaseUrl() + ApiService.friend_accept(SourceUser.id);
        let self = this;
        Networking.httpRequestGet(url, (jsonData) => {
            console.log("dong y loi moi", jsonData);
            if (jsonData.hasOwnProperty('error_code')) {
                let error_code = parseInt(jsonData['error_code']);
                if (error_code === 0) {
                    //thanh cong thi update lai giao dien
                    update();
                } else {
                    self.popupNotify.setMsg(jsonData['error_msg']);
                }
            }
        });
    }

    /**
     * Gửi yêu cầu hủy lời mời kết bạn
     */
    sendRequestDenied() {
        let { update } = this.props;
        let { SourceUser } = this.props.data;
        let url = this.getConfig().getBaseUrl() + ApiService.friend_denied(SourceUser.id);
        let self = this;
        Networking.httpRequestGet(url, (jsonData) => {
            if (jsonData.hasOwnProperty('error_code')) {
                let error_code = parseInt(jsonData['error_code']);
                if (error_code === 0) {
                    //thanh cong thi update lai giao dien
                    update();
                } else {
                    self.popupNotify.setMsg(jsonData['error_msg']);
                }
            }
        });
    }

    onAcceptClick() {
        // this.sendRequestAccept();
        let { onAddFriend, data } = this.props;
        if (onAddFriend) {
            onAddFriend(data);
        }
    }

    onDeniedClick() {
        let { onRejectFriend, data } = this.props;
        if (onRejectFriend) {
            onRejectFriend(data);
        }
    }

    /**
     * Xoa loi moi ket ban
     */
    onDeleteClick() {
        if (this.props.onRejectFriend) {
            this.props.onRejectFriend();
        }
    }

    render() {
        // let { 
        //     player,
        //     type
        //  } = this.props;
        let { type, SourceUser,message } = this.props.data;//SourceUser
        if(!SourceUser) return null;
        // let fullName = player.fullname;
        console.log('..................... type, user_fullname_action : ', type,this.props.data);
        let msg = this.t('request_friend').format(SourceUser.fullname);// `<b>${user_fullname_action}</b> ${this.t('')}`
        return (
            <View style={styles.container}>
                {/* <PopupNotify ref={(popupNotify) => { this.popupNotify = popupNotify; }} /> */}
                <Avatar
                    containerStyle={{ marginLeft: scale(20) }}
                    width={verticalScale(55)}
                    height={verticalScale(55)}
                    rounded
                    source={SourceUser.avatar && SourceUser.avatar.length ? { uri: SourceUser.avatar } : this.getResources().avatar_event_default}

                />
                <View style={styles.content}>
                    <HtmlText
                        style={styles.html_text}
                        message={msg}
                    />
                    <View style={styles.my_view} >
                        <Touchable onPress={this.onAcceptClick}>
                            <View style={styles.chap_nhan_button_view}>
                                <Text allowFontScaling={global.isScaleFont} style={styles.chap_nhan_text}>{type === 'invite_friend' ? this.t('chap_nhan') : this.t('add_friend')}</Text>
                            </View>
                        </Touchable>
                        <Touchable onPress={this.onDeniedClick}>
                            <View style={styles.tu_choi_button_view}>
                                <Text allowFontScaling={global.isScaleFont} style={styles.tu_choi_text}>{this.t('delete')}</Text>
                            </View>
                        </Touchable>
                    </View>
                </View>

            </View>
        );
    }
}


const styles = StyleSheet.create({
    container: {
        minHeight: verticalScale(70),
        flexDirection: 'row',
        alignItems: 'center'
    },

    html_text: {
        fontSize: fontSize(15),
        color: '#000',
        marginTop: verticalScale(5),
        marginRight: scale(5),
        // fontWeight: 'bold'
    },

    avatar_img: {
        width: scale(40),
        height: verticalScale(50),
        marginLeft: scale(5),
        marginTop: scale(5),
        resizeMode: 'contain'
    },

    chap_nhan_text: {
        fontSize: fontSize(13, -2),
        color: "#fff",
        fontWeight: 'bold'
    },

    my_view: {
        flexDirection: 'row',
        //marginTop: 5,
    },

    tu_choi_text: {
        fontSize: fontSize(13, -2),
        color: "#5E5E5E"
    },

    tu_choi_button_view: {
        width: scale(90),
        height: verticalScale(32),
        marginRight: scale(10),
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderColor: '#5E5E5E',
        borderWidth: 1,
        borderRadius: 3,
        marginBottom: verticalScale(3),
    },

    chap_nhan_button_view: {
        width: scale(90),
        height: verticalScale(30),
        marginRight: scale(10),
        justifyContent: 'center',
        backgroundColor: '#00ABA7',
        alignItems: 'center',
        borderColor: '#00ABA7',
        borderWidth: 1,
        borderRadius: 3,
    },

    content: {
        flex: 1,
        minHeight: verticalScale(65),
        marginLeft: scale(10),
        justifyContent: 'space-between',
    },

    date_display: {
        fontSize: fontSize(12, -2),
        color: '#bdbdbd',
        //paddingLeft : 6,
        // marginLeft : 5,
        //backgroundColor : 'green'
    },

    web_view: {
        flex: 1
    },

    timestamp_text: {
        marginLeft: scale(5),
        fontSize: fontSize(12, -2),//12,
        color: '#bdbdbd',
        marginBottom: verticalScale(3)
    }
});