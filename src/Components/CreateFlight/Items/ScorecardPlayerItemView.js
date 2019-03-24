import React from 'react';
import { Platform, StyleSheet, Text, View, Image, Dimensions } from 'react-native';
import AppUtil from '../../../Config/AppUtil';
import BaseComponent from '../../../Core/View/BaseComponent';
import { scale, verticalScale, fontSize } from '../../../Config/RatioScale';
let { width } = Dimensions.get('window');
import CustomAvatar from '../../Common/CustomAvatar';

export default class ScorecardPlayerItemView extends BaseComponent {

    static defaultProps = {
        player: {},
        playerIndex: 0
    }

    constructor(props) {
        super(props);
    }

    /**
     * Check trang thai điểm của user trong flight
     * submitted => 0 là chưa submit, 1 là đã submit
     * state=>-1 la chua nhap diem,0:pending, 1:là verify, 2 tran hoan thanh, 4 la tu choi
     * @param {*} state 
     */
    checkState(confirmed, submitted, incompliance, user_id) {
        // let submit_state = parseInt(submitted);
        // let stt_user_state = parseInt(stt_user);
        // if((submit_state === 0) && (stt_user_state === 1)) return '';

        if (incompliance === 1) {
            return this.t('cho_nhap_diem');
        } else if (submitted === 1 && confirmed === 0) {
            return this.t('cho_xac_nhan');
        } else if (submitted === 0 && confirmed === 0 && this.getAppUtil().replaceUser(user_id) !== this.getAppUtil().replaceUser(this.getUserInfo().getId())) {
            return this.t('cho_xac_nhan');
        }
    }

    render() {
        let player = this.props.player;
        let user = player.getUser();
        let avatar = user.getAvatar();
        let over = player.getOverDisplay();
        // this.Logger().log('........................................ scorecard item : ', player);
        return (
            <View style={styles.container}>
                <View style={styles.container_tee}>
                    <View style={[styles.course_tee, { backgroundColor: AppUtil.getColorTee(player.getTee()) }]} />
                    <View style={{ flex: 1 }}>
                        <Text allowFontScaling={global.isScaleFont}
                            style={styles.player_name} numberOfLines={1}>
                            {user.getFullName()}
                        </Text>
                    </View>

                </View>
                <View style={styles.container_avatar}>
                    <View style={{ height: verticalScale(55) }}>
                        <CustomAvatar
                            containerStyle={styles.custom_avatar}
                            view_style={styles.custom_avatar}
                            width={verticalScale(55)}
                            height={verticalScale(55)}
                            uri={avatar}
                        />
                        <View style={styles.bg_text_index}>
                            <Text allowFontScaling={global.isScaleFont} style={styles.text_index}>{this.props.playerIndex}</Text>
                        </View>
                    </View>

                    <View style={styles.container_handicap}>
                        <Text allowFontScaling={global.isScaleFont} style={styles.player_id}>
                            {user.getUserId()}
                        </Text>
                        <Text allowFontScaling={global.isScaleFont} style={styles.player_handicap}>
                            {`HDC: ${this.getAppUtil().handicap_display(player.getCoursesHandicapDisplay())}`}
                        </Text>
                        {/* <Text allowFontScaling={global.isScaleFont} style={styles.player_handicap}>{over != '' ? `Over: ${over}` : '-'}</Text> */}
                        <Text allowFontScaling={global.isScaleFont}
                            numberOfLines={1}
                            style={[styles.player_over, { color: over.length ? '#ABABAB' : 'red' }]}>
                            {over != '' ? `Over: ${over}` : this.checkState(player.confirmed, player.submitted, player.incompliance, player.user_id)}
                        </Text>
                    </View>

                </View>

            </View>
        );
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingLeft: 1,
        paddingBottom: 1,
    },
    container_tee: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    course_tee: {
        width: verticalScale(13),
        height: verticalScale(13),
        marginRight: scale(5),
        borderColor: '#919191',
        borderWidth: 0.5
    },
    player_name: {
        color: '#383838',
        fontSize: fontSize(14, -scale(1)),// 14
    },
    container_avatar: {
        flexDirection: 'row'
    },
    custom_avatar: {
        marginLeft: scale(10)
    },
    ic_avatar: {
        height: verticalScale(55),
        width: verticalScale(55)
    },
    container_handicap: {
        justifyContent: 'space-between',
        marginLeft: scale(3),
        // paddingRight : scale(3)
    },
    player_id: {
        color: '#383838',
        fontWeight: 'bold',
        fontSize: fontSize(13, -scale(2)),// 13
    },
    player_handicap: {
        color: '#ABABAB',
        fontSize: fontSize(13, -scale(2)),// 13
    },
    player_over: {
        fontSize: fontSize(12, -scale(2)),// 13
        // width : (width-scale(110))/4,
    },
    bg_text_index: {
        position: 'absolute',
        width: scale(25),
        height: scale(25),
        backgroundColor: '#00ABA7',
        bottom: 0,
        left: 0,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 13,
        borderColor: '#fff',
        borderWidth: 0.5
    },
    text_index: {
        color: '#FFFFFF',
        fontSize: fontSize(17, 1),// 17,
        fontWeight: 'bold'
    }

});