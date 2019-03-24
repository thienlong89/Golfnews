import React from 'react';
import {
    StyleSheet,
    Text,
    View,
    Dimensions,
    Modal,
    TextInput,
    Platform,
} from 'react-native';
import Touchable from 'react-native-platform-touchable';
import BaseComponent from '../../Core//View/BaseComponent';
import ApiService from '../../Networking/ApiService';
import Networking from '../../Networking/Networking';
import PopupNotify from './PopupNotificationView';
import MyView from '../../Core/View/MyView';

import CustomLoadingview from '../Common/CustomLoadingView';
import {scale, verticalScale, fontSize} from '../../Config/RatioScale';

let screenWidth = Dimensions.get('window').width;
let popupWidth = screenWidth -  scale(100);
//let popupHeight = popupWidth / 2;
let buttonWidth = popupWidth / 2;

export default class PopupGroupCreate extends BaseComponent {
    constructor(props) {
        super(props);
        // this.okCallback = null;
        this.navigation = null;
        this.refresh = null;//ham refresh lai data
        this.state = {
            isShow: false,
            nameGroup: ''
        }
    }

    componentDidMount() {

    }

    sendRequestCreateGroup() {
        let self = this;
        //this.loading.showLoading();
        this.customLoadingView.setVisible(true);
        let url = this.getConfig().getBaseUrl() + ApiService.group_create();
        let formData = {
            name: this.state.nameGroup
        };
        Networking.httpRequestPost(url, (jsonData) => {
            //self.loading.hideLoading();
            self.customLoadingView.setVisible(false);
            if (jsonData.hasOwnProperty('error_code')) {
                let error_code = parseInt(jsonData['error_code']);
                if (error_code === 0) {
                    //ok
                    self.dimiss();
                    console.log('sendRequestCreateGroup', jsonData);
                    if (jsonData.hasOwnProperty('data')) {
                        let data = jsonData['data'];
                        if (data.hasOwnProperty('group')) {
                            let group = data['group'];
                            //console.log('this.props.navigation : ',screenProps);
                            if(this.props.createCallback){
                                this.props.createCallback(group['id']);
                            }
                        }
                    }
                } else {
                    self.popupNotify.setMsg(jsonData['error_msg']);
                }
            }

        }, formData, () => {
            //time out
            //self.loading.hideLoading();
            //self.popupTimeOut.showPopup();
            self.customLoadingView.setVisible(false);
        });
    }

    onCancelClick() {
        this.dimiss();
    }

    onSaveClick() {
        this.sendRequestCreateGroup();
    }

    dimiss() {
        this.setState({
            isShow: false,
            nameGroup : ''
        });
    }

    show() {
        this.setState({
            isShow: true
        });
    }

    render() {
        let { isShow } = this.state;
        return (
            <Modal
                transparent={true}
                animationType={'fade'}
                visible={isShow}
                onRequestClose={this.onCancelClick.bind(this)}>
                {/* {this.renderLoading()} */}
                <PopupNotify ref={(popupNotify) => { this.popupNotify = popupNotify; }} />
                <View style={styles.modalBackground}>
                    <View style={styles.container}>
                        <Text allowFontScaling={global.isScaleFont} style={styles.popup_dialog_header_text}>{this.t('dat_ten_nhom_title')}</Text>
                        <TextInput allowFontScaling={global.isScaleFont}
                            ref={(textInputGroupName) => { this.textInputGroupName = textInputGroupName }}
                            style={styles.popup_dialog_textinput}
                            placeholder={this.t('length_name_group')}
                            placeholderTextColor='#a1a1a1'
                            underlineColorAndroid='rgba(0,0,0,0)'
                            onChangeText={(text) => this.setState({ nameGroup: text })}
                            autoFocus={true}
                            //onFocus={this.onFocusInputText.bind(this)}
                            value={this.state.nameGroup}>
                        </TextInput>
                        <View style={styles.popup_dialog_bottom}>
                            <Touchable onPress={this.onCancelClick.bind(this)}>
                                <View style={styles.button_left_view}>
                                    <Text allowFontScaling={global.isScaleFont} style={styles.button_text}>{this.t('cancel')}</Text>
                                </View>
                            </Touchable>
                            <Touchable onPress={this.onSaveClick.bind(this)}>
                                <View style={styles.button_right_view}>
                                    <Text allowFontScaling={global.isScaleFont} style={styles.button_text}>{this.t('save')}</Text>
                                </View>
                            </Touchable>
                        </View>
                    </View>
                    <CustomLoadingview ref={(customLoadingView)=>{this.customLoadingView = customLoadingView;}}/>
                </View>
            </Modal >
        );
    }
}

const styles = StyleSheet.create({

    container: {
        width: popupWidth,
        height: verticalScale(160),
        backgroundColor: '#fff',
        borderColor: '#757575',
        borderWidth: 1,
        justifyContent: 'space-between',
        borderRadius: (Platform.OS === 'ios') ? scale(10) : scale(5)
    },

    popup_dialog_header_text: {
        fontWeight: 'bold',
        alignSelf: 'center',
        fontSize: fontSize(24,scale(10)),// 24,
        color: '#454545',
        marginTop: verticalScale(10),
        //height: 30
    },

    popup_dialog_bottom: {
        height: verticalScale(40),
        flexDirection: 'row',
        borderTopColor: "#adadad",
        borderTopWidth: 0.5,
        // marginTop : 20,
        marginBottom: 0,
    },

    button_left_view: {
        height: verticalScale(40),
        width: buttonWidth,
        justifyContent: 'center',
        alignItems: 'center',
        borderRightWidth: scale(0.5),
        borderRightColor: '#adadad',
        //backgroundColor : 'red'
    },

    button_text: {
        color: '#757575',
        textAlignVertical: 'center',
        fontSize: fontSize(16),// 16,
        color: '#757575',
        alignSelf: 'center'
    },

    button_right_view: {
        height: verticalScale(40),
        width: buttonWidth,
        justifyContent: 'center',
        alignItems: 'center'
    },

    popup_dialog_textinput: {
        height:  verticalScale(30),
        paddingLeft: scale(10),
        marginLeft: scale(20),
        marginRight: scale(20),
        marginTop: verticalScale(5),
        borderRadius: scale(3),
        borderWidth: (Platform.OS === 'ios') ? scale(1) : scale(0.5),
        borderColor: '#adadad',
        paddingTop: 0,
        paddingBottom: 0,
        fontSize : fontSize(14),// 14,
        lineHeight : fontSize(18,scale(4)),// 18
    },

    ok_text: {
        textAlign: 'center',
        fontSize: fontSize(20,scale(6)),// 20,
        color: '#757575',
        // fontWeight: "bold"
    },

    cancel_view: {
        width: buttonWidth,
        height: verticalScale(60),
        // marginTop: 10,
        justifyContent: 'center',
        alignItems: 'center',
        borderRightWidth: scale(0.5),
        borderRightColor: '#adadad',
        //backgroundColor: '#00aba7'
    },

    ok_view: {
        width: buttonWidth,
        height: verticalScale(60),
        justifyContent: 'center',
        alignItems: 'center',
        //backgroundColor: '#00aba7'
    },

    bottom_view: {
        height: verticalScale(60),
        justifyContent: 'center',
        flexDirection: 'row',
        alignItems: 'center',
        borderTopColor: '#adadad',
        borderTopWidth: scale(0.5)
    },

    modalBackground: {
        flex: 1,
        alignItems: 'center',
        flexDirection: 'column',
        justifyContent: 'space-around',
        backgroundColor: 'rgba(0,0,0,0.6)'
    },
});