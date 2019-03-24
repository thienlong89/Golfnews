import React from 'react';
import {
    Platform,
    StyleSheet,
    Text,
    View,
    Image,
    TextInput,
    TouchableOpacity,
    ImageBackground,
    KeyboardAvoidingView,
    NetInfo,
    Alert,
    Linking,
    BackAndroid
} from 'react-native';
import Touchable from 'react-native-platform-touchable'
import Networking from '../../Networking/Networking';
import BaseComponent from '../../Core/View/BaseComponent';
import LoginModel from '../../Model/Login/LoginModel';
import DataManager from '../../Core/Manager/DataManager';
import Constant from '../../Constant/Constant';
import HeaderView from '../HeaderView';
import ApiService from '../../Networking/ApiService';
import PopupNotify from '../Popups/PopupNotificationView';
import { Avatar } from 'react-native-elements';
import firebase from 'react-native-firebase';
import CaptchaView from '../Common/CaptchaView';
import IntentActivityAndroid from '../../Core/Common/IntentActivityAndroid';
import { Transition } from 'react-navigation-fluid-transitions';
import { fontSize, verticalScale, scale } from '../../Config/RatioScale';
import DeviceInfo from 'react-native-device-info';

const styles = require("../../Styles/Logins/StyleLogins");
// const countryCodeList = require('../../../CountryCode.json');
import { CountryCodes } from '../../../CountryCode';

export default class LoginView extends BaseComponent {
    constructor(props) {
        super(props);
        DataManager.loadLocalData([Constant.USER.PHONE], this.onLoadLocalComplete.bind(this));
        this.language = this.props.navigation.state.params.language;

        this.onPhoneChange = this.onPhoneChange.bind(this);
        this.onSignInClick = this.onSignInClick.bind(this);
        this.onLanguagePress = this.onLanguagePress.bind(this);
        this.onSelectCountryCode = this.onSelectCountryCode.bind(this);
        this.onCountryCodeCallback = this.onCountryCodeCallback.bind(this);
        this.onInputCaptchaChange = this.onInputCaptchaChange.bind(this);
        this.onChangeCaptcha = this.onChangeCaptcha.bind(this);
        this.onConnectionChange = this.onConnectionChange.bind(this);
        this.onOtpBackListener = this.onOtpBackListener.bind(this);
        this.uuid = this.getAppUtil().guidGenerator();
        const deviceCountry = DeviceInfo.getDeviceCountry();
        let filterData = CountryCodes.find((country) => {
            return `${country.sortname}`.toLowerCase().indexOf(deviceCountry.toLowerCase().trim()) >= 0
        }
        );
        this.state = {
            phone: '',
            disableSigninState: true,
            error_msg: '',
            countryCode: filterData ? filterData : '',
            captcha: ''
        }
    }

    loginOtherDevice() {
        this.popupNotify.setMsg(this.t('login_other_device'));
    }

    renderPhoneCode(countryCode) {
        if (countryCode) {
            return (
                <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                    <Text allowFontScaling={global.isScaleFont} style={{ color: 'gray', fontSize: fontSize(14) }}>
                        {`(+${countryCode.phone_code})`}
                    </Text>
                </View>
            )
        } else {
            return null;
        }
    }

    render() {
        let { countryCode,
            error_msg,
            phone,
            disableSigninState,
            captcha
             } = this.state;

        return (

            <View style={styles.container} >
                <View style={styles.container}>

                    <Text allowFontScaling={global.isScaleFont} style={styles.txt_title}>{this.t('issued_by_vga')}</Text>

                    <KeyboardAvoidingView style={{ flex: 1, justifyContent: 'center' }} behavior="padding" enabled>

                        {/* <View style={styles.view_logo} >
                            <Transition appear='top' delay>
                                <Image
                                    style={styles.logo}
                                    source={this.getResources().ic_logo}
                                />
                            </Transition>
                        </View> */}
                        <View style={styles.view_vhandicap}>
                            <Image
                                style={styles.logo}
                                source={this.getResources().ic_logo}
                            />
                            <View style={{ marginLeft: scale(5) }}>
                                <Image
                                    style={styles.img_vhandicap}
                                    source={this.getResources().ic_vhandicap}
                                />
                                <Text allowFontScaling={global.isScaleFont} style={styles.txt_official_handicap}>{this.t('official_handicap')}</Text>
                            </View>
                        </View>

                        <Text allowFontScaling={global.isScaleFont} style={styles.error_text} >{error_msg}</Text>

                        <View style={styles.text_input_background}>
                            <TouchableOpacity onPress={this.onSelectCountryCode}>
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <Avatar rounded
                                        width={verticalScale(23)}
                                        height={verticalScale(23)}
                                        containerStyle={styles.img_icon}
                                        source={countryCode.image ? countryCode.image : this.getResources().world}
                                    />
                                    <Text allowFontScaling={global.isScaleFont} style={styles.txt_triangle}>{'▼'}</Text>
                                </View>
                            </TouchableOpacity>


                            <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                                {this.renderPhoneCode(countryCode)}
                                <TextInput allowFontScaling={global.isScaleFont} style={{ flex: 1, padding: verticalScale(4), fontSize: fontSize(14), lineHeight: fontSize(18, verticalScale(4)) }}
                                    placeholder={this.t('number_phone')}
                                    placeholderTextColor='#8A8A8F'
                                    underlineColorAndroid='rgba(0,0,0,0)'
                                    keyboardType='numeric'
                                    onChangeText={this.onPhoneChange}
                                // value={phone}
                                // onSubmitEditing={this.onNextPasswordFocus}
                                />
                            </View>
                        </View>

                        <View style={{ flexDirection: 'row', marginRight: scale(30), marginLeft: scale(30), marginTop: verticalScale(10) }}>

                            <TextInput allowFontScaling={global.isScaleFont}
                                style={styles.input_captcha}
                                placeholder={this.t('enter_captcha_title')}
                                placeholderTextColor='#8A8A8F'
                                underlineColorAndroid='rgba(0,0,0,0)'
                                keyboardType='numeric'
                                value={captcha}
                                maxLength={6}
                                onChangeText={this.onInputCaptchaChange}
                            />

                            <CaptchaView
                                ref={(refCaptchaView) => { this.refCaptchaView = refCaptchaView }}
                                uuid={this.uuid}
                                customStyle={styles.image_captcha_container}
                                onChangeCaptcha={this.onChangeCaptcha} />

                        </View>
                        <Transition appear='bottom' delay>
                            <TouchableOpacity
                                disabled={disableSigninState}
                                onPress={this.onSignInClick}>
                                <View style={[styles.signin_button, { opacity: disableSigninState ? 0.5 : 1 }]}>
                                    <Text allowFontScaling={global.isScaleFont}
                                        style={{ color: '#fff', fontSize: fontSize(20, scale(6)) }}>{this.t('LOGIN')}</Text>
                                </View>
                            </TouchableOpacity>
                        </Transition>

                    </KeyboardAvoidingView>

                    <View style={styles.view_bottom}>
                        <TouchableOpacity onPress={this.onLanguagePress}>
                            <View style={styles.language_group} >
                                <Image
                                    style={styles.img_icon}
                                    source={this.language.flag} />
                                <Text allowFontScaling={global.isScaleFont}
                                    style={[styles.vietnam]}>
                                    {this.language.name}
                                </Text>
                            </View>
                        </TouchableOpacity>
                        <View style={styles.view_power_by}>
                            <Text allowFontScaling={global.isScaleFont} style={styles.txt_powered}>{this.t('powered_by')}</Text>
                            <Image
                                style={styles.img_vgs_holding}
                                source={this.getResources().ic_vgsholding} />
                        </View>
                        <Text allowFontScaling={global.isScaleFont} style={styles.txt_copyright}>{'Copyright @2018'}</Text>
                    </View>
                </View>

                {this.renderLoading()}
                <PopupNotify ref={(popupNotify) => { this.popupNotify = popupNotify; }} />
            </View>
        );
    }

    /**
     * chọn ngôn ngữ là tiếng việt
     */
    onLanguagePress() {
        this.props.navigation.goBack();
    }


    componentDidMount() {
        this.rotateToPortrait();
        console.log('LoginView.componentDidMount')
        if (firebase) {
            try {
                firebase.analytics().setCurrentScreen('LoginView');
            } catch (error) {
                console.log('LoginView.firebase', error)
            }
        }

        let { params } = this.props.navigation.state;
        this.Logger().log("param login ", params);
        if (params && params.login_other_device) {
            this.loginOtherDevice();
        }
        NetInfo.getConnectionInfo().then((connectionInfo) => {
            if (connectionInfo.type === 'none' || connectionInfo.type === 'unknown') {
                Alert.alert(
                    this.t('notify'),
                    this.t('network_connection_error'),
                    [
                        {
                            text: this.t('cancel'), onPress: () => {
                                BackAndroid.exitApp();
                            }, style: 'cancel'
                        },
                        {
                            text: this.t('ok'), onPress: () => {
                                if (Platform.OS === 'ios') {
                                    Linking.openURL('app-settings:');
                                } else {
                                    IntentActivityAndroid.startActivityAsync(IntentActivityAndroid.ACTION_NETWORK_OPERATOR_SETTINGS);
                                }
                            }
                        }
                    ],
                    {
                        cancelable: false
                    }
                );
            }

        });
        NetInfo.addEventListener('connectionChange', this.onConnectionChange);
    }

    componentWillUnmount() {
        console.log('componentWillUnmount')
        NetInfo.removeEventListener('connectionChange', this.onConnectionChange)
    }

    onConnectionChange(connectionType) {
        this.Logger().log('onConnectionChange', connectionType)
        if (connectionType != 'none' && connectionType != 'unknown' && this.refCaptchaView) {
            // this.popupNotify.dismiss();
            this.refCaptchaView.getCaptchaImage();
        }
    }

    onSelectCountryCode() {
        this.props.navigation.navigate('country_code_screen', {
            countryCodeCallback: this.onCountryCodeCallback
        })
    }

    onCountryCodeCallback(countryCode) {
        this.setState({
            countryCode: countryCode
        })
    }

    onPhoneChange(text) {
        // this.setState({ phone: text });
        this.state.phone = text;
        this.controlEnableDisableSigin(text);
    }

    onChangeCaptcha() {
        this.setState({
            captcha: ''
        })
    }

    onInputCaptchaChange(captcha) {
        this.setState({
            captcha: captcha
        })
    }

    controlEnableDisableSigin(phone) {
        if (phone.length >= 0) {
            this.setState({ disableSigninState: false });
        } else {
            this.setState({ disableSigninState: true });
        }
    }

    onNextPasswordFocus() {
        this.inputRef.focus();
    }

    onSignInClick() {
        let { countryCode, phone } = this.state;
        if (this.validateData(countryCode.phone_code, phone)) {
            this.loading.showLoading();

            let url = this.getConfig().getBaseUrl() + ApiService.verify_captcha_auth(this.state.captcha, this.uuid, `${countryCode.phone_code}${phone}`);
            let self = this;
            this.Logger().log('url', url);
            if (firebase) {
                firebase.analytics().logEvent('onSignInClick', {
                    phone: phone,
                    captcha: this.state.captcha
                })
            }
            Networking.httpRequestGet(url, (jsonData) => {
                this.Logger().log('onSignInClick', jsonData)
                if (jsonData.error_code === 0) {
                    self.requestFirebaseAuth(self);
                } else {
                    self.loading.hideLoading();
                    self.setState({
                        error_msg: jsonData.error_msg,
                        captcha: ''
                    }, () => {
                        self.refCaptchaView.getCaptchaImage();
                    });
                }
            }, () => {
                self.loading.hideLoading();
            });
        }

    }

    onLoadLocalComplete(err, result) {
        let key = result[0][0];
        if (key === Constant.USER.PHONE) {
            this.setState({ phone: result[0][1] });
        }
    }

    requestFirebaseAuth(self) {
        let { countryCode, phone } = this.state;
        try {
            let phoneNumber = `+${countryCode.phone_code}${phone}`;
            this.Logger().log('phoneNumber', phoneNumber)
            let self = this;
            if (firebase) {
                firebase.analytics().logEvent('signInWithPhoneNumber', {
                    phoneNumber: phoneNumber
                })
            }
            firebase.auth().signInWithPhoneNumber(phoneNumber)
                .then(confirmResult => {
                    this.Logger().log('confirmResult', confirmResult)
                    self.loading.hideLoading();
                    setTimeout(() => {
                        self.props.navigation.navigate('verifyotp_screen', {
                            'countryCode': countryCode,
                            'phone': phone,
                            'confirmResult': confirmResult,
                            'type_screen': self.type_screen,
                            'language': self.language.name,
                            'onBack': self.onOtpBackListener
                        });
                    }, 500);
                })
                .catch(error => {
                    console.log('requestFirebaseAuth.catch', error);
                    self.loading.hideLoading();
                    self.setState({
                        error_msg: self.t('phone_format_incorrect')
                    });
                    if (firebase) {
                        firebase.analytics().logEvent('signInWithPhoneNumber', {
                            error: error
                        })
                    }
                });
        } catch (error) {
            console.log('requestFirebaseAuth.error', error);
            self.loading.hideLoading();
        }

    }

    onOtpBackListener() {
        this.setState({
            captcha: ''
        }, () => {
            if (this.refCaptchaView)
                this.refCaptchaView.getCaptchaImage();
        });
    }

    // registerTokenDevice(token) {
    //     let url = this.getConfig().getBaseUrl() + ApiService.push_register(token);
    //     let self = this;
    //     //console.log('url', url);
    //     Networking.httpRequestGet(url, this.onRegisterTokenDevice.bind(this));
    // }

    // onRegisterTokenDevice(jsonData) {
    //     console.log('onRegisterTokenDevice', JSON.stringify(jsonData));
    // }

    saveData(userId, token, userType) {
        DataManager.saveLocalData([[Constant.USER.USER_ID, userId],
        [Constant.USER.TOKEN, token],
        [Constant.USER.USER_TYPE, userType.toString()],
        [Constant.USER.PHONE, this.state.phone]], (error) => console.log('saveLocalData', error));
    }

    validateData(phone_code, phone) {
        if (!phone_code) {
            this.setState({
                error_msg: this.t('country_code_not_select')
            })
            return false;
        } else if (!phone) {
            this.setState({
                error_msg: this.t('phone_number_not_empty')
            })
            return false;
        }

        return true;
    }

    // onSignUpClick() {
    //     let { navigate } = this.props.navigation;
    //     navigate('register_screen', { 'phone': this.state.phone, 'type': 'register' });
    // }

    // onForgotPassClick() {
    //     let { navigate } = this.props.navigation;
    //     navigate('register_screen', { 'phone': this.state.phone, 'type': 'forgot_pass' });
    // }

    // onShowHidePass() {
    //     this.setState({
    //         isInvisiblePass: !this.state.isInvisiblePass,
    //     });
    //     if (Platform.OS === 'ios') {
    //         this.inputRef.setNativeProps({
    //             selection: {
    //                 start: 0,
    //                 end: 0,
    //             },
    //         });
    //     }
    //     //this.inputRef.blur();
    //     if (this.state.isInvisiblePass) {
    //         this.setState({ uriInVisiable: this.getResources().invisible });
    //     } else {
    //         this.setState({ uriInVisiable: this.getResources().visible });
    //     }
    // }
}

