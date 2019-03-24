import React from 'react';
import { View, Text, Image, Dimensions, StyleSheet } from 'react-native';
import BaseComponent from '../../../../Core/View/BaseComponent';
import { fontSize, scale, verticalScale } from '../../../../Config/RatioScale';
import MyView from '../../../../Core/View/MyView';
let { width } = Dimensions.get('window');
import Touchable from 'react-native-platform-touchable';
// let view_width = width - scale(20);
let btn_width = parseInt((width - scale(50)) / 2);

export default class ComAcceptFriend extends BaseComponent {
    constructor(props) {
        super(props);
        this.state = {
            show: false,
            // icon : this.getResources().ic_unfriend,
            // txt : this.t('reject_add_friend')
        }
        this.onAcceptClick = this.onAcceptClick.bind(this);
        this.onDenyClick = this.onDenyClick.bind(this);

        this.onDenyCallback = null;
        this.onAcceptCallback = null;
    }

    onAcceptClick(){
        if(this.onAcceptCallback){
            this.onAcceptCallback();
        }
    }

    onDenyClick(){
        if(this.onDenyCallback){
            this.onDenyCallback();
        }
    }

    show(){
        let{show} = this.state;
        if(show) return;
        this.setState({
            show : true
        });
    }

    hide(){
        let{show} = this.state;
        if(!show) return;
        this.setState({
            show : false
        });
    }

    updateData(friend_status,puid){
        if(friend_status === 2){
            this.puid = puid;
            this.show();
        }
    }

    render() {
        let { show } = this.state;
        return (
            <MyView style={styles.container} hide={!show}>
                <Text allowFontScaling={global.isScaleFont} style={styles.txt_title}>{this.t('sent_invite')}</Text>
                <View style={styles.content}>
                    <Touchable onPress={this.onDenyClick}>
                        <View style={[styles.view_btn, { backgroundColor: 'white' }]}>
                            <Text allowFontScaling={global.isScaleFont} style={[styles.btn_text, { color: '#5e5e5e' }]}>{this.t('deny')}</Text>
                        </View>
                    </Touchable>
                    <Touchable onPress={this.onAcceptClick}>
                        <View style={[styles.view_btn, { backgroundColor: '#00aba7' }]}>
                            <Text allowFontScaling={global.isScaleFont} style={[styles.btn_text, { color: 'white' }]}>{this.t('chap_nhan')}</Text>
                        </View>
                    </Touchable>
                </View>
            </MyView>
        );
    }
}

const styles = StyleSheet.create({

    container: {
        alignItems: 'center',
        // paddingLeft: scale(10),
        // paddingRight: scale(10),
        marginTop: verticalScale(10),
        borderColor: 'rgba(0,0,0,0.3)',
        borderRadius: 5,
        borderWidth: 1,
        marginLeft : scale(10),
        marginRight : scale(10),
        paddingBottom : verticalScale(10)
    },

    content: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: verticalScale(5)
    },

    txt_title: {
        fontSize: fontSize(16, scale(2)),
        color: '#666',
        textAlign: 'center'
    },

    btn_text: {
        marginLeft: scale(15),
        fontSize: fontSize(16, scale(2)),
        // color: '#343434'
    },

    view_btn: {
        width: btn_width,
        height: verticalScale(40),
        borderColor: 'rgba(0,0,0,0.3)',
        borderRadius: 5,
        borderWidth: 1,
        marginLeft: scale(10),
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    },

    btn_img: {
        width: verticalScale(30),
        height: verticalScale(30),
        marginLeft: scale(15),
        resizeMode: 'contain',
        tintColor: '#282828'
    }
});