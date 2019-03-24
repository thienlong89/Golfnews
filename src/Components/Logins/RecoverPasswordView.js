import React from 'react';
import { Platform, StyleSheet, Text, View, Image, TextInput, TouchableOpacity } from 'react-native';
import Touchable from 'react-native-platform-touchable';
// import { Button } from 'react-native-elements';
import Networking from '../../Networking/Networking';
import BaseComponent from '../../Core/View/BaseComponent';
import HeaderView from '../HeaderView';
import styles from '../../Styles/Logins/StyleEnterNewPass';
import ApiService from '../../Networking/ApiService';
import PopupNotifyView from '../Common/PopupNotifyView';
import Files from '../Common/Files';

const ICON_EYE = {
    VISIBLE: Files.sprites.visible,
    IN_VISIBLE: Files.sprites.invisible
}

export default class RecoverPasswordView extends BaseComponent {
    constructor(props) {
        super(props);
        this.onContinueClick = this.onContinueAction.bind(this);
        this.onPasswordChange = this.onPasswordChangeAction.bind(this);
        this.onVerifyPasswordChange = this.onVerifyPasswordChangeAction.bind(this);
        this.state = {
            phone: this.props.navigation.state.params != null ? this.props.navigation.state.params.phone : '',
            session: this.props.navigation.state.params != null ? this.props.navigation.state.params.session : '',
            isInvisiblePass: true,
            isInvisiblePass: true,
            uriInVisiable: ICON_EYE.VISIBLE,
            error_msg: '',
            password: '',
            password_re_enter: '',
            popup_notify_content: ''
        }
    }

    render() {
        return (
            <View style={styles.container} >
                {this.renderLoading()}
                <HeaderView title={this.t('recover_pass')} />

                <Text allowFontScaling={global.isScaleFont} style={styles.recover_pass_title}>{this.t('enter_new_pass')}</Text>

                <Text allowFontScaling={global.isScaleFont} style={styles.recover_pass_phone}>{this.state.phone}</Text>

                <Text allowFontScaling={global.isScaleFont} style={styles.recover_pass_error_text} >{this.state.error_msg}</Text>

                <View style={[styles.text_input_background, styles.password_view]} >
                    <TextInput allowFontScaling={global.isScaleFont} style={[styles.password]}
                        placeholder={this.t('password')}
                        placeholderTextColor='#8A8A8F'
                        underlineColorAndroid='rgba(0,0,0,0)'
                        secureTextEntry={this.state.isInvisiblePass}
                        onChangeText={this.onPasswordChange}
                        autoFocus={true}
                    />

                </View>
                <View style={[styles.text_input_background, styles.password_view]} >
                    <TextInput allowFontScaling={global.isScaleFont}
                        ref={(inputRePassword) => { this.inputRePassword = inputRePassword; }}
                        style={[styles.password]}
                        placeholder={this.t('re_enter_pass')}
                        placeholderTextColor='#8A8A8F'
                        underlineColorAndroid='rgba(0,0,0,0)'
                        secureTextEntry={this.state.isInvisiblePass}
                        onChangeText={this.onVerifyPasswordChange}
                    />
                    <TouchableOpacity onPress={() => this.onShowHidePass()}>
                        <Image
                            style={styles.visible_pass}
                            source={this.state.uriInVisiable}
                        />
                    </TouchableOpacity>

                </View>

                <Touchable style={styles.recover_pass_touch} onPress={this.onContinueClick.bind(this)}>
                    <Text allowFontScaling={global.isScaleFont} style={styles.recover_pass_continue}>{this.t('continue')}</Text>
                </Touchable>

                <PopupNotifyView
                    ref={(popupNotify) => { this.popupNotify = popupNotify; }}
                    content={this.t('change_pass_success')}
                    confirmText={this.t('ok')}
                    onDismissOutside={false}
                    onPopupDismissed={this.onPopupNotifyConfirm.bind(this)}
                    onConfirmClick={this.onPopupNotifyConfirm.bind(this)} />
                {this.renderMessageBar()}
            </View>
        );
    }

    componentDidMount() {
        this.registerMessageBar();
    }

    componentWillUnmount() {
        this.unregisterMessageBar();
    }

    onShowHidePass() {
        this.setState({ isInvisiblePass: !this.state.isInvisiblePass });
        if (Platform.OS === 'ios') {
            this.inputRePassword.setNativeProps({
                selection: {
                    start: 0,
                    end: 0,
                },
            });
        }
        if (this.state.isInvisiblePass) {
            this.setState({ uriInVisiable: ICON_EYE.IN_VISIBLE });
        } else {
            this.setState({ uriInVisiable: ICON_EYE.VISIBLE });
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

    onContinueAction() {
        let oldPass = this.state.password;
        let newPass = this.state.password_re_enter;
        if (oldPass === newPass) {
            this.setState({
                error_msg: ''
            });
            this.requestFinishRegister();
        } else {
            this.setState({
                error_msg: this.t('password_not_match')
            })
        }

    }

    requestFinishRegister() {
        this.loading.showLoading();
        let self = this;
        let shaPass = this.getUtils().sha256(this.state.password);
        let url = this.getConfig().getBaseUrl() + ApiService.user_recovery_password();
        console.log("url : ", url);
        let formData = { "phone": this.state.phone, "new_password": shaPass, "session": this.state.session };
        console.log("phone" + this.state.phone, "new_password" + shaPass, "session" + this.state.session)
        Networking.httpRequestPost(url, this.onUpdatePassResponse.bind(this), formData, () => {
            //time out
            self.loading.hideLoading();
            self.showErrorMsg(self.t('time_out'))
        });
    }

    onUpdatePassResponse(jsonData) {
        this.loading.hideLoading();
        console.log('onUpdatePassResponse', jsonData);
        if (jsonData['error_code'] === 0) {
            this.popupNotify.show();
        } else {
            if (jsonData.hasOwnProperty("error_msg")) {
                let error = jsonData['error_msg'];
                this.setState({
                    error_msg: error
                });
            }
        }
    }

    onPopupNotifyConfirm() {
        this.props.navigation.replace('login_screen');
    }

}
