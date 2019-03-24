import React from 'react';

import {
    StyleSheet,
    Platform,
    Text,
    View,
    ImageBackground,
    Dimensions
} from 'react-native';
import MyView from '../../Core/View/MyView';

import BaseComponent from '../../Core/View/BaseComponent';
import MyImage from '../../Core/Common/MyImage';
import { scale, verticalScale, fontSize } from '../../Config/RatioScale';
import CustomAvatar from '../Common/CustomAvatar';

const { width } = Dimensions.get('window')

export default class ItemPlayer extends BaseComponent {

    static defaultProps = {
        player: {}
    }

    constructor(props) {
        super(props);
    }

    // shouldComponentUpdate(){
    //     return false;
    // }`

    render() {
        let players = this.props.player;
        // console.log('................................. this.props.player : ',players);
        if (players != null) {
            let user = players.getUser();
            let gross = players.getGross();
            let hideGross = (gross === 0 || !players.getGrossDisplay());
            let hideCourseHandicap = (players.getCoursesHandicap() === 0 || !players.getCoursesHandicapDisplay());
            return (
                <View style={{ flex: 1, minHeight: scale(70) }}>


                    <View style={[styles.item_player, { alignItems: 'center' }]}>

                        <View>
                            {/* <MyView hide={hideGross}> */}
                            <ImageBackground style={styles.bg_handicap}
                                resizeMode='contain'
                                imageStyle={{ resizeMode: 'contain', height: this.getRatioAspect().scale(28), width: this.getRatioAspect().scale(28), tintColor: '#E9E9E9' }}
                                source={hideGross ? null : this.getResources().ic_circle_fill}>
                                <Text allowFontScaling={global.isScaleFont} style={styles.item_player_over}>{players.getOverDisplay()}</Text>
                            </ImageBackground>

                            {/* </MyView> */}

                            {/* <MyView hide={hideGross}> */}
                            <ImageBackground style={[styles.bg_handicap, { marginTop: this.getRatioAspect().verticalScale(3) }]}
                                resizeMode='contain'
                                imageStyle={{ resizeMode: 'contain', height: this.getRatioAspect().scale(28), width: this.getRatioAspect().scale(28) }}
                                source={hideCourseHandicap ? null : this.getResources().ic_circle_blue}>
                                <Text allowFontScaling={global.isScaleFont} style={styles.handicap_facility}>{this.getAppUtil().handicap_display(players.getCoursesHandicapDisplay())}</Text>
                            </ImageBackground>
                            {/* </MyView> */}
                        </View>
                        <CustomAvatar
                            width={Platform.OS === 'ios' ? verticalScale(55) : verticalScale(50)}
                            height={Platform.OS === 'ios' ? verticalScale(55) : verticalScale(50)}
                            resizeMode={'contain'}
                            uri={user.getAvatar()}
                            puid={players.getUserId()}
                        />

                    </View>
                    <Text allowFontScaling={global.isScaleFont} style={styles.item_player_name} numberOfLines={1}>{user.getFullName()}</Text>
                </View>
            );
        } else {
            return (<View style={[styles.item_player, { flex: 1 }]} />);
        }
    }
}

const styles = StyleSheet.create({
    // item_player: {
    //     flex: 1,
    //     minHeight: verticalScale(90),
    //     zIndex: 0
    // },
    // item_player_avatar: {
    //     height: verticalScale(55),
    //     width: scale(55),
    //     // marginLeft: scale(3),
    //     resizeMode : 'contain'
    // },
    // item_player_name: {
    //     color: '#828282',
    //     fontSize: fontSize(12,-scale(3)),// 12,
    //     width: scale(70)
    // },
    // item_player_over: {
    //     color: '#828282',
    //     fontSize: fontSize(11,-scale(3)),// 11,
    //     fontWeight: 'bold',
    //     textAlign: 'center',
    //     textAlignVertical: 'center',
    // },
    // bg_handicap: {
    //     width: scale(27),
    //     height: scale(27),
    //     justifyContent: 'center',
    //     alignItems: 'center',
    //     tintColor: '#E9E9E9'
    // },
    // handicap_facility: {
    //     color: '#00BAB6',
    //     textAlign: 'center',
    //     textAlignVertical: 'center',
    //     fontSize: fontSize(11,-scale(3)),// 11
    // }
    item_player: {
        // flex: 1,
        flexDirection: 'row',
        // minHeight: verticalScale(90)
    },
    item_player_avatar: {
        height: verticalScale(55),
        width: scale(55),
        // marginLeft: scale(3),
        resizeMode: 'contain'
    },
    item_player_name: {
        color: '#828282',
        fontSize: fontSize(11, -scale(3)),// 12,
        flex: 1,
        textAlign: 'center',
        width: (width - 30) / 4,
        marginTop: scale(5)
    },
    item_player_over: {
        color: '#828282',
        fontSize: fontSize(11, -scale(3)),// 11,
        fontWeight: 'bold',
        textAlign: 'center',
        textAlignVertical: 'center',
    },
    bg_handicap: {
        width: scale(28),
        height: scale(28),
        justifyContent: 'center',
        alignItems: 'center',
        tintColor: '#E9E9E9'
    },
    handicap_facility: {
        color: '#00BAB6',
        textAlign: 'center',
        textAlignVertical: 'center',
        fontSize: fontSize(11, -scale(2)),// 11
    }

});
