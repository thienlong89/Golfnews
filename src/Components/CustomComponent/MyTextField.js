import React from 'react';
import {
    // StyleSheet,
    // Text,
    // View,
    // Image,
    // Dimensions,
    //ListView,
    // TextInput,
    Keyboard,
    TouchableWithoutFeedback
} from 'react-native';
import Touchable from 'react-native-platform-touchable';
import { TextField } from 'react-native-material-textfield';
import BaseComponent from '../../Core/View/BaseComponent';

export default class MyTextField extends BaseComponent {
    constructor(props) {
        super(props);
        this.submitCallback = null;
        this.focusCallback = null;
        this.enableSearchCallback = null;
        this.disableSearchCallback = null;
        this.state = {
            txtSearch: '',
            editable: false,
            isHide: false
        }
        this.isSetValue = false;

        this.onChangeText = this.onChangeText.bind(this);
    }

    hide() {
        this.setState({
            isHide: true
        })
    }

    show() {
        let { isHide } = this.state;
        if (!isHide) return;
        this.setState({
            isHide: false
        });
    }

    componentDidMount() {
        // this.setState({
        //     txtSearch: this.props.defaultValue
        // });
    }

    /**
     * Cho phep editable textinput
     */
    enable() {
        this.setState({
            editable: true
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
        if (this.submitCallback) {
            this.submitCallback(this.state.txtSearch);
        }
    }

    /**
     * set gia tri cho text input
     * @param {*} _value 
     */
    setValue(_value) {
        this.isSetValue = true;
        this.setState({
            txtSearch: _value
        });
    }

    getValue() {
        return this.state.txtSearch;
    }

    focus() {
        this.textFieldFacility.focus();
    }

    /**
     * Goi khi text input bị focus
     */
    onFocus() {
        // this.setState({
        //     txtSearch: ''
        // });
        if (this.focusCallback) {
            this.focusCallback();
        }
    }

    onChangeText(text){
        // this.setState({ txtSearch: text });
        console.log('...................change text : ', text);
        this.state.txtSearch = text;
        if (this.submitCallback) {
            this.submitCallback(text);
        }
        // console.log("change text : ",text);
        // if(this.enableSearch){
        //     this.enableSearch();
        // }
    }

    blur() {
        this.textFieldFacility.blur();
    }

    clear() {
        // this.textFieldFacility.cl
    }

    render() {
        let { txtSearch, editable, isHide } = this.state;
        let { style,autoFocus, onBlur, onFocus, onSubmitEditing, keyboardType, labelFontSize, label, tintColor, lineWidth, activeLineWidth, disabledLineWidth, fontSize, errorColor, multiline } = this.props;
        // if(isHide) return null;

        // if (!this.isSetValue) {
        //     return (
        //         <TextField allowFontScaling={global.isScaleFont}
        //             ref={(textFieldFacility) => { this.textFieldFacility = textFieldFacility; }}
        //             containerStyle={style}
        //             label={label}
        //             tintColor={tintColor}
        //             lineWidth={lineWidth}
        //             // labelHeight={this.props.labelHeight}
        //             activeLineWidth={activeLineWidth}
        //             underlineColorAndroid='rgba(0,0,0,0)'
        //             titleFontSize={labelFontSize}
        //             disabledLineWidth={disabledLineWidth}
        //             labelFontSize={labelFontSize}
        //             fontSize={fontSize}
        //             keyboardType={keyboardType}
        //             multiline={multiline}
        //             onSubmitEditing={onSubmitEditing}
        //             onFocus={onFocus}
        //             onBlur={onBlur}
        //             errorColor={errorColor}
        //             // value={txtSearch}
        //             onChangeText={(input) => { this.onChangeText(input) }} />
        //     );
        // } else {
        return (
            <TouchableWithoutFeedback onPress={Keyboard.dismiss()}>
                <TextField allowFontScaling={global.isScaleFont}
                    ref={(textFieldFacility) => { this.textFieldFacility = textFieldFacility; }}
                    containerStyle={style}
                    label={label}
                    tintColor={tintColor}
                    lineWidth={lineWidth}
                    // labelHeight={this.props.labelHeight}
                    activeLineWidth={activeLineWidth}
                    underlineColorAndroid='rgba(0,0,0,0)'
                    titleFontSize={labelFontSize}
                    disabledLineWidth={disabledLineWidth}
                    labelFontSize={labelFontSize}
                    fontSize={fontSize}
                    keyboardType={keyboardType}
                    multiline={multiline}
                    onSubmitEditing={onSubmitEditing}
                    onFocus={onFocus}
                    errorColor={errorColor}
                    value={txtSearch}
                    autoFocus={autoFocus}
                    onChangeText={this.onChangeText}
                />
            </TouchableWithoutFeedback>
        );
        // }
    }
}