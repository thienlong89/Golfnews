import React from 'react';
import { Text, View } from 'react-native';
import BaseComponent from '../../../Core/View/BaseComponent';
import HideShowView from '../../../Core/View/MyView';
import Touchable from 'react-native-platform-touchable';
import styles from '../../../Styles/Group/StyleGroupItem';
import { Avatar } from 'react-native-elements';

export default class PlayerSearchItem extends BaseComponent {
    constructor(props) {
        super(props);
        this.state = {

        }
    }

    static defaultProps = {
        data: {}
    }

    render() {
        let { data } = this.props;
        return (
            <View style={styles.container}>
                <View style={styles.container_avatar}>
                    <Avatar
                        width={50}
                        height={50}
                        rounded={true}
                        source={(data.avatar && data.avatar.length ? { uri: data.avatar } : this.getResources().avatar_default)}
                    />
                </View>
                <View style={styles.container_body}>
                    <Text allowFontScaling={global.isScaleFont} style={styles.text_body_fullname}>{data.fullname}</Text>
                    <Text allowFontScaling={global.isScaleFont} style={styles.text_body_userid}>{this.showUserId()}</Text>
                    <Text allowFontScaling={global.isScaleFont} style={styles.text_body_hdc}>{this.t('handicap_title')}: {this.getAppUtil().handicap_display(data.handicap)}</Text>
                </View>
                <HideShowView hide={data.facility_handicap ? false : true}>
                    <View style={styles.handicap_facility_view}>
                        <Text allowFontScaling={global.isScaleFont} style={styles.handicap_facility_text}>{this.getAppUtil().handicap_display(data.facility_handicap)}</Text>
                    </View>
                </HideShowView>

            </View >
        );
    }

    showUserId() {
        return (this.props.data.eHandicap_member_id && this.props.data.eHandicap_member_id.length) ? this.props.data.userId + '-' + this.props.data.eHandicap_member_id : this.props.data.userId;
    }
}