import React from 'react';
import BaseComponent from "../../Core/View/BaseComponent";
import { View, Image, Dimensions, Text, StyleSheet, TextInput } from "react-native";
import { Constants } from '../../Core/Common/ExpoUtils';
import Touchable from 'react-native-platform-touchable';

export default class PostsHeader extends BaseComponent {
    constructor(props) {
        super(props);
        this.backCallback = null;
        this.state = {
            textSearch : ''
        }
    }

    onBackClick() {
        if (this.backCallback) {
            this.backCallback();
        }
    }

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.body}>
                    <Touchable style={styles.touch} onPress={this.onBackClick.bind(this)}>
                        <Text allowFontScaling={global.isScaleFont} style={{fontSize : 14,color : '#00aba7',fontWeight : 'bold'}}>{this.t('cancel_title')}</Text>
                    </Touchable>
                    <View style={{flex : 1,alignItems : 'center'}}>
                        <Text allowFontScaling={global.isScaleFont} style={{fontSize : 20,color : '#000',fontWeight : 'bold'}}>{this.t('create_posts')}</Text>
                    </View>
                    <Touchable style={styles.touch} onPress={this.onBackClick.bind(this)}>
                        <Text allowFontScaling={global.isScaleFont} style={{fontSize : 14,color : '#00aba7',fontWeight : 'bold'}}>{this.t('share')}</Text>
                    </Touchable>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container : {
        height: 80, 
        backgroundColor: '#f2f2f2' 
    },
    search_img : {
        width: 20, 
        height: 20, 
        marginLeft: 5, 
        resizeMode: 'contain',
        tintColor : '#dadada'
    },
    search_view : {
        height: 30, 
        flex: 1, 
        marginLeft: 10, 
        marginRight: 10, 
        flexDirection: 'row', 
        alignItems: 'center', 
        borderRadius: 15, 
        backgroundColor: 'rgba(0, 0, 0, 0.2)'
    },
    back_img :{
        marginLeft: 10, 
        width: 30, 
        height: 30, 
        resizeMode: 'contain' 
    },
    touch : {
        width: 60, 
        height: 30,
        justifyContent: 'center', 
        alignItems: 'center',
    },
    body : {
        marginTop: 30, 
        flexDirection: 'row', 
        alignItems: 'center',
        flex: 1
    },
    container_body_view_inputtext: {
        flex: 1, 
        paddingLeft: 10,
        fontSize: 14,
        lineHeight : 16,
        color : '#fff',
        paddingTop: 0,
        paddingBottom: 0
    },
});