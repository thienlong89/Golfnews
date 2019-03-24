/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Dimensions,
    Image,
    Modal,
    Platform
} from 'react-native';
import Touchable from 'react-native-platform-touchable';
import BaseComponent from '../../Core//View/BaseComponent';
import Networking from '../../Networking/Networking';
import ApiService from '../../Networking/ApiService';
import DataManager from '../../Core/Manager/DataManager';
import Constant from '../../Constant/Constant';
import firebase from 'react-native-firebase';
import { deleteAllFinishFlight } from '../../DbLocal/FinishFlightRealm';
import { deleteAllFriendFlight } from '../../DbLocal/FriendFlightRealm';
import { deleteAllNotifications } from '../../DbLocal/NotificationRealm';
import { deleteAllNews } from '../../DbLocal/NewsRealm';
import { deleteAllMyRanking } from '../../DbLocal/Leaderboard/MyRankingRealm';
import { deleteAllTopBogey } from '../../DbLocal/Leaderboard/TopBogeyRealm';
import { deleteAllTopEighteen } from '../../DbLocal/Leaderboard/TopEighteenRealm';
import { deleteAllTopLady } from '../../DbLocal/Leaderboard/TopLadyRealm';
import { deleteAllTopPro } from '../../DbLocal/Leaderboard/TopProRealm';
import { deleteAllTopSingle } from '../../DbLocal/Leaderboard/TopSingleRealm';
import firebaseService from '../../Services/firebase';

import { scale, verticalScale, fontSize } from '../../Config/RatioScale';
let { width, height } = Dimensions.get('window');
import ListenerNewMessageChat from '../../Services/ListenerNewMessageChat';

import {deleteAll as deleteAllListChat} from '../../DbLocal/ListChatRealm';
import {deleteAll as deteleAllChat} from '../../DbLocal/ChatsRealm';
import RegisterListennerChat from '../../Services/RegisterListennerChat';

//const TAG = "[Vhandicap-v1] PopupNotificationView : ";
let screenWidth = Dimensions.get('window').width;
let popupWidth = screenWidth - scale(60);
let popupHeight = (2 * popupWidth) / 3;
let buttonWidth = popupWidth / 3;

const DELAY_TIME = 1200;
//type Props = {};
export default class PopupLogoutView extends BaseComponent {
    constructor(props) {
        super(props);
        this.navigation = null;
        this.startTime = 0;
        this.state = {
            isShow: false,
        }
    }

    setNavigation(_navigation) {
        this.navigation = _navigation;
    }

    dimiss(callback = null) {
        let endTime = (new Date()).getTime();
        if ((endTime - this.startTime) >= DELAY_TIME) {
            this.setState({
                isShow: false
            });
            if (callback) {
                callback();
            }
        } else {
            let deltaTime = (endTime - this.startTime);
            deltaTime = DELAY_TIME - deltaTime;
            this.delayHide(deltaTime, callback);
        }
    }

    /**
     * delay lai 3giây mới tắt - fix lỗi khi animation vừa chạy thì không ẩn đc trong ios
     */
    delayHide(deltaTime, callback = null) {
        var refreshIntervalId = setInterval(() => {
            this.setState({
                isShow: false
            });
            clearInterval(refreshIntervalId);
            if (callback) {
                callback();
            }
        }, deltaTime);
    }

    show() {
        if (this.state.isShow) return;
        this.startTime = (new Date()).getTime();
        this.setState({
            isShow: true
        });
    }

    onOkClick() {
        this.sendRequestLogout();
    }

    goToLogin() {
        //console.log("navigator : ", this.navigation);
        this.navigation.replace('select_language_screen');
    }

    /**
     * Gửi yêu cầu logout khỏi hệ thống
     */
    sendRequestLogout() {
        let url = this.getConfig().getBaseUrl() + ApiService.user_logout();
        //this.loading.showLoading();
        let self = this;
        Networking.httpRequestGet(url, (jsonData) => {
            //console.log("json data logout : ", jsonData);
            //self.loading.hideLoading();
            if (jsonData.hasOwnProperty('error_code')) {
                let error_code = parseInt(jsonData['error_code']);
                console.log('sendRequestLogout.error_code', error_code);
                if (error_code === 0) {
                    self.getUserInfo().clearProfile();
                    DataManager.clear();
                    self.clearGlobal();
                    self.dimiss(self.goToLogin.bind(self));
                    firebase.auth().signOut();

                    ListenerNewMessageChat.destroy();
                    RegisterListennerChat.destroy();

                    deleteAllFinishFlight();
                    deleteAllFriendFlight();
                    deleteAllNotifications();
                    // deleteAllNews();
                    deleteAllMyRanking();

                    deleteAllListChat();
                    deteleAllChat();
                    // deleteAllTopBogey();
                    // deleteAllTopEighteen();
                    // deleteAllTopLady();
                    // deleteAllTopPro();
                    // deleteAllTopSingle();
                    
                    // firebaseService.auth().signOut();
                    //DataManager.saveLocalData([[Constant.USER.USER_ID, ''], [Constant.USER.TOKEN, '']]);
                }
            }
        }, () => {
            //time out
            //self.loading.hideLoading();
            self.popupTimeOut.showPopup();
        });
    }

    onCancelClick() {
        this.dimiss();
    }

    render() {
        return (
            <Modal
                transparent={true}
                animationType={'fade'}
                visible={this.state.isShow}
                supportedOrientations={['portrait', 'portrait-upside-down', 'landscape', 'landscape-left', 'landscape-right']}
                onRequestClose={this.onCancelClick.bind(this)}>
                {this.renderLoading()}
                <View style={styles.modalBackground}>
                    <View style={styles.container}>
                        <View style={styles.title_view}>
                            <Image
                                style={styles.title_image}
                                source={this.getResources().logo_popup}
                            />
                            <Text allowFontScaling={global.isScaleFont} style={styles.title_text}>{this.t('signout')}</Text>
                            <View style={styles.title_right}></View>
                        </View>
                        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                            <Text allowFontScaling={global.isScaleFont} style={styles.msg_text}>{this.t('sign_out_msg')}</Text>
                        </View>

                        <View style={styles.bottom_view}>
                            <Touchable onPress={this.onCancelClick.bind(this)}>
                                <View style={styles.cancel_view}>
                                    <Text allowFontScaling={global.isScaleFont} style={styles.cancel_text}>{this.t('cancel')}</Text>
                                </View>
                            </Touchable>
                            <Touchable onPress={this.onOkClick.bind(this)}>
                                <View style={styles.ok_view}>
                                    <Text allowFontScaling={global.isScaleFont} style={styles.ok_text}>{this.t('agree')}</Text>
                                </View>
                            </Touchable>
                        </View>
                    </View>
                </View>
            </Modal>
        );
    }
}

const styles = StyleSheet.create({

    container: {
        width: popupWidth,
        height: popupHeight,
        backgroundColor: '#fff',
        borderColor: '#fff',
        borderWidth: 1,
        borderRadius: scale(5)
    },

    ok_text: {
        textAlign: 'center',
        fontSize: fontSize(20, scale(6)),// 20,
        color: '#fff',
        //fontWeight: "bold"
    },

    cancel_view: {
        width: buttonWidth,
        height: verticalScale(40),
        //marginTop: 10,
        justifyContent: 'center',
        marginLeft: buttonWidth / 3,
        alignItems: 'center',
        backgroundColor: '#fff',
        borderColor: '#00aba7',
        borderWidth: 1
    },

    cancel_text: {
        textAlign: 'center',
        fontSize: fontSize(20, scale(6)),// 20,
        color: '#00aba7',
        //fontWeight: "bold"
    },

    ok_view: {
        width: buttonWidth,
        height: verticalScale(40),
        // marginTop: 10,
        marginRight: buttonWidth / 3,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#00aba7'
    },

    bottom_view: {
        height: verticalScale(70),
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: 'row'
    },

    title_view: {
        height: verticalScale(40),
        borderTopLeftRadius : 5,
        borderTopRightRadius : 5,
        flexDirection: 'row',
        alignItems: "center",
        backgroundColor: '#f0f0f0'
    },

    title_image: {
        width: scale(35),
        height: verticalScale(35),
        marginLeft: scale(5),
        marginTop: verticalScale(2),
        resizeMode: 'contain'
    },

    title_text: {
        flex: 1,
        textAlign: 'center',
        fontSize: fontSize(22, scale(8)),// 22,
        color: '#685d5d',
        fontWeight: 'bold'
    },

    title_right: {
        width: scale(35),
        height: verticalScale(30)
    },

    msg_view: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'blue'
    },

    msg_text: {
        //flex: 1,
        alignSelf: 'center',
        marginLeft: scale(10),
        marginRight: scale(10),
        // marginTop : (Platform.OS === 'ios') ?  (popupHeight - (70+40+10+30))/2 : 10,
        fontSize: fontSize(16, scale(2)),// 16,
        color: '#685d5d',
        textAlignVertical: 'center'
    },

    modalBackground: {
        flex: 1,
        alignItems: 'center',
        flexDirection: 'column',
        justifyContent: 'space-around',
        backgroundColor: 'rgba(0,0,0,0.6)'
    },
});
