import React from 'react';
import BaseComponent from "../../Core/View/BaseComponent";
import { View, Image, KeyboardAvoidingView, ListView, StyleSheet, Keyboard, Dimensions } from "react-native";
import Touchable from 'react-native-platform-touchable';
import ButtonImage from '../Chats/Items/ButtonImage';
import MyView from '../../Core/View/MyView';

export default class BottomView extends BaseComponent {
    constructor(props) {
        super(props);
        this.state = {
            smile_click : false,
            isShow : true
        }
    }

    onSmileClick(){
        let{smile_click} = this.state;
        this.setState({
            smile_click : !smile_click
        });
        let{onSmileClickCallback} = this.props;
        if(onSmileClickCallback){
            onSmileClickCallback(!smile_click);
        }
    }

    hideButtonSmile(){
        this.setState({
            smile_click : false
        });
    }

    onSendFileClick(){
        this.setState({
            smile_click : false
        });
        let{onSendFileClickCallback} = this.props;
        if(onSendFileClickCallback){
            onSendFileClickCallback();
        }
    }

    onCameraClick(){
        this.setState({
            smile_click : false
        });
        let{onCameraClickCallback} = this.props;
        if(onCameraClickCallback){
            onCameraClickCallback();
        }
    }

    onScaleFontClick(){
        let{onScaleFontClickCallback} = this.props;
        if(onScaleFontClickCallback){
            this.btnScaleFont.changeState();
            onScaleFontClickCallback();
        }
    }

    render() {
        let{smile_click,isShow} = this.state;
        let{style} = this.props;
        return (
            <MyView style={style ? style : styles.view_bottom} hide={!isShow}>
                {/* <Touchable onPress={this.onSmileClick.bind(this)}>
                    <Image
                        style={styles.img_smile}
                        source={smile_click ? this.getResources().icon_smile_choosen : this.getResources().chat_icon_smile}
                    />
                </Touchable> */}
                <Touchable onPress={this.onCameraClick.bind(this)}>
                    <Image
                        style={styles.img_camera}
                        source={this.getResources().chat_icon_camera}
                    />
                </Touchable>
                <Touchable onPress={this.onSendFileClick.bind(this)}>
                    <Image
                        style={styles.img_smile}
                        source={this.getResources().chat_icon_send_file}
                    />
                </Touchable>
                <Touchable onPress={this.onScaleFontClick.bind(this)}>
                    <ButtonImage ref={(btnScaleFont) => { this.btnScaleFont = btnScaleFont; }}
                        style={styles.img_font_scale}
                        source={this.getResources().scale_font} />
                </Touchable>
            </MyView>
        );
    }
}

const styles = StyleSheet.create({
    view_bottom: {
        height: 30,
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
        backgroundColor: '#fff',
        // marginBottom: 10
    },

    img_smile: {
        width: 30,
        height: 30,
        resizeMode: 'contain',
        marginLeft: 20
    },

    img_font_scale: {
        width: 30,
        height: 30,
        resizeMode: 'contain',
        marginLeft: 25
    },

    img_camera: {
        width: 40,
        height: 28,
        resizeMode: 'contain',
        marginLeft: 20
    },
});