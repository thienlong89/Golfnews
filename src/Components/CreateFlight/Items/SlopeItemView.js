import React from 'react';
import {
    Platform,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import BaseComponent from '../../../Core/View/BaseComponent';
import { scale, verticalScale, moderateScale, fontSize } from '../../../Config/RatioScale';

export default class SlopeItemView extends BaseComponent {

    static defaultProps = {
        teeInfo: '',
        isMen: true
    }

    constructor(props) {
        super(props);

        this.state = {

        }

    }

    shouldComponentUpdate() {
        return false;
    }

    renderSlopeRating(slope, rating, isMen) {
        if (!slope || !rating) return null;
        slope = isMen? slope.men: slope.women;
        rating = isMen? rating.men: rating.women;
        return (
            <View style={{ marginLeft: scale(5) }}>
                <Text allowFontScaling={global.isScaleFont} style={[styles.txt_tee_slope_title]}>
                    Slope:
                        <Text allowFontScaling={global.isScaleFont} style={styles.txt_tee_slope_value}>
                        {slope}
                    </Text>
                </Text>
                <Text allowFontScaling={global.isScaleFont} style={[styles.txt_tee_slope_title]}>
                    Rating:
                        <Text allowFontScaling={global.isScaleFont} style={styles.txt_tee_slope_value}>
                        {rating}
                    </Text>
                </Text>
            </View>
        )
    }

    render() {
        let {
            teeInfo,
            isMen
        } = this.props;
        console.log('teeInfo', teeInfo);
        let slope = teeInfo.slope;
        let rating = teeInfo.rating;
        return (
            <View style={styles.tee_info_container}>
                {/* <View style={[styles.view_tee_color, { backgroundColor: teeInfo.getTeeColor() }]} /> */}
                <View style={[styles.view_tee_color, { backgroundColor: teeInfo.color }]} />
                {this.renderSlopeRating(slope, rating, isMen)}
            </View>
        );
    }


}

const styles = StyleSheet.create({
    tee_info_container: {
        flexDirection: 'row',
        height: verticalScale(30),
        // justifyContent: 'flex-start',
        alignItems: 'center',
    },
    view_tee_color: {
        width: verticalScale(23),
        height: verticalScale(23),
        borderWidth: scale(1),
        borderColor: '#A1A1A1',
        marginLeft: scale(5)
    },
    txt_tee_slope_title: {
        color: '#716A6A',
        fontSize: fontSize(13, -scale(3)),// 13,
        includeFontPadding: false
    },
    txt_tee_slope_value: {
        color: '#716A6A',
        fontWeight: 'bold',
        fontSize: fontSize(13, -scale(3)),// 13,
        includeFontPadding: false
    },
});