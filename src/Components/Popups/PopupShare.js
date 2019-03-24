import React from 'react';
import {View,Dimensions,TouchableOpacity,Text} from 'react-native';
import BaseComponent from '../../Core/View/BaseComponent';
import { scale, verticalScale, fontSize } from '../../Config/RatioScale';
let{width,height} = Dimensions.get('window');
import PopupDialog, { SlideAnimation } from 'react-native-popup-dialog';
let popupWidth = width - scale(40);
let buttonWidth = popupWidth / 3;
import PropStatic from '../../Constant/PropsStatic';

export default class PopupShare extends BaseComponent{
    constructor(props){
        super(props);
    }

    onShareInApp(){
        let navigation = PropStatic.getAppSceneNavigator();
        if(!navigation) return;
        
    }

    render(){
        return(
            <PopupDialog
                ref={(popupDialog) => { this.popupDialog = popupDialog; }}
                dialogAnimation={slideAnimation}
                dialogStyle={styles.popup_style}>
                <View style={{flex : 1,alignItems : 'center'}}>
                    <View style={styles.title_view}>
                        <Image
                            style={styles.title_image}
                            source={this.getResources().logo_popup}
                        />
                        <Text allowFontScaling={global.isScaleFont} style={styles.title_text}>{this.t('share')}</Text>
                    </View>

                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center',padding : verticalScale(10) }}>
                        <Text style={{fontSize : fontSize(18,scale(4)),color : 'black'}}>
                            Chia sẻ trong nhóm chát
                        </Text>
                        <Text style={{fontSize : fontSize(18,scale(4)),color : 'black'}}>
                            Chia sẻ
                        </Text>
                    </View>
                </View>
            </PopupDialog>
        );
    }
}

const styles = StyleSheet.create({
    popup_style: {
        width: popupWidth,
        height: verticalScale(250),
        backgroundColor: '#fff'
    },
    title_view: {
        height: verticalScale(40),
        width: popupWidth,
        flexDirection: 'row',
        alignItems: "center",
        backgroundColor: '#f0f0f0',
        borderTopLeftRadius: 5,
        borderTopRightRadius: 5
    },

    ok_text: {
        textAlign: 'center',
        fontSize: fontSize(20, scale(6)),// 20,
        color: '#fff',
        fontWeight: "bold"
    },

    ok_view: {
        width: buttonWidth,
        height: verticalScale(40),
        marginTop: verticalScale(10),
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#00aba7'
    },

    bottom_view: {
        height: verticalScale(70),
        justifyContent: 'center',
        alignItems: 'center'
    },

    msg_view: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'blue'
    },

    msg_text: {
        //flex: 1,
        alignSelf: 'center',
        margin: scale(10),
        fontSize: fontSize(18, scale(4)),// 14,
        color: '#685d5d',
        textAlignVertical: 'center',
        // textAlign: 'center'
    },

    title_text: {
        flex: 1,
        textAlign: 'center',
        fontSize: fontSize(26, scale(12)),// 26,
        color: '#685d5d',
        fontWeight: 'bold'
    },
    title_image: {
        width: verticalScale(35),
        height: verticalScale(35),
        marginLeft: scale(5),
        marginTop: verticalScale(2),
        resizeMode: 'contain'
    },
    title_container: {
        flexDirection: 'row',
        // justifyContent: 'center',
        alignItems: 'center',
        minHeight: verticalScale(40)
    },
});