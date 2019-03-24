import React from 'react';
import BaseComponent from "../../Core/View/BaseComponent";
import { View, Image, Dimensions, Text, StyleSheet, TextInput } from "react-native";
import { Constants } from '../../Core/Common/ExpoUtils';
import Touchable from 'react-native-platform-touchable';

export default class SharePosts extends BaseComponent{
    constructor(props){
        super(props);
    }

    render(){
        return(
            <View style={{position : 'absolute',top : 0,left : 0,right : 0,bottom : 0,backgroundColor : 'rgba(0, 0, 0, 0.6)',justifyContent : 'flex-end'}}>
                <View style={{backgroundColor : '#fff',borderTopLeftRadius : 5,borderTopRightRadius : 5}}>

                </View>
                <View style={{backgroundColor : '#00aba7',justifyContent : 'center',alignItems : 'center',height : 50,flex : 1}}>
                    <Text allowFontScaling={global.isScaleFont} style={{fontSize : 14,color : '#fff',textAlign :'center'}}>{this.t('share_')}</Text>
                </View>
            </View>
        );
    }
}