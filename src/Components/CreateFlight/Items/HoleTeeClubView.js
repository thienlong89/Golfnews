import React from 'react';
import { Platform, StyleSheet, Text, View, Image, TouchableOpacity, Dimensions } from 'react-native';
// import Touchable from 'react-native-platform-touchable';
import BaseComponent from '../../../Core/View/BaseComponent';
// import MyView from '../../../Core/View/MyView';

import {scale, verticalScale, fontSize} from '../../../Config/RatioScale';

const TEE_CLUB = ['1W', '3W', '5W', '7W', '3H', '4H', '5H', '6H', '7H', '3i', '4i', '5i', '6i', '7i', '8i', '9i', 'Pw', 'Lw', 'Sw'];

export default class HoleTeeClubView extends BaseComponent {

    static defaultProps = {
        teeClubPosition: 0,
        disableChangeScore: false,
        teeClub: ''
    }

    constructor(props) {
        super(props);
        let position = TEE_CLUB.findIndex((tee) => {
            return tee === this.props.teeClub;
        });
        this.state = {
            teeClubPosition: position != -1 ? position : 0,
            disableChangeScore: this.props.disableChangeScore
        }
    }

    setData(teeClub, disableChangeScore) {
        let position = TEE_CLUB.findIndex((tee) => {
            return tee === teeClub;
        });
        this.setState({
            teeClubPosition: position != -1 ? position : 0,
            disableChangeScore: disableChangeScore
        });
    }

    render() {
        return (
            <View style={styles.enter_tee_container}>
                <View style={[styles.row_score_container, { marginTop: 5 }]}>
                    <TouchableOpacity style={styles.touchable_btn}
                        onPress={this.state.disableChangeScore ? this.onGuestCannotChangeClick.bind(this) : this.onDecreaseTeeClubClick.bind(this)}>
                        <Image
                            style={styles.icon_btn}
                            source={this.getResources().ic_btn_left}
                        />
                    </TouchableOpacity>

                    <View style={styles.view_putt_score}>
                        <Text allowFontScaling={global.isScaleFont} style={styles.text_putts}>Tee club</Text>
                        <Text allowFontScaling={global.isScaleFont} style={styles.text_score_tee_club}>{TEE_CLUB[this.state.teeClubPosition]}</Text>
                    </View>

                    <TouchableOpacity style={styles.touchable_btn}
                        onPress={this.state.disableChangeScore ? this.onGuestCannotChangeClick.bind(this) : this.onIncreaseTeeClubClick.bind(this)}>
                        <Image
                            style={styles.icon_btn}
                            source={this.getResources().ic_btn_right}
                        />
                    </TouchableOpacity>
                </View>
            </View>
        );

    }

    onDecreaseTeeClubClick() {
        let tee = this.state.teeClubPosition;
        if (tee > 0) {
            --tee;
            this.setState({
                teeClubPosition: tee
            })
            if (this.props.onUpdateTeeClub) {
                this.props.onUpdateTeeClub(TEE_CLUB[tee]);
            }
        }
    }

    onIncreaseTeeClubClick() {
        let tee = this.state.teeClubPosition;
        if (tee < TEE_CLUB.length - 1) {
            ++tee;
            this.setState({
                teeClubPosition: tee
            })
            if (this.props.onUpdateTeeClub) {
                this.props.onUpdateTeeClub(TEE_CLUB[tee]);
            }
        }
    }

    onGuestCannotChangeClick() {
        if (this.props.onGuestCannotChangeClick) {
            this.props.onGuestCannotChangeClick();
        }
    }

}

const styles = StyleSheet.create({
    enter_tee_container: {
        borderColor: '#EBEBEB',
        borderWidth: scale(1),
        borderRadius: scale(3),
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: scale(10),
        marginRight: scale(10),
        marginBottom: verticalScale(10)
    },
    row_score_container: {
        flexDirection: 'row',
        width: Dimensions.get('window').width,
        paddingLeft: scale(20),
        paddingRight: scale(20)
    },
    touchable_btn: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    icon_btn: {
        width: verticalScale(30),
        height: verticalScale(30),
        resizeMode: 'contain'
    },
    text_btn: {
        color: '#FFFFFF',
        fontSize: fontSize(25,scale(11)),// 25
    },
    text_putts: {
        color: '#3B3B3B',
        fontSize: fontSize(15,scale(1)),// 15,
        textAlign: 'center'
    },
    text_score_tee_club: {
        color: '#303030',
        fontSize: fontSize(27,scale(13)),// 27,
        textAlign: 'center',
        fontWeight: 'bold'
    },
    view_putt_score: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
});