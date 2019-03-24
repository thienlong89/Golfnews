import React from 'react';
import {
    View,
    TextInput,
    Keyboard
} from 'react-native';
import BaseComponent from '../../Core/View/BaseComponent';
import { fontSize, scale, verticalScale } from '../../Config/RatioScale';

export default class MyTextInput extends BaseComponent {
    constructor(props) {
        super(props);
        this.submitCallback = null;
        this.focusCallback = null;
        this.state = {
            txtSearch: '',
            editable: false,
            multiline: false
        }

        this.onBlur = this.onBlur.bind(this);
        this.onFocus = this.onFocus.bind(this);
        this.onSubmitEditing = this.onSubmitEditing.bind(this);
        this.text = '';
    }

    componentDidMount() {
        let { enable } = this.props;
        if (enable) {
            this.setState({
                editable: true,
                txtSearch: this.props.defaultValue
            });
        } else {
            this.setState({
                txtSearch: this.props.defaultValue
            });
        }
    }

    /**
     * Cho phep editable textinput
     */
    enable(multiline = false) {
        this.setState({
            editable: true,
            multiline: multiline
        });
    }

    /**
     * khong cho editable textinput
     */
    disable() {
        this.setState({
            editable: false
        });
    }

    onSubmitEditing() {
        // if(this.submitCallback){
        //     this.submitCallback(this.state.txtSearch);
        // }
    }

    /**
     * set gia tri cho text input
     * @param {*} _value 
     */
    setValue(_value) {
        this.setState({
            txtSearch: _value
        });
        this.onBlur();
    }

    focus() {
        this.inputName.focus();
    }

    /**
     * Goi khi text input bị focus
     */
    onFocus() {
        this.setState({
            txtSearch: ''
        });
        if (this.focusCallback) {
            this.focusCallback();
        }
    }

    onChangeText(text) {
        this.text = text;
        this.setState({ txtSearch: text });
        if (this.submitCallback) {
            this.submitCallback(text);
        }
    }

    getValue() {
        return this.text;
    }

    clear() {
        this.inputName.clear();
    }

    onBlur() {
        this.inputName.blur();
    }

    render() {
        let { txtSearch, editable, multiline } = this.state;
        return (
            <View style={this.props.style}>
                {/* <TouchableNativeFeedback onPress={Keyboard.dismiss()}> */}
                <TextInput allowFontScaling={global.isScaleFont}
                    style={{
                        color: '#424242', paddingTop: 0, paddingBottom: 0, paddingLeft: 0, paddingRight: 0,
                        fontWeight: this.props.fontWeight ? this.props.fontWeight : 'normal',
                        fontSize: this.props.fontSize ? this.props.fontSize : fontSize(15, scale(1)),
                        lineHeight: this.props.lineHeight ? this.props.lineHeight : fontSize(15, scale(1) + verticalScale(4))
                    }}//flex : 1,
                    ref={(inputName) => { this.inputName = inputName; }}
                    onChangeText={(text) => { this.onChangeText(text) }}
                    editable={editable}
                    value={txtSearch}
                    onBlur={this.onBlur}
                    multiline={multiline}
                    onFocus={this.onFocus}
                    placeholder={this.props.placeholder}//this.props.defaultValue
                    onSubmitEditing={this.onSubmitEditing}
                    placeholderTextColor='#424242'
                    underlineColorAndroid='rgba(0,0,0,0)'
                >
                </TextInput>
                {/* </TouchableNativeFeedback> */}
            </View>
        );
    }
}