import React from 'react';
import { StyleSheet, Text, View, Image, Dimensions } from 'react-native';
import Touchable from 'react-native-platform-touchable';
import BaseComponent from '../../../Core/View/BaseComponent';
// import GestureRecognizer, { swipeDirections } from 'react-native-swipe-gestures';
// import AnimatedLinearGradient from 'react-native-animated-linear-gradient';
// import MyView from '../../../Core/View/MyView';
import Swiper from 'react-native-swiper';
import { scale, verticalScale, fontSize } from '../../../Config/RatioScale';

// const config = {
//     velocityThreshold: 0.3,
//     directionalOffsetThreshold: 40
// };

const colorAnimate = {
    left: [
        '#444444',
        '#00ABA7',
    ],
    right: [
        '#00ABA7',
        '#444444',
    ]
}

export default class HandicapKeyboard extends BaseComponent {

    constructor(props) {
        super(props);
        this.isIphoneX = this.getAppUtil().isIphoneX();
        this.state = {
            isGrossMode: false,
            isGrossPage1: true,
            isShowAnimation: false,
            animateDirection: colorAnimate.left
        }
    }

    render() {
        console.log('HandicapKeyboard.render');
        let list_above = this.state.isGrossMode ? (this.state.isGrossPage1 ? ["10+", "1", "2", "3", "4", "5"] : ["10-", "11", "12", "13", "14", "15"]) :
            ["-2", { "value": "-1", "text": "Birdie" }, { "value": "0", "text": "Par" }, { "value": "+1", "text": "Bogey" }, { "value": "+2", "text": "Double" }, { "value": "+3", "text": "Triple" }];
        let list_below = this.state.isGrossMode ? (this.state.isGrossPage1 ? ["", "6", "7", "8", "9", "10"] : ["", "16", "17", "18", "19", "20"]) : ["", "+4", "+5", "+6", "+7", "+8"];

        let listAbove = list_above.map((item, index) => {
            if (item instanceof Object) {
                return (
                    <Touchable style={styles.keyboard_element} onPress={() => this.onKeyboardAboveListener(item.value, index)}>
                        <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                            <Text allowFontScaling={global.isScaleFont} style={styles.text_element} numberOfLines={1}>{item.value}</Text>
                            <Text allowFontScaling={global.isScaleFont} style={styles.text_element_sub} numberOfLines={1}>{item.text}</Text>
                        </View>
                    </Touchable>
                )
            }
            return (
                <Touchable style={styles.keyboard_element} onPress={() => this.onKeyboardAboveListener(item, index)}>
                    <Text allowFontScaling={global.isScaleFont} style={styles.text_element} numberOfLines={1}>{item}</Text>
                </Touchable>
            );
        });

        let listBelow = list_below.map((item, index) => {
            if (item != '') {
                return (
                    <Touchable style={styles.keyboard_element} onPress={() => this.onKeyboardBelowListener(item, index)}>
                        <Text allowFontScaling={global.isScaleFont} style={styles.text_element} numberOfLines={1}>{item}</Text>
                    </Touchable>
                );
            } else {
                return (
                    <Touchable style={styles.keyboard_element} onPress={() => this.onKeyboardPictureListener(item, index)}>
                        <Image
                            style={styles.image_element}
                            source={this.getResources().ic_picture}
                        />
                    </Touchable>
                );
            }

        });

        return (
            // <GestureRecognizer
            //     onSwipeLeft={(state) => this.onSwipeLeft(state)}
            //     onSwipeRight={(state) => this.onSwipeRight(state)}
            //     config={config}
            //     style={styles.gesture_recognizer}>
            <View style={{ height: this.isIphoneX ? verticalScale(165) : verticalScale(150), backgroundColor: '#444444' }}>
                <Swiper
                    ref={(swiper) => { this.swiper = swiper; }}
                    showsButtons={false}
                    loop={false}
                    index={1}
                    showsPagination={false}
                    onIndexChanged={this.onViewHandicapKeyboardChange.bind(this)}
                >
                    <View style={styles.keyboard}>
                        <View style={styles.view_note}>
                            <Text allowFontScaling={global.isScaleFont} style={styles.current_input_mode}>
                                {this.t('current_gross')}
                                <Text allowFontScaling={global.isScaleFont} style={styles.note_input_mode}>{` (${this.t('in_gross_mode')})`}</Text>
                            </Text>

                        </View>
                        <View style={styles.keyboard_row}>
                            {listAbove}
                        </View>
                        <View style={styles.keyboard_row}>
                            {listBelow}
                        </View>
                    </View>

                    <View style={styles.keyboard}>
                        <View style={styles.view_note}>
                            <Text allowFontScaling={global.isScaleFont} style={styles.current_input_mode}>
                                {this.t('current_over')}
                                <Text allowFontScaling={global.isScaleFont} style={styles.note_input_mode}>{` (${this.t('in_over_mode')})`}</Text>
                            </Text>

                        </View>

                        <View style={styles.keyboard_row}>
                            {listAbove}
                        </View>
                        <View style={styles.keyboard_row}>
                            {listBelow}
                        </View>
                    </View>

                </Swiper>
            </View>
            // </GestureRecognizer>
        );
    }

    onViewHandicapKeyboardChange(index) {
        if (index === 0) {
            this.setState({
                isGrossMode: true
            }, () => {
                this.onChangeInputMode(true);
            });
        } else {
            this.setState({
                isGrossMode: false
            }, () => {
                this.onChangeInputMode(false);
            });
        }
    }

    onSwipeLeft(state) {
        this.setState({
            isGrossMode: !this.state.isGrossMode,
            animateDirection: colorAnimate.left,
            isShowAnimation: true
        }, () => {
            setTimeout(() => {
                this.setState({
                    isShowAnimation: false
                });
            }, 1000);
        });
        this.onChangeInputMode(!this.state.isGrossMode);
    }

    onSwipeRight(state) {
        this.setState({
            isGrossMode: !this.state.isGrossMode,
            animateDirection: colorAnimate.right,
            isShowAnimation: true
        }, () => {
            setTimeout(() => {
                this.setState({
                    isShowAnimation: false
                });
            }, 1000);
        });
        this.onChangeInputMode(!this.state.isGrossMode);
    }

    setInputModeChange(isGrossMode) {
        this.setState({
            isGrossMode: isGrossMode
        });
    }

    onKeyboardAboveListener(score, index) {
        if (this.state.isGrossMode) {
            if (this.state.isGrossPage1) {
                if (index === 0) {
                    this.setState({
                        isGrossPage1: false
                    })
                }
            } else {
                if (index === 0) {
                    this.setState({
                        isGrossPage1: true
                    })
                }
            }
        } else {
            if (score === 'Par') {
                score = 0;
            } else if (score === 'Bogey') {
                score = +1;
            }
        }
        this.onEnterScore(score);
    }

    onKeyboardBelowListener(score, index) {
        // if (this.state.isGrossMode) {
        //     if (index === 5) {
        //         this.setState({
        //             isGrossMode: false
        //         });
        //         this.onChangeInputMode(false);
        //     }
        // } else {
        //     if (index === 5) {
        //         this.setState({
        //             isGrossMode: true
        //         });
        //         this.onChangeInputMode(true);
        //     }
        // }

        this.onEnterScore(score);

    }

    onEnterScore(score) {
        if (this.props.onScore != null && score != 'Gross' && score != 'Over' && score != '10+' && score != '10-') {
            this.props.onScore(parseInt(score), this.state.isGrossMode);
        }
    }

    onKeyboardPictureListener(item, index) {
        if (this.props.onAttachImage != null) {
            this.props.onAttachImage();
        }
    }

    onChangeInputMode(isGrossMode) {
        if (this.props.onChangeInputMode != null) {
            this.props.onChangeInputMode(isGrossMode);
        }
    }

}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#444444',
        justifyContent: 'flex-end',
        // marginTop : verticalScale(5)
    },
    keyboard: {
        flex: 1,
        backgroundColor: '#444444',
        // justifyContent: 'space-between',
    },
    gesture_recognizer: {
        backgroundColor: '#444444'
    },
    keyboard_row: {
        flexDirection: 'row',
    },
    keyboard_element: {
        flex: 1,
        // paddingTop: verticalScale(15),
        // paddingBottom: verticalScale(15),
        height: scale(60),
        justifyContent: 'center',
        alignItems: 'center',
        borderColor: '#262626',
        borderWidth: scale(0.5)
    },
    text_element: {
        color: '#FFFFFF',
        // fontWeight: 'bold',
        fontSize: fontSize(19, scale(3)),// 19
        textAlign: 'center'
    },
    text_element_sub: {
        color: '#FFFFFF',
        fontWeight: '400',
        fontSize: fontSize(13, scale(3)),// 19
        textAlign: 'center'
    },
    image_element: {
        width: scale(25),
        height: verticalScale(25),
        resizeMode: 'contain'
    },
    current_input_mode: {
        color: '#00ABA7',
        textAlign: 'center',
        fontSize: fontSize(14),// 14,
        marginTop: verticalScale(3)
    },
    note_input_mode: {
        color: '#B2B2B2',
        textAlign: 'center',
        fontSize: fontSize(11, -scale(3)),// 11,
        paddingBottom: verticalScale(3),

    },
    view_note: {
        flex: 1,
        borderBottomColor: '#262626',
        borderBottomWidth: scale(1),
        justifyContent: 'center'
    }
});