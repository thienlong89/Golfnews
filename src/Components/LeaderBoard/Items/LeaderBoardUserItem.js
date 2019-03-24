import React from 'react';
import { Text, View, Image } from 'react-native';
import BaseComponent from '../../../Core/View/BaseComponent';
// import Touchable from 'react-native-platform-touchable';
import styles from '../../../Styles/LeaderBoard/Items/StyleLeaderBoardUserItem';
import AppUtil from '../../../Config/AppUtil';
import {scale, verticalScale} from '../../../Config/RatioScale';
import { Avatar } from 'react-native-elements';

export default class LeaderBoardUserItem extends BaseComponent {
    constructor(props) {
        super(props);
    }

    static defaultProps = {
        userName: '',
        userId: '',
        eHandicap_member_id: '',
        fullname: '',
        avatar: '',
        handicap: '',
        facility_handicap: '',
        ranking: '',
        system_ranking: '',
        system_manners: '',
    }

    checkUriAvatar(avatar) {
        return avatar.replace('null', '').replace('NULL', '').replace('Null', '').trim();
    }

    showUserId() {
        let { userId, eHandicap_member_id } = this.props.data;
        return (this.props.eHandicap_member_id && this.props.eHandicap_member_id.length) ? userId + '-' + eHandicap_member_id : userId;
    }

    // shouldComponentUpdate(nextProps, nextState){
    //     return false;//nextProps.data.userId !== this.props.data.userId;
    // }

    render() {
        
        let { avatar, ranking, fullname, handicap, system_ranking, system_manners, country_img, userId } = this.props.data;
        ranking = ranking ? ranking : '';
        // console.log("country image -------------- ", country_img);
        console.log('LeaderBoardUserItem.render', userId);
        return (
            <View style={styles.container_content}>
                <View style={styles.ranking_view}>
                    <Text allowFontScaling={global.isScaleFont} slyle={styles.ranking_text}>{ranking}</Text>
                </View>
                {/* <MyImage
                    style={styles.avatar_image}
                    uri={AppUtil.formatAvatar(this.props.avatar)}
                    imageDefault={this.getResources().avatar_default}
                /> */}
                <View style={{ height: verticalScale(60), width: verticalScale(50), alignItems: 'center', justifyContent: 'center' }}>
                    <Avatar containerStyle={{ marginLeft: scale(10) }}
                        width={verticalScale(40)}
                        height={verticalScale(40)}
                        rounded={true}
                        source={{uri : avatar}}>
                    </Avatar>
                    <Avatar
                        containerStyle={{ position: 'absolute', left: scale(-2), top: verticalScale(5) }}
                        width={verticalScale(20)}
                        height={verticalScale(20)}
                        rounded={true}
                        source={{ uri: country_img }}
                    />
                </View>
                <View style={styles.user_container}>
                    <Text allowFontScaling={global.isScaleFont} style={styles.user_fullname_text}>{fullname}</Text>
                    <Text allowFontScaling={global.isScaleFont} style={styles.user_id_text}>{this.showUserId()}</Text>
                </View>
                <View style={styles.handicap_view}>
                    <Text allowFontScaling={global.isScaleFont} style={styles.handicap_text}>{this.getAppUtil().handicap_display(handicap)}</Text>
                </View>
                <View style={styles.system_ranking_view}>
                    <Text allowFontScaling={global.isScaleFont} style={styles.system_ranking_text}>{system_ranking > 0 ? system_ranking : 'N/A'}</Text>
                </View>
                <View style={styles.raning_manner_view}>
                    <Image
                        style={styles.raning_manner_image}
                        source={AppUtil.getSourceRankingManner(system_manners)}
                    />
                </View>
            </View>
        );
    }
}
//<MyView slyle={styles.raning_manner_view_hide} hide={(this.props.system_manners === 2) ? true : false}>
//style={[styles.raning_manner_image, { transform: [{ rotate: (this.props.system_manners === 1) ? '0deg' : '180deg' }] }]}