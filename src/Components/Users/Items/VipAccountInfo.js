import React, { PureComponent } from 'react';
import {
    Platform,
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
} from 'react-native';
import Touchable from 'react-native-platform-touchable';
import BaseComponent from '../../../Core/View/BaseComponent';
import TimerMixin from 'react-timer-mixin';
import { scale, verticalScale, moderateScale, fontSize } from '../../../Config/RatioScale';
import moment from 'moment';

export default class VipAccountInfo extends BaseComponent {

    static defaultProps = {
        userProfile: ''
    }

    constructor(props) {
        super(props);
        this.userProfile = this.props.userProfile;
        this.isVipAccount = this.userProfile ? this.userProfile.getAllow_using_scorecard_image() === 1 ? true : false : false;
        this.expertVipTimestamp = this.userProfile && this.userProfile.getExpertDateVip() ? this.userProfile.getExpertDateVip() : 0;
        this.intervalTimestamp = this.expertVipTimestamp - (new Date()).getTime();
        this.expertCount = 0;
        this.intervalId;
        this.state = {
            displayTime: this.getAppUtil().getFormattedTime(this.timestamp),
        }
        this.onUpgradeVipAccount = this.onUpgradeVipAccount.bind(this);
        this.onBenefitsVipPress = this.onBenefitsVipPress.bind(this);
    }

    render() {
        let {
            displayTime
        } = this.state;
        if (!this.isVipAccount && !this.expertVipTimestamp) {
            return (
                <View style={styles.container}>
                    <Text allowFontScaling={global.isScaleFont} style={styles.txt_vip_free}>{this.t('out_of_date_vip_free')}</Text>
                    <Text allowFontScaling={global.isScaleFont} style={styles.txt_view_benefit}
                        onPress={this.onBenefitsVipPress}>{this.t('vip_account_benefit')}</Text>
                    <TouchableOpacity style={styles.touchable_upgrade}
                        onPress={this.onUpgradeVipAccount}>
                        <Text allowFontScaling={global.isScaleFont} style={styles.txt_upgrade_vip_vgs}>{this.t('upgrade_vip_vgs')}</Text>
                    </TouchableOpacity>
                </View>
            );
        } else if (this.isVipAccount && this.intervalTimestamp > 0) {
            let expertDate = moment(this.expertVipTimestamp).format("DD/MM/YYYY");
            return (
                <View style={styles.container}>
                    <Text allowFontScaling={global.isScaleFont} style={styles.txt_already_vip_account}>{this.t('already_vip_account').format(expertDate)}</Text>
                    <Text allowFontScaling={global.isScaleFont} style={styles.txt_countdown}>{displayTime}</Text>
                </View>
            );
        } else if (!this.isVipAccount && this.expertVipTimestamp) {
            let expertCount = Math.round(Math.abs(this.intervalTimestamp) / (24 * 60 * 60 * 1000));
            return (
                <View style={styles.container}>
                    <Text allowFontScaling={global.isScaleFont} style={styles.txt_vip_free}>{this.t('vip_account_expert').format(expertCount)}</Text>
                    <TouchableOpacity style={styles.touchable_upgrade}
                        onPress={this.onUpgradeVipAccount}>
                        <Text allowFontScaling={global.isScaleFont} style={styles.txt_upgrade_vip_vgs}>{this.t('vip_renew')}</Text>
                    </TouchableOpacity>
                </View>
            );
        } else {
            return null;
        }

    }

    componentDidMount() {
        this.startCountDown();
    }

    componentWillUnmount() {
        if (this.intervalId)
            TimerMixin.clearInterval(this.intervalId);
    }

    startCountDown() {
        this.setState({
            displayTime: this.getAppUtil().getFormattedTime(this.intervalTimestamp),
        }, () => {
            this.intervalId = TimerMixin.setInterval.call(this, () => {
                this.updateData()
            }, 1000);
        })

    }

    updateData() {
        this.intervalTimestamp--;
        this.setState({
            displayTime: this.getAppUtil().getFormattedTime(this.intervalTimestamp),
        }, () => {
            if (this.intervalTimestamp <= 0) {
                this.stopCountDown();
            }
        });
    }

    stopCountDown() {
        TimerMixin.clearInterval(this.intervalId);
    }

    onUpgradeVipAccount() {
        if (this.props.navigation) {
            this.props.navigation.navigate('benefits_vip_member',
                {
                    onUpgradeCallback: this.onUpgradeSuccess.bind(this),
                });
        }
    }

    onBenefitsVipPress() {
        if (this.props.navigation) {
            this.props.navigation.navigate('benefits_vip_member', {})
        }
    }

    onUpgradeSuccess(isSuccess = false) {
        if (isSuccess) {
            this.isVipAccount = true;
            this.setState({})
        }

    }
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'column',
        backgroundColor: '#fff',
        marginTop: verticalScale(20),
        marginBottom: verticalScale(10),
        marginLeft: scale(10),
        marginRight: scale(10),
        // borderColor: 'rgba(0, 0, 0, 0.3)',
        borderRadius: scale(10),
        // borderWidth: scale(1),
        paddingBottom: scale(10),
        shadowColor: 'rgba(0, 0, 0, 0.3)',
        shadowOffset: {
            width: 0,
            height: 5
        },
        shadowRadius: scale(10),
        shadowOpacity: 1.0,
        elevation: 1,
        padding: scale(10),
        minHeight: scale(100),
        justifyContent: 'space-between'
    },
    txt_vip_free: {
        color: 'red',
        fontSize: fontSize(16, scale(4))
    },
    txt_upgrade_vip_vgs: {
        fontSize: fontSize(18, scale(4)),
        color: '#fff'
    },
    touchable_upgrade: {
        backgroundColor: '#00ABA7',
        borderRadius: scale(5),
        minHeight: scale(45),
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: scale(10)
    },
    txt_view_benefit: {
        color: '#00ABA7',
        fontSize: fontSize(16, scale(4)),
        textDecorationLine: 'underline'
    },
    txt_already_vip_account: {
        color: '#454545',
        fontSize: fontSize(16, scale(4))
    },
    txt_countdown: {
        color: '#454545',
        fontSize: fontSize(25, scale(5)),
        textAlign: 'center',
        marginBottom: scale(5),
        fontWeight: 'bold'
    }
});