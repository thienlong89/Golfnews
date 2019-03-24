import React from 'react';

import {
    Platform, StyleSheet, Text, View, Image, TextInput, TouchableOpacity, Dimensions, ImageBackground
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

import { scale, fontSize } from '../../Config/RatioScale';
//import {scale, verticalScale, moderateScale} from '../../Config/RatioScale';

// let { width } = Dimensions.get('window');

const styles = require("../../Styles/Logins/StyleLogins");
export default class LoginView extends BaseComponent {
    constructor(props) {
        super(props);
        DataManager.loadLocalData([Constant.USER.PHONE], this.onLoadLocalComplete.bind(this));

        this.onPhoneChange = this.onPhoneChange.bind(this);
        this.onNextPasswordFocus = this.onNextPasswordFocus.bind(this);
        this.onPasswordChange = this.onPasswordChange.bind(this);
        this.onSignInClick = this.onSignInClick.bind(this);
        this.onShowHidePass = this.onShowHidePass.bind(this);
        this.onForgotPassClick = this.onForgotPassClick.bind(this);
        this.onSignUpClick = this.onSignUpClick.bind(this);
        this.onVietnameseClick = this.onVietnameseClick.bind(this);
        this.onSelectCountryCode = this.onSelectCountryCode.bind(this);
        this.onCountryCodeCallback = this.onCountryCodeCallback.bind(this);

        this.getUserInfo().setLang('vn');
        //this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
        this.state = {
            phone: '',
            password: '',
            disableSigninState: true,
            isInvisiblePass: true,
            uriInVisiable: this.getResources().visible,
            error_msg: '',
            countryCode: ''
        }
    }

    loginOtherDevice() {
        this.popupNotify.setMsg(this.t('login_other_device'));
    }

    render() {
        let { disableSigninState } = this.state;
        const { navigate } = this.props.navigation;
        return (
            // <View style={styles.container} >
            //     {this.renderLoading()}
            //     <PopupNotify ref={(popupNotify) => { this.popupNotify = popupNotify; }} />
            //     <HeaderView showBack={false} />
            //     <View style={{ flex: 1 }}>
            //         <View style={styles.row_center} >
            //             <Image
            //                 style={styles.logo}
            //                 source={this.getResources().ic_logo}
            //             />
            //         </View>

            //         <Text allowFontScaling={global.isScaleFont} style={styles.error_text} >{error_msg}</Text>

            //         <View style={{ flexDirection: 'column' }} >
            //             <View style={styles.text_input_background}>
            //                 <Avatar rounded
            //                     width={23}
            //                     height={23}
            //                     containerStyle={styles.img_icon}
            //                     source={countryCode.image ? { uri: countryCode.image } : this.getResources().world}
            //                     onPress={this.onSelectCountryCode}
            //                 />

            //                 <TextInput allowFontScaling={global.isScaleFont} style={{ flex: 1, padding: 4, fontSize: 14, lineHeight: 18 }}
            //                     placeholder={this.t('number_phone')}
            //                     placeholderTextColor='#8A8A8F'
            //                     underlineColorAndroid='rgba(0,0,0,0)'
            //                     keyboardType='numeric'
            //                     onChangeText={this.onPhoneChange}
            //                     value={phone}
            //                     onSubmitEditing={this.onNextPasswordFocus}
            <ImageBackground style={styles.container}
                source={this.getResources().ic_bg_login}
                resizeMethod={'resize'}>
                <View style={styles.view_opacity} />
                <View style={styles.container} >
                    {this.renderLoading()}
                    <PopupNotify ref={(popupNotify) => { this.popupNotify = popupNotify; }} />
                    <View style={{ flex: 1 }}>
                        <View style={styles.view_logo} >
                            <Image
                                style={styles.logo}
                                source={this.getResources().ic_logo}

                            />
                        </View>
                        {/* <View style={[styles.text_input_background, styles.password_view]} >
                            <Image
                                style={styles.img_icon}
                                source={this.getResources().ic_password} />
                            <TextInput allowFontScaling={global.isScaleFont} style={[styles.password]}
                                ref={(inputRef) => { this.inputRef = inputRef; }}
                                placeholder={this.t('password')}
                                placeholderTextColor='#8A8A8F'
                                underlineColorAndroid='rgba(0,0,0,0)'
                                secureTextEntry={isInvisiblePass}
                                onChangeText={this.onPasswordChange}
                                onSubmitEditing={this.onSignInClick}
                            />
                            <TouchableOpacity onPress={this.onShowHidePass}> */}
                        <Text allowFontScaling={global.isScaleFont} style={styles.error_text} >{this.state.error_msg}</Text>

                        <View style={{ flexDirection: 'column' }} >
                            <View style={styles.text_input_background}>
                                <Image
                                    style={styles.img_icon}
                                    source={this.getResources().ic_account} />
                                <TextInput allowFontScaling={global.isScaleFont} style={{ flex: 1, padding: 4, fontSize: 14, lineHeight: 18 }}
                                    placeholder={this.t('number_phone')}
                                    placeholderTextColor='#8A8A8F'
                                    underlineColorAndroid='rgba(0,0,0,0)'
                                    keyboardType='numeric'
                                    onChangeText={this.onPhoneChange}
                                    value={this.state.phone}
                                    onSubmitEditing={this.onNextPasswordFocus}
                                />
                            </View>
                            <View style={[styles.text_input_background, styles.password_view]} >

                                <Image
                                    // style={styles.visible_pass}
                                    // source={uriInVisiable}
                                    style={styles.img_icon}
                                    source={this.getResources().ic_password} />
                                <TextInput allowFontScaling={global.isScaleFont} style={[styles.password]}
                                    ref={(inputRef) => { this.inputRef = inputRef; }}
                                    placeholder={this.t('password')}
                                    placeholderTextColor='#8A8A8F'
                                    underlineColorAndroid='rgba(0,0,0,0)'
                                    secureTextEntry={this.state.isInvisiblePass}
                                    onChangeText={this.onPasswordChange}
                                    onSubmitEditing={this.onSignInClick}

                                />
                                {/* </TouchableOpacity> */}
                                <TouchableOpacity onPress={this.onShowHidePass}>
                                    <Image
                                        style={styles.visible_pass}
                                        source={this.state.uriInVisiable}
                                    />
                                </TouchableOpacity>
                            </View>

                            {/* <Touchable style={[{ marginTop: this.getRatioAspect().verticalScale(20) }, this.state.disableSigninState ? styles.button_disable : styles.signin_button]}
                                disabled={this.state.disableSigninState}
                                onPress={() => this.onSignInClick()}>
                                <Text allowFontScaling={global.isScaleFont}
                                    style={{ color: '#fff', fontSize: fontSize(20, scale(6)) }}>{this.t('LOGIN')}</Text>
                            </Touchable> */}
                            <Touchable style={[styles.signin_button, { opacity: this.state.disableSigninState ? 0.5 : 1 }]}
                                disabled={this.state.disableSigninState}
                                onPress={this.onSignInClick}>
                                <Text allowFontScaling={global.isScaleFont}
                                    style={{ color: '#fff', fontSize: 20 }}>{this.t('LOGIN')}</Text>
                            </Touchable>

                            {/* <View style={styles.row_center} >
                                <Touchable onPress={() => this.onForgotPassClick(navigate)}> */}
                            <Touchable onPress={this.onForgotPassClick}
                                style={styles.row_center}>

                                {/* <View> */}
                                <Text allowFontScaling={global.isScaleFont} style={[styles.text_forgot_pass, { textDecorationLine: 'underline' }]}>{this.t('forget_password')} ?</Text>
                                {/* <View style={{ height: 0.5, backgroundColor: '#919191' }} /> */}
                                {/* </View> */}
                            </Touchable>

                            <Touchable style={[styles.signup_button]}
                                onPress={this.onSignUpClick}>
                                <Text allowFontScaling={global.isScaleFont}
                                    style={{ color: '#fff', fontSize: 20 }}>{this.t('register')}</Text>

                            </Touchable>
                        </View>

                        {/* <Touchable style={[{ marginTop: this.getRatioAspect().verticalScale(40) }, styles.signup_button]}
                            onPress={() => this.onSignUpClick(navigate)}>
                            <Text allowFontScaling={global.isScaleFont}
                                style={{ color: '#fff', fontSize: fontSize(20, scale(6)) }}>{this.t('register')}</Text>
                        </Touchable> */}


                    </View>

                    {/* </View>

                <View style={styles.language_group} >
                    <Touchable onPress={this.onVietnameseClick.bind(this)}>
                        <Text allowFontScaling={global.isScaleFont} style={[styles.vietnam, { color: this.state.vn_choosen ? '#00ABA7' : '#919191' }]}>{this.t('vietnamese')}</Text>
                    </Touchable>
                    <Touchable onPress={this.onEnglishClick.bind(this)}> */}
                    {/* <Text allowFontScaling={global.isScaleFont} style={[styles.english, { color: this.state.vn_choosen ? '#919191' : '#00aba7' }]}>{this.t('english')}</Text> */}
                    {/* <Touchable onPress={this.onVietnameseClick}>
                        <View style={styles.language_group} >
                            <Image
                                style={styles.img_icon}
                                source={this.language.flag} />
                            <Text allowFontScaling={global.isScaleFont}
                                style={[styles.vietnam]}>
                                {this.language.name}
                            </Text>
                        </View>

                    </Touchable> */}
                    {/* </View>

                </View> */}
                </View>
            </ImageBackground>

        );
    }

    /**
     * chọn ngôn ngữ là tiếng việt
     */
    onVietnameseClick() {
        if (this.state.vn_choosen) return;
        this.getUserInfo().setLang('vn');
        this.setLanguage('vn');
        this.setState({
            vn_choosen: true
        });
    }


    componentDidMount() {
        ///this.getAppEventsLogger().logEvent(`OpenLoginView`)
        let { params } = this.props.navigation.state;
        console.log("param login ", params);
        if (params && params.login_other_device) {
            this.loginOtherDevice();
        }
        this.rotateToPortrait();

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
        this.setState({ phone: text });
        this.controlEnableDisableSigin(text, this.state.password);
    }

    onPasswordChange(text) {
        this.setState({ password: text });
        this.controlEnableDisableSigin(this.state.phone, text);
    }

    controlEnableDisableSigin(phone, pass) {
        if (phone.length >= 0 && pass.length >= 6) {
            this.setState({ disableSigninState: false });
        } else {
            this.setState({ disableSigninState: true });
        }
    }

    onNextPasswordFocus() {
        this.inputRef.focus();
    }

    onSignInClick() {
        if (this.state.phone && this.state.password) {
            this.loading.showLoading();
            // this.setLanguage('en');
            let phone = this.state.phone;
            let password = this.getUtils().sha256(this.state.password);
            let url = this.getConfig().getBaseUrl() + ApiService.user_login(phone, password);
            let self = this;
            console.log('url', url);
            Networking.httpRequestGet(url, this.onResponse.bind(this), () => {
                self.loading.hideLoading();
                self.popupTimeOut.showPopup();
            });
        }

    }

    onLoadLocalComplete(err, result) {
        let key = result[0][0];
        if (key === Constant.USER.PHONE) {
            this.setState({ phone: result[0][1] });
        }
    }

    onResponse(jsonData) {
        console.log('this.model', jsonData);
        this.loading.hideLoading();
        this.model = new LoginModel(this);
        this.model.parseData(jsonData);

        if (this.model.getErrorCode() === 0) {
            this.getUserInfo().setId(this.model.getUserId());
            this.getUserInfo().setUserToken(this.model.getToken());
            this.saveData(this.model.getUserId(), this.model.getToken(), this.model.getUserType());

            if (this.model.getUserType() === 0) {
                this.props.navigation.replace('sync_facebook_screen', { 'phone': this.state.phone });
            } else {
                this.props.navigation.replace('app_screen', { 'phone': this.state.phone });
                return;
            }

        } else {
            this.setState({ error_msg: this.model.getErrorMsg() })
        }
    }

    registerTokenDevice(token) {
        let url = this.getConfig().getBaseUrl() + ApiService.push_register(token);
        let self = this;
        //console.log('url', url);
        Networking.httpRequestGet(url, this.onRegisterTokenDevice.bind(this));
    }

    onRegisterTokenDevice(jsonData) {
        console.log('onRegisterTokenDevice', JSON.stringify(jsonData));
    }

    saveData(userId, token, userType) {
        DataManager.saveLocalData([[Constant.USER.USER_ID, userId],
        [Constant.USER.TOKEN, token],
        [Constant.USER.USER_TYPE, userType.toString()],
        [Constant.USER.PHONE, this.state.phone]], (error) => console.log('saveLocalData', error));
    }

    onSignUpClick(navigate) {
        navigate('register_screen', { 'phone': this.state.phone, 'type': 'register' });
    }

    onForgotPassClick(navigate) {
        navigate('register_screen', { 'phone': this.state.phone, 'type': 'forgot_pass' });
    }

    onShowHidePass() {
        this.setState({
            isInvisiblePass: !this.state.isInvisiblePass,
        });
        if (Platform.OS === 'ios') {
            this.inputRef.setNativeProps({
                selection: {
                    start: 0,
                    end: 0,
                },
            });
        }
        //this.inputRef.blur();
        if (this.state.isInvisiblePass) {
            this.setState({ uriInVisiable: this.getResources().invisible });
        } else {
            this.setState({ uriInVisiable: this.getResources().visible });
        }
    }
}

