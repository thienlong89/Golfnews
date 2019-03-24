import React from 'react';
import {
    Text,
    View,
    Image,
    StyleSheet,
    TouchableOpacity
} from 'react-native';
import BaseComponent from '../../../Core/View/BaseComponent';
// import Touchable from 'react-native-platform-touchable';
import AppUtil from '../../../Config/AppUtil';
import { scale, verticalScale, fontSize } from '../../../Config/RatioScale';
import { Avatar } from 'react-native-elements';

export default class MannerClubItemView extends BaseComponent {

    constructor(props) {
        super(props);
        
        this.onItemPress = this.onItemPress.bind(this);
    }

    static defaultProps = {
        manner: {},
        index: 1
    }

    render() {
        let {
            index,
            manner
        } = this.props;

        let player = manner.User;
        if (!player) return null;

        let avatar = player.avatar;
        let country_image = player.country_image;
        let fullname = player.fullname;
        let userId = player.id;
        let eHandicap_member_id = player.eHandicap_member_id;
        let point_ranking = manner.point_ranking;
        let teeColor = player.getDefaultTeeID();

        return (
            <TouchableOpacity onPress={this.onItemPress}>
                <View style={styles.container_content}>
                    <View style={styles.ranking_view}>
                        <Text allowFontScaling={global.isScaleFont} style={styles.ranking_text}>{index}</Text>
                    </View>

                    <View style={styles.view_name}>
                        <View style={{ height: verticalScale(60), width: verticalScale(50), alignItems: 'center', justifyContent: 'center' }}>
                            <Avatar containerStyle={{ marginLeft: scale(10) }}
                                width={verticalScale(45)}
                                height={verticalScale(45)}
                                rounded={true}
                                source={{ uri: avatar }}>
                            </Avatar>
                            <Avatar
                                containerStyle={{ position: 'absolute', left: scale(-2), top: verticalScale(5) }}
                                width={verticalScale(20)}
                                height={verticalScale(20)}
                                rounded={true}
                                source={{ uri: country_image }}
                            />
                        </View>

                        <View style={styles.user_container}>
                            <Text allowFontScaling={global.isScaleFont} style={styles.user_fullname_text}>{fullname}</Text>
                            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: scale(5) }}>
                                <View style={[styles.view_tee_color, { backgroundColor: teeColor }]} />
                                <Text allowFontScaling={global.isScaleFont} style={styles.user_id_text}>{userId}</Text>
                            </View>
                        </View>
                    </View>

                    <View style={styles.view_score}>
                        <Text allowFontScaling={global.isScaleFont} style={styles.system_ranking_text}>{point_ranking}</Text>
                    </View>
                </View>
            </TouchableOpacity>
        );
    }

    onItemPress(){
        let {
            index,
            manner
        } = this.props;
        if(this.props.onItemPress){
            this.props.onItemPress(manner, index);
        }
    }
}

const styles = StyleSheet.create({
    container_content: {
        height: verticalScale(60),
        flexDirection: 'row',
        paddingTop: verticalScale(3),
        paddingBottom: verticalScale(3),
    },

    ranking_view: {
        width: scale(50),
        justifyContent: 'center',
        alignItems: 'center'
    },

    ranking_text: {
        color: '#8c8c8c',
        fontSize: fontSize(14),// 14 
    },

    avatar_container: {
        flex: 0.15,
        justifyContent: 'center',
        alignItems: 'center'
    },

    avatar_image: {
        resizeMode: 'contain',
        height: verticalScale(40),
        width: scale(40),
        marginTop: verticalScale(10),
        marginLeft: scale(10)
    },

    user_container: {
        flex: 1,
        justifyContent: 'center',
        marginLeft: scale(10),
    },

    user_fullname_text: {
        fontWeight: 'bold',
        fontSize: fontSize(14),// 14 
        color: '#373737',
    },

    user_id_text: {
        color: '#979797',
        fontSize: fontSize(13, scale(1)),
        marginLeft: scale(8)
    },

    handicap_view: {
        flex: 0.12,
        justifyContent: 'center',
        alignItems: 'center'
    },

    handicap_text: {
        color: '#000',
        fontSize: fontSize(13),// 14, 
        textAlign: 'center'
    },

    system_ranking_view: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    view_score: {
        width: scale(50),
        justifyContent: 'center',
        alignItems: 'center'
    },

    system_ranking_text: {
        color: '#00ABA7',
        fontSize: fontSize(14),// 14, 
        fontWeight: 'bold',
        textAlign: 'center'
    },

    raning_manner_view: {
        flex: 0.05,
        justifyContent: 'center',
        alignItems: 'center'
    },

    raning_manner_view_hide: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        width: scale(16),
        height: scale(16)
    },

    raning_manner_image: {
        resizeMode: 'contain',
        width: scale(8),
        height: scale(8)
    },
    view_name: {
        flex: 1,
        flexDirection: 'row'
    },
    view_tee_color: {
        width: verticalScale(15),
        height: verticalScale(15),
        borderColor: '#919191',
        borderWidth: 0.5
    },
});