import React from 'react';
import { Platform, StyleSheet, Text, View, Dimensions } from 'react-native';
import Touchable from 'react-native-platform-touchable';
import BaseComponent from '../../../Core/View/BaseComponent';
import { scale, verticalScale, fontSize } from '../../../Config/RatioScale';
import { version } from 'punycode';
let { width, height } = Dimensions.get('window');

export default class IndicatorHomeView extends BaseComponent {

    static defaultProps = {

    }

    constructor(props) {
        super(props);
        this.state = {
            flight_group: this.t('finish_flight'),
            indicator_custom_page1: '#00BAB6',
            indicator_custom_page2: '#D9D9D9',
            unFinishCount: ''
        }
    }

    setDataChange(viewPageIndex, unFinishCount) {
        if (viewPageIndex === 0) {
            this.setState({
                flight_group: this.t('finish_flight'),
                indicator_custom_page1: '#00BAB6',
                indicator_custom_page2: '#D9D9D9',
                unFinishCount: unFinishCount > 0 ? ` (${unFinishCount})` : ''
            });
        } else {
            this.setState({
                flight_group: this.t('friend_flight'),
                indicator_custom_page1: '#D9D9D9',
                indicator_custom_page2: '#00BAB6',
                unFinishCount: ''
            });
        }
    }

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.flight_group} >
                    <Text allowFontScaling={global.isScaleFont} style={styles.flight_group_text}>{this.state.flight_group}
                        <Text allowFontScaling={global.isScaleFont} style={{ color: 'red', fontSize: fontSize(14) }}>{this.state.unFinishCount}</Text>
                    </Text>
                    <View style={styles.indicator_group} >
                        <View style={[styles.indicator_custom, { backgroundColor: this.state.indicator_custom_page1 }]} />
                        <View style={[styles.indicator_custom, { backgroundColor: this.state.indicator_custom_page2 }]} />
                    </View>
                </View>
                {/* <View style={styles.indicator_group} >
                    <View style={[styles.indicator_custom, { backgroundColor: this.state.indicator_custom_page1 }]} />
                    <View style={[styles.indicator_custom, { backgroundColor: this.state.indicator_custom_page2 }]} />
                </View> */}
                <View style={styles.indicator_line}></View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#FFFFFF',
    },
    flight_group: {
        // height: verticalScale(40),
        paddingTop: verticalScale(5),
        paddingBottom : verticalScale(5),
        backgroundColor: '#F2F2F2',
        alignItems: 'center',
        justifyContent: 'center'
    },
    indicator_group: {
        flexDirection: 'row',
        // height: verticalScale(30),
        alignItems: 'center',
        justifyContent: 'center'
    },
    indicator_line: {
        height: verticalScale(1),
        backgroundColor: '#E3E3E3',
    },
    flight_group_text: {
        color: '#716A6A',
        fontWeight: 'bold',
        fontSize: fontSize(14)
    },
    indicator_custom: {
        // height: verticalScale(2),
        // width: scale(50),
        // margin: verticalScale(5)
        width: verticalScale(12),
        height: verticalScale(12),
        borderRadius: verticalScale(6),
        margin: scale(3)
    },
});