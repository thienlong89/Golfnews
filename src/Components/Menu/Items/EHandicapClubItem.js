import React from 'react';
import {
    Text,
    View,
} from 'react-native';
import BaseComponent from '../../../Core/View/BaseComponent';

export default class EHandicapClubItem extends BaseComponent{
    constructor(props){
        super(props);
    }

    static defaultProps = {
        data : null
    }

    render(){
        let{data} = this.props;
        return(
            <View style={{height : 40}}>
                <Text allowFontScaling={global.isScaleFont} style={{flex : 1,fontSize : 16,margin : 10,color : '#000',textAlignVertical : 'center'}}>{data.name}</Text>
            </View>
        );
    }
}
