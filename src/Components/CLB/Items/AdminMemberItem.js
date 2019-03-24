import React from 'react';
import {
    Platform,
    StyleSheet,
    Text,
    View,
    Image,
    TouchableOpacity
} from 'react-native';
import Touchable from 'react-native-platform-touchable';
import BaseComponent from '../../../Core/View/BaseComponent';
import Networking from '../../../Networking/Networking';
import ApiService from '../../../Networking/ApiService';
import { scale, verticalScale, moderateScale, fontSize } from '../../../Config/RatioScale';
import CustomAvatar from '../../Common/CustomAvatar';

export default class AdminMemberItem extends BaseComponent {

    static defaultProps = {
        index: 1,
        player: {}
    }

    constructor(props) {
        super(props);

        this.state = {
        }
        this.genderList = [this.getResources().ic_male, this.getResources().ic_female];
        this.onItemPress = this.onItemPress.bind(this);
    }

    render() {
        let {
            index,
            player
        } = this.props;

        let avatar = player.getAvatar();
        let playerName = player.getFullName();
        let teeColor = player.getDefaultTeeID();
        let country = player.getUserId();
        let birthday = player.getDisplayBirthday();
        let gender = player.getGender();
        let hdcValue = player.getUsgaHcIndex() >= 0 ? player.getUsgaHcIndex() : '+' + Math.abs(player.getUsgaHcIndex());
        let numberStar = player.star ? player.star : 0;
        let listStar = [];
        for (let i = 0; i < numberStar; i++) {
            listStar.push(
                <Image
                    style={styles.img_star}
                    source={this.getResources().ic_star} />
            )
        }

        return (
            <TouchableOpacity style={styles.touchable_view}
                onPress={this.onItemPress}>

                <View style={styles.container}>
                    <View style={styles.view_index}>
                        <Text allowFontScaling={global.isScaleFont} style={styles.txt_index}>{index}</Text>
                    </View>

                    <View style={styles.view_line} />

                    <View style={styles.view_center}>
                        <CustomAvatar
                            containerStyle={styles.avatar_image}
                            uri={avatar}
                            width={scale(45)}
                            height={scale(45)}
                        />
                        <View style={{ minHeight: scale(50), justifyContent: 'space-between', marginLeft: scale(5), flex: 1 }}>
                            <Text allowFontScaling={global.isScaleFont} style={styles.txt_player_name}>{playerName}</Text>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <View style={[styles.view_tee_color, { backgroundColor: teeColor }]} />
                                <Text allowFontScaling={global.isScaleFont} style={styles.txt_country}>{country}</Text>
                            </View>
                        </View>
                    </View>

                    <View style={styles.view_line} />

                    <View style={styles.view_birthday}>
                        <Text allowFontScaling={global.isScaleFont} style={styles.txt_birthday}>{birthday}</Text>
                        <Image style={styles.img_gender}
                            source={this.genderList[gender]} />
                    </View>

                    <View style={styles.view_line} />

                    <View style={styles.view_hdc}>
                        <Text allowFontScaling={global.isScaleFont} style={styles.txt_birthday}>{hdcValue}</Text>
                        <View style={styles.view_star}>
                            {listStar}
                        </View>
                    </View>
                </View>
            </TouchableOpacity>
        );
    }

    onItemPress() {
        if (this.props.onItemPress) {
            this.props.onItemPress(this.props.player);
        }
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        flexDirection: 'row',
        borderRadius: scale(10)
    },
    view_index: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    txt_index: {
        color: '#666666',
        fontSize: fontSize(15)
    },
    view_center: {
        flex: 5,
        flexDirection: 'row',
        paddingTop: scale(10),
        paddingBottom: scale(10),
        alignItems: 'center',
    },
    view_birthday: {
        flex: 2.5,
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: scale(15),
        marginTop: scale(15),
    },
    view_hdc: {
        flex: 2.1,
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: scale(15),
        marginTop: scale(15),
    },
    avatar_image: {
        resizeMode: 'contain',
        minHeight: 50,
        minWidth: 50,
    },
    txt_player_name: {
        flex: 1,
        color: '#373737',
        fontSize: fontSize(14),
        fontWeight: 'bold'
    },
    view_tee_color: {
        width: verticalScale(15),
        height: verticalScale(15),
        borderColor: '#919191',
        borderWidth: 0.5
    },
    txt_country: {
        color: '#979797',
        marginLeft: scale(8),
        fontSize: fontSize(13, scale(1)),
    },
    txt_birthday: {
        color: '#373737',
        fontSize: fontSize(14)
    },
    img_star: {
        width: scale(12),
        height: scale(12),
        resizeMode: 'contain'
    },
    view_star: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: scale(10)
    },
    view_line: {
        backgroundColor: '#D4D4D4',
        width: 1
    },
    touchable_view: {
        borderRadius: scale(10)
    }
    // img_gender: {
    //     width: scale(40),
    //     height: scale(40),
    //     resizeMode: 'center'
    // }
});