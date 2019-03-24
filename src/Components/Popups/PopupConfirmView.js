/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React from 'react';
import {
    StyleSheet,
    Text,
    View,
    Dimensions,
    Image,
    Modal
} from 'react-native';
import Touchable from 'react-native-platform-touchable';
import BaseComponent from '../../Core//View/BaseComponent';
import HtmlBoldText from '../../Core/Common/HtmlBoldText';

import { scale, verticalScale, fontSize } from '../../Config/RatioScale';
//let{width,height} = Dimensions.get('window');

//const TAG = "[Vhandicap-v1] PopupNotificationView : ";
let screenWidth = Dimensions.get('window').width;
let popupWidth = screenWidth - scale(60);
let popupHeight = (2 * popupWidth) / 3;
let buttonWidth = popupWidth / 3;
//type Props = {};
export default class PopupConfirmView extends BaseComponent {
    constructor(props) {
        super(props);
        this.okCallback = null;
        this.cancelCallback = null;
        this.extrasData;
        this.state = {
            isShow: false,
            txtMsg: ''
        }

        this.onCancelClick = this.onCancelClick.bind(this);
        this.onOKClick = this.onOKClick.bind(this);
    }

    setCallback(_callback) {
        this.okCallback = _callback;
    }

    dimiss() {
        this.setState({
            isShow: false
        });
    }

    setMsg(msg, extrasData) {
        this.setState({
            txtMsg: msg
        }, ()=>{
            this.extrasData = extrasData;
        });
        this.show();
    }

    show() {
        if (this.state.isShow) return;
        this.setState({
            isShow: true
        });
    }

    onOKClick() {
        if (this.okCallback) {
            this.okCallback(this.extrasData);
        }
        this.dimiss();
    }

    onCancelClick() {
        if (this.cancelCallback) {
            this.cancelCallback(this.extrasData);
        }
        this.dimiss();
    }

    render() {
        return (
            <Modal
                transparent={true}
                animationType={'fade'}
                visible={this.state.isShow}
                onRequestClose={this.onCancelClick}>
                <View style={styles.modalBackground}>
                    <View style={styles.container}>
                        <View style={styles.title_view}>
                            <Image
                                style={styles.title_image}
                                source={this.getResources().logo_popup}
                            />
                            <Text allowFontScaling={global.isScaleFont} style={styles.title_text}>{this.t('thong_bao')}</Text>
                            <View style={styles.title_right}></View>
                        </View>
                        {/* <Text style={styles.msg_text}>{this.state.txtMsg} */}
                        {/* </Text> */}
                        <View style={{flex  :1,justifyContent : 'center',alignItems : 'center'}}>
                            <HtmlBoldText
                                style={styles.msg_text}
                                message={this.state.txtMsg}
                            />
                        </View>

                        <View style={styles.bottom_view}>
                            <Touchable onPress={this.onCancelClick}>
                                <View style={styles.cancel_view}>
                                    <Text allowFontScaling={global.isScaleFont} style={styles.ok_text}>{this.t('cancel')}</Text>
                                </View>
                            </Touchable>
                            <Touchable onPress={this.onOKClick}>
                                <View style={styles.ok_view}>
                                    <Text allowFontScaling={global.isScaleFont} style={styles.ok_text}>{this.t('ok')}</Text>
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
        alignItems: 'center',
        borderWidth: scale(1),
        borderRadius: verticalScale(8)
    },

    ok_text: {
        textAlign: 'center',
        fontSize: fontSize(18,scale(6)),// 20,
        color: '#fff',
        fontWeight: "bold"
    },

    cancel_view: {
        width: buttonWidth,
        height: verticalScale(40),
        marginTop: verticalScale(10),
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: scale(4),
        backgroundColor: '#00aba7'
    },

    ok_view: {
        width: buttonWidth,
        height: verticalScale(40),
        marginTop: verticalScale(10),
        marginLeft: scale(20),
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: scale(4),
        backgroundColor: '#00aba7'
    },

    bottom_view: {
        height: verticalScale(70),
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row'
    },

    title_view: {
        height: verticalScale(40),
        flexDirection: 'row',
        alignItems: "center",
        backgroundColor: '#f0f0f0',
        borderTopLeftRadius: verticalScale(8),
        borderTopRightRadius: verticalScale(8)
    },

    title_image: {
        width: verticalScale(35),
        height: verticalScale(35),
        marginLeft: scale(5),
        marginTop: verticalScale(2),
        resizeMode: 'contain'
    },

    title_text: {
        flex: 1,
        textAlign: 'center',
        fontSize: fontSize(23,scale(10)),// 26,
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
        //margin:  10,
        fontSize: fontSize(14),// 14,
        color: '#685d5d',
        textAlignVertical: 'center',
        textAlign: 'center'
    },

    modalBackground: {
        flex: 1,
        alignItems: 'center',
        flexDirection: 'column',
        justifyContent: 'space-around',
        backgroundColor: 'rgba(0,0,0,0.6)'
    },
});
