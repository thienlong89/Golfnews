import React from 'react';
import { Platform, StyleSheet, Text, View, Dimensions } from 'react-native';
import { Avatar } from 'react-native-elements';
import AppUtil from '../../../Config/AppUtil';
import UserRoundModel from '../../../Model/CreateFlight/Flight/UserRoundModel';
import FriendItemModel from '../../../Model/Friends/FriendItemModel';
import BaseComponent from '../../../Core/View/BaseComponent';
import { scale, verticalScale, fontSize } from '../../../Config/RatioScale';

export default class ScorePlayerItemView extends BaseComponent {

    static defaultProps = {
        player: {}
    }

    constructor(props) {
        super(props);
    }

    render() {
        let playerProps = this.props.player;
        // console.log('playerProps', playerProps)
        let avatar = '';
        let handicapFacility = '';
        let fullName = '';
        let teeColor = '';
        let userId = '';

        if (playerProps instanceof UserRoundModel) {
            let user = playerProps.getUser();
            avatar = user.getAvatar() ? { uri: user.getAvatar() } : this.getResources().avatar_default_larger;
            fullName = user.getFullName();
            handicapFacility = playerProps.getCoursesHandicapDisplay();
            teeColor = AppUtil.getColorTee(playerProps.getTee());
            userId = user.getUserId();
        } else if (playerProps instanceof FriendItemModel) {
            avatar = playerProps.getAvatar() ? { uri: playerProps.getAvatar() } : this.getResources().avatar_default_larger;
            fullName = playerProps.getFullname();
            handicapFacility = playerProps.getHandicapFacility();
            teeColor = AppUtil.getColorTee(playerProps.getTee());
            userId = playerProps.getUserId();
        }
        return (
            <View style={styles.container}>
                <View style={styles.view_container_avartar}>
                    
                        <Avatar //medium 
                            width={verticalScale(50)}
                            height={verticalScale(50)}
                            rounded
                            containerStyle={styles.avatar_container}
                            avatarStyle={styles.avatar_style}
                            source={avatar}
                        />
                    <View style={styles.handicap_facility_view}>
                        <Text allowFontScaling={global.isScaleFont} style={styles.handicap_facility_text}>{this.getAppUtil().handicap_display(handicapFacility)}</Text>
                    </View>
                </View>

                <Text allowFontScaling={global.isScaleFont} style={styles.player_name} numberOfLines={1}>{fullName}</Text>
                <View style={styles.container_tee}>
                    <View style={[styles.course_tee, { backgroundColor: teeColor }]} />
                    <Text allowFontScaling={global.isScaleFont} style={styles.player_id}>{userId}</Text>
                </View>

            </View>
        );
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        padding: scale(3)
    },
    view_container_avartar: {
        justifyContent: 'center',
        //alignItems: 'center',
        flexWrap: 'wrap',
        maxWidth: verticalScale(50)
    },
    avatar_container: {
    },
    avatar_style: {
        borderColor: '#EFEFF4',
        borderWidth: 0.5
    },
    player_name: {
        color: '#474747',
        fontWeight: 'bold',
        fontSize: fontSize(13,-scale(2)),// 13
    },
    container_tee: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center'
    },
    player_id: {
        color: '#828282',
        fontSize: fontSize(13,-scale(2)),// 13
    },
    course_tee: {
        width: scale(13),
        height: verticalScale(13),
        marginRight: scale(5),
        borderColor: '#919191',
        borderWidth: scale(0.5)
    },
    handicap_facility_view: {
        position: 'absolute',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        borderColor: '#00aba7',
        borderRadius: verticalScale(14),
        width: verticalScale(28),
        height: verticalScale(28),
        borderWidth: 2,
        // left: scale(25),
        right: -scale(13),
        bottom: 0,
        //marginLeft: scale(50)
    },
    handicap_facility_text: {
        alignSelf: 'center',
        color: '#00aba7',
        fontSize: fontSize(14, -scale(2))
    }

});