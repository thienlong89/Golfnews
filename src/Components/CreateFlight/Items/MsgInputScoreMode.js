import React from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';
import BaseComponent from '../../../Core/View/BaseComponent';
import GestureRecognizer, { swipeDirections } from 'react-native-swipe-gestures';
import { fontSize, verticalScale, scale } from '../../../Config/RatioScale';

const config = {
    velocityThreshold: 0.3,
    directionalOffsetThreshold: 40
};

export default class MsgInputScoreMode extends BaseComponent {

    static defaultProps = {
        isGrossMode: true
    }

    constructor(props) {
        super(props);
        this.state = {
            isGrossMode: this.props.isGrossMode
        }
    }

    render() {
        return (
            <GestureRecognizer
                onSwipeLeft={(state) => this.onSwipeLeft(state)}
                onSwipeRight={(state) => this.onSwipeRight(state)}
                config={config}
                style={styles.gesture_recognizer}>
                <View style={styles.container_view}>
                    <Text allowFontScaling={global.isScaleFont} style={styles.current_input_mode}>{this.state.isGrossMode ? this.t('current_gross') : this.t('current_over')}</Text>
                    <Text allowFontScaling={global.isScaleFont} style={styles.note_input_mode}>{this.state.isGrossMode ? this.t('in_gross_mode') : this.t('in_over_mode')}</Text>
                </View>

            </GestureRecognizer>

        );
    }

    setChangeState(isGrossMode){
        this.setState({
            isGrossMode: isGrossMode
        })
    }

    onSwipeLeft(state) {
        console.log('onSwipeLeft');
        // if (!this.state.isGrossMode) {
        //     this.setState({
        //         isGrossMode: true
        //     });
        //     this.changeInputMode(true);
        // }
        this.setState({
            isGrossMode: !this.state.isGrossMode
        });
        this.changeInputMode(!this.state.isGrossMode);
    }

    onSwipeRight(state) {
        console.log('onSwipeRight');
        // if (this.state.isGrossMode) {
        //     this.setState({
        //         isGrossMode: false
        //     });
        //     this.changeInputMode(false);
        // }
        this.setState({
            isGrossMode: !this.state.isGrossMode
        });
        this.changeInputMode(!this.state.isGrossMode);
    }

    changeInputMode(isGrossMode) {
        if (this.props.changeInputMode) {
            this.props.changeInputMode(isGrossMode);
        }
    }

}

const styles = StyleSheet.create({
    container_view: {
        paddingTop:  verticalScale(3),
        paddingBottom: verticalScale(3),
        justifyContent: 'center',
        alignItems: 'center'
    },
    current_input_mode: {
        color: '#00ABA7',
        textAlign: 'center',
        fontSize: fontSize(14)
    },
    note_input_mode: {
        color: '#B2B2B2',
        textAlign: 'center',
        fontSize: fontSize(11,-scale(3))
    },
    gesture_recognizer: {
        backgroundColor: '#444444',
        borderBottomWidth: 1,
        borderBottomColor: '#262626'
    }
});