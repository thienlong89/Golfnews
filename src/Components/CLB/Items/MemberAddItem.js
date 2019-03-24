import React from 'react';
import {
    Platform,
    StyleSheet,
    Text,
    View,
    Image
} from 'react-native';
import Touchable from 'react-native-platform-touchable';
import BaseComponent from '../../../Core/View/BaseComponent';
import CustomAvatar from '../../Common/CustomAvatar';
import MyView from '../../../Core/View/MyView';
import {scale,verticalScale,fontSize} from '../../../Config/RatioScale';

const STATUS = {
    NORMAL: -1,
    IS_MEMBER: 0,
    SENT_INVITE: 1
}

export default class MemberAddItem extends BaseComponent {

    static defaultProps = {
        player: {}
    }

    constructor(props) {
        super(props);
        let { player } = this.props;
        this.state = {
            isSelected: false
        }
    }

    render() {
        let { isSelected } = this.state;
        let { player } = this.props;

        let fullName = player.getFullname() || '';
        let handicap = player.getHandicap() || '';
        let userId = player.getUserId() || '';
        let ehandicapClub = player.getMemberId() || '';
        let memberStatus = player.getClubMember().is_accepted === undefined ? -1 : player.getClubMember().is_accepted;
        let isModelSelected = player.isSelected || false;
        memberStatus = player.IsGroupMember() ? 1 : memberStatus;
        
        return (
            <Touchable onPress={this.onMemberItemPress.bind(this, memberStatus, isModelSelected)}>

                <View style={styles.container}>

                    <View style={styles.view_img}>
                        <Image style={styles.img_check}
                            source={this.getSourceStatus(memberStatus, isModelSelected)} />
                    </View>


                    <View style={styles.view_content}>
                        <View style={styles.view_center}>
                            <CustomAvatar
                                containerStyle={styles.avatar_image}
                                uri={player.getAvatar()}
                                width={verticalScale(60)}
                                height={verticalScale(60)}
                            />
                            <View style={styles.content}>
                                <Text allowFontScaling={global.isScaleFont} style={styles.fullname_text}>{fullName}</Text>
                                <Text allowFontScaling={global.isScaleFont} style={{ fontSize: fontSize(13,-scale(1)), color: '#adadad' }}>
                                    {this.showUserId(userId, ehandicapClub)}
                                </Text>
                                <Text allowFontScaling={global.isScaleFont} style={{ fontSize: fontSize(13,-scale(1)), color: '#adadad' }}>
                                    {this.t('hdc')}: {this.getAppUtil().handicap_display(handicap)}
                                </Text>

                                <MyView hide={memberStatus === -1}>
                                    <Text allowFontScaling={global.isScaleFont} style={styles.txt_status}>{memberStatus === 1 ? this.t('already_member') : this.t('waiting_for_accept')}</Text>
                                </MyView>

                            </View>

                            {/* <MyView style={styles.view_cancel_invite}
                                hide={memberStatus != 0}>
                                <Touchable style={{ justifyContent: 'center', alignItems: 'center' }}
                                    onPress={this.onRequestRemoveInvite.bind(this)}>
                                    <Text allowFontScaling={global.isScaleFont} style={styles.txt_cancel_invite}>{this.t('cancel_invite')}</Text>
                                </Touchable>
                            </MyView> */}
                        </View>

                        <View style={styles.view_line_space} />
                    </View>

                </View>
            </Touchable>
        );
    }

    getSourceStatus(memberStatus, isSelected) {
        if (memberStatus === 1 || memberStatus === 0) {
            return null;
        }
        return isSelected ? this.getResources().btn_selected : this.getResources().btn_normal
    }

    showUserId(userId, eHandicap_member_id) {
        return (eHandicap_member_id && eHandicap_member_id.length) ? userId + '-' + eHandicap_member_id : userId;
    }

    onMemberItemPress(memberStatus, isModelSelected) {
        if (memberStatus != 0 && memberStatus != 1) {
            this.props.player.isSelected = !isModelSelected;
            this.setState({
                isSelected: !this.state.isSelected
            }, () => {
                if (this.props.onMemberItemPress) {
                    this.props.onMemberItemPress(!isModelSelected);
                }
            })
        }
    }

    onRequestRemoveInvite() {

    }

}

const styles = StyleSheet.create({
    container: {
        minHeight: verticalScale(80),
        flexDirection: 'row',
        alignItems: 'center'
    },

    view_content: {
        flex: 1,
        alignItems: 'center'
    },
    view_img: {
        width: verticalScale(23),
        height: verticalScale(23),
        marginLeft: scale(10),
        marginRight: scale(10)
    },
    img_check: {
        width: verticalScale(23),
        height: verticalScale(23),
        resizeMode: 'contain'
    },
    avatar_image: {
        resizeMode: 'contain',
        minHeight: verticalScale(50),
        minWidth: verticalScale(50)
    },

    content: {
        flex: 1,
        justifyContent: 'center',
        marginLeft: scale(10)
    },

    fullname_text: {
        fontSize: fontSize(15,scale(1)),
        color: '#000',
        fontWeight: 'bold'
    },
    view_center: {
        flexDirection: 'row',
        flex: 1,
        alignItems: 'center'
    },
    view_cancel_invite: {
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: scale(10),
        borderColor: '#B3B3B3',
        borderWidth: 1,
        borderRadius: verticalScale(4)
    },
    view_line_space: {
        height: 1,
        backgroundColor: '#D6D4D4',
    },
    txt_status: {
        color: '#00ABA7',
        fontSize: fontSize(13,-scale(1))
    },
    txt_cancel_invite: {
        fontSize: fontSize(13,-scale(1)),
        color: '#5E5E5E',
        paddingLeft: scale(5),
        paddingRight: scale(5),
        paddingTop: verticalScale(5),
        paddingBottom: verticalScale(5)
    }
});