import React from 'react';
import { StyleSheet, Text, View, Image, Dimensions } from 'react-native';
import BaseComponent from '../../../Core/View/BaseComponent';
import AppUtil from '../../../Config/AppUtil';
import Touchable from 'react-native-platform-touchable';
import MyView from '../../../Core/View/MyView';
import ApiService from '../../../Networking/ApiService';
import Networking from '../../../Networking/Networking';
import ItemLoading from '../../Common/ItemLoadingView';
import { Avatar } from 'react-native-elements';
import PropsStatic from '../../../Constant/PropsStatic';

import { scale, verticalScale, fontSize } from '../../../Config/RatioScale';

export default class ClubMember extends BaseComponent {
    constructor(props) {
        super(props);
        this.state = {
            "is_friend": true,
            "is_waiting_friend_request": false,
            is_send_request: false,
            isLoading: false
        }

        this.onItemClick = this.onItemClick.bind(this);
        this.onUserClick = this.onUserClick.bind(this);
    }

    static defaultProps = {
        data: '',
        isCheck: false
    }

    onUserClick(){
        let{data} = this.props;
        let userId = data.userId;
        let navigation = PropsStatic.getAppSceneNavigator();
        if(navigation){
            navigation.navigate('player_info', { "puid": userId });
        }
    }

    showLoading() {
        if (this.itemLoading) {
            this.itemLoading.showLoading();
        }
    }

    hideLoading() {
        if (this.itemLoading) {
            this.itemLoading.hideLoading();
        }
    }

    onItemClick() {
        let { is_waiting_friend_request } = this.state;
        let self = this;
        this.showLoading();
        this.setState({
            isLoading: true
        });
        if (is_waiting_friend_request) {
            let url = this.getConfig().getBaseUrl() + ApiService.friend_denied(this.props.data.userId);
            Networking.httpRequestGet(url, (jsonData) => {
                self.hideLoading();
                if (jsonData.hasOwnProperty('error_code')) {
                    let error_code = parseInt(jsonData['error_code']);
                    if (error_code === 0) {
                        let { data } = self.props;
                        data.is_waiting_friend_request = false;
                        self.setState({
                            is_waiting_friend_request: false,
                            isLoading: false
                        });
                    } else {
                        self.setState({
                            isLoading: false
                        });
                        Alert.alert(
                            self.t('thong_bao'),
                            jsonData['error_msg'],
                            [
                                { text: 'OK', onPress: () => console.log('OK Pressed') },
                            ],
                            { cancelable: false }
                        )
                    }
                }
            }, () => {
                //time out
                self.setState({
                    isLoading: false
                });
                self.hideLoading();
                self.popupTimeOut.showPopup();
            })
        } else {
            let url = this.getConfig().getBaseUrl() + ApiService.friend_send_request(this.props.data.userId);
            //this.itemLoading.showLoading();
            console.log("url gui yc ket ban ", url);
            Networking.httpRequestGet(url, (jsonData) => {
                console.log("ket ban data : ", jsonData);
                self.hideLoading();
                if (jsonData.hasOwnProperty('error_code')) {
                    let error_code = jsonData['error_code'];
                    if (error_code === 0) {
                        let { data } = self.props;
                        data.is_waiting_friend_request = true;
                        self.setState({
                            is_waiting_friend_request: true,
                            isLoading: false
                        });
                    } else {
                        self.setState({
                            isLoading: false
                        });
                        Alert.alert(
                            self.t('thong_bao'),
                            jsonData['error_msg'],
                            [
                                { text: 'OK', onPress: () => console.log('OK Pressed') },
                            ],
                            { cancelable: false }
                        )
                    }
                }
            }, () => {
                //time out
                self.setState({
                    isLoading: false
                });
                self.hideLoading();
                self.popupTimeOut.showPopup();
            });
        }
    }

    sendRequest() {
        //
        let url = this.getConfig().getBaseUrl() + ApiService.friend_send_request(this.props.data.userId);
        console.log("url request : ", url);
        Networking.httpRequestGet(url, this.onResponeSendRequest.bind(this));
    }

    getColorView() {
        let { is_friend, is_waiting_friend_request } = this.state;
        if (is_friend) {
            return '#fff';
        } else if (is_waiting_friend_request) {
            return '#fff';
        } else {
            return '#00aba7';
        }
    }

    getColorText() {
        let { is_friend, is_waiting_friend_request } = this.state;
        if (is_friend) {
            return '#999';
        } else if (is_waiting_friend_request) {
            return '#999';
        } else {
            return '#fff';
        }
    }

    checkMe(userId) {
        //console.log("check me, ",userId,this.getUserInfo().getId());
        if (AppUtil.replaceUser(userId) === AppUtil.replaceUser(this.getUserInfo().getId())) {
            return true;
        }
        return false;
    }

    checkIsStateMember() {
        if (this.props.isCheck) return;
        let { data } = this.props;
        this.state.is_friend = data.is_friend,
            this.state.is_waiting_friend_request = data.is_waiting_friend_request
        this.props.isCheck = true;
    }

    render() {
        this.checkIsStateMember();
        let { data } = this.props;
        let { is_waiting_friend_request } = data;
        let { isLoading } = this.state;

        // console.log("vua update xong ============= ",is_waiting_friend_request);
        return (
            <Touchable onPress={this.onUserClick}>
                <View style={styles.container}>
                    {/* <View style={styles.avatar_view}>
                    <Image
                        style={styles.avatar_image}
                        source={(data.avatar && data.avatar.length) ? { uri: data.avatar } : this.getResources().avatar_default}
                    />
                </View> */}
                    <Avatar rounded={true}
                        width={scale(50)}
                        height={scale(50)}
                        containerStyle={{ marginLeft: scale(10) }}
                        avatarStyle={{ borderColor: '#fff', borderWidth: 2 }}
                        source={(data.avatar && data.avatar.length) ? { uri: data.avatar } : this.getResources().avatar_default}
                    />
                    <View style={styles.body}>
                        <Text allowFontScaling={global.isScaleFont} style={styles.fullname_text}>{data.fullname}</Text>
                        <Text allowFontScaling={global.isScaleFont} style={styles.userid_text}>{AppUtil.showUserId(data.userId, data.memberId)}</Text>
                        <Text allowFontScaling={global.isScaleFont} style={styles.hdc_text}>{this.t('hdc')} : {this.getAppUtil().handicap_display(data.handicap)}</Text>
                    </View>
                    <MyView hide={(data.facility_handicap !== undefined) ? false : true} style={styles.handicap_facility_view}>
                        <View style={styles.handicap_facility_circel}>
                            <Text allowFontScaling={global.isScaleFont} style={styles.handicap_facility_text}>{this.getAppUtil().handicap_display(data.facility_handicap)}</Text>
                        </View>
                    </MyView>
                    {/* //is_waiting_friend_request ||  */}
                    <MyView style={styles.add_friend_view} hide={this.checkMe(data.userId)}>
                        <Touchable onPress={this.onItemClick}>
                            <MyView style={[styles.add_friend_button, { borderColor: this.getColorText(), backgroundColor: this.getColorView() }]} hide={isLoading}>
                                <Text allowFontScaling={global.isScaleFont} style={{ textAlign: 'center', color: this.getColorText(), fontSize: fontSize(14) }}>{this.getStateFriend(this.state.is_friend, is_waiting_friend_request)}</Text>
                            </MyView>
                        </Touchable>
                        <ItemLoading ref={(itemLoading) => { this.itemLoading = itemLoading; }} top={verticalScale(20)} right={scale(20)} />
                    </MyView>
                    <MyView style={styles.add_friend_view} hide={!this.checkMe(data.userId)}>
                    </MyView>
                </View>
            </Touchable>
        );
    }
}

//<HideShowView style={styles.send_request_view} hide={!this.state.is_waiting_friend_request}>
//<Text allowFontScaling={global.isScaleFont} style={styles.send_request_text}>{this.getStateFriend(this.state.is_friend,this.state.is_waiting_friend_request)}</Text>
//</HideShowView>

const styles = StyleSheet.create({
    container: {
        // flex: 1,
        flexDirection: 'row',
        minHeight: verticalScale(70),
        alignItems: 'center'
    },

    avatar_view: {
        width: verticalScale(50),
        height: verticalScale(60),
        justifyContent: 'center',
        paddingLeft: scale(5)
    },

    avatar_image: {
        width: verticalScale(40),
        height: verticalScale(56),
        resizeMode: 'contain'
    },

    body: {
        flex: 1,
        justifyContent: 'center',
        marginLeft: scale(5),
        paddingTop: verticalScale(5),
        paddingBottom: verticalScale(5)
    },

    fullname_text: {
        fontSize: fontSize(16),// 16,
        fontWeight: 'bold',
        color: 'black'
    },

    userid_text: {
        fontSize: fontSize(13, -1),// 13,
        color: '#adadad'
    },

    hdc_text: {
        fontSize: fontSize(13, -1),// 13,
        color: '#adadad'
    },

    handicap_facility_view: {
        width: verticalScale(60),
        height: verticalScale(60),
        justifyContent: 'center',
        alignItems: 'center'
    },

    handicap_facility_circel: {
        width: verticalScale(40),
        height: verticalScale(40),
        borderColor: 'green',
        borderRadius: verticalScale(20),
        borderWidth: verticalScale(1.5),
        justifyContent: 'center',
        alignItems: 'center'
    },

    handicap_facility_text: {
        textAlign: 'center',
        color: '#00aba7',
        //fontSize: 13,
        fontSize: fontSize(13),
        fontWeight: 'bold'
    },

    add_friend_view: {
        width: scale(100),
        height: verticalScale(60),
        justifyContent: 'center',
        alignItems: 'center'
    },
    add_friend_button: {
        width: scale(90),
        height: verticalScale(30),
        borderRadius: verticalScale(3),
        borderWidth: verticalScale(1),
        justifyContent: 'center',
        justifyContent: 'center',
    },

    send_request_view: {
        width: scale(160),
        height: verticalScale(60),
        justifyContent: 'center',
        alignItems: 'center'
    },

    send_request_text: {
        textAlign: 'center',
        color: '#999999'
    }
});