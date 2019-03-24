import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View, ImageBackground, Dimensions } from 'react-native';
import Touchable from 'react-native-platform-touchable';
import AppUtil from '../../../Config/AppUtil';
import Files from '../../Common/Files';
import {scale, verticalScale, fontSize} from '../../../Config/RatioScale';
// let{width,height} = Dimensions.get('window');

const ICON_OVER = {
    CIRCLE: Files.sprites.ic_score_circle,
    RECTANGLE: Files.sprites.ic_score_rectangle,
    TRITANGLE: Files.sprites.ic_score_tritangle
}

export default class InputScoreItemView extends Component {

    static defaultProps = {
        hole: {},
        isGrossMode: true
    }

    constructor(props) {
        super(props);
    }

    render() {
        let holeProps = this.props.hole;
        let score = this.props.isGrossMode ? holeProps.getGross() : (holeProps.getGross() != 0 ? AppUtil.convertGrossToOVer(parseInt(holeProps.getGross()), parseInt(holeProps.getPar())) : '');
        let over = parseInt(holeProps.getGross()) - parseInt(holeProps.getPar());
        return (
            <View style={styles.container}>
                <Text allowFontScaling={global.isScaleFont} style={styles.text_index}>{holeProps.getHoleStt()}</Text>
                <Text allowFontScaling={global.isScaleFont} style={styles.text_index_par}>{holeProps.getPar()}</Text>
                <Text allowFontScaling={global.isScaleFont} style={styles.text_index}>{holeProps.getHoleIndex()}</Text>
                <ImageBackground style={styles.view_score}
                    imageStyle={{ resizeMode: 'contain', tintColor: '#7E7D7E' }}
                    source={!this.props.isGrossMode || holeProps.getGross() === 0 || over > 0 ? '' : (over === 0 ? ICON_OVER.CIRCLE : (over === -1 ? ICON_OVER.TRITANGLE : ICON_OVER.RECTANGLE))}>
                    <Text allowFontScaling={global.isScaleFont} style={styles.text_input_score}>{!this.props.isGrossMode || score != '' ? score : ''}</Text>
                </ImageBackground>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    text_index: {
        color: '#828282',
        textAlign: 'center',
        borderColor: '#BDBDBD',
        borderWidth:  scale(0.5),
        paddingTop: verticalScale(5),
        paddingBottom: verticalScale(5),
        backgroundColor: '#F3F3F3',
        //fontSize : fontSize(11,-scale(6)),
    },
    text_index_par: {
        color: '#828282',
        textAlign: 'center',
        borderColor: '#BDBDBD',
        borderWidth: scale(0.5),
        paddingTop: verticalScale(5),
        paddingBottom: verticalScale(5),
        backgroundColor: '#FFE88B',
        //fontSize : width*0.037-scale(4),
    },
    text_input: {
        color: '#1F1F1F',
        textAlign: 'center',
        borderColor: '#BDBDBD',
        borderWidth: scale(0.5),
        paddingTop: verticalScale(5),
        paddingBottom: verticalScale(5),
        //fontSize : width*0.037-scale(4),
    },
    text_input_score: {
        color: '#1F1F1F',
        textAlign: 'center',
        paddingTop: verticalScale(5),
        paddingBottom: verticalScale(5) ,
        //fontSize : width*0.037-scale(6),
    },
    text_input_score_border: {
        color: '#1F1F1F',
        textAlign: 'center',
        borderColor: '#BDBDBD',
        borderWidth: scale(0.5),
        paddingTop: verticalScale(5),
        paddingBottom: verticalScale(5),
        //fontSize : width*0.037-scale(6),
    },
    triangle_shape: {

    },
    view_score: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        borderColor: '#BDBDBD',
        borderWidth: scale(0.5)
    },
    image_view_score: {
        position: 'absolute',
        justifyContent: 'center',
        alignItems: 'center',
        resizeMode: 'stretch',
    }
});