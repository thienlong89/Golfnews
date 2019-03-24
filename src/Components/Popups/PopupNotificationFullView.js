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
    Modal,
    TouchableWithoutFeedback
} from 'react-native';
import Touchable from 'react-native-platform-touchable';
import BaseComponent from '../../Core//View/BaseComponent';

import { scale, verticalScale, fontSize } from '../../Config/RatioScale';
let { width, height } = Dimensions.get('window');
import MyView from '../../Core/View/MyView';
import HtmlBoldText from '../../Core/Common/HtmlBoldText';

//const TAG = "[Vhandicap-v1] PopupNotificationView : ";
let screenWidth = width;
let popupWidth = screenWidth - scale(60);
let popupHeight = (2 * popupWidth) / 3;
let buttonWidth = popupWidth / 3;
//type Props = {};
export default class PopupNotificationFullView extends BaseComponent {
    constructor(props) {
        super(props);
        this.okCallback = null;
        this.state = {
            isShow: false,
            txtMsg: ''
        }

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

    setMsg(msg) {
        this.setState({
            txtMsg: msg
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
            this.okCallback();
        }
        this.dimiss();
    }

    render() {
        let { isShow } = this.state;
        return (
            <TouchableWithoutFeedback onPress={() => { this.setState({ isShow: false }) }}>
                <MyView style={styles.modalBackground}
                    // transparent={true}
                    // animationType={'fade'}
                    // visible={this.state.isShow}
                    // onRequestClose={this.onOKClick.bind(this)}
                    hide={!isShow}
                >
                    {/* <View style={styles.modalBackground}> */}
                        <View style={styles.container}>
                            <View style={styles.title_view}>
                                <Image
                                    style={styles.title_image}
                                    source={this.getResources().logo_popup}
                                />
                                <Text allowFontScaling={global.isScaleFont} style={styles.title_text}>{this.t('thong_bao')}</Text>
                                <View style={styles.title_right}></View>
                            </View>
                            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                                <HtmlBoldText allowFontScaling={global.isScaleFont} style={styles.msg_text}
                                    message={this.state.txtMsg}
                                >
                                {/* {this.state.txtMsg} */}
                                </HtmlBoldText>
                            </View>

                            <View style={styles.bottom_view}>
                                <Touchable onPress={this.onOKClick}>
                                    <View style={styles.ok_view}>
                                        <Text allowFontScaling={global.isScaleFont} style={styles.ok_text}>{this.t('ok')}</Text>
                                    </View>
                                </Touchable>
                            </View>
                        </View>
                    {/* </View> */}
                </MyView>
            </TouchableWithoutFeedback>
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
        borderWidth: 1,
        borderRadius: 5
    },

    ok_text: {
        textAlign: 'center',
        fontSize: fontSize(20, scale(6)),// 20,
        color: '#fff',
        fontWeight: "bold"
    },

    ok_view: {
        width: buttonWidth,
        height: verticalScale(40),
        marginTop: verticalScale(5),
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#00aba7'
    },

    bottom_view: {
        height: verticalScale(55),
        justifyContent: 'center',
        alignItems: 'center'
    },

    title_view: {
        height: verticalScale(40),
        width: popupWidth,
        flexDirection: 'row',
        alignItems: "center",
        backgroundColor: '#f0f0f0',
        borderTopLeftRadius : 5,
        borderTopRightRadius : 5
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
        fontSize: fontSize(26, scale(12)),// 26,
        color: '#685d5d',
        fontWeight: 'bold'
    },

    title_right: {
        width: verticalScale(35),
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
        margin: scale(10),
        fontSize: fontSize(18, scale(4)),// 14,
        color: '#685d5d',
        textAlignVertical: 'center',
        textAlign: 'center'
    },

    modalBackground: {
        // flex: 1,
        position : 'absolute',
        top : 0,
        bottom : 0,
        left : 0,
        right : 0,
        alignItems: 'center',
        flexDirection: 'column',
        justifyContent: 'space-around',
        backgroundColor: 'rgba(0,0,0,0.6)'
    },
});
