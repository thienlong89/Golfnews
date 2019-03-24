import React from 'react';
import {StyleSheet, Text, View, Image, TextInput, TouchableOpacity } from 'react-native';
import Touchable from 'react-native-platform-touchable';
import BaseComponent from '../../Core/View/BaseComponent';
import PopupDialog from 'react-native-popup-dialog';
import Networking from '../../Networking/Networking';
import ApiService from '../../Networking/ApiService';
import { verticalScale, scale, fontSize } from '../../Config/RatioScale';

export default class PopupCaptcha extends BaseComponent {

    static defaultProps = {
        puid: ''
    }

    constructor(props) {
        super(props);
        this.keyData;
        this.state = {
            captcha_uri: '',
            captcha_input: '',
            captcha_error: ''
        }
    }

    render() {
        return (
            <PopupDialog
                ref={(popupDialog) => { this.popupDialog = popupDialog; }}
                dialogStyle={styles.popup_style}>
                <View style={styles.container}>
                    <Text allowFontScaling={global.isScaleFont} style={styles.popup_title_style}>{this.t('enter_captcha_title')}</Text>

                    <View style={{ flex: 1 }}>
                        <View style={styles.image_captcha_container}>
                            <Image
                                style={styles.image_captcha}
                                source={{ uri: this.state.captcha_uri }}
                            />
                            <TouchableOpacity style={styles.touchable_image_refresh} onPress={this.getCaptchaImage.bind(this)}>
                                <Image
                                    style={styles.image_refresh}
                                    source={this.getResources().ic_refresh}
                                />
                            </TouchableOpacity>
                        </View>

                        <TextInput allowFontScaling={global.isScaleFont}
                            ref={(textInputCaptcha) => { this.textInputCaptcha = textInputCaptcha }}
                            style={styles.popup_dialog_textinput}
                            keyboardType='numeric'
                            underlineColorAndroid='rgba(0,0,0,0)'
                            maxLength={6}
                            onChangeText={(input) => this.setState({ captcha_input: input, captcha_error: '' })}
                            onSubmitEditing={this.onSubmitEditing.bind(this)}>
                        </TextInput>

                        <Text allowFontScaling={global.isScaleFont} style={styles.captcha_error}>{this.state.captcha_error}</Text>
                    </View>

                    <View>
                        <View style={styles.line} />
                        <View style={styles.container_btn}>
                            <Touchable style={styles.touchable_btn} onPress={this.onCancelClick.bind(this)}>
                                <Text allowFontScaling={global.isScaleFont} style={styles.confirm_text}>{this.t('cancel')}</Text>
                            </Touchable>
                            <View style={styles.line_horizontal} />
                            <Touchable style={styles.touchable_btn} onPress={this.onConfirmClick.bind(this)}>
                                <Text allowFontScaling={global.isScaleFont} style={styles.confirm_text}>{this.t('ok')}</Text>
                            </Touchable>
                        </View>
                    </View>
                    {this.renderLoading()}
                </View>
            </PopupDialog>
        );
    }

    componentDidMount() {
        this.getCaptchaImage();
    }

    show() {
        this.popupDialog.show();
    }

    dismiss() {
        this.popupDialog.dismiss();
    }

    onConfirmClick() {
        if(this.textInputCaptcha){
            this.textInputCaptcha.blur();
       } 
        this.requestVerifyCaptcha();
    }

    onCancelClick() {
        this.popupDialog.dismiss();
    }

    getCaptchaImage() {
        let url = this.getConfig().getBaseUrl() + ApiService.get_captcha();
        console.log('url', url);
        Networking.httpRequestGetBase64(url, this.onCaptchaImage.bind(this));
    }

    onCaptchaImage(base64data, header) {
        this.setState({
            captcha_uri: base64data
        });
        //console.log("--------------header : ",header);
        try {
            if(header.hasOwnProperty('map')){
                let map = header.map;
                this.keyData = map['keydata'];
                return;
            }
            this.keyData = header['keydata'];
        } catch (error) {
            console.log('keyData error', error);
        }
    }

    onSubmitEditing() {
        if (this.state.captcha_input.length >= 4) {
            this.requestVerifyCaptcha();
        }
    }

    requestVerifyCaptcha() {
        this.loading.showLoading();
        let self = this;
        let url = this.getConfig().getBaseUrl() + ApiService.verify_captcha(this.props.puid, this.state.captcha_input, this.keyData);
        console.log('url verify capcha : ', url);
        Networking.httpRequestGet(url, this.onVerifyCaptchaResponse.bind(this), () => {
            //time out
            self.loading.hideLoading();
            self.popupTimeOut.showPopup();
        });
    }

    onVerifyCaptchaResponse(jsonData) {
        this.loading.hideLoading();
        console.log('onVerifyCaptchaResponse', jsonData);
        if (jsonData != null && jsonData.hasOwnProperty('error_code')) {
            if (jsonData['error_code'] === 0) {
                
                this.popupDialog.dismiss();
                if (this.props.onConfirmClick != null) {
                    this.props.onConfirmClick();
                }
            } else {
                this.setState({
                    captcha_error: this.t('captcha_verify_error')
                })
            }
        }
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        justifyContent: 'space-between',
        borderRadius: verticalScale(4)
    },
    popup_style: {
        width: scale(300),
        height: verticalScale(220),
        backgroundColor: '#FFFFFF',
        borderRadius: verticalScale(4)
    },
    popup_header: {
        flexDirection: 'row',
        backgroundColor: '#F0F0F0',
        justifyContent: 'center',
        alignItems: 'center'
    },
    header_icon: {
        position: 'absolute',
        width: verticalScale(40),
        height: verticalScale(40),
        resizeMode: 'contain',
        left: scale(3)
    },
    popup_title_style: {
        color: '#685D5D',
        fontWeight: 'bold',
        fontSize: fontSize(17,scale(3)),
        marginTop:  verticalScale(10),
        marginBottom: verticalScale(10),
        textAlign: 'center'
    },
    popup_content: {
        //color: '#685D5D',
        fontSize: fontSize(15,scale(1)),
        marginTop: verticalScale(10),
        marginBottom: verticalScale(10),
        //textAlign: 'center',
        justifyContent: 'center'
    },
    container_btn: {
        flexDirection: 'row'
    },
    line: {
        backgroundColor: '#ADADAD',
        height: 0.5,
        marginTop: verticalScale(10)
    },
    line_horizontal: {
        backgroundColor: '#ADADAD',
        width: 0.5
    },
    touchable_btn: {
        flex: 1,
        paddingTop: verticalScale(10),
        paddingBottom: verticalScale(10),
        justifyContent: 'center',
        alignItems: 'center'
    },
    confirm_text: {
        color: '#757575',
        fontSize: fontSize(17,scale(3))
    },
    image_captcha_container: {
        minHeight: verticalScale(50),
        marginLeft: scale(20),
        marginRight: scale(20),
        justifyContent: 'center',
        alignItems: 'center'
    },
    image_captcha: {
        height: verticalScale(50),
        width: scale(100),
        resizeMode: 'contain',
        backgroundColor: '#FFFFFF',
        tintColor: '#00ABA7'
    },
    touchable_image_refresh: {
        position: 'absolute',
        right: 0
    },
    image_refresh: {
        height: verticalScale(35),
        width: verticalScale(35),
        resizeMode: 'contain'
    },
    popup_dialog_textinput: {
        height: verticalScale(35),
        paddingLeft: scale(10),
        marginLeft: scale(20),
        marginRight: scale(20),
        marginTop: verticalScale(10),
        borderRadius: verticalScale(5),
        borderWidth: 0.5,
        borderColor: '#adadad',
        fontSize: fontSize(17,scale(3)),
        lineHeight : fontSize(21,scale(7)),
        paddingTop: 0,
        paddingBottom: 0
    },
    captcha_error: {
        color: 'red',
        fontSize: fontSize(15,scale(1)),
        marginRight: scale(20),
        marginLeft: scale(20),
        marginTop: verticalScale(5),
        marginBottom: verticalScale(5)
    }
});