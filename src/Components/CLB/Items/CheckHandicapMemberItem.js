import React from 'react';
import {
    Text,
    View,
    TouchableOpacity,
    Image
} from 'react-native';
import BaseComponent from '../../../Core/View/BaseComponent';
import HideShowView from '../../../Core/View/MyView';
import Touchable from 'react-native-platform-touchable';
import AppUtil from '../../../Config/AppUtil';
import styles from '../../../Styles/Friends/Items/StyleFriendItem';
import { Avatar } from 'react-native-elements';
import TeeView from '../../Common/TeeView';
import FastImage from 'react-native-fast-image';
import CustomAvatar from '../../Common/CustomAvatar';


export default class CheckHandicapMemberItem extends BaseComponent {

    static defaultProps = {
        data: '',
        index: 0
    }

    constructor(props) {
        super(props);

        this.state = {
        }

        this.onRemoveItem = this.onRemoveItem.bind(this);
        this.onChangeTee = this.onChangeTee.bind(this);
    }



    onChangeTee() {
        let { data, onChangeTeePress, index } = this.props;
        if (onChangeTeePress && data) {
            onChangeTeePress(data, index);
        }
    }

    /**
     * render lai item khi check cap
     */
    reRender() {
        console.log('reRender')
        this.setState({});
    }


    render() {
        let { data } = this.props;
        if (!data) return null;

        let player = data.Users;
        if (!player) return null;

        let memberClubId = player.getEhandicapMemberId();
        let userId = player.getUserId();
        let avatar = player.getAvatar();
        let fullname = player.getFullName();
        let default_tee_id = player.getDefaultTeeID();
        let handicap = player.getUsgaHcIndex();
        let teeObject = data.displayTee ? data.displayTee : { name: player.getDefaultTeeID(), color: player.getDefaultTeeID() };
        let facility_handicap = data.course_index;
        console.log('data.displayTee ', facility_handicap)

        return (
            <View style={[styles.container, { backgroundColor: this.props.me ? '#e7ebf4' : "#fff" }]}>
                <CustomAvatar
                    view_style={styles.view_style}
                    containerStyle={styles.avatar_image}
                    avatarStyle={styles.avatar_style}
                    uri={avatar}
                    width={this.getRatioAspect().scale(60)}
                    height={this.getRatioAspect().scale(60)}
                />

                <View style={styles.container_content_view}>
                    <Text allowFontScaling={global.isScaleFont} style={styles.fullname_text}>{fullname}</Text>
                    <Text allowFontScaling={global.isScaleFont} style={styles.user_id_text}>{this.showUserId(memberClubId, userId)}</Text>
                    <Text allowFontScaling={global.isScaleFont} style={styles.handicap_text}>{this.t('hdc')}: {this.getAppUtil().handicap_display(handicap)}</Text>
                </View>

                <Touchable onPress={this.onChangeTee}
                    style={styles.touchable_tee_view}>
                    <TeeView
                        ref={(refTeeView) => { this.refTeeView = refTeeView }}
                        teeObject={teeObject}
                    />
                </Touchable>

                <View style={styles.container_content_bottom}>
                    <View style={[styles.handicap_facility_view, { borderColor: facility_handicap !== undefined && facility_handicap !== '' ? '#00aba7' : 'rgba(0,0,0,0)' }]}>
                        <Text allowFontScaling={global.isScaleFont} style={styles.handicap_facility_text}>{this.getAppUtil().handicap_display(facility_handicap)}</Text>
                    </View>
                </View>
                {/* </View> */}
            </View>
        );
    }

    showUserId(eHandicap_member_id, userId) {
        return (eHandicap_member_id && eHandicap_member_id.length) ? userId + '-' + eHandicap_member_id : userId;
    }

    onRemoveItem() {
        if (this.props.onRemoveItemClick != null) {
            this.props.onRemoveItemClick();
        }
    }

}