import React from 'react';
import { View, Text } from 'react-native';
import BaseComponent from '../../../../Core/View/BaseComponent';
import {scale,verticalScale,fontSize} from '../../../../Config/RatioScale';

export default class ComHeader extends React.Component {
    constructor(props) {
        super(props);
    }

    shouldComponentUpdate(){
        return false;
    }

    render() {
        let{title} = this.props;
        return (
            <View style={{ borderTopLeftRadius: 5, borderTopRightRadius: 5, backgroundColor: '#efeff4', height: verticalScale(30), justifyContent: "center", alignItems: 'center' }}>
                <Text allowFontScaling={global.isScaleFont} style={{ fontSize: fontSize(16, scale(2)), color: '#444' }}>{title.toUpperCase()}</Text>
            </View>
        );
    }
}