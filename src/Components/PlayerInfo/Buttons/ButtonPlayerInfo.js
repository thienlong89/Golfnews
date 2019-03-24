import React from 'react';
import {StyleSheet,View,Image,TouchableOpacity,Text} from 'react-native';
import BaseComponent from '../../../Core/View/BaseComponent';
import { verticalScale, fontSize, scale } from '../../../Config/RatioScale';

/**
 * Cac button trong màn hình playerinfo như certificate,chat....
 */
export default class ButtonPlayerInfo extends BaseComponent {
    constructor(props) {
        super(props);
        this.onClick = this.onClick.bind(this);
        this.state = {
            show : false
        }

        this.onClickCallback = null;
    }

    onClick(){
        // let{onClick} = this.props;
        // if(onClick){
        //     onClick();
        // }
        if(this.onClickCallback){
            this.onClickCallback();
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

    /**
     * Thay đổi view cho button
     * @param {*} source 
     * @param {string} name 
     */
    changeView(source,name){
        if(source){
            this.props.source = source;
        }
        if(name && name.length){
            this.props.name = name;
        }
        this.setState({
            show : true
        });
    }

    render() {
        let{source,name} = this.props;
        let{show} = this.state;
        if(!show || !source || !name) return null;
        return (
            <TouchableOpacity onPress={this.onClick} style={styles.touchable_item}>
                <View style={styles.view_item}>
                    <Image
                        style={styles.img_icon}
                        source={source} />
                    <Text allowFontScaling={global.isScaleFont} style={styles.txt_title}>
                        {name}
                    </Text>
                </View>
            </TouchableOpacity>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        marginTop: 10
    },
    touchable_item: {
        flex: 1,
        minHeight: verticalScale(50)
    },
    view_item: {
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    img_icon: {
        width: verticalScale(25),
        height: verticalScale(25),
        resizeMode: 'contain',
        // tintColor: '#00BAB6'
    },
    txt_title: {
        color: '#00BAB6',
        fontSize: fontSize(10,-scale(3)),
        textAlign: 'center'
    }
});