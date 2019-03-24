import React from 'react';
import {
    TextInput,
    Keyboard
} from 'react-native';
import BaseComponent from "../../../Core/View/BaseComponent";

export default class TextInputCheckHandicap extends BaseComponent {
    constructor(props) {
        super(props);
        this.state = {
            textSearch: ''
        }

        this.onFocus = this.onFocus.bind(this);
    }

    setTitle(title, callback = null) {
        this.setState({
            textSearch: title
        }, () => {
            if (callback) {
                callback();
            }
        });
    }

    onFocus() {
        let { onFocusCallback } = this.props;
        if (onFocusCallback) {
            onFocusCallback();
        }
    }

    onChangeText(text) {
        this.setState({
            textSearch: text
        });
        let { onChangeTextCallback } = this.props;
        if (onChangeTextCallback) {
            onChangeTextCallback(text);
        }
    }

    blur() {
        if (this.inputText) {
            this.inputText.blur();
        }
    }

    render() {
        let { style } = this.props;
        return (
                <TextInput allowFontScaling={global.isScaleFont}
                    ref={(inputText) => { this.inputText = inputText; }}
                    style={style}
                    onChangeText={(text) => { this.onChangeText(text) }}
                    value={this.state.textSearch}
                    placeholder={this.t('choosen_check_handicap')}
                    placeholderTextColor='#a1a1a1'
                    onFocus={this.onFocus}
                    // onSubmitEditing={this.onSearchClick.bind(this)}
                    underlineColorAndroid='rgba(0,0,0,0)'
                />
        );
    }
}