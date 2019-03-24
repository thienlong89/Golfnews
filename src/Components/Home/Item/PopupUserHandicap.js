import React from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, Dimensions } from 'react-native';
import Touchable from 'react-native-platform-touchable';
import BaseComponent from '../../../Core/View/BaseComponent';
import PopupDialog, { SlideAnimation } from 'react-native-popup-dialog';
import ApiService from '../../../Networking/ApiService';
import Networking from '../../../Networking/Networking';
import MyView from '../../../Core/View/MyView';
import ItemLoadingView from '../../Common/ItemLoadingView';
import PropsStatic from '../../../Constant/PropsStatic';

import { scale, verticalScale, fontSize } from '../../../Config/RatioScale';
import Clock from './Clock';
let { width, height } = Dimensions.get('window');
let popupWidth = width - scale(40);
const slideAnimation = new SlideAnimation({
    slideFrom: 'bottom',
});

export default class PopupUserHandicap extends BaseComponent {

    static defaultProps = {
        userProfile: null
    }

    constructor(props) {
        super(props);
        //this.handicap_expected = null;
        this.state = {
            userProfile: this.getUserInfo().getUserProfile(),
            isLoading: false
        }

        this.onHandicapIndexDetailClick = this.onHandicapIndexDetailClick.bind(this);
        this.onCertificateClick = this.onCertificateClick.bind(this);
        this.onViewDetaiTimeHandicap = this.onViewDetaiTimeHandicap.bind(this);
        this.onSystemRankingPress = this.onSystemRankingPress.bind(this);
        this.onHdcUsgaPress = this.onHdcUsgaPress.bind(this);
        this.onBenefitsVipPress = this.onBenefitsVipPress.bind(this);
    }

    componentDidMount() {
        // this.sendRequestHandicapExpected();
    }

    setDataChange(userProfile) {
        this.setState({
            userProfile: userProfile
        });
    }

    showItemLoading() {
        if (this.itemLoading) {
            this.itemLoading.showLoading();
        }
    }

    hideItemLoading() {
        if (this.itemLoading) {
            this.itemLoading.hideLoading();
        }
    }

    /**
     * Lấy điểm handicap dự kiến của mình
     */
    sendRequestHandicapExpected() {
        let url = this.getConfig().getBaseUrl() + ApiService.get_handicap_index_expected();
        this.showItemLoading();
        let self = this;
        this.setState({
            isLoading: true
        });
        Networking.httpRequestGet(url, (jsonData) => {
            self.hideItemLoading();
            console.log("handicap expected : ", jsonData);
            if (jsonData.hasOwnProperty('error_code')) {
                let error_code = jsonData['error_code'];
                if (error_code === 0) {
                    let data = jsonData['data'];
                    let handicap_index_expected = data['usga_hc_index_expected'];
                    self.handicap_expected = handicap_index_expected;
                    console.log("ahndicap expected : ", self.handicap_expected);
                    self.setState({
                        isLoading: false
                    });
                } else {
                    self.setState({
                        isLoading: false
                    });
                }
            }
        }, () => {
            self.setState({
                isLoading: false
            });
        });
    }

    /**
     * kich vao điểm handicap tạm tính
     */
    onHandicapIndexDetailClick() {
        let { onViewDetailHandicapIndex } = this.props;
        if (onViewDetailHandicapIndex) {
            onViewDetailHandicapIndex();
        }
    }

    /**
     * kichs vao de xem chi tiet ve tgian thay doi cap
     */
    onViewDetaiTimeHandicap() {
        let { onViewDetaiTimeHandicap } = this.props;
        if (onViewDetaiTimeHandicap) {
            onViewDetaiTimeHandicap();
        }
    }

    onSystemRankingPress() {
        let { onSystemRankingPress } = this.props;
        if (onSystemRankingPress) {
            onSystemRankingPress();
        }
    }

    onHdcUsgaPress() {
        let navigation = PropsStatic.getAppSceneNavigator();
        if (navigation) {
            navigation.navigate('recent_handicap_info_view');
        }
    }

    onBenefitsVipPress() {
        let navigation = PropsStatic.getAppSceneNavigator();
        if (navigation) {
            navigation.navigate('benefits_vip_member');
        }
    }

    elementVipMember(isVip) {
        if (isVip) {
            return (
                <Text allowFontScaling={global.isScaleFont} style={{ marginLeft: scale(20), marginRight: scale(20), marginTop: verticalScale(10), fontSize: fontSize(14, scale(2)), color: '#636363' }}>{this.t('vip_limit').format(new Date())}</Text>
            );
        } else {
            return (
                <Text allowFontScaling={global.isScaleFont} style={{ marginLeft: scale(20), marginRight: scale(20), marginTop: verticalScale(10), fontSize: fontSize(14, scale(2)), color: '#636363' }}>{this.t('not_vip')}
                    <Text allowFontScaling={global.isScaleFont} style={{ fontSize: fontSize(14), color: '#00aba7', textDecorationLine: 'underline' }} 
                        onPress={this.onBenefitsVipPress}>
                        {this.t('upgrade_now')}
                    </Text>
                </Text>
            );
        }
    }

    render() {
        let {
            userProfile,
            isLoading
        } = this.state;

        if (userProfile && Object.keys(userProfile).length > 0) {
            //let user_handicap = userProfile.getUsgaHcIndex() > 0 ? userProfile.getUsgaHcIndex().toString() : '+' + Math.abs(userProfile.getUsgaHcIndex());
            // console.log('this.handicap_expected : ', this.handicap_expected);
            let hdc_tt = (this.handicap_expected !== undefined) ? this.handicap_expected : userProfile.getUsgaHcIndexExpected();
            hdc_tt = hdc_tt >= 0 ? hdc_tt : '+' + Math.abs(hdc_tt);
            // let hdc_usga = userProfile.getMonthlyHandicap() >= 0 ? userProfile.getMonthlyHandicap() : '+' + Math.abs(userProfile.getMonthlyHandicap());
            let hdc_usga = userProfile.getUsgaHcIndex() > 0 ? userProfile.getUsgaHcIndex().toString() : '+' + Math.abs(userProfile.getUsgaHcIndex());

            let rank_top = userProfile.getDisplay_ranking_type();
            let rank_top_value = userProfile.getRanking() > 0 ? userProfile.getRanking() : 'N/A';// '-';
            let system_rank = userProfile.getSystem_ranking() > 0 ? userProfile.getSystem_ranking() : 'N/A';// '-';
            let rank_manner = userProfile.getRanking_manners();

            let isVip = userProfile.getAllow_using_scorecard_image();
            return (
                <PopupDialog
                    ref={(popupDialog) => { this.popupDialog = popupDialog; }}
                    dialogAnimation={slideAnimation}
                    containerStyle={{ minHeight: verticalScale(250) }}
                    dialogStyle={styles.popup_style}>
                    <View style={{ flex: 1, paddingBottom: verticalScale(10) }}>
                        <View style={styles.title_container}>
                            <Text allowFontScaling={global.isScaleFont} style={styles.popup_title_style}>{this.t('info')}</Text>
                            <TouchableOpacity style={styles.touchable_certificate}
                                onPress={this.onCertificateClick}>
                                <Image style={styles.certificate}
                                    source={this.getResources().write_event}
                                />
                            </TouchableOpacity>

                        </View>
                        <View style={styles.line} />

                        <View style={styles.popup_content_group}>
                            <Text allowFontScaling={global.isScaleFont} style={styles.popup_handicap_title}>{this.t('time_change_handicap')}</Text>
                            <Touchable onPress={this.onViewDetaiTimeHandicap}>
                                <View style={{ flexDirection: 'row', alignItems: 'center', padding: scale(3), borderColor: '#4294f7', borderRadius: 3, borderWidth: 1 }}>
                                    <Clock style={{ fontSize: fontSize(14), color: '#4294f7' }} />
                                </View>
                            </Touchable>
                        </View>

                        <View style={styles.popup_content_group}>
                            <Text allowFontScaling={global.isScaleFont} style={styles.popup_handicap_title}>{this.t('hdc_tt')}</Text>

                            <Touchable onPress={this.onHandicapIndexDetailClick}>
                                <MyView hide={isLoading}>
                                    <Text allowFontScaling={global.isScaleFont} style={styles.popup_handicap_index_value}>{hdc_tt}
                                    </Text>
                                </MyView>
                            </Touchable>
                            <ItemLoadingView ref={(itemLoading) => { this.itemLoading = itemLoading; }}
                                right={this.getRatioAspect().scale(15)}
                                top={this.getRatioAspect().verticalScale(5)} />
                        </View>
                        <View style={styles.popup_content_group}>
                            <Text allowFontScaling={global.isScaleFont} style={styles.popup_handicap_title}>{this.t('usga_hc')}</Text>
                            <Text allowFontScaling={global.isScaleFont} style={[styles.popup_handicap_value, { textDecorationLine: 'underline', color: '#00ABA7' }]}
                                onPress={this.onHdcUsgaPress}>
                                {hdc_usga}
                            </Text>
                        </View>
                        <View style={styles.popup_content_group}>
                            <Text allowFontScaling={global.isScaleFont} style={styles.popup_handicap_title}>{rank_top}</Text>
                            <Text allowFontScaling={global.isScaleFont} style={styles.popup_handicap_value}>{rank_top_value}</Text>
                        </View>
                        <View style={styles.popup_system_ranking_group}>
                            <Text allowFontScaling={global.isScaleFont} style={styles.popup_handicap_title}>{this.t('system_ranking_title')}</Text>
                            <Text allowFontScaling={global.isScaleFont} style={styles.popup_handicap_value_system}
                                onPress={this.onSystemRankingPress}>{system_rank}</Text>
                            <Image style={styles.ranking_manner}
                                source={this.getAppUtil().getSourceRankingManner(rank_manner)}
                            />
                        </View>
                        {/* <Image style={{ width: popupWidth - scale(20), height: 2, resizeMode: 'contain', tintColor: '#adadad' }}
                            source={this.getResources().line}
                        /> */}
                        <View style={styles.line} />


                        {this.elementVipMember(isVip)}

                        <Text allowFontScaling={global.isScaleFont}
                            style={{ marginTop: verticalScale(5), marginBottom: verticalScale(10), fontSize: fontSize(15), marginLeft: scale(20), color: '#00aba7', textDecorationLine: 'underline' }}
                            onPress={this.onBenefitsVipPress}>
                            {this.t('benefits_of_vip_member')}
                        </Text>
                    </View>
                </PopupDialog>
            );
        } else {
            return (
                <PopupDialog
                    width={popupWidth}
                    height={verticalScale(350)}
                    ref={(popupDialog) => { this.popupDialog = popupDialog; }}
                    dialogAnimation={slideAnimation}
                    dialogStyle={styles.popup_style}>
                    <View>
                        <View style={styles.title_container}>
                            <Text allowFontScaling={global.isScaleFont} style={styles.popup_title_style}>{this.t('info')}</Text>
                            <TouchableOpacity style={styles.touchable_certificate}
                                onPress={this.onCertificateClick}>
                                <Image style={styles.certificate}
                                    source={this.getResources().write_event}
                                />
                            </TouchableOpacity>

                        </View>
                        <View style={styles.line} />
                        <View style={styles.popup_content_group}>
                            <Text allowFontScaling={global.isScaleFont} style={styles.popup_handicap_title}>{this.t('hdc_tt')}</Text>
                            <Text allowFontScaling={global.isScaleFont} style={styles.popup_handicap_value}>-</Text>
                        </View>
                        <View style={styles.popup_content_group}>
                            <Text allowFontScaling={global.isScaleFont} style={styles.popup_handicap_title}>{this.t('usga_hc')}</Text>
                            <Text allowFontScaling={global.isScaleFont} style={styles.popup_handicap_value}>-</Text>
                        </View>
                        <View style={styles.popup_content_group}>
                            <Text allowFontScaling={global.isScaleFont} style={styles.popup_handicap_title}>-</Text>
                            <Text allowFontScaling={global.isScaleFont} style={styles.popup_handicap_value}>-</Text>
                        </View>
                        <View style={styles.popup_system_ranking_group}>
                            <Text allowFontScaling={global.isScaleFont} style={styles.popup_handicap_title}>{this.t('system_ranking_title')}</Text>
                            <Text allowFontScaling={global.isScaleFont} style={styles.popup_handicap_value_system}>-</Text>
                            <Image style={styles.ranking_manner}
                                source={this.getAppUtil().getSourceRankingManner(-1)}
                            />
                        </View>
                    </View>
                </PopupDialog>
            )
        }

    }

    show() {
        this.popupDialog.show();
        this.sendRequestHandicapExpected();
    }

    onCertificateClick() {
        this.popupDialog.dismiss();
        if (this.props.onCertificateClick) {
            this.props.onCertificateClick();
        }
    }

}

const styles = StyleSheet.create({
    popup_style: {
        width: popupWidth,
        height: verticalScale(300),
        backgroundColor: '#fff'
    },
    title_container: {
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: verticalScale(40)
    },
    popup_title_style: {
        color: '#5B5B5B',
        fontSize: fontSize(18, 2),// 18,
        textAlign: 'center',
        fontWeight: 'bold'
    },
    line: {
        backgroundColor: '#ADADAD',
        height: verticalScale(0.5),
        marginLeft: scale(20),
        marginRight: scale(20),
    },
    popup_content_group: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginLeft: scale(20),
        marginRight: scale(20),
        marginTop: verticalScale(5),
        // marginBottom: verticalScale(5)
    },
    popup_system_ranking_group: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginLeft: scale(20),
        marginTop: verticalScale(5),
        marginBottom: verticalScale(5)
    },
    popup_handicap_title: {
        color: '#5B5B5B',
        fontSize: fontSize(15, 1),// 17,
        textAlign: 'center',
        alignItems: 'center',
        // marginLeft: scale(10),
        // marginRight: scale(10)
    },

    popup_handicap_index_value: {
        color: '#00ABA7',
        fontSize: fontSize(17, 1),// 17,
        fontWeight: 'bold',
        textAlign: 'center',
        alignItems: 'center',
        textDecorationLine: 'underline',
    },

    popup_handicap_value: {
        color: '#333',
        fontSize: fontSize(17, 1),// 17,
        fontWeight: 'bold',
        textAlign: 'center',
        alignItems: 'center'
    },
    popup_handicap_value_system: {
        color: '#333',
        fontSize: fontSize(17, 1),// 17,
        fontWeight: 'bold',
        textAlign: 'center',
        alignItems: 'center',
        marginRight: scale(20),
        color: '#00ABA7',
        textDecorationLine: 'underline',
    },
    ranking_manner: {
        position: 'absolute',
        height: verticalScale(10),
        width: scale(10),
        resizeMode: 'contain',
        right: scale(5),
        bottom: scale(5)
    },
    certificate: {
        width: scale(30),
        height: verticalScale(30),
        resizeMode: 'contain'
    },
    touchable_certificate: {
        position: 'absolute',
        right: scale(20),
    }
});