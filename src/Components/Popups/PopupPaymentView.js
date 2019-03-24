import React, { Component } from 'react';
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
import {scale, verticalScale, fontSize} from '../../Config/RatioScale';
let{width,height} = Dimensions.get('window');

//const TAG = "[Vhandicap-v1] PopupNotificationView : ";
let screenWidth = Dimensions.get('window').width;
let popupWidth = screenWidth - scale(60);
let popupHeight = (2 * popupWidth) / 3;
let buttonWidth = popupWidth / 2;

export default class PopupPaymentView extends BaseComponent {
    constructor(props) {
        super(props);
        this.okCallback = null;
        this.state = {
            isShow : false,
            msg : ''
        }
    }

    componentDidMount() {

    }

    onOkClick(){
        if(this.okCallback){
            this.okCallback();
        }
        this.dimiss();
    }

    onCancelClick(){
        this.dimiss();
    }

    dimiss(){
        this.setState({
            isShow : false
        });
    }

    setMsg(_msg){
        this.setState({
            msg : _msg
        });
    }

    show(){
        this.setState({
            isShow : true
        });
    }

    render() {
        let{isShow,msg} = this.state;
        return (
            <Modal
                transparent={true}
                animationType={'fade'}
                visible={isShow}
                onRequestClose={this.onCancelClick.bind(this)}>
                <View style={styles.modalBackground}>
                    <View style={styles.container}>
                        <Text allowFontScaling={global.isScaleFont} style={styles.title_text}>{this.t('thong_bao')}</Text>
                        <Text allowFontScaling={global.isScaleFont} style={styles.msg_text}>{msg}
                        </Text>

                        <View style={styles.bottom_view}>
                            <Touchable onPress={this.onCancelClick.bind(this)}>
                                <View style={styles.cancel_view}>
                                    <Text allowFontScaling={global.isScaleFont} style={styles.ok_text}>{this.t('bo_qua')}</Text>
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
        borderColor: '#757575',
        borderWidth: 1,
        borderRadius: 5,
        justifyContent : 'center'
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
        borderRightWidth : 0.5,
        borderRightColor : '#adadad',
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
        flexDirection : 'row',
        alignItems: 'center',
        borderTopColor : '#adadad',
        borderTopWidth : 0.5
    },

    title_text: {
       // height : ve 40,
        textAlign: 'center',
        fontSize: fontSize(20,scale(6)),// 20,
        color: '#685d5d',
        //backgroundColor : 'green',
        textAlignVertical: 'center',
        fontWeight: 'bold',
        marginTop : verticalScale(10)
    },

    msg_text: {
        flex: 1,
        alignSelf: 'center',
        marginLeft: scale(10),
        marginRight : scale(10),
        marginTop : verticalScale(3),
        fontSize: fontSize(16,scale(2)),// 16,
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