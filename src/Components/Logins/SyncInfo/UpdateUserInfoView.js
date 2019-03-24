import React from 'react';
import {
    Platform,
    StyleSheet,
    Text,
    View,
    BackHandler,
    KeyboardAvoidingView,
    TouchableOpacity,
    Image,
    ScrollView
} from 'react-native';
import Touchable from 'react-native-platform-touchable';
import BaseComponent from '../../../Core/View/BaseComponent';
import Networking from '../../../Networking/Networking';
import ApiService from '../../../Networking/ApiService';
import { scale, verticalScale, fontSize } from '../../../Config/RatioScale';
import { TextField } from 'react-native-material-textfield';
import DataManager from '../../../Core/Manager/DataManager';
import Constant from '../../../Constant/Constant';
import firebase from 'react-native-firebase'

export default class UpdateUserInfoView extends BaseComponent {

    constructor(props) {
        super(props);
        this.userInfo = this.getUserInfo();
        this.onChangeName = this.onChangeName.bind(this);
        this.onCompleteUpdate = this.onCompleteUpdate.bind(this);
        this.checks = [this.getResources().ic_checked, this.getResources().ic_score_circle]
        this.name = '';
        this.state = {
            isMale: true,
            isProfession: false,
            error_name: ''
        }
    }

    render() {

        let { isMale, isProfession } = this.state;

        return (
            <KeyboardAvoidingView style={styles.container} behavior="padding" enabled>

                <Text allowFontScaling={global.isScaleFont} style={styles.text_suggest} >
                    {this.t('declare_info')}
                </Text>

                <ScrollView style={styles.view_content}>
                    <TextField allowFontScaling={global.isScaleFont}
                        label={this.t('name')}
                        tintColor='#525252'
                        lineWidth={scale(0.5)}
                        activeLineWidth={scale(0.5)}
                        disabledLineWidth={scale(0.5)}
                        labelFontSize={17}
                        fontSize={15}
                        // onFocus={() => this.onNameFocus()}
                        error={this.state.error_name}
                        errorColor='#FF0000'
                        // value={this.state.name}
                        onChangeText={this.onChangeName}
                    />
                    {/* <Text style={[styles.txt_gender, { marginTop: verticalScale(30) }]}>
                        {this.t('gender')}
                    </Text> */}
                    {/* <View style={styles.view_gender}> */}
                    {/* <TouchableOpacity onPress={() => this.setState({ isMale: true })}>
                        <View style={[styles.view_item, { marginTop: 10 }]}>
                            <Image
                                style={styles.img_check}
                                source={isMale ? this.checks[0] : this.checks[1]} />
                            <Text allowFontScaling={global.isScaleFont} style={[styles.txt_male, { color: isMale ? '#00ABA7' : '#C3C3C3', marginRight: 5 }]}>{this.t('male')}</Text>
                        </View>

                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => this.setState({ isMale: false })}>
                        <View style={[styles.view_item, { marginTop: 10 }]}>
                            <Image
                                style={styles.img_check}
                                source={isMale ? this.checks[1] : this.checks[0]} />
                            <Text allowFontScaling={global.isScaleFont} style={[styles.txt_male, { color: isMale ? '#C3C3C3' : '#00ABA7', marginRight: 5 }]}>{this.t('female')}</Text>
                        </View>

                    </TouchableOpacity> */}
                    {/* </View> */}

                    <Text allowFontScaling={global.isScaleFont} style={[styles.txt_gender, { marginTop: verticalScale(30) }]}>
                        {this.t('play_level_question')}
                    </Text>
                    <TouchableOpacity onPress={() => this.setState({ isProfession: false })}>
                        <View style={[styles.view_item, { marginTop: verticalScale(10) }]}>
                            <Image
                                style={styles.img_check}
                                source={isProfession ? this.checks[1] : this.checks[0]} />
                            <Text allowFontScaling={global.isScaleFont} style={[styles.txt_male, { color: isProfession ? '#C3C3C3' : '#00ABA7', marginRight: scale(5) }]}>{this.t('is_amateur')}</Text>
                        </View>

                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => this.setState({ isProfession: true })}>
                        <View style={[styles.view_item, { marginTop: verticalScale(10) }]}>
                            <Image
                                style={styles.img_check}
                                source={isProfession ? this.checks[0] : this.checks[1]} />
                            <Text allowFontScaling={global.isScaleFont} style={[styles.txt_male, { color: isProfession ? '#00ABA7' : '#C3C3C3', marginRight: scale(5) }]}>{this.t('is_profession')}</Text>
                        </View>
                    </TouchableOpacity>

                    <View style={styles.view_btn}>
                        <Touchable style={styles.touchable_complete}
                            onPress={this.onCompleteUpdate}>
                            <Text allowFontScaling={global.isScaleFont} style={styles.txt_complete}>
                                {this.t('complete')}
                            </Text>
                        </Touchable>
                    </View>
                </ScrollView>

                {this.renderMessageBar()}
                {this.renderLoading()}
            </KeyboardAvoidingView>
        );
    }

    onBackPress() {
        if (this.props.navigation) {
            this.props.navigation.goBack();
        }
    }

    componentDidMount() {
        this.registerMessageBar();
        if (firebase){
            firebase.analytics().setCurrentScreen('UpdateUserInfoView');
        }
    }

    componentWillUnmount() {
        this.unregisterMessageBar();

    }

    onChangeName(name) {
        this.name = name;
        if (this.state.error_name != '') {
            this.setState({
                error_name: ''
            })
        }
    }

    onCompleteUpdate() {
        if (this.name === '') {
            this.setState({
                error_name: this.t('error_name')
            })
        } else {
            // this.requestUpdateInfo();
            let { isProfession, isMale } = this.state;
            if (this.props.onContinuePress) {
                this.props.onContinuePress({
                    'uid': this.userInfo.getId(),
                    'isProfession': isProfession,
                    'isMale': isMale,
                    'fullName': this.name
                });
            }
        }
    }

    /**
     * 0: nam, 1: nu
     * 0: chuyen nghiep, 1: nghiep du
     */
    requestUpdateInfo() {
        this.loading.showLoading();
        let { isProfession, isMale } = this.state;
        let url = this.getConfig().getBaseUrl() + ApiService.update_info_after_register(this.userInfo.getId(), isProfession ? 1 : 0, isMale ? 0 : 1, this.name);
        let self = this;
        console.log('url', url);
        if (firebase){
            firebase.analytics().logEvent('requestUpdateInfo', {
                'userId': this.userInfo.getId(),
                'name': this.name,
                'isProfession': isProfession,
                'isMale': isMale
            })
        }
        Networking.httpRequestGet(url, (jsonData) => {
            console.log('requestUpdateInfo', jsonData);
            firebase.analytics().logEvent('requestUpdateInfo', {
                'userId': this.userInfo.getId(),
                'name': this.name,
                'response': jsonData.error_code
            })
            if (jsonData.error_code === 0) {
                self.props.navigation.replace('app_screen', { 'phone': this.phone });
                self.getUserInfo().setUserType(3);
                self.saveData(3)
            } else {
                self.loading.hideLoading();
                self.showErrorMsg(jsonData.error_msg);
            }
            self.loading.hideLoading();
        }, () => {
            self.loading.hideLoading();
        });
    }

    saveData(userType) {
        DataManager.saveLocalData(
            [[Constant.USER.USER_TYPE, userType.toString()]], (error) => console.log('saveLocalData', error));
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    text_suggest: {
        color: '#3B3B3B',
        textAlign: 'center',
        fontSize: fontSize(17),
        fontWeight: 'bold'
    },
    view_content: {
    },
    txt_gender: {
        fontSize: fontSize(17, scale(3)),
        color: '#525252'
    },
    view_gender: {
        flexDirection: 'row'
    },
    txt_male: {
        fontSize: fontSize(15, scale(1))
    },
    view_item: {
        flexDirection: 'row'
    },
    img_check: {
        width: verticalScale(25),
        height: verticalScale(25),
        resizeMode: 'contain',
        marginRight: scale(15),
    },
    view_btn: {
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: verticalScale(30)
    },
    touchable_complete: {
        backgroundColor: '#00ABA7',
        minHeight: verticalScale(40),
        borderRadius: verticalScale(20),
        justifyContent: 'center',
        alignItems: 'center',
        minWidth: 100
    },
    txt_complete: {
        color: '#fff',
        fontSize: fontSize(17, scale(3)),
        paddingLeft: scale(30),
        paddingRight: scale(30)
    },
    view_textfield: {
        marginLeft: verticalScale(25),
        marginRight: verticalScale(25)
    },
});