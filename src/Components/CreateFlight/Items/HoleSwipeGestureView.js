import React from 'react';
import { Platform, StyleSheet, Text, View, Image, Dimensions } from 'react-native';
import Touchable from 'react-native-platform-touchable';
import BaseComponent from '../../../Core/View/BaseComponent';
import MyView from '../../../Core/View/MyView';
import GestureRecognizer from 'react-native-swipe-gestures';
import AnimatedLinearGradient from 'react-native-animated-linear-gradient';

import { scale, verticalScale, fontSize } from '../../../Config/RatioScale';

const config = {
    velocityThreshold: 0.3,
    directionalOffsetThreshold: 40
};

const colorAnimate = {
    left: [
        '#FFFFFF',
        '#00ABA7',
    ],
    right: [
        '#00ABA7',
        '#FFFFFF',
    ]
}

export default class HoleSwipeGestureView extends BaseComponent {

    static defaultProps = {
        flightDetailModel: null,
        hold_selected: 0
    }

    constructor(props) {
        super(props);
        this.holeLength = 18;
        this.state = {
            hold_selected: this.props.hold_selected,
            flightDetailModel: this.props.flightDetailModel,
            isShowAnimation: false,
            animateDirection: colorAnimate.left
        }
    }

    setHolePosition(position) {
        this.setState({
            hold_selected: position
        });
    }

    setData(flightDetailModel) {
        this.setState({
            flightDetailModel: flightDetailModel
        });
    }

    render() {

        let {
            flightDetailModel,
            hold_selected,
            isShowAnimation,
            animateDirection
        } = this.state;

        if (flightDetailModel) {
            let holdList = flightDetailModel.getFlight().getUserRounds()[0].getHoldUserList();
            this.holeLength = holdList.length;
            let holdIndex = parseInt(hold_selected);

            let holdLeft = holdIndex > 0 ? holdIndex : 0;
            let parLeft = holdIndex > 0 ? holdList[holdIndex - 1].getPar() : 0;

            let holdRight = holdIndex + 2;
            let parRight = (holdIndex < this.holeLength - 1) ? holdList[holdIndex + 1].getPar() : 0;

            let parCenter = holdList[holdIndex].getPar();

            return (
                <GestureRecognizer
                    onSwipeLeft={(state) => this.onSwipeLeft(state)}
                    onSwipeRight={(state) => this.onSwipeRight(state)}
                    config={config}
                    style={{
                        backgroundColor: '#FFFFFF'
                    }}>
                    <View style={styles.hold_swipe_group}>
                        <MyView hide={hold_selected === 0}>
                            <Touchable onPress={this.onSwipeRightAction.bind(this, false)}>
                                <View style={styles.hold_swipe_left}>
                                    <Image
                                        style={styles.icon_arrow}
                                        source={this.getResources().ic_arrow_left_dark}
                                    />
                                    <View>
                                        <Text allowFontScaling={global.isScaleFont} style={styles.text_hold_swipe}>HOLE {holdLeft}</Text>
                                        <Text allowFontScaling={global.isScaleFont} style={styles.text_par_swipe}>PAR {parLeft}</Text>
                                    </View>
                                </View>
                            </Touchable>
                        </MyView>

                        <View style={styles.hold_swipe_center}>
                            <Text allowFontScaling={global.isScaleFont} style={styles.text_hold_swipe_center}>HOLE {holdIndex + 1}</Text>
                            <Text allowFontScaling={global.isScaleFont} style={styles.text_par_swipe_center}>PAR {parCenter}</Text>
                        </View>

                        <MyView hide={hold_selected === holdList.length - 1}>
                            <Touchable onPress={this.onSwipeLeftAction.bind(this, false)}>
                                <View style={styles.hold_swipe_right}>
                                    <View>
                                        <Text allowFontScaling={global.isScaleFont} style={styles.text_hold_swipe}>HOLE {holdRight}</Text>
                                        <Text allowFontScaling={global.isScaleFont} style={styles.text_par_swipe}>PAR {parRight}</Text>
                                    </View>
                                    <Image
                                        style={styles.icon_arrow}
                                        source={this.getResources().ic_arrow_right_dark}
                                    />
                                </View>
                            </Touchable>
                        </MyView>
                    </View>
                    <MyView hide={!isShowAnimation} style={{ position: 'absolute', right: 0, left: 0, top: 0, bottom: 0 }}>
                        <AnimatedLinearGradient
                            customColors={animateDirection}
                            speed={500}
                            points={{ start: { x: 0, y: 0 }, end: { x: 1, y: 0 } }} />
                    </MyView>
                </GestureRecognizer>
            );
        } else {
            return null;
        }

    }

    onSwipeLeft(gestureState) {
        this.onSwipeLeftAction(true);
    }

    onSwipeRight(gestureState) {
        this.onSwipeRightAction(true);
    }

    onSwipeRightAction(isSwipe = false) {
        let holeSelected = parseInt(this.state.hold_selected);
        if (holeSelected > 0) {
            this.setState({
                hold_selected: holeSelected - 1,
                animateDirection: colorAnimate.right,
                isShowAnimation: isSwipe
            }, () => {
                if (isSwipe) {
                    setTimeout(() => {
                        this.setState({
                            isShowAnimation: false
                        });
                    }, 300);
                }
            });
            if (this.props.onSwipeRightAction) {
                this.props.onSwipeRightAction(holeSelected - 1);
            }
        }
    }

    onSwipeLeftAction(isSwipe = false) {
        let holeSelected = parseInt(this.state.hold_selected);
        if (holeSelected < this.holeLength - 1) {
            this.setState({
                hold_selected: holeSelected + 1,
                animateDirection: colorAnimate.left,
                isShowAnimation: isSwipe
            }, () => {
                if (isSwipe) {
                    setTimeout(() => {
                        this.setState({
                            isShowAnimation: false
                        });
                    }, 300);
                }

            });
            if (this.props.onSwipeLeftAction) {
                this.props.onSwipeLeftAction(holeSelected + 1);
            }
        }
    }

}

const styles = StyleSheet.create({
    hold_swipe_group: {
        height: verticalScale(50),
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: scale(10),
        marginRight: scale(10)
    },
    hold_swipe_left: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    hold_swipe_center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    hold_swipe_right: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    icon_arrow: {
        height: verticalScale(20),
        width: scale(20),
        resizeMode: 'contain'
    },
    text_hold_swipe: {
        fontSize: fontSize(11, -scale(3)),// 11,
        color: '#666666'
    },
    text_par_swipe: {
        fontSize: fontSize(11, -scale(3)),// 11,
        color: '#9E9E9E'
    },
    text_hold_swipe_center: {
        fontSize: fontSize(15),// 15,
        color: '#212121'
    },
    text_par_swipe_center: {
        fontSize: fontSize(15),// 15,
        color: '#9E9E9E'
    },
});