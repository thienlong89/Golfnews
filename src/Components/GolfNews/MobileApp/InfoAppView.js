import React from 'react';
import { View, Dimensions, Image, Text, TouchableWithoutFeedback, BackHandler, StyleSheet, Animated } from 'react-native';
import BaseComponent from '../../../Core/View/BaseComponent';
import PopupInfoApp from './Shares/PopupInfoApp';
let { width, height } = Dimensions.get('window');
let body_width = Math.round(3 * width / 4);

export default class InfoAppView extends BaseComponent {
    constructor(props) {
        super(props);
        this.onTouchOutClick = this.onTouchOutClick.bind(this);
        this.backHandler = null;
        this.state = {
            show: false,
            // translateXValue: new Animated.Value(-body_width),
        }
    }

    isShowed(){
        return this.state.show;
    }

    hideChild(){
        if(this.refPopupInfoApp){
            this.refPopupInfoApp.hide(this.hide.bind(this));
        }
    }

    show(){
        let{show} = this.state;
        if(show) return;
        this.setState({
            show : true
        },()=>{
            setTimeout(()=>{
                if(this.refPopupInfoApp){
                    this.refPopupInfoApp.show();
                }
            },200);
        });
    }

    hide(){
        let{show} = this.state;
        if(!show) return ;
        this.setState({
            show : false
        });
    }

    componentDidMount() {
        this.backHandler = BackHandler.addEventListener('hardwareBackPress', this.onTouchOutClick);
    }

    componentWillUnmount() {
        if (this.backHandler) this.backHandler.remove();
    }

    onTouchOutClick() {
        if(this.refPopupInfoApp){
            this.refPopupInfoApp.hide(this.hide.bind(this));
        }
    }

    render() {
        let { show,translateXValue } = this.state;
        if(!show) return null;
        return (
            <View style={{ position: 'absolute', top: 0, left: 0, bottom: 0, right: 0, backgroundColor: 'rgba(0,0,0,0.5)', flexDirection: 'row' }}>

                <PopupInfoApp ref={(refPopupInfoApp)=>{this.refPopupInfoApp = refPopupInfoApp;}}/>
                <TouchableWithoutFeedback onPress={this.onTouchOutClick}>
                    <View style={{ flex: 1, backgroundColor: 'transparent' }}>

                    </View>
                </TouchableWithoutFeedback>
            </View>

        );
    }
}

const styles = StyleSheet.create({
    item_view: {
        height: 60,
        width: body_width,
        flexDirection: 'row',
        alignItems: 'center'
    },

    ic_img: {
        width: 30,
        height: 30,
        resizeMode: 'contain',
        marginLeft: 15
    },

    title_text: {
        flex: 1,
        fontSize: 14,
        color: '#292929',
        textAlign: 'center'
    }
});