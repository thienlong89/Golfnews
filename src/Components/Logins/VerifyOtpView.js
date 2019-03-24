import React from 'react';
import {
    Platform,
    StyleSheet,
    Text,
    View,
    Image,
    TextInput,
    TouchableOpacity,
    BackHandler,
    NetInfo,
    Alert
} from 'react-native';
import Touchable from 'react-native-platform-touchable'
import Networking from '../../Networking/Networking';
import BaseComponent from '../../Core/View/BaseComponent';
import HeaderView from '../HeaderView';
import styles from '../../Styles/Logins/StyleVerifyOtpView';
import ApiService from '../../Networking/ApiService';
import firebase from 'react-native-firebase';
import UserInfo from '../../Config/UserInfo';
import DataManager from '../../Core/Manager/DataManager';
import Constant from '../../Constant/Constant';
import siginFirebase from '../../Services/SignInFirebase';

export default class VerifyOtpView extends BaseComponent {
    constructor(props) {
        super(props);

        this.onBackPress = this.onBackPress.bind(this);
        this.onInput1Change = this.onInput1Change.bind(this);
        this.onInput2Change = this.onInput2Change.bind(this);
        this.onInput3Change = this.onInput3Change.bind(this);
        this.onInput4Change = this.onInput4Change.bind(this);
        this.onInput5Change = this.onInput5Change.bind(this);
        this.onInput6Change = this.onInput6Change.bind(this);
        this.onResendOtp = this.onResendOtp.bind(this);
        this.handleKeyDown1 = this.handleKeyDown1.bind(this);
        this.handleKeyDown2 = this.handleKeyDown2.bind(this);
        this.handleKeyDown3 = this.handleKeyDown3.bind(this);
        this.handleKeyDown4 = this.handleKeyDown4.bind(this);
        this.handleKeyDown5 = this.handleKeyDown5.bind(this);
        this.handleKeyDown6 = this.handleKeyDown6.bind(this);
        this.onConnectionChange = this.onConnectionChange.bind(this);

        this.firebaseAuthToken = null;
        this.lastKeyEventTimestamp = 0;
        this.input_otp1 = 0;
        this.input_otp2 = 0;
        this.input_otp3 = 0;
        this.input_otp4 = 0;
        this.input_otp5 = 0;
        this.input_otp6 = 0;
        this.inputCode = '';
        this.language = this.props.navigation.state.params.language;
        this.type_screen = this.props.navigation.state.params != null ? this.props.navigation.state.params.type_screen : 'register';
        this.countryCode = this.props.navigation.state.params.countryCode;
        this.confirmResult = this.props.navigation.state.params.confirmResult;
        this.phone = this.props.navigation.state.params != null ? this.props.navigation.state.params.phone : '';
        this.state = {
            none: this.props.navigation.state.params != null ? this.props.navigation.state.params.none : '',
            error_msg: '',
            input_otp1: '',
            input_otp2: '',
            input_otp3: '',
            input_otp4: '',
            input_otp5: '',
            input_otp6: ''
        }
        // this.getCodeToTest();
        this.onVerifyOtpPress = this.onVerifyOtpPress.bind(this);

        this.fuid = '';
        this.isLogin = false;
    }

    render() {
        let {
            input_otp1,
            input_otp2,
            input_otp3,
            input_otp4,
            input_otp5,
            input_otp6,
            error_msg
        } = this.state;
        return (
            <View style={styles.container} >
                {this.renderLoading()}
                <HeaderView
                    title={this.t('verify_sms')}
                    handleBackPress={this.onBackPress} />

                <Text allowFontScaling={global.isScaleFont} style={styles.text_suggest} >
                    {this.t('otp_sent')}
                    <Text allowFontScaling={global.isScaleFont} style={{ color: '#3B3B3B', fontWeight: 'bold' }}>{this.phone}</Text>
                    {this.t('enter_verify_code')}
                </Text>

                <View style={styles.input_otp_group}>
                    <View style={styles.input_group}>
                        <TextInput allowFontScaling={global.isScaleFont}
                            ref="input1"
                            style={styles.input_text}
                            keyboardType='numeric'
                            underlineColorAndroid='rgba(0,0,0,0)'
                            maxLength={1}
                            onChangeText={this.onInput1Change}
                            value={input_otp1}
                            autoFocus={true}
                            onKeyPress={this.handleKeyDown1}
                        ></TextInput>
                        <View style={styles.input_line} />
                    </View>

                    <View style={styles.input_group}>
                        <TextInput allowFontScaling={global.isScaleFont}
                            ref="input2"
                            style={styles.input_text}
                            keyboardType='numeric'
                            underlineColorAndroid='rgba(0,0,0,0)'
                            maxLength={1}
                            onChangeText={this.onInput2Change}
                            onKeyPress={this.handleKeyDown2}
                            value={input_otp2}
                        ></TextInput>
                        <View style={styles.input_line} />
                    </View>

                    <View style={styles.input_group}>
                        <TextInput allowFontScaling={global.isScaleFont}
                            ref="input3"
                            style={styles.input_text}
                            keyboardType='numeric'
                            underlineColorAndroid='rgba(0,0,0,0)'
                            maxLength={1}
                            onChangeText={this.onInput3Change}
                            onKeyPress={this.handleKeyDown3}
                            value={input_otp3}
                        ></TextInput>
                        <View style={styles.input_line} />
                    </View>

                    <View style={styles.input_group}>
                        <TextInput allowFontScaling={global.isScaleFont}
                            ref="input4"
                            style={styles.input_text}
                            keyboardType='numeric'
                            underlineColorAndroid='rgba(0,0,0,0)'
                            maxLength={1}
                            onChangeText={this.onInput4Change}
                            onKeyPress={this.handleKeyDown4}
                            value={input_otp4}
                        ></TextInput>
                        <View style={styles.input_line} />
                    </View>

                    <View style={styles.input_group}>
                        <TextInput allowFontScaling={global.isScaleFont}
                            ref="input5"
                            style={styles.input_text}
                            keyboardType='numeric'
                            underlineColorAndroid='rgba(0,0,0,0)'
                            maxLength={1}
                            onChangeText={this.onInput5Change}
                            onKeyPress={this.handleKeyDown5}
                            value={input_otp5}
                        ></TextInput>
                        <View style={styles.input_line} />
                    </View>

                    <View style={styles.input_group}>
                        <TextInput allowFontScaling={global.isScaleFont}
                            ref="input6"
                            style={styles.input_text}
                            keyboardType='numeric'
                            underlineColorAndroid='rgba(0,0,0,0)'
                            maxLength={1}
                            onChangeText={this.onInput6Change}
                            onKeyPress={this.handleKeyDown6}
                            value={input_otp6}
                        ></TextInput>
                        <View style={styles.input_line} />
                    </View>
                </View>

                {/* <Touchable style={styles.touch_resend} onPress={this.onVerifyOtpPress} >
                    <Text allowFontScaling={global.isScaleFont} style={styles.resend_otp}>{this.t('ok')}</Text>
                </Touchable> */}

                <Text allowFontScaling={global.isScaleFont} style={styles.text_error} >{error_msg}</Text>
                {this.renderMessageBar()}
            </View>
        );
    }

    onBackPress() {
        if (this.props.navigation) {
            this.props.navigation.goBack();
        }
        if (this.props.navigation.state.params.onBack) {
            this.props.navigation.state.params.onBack();
        }
        return true;
    }

    componentDidMount() {
        NetInfo.addEventListener('connectionChange', this.onConnectionChange);
        this.rotateToPortrait();
        this.registerMessageBar();
        this.handleHardwareBackPress();
        setTimeout(() => {
            this.setState({
                input_otp1: '',
                input_otp2: '',
                input_otp3: '',
                input_otp4: '',
                input_otp5: '',
                input_otp6: ''
            })
            this.input_otp1 = '';
            this.input_otp2 = '';
            this.input_otp3 = '';
            this.input_otp4 = '';
            this.input_otp5 = '';
            this.input_otp6 = '';
        }, 500);
        this.autoVerify();
        if (firebase) {
            firebase.analytics().setCurrentScreen('VerifyOtpView');
        }
    }

    componentWillUnmount() {
        this.unregisterMessageBar();
        if (this.backHandler) {
            this.backHandler.remove();
        }
        if (this.unsubscribe) this.unsubscribe();
        NetInfo.removeEventListener('connectionChange', this.onConnectionChange)
    }

    onConnectionChange(connectionType) {
        this.Logger().log('onConnectionChange', connectionType, this.inputCode.length)
        if (connectionType != 'none' && connectionType != 'unknown' && this.inputCode.length === 6) {
            this.onRequestVerifyOtp(this.inputCode);
        }
    }

    handleHardwareBackPress() {
        let self = this;
        this.backHandler = BackHandler.addEventListener('hardwareBackPress', function () {
            self.onBackPress();
            return true;
        });
    }

    handleKeyDown1(e) {
        console.log('handleKeyDown1')
        if (e.nativeEvent.key == "Backspace") {
            // this.refs.input1.clear();
            if (Math.abs(this.lastKeyEventTimestamp - e.timeStamp) < 100) return;
            this.setState({
                input_otp1: ''
            })
            this.input_otp1 = '';
        } else {
            // Record non-backspace key event time stamp
            this.lastKeyEventTimestamp = e.timeStamp;
            this.onInput1Change(e.nativeEvent.key);
        }
    }

    handleKeyDown2(e) {
        console.log('handleKeyDown2')
        if (e.nativeEvent.key == "Backspace") {
            if (Math.abs(this.lastKeyEventTimestamp - e.timeStamp) < 100) return;
            if (this.input_otp2 != '') {
                this.input_otp2 = '';
                this.setState({
                    input_otp2: ''
                })
                // this.refs.input2.clear();
            } else {
                this.input_otp1 = '';
                // this.refs.input1.clear();
                this.setState({
                    input_otp1: ''
                })
                this.refs.input1.focus();
            }
        } else {
            // Record non-backspace key event time stamp
            this.lastKeyEventTimestamp = e.timeStamp;
            this.onInput2Change(e.nativeEvent.key);
        }
    }

    handleKeyDown3(e) {
        console.log('handleKeyDown3', e.nativeEvent.key)
        if (e.nativeEvent.key == "Backspace") {
            if (Math.abs(this.lastKeyEventTimestamp - e.timeStamp) < 100) return;
            console.log('handleKeyDown3.action')
            if (this.input_otp3 != '') {
                this.input_otp3 = '';
                // this.refs.input3.clear();
                this.setState({
                    input_otp3: ''
                })
            } else {
                this.input_otp2 = '';
                // this.refs.input2.clear();
                this.setState({
                    input_otp2: ''
                })
                this.refs.input2.focus();
            }
        } else {
            // Record non-backspace key event time stamp
            this.lastKeyEventTimestamp = e.timeStamp;
            this.onInput3Change(e.nativeEvent.key);
        }
    }

    handleKeyDown4(e) {
        console.log('handleKeyDown4', e.nativeEvent.key)
        if (e.nativeEvent.key == "Backspace") {
            if (Math.abs(this.lastKeyEventTimestamp - e.timeStamp) < 100) return;
            if (this.input_otp4 != '') {
                this.input_otp4 = '';
                // this.refs.input4.clear();
                this.setState({
                    input_otp4: ''
                })
            } else {
                this.input_otp3 = '';
                // this.refs.input3.clear();
                this.setState({
                    input_otp3: ''
                })
                this.refs.input3.focus();
            }
        } else {
            // Record non-backspace key event time stamp
            this.lastKeyEventTimestamp = e.timeStamp;
            this.onInput4Change(e.nativeEvent.key);
        }
    }

    handleKeyDown5(e) {
        console.log('handleKeyDown5')
        if (e.nativeEvent.key == "Backspace") {
            if (Math.abs(this.lastKeyEventTimestamp - e.timeStamp) < 100) return;
            console.log('handleKeyDown5')
            if (this.input_otp5 != '') {
                this.input_otp5 = '';
                // this.refs.input5.clear();
                this.setState({
                    input_otp5: ''
                })
            } else {
                this.input_otp4 = '';
                // this.refs.input4.clear();
                this.setState({
                    input_otp4: ''
                })
                this.refs.input4.focus();
            }
        } else {
            // Record non-backspace key event time stamp
            this.lastKeyEventTimestamp = e.timeStamp;
            this.onInput5Change(e.nativeEvent.key);
        }
    }

    handleKeyDown6(e) {
        console.log('handleKeyDown6')
        if (e.nativeEvent.key == "Backspace") {
            if (Math.abs(this.lastKeyEventTimestamp - e.timeStamp) < 100) return;
            if (this.input_otp6 != '') {
                this.input_otp6 = '';
                // this.refs.input6.clear();
                this.setState({
                    input_otp6: ''
                })
            } else {
                this.input_otp5 = '';
                // this.refs.input5.clear();
                this.setState({
                    input_otp5: ''
                })
                this.refs.input5.focus();
            }

        } else {
            // Record non-backspace key event time stamp
            this.lastKeyEventTimestamp = e.timeStamp;
            this.onInput6Change(e.nativeEvent.key);
        }
    }

    onInput1Change(input) {
        //this.setState({ input_otp1: input });
        console.log('onInput1Change', input)
        this.setState({
            input_otp1: input
        }, () => {
            this.input_otp1 = input;
            if (input.length > 0) {
                this.refs.input2.focus();
            }
        })

    }

    onInput2Change(input) {
        console.log('onInput2Change', input)
        this.setState({
            input_otp2: input
        }, () => {
            this.input_otp2 = input;
            if (input.length > 0) {
                this.refs.input3.focus();
            }
        })
        //this.setState({ input_otp2: input });
    }

    onInput3Change(input) {
        console.log('onInput3Change', input)
        this.setState({
            input_otp3: input
        }, () => {
            this.input_otp3 = input;
            if (input.length > 0) {
                this.refs.input4.focus();
            }
        })
        //this.setState({ input_otp3: input });
    }

    onInput4Change(input) {
        console.log('onInput4Change', input)
        this.setState({
            input_otp4: input
        }, () => {
            this.input_otp4 = input;
            if (input.length > 0) {
                this.refs.input5.focus();
            }
        })
        //this.setState({ input_otp4: input });

    }

    onInput5Change(input) {
        console.log('onInput5Change', input)
        this.setState({
            input_otp5: input
        }, () => {
            this.input_otp5 = input;
            if (input.length > 0) {
                this.refs.input6.focus();
            }
        })


    }

    async onInput6Change(input) {
        //this.setState({ input_otp4: input });
        console.log('onInput6Change', input)
        this.setState({
            input_otp6: input
        }, () => {

        })
        this.input_otp6 = input;
        this.inputCode = `${this.input_otp1}${this.input_otp2}${this.input_otp3}${this.input_otp4}${this.input_otp5}${input}`

        let connect = await this.isNetworkConnected();
        console.log('otp: ', this.inputCode, connect);
        if (input != '' && connect) {
            this.onRequestVerifyOtp(this.inputCode);
            console.log('otp: ', this.inputCode);
        }
    }

    onResendOtp() {
        this.loading.showLoading();
        let self = this;
        if (this.type_screen === 'register') {
            try {
                firebase.auth().signInWithPhoneNumber(`${this.countryCode.phone_code}${this.phone}`)
                    .then(confirmResult => {
                        self.loading.hideLoading();
                        console.log('confirmResult', confirmResult)
                        self.confirmResult = confirmResult;
                    })
                    .catch(error => {
                        self.loading.hideLoading();
                        console.log('requestFirebaseAuth.catch', error);
                    });
            } catch (error) {
                self.loading.hideLoading();
                console.log('requestFirebaseAuth.error', error);
            }

        } else {
            let url = this.getConfig().getBaseUrl() + ApiService.get_sms_code_password_recovery(this.phone, true);
            console.log("url : ", url);
            Networking.httpRequestGet(url, this.onGetSmsCodeResponse.bind(this), () => {
                //time out
                self.loading.hideLoading();
                self.showErrorMsg(self.t('time_out'));
            });
        }

        this.setState({
            error_msg: ''
        });
        this.refs.input1.clear();
        this.refs.input2.clear();
        this.refs.input3.clear();
        this.refs.input4.clear();
        this.refs.input5.clear();
        this.refs.input6.clear();
        this.refs.input1.focus();
        this.input_otp1 = '';
        this.input_otp2 = '';
        this.input_otp3 = '';
        this.input_otp4 = '';
        this.input_otp5 = '';
        this.input_otp6 = '';
    }

    onGetSmsCodeResponse(jsonData) {
        let error_code;
        this.loading.hideLoading();
        if (jsonData != null && jsonData.hasOwnProperty('error_code')) {
            error_code = jsonData['error_code'];
        }
        if (error_code != null && error_code === 0) {
            if (jsonData.hasOwnProperty("data")) {
                let data = jsonData['data'];
                this.setState({
                    none: data['none']
                });
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

    autoVerify() {
        let self = this;
        this.unsubscribe = firebase.auth().onAuthStateChanged((user) => {
            if (user) {
                let currentUser = firebase.auth().currentUser;
                currentUser.getIdToken().then(idToken => {
                    self.firebaseAuthToken = idToken;
                    // self.sendFirebaseToken(currentUser.uid);
                    self.fuid = currentUser.uid;
                    self.requestLogin(self, self.firebaseAuthToken);
                    console.log('onRequestVerifyOtp.idToken.autoVerify', idToken);
                }).catch((err) => {
                    console.log('onRequestVerifyOtp.idToken.err.autoVerify', err);
                })
            } else {

            }
        });
    }

    sendFirebaseToken(fuid) {
        // let fuid = firebase.auth().currentUser.uid;
        this.Logger().log('.................... fuid firebase chat : ', fuid);
        if (fuid) {
            UserInfo.setFuid(fuid);
            // DataManager.save_fuid_firebase(fuid);
            siginFirebase.sendFirebaseUid(fuid);
        }
    }

    onVerifyOtpPress() {

    }

    onRequestVerifyOtp(code) {
        if (firebase) {
            firebase.analytics().logEvent('onRequestVerifyOtp', {
                'code': code,
                'Phone': this.phone
            })
        }
        if (this.confirmResult && code.length) {
            if (this.loading)
                this.loading.showLoading();
            let self = this;
            if (this.firebaseAuthToken) {
                self.requestLogin(self, this.firebaseAuthToken);
            } else {
                this.confirmResult.confirm(code)
                    .then((user, idToken) => {
                        let currentUser = firebase.auth().currentUser;
                        self.fuid = currentUser.uid;
                        currentUser.getIdToken().then(idToken => {
                            console.log('onRequestVerifyOtp.idToken', idToken);
                            // self.loading.hideLoading();
                            // self.sendFirebaseToken(currentUser.uid);
                            self.requestLogin(self, idToken);
                        }).catch((err) => {
                            console.log('onRequestVerifyOtp.idToken.err', err);
                            self.showErrorMsg(err);
                            if (firebase) {
                                firebase.analytics().logEvent('getIdToken', {
                                    'Phone': this.phone,
                                    'error': err
                                })
                            }
                            if (self.loading)
                                self.loading.hideLoading();
                        })

                    })
                    .catch(error => {
                        console.log('onRequestVerifyOtp.idToken.error', error);
                        if (firebase) {
                            firebase.analytics().logEvent('onRequestVerifyOtp', {
                                'Phone': this.phone,
                                'error': error
                            })
                        }
                        if (self.loading)
                            self.loading.hideLoading();
                        self.inputCode = '';
                        self.setState({
                            input_otp1: '',
                            input_otp2: '',
                            input_otp3: '',
                            input_otp4: '',
                            input_otp5: '',
                            input_otp6: '',
                            error_msg: self.t('otp_incorrect')
                        }, () => {
                            self.input_otp1 = '';
                            self.input_otp2 = '';
                            self.input_otp3 = '';
                            self.input_otp4 = '';
                            self.input_otp5 = '';
                            self.input_otp6 = '';

                            setTimeout(() => {
                                if(self.refs.input1){
                                    self.refs.input1.focus();
                                }                            
                            }, 300);
                        })
                    });
            }
        }
    }

    requestLogin(self, idToken) {
        if (!this.isLogin) {
            this.isLogin = true;
            let formData = {
                "country": this.countryCode.sortname,
                "phone_code": this.countryCode.phone_code,
                "token_firebase": idToken,
                "language": this.language
            };
            console.log("formData: ", formData);
            let url = this.getConfig().getBaseUrl() + ApiService.user_login_token();
            if (firebase) {
                firebase.analytics().logEvent('requestLogin', {
                    'Phone': this.phone,
                    "url": 'login_firebase',
                    "country": this.countryCode.sortname,
                    "phone_code": this.countryCode.phone_code,
                    "token_firebase": idToken,
                    "language": this.language
                })
            }
            let selfClass = this;
            Networking.httpRequestPost(url, (jsonData) => {
                console.log('requestLogin', jsonData)
                if (jsonData.error_code === 0) {
                    let data = jsonData.data;
                    let userType = data ? data.user_type : 0;
                    let uid = data ? data.uid : '';
                    let token = data ? data.token : '';
                    UserInfo.setId(uid);
                    UserInfo.setUserToken(token);
                    UserInfo.setUserType(userType);
                    self.saveData(uid.toString(), token.toString(), userType.toString());
                    selfClass.sendFirebaseToken(selfClass.fuid);

                    if (userType === 0) {
                        self.props.navigation.navigate('update_user_info_screen', {
                            'countryCode': self.countryCode,
                            'phone': self.phone
                        });
                    } else {
                        self.props.navigation.replace('app_screen', { 'phone': this.phone });
                    }

                } else {
                    self.setState({
                        input_otp1: '',
                        input_otp2: '',
                        input_otp3: '',
                        input_otp4: '',
                        input_otp5: '',
                        input_otp6: '',
                        error_msg: jsonData.error_msg
                    }, () => {
                        self.input_otp1 = '';
                        self.input_otp2 = '';
                        self.input_otp3 = '';
                        self.input_otp4 = '';
                        self.input_otp5 = '';
                        self.input_otp6 = '';
                        self.isLogin = false;
                        setTimeout(() => {
                            self.refs.input1.focus();
                        }, 300);
                    })
                }
                self.loading.hideLoading();
            }, formData, () => {
                //time out
                self.isLogin = false;
                self.loading.hideLoading();
                self.showErrorMsg(self.t('time_out'))
            });

        }

    }


    async isNetworkConnected() {
        let isConnect = await NetInfo.getConnectionInfo().then((connectionInfo) => {
            if (connectionInfo.type === 'none' || connectionInfo.type === 'unknown') {
                Alert.alert(
                    this.t('notify'),
                    this.t('network_connection_error'),
                    [
                        {
                            text: this.t('ok'), onPress: () => {
                            }
                        }
                    ],
                    {
                        cancelable: true
                    }
                );

                return false;
            }
            return true;

        }).catch(() => {
            return true;
        });
        return isConnect;
    }

    saveData(userId, token, userType) {
        DataManager.saveLocalData([[Constant.USER.USER_ID, userId],
        [Constant.USER.TOKEN, token],
        [Constant.USER.USER_TYPE, userType.toString()],
        [Constant.USER.PHONE, this.phone]], (error) => console.log('saveLocalData', error));
    }

}

