import React from 'react';
import {
    Platform,
    StyleSheet,
    Text,
    View,
    Animated,
} from 'react-native';
import Touchable from 'react-native-platform-touchable';
import BaseComponent from '../../../../Core/View/BaseComponent';
import { scale, verticalScale, moderateScale, fontSize } from '../../../../Config/RatioScale';
import CustomRate from './CustomRating';
import TextCount from './TextCount';
import LinearGradient from 'react-native-linear-gradient';

export default class DescriptionView extends BaseComponent {

    static defaultProps = {

    }

    constructor(props) {
        super(props);

        this.expandHeight = verticalScale(100);
        this.state = {
            isExpand: false,
            animationHeight: new Animated.Value(verticalScale(100)),
            description: ''
        }
        this.onExpandRemotePress = this.onExpandRemotePress.bind(this);
        this.handleHeaderLayout = this.handleHeaderLayout.bind(this);
    }

    render() {
        let {
            isExpand,
            animationHeight,
            description
        } = this.state;
        return (
            <View style={styles.container}>
                <View style={styles.view_title}>
                    <Text allowFontScaling={global.isScaleFont} style={styles.txt_title}>{this.t('mo_ta').toUpperCase()}</Text>
                    <View style={{ flex: 1 }} />
                    <TextCount ref={(refCountUserRate) => { this.refCountUserRate = refCountUserRate; }}
                        style={{ fontSize: fontSize(14), color: '#9c9c9c', marginRight: scale(8) }} count={0} />
                    <CustomRate ref={(rateView) => { this.rateView = rateView; }}
                        style={{ marginRight: scale(10) }}
                        imageSize={verticalScale(15)} />
                </View>
                <View style={styles.line}/>
                <Animated.View style={{ height: animationHeight }}>
                    <Text allowFontScaling={global.isScaleFont} style={styles.txt_description}
                        onLayout={this.handleHeaderLayout}>{description}</Text>
                </Animated.View>
                <Touchable style={styles.touchable_remote}
                    onPress={this.onExpandRemotePress}>
                    <LinearGradient colors={['rgba(255,255,255,0.5)', 'rgba(255,255,255,0.8)', 'rgba(255,255,255,0.9)', 'rgba(255,255,255,1)']}
                        style={styles.linear_gradient}>
                        <Text allowFontScaling={global.isScaleFont} style={styles.txt_remote}>{isExpand ? this.t('it_hon') : this.t('xem_them')}</Text>
                    </LinearGradient>

                </Touchable>
            </View>
        );
    }

    setDescription(description = '', totalRate = 0) {
        this.setState({
            description: description
        }, ()=>{
            this.refCountUserRate.updateValue(totalRate);
            this.rateView.setRateValue(totalRate);
        })
    }

    handleHeaderLayout(event) {
        const { x, y, width, height } = event.nativeEvent.layout
        console.log('handleHeaderLayout', x, y, width, height)
        this.expandHeight = height;
    }

    onExpandRemotePress() {
        let {
            isExpand
        } = this.state;
        console.log('onExpandRemotePress', isExpand)
        if (isExpand) {
            this.setState({
                isExpand: false
            }, () => {
                this.setCollapse();
            })
        } else {
            this.setState({
                isExpand: true
            }, () => {
                this.setExpand();
            })
        }
    }

    setCollapse() {
        let finalValue = verticalScale(100);

        Animated.spring(
            this.state.animationHeight,
            {
                toValue: finalValue
            }
        ).start();

    }

    setExpand() {
        let finalValue = verticalScale(this.expandHeight);

        Animated.spring(
            this.state.animationHeight,
            {
                toValue: finalValue
            }
        ).start();
    }

}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#FFFFFF',
    },
    txt_title: {
        fontSize: fontSize(17, scale(6)),
        color: '#424242',
        fontWeight: 'bold',
        marginLeft: scale(10),
        marginTop: scale(10),
        marginBottom: scale(10)
    },
    view_title: {
        flexDirection: 'row',
        height: verticalScale(40),
        alignItems: 'center',
    },
    line: {
        backgroundColor: '#d6d4d4',
        height: 1,
        marginLeft: scale(10),
        marginRight: scale(10)
    },
    txt_description: {
        color: '#424242',
        fontSize: fontSize(14),
        marginLeft: scale(10),
        marginRight: scale(10)
    },
    txt_remote: {
        fontSize: fontSize(14),
        color: '#00ABA7',
        paddingBottom: scale(7),
        paddingTop: scale(7)
    },
    touchable_remote: {

    },
    linear_gradient: {
        justifyContent: 'center',
        alignItems: 'center',
    }
});