import BaseComponent from "../../../Core/View/BaseComponent";
import React from 'react';
import {Text} from 'react-native';

export default class TextEnterScoreCard extends BaseComponent{


    reRender(){
        this.setState({});
    }

    render(){
        let{style} = this.props;
        return(
            <Text allowFontScaling={global.isScaleFont} style={style}>{this.t('enter_score_upper_case')}</Text>
        );
    }
}