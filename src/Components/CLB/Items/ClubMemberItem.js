import React from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    Image
} from 'react-native';
import BaseComponent from '../../../Core/View/BaseComponent';
import Touchable from 'react-native-platform-touchable';
import AppUtil from '../../../Config/AppUtil';
import CustomAvatar from '../../Common/CustomAvatar';
import PropsStatic from '../../../Constant/PropsStatic';
import { scale, fontSize } from '../../../Config/RatioScale';


export default class ClubMemberItem extends BaseComponent {

    constructor(props) {
        super(props);
        this.state = {
        }
        this.onUserClick = this.onUserClick.bind(this);
    }

    static defaultProps = {
        member: {}
    }

    /**
     * xem chi tiet user
     */
    onUserClick() {
        let { member } = this.props;
        let userId = member.getUserId() || '';
        let navigation = PropsStatic.getAppSceneNavigator();
        if (navigation) {
            navigation.navigate('player_info', { "puid": userId });
        }
    }

    renderOverLay(isAccepted) {
        console.log('isAccepted', isAccepted)
        if (isAccepted) return null;
        return (
            <View style={[styles.view_overlay, { backgroundColor: '#fff', opacity: 0.5 }]} />

        )
    }

    renderTextOverLay(isAccepted) {
        console.log('isAccepted', isAccepted)
        if (isAccepted) return null;
        return (
            <View style={[styles.view_overlay, { justifyContent: 'center', marginRight: scale(10) }]}>
                <Text allowFontScaling={global.isScaleFont} style={styles.txt_waiting_for_confirm}>{this.t('cho_xac_nhan')}</Text>
            </View>

        )
    }

    render() {
        let { member } = this.props;
        let fullName = member.getFullName() || '';
        let handicap = member.getUsgaHcIndex() || '';
        let userId = member.getUserId() || '';
        let ehandicapClub = member.getEhandicapMemberId() || '';
        let isAccepted = member.is_accepted || member.is_accepted_permission || !member.invented_permission_type;

        return (
            // <Touchable onPress={this.onUserClick}>
            <View>
                <View style={[styles.container]}>
                    <View style={styles.avatar_view}>
                        <CustomAvatar
                            containerStyle={styles.avatar_image}
                            uri={member.getAvatar()}
                            width={60}
                            height={60}
                        />
                    </View>

                    <View style={styles.view_center}>
                        <Text allowFontScaling={global.isScaleFont} style={styles.fullname_text}>{fullName}</Text>
                        <Text allowFontScaling={global.isScaleFont} style={styles.user_id_text}>{this.showUserId(userId, ehandicapClub)}</Text>
                        <Text allowFontScaling={global.isScaleFont} style={styles.handicap_text}>
                            {this.t('hdc')}: {this.getAppUtil().handicap_display(handicap)}
                        </Text>

                    </View>

                </View>
                <View style={styles.line} />
                {this.renderOverLay(isAccepted)}
                {this.renderTextOverLay(isAccepted)}
            </View>
            // </Touchable>
        );
    }

    showUserId(userId, eHandicap_member_id) {
        return (eHandicap_member_id && eHandicap_member_id.length) ? userId + '-' + eHandicap_member_id : userId;
    }

}

const styles = StyleSheet.create({
    container: {
        //flex: 1, 
        flexDirection: 'row',
        paddingTop: 5,
        paddingBottom: 5,
        minHeight: 70,
        backgroundColor: '#fff'
    },
    avatar_view: {
        //flex: 1,
        width: 50,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 5,
        marginBottom: 5,
        marginLeft: 15,
        marginRight: 10
    },

    avatar_image: {
        resizeMode: 'contain',
        minHeight: 50,
        minWidth: 50
    },

    fullname_text: {
        flex: 1,
        fontWeight: 'bold'
    },

    user_id_text: {
        flex: 1,
        color: '#adadad'
    },

    handicap_text: {
        flex: 1,
        color: '#adadad'
    },
    view_center: {
        flex: 1,
        justifyContent: 'space-between',
    },
    view_right: {
        justifyContent: 'center',
        alignItems: 'center',
        paddingRight: 10
    },
    img_icon: {
        width: 30,
        height: 30,
        resizeMode: 'contain',
        padding: 10
    },
    line: {
        height: 1,
        backgroundColor: '#DADADA',
        marginLeft: scale(10),
        marginRight: scale(10)
    },
    view_overlay: {
        minHeight: 70,
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0
    },
    txt_waiting_for_confirm: {
        color: 'red',
        fontSize: fontSize(15),
        textAlign: 'right'
    },
});