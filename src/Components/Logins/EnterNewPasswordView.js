import React from 'react';
import {
    Platform,
    StyleSheet,
    Text,
    View,
    Image,
    TextInput,
    TouchableOpacity,
    BackHandler
} from 'react-native';
import Touchable from 'react-native-platform-touchable';
import { Button } from 'react-native-elements';
import Networking from '../../Networking/Networking';
import BaseComponent from '../../Core/View/BaseComponent';
import HeaderView from '../HeaderView';
import styles from '../../Styles/Logins/StyleEnterNewPass';
import LoginModel from '../../Model/Login/LoginModel';
import DataManager from '../../Core/Manager/DataManager';
import Constant from '../../Constant/Constant';
import ApiService from '../../Networking/ApiService';
import UserInfo from '../../Config/UserInfo';
import { scale, verticalScale,fontSize } from '../../Config/RatioScale';

export default class EnterNewPasswordView extends BaseComponent {

    constructor(props) {
        super(props);
        this.onBackPress = this.onBackPress.bind(this);
        this.onPasswordChange = this.onPasswordChangeAction.bind(this);
        this.onVerifyPasswordChange = this.onVerifyPasswordChangeAction.bind(this);
        this.phone = this.props.navigation.state.params.phone;
        this.idToken = this.props.navigation.state.params.idToken;
        this.countryCode = this.props.navigation.state.params.countryCode;
        this.idToken = this.props.navigation.state.params.idToken;
        this.idToken = this.props.navigation.state.params.idToken;
        this.state = {

            isInvisiblePass: true,
            uriInVisiable: this.getResources().visible,
            error_msg: '',
            password: '',
            password_re_enter: '',
        }
    }

    render() {
        return (
            <View style={styles.container} >
                {this.renderLoading()}
                <HeaderView
                    title={this.t('enter_new_password')}
                    handleBackPress={this.onBackPress} />

                <Text allowFontScaling={global.isScaleFont} style={styles.text_msg}>{this.t('de_nghe_nhap_mat_khau')}</Text>

                <Text allowFontScaling={global.isScaleFont} style={styles.error_text} >{this.state.error_msg}</Text>
                <View style={[styles.text_input_background, styles.password_view]} >
                    <TextInput allowFontScaling={global.isScaleFont} style={[styles.password]}
                        placeholder={this.t('password')}
                        placeholderTextColor='#8A8A8F'
                        underlineColorAndroid='rgba(0,0,0,0)'
                        secureTextEntry={this.state.isInvisiblePass}
                        autoFocus={true}
                        onChangeText={this.onPasswordChange}
                    />

                </View>
                <View style={[styles.text_input_background, styles.password_view]} >
                    <TextInput allowFontScaling={global.isScaleFont}
                        ref={(inputPassword) => { this.inputPassword = inputPassword; }}
                        style={[styles.password]}
                        placeholder={this.t('re_enter_pass')}
                        placeholderTextColor='#8A8A8F'
                        underlineColorAndroid='rgba(0,0,0,0)'
                        secureTextEntry={this.state.isInvisiblePass}
                        onChangeText={this.onVerifyPasswordChange}
                    />
                    <TouchableOpacity onPress={this.onShowHidePass.bind(this)}>
                        <Image
                            style={styles.visible_pass}
                            source={this.state.uriInVisiable}
                        />
                    </TouchableOpacity>

                </View>

                <Touchable onPress={this.onCompleteRegister.bind(this)}>
                    <View style={[{ marginTop: verticalScale(20) }, styles.signin_button]}>
                        {/* <Button title={this.t('complete_register')}
                        buttonStyle={styles.signin_button}
                        borderRadius={5}
                        fontSize={20}
                        onPress={this.onCompleteRegister.bind(this)} /> */}
                        <Text allowFontScaling={global.isScaleFont} style={{ color: '#fff', fontSize: fontSize(20,scale(6)) }}>{this.t('complete_register')}</Text>
                    </View>
                </Touchable>
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

    onShowHidePass() {
        this.setState({ isInvisiblePass: !this.state.isInvisiblePass });
        if (Platform.OS === 'ios') {
            this.inputPassword.setNativeProps({
                selection: {
                    start: 0,
                    end: 0,
                },
            });
        }
        if (this.state.isInvisiblePass) {
            this.setState({ uriInVisiable: this.getResources().invisible });
        } else {
            this.setState({ uriInVisiable: this.getResources().visible });
        }
    }

    onPasswordChangeAction(text) {
        this.setState({
            password: text,
            error_msg: ''
        });
    }

    onVerifyPasswordChangeAction(text) {
        this.setState({
            password_re_enter: text,
            error_msg: ''
        });
    }

    onCompleteRegister() {

        let oldPass = this.state.password;
        let newPass = this.state.password_re_enter;
        if (!oldPass.toString().length) {
            this.setState({
                error_msg: this.t('enter_password_empty')
            });
            return;
        }
        if (!newPass.toString().length) {
            this.setState({
                error_msg: this.t('re_enter_password_empty')
            });
            return;
        }
        if (oldPass === newPass) {
            this.setState({
                error_msg: ''
            });
            this.requestFinishRegister();
        } else {
            this.setState({
                error_msg: this.t('password_not_match')
            });
        }
    }

    requestFinishRegister() {
        this.loading.showLoading();
        let self = this;
        let shaPass = this.getUtils().sha256(this.state.password);
        let url = this.getConfig().getBaseUrl() + ApiService.user_register();

        let formData = {
            "phone": `+${this.countryCode.phone_code}${this.phone}`,
            "password": shaPass,
            "phone_code": this.countryCode.phone_code,
            "country": this.countryCode.sortname,
            "firebase_token": this.idToken
        };
        console.log("formData: ", formData);
        Networking.httpRequestPost(url, this.onFinishRegisterResponse.bind(this), formData,
            () => {
                //time out
                self.loading.hideLoading();
                self.showErrorMsg(self.t('time_out'))
            });
    }

    onFinishRegisterResponse(jsonData) {
        this.loading.hideLoading();
        this.model = new LoginModel(this);
        this.model.parseData(jsonData);
        if (this.model.getErrorCode() === 0) {
            let userProfile = this.model.getUserProfile();
            UserInfo.setId(userProfile.getId());
            UserInfo.setUserToken(this.model.getToken());
            this.saveData(userProfile.getId().toString(), this.model.getToken().toString(), '0');
            this.props.navigation.replace('update_user_info_screen');
        } else {
            this.setState({ error_msg: this.model.getErrorMsg() })
        }

    }

    saveData(userId, token, userType) {
        DataManager.saveLocalData([[Constant.USER.USER_ID, userId],
        [Constant.USER.TOKEN, token],
        [Constant.USER.USER_TYPE, userType.toString()],
        [Constant.USER.PHONE, this.phone]], (error) => console.log('saveLocalData', error));
    }

}
