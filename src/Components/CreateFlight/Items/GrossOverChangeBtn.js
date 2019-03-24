import React from 'react';
import { Platform, StyleSheet, Text, View,Dimensions } from 'react-native';
import Touchable from 'react-native-platform-touchable';
import BaseComponent from '../../../Core/View/BaseComponent';
import {scale, verticalScale, fontSize} from '../../../Config/RatioScale';

export default class GrossOverChangeBtn extends BaseComponent {

    static defaultProps = {

    }

    constructor(props) {
        super(props);
        this.state = {
            isGrossMode: true
        }
    }

    setChangeScoreState(isGrossMode){
        this.setState({
            isGrossMode: isGrossMode
        });
    }

    render() {
        return (
            <View style={styles.touchable_over_gross}>
                <Touchable onPress={this.onChangeScoreMode.bind(this)}>
                    <Text allowFontScaling={global.isScaleFont} style={styles.text_gross_over}>{this.state.isGrossMode ? 'Over' : 'Gross'}</Text>
                </Touchable>
            </View>
        );
    }

    onChangeScoreMode(){
        this.setState({
            isGrossMode: !this.state.isGrossMode
        });
        if(this.props.onChangeScoreMode){
            this.props.onChangeScoreMode();
        }
    }


}

const styles = StyleSheet.create({
    touchable_over_gross: {
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: scale(10)
    },
    text_gross_over: {
        color: '#00ABA7',
        fontSize: fontSize(15),// 15,
        paddingTop: verticalScale(10),
        paddingBottom: verticalScale(10),
        minWidth: verticalScale(80),
        borderColor: '#00ABA7',
        borderWidth: 1,
        textAlign: 'center'
    },
});