import React from 'react';
import {StyleSheet, Text,ImageBackground } from 'react-native';
import Touchable from 'react-native-platform-touchable';
import BaseComponent from '../../../Core/View/BaseComponent';
import MyView from '../../../Core/View/MyView';
import { verticalScale, fontSize, scale } from '../../../Config/RatioScale';

export default class CountEvent extends BaseComponent {
    constructor(props) {
        super(props);
        this.callbackEventClick = null;
        this.state = {
            count_event: 10
        }
    }

    setEventCount(_event_count) {
        this.setState({
            count_event: _event_count
        });
    }

    onEventClick() {
        if (this.callbackEventClick) {
            this.callbackEventClick();
        }
    }

    render() {
        let { count_event } = this.state;
        return (
            <MyView style={[styles.my_view, this.props.style]} hide={(count_event === 0)}>
                <Touchable onPress={this.onEventClick.bind(this)}>
                    <ImageBackground style={styles.image_background}
                        source={this.getResources().bg_notifi_count}>
                        <Text allowFontScaling={global.isScaleFont} style={styles.text_count}>{count_event}</Text>
                    </ImageBackground>
                </Touchable>
            </MyView>
        );
    }
}

const styles = StyleSheet.create({
    my_view: {
        position: 'absolute',
        alignItems: 'center',
        justifyContent: 'center'
    },

    image_background: {
        alignItems: 'center',
        justifyContent: 'center',
        width: verticalScale(22),
        height: verticalScale(22)
    },

    text_count: {
        fontSize: fontSize(10,-scale(4)),
        color: '#fff',
        textAlign: 'center'
    }
});