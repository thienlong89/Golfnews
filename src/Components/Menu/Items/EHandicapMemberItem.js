import React from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    Dimensions
} from 'react-native';
// import { TextField } from 'react-native-material-textfield';
// import Touchable from 'react-native-platform-touchable';
import BaseComponent from '../../../Core/View/BaseComponent';
import {scale, verticalScale, fontSize} from '../../../Config/RatioScale';
let{width,height} = Dimensions.get('window');

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
            <View style={{height : verticalScale(50),justifyContent : 'center'}}>
                <Text allowFontScaling={global.isScaleFont} style={{fontSize : fontSize(12,-scale(2)),margin : scale(10),color : '#000',textAlignVertical : 'center'}}>{data.member_name} - {data.member_handicap}</Text>
            </View>
        );
    }
}
