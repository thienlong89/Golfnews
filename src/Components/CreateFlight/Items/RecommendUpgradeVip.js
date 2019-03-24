import React from 'react';
import { Platform, StyleSheet, Text, View, ImageBackground, Image, TouchableOpacity, AsyncStorage } from 'react-native';
import Touchable from 'react-native-platform-touchable';
import BaseComponent from '../../../Core/View/BaseComponent';
import MyView from '../../../Core/View/MyView';
import { scale, verticalScale, fontSize } from '../../../Config/RatioScale';

export default class RecommendUpgradeVip extends BaseComponent {

    static defaultProps = {
        content_msg: '',
        isHideSkip: false
    }

    constructor(props) {
        super(props);
        this.content = this.props.content_msg ? this.props.content_msg : this.t('payment_msg');
        this.state = {
            isSkip: false
        }
    }

    render() {
        return (
            <ImageBackground style={styles.container}
                imageStyle={styles.image_background_style}
                source={this.getResources().ic_popup_vip_bg}>
                <TouchableOpacity style={styles.touchable_close} onPress={this.onClosePopup.bind(this)}>
                    <Image
                        style={styles.icon_remove}
                        source={this.getResources().ic_remove}
                    />
                </TouchableOpacity>

                <Text allowFontScaling={global.isScaleFont} style={styles.txt_content_msg}>{this.content}</Text>

                <View style={styles.view_container}>
                    <Touchable style={styles.touchable_container}
                        onPress={this.onUpgradeVipAccount.bind(this)}>
                        <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', padding: 10 }}>
                            {/* <Image
                                style={styles.ic_crown}
                                source={this.getResources().ic_crown}
                            /> */}
                            <Text allowFontScaling={global.isScaleFont} style={styles.txt_upgrade_vip}>{this.t('upgrade_vip')}</Text>
                        </View>

                    </Touchable>
                </View>

                <MyView hide={this.props.isHideSkip}>
                    <TouchableOpacity onPress={this.onSkipShowPopup.bind(this)}>
                        <View style={styles.skip_view}>
                            <Image
                                style={[styles.ic_check, { tintColor: this.state.isSkip ? '#00ABA7' : '#B8AD78' }]}
                                source={this.getResources().checked_2}
                            />
                            <Text allowFontScaling={global.isScaleFont} style={styles.skip_txt}>{this.t('skip_show')}</Text>
                        </View>
                    </TouchableOpacity>
                </MyView>

            </ImageBackground>
        );
    }

    onUpgradeVipAccount() {
        if (this.props.onUpgradeVipAccount) {
            this.props.onUpgradeVipAccount();
        }
        if (this.state.isSkip) {
            AsyncStorage.setItem('@Upgrade', 'true')
        }
    }

    onClosePopup() {
        if (this.props.onClosePopup) {
            this.props.onClosePopup();
        }
        if (this.state.isSkip) {
            AsyncStorage.setItem('@Upgrade', 'true')
        }
    }

    onSkipShowPopup() {
        this.setState({
            isSkip: !this.state.isSkip
        });
    }

}

const styles = StyleSheet.create({
    container: {
        marginLeft: scale(8),
        marginRight: scale(8),
        tintColor: '#828282',
        paddingTop: verticalScale(10),
        paddingBottom: verticalScale(10)
    },
    image_background_style: {
        resizeMode: 'stretch',
    },
    view_container: {
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: verticalScale(15),
        marginBottom: verticalScale(15)
    },
    touchable_container: {
        backgroundColor: '#3B0CA0',
        borderRadius: verticalScale(5),
        justifyContent: 'center',
        alignItems: 'center'
    },
    txt_upgrade_vip: {
        color: '#FFFFFF',
        fontSize: fontSize(17,scale(3))
    },
    txt_content_msg: {
        color: '#3C3C3C',
        fontSize: fontSize(17,scale(3)),
        marginLeft: scale(30),
        marginRight: scale(30)
    },
    touchable_close: {
        paddingTop: verticalScale(5),
        paddingLeft: scale(5),
        paddingRight: scale(5),
        marginLeft: scale(5),
        marginTop: verticalScale(5)
    },
    icon_remove: {
        height: verticalScale(20),
        width: verticalScale(20),
        resizeMode: 'contain'
    },
    ic_crown: {
        height: verticalScale(25),
        width: verticalScale(25),
        resizeMode: 'contain',
        marginRight: scale(10)
    },
    skip_view: {
        flexDirection: 'row',
        marginLeft: scale(15),
        marginBottom: verticalScale(10),
        alignItems: 'center'
    },
    skip_txt: {
        color: '#9A8F5B',
        fontSize: fontSize(15,scale(1)),
        marginLeft: scale(10)
    },
    ic_check: {
        height: verticalScale(23),
        width:  verticalScale(23),
        resizeMode: 'contain'
    },
});