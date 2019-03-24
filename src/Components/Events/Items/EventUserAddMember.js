import React from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    TouchableWithoutFeedback,
    Dimensions
} from 'react-native';
import Touchable from 'react-native-platform-touchable';
import BaseComponent from '../../../Core/View/BaseComponent';
import { Avatar } from 'react-native-elements';
import MyView from '../../../Core/View/MyView';
import ItemLoading from '../../Common/ItemLoadingView';
import ApiService from '../../../Networking/ApiService';
import Networking from '../../../Networking/Networking';
import PopupComfirmView from '../../Popups/PopupConfirmView';
import { verticalScale, scale, fontSize } from '../../../Config/RatioScale';
import PropsStatic from '../../../Constant/PropsStatic';

const screenWidth = Dimensions.get('window').width;
export default class EventUserAddMember extends BaseComponent {
    constructor(props) {
        super(props);
        this.closeKeyboard = null;
        this.state = {
            isLoading: false,
            showPopup: false
        }

        this.onUserClick = this.onUserClick.bind(this);
        this.onAddClick = this.onAddClick.bind(this);
    }

    static defaultProps = {
        data: null,
        is_member: undefined
    }

    onUserClick(){
        let { data } = this.props;
        let userId = data.getUserId();
        let navigation = PropsStatic.getAppSceneNavigator();
        this.Logger().log('............................ navigation : ',navigation);
        if (navigation) {
            navigation.navigate('player_info', { "puid": userId });
        }
    }

    showUserId() {
        let { data } = this.props;
        return data.getMemberId().length ? data.getUserId() + '-' + data.getMemberId() : data.getUserId();
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

    onAddClick() {
        let { event_id, data, closeKeyboard } = this.props;
        let url = this.getConfig().getBaseUrl() + ApiService.event_add_member(event_id, data.getUserId());
        // console.log('add event member ',url);
        this.showLoading();
        if (closeKeyboard) {
            closeKeyboard();
        }
        this.setState({
            isLoading: true
        });
        let self = this;
        Networking.httpRequestGet(url, (jsonData) => {
            self.hideLoading();
            // console.log('jsonData member event : ',jsonData);
            if (jsonData.hasOwnProperty('error_code')) {
                let error_code = jsonData['error_code'];
                if (error_code === 0) {
                    self.props.data.in_event = true;
                    self.setState({
                        isLoading: false,
                    });
                } else {
                    self.setState({
                        isLoading: false,
                    });
                }
            }
        }, () => {
            self.hideLoading();
            self.setState({
                isLoading: false
            });
        });
    }

    render() {
        let { data } = this.props;
        let { isLoading, showPopup } = this.state;
        //console.log("data.getAccepted() === 0 ",(data.getAccepted() === 0),data.getAccepted(),typeof data.getAccepted());
        return (
            <Touchable onPress={this.onUserClick}>
                <View style={styles.container}>
                    {this.renderLoading()}
                    <View style={styles.container_avatar}>
                        <Avatar
                            width={verticalScale(50)}
                            height={verticalScale(50)}
                            rounded={true}
                            source={data.getAvatar().length ? { uri: data.getAvatar() } : this.getResources().avatar_default}
                        />
                    </View>
                    <View style={styles.container_body}>
                        <Text allowFontScaling={global.isScaleFont} style={styles.text_body_fullname}>{data.getFullname()}</Text>
                        <Text allowFontScaling={global.isScaleFont} style={styles.text_body_userid}>{this.showUserId()}</Text>
                        <Text allowFontScaling={global.isScaleFont} style={styles.text_body_hdc}>{this.t('handicap_title')}: {this.getAppUtil().handicap_display(data.getHandicap())}</Text>
                    </View>
                    <Touchable onPress={this.onAddClick}>
                        <MyView style={{ width: scale(100), height: verticalScale(36), marginRight: scale(7), justifyContent: 'center', alignItems: 'center', borderColor: "#00aba7", backgroundColor: '#00aba7', borderWidth: 1 }} hide={isLoading || (data.in_event)}>
                            <Text allowFontScaling={global.isScaleFont} style={{ fontSize: fontSize(16, scale(2)), color: '#fff', textAlign: 'center' }}>{this.t('add')}</Text>
                        </MyView>
                    </Touchable>
                    <MyView style={{ width: scale(120), padding: verticalScale(3), height: verticalScale(36), marginRight: scale(7), justifyContent: 'center', alignItems: 'center', borderColor: "#707070", backgroundColor: '#fff', borderWidth: 1 }} hide={!data.in_event}>
                        <Text allowFontScaling={global.isScaleFont} style={{ fontSize: fontSize(13, -scale(1)), color: '#00aba7', textAlign: 'center' }}>{this.t('in_event')}</Text>
                    </MyView>
                    {/* <MyView style={styles.wating_view} hide={data.getAccepted() === 1}>
                    <Text allowFontScaling={global.isScaleFont} style={{ fontSize: 12, color: '#adadad', textAlign: 'center' }}>{(data.getAccepted() === 0) ? this.t('waiting_for_accept') : ''}</Text>
                </MyView>
                <MyView style={styles.wating_view} hide={data.getAccepted() !== 1}>
                    <Image style={{ width: 30, height: 22, resizeMode: 'contain', tintColor: '#00aba7' }}
                        source={this.getResources().btn_save} />
                </MyView> */}
                    <ItemLoading ref={(itemLoading) => { this.itemLoading = itemLoading; }} top={verticalScale(15)} right={scale(20)} />
                </View >
            </Touchable>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        height: verticalScale(60),
        flexDirection: 'row',
        alignItems: 'center',
        width: screenWidth
    },

    wating_view: {
        alignItems: 'center',
        width: scale(80),
        height: verticalScale(60),
        padding: verticalScale(5),
        justifyContent: 'center'
    },

    handicap_facility_view: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderColor: '#00aba7',
        borderRadius: verticalScale(20),
        width: verticalScale(40),
        height: verticalScale(40),
        borderWidth: 1.5,
        marginRight: scale(10)
    },

    handicap_facility_text: {
        alignSelf: 'center',
        color: '#00aba7',
        fontWeight: 'bold'
        //fontSize : 25
    },

    container_container: {
        flex: 1,
        flexDirection: 'row',
        paddingTop: verticalScale(5),
        paddingBottom: verticalScale(5),
        minHeight: verticalScale(70),
        // height: 60,
        flexDirection: 'row',
        alignItems: 'center'
    },

    button_delete_group: {
        width: scale(100),
        marginRight: scale(3),
        height: verticalScale(22),
        borderColor: '#707070',
        borderRadius: verticalScale(11),
        borderWidth: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },

    delete_group_text: {
        fontSize: fontSize(12, -scale(2)),
        color: '#707070',
        textAlign: 'center'
    },

    container_avatar: {
        width: verticalScale(50),
        height: verticalScale(50),
        marginLeft: scale(10)
    },

    view_avatar: {
        width: verticalScale(50),
        height: verticalScale(50)
    },

    image_avatar: {
        resizeMode: 'contain',
        minHeight: verticalScale(50),
        minWidth: verticalScale(50)
    },

    container_body: {
        flex: 1,
        justifyContent: 'center',
        marginLeft: scale(5)
    },

    view_body: {
        flex: 1,
        justifyContent: 'center'
    },

    text_body_fullname: {
        flex: 0.3,
        fontWeight: 'bold',
        color: 'black',
        fontSize: fontSize(14)
    },

    text_body_userid: {
        flex: 0.3,
        color: '#adadad',
        fontSize: fontSize(13, -scale(1))
    },

    text_body_hdc: {
        flex: 0.3,
        color: '#737373'
    },

    container_add: {
        width: scale(100),
        height: verticalScale(70),
        justifyContent: 'center',
        alignItems: 'center',
    },

    button_add_club: {
        height: verticalScale(30),
        width: scale(100),
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: scale(10)
    },

    button_add: {
        height: verticalScale(30),
        width: scale(100),
        justifyContent: 'center',
        alignItems: 'center',
        //backgroundColor : '#4294f7',
        borderWidth: 0.5,
        borderRadius: 3,
        marginRight: scale(10)
    },

    text: {
        alignSelf: 'center',
        fontSize: fontSize(16, scale(2))
    },

    text_add_color: {
        color: 'white'
    },

    button_color: {
        color: '#4294f7'
    },
});