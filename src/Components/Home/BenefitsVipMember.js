import React from 'react';
import {
    Platform,
    StyleSheet,
    Text,
    View,
    BackHandler,
    ScrollView,
    Image,
    Dimensions,
    TouchableOpacity
} from 'react-native';
import Touchable from 'react-native-platform-touchable';
import BaseComponent from '../../Core/View/BaseComponent';
import HeaderView from '../HeaderView';
import Networking from '../../Networking/Networking';
import ApiService from '../../Networking/ApiService';
import { scale, verticalScale, moderateScale, fontSize } from '../../Config/RatioScale';
import AutoScaleLocalImage from '../Common/AutoScaleLocalImage';
import * as RNIap from 'react-native-iap';

const { width, height } = Dimensions.get('window');
const upgradleItem = Platform.select({
    ios: [
        'upgrade.vip.monthly', 'upgrade.vip.yearly',
    ],
    android: [
        'upgrade.vip.monthly', 'upgrade.vip.yearly',
    ],
});

export default class BenefitsVipMember extends BaseComponent {

    static defaultProps = {

    }

    constructor(props) {
        super(props);

        this.isIphoneX = this.getAppUtil().isIphoneX();
        this.isVipMember = global.isVipAccount;
        this.state = {
            productList: [],
            isOnVip: true
        }

        this.onBackPress = this.onBackPress.bind(this);
    }

    renderUpgradleBtn(productList, isOnVip) {
        console.log('renderUpgradleBtn', productList.length, isOnVip)
        if (isOnVip && !this.isVipMember && productList && productList.length > 0) {
            let itemBtn = productList.map((product, index) => {
                console.log('renderUpgradleBtn.product', parseInt(index) % 2)
                return (
                    <TouchableOpacity style={[styles.touchable_btn, { backgroundColor: parseInt(index) % 2 === 0 ? '#00AB4F' : '#DC8400', marginRight: scale(5), marginLeft: scale(5) }]}
                        onPress={this.onBuyItem.bind(this, product.productId)}>
                        <View style={styles.view_btn}>
                            <Text allowFontScaling={global.isScaleFont} style={styles.txt_btn_big}>{`${product.localizedPrice}/${parseInt(index) % 2 === 0 ? this.t('month') : this.t('year')}`}</Text>
                            {/* <Text allowFontScaling={global.isScaleFont} style={styles.txt_btn_normal}>{'Free 7 day trial'}</Text> */}
                        </View>
                    </TouchableOpacity>
                )
            })
            return (
                <View style={styles.view_bottom}>
                    {/* <TouchableOpacity style={[styles.touchable_btn, { backgroundColor: '#00AB4F', marginRight: scale(5) }]}
                        onPress={this.onBuyItem.bind(this, 4.99)}>
                        <View style={styles.view_btn}>
                            <Text allowFontScaling={global.isScaleFont} style={styles.txt_btn_big}>{'$4.99/month'}</Text>
                            <Text allowFontScaling={global.isScaleFont} style={styles.txt_btn_normal}>{'Free 7 day trial'}</Text>
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity style={[styles.touchable_btn, { backgroundColor: '#DC8400', marginLeft: scale(5) }]}
                        onPress={this.onBuyItem.bind(this, 49.99)}>
                        <View style={styles.view_btn}>
                            <Text allowFontScaling={global.isScaleFont} style={styles.txt_btn_big}>{'$49.99/year'}</Text>
                            <Text allowFontScaling={global.isScaleFont} style={styles.txt_btn_normal}>{'Free 30 day trial'}</Text>
                        </View>
                    </TouchableOpacity> */}
                    {itemBtn}
                </View>
            )
        }
        return (
            <TouchableOpacity style={styles.btn_ok}
                onPress={this.onBackPress}>
                <Text allowFontScaling={global.isScaleFont} style={styles.txt_btn_big}>{this.t('ok')}</Text>
            </TouchableOpacity>
        );
    }

    render() {
        let {
            productList,
            isOnVip
        } = this.state;
        return (
            <View style={[styles.container, { paddingBottom: this.isIphoneX ? 15 : 0 }]}>
                <HeaderView
                    title={this.t('benefits_of_vip_member')}
                    handleBackPress={this.onBackPress} />

                <View style={{ flex: 1 }}>
                    <ScrollView style={styles.view_content}>
                        <Text allowFontScaling={global.isScaleFont} style={styles.txt_title}>{this.t('send_scorecard_image')}</Text>
                        {/* <AutoScaleLocalImage
                        uri={this.getResources().ic_banner_scorecard}
                        isResource={true} /> */}
                        <Image
                            style={styles.img_banner}
                            source={this.getResources().ic_banner_scorecard} />

                        <Text allowFontScaling={global.isScaleFont} style={styles.txt_title}>{this.t('booking_facility')}</Text>
                        {/* <AutoScaleLocalImage
                        uri={this.getResources().ic_banner_booking}
                        isResource={true} /> */}
                        <Image
                            style={styles.img_banner}
                            source={this.getResources().ic_banner_booking} />

                        <Text allowFontScaling={global.isScaleFont} style={styles.txt_title}>{this.t('compare_performance_friend')}</Text>
                        {/* <AutoScaleLocalImage
                        uri={this.getResources().ic_banner_compare_performance}
                        isResource={true} /> */}
                        <Image
                            style={styles.img_banner}
                            source={this.getResources().ic_banner_compare_performance} />
                    </ScrollView>
                    {this.renderUpgradleBtn(productList, isOnVip)}

                    {this.renderInternalLoading()}
                </View>
                {this.renderMessageBar()}
            </View>
        );
    }

    onBackPress() {
        if (this.props.navigation) {
            this.props.navigation.goBack();
        }
    }

    componentDidMount() {
        this.rotateToPortrait();
        this.registerMessageBar();
        this.handleHardwareBackPress();

        this.initIAPConnection();
        this.requestCheckOnOffVip();
    }

    componentWillUnmount() {
        this.unregisterMessageBar();
        if (this.backHandler) {
            this.backHandler.remove();
        }
        RNIap.endConnection();
    }

    handleHardwareBackPress() {
        let self = this;
        this.backHandler = BackHandler.addEventListener('hardwareBackPress', function () {
            self.onBackPress();
            return true;
        });
    }

    requestCheckOnOffVip() {
        let url = this.getConfig().getBaseUrl() + ApiService.setting_in_app_purchase();
        let self = this;
        console.log('url : ', url);
        if (this.internalLoading) {
            this.internalLoading.showLoading();
        }
        Networking.httpRequestGet(url, (jsonData) => {
            if (self.internalLoading) {
                self.internalLoading.hideLoading();
            }
            console.log('requestCheckOnOffVip.jsonData', jsonData);
            if (jsonData.error_code === 0) {
                if (jsonData.data === 1) {
                    this.setState({
                        isOnVip: true
                    })
                } else {
                    this.setState({
                        isOnVip: false
                    })
                }
            }
        }, () => {
            if (self.internalLoading) {
                self.internalLoading.hideLoading();
            }
        });
    }

    async initIAPConnection() {
        try {
            const result = await RNIap.initConnection();
            // await RNIap.consumeAllItems();
            console.log('initIAPConnection.upgradleItem', upgradleItem)
            const products = await RNIap.getProducts(upgradleItem);
            console.log('initIAPConnection.result', result, products);
            this.setState({
                productList: products
            })
        } catch (err) {
            console.warn('initIAPConnection.error ', err, err.code, err.message);
        }
    }

    async onBuyItem(productId) {
        console.info('buyItem: ' + productId);
        try {
            let purchase = await RNIap.buyProduct(productId);
            console.info('onBuyItem.purchase: ' + JSON.stringify(purchase));
            if (purchase) {
                if (Platform.OS === 'ios') {
                    this.requestVerifyForIos(purchase);
                } else if (Platform.OS === 'android') {
                    this.requestVerifyForAndroid(purchase);
                }
                if (purchase.purchaseToken)
                    await RNIap.consumePurchase(purchase.purchaseToken);
            }
        } catch (err) {
            console.warn('onBuyItem.error', err);
            this.showErrorMsg(this.t('group_chat_msg_error'))
            if (err.code === 'E_ALREADY_OWNED') {
                const purchases = await RNIap.getAvailablePurchases();
                console.warn('onBuyItem.getAvailablePurchases', purchases);
                this.consumerPurchase(purchases);
            }
            const subscription = RNIap.addAdditionalSuccessPurchaseListenerIOS(async (purchase) => {
                console.info('purchase.subscription: ' + purchase);
                subscription.remove();
            });
        }
    }

    async consumerPurchase(purchases) {
        purchases.forEach(async (purchase) => {
            await RNIap.consumePurchase(purchase.purchaseToken);
        }
        )
    }

    requestVerifyForAndroid(purchase) {
        if (this.internalLoading) {
            this.internalLoading.showLoading();
        }
        let self = this;
        let formData = {
            "receipt_data": purchase.transactionReceipt,
            "transactionDate": purchase.transactionDate,
            "productId": purchase.productId,
            "transaction_id": purchase.transactionId,
            "purchaseToken": purchase.purchaseToken
        }
        let url = this.getConfig().getBaseUrl() + ApiService.verify_iap_vip_android();
        console.log('url', url);
        Networking.httpRequestPost(url, (jsonData) => {
            console.log('requestVerifyForAndroid', jsonData);
            if (self.internalLoading) {
                self.internalLoading.hideLoading();
            }
            if (jsonData.error_code === 0) {
                self.isVipMember = true;
                self.setState({
                    isOnVip: false
                }, () => {
                    try {
                        global.isVipAccount = true;
                        self.getUserInfo().getUserProfile().setAllow_using_scorecard_image(1);
                    } catch (error) {
                    }

                    if (self.props.navigation.state.params.onUpgradeCallback) {
                        self.props.navigation.state.params.onUpgradeCallback(true);
                    }
                })
            } else {
                self.showErrorMsg(`${jsonData.error_msg}`)
            }
        }, formData, () => {
            //time out
            if (self.internalLoading) {
                self.internalLoading.hideLoading();
            }
        });
    }

    requestVerifyForIos(purchase) {
        if (this.internalLoading) {
            this.internalLoading.showLoading();
        }
        let self = this;
        let formData = {
            "receipt_data": purchase.transactionReceipt,
            "transactionDate": purchase.transactionDate,
            "productId": purchase.productId,
            "transaction_id": purchase.transactionId
        }
        let url = this.getConfig().getBaseUrl() + ApiService.verify_iap_vip_ios();
        console.log('url', url);
        Networking.httpRequestPost(url, (jsonData) => {
            console.log('requestVerifyForIos', jsonData);
            if (self.internalLoading) {
                self.internalLoading.hideLoading();
            }
            if (jsonData.error_code === 0) {
                self.isVipMember = true;
                self.setState({
                    isOnVip: false
                }, () => {
                    try {
                        global.isVipAccount = true;
                        self.getUserInfo().getUserProfile().setAllow_using_scorecard_image(1);
                    } catch (error) {
                    }

                    if (self.props.navigation.state.params.onUpgradeCallback) {
                        self.props.navigation.state.params.onUpgradeCallback(true);
                    }
                })
            } else {
                self.showErrorMsg(`${jsonData.error_msg}`)
            }
        }, formData, () => {
            //time out
            if (self.internalLoading) {
                self.internalLoading.hideLoading();
            }
        });
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        flexDirection: 'column'
    },
    view_content: {
        flex: 1,
        padding: scale(10)
    },
    txt_title: {
        fontSize: fontSize(15),
        fontWeight: 'bold',
        color: '#1A1A1A',
        marginTop: scale(10),
        marginBottom: scale(10)
    },
    img_banner: {
        width: width - scale(20),
        height: (width - scale(20)) / 3,
        resizeMode: 'contain'
    },
    view_bottom: {
        flexDirection: 'row',
        width: width,
        padding: scale(10)
    },
    txt_btn_big: {
        fontSize: fontSize(15),
        color: '#fff',
        fontWeight: 'bold',
        paddingTop: scale(8),
        paddingBottom: scale(8)
    },
    txt_btn_normal: {
        fontSize: fontSize(14),
        color: '#fff',
    },
    view_btn: {
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: scale(7),
        paddingBottom: scale(7)
    },
    touchable_btn: {
        flex: 1,
        justifyContent: 'center',
        borderRadius: scale(10)
    },
    btn_ok: {
        backgroundColor: '#00AB4F',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: scale(10),
        height: scale(40),
        marginBottom: scale(15),
        marginLeft: scale(15),
        marginRight: scale(15),
        marginTop: scale(10)
    }
});