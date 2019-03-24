/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React from 'react';
import {
    Platform,
    StyleSheet,
    Text,
    View,
    Dimensions,
    Alert,
    Image,
    TouchableOpacity,
    BackHandler,
    Modal
} from 'react-native';
import Touchable from 'react-native-platform-touchable';
import BaseComponent from '../../Core/View/BaseComponent';
import HeaderView from '../HeaderView';
import PopupView from '../Popups/PopupNotificationView';
import ApiService from '../../Networking/ApiService';
import Networking from '../../Networking/Networking';
import CustomLoading from '../Common/CustomLoadingView';
import UserProfileModel from '../../Model/Home/UserProfileModel';
import MyView from '../../Core/View/MyView';
import { scale, verticalScale, fontSize } from '../../Config/RatioScale';
let { width, height } = Dimensions.get('window');

//const TAG = "[Vhandicap-v1] PaymentView : ";

import { Constants } from '../../Core/Common/ExpoUtils';
import Tips from 'react-native-tips';

//console.log("constant status bar : ", Constants.statusBarHeight);

export default class PaymentView extends BaseComponent {

    constructor(props) {
        super(props);
        this.offsetTop = (Platform.OS === 'ios') ? 0 : Constants.statusBarHeight;
        console.log('PaymentView', this.offsetTop);
        this.state = {
            isUpgradeTut: global.isUpgradeTut,
            modalPosition: 0,
            isVip: false,
            isCheckVip: true,
        }

        this.backHandler = null;
        this.onBackClick = this.onBackClick.bind(this);
    }

    onBackClick() {
        let { navigation } = this.props;
        if (navigation) {
            let { params } = navigation.state;
            if (params && params.onUpgradeSuccess) {
                params.onUpgradeSuccess(this.state.isVip);
            }
            navigation.goBack();
        }
        return true;
    }

    componentDidMount() {
        //this.popup.setMsg(this.t('payment_confirm'));
        this.backHandler = BackHandler.addEventListener('hardwareBackPress', this.onBackClick);
        this.sendRequestCheckAccountVip();
    }

    /**
     * gửi lại yêu cầu check tài khoản VIP
     */
    sendRequestCheckAccountVip() {
        let url = this.getConfig().getBaseUrl() + ApiService.user_profile();
        let self = this;
        this.customLoading.setVisible(true);
        Networking.httpRequestGet(url, (jsonData) => {
            //console.log("check vip : ",jsonData);
            self.customLoading.setVisible(false);
            self.model = new UserProfileModel(self);
            self.model.parseUserData(jsonData);
            if (self.model.getErrorCode() === 0) {
                let vip = parseInt(self.model.getAllow_using_scorecard_image());
                if (vip === 1) {
                    self.getUserInfo().getUserProfile().setAllow_using_scorecard_image(vip);
                    self.setState({
                        isVip: true,
                        isCheckVip: false
                    });
                } else {
                    self.setState({
                        isVip: false,
                        isCheckVip: false
                    });
                }
            }
        }, () => {
            self.customLoading.setVisible(false);
        });
    }

    render() {
        let { isVip } = this.state;
        return (
            <View style={styles.container}>
                <HeaderView ref={(headerView) => { this.headerView = headerView; }}
                    title={this.t('nang_cap_tai_khoan_vip')}
                    handleBackPress={this.onBackClick} />

                <Text allowFontScaling={global.isScaleFont} style={styles.lable_text}>{this.t('payment_msg')}</Text>
                <Touchable style={styles.touchable_style}>
                    <View style={styles.item_view}>
                        <Image
                            style={styles.icon_img}
                            source={this.getResources().camera_2}
                        />
                        <Text allowFontScaling={global.isScaleFont} style={styles.item_text}>{this.t('payment_b1')}</Text>
                    </View>
                </Touchable>
                <Touchable style={styles.touchable_style}>
                    <View style={styles.item_view}>
                        <Image
                            style={styles.icon_img}
                            source={this.getResources().cskh}
                        />
                        <Text allowFontScaling={global.isScaleFont} style={styles.item_text}>{this.t('payment_b2')}</Text>
                    </View>
                </Touchable>
                <Touchable style={styles.touchable_style}>
                    <View style={styles.item_view}>
                        <Image
                            style={styles.icon_img}
                            source={this.getResources().checked_2}
                        />
                        <Text allowFontScaling={global.isScaleFont} style={styles.item_text}>{this.t('payment_b3')}</Text>
                    </View>
                </Touchable>

                <MyView style={styles.view_upgrade} hide={(this.state.isVip || this.state.isCheckVip)}
                    onLayout={this.handleTooltipLayout.bind(this)}>

                    <TouchableOpacity onPress={this.handleSubmitPayment.bind(this)}>
                        <Image
                            style={styles.submit_img}
                            source={this.getResources().submit_payment}
                        />
                    </TouchableOpacity>

                </MyView>

                <Modal
                    visible={this.state.isUpgradeTut}
                    animationType="fade"
                    transparent>

                    <View style={[styles.modal_view_upgrade, { paddingTop: this.state.modalPosition }]}>

                        <TouchableOpacity onPress={this.handleSubmitPayment.bind(this)}>
                            <Image
                                style={styles.submit_img}
                                source={this.getResources().submit_payment}
                            />
                        </TouchableOpacity>

                        <Text allowFontScaling={global.isScaleFont} style={[styles.submit_notify, { color: '#FFFFFF', backgroundColor: '#000', padding: scale(5), fontSize: fontSize(14) }]}>{this.t('nang_cap_tai_khoan_vip')}</Text>

                    </View>
                </Modal>
                <Text allowFontScaling={global.isScaleFont} style={[styles.submit_notify, { marginTop: isVip ? verticalScale(30) : verticalScale(10), fontSize: isVip ? fontSize(22, 8) : fontSize(14), color: isVip ? '#00aba7' : '#424242' }]}>{(this.state.isVip) ? this.t('is_vip') : (this.isCheckVip ? '' : this.t('nang_cap_tai_khoan_vip'))}</Text>
                <PopupView ref={(popup) => { this.popup = popup; }} />
                <CustomLoading ref={(customLoading) => { this.customLoading = customLoading; }} />
            </View>
        );
    }

    /**
     * Update lên tài khoản VIP
     */
    sendRequestUpgrade() {
        let url = this.getConfig().getBaseUrl() + ApiService.user_update_profile();
        this.customLoading.setVisible(true);
        let self = this;
        Networking.httpRequestPost(url, (jsonData) => {
            self.customLoading.setVisible(false);
            //console.log("payment : ", jsonData);
            if (jsonData.hasOwnProperty('error_code')) {
                let error_code = parseInt(jsonData['error_code']);
                if (error_code === 0) {

                    self.setState({
                        isVip: true,
                        isCheckVip: false
                    }, () => {
                        self.popup.okCallback = self.onBackClick.bind(this);
                        //self.popup.setMsg(self.t('upgrade_vip_msg'));
                        self.popup.setMsg(jsonData['error_msg']);
                        self.getUserInfo().getUserProfile().setAllow_using_scorecard_image(1);
                    });
                } else {
                    self.popup.okCallback = null;
                    self.popup.setMsg(jsonData['error_msg']);
                }
            }
        }, { 'allow_using_scorecard_image': 1 }, () => {
            self.customLoading.setVisible(false);
        });
    }

    handleTooltipLayout(event) {
        const { x, y, width, height } = event.nativeEvent.layout
        if (global.isUpgradeTut) {
            this.setState({
                modalPosition: y - this.offsetTop
            })
        }
    }

    handleSubmitPayment() {
        if (this.state.isVip) return;
        global.isUpgradeTut = false;
        this.sendRequestUpgrade();
        this.setState({
            isUpgradeTut: false
        })
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5FCFF',
    },

    submit_img: {
        width: verticalScale(80),
        height: verticalScale(80),
        resizeMode: 'contain'
    },

    submit_notify: {
        // marginTop: 10,
        // fontSize: 14,
        alignSelf: 'center',
        textAlignVertical: 'center',
    },

    lable_text: {
        //height: 50,
        fontSize: fontSize(16, scale(2)),// 16,
        color: '#424242',
        margin: scale(10)
    },

    icon_img: {
        alignSelf: 'center',
        width: verticalScale(24),
        height: verticalScale(24),
        resizeMode: 'contain',
        marginLeft: scale(10)
    },

    item_text: {
        flex: 1,
        fontSize: fontSize(14),// 14,
        color: '#424242',
        marginLeft: scale(10),
        marginRight: scale(5)
    },
    touchable_style: {
        height: verticalScale(50),
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: verticalScale(15),
        marginLeft: scale(30),
        marginRight: scale(30),
        borderColor: '#00aba7',
        borderWidth: 1,
        borderRadius: 3
    },
    item_view: {
        flexDirection: 'row',
    },
    view_upgrade: {
        marginTop: verticalScale(40),
        justifyContent: 'center',
        alignItems: 'center',
    },
    modal_view_upgrade: {
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.6)',
        flex: 1
    }
});