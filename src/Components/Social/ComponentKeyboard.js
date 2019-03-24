import React from 'react';
import BaseComponent from '../../Core/View/BaseComponent';
import MyView from '../../Core/View/MyView';

export default class ComponentKeyboard extends BaseComponent{

    constructor(props){
        super(props);
        this.state = {
            keyboard_height : 0,
            keyboard_show : false
        }
    }

    /**
     * Xu ly khi ban phim tat/mo
     * @param {*} height 
     * @param {*} isShow 
     */
    handleKeyboard(height,isShow){
        this.setState({
            keyboard_height : height,
            keyboard_show : isShow
        });
    }

    render(){
        let{keyboard_height,keyboard_show} = this.state;
        return(
            <MyView style={{ height: keyboard_height }} hide={!keyboard_show}></MyView>
        );
    }
}