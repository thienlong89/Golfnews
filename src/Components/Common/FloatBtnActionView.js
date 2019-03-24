import React from 'react';
import {
    Platform,
    StyleSheet,
    Text,
    Image,
    Animated
} from 'react-native';
import Touchable from 'react-native-platform-touchable';
import BaseComponent from '../../Core/View/BaseComponent';
import { View } from 'react-native-animatable';
import { scale, verticalScale, fontSize } from '../../Config/RatioScale';

const SCROLL_HEIGHT = verticalScale(0);

export default class FloatBtnActionView extends BaseComponent {

    static defaultProps = {
        icon: '',
        isShowing: true
    }

    constructor(props) {
        super(props);
        this.state = {
            translateYValue: new Animated.Value(this.props.isShowing ? SCROLL_HEIGHT : 100),
        }
        this.onFloatActionPress = this.onFloatActionPress.bind(this);
    }

    shouldComponentUpdate() {
        return false;
    }

    renderText() {
        let { text } = this.props;
        if (text) {
            return (
                <Text allowFontScaling={global.isScaleFont} style={styles.txt_content}>{text}</Text>
            )
        } else {
            return null;
        }
    }

    render() {
        let { translateYValue } = this.state;

        return (
            <Animated.View style={[styles.view_container, {
                zIndex: 1,
                transform: [{ translateY: translateYValue }],
            }]}
                ref={(refViewAnimation) => { this.refViewAnimation = refViewAnimation }}>
                <Touchable style={styles.touchable_share_logo}
                    onPress={this.onFloatActionPress} >
                    <View style={styles.view_content}>
                        <Image
                            style={styles.img_share_logo}
                            source={this.props.icon}
                        />
                        {this.renderText()}
                    </View>
                </Touchable>
                {/* </View> */}
            </Animated.View>
        );

    }

    setVisible(isShowBtn = false) {
        if (isShowBtn) {
            this.show();
        } else {
            this.hide();
        }
    }

    onFloatActionPress() {
        if (this.props.onFloatActionPress) {
            this.props.onFloatActionPress();
        }
    }

    show(props) {
        const { opacityValue, translateYValue } = this.state;

        Animated.parallel([
            //   Animated.timing(opacityValue, {
            //     toValue: 1,
            //     ...rest,
            //   }),
            Animated.timing(translateYValue, {
                toValue: SCROLL_HEIGHT,
            }),
        ]).start(() => {

        });
    }

    hide(props) {
        const { translateYValue } = this.state;
        Animated.parallel([
            //   Animated.timing(opacityValue, {
            //     toValue: opacityMin,
            //     ...rest,
            //   }),
            Animated.timing(translateYValue, {
                toValue: 100,
            }),
        ]).start(() => {

        });
    }

}

const styles = StyleSheet.create({
    view_container: {
        position: 'absolute',
        right: scale(5),
        bottom: verticalScale(5),
        padding: 10
    },
    touchable_share_logo: {
        // position: 'absolute',
        // right: scale(10),
        // bottom: verticalScale(10),
        width: verticalScale(56),
        height: verticalScale(56),
        backgroundColor: '#00ABA7',
        borderRadius: verticalScale(28),
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: 'black',
        shadowRadius: verticalScale(2),
        shadowOffset: {
            width: 0,
            height: -3,
        },
        elevation: 4,
    },
    img_share_logo: {
        width: verticalScale(23),
        height: verticalScale(23),
        resizeMode: 'contain'
    },
    txt_content: {
        color: '#fff',
        fontSize: fontSize(13, -scale(1))
    },
    view_content: {
        justifyContent: 'center',
        alignItems: 'center'
    }
});