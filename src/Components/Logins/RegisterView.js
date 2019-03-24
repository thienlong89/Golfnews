import React from 'react';
import {
    Platform,
    StyleSheet,
    BackHandler,
    Text,
    View,
    Image,
    TextInput,
    TouchableOpacity
} from 'react-native';
import Touchable from 'react-native-platform-touchable'
import Networking from '../../Networking/Networking';
import BaseComponent from '../../Core/View/BaseComponent';
import HeaderView from '../HeaderView';
import styles from '../../Styles/Logins/StyleRegisterView';
import ApiService from '../../Networking/ApiService';
import { Avatar } from 'react-native-elements';
import firebase from 'react-native-firebase'
import PopupYesOrNo from '../Common/PopupYesOrNo';

export default class RegisterView extends BaseComponent {
    constructor(props) {
        super(props);
        this.onContinueClick = this.onContinueClickAction.bind(this);
        this.onPhoneChange = this.onPhoneChangeAction.bind(this);
        this.onBackPress = this.onBackPress.bind(this);
        this.onSelectCountryCode = this.onSelectCountryCode.bind(this);
        this.onCountryCodeCallback = this.onCountryCodeCallback.bind(this);
        this.onConfirmUser = this.onConfirmUserPress.bind(this);
        this.onNotConfirmUser = this.onNotConfirmUserPress.bind(this);

        this.type_screen = this.props.navigation.state.params ? this.props.navigation.state.params.type : 'register';
        this.state = {
            phone: this.props.navigation.state.params != null ? this.props.navigation.state.params.phone : '',
            error_msg: '',
            countryCode: ''
        }
    }

    render() {
        let { countryCode, phone, error_msg } = this.state;

        return (
            <View style={styles.container} >
                {this.renderLoading()}
                <HeaderView
                    title={(this.type_screen === 'register') ? this.t('register_header') : this.t('recover_pass')}
                    handleBackPress={this.onBackPress} />

                <Text allowFontScaling={global.isScaleFont} style={styles.text_suggest} >{this.t('enter_phone_suggest')}</Text>
                <View style={styles.text_input_bg}>
                    <TouchableOpacity onPress={this.onSelectCountryCode}>
                        <View style={{ flexDirection: 'row', marginLeft: 10 }}>
                            <Avatar rounded
                                width={23}
                                height={23}
                                containerStyle={styles.img_icon}
                                source={countryCode.image ? { uri: countryCode.image } : this.getResources().world}

                            />
                            <Text allowFontScaling={global.isScaleFont} style={styles.txt_triangle}>{'▼'}</Text>
                        </View>
                    </TouchableOpacity>

                    <TextInput allowFontScaling={global.isScaleFont} style={styles.text_input_margin}
                        placeholder={this.t('number_phone')}
                        placeholderTextColor='#8A8A8F'
                        underlineColorAndroid='rgba(0,0,0,0)'
                        keyboardType='numeric'
                        onChangeText={this.onPhoneChange.bind(this)}
                        value={phone}
                        autoFocus={true}
                        onSubmitEditing={this.onSubmitEditing.bind(this)}
                    />
                </View>
                <Text allowFontScaling={global.isScaleFont} style={styles.text_error} >{error_msg}</Text>

                <View style={styles.text_continue_touch}>
                    <Touchable onPress={this.onContinueClick} style={styles.touchable_continue}>
                        <Text allowFontScaling={global.isScaleFont} style={styles.text_continue}>{this.t('continue_lower_case')}</Text>
                    </Touchable>
                </View>

                <PopupYesOrNo
                    ref={(refPopupConfirm) => { this.refPopupConfirm = refPopupConfirm; }}
                    content={''}
                    confirmText={this.t('yes')}
                    cancelText={this.t('no')}
                    onConfirmClick={this.onConfirmUser}
                    onCancelClick={this.onNotConfirmUser} />
                {this.renderMessageBar()}
            </View>
        );
    }

    onBackPress() {
        if (this.props.navigation) {
            this.props.navigation.goBack();
        }
        return true;
    }

    componentDidMount() {
        this.rotateToPortrait();
        this.registerMessageBar();
        this.handleHardwareBackPress();
    }

    componentWillUnmount() {
        this.unregisterMessageBar();
        if (this.backHandler) {
            this.backHandler.remove();
        }
    }

    handleHardwareBackPress() {
        let self = this;
        this.backHandler = BackHandler.addEventListener('hardwareBackPress', function () {
            self.onBackPress();
            return true;
        });
    }

    onPhoneChangeAction(text) {
        this.setState({ phone: text });
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

    onSubmitEditing() {
        this.onContinueClickAction();
    }

    onConfirmUserPress() {
        this.onBackPress();
    }

    onNotConfirmUserPress() {
        this.setState({
            phone: ''
        })
    }

    onContinueClickAction() {
        let self = this;
        let { countryCode, phone } = this.state;
        if (this.validateData(countryCode.phone_code, phone)) {
            this.loading.showLoading();
            if (this.type_screen === 'register') {
                let url = this.getConfig().getBaseUrl() + ApiService.check_phone_number(phone, countryCode.phone_code);
                console.log("url : ", url);
                Networking.httpRequestGet(url, this.onCheckPhoneResponse.bind(this), () => {
                    //time out
                    self.loading.hideLoading();
                    self.showErrorMsg(self.t('time_out'));
                });
            } else {
                let url = this.getConfig().getBaseUrl() + ApiService.get_sms_code_password_recovery(this.state.phone, true);
                console.log("url : ", url);
                Networking.httpRequestGet(url, this.onGetSmsCodeResponse.bind(this), () => {
                    //time out
                    self.loading.hideLoading();
                    self.showErrorMsg(self.t('time_out'));
                });
            }
        }

    }

    onGetSmsCodeResponse(jsonData) {
        this.loading.hideLoading();
        let error_code;
        if (jsonData != null && jsonData.hasOwnProperty('error_code')) {
            error_code = jsonData['error_code'];
        }
        if (error_code != null && error_code === 0) {
            if (jsonData.hasOwnProperty("data")) {
                let data = jsonData['data'];
                setTimeout(() => {
                    this.props.navigation.navigate('verifyotp_screen', { 'none': data['none'], 'phone': this.state.phone, 'type_screen': this.type_screen });
                }, 500);

            }
        } else {
            if (jsonData.hasOwnProperty("error_msg")) {
                let error = jsonData['error_msg'];
                this.setState({
                    error_msg: error
                });
            }
        }
    }

    onCheckPhoneResponse(jsonData) {
        console.log('onCheckPhoneResponse', jsonData)
        this.loading.hideLoading();
        if (jsonData.error_code === 0) {
            this.requestFirebaseAuth();
        } else {
            this.refPopupConfirm.setContent(jsonData.error_msg);
        }
    }

    requestFirebaseAuth() {
        let { countryCode, phone } = this.state;
        try {
            let phoneNumber = `+${countryCode.phone_code}${phone}`;
            console.log('phoneNumber', phoneNumber)
            let self = this;
            firebase.auth().signInWithPhoneNumber(phoneNumber)
                .then(confirmResult => {
                    console.log('confirmResult', confirmResult)
                    setTimeout(() => {
                        self.props.navigation.navigate('verifyotp_screen', {
                            'countryCode': countryCode,
                            'phone': phone,
                            'confirmResult': confirmResult,
                            'type_screen': self.type_screen
                        });
                    }, 500);
                })
                .catch(error => {
                    console.log('requestFirebaseAuth.catch', error);
                    self.setState({
                        error_msg: self.t('phone_format_incorrect')
                    });
                });
        } catch (error) {
            console.log('requestFirebaseAuth.error', error);
        }

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

}