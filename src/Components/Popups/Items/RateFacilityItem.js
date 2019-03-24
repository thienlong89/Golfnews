import React from 'react';
import { Image, View, TouchableWithoutFeedback } from 'react-native';
import BaseComponent from '../../../Core/View/BaseComponent';
import Touchable from 'react-native-platform-touchable';

export default class RateFacilityItem extends BaseComponent {
    constructor(props) {
        super(props);
        this.state = {
            tintColor: '#bdbdbd'
        }
        this.onClick = this.onClick.bind(this);
        this.isSelected = false;
    }

    onClick() {
        let {disable_click } = this.props;
        if(disable_click) return;
        this.isSelected = !this.isSelected;
        if (this.isSelected) {
            this.rate();
        } else {
            this.unRate();
        }
        let { clickCallback } = this.props;
        if (clickCallback) clickCallback();
    }

    rate() {
        // if(!this.isSelected) this.isSelected = true;
        // console.log('....................rate item');
        this.setState({
            tintColor: '#f2c94c'
        });
    }

    unRate() {
        // if(this.isSelected) this.isSelected = false;
        this.setState({
            tintColor: '#bdbdbd'
        });
    }

    render() {
        let { style, disable_click } = this.props;
        let { tintColor } = this.state;
        // if (!disable_click) {
            return (
                <TouchableWithoutFeedback onPress={this.onClick}>
                    <Image style={[style, { tintColor: tintColor, resizeMode: 'contain' }]} source={this.getResources().ic_star} />
                </TouchableWithoutFeedback>
            );
        // } else {
        //     return (
        //         <Image style={[style, { tintColor: tintColor, resizeMode: 'contain' }]} source={this.getResources().ic_star} />
        //     );
        // }
    }
}