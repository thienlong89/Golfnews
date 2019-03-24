import React from 'react';
import {
    Platform,
    StyleSheet,
    Text,
    View,
    Image,
    TouchableOpacity
} from 'react-native';
import BaseComponent from '../../../Core/View/BaseComponent';
import CustomAvatar from '../../Common/CustomAvatar';
import Touchable from 'react-native-platform-touchable';
import MyView from '../../../Core/View/MyView';
import Networking from '../../../Networking/Networking';
import ApiService from '../../../Networking/ApiService';
import { scale } from '../../../Config/RatioScale';

export default class FriendStatusItem extends BaseComponent {

    static defaultProps = {
        interactType: 0, // 0: love, 1: like, 2: dislike,
        playerStatus: {},
        uid: ''
    }

    constructor(props) {
        super(props);
        this.interactTypes = [
            this.getResources().ic_group_heart,
            this.getResources().ic_group_like,
            this.getResources().ic_group_dislike
        ]
        this.user = this.props.playerStatus.getUserProfile();
        this.state = {
            isFriend: this.checkIsFriend(this.props.playerStatus.getStatusFriend(), this.user)
        }

        this.onOpenChatPrivate = this.onOpenChatPrivate.bind(this);
    }

    render() {

        let { interactType, playerStatus } = this.props;
        let { isFriend } = this.state;

        return (
            <View style={styles.container}>
                <View style={{ width: scale(50) }}>
                    <CustomAvatar
                        width={45}
                        height={45}
                        uri={this.user.getAvatar()}
                    />
                    <Image
                        style={styles.icon_heart}
                        source={this.interactTypes[interactType]}
                    />
                </View>
                <View style={styles.view_center}>
                    <Text allowFontScaling={global.isScaleFont} style={styles.txt_name}>{this.user.getFullName()}</Text>
                </View>
                <View style={styles.view_end}>
                    {/* <MyView hide={isFriend === -2 || isFriend === 1}>
                        <Touchable style={[styles.touchable_friend, isFriend === 0 ? { backgroundColor: '#FFF', borderColor: '#BDBDBD' } : { backgroundColor: '#4294F7', borderColor: '#4294F7' }]}
                            // disabled={isFriend}
                            onPress={this.onAddRemoveFriendPress.bind(this, isFriend)}>
                            <Text allowFontScaling={global.isScaleFont} style={[styles.txt_friend_status, isFriend === 0 ? { color: '#999999' } : { color: '#FFF' }]}>
                                {isFriend === -1 ? this.t('add_friend') : this.t('cancel_title')}
                            </Text>
                        </Touchable>
                    </MyView> */}

                    <MyView hide={isFriend === -2}>
                        <TouchableOpacity onPress={this.onOpenChatPrivate}>
                            <Image style={styles.img_chat}
                                source={this.getResources().ic_chat} />
                        </TouchableOpacity>
                    </MyView>

                </View>

            </View>
        );
    }

    // -2: chính mình, -1: không quen biết, 0 - người kia gửi y/c cho mình, 1- 2 người là bạn,2 - là mình gửi yêu cầu cho người kia',
    checkIsFriend(statusFriend, user) {
        if (this.getAppUtil().replaceUser(user.getId()) === this.getAppUtil().replaceUser(this.props.uid))
            return -2;

        return statusFriend;
    }

    onAddRemoveFriendPress(isFriend) {
        if (isFriend === -1) {
            this.setState({
                isFriend: 0
            }, () => {
                this.sendRequestAddFriend()
            })
        } else if (isFriend === 0) {
            this.setState({
                isFriend: -1
            }, () => {
                this.sendRequestRemoveFriend()
            })
        }

    }

    sendRequestAddFriend() {
        let self = this;
        let url = this.getConfig().getBaseUrl() + ApiService.friend_add(this.user.getId());
        Networking.httpRequestGet(url, (jsonData) => {
            if (jsonData.hasOwnProperty('error_code')) {
                let error_code = parseInt(jsonData['error_code']);
                if (error_code === 0) {
                    console.log('sendRequestAddFriend', jsonData['error_msg'])
                    // self.showSuccessMsg(jsonData['error_msg']);
                    // this.friend_status = 1;
                    // self.playerInfoItem.setChangeState(this.friend_status);
                } else {
                    // self.showErrorMsg(jsonData['error_msg']);
                }
            }
            // self.loading.hideLoading();
        }, () => {
            //time out
            // self.loading.hideLoading();
        });
    }

    sendRequestRemoveFriend() {
        let self = this;
        // this.loading.showLoading();
        let url = this.getConfig().getBaseUrl() + ApiService.friend_remove(this.user.getId());
        Networking.httpRequestGet(url, (jsonData) => {
            if (jsonData.hasOwnProperty('error_code')) {
                let error_code = parseInt(jsonData['error_code']);
                if (error_code === 0) {
                    console.log('sendRequestRemoveFriend', jsonData['error_msg'])
                    // self.showSuccessMsg(jsonData['error_msg']);
                    // this.friend_status = 2;
                    // self.playerInfoItem.setChangeState(this.friend_status);
                } else {
                    // self.showErrorMsg(jsonData['error_msg']);
                }
            }
            // self.loading.hideLoading();
        }, () => {
            //time out
            // self.loading.hideLoading();
        });
    }

    // sendRequestAccept() {
    //     let { data, update } = this.props;
    //     let { target_user } = data;
    //     let url = this.getConfig().getBaseUrl() + ApiService.friend_accept(target_user.id);
    //     let self = this;
    //     Networking.httpRequestGet(url, (jsonData) => {
    //         console.log("dong y loi moi",jsonData);
    //         if (jsonData.hasOwnProperty('error_code')) {
    //             let error_code = parseInt(jsonData['error_code']);
    //             if (error_code === 0) {
    //                 //thanh cong thi update lai giao dien
    //                 update();
    //             } else {
    //                 self.popupNotify.setMsg(jsonData['error_msg']);
    //             }
    //         }
    //     });
    // }

    // /**
    //  * Gửi yêu cầu hủy lời mời kết bạn
    //  */
    // sendRequestDenied() {
    //     let { data, update } = this.props;
    //     let { target_user } = data;
    //     let url = this.getConfig().getBaseUrl() + ApiService.friend_denied(target_user.id);
    //     let self = this;
    //     Networking.httpRequestGet(url, (jsonData) => {
    //         if (jsonData.hasOwnProperty('error_code')) {
    //             let error_code = parseInt(jsonData['error_code']);
    //             if (error_code === 0) {
    //                 //thanh cong thi update lai giao dien
    //                 update();
    //             } else {
    //                 self.popupNotify.setMsg(jsonData['error_msg']);
    //             }
    //         }
    //     });
    // }

    onOpenChatPrivate() {
        if (this.props.onOpenChatPrivate) {
            this.props.onOpenChatPrivate(this.props.playerStatus, this.state.isFriend);
        }
    }

}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        paddingTop: 10,
        paddingBottom: 10,
        paddingLeft: 10,
        paddingRight: 10
    },
    icon_heart: {
        position: 'absolute',
        right: -5,
        bottom: 0,
        width: 23,
        height: 23,
        resizeMode: 'contain'
    },
    view_center: {
        marginLeft: scale(10),
        marginRight: 5,
        flex: 1,
        justifyContent: 'center',
    },
    view_end: {
        justifyContent: 'center'
    },
    txt_name: {
        fontSize: 17,
        color: '#353535'
    },
    touchable_friend: {
        borderRadius: 5,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        minWidth: 80,
    },
    txt_friend_status: {
        fontSize: 15,
        paddingTop: 5,
        paddingBottom: 5
    },
    img_chat: {
        width: 45,
        height: 45,
        resizeMode: 'center'
    }
});