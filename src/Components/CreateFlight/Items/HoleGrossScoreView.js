import React from 'react';
import { Platform, StyleSheet, Text, View, Image, TouchableOpacity, Dimensions } from 'react-native';
// import Touchable from 'react-native-platform-touchable';
import BaseComponent from '../../../Core/View/BaseComponent';
import MyView from '../../../Core/View/MyView';
import {scale, verticalScale, fontSize} from '../../../Config/RatioScale';

const MAX_SCORE = 20;

const MAX_HOLD_LENGTH = 18;

export default class HoleGrossScoreView extends BaseComponent {

    static defaultProps = {
        disableChangeScore: false,
        currentScore: 0,
        currentPutt: 0,
        isHideOverMode: true
    }

    constructor(props) {
        super(props);
        this.state = {
            isHideOverMode: this.props.isHideOverMode,
            isHidePutts: true,
            score: this.props.currentScore,
            puttPosition: this.props.currentPutt ? this.props.currentPutt : 0,
            disableChangeScore: this.props.disableChangeScore
        }
    }

    setData(isHideOverMode, score, putt = 0, disableChangeScore) {
        this.setState({
            isHideOverMode: isHideOverMode,
            score: score,
            puttPosition: putt,
            disableChangeScore: disableChangeScore
        });
    }

    render() {
        return (
            <MyView hide={!this.state.isHideOverMode}>
                <View style={styles.row_score_container}>
                    <TouchableOpacity style={styles.touchable_btn}
                        onPress={this.state.disableChangeScore ? this.onGuestCannotChangeClick.bind(this) : this.onDecreaseScoreClick.bind(this)}>
                        <Image
                            style={styles.icon_btn}
                            source={this.getResources().ic_btn_div}
                        />
                    </TouchableOpacity>

                    <Text allowFontScaling={global.isScaleFont} style={styles.text_score_center}>{this.state.score}</Text>

                    <TouchableOpacity style={styles.touchable_btn}
                        onPress={this.state.disableChangeScore ? this.onGuestCannotChangeClick.bind(this) : this.onIncreaseScoreClick.bind(this)}>
                        <Image
                            style={styles.icon_btn}
                            source={this.getResources().ic_btn_plus}
                        />
                    </TouchableOpacity>
                </View>

                {/* nhập PUTTS */}
                <MyView hide={this.state.isHidePutts}>
                    <View style={[styles.row_score_container, { marginTop: 5 }]}>
                        <TouchableOpacity style={styles.touchable_btn}
                            onPress={this.state.disableChangeScore ? this.onGuestCannotChangeClick.bind(this) : this.onDecreasePuttClick.bind(this)}>
                            <Image
                                style={styles.icon_btn}
                                source={this.getResources().ic_btn_div}
                            />
                        </TouchableOpacity>

                        <View style={styles.view_putt_score}>
                            <Text allowFontScaling={global.isScaleFont} style={styles.text_putts}>Putts</Text>
                            <Text allowFontScaling={global.isScaleFont} style={styles.text_score_putts}>{this.state.puttPosition}</Text>
                        </View>


                        <TouchableOpacity style={styles.touchable_btn}
                            onPress={this.state.disableChangeScore ? this.onGuestCannotChangeClick.bind(this) : this.onIncreasePuttClick.bind(this)}>
                            <Image
                                style={styles.icon_btn}
                                source={this.getResources().ic_btn_plus}
                            />
                        </TouchableOpacity>
                    </View>
                </MyView>

                {/* mũi tên ẩn hiện PUTTS */}
                <TouchableOpacity
                    style={[styles.touchable_btn, { paddingBottom: 3 }]}
                    onPress={() => this.setState({ isHidePutts: !this.state.isHidePutts })}>
                    <Image
                        style={styles.icon_btn_arrow}
                        source={this.state.isHidePutts ? this.getResources().ic_btn_arrow_down : this.getResources().ic_btn_arrow_up}
                    />
                </TouchableOpacity>
            </MyView>
        );
        // } else {
        //     return null;
        // }

    }

    onDecreaseScoreClick() {
        let decreaseScore = this.state.score;
        if (decreaseScore > 0) {
            --decreaseScore;
            this.setState({
                score: decreaseScore,
                puttPosition: 0
            })
            if (this.props.onUpdateScore) {
                this.props.onUpdateScore(decreaseScore);
            }
            let putt = this.state.puttPosition;
            if (putt > 0 && this.props.onUpdatePutt) {
                this.props.onUpdatePutt(0);
            }
        }
    }

    onIncreaseScoreClick() {

        let increaseScore = this.state.score;
        if (increaseScore < MAX_SCORE) {
            ++increaseScore;
            this.setState({
                score: increaseScore
            })
            if (this.props.onUpdateScore) {
                this.props.onUpdateScore(increaseScore);
            }
        }
    }

    onDecreasePuttClick() {

        let putt = this.state.puttPosition;
        if (putt > 0) {
            --putt;
            this.setState({
                puttPosition: putt
            })
            if (this.props.onUpdatePutt) {
                this.props.onUpdatePutt(putt);
            }
        }
    }

    onIncreasePuttClick() {
        let putt = this.state.puttPosition;
        if (putt < this.state.score) {
            ++putt;
            this.setState({
                puttPosition: putt
            })
            if (this.props.onUpdatePutt) {
                this.props.onUpdatePutt(putt);
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
    text_score_center: {
        color: '#00ABA7',
        fontSize: fontSize(27,scale(13)),// 27,
        flex: 1,
        textAlign: 'center',
        fontWeight: 'bold'
    },
    text_putts: {
        color: '#3B3B3B',
        fontSize: fontSize(15,scale(1)),// 15,
        textAlign: 'center'
    },
    view_putt_score: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    text_score_putts: {
        color: '#00ABA7',
        fontSize: fontSize(27,scale(13)),// 27,
        textAlign: 'center',
        fontWeight: 'bold'
    },
    icon_btn_arrow: {
        width: verticalScale(15),
        height: verticalScale(15),
        resizeMode : 'contain'
    },
});