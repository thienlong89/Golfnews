import React from 'react';
import BaseComponent from "../../../../Core/View/BaseComponent";
import MyView from '../../../../Core/View/MyView';
import MyTextInput from '../../../Common/MyTextInput';
import { Image } from 'react-native';
import { scale, verticalScale } from '../../../../Config/RatioScale';

export default class CountryDropdown extends BaseComponent {
    constructor(props) {
        super(props);
        this.state = {
            isShow: false
        }
    }

    show(callback = null) {
        let { isShow } = this.state;
        if (isShow) return;
        let self = this;
        this.setState({
            isShow: true
        }, () => {
            setTimeout(() => {
                // self.textInputState.enable();
                if (self.textInputState) {
                    self.textInputState.focusCallback = self.focus.bind(self);
                    self.textInputState.submitCallback = self.submit.bind(self);
                }
                if (callback) {
                    callback();
                }
            }, 50)
        });
    }

    hide(callback = null) {
        let { isShow } = this.state;
        if (!isShow) return;
        this.setState({
            isShow: false
        }, () => {
            if (callback) {
                setTimeout(callback(), 50);
            }
        });
    }

    componentDidMount() {

    }

    focus() {
        let { focus } = this.props;
        if (focus) {
            focus();
        }
    }

    submit(text) {
        let { submit } = this.props;
        if (submit) {
            submit(text);
        }
    }

    textInputFocus() {
        if (this.textInputState)
            this.textInputState.focus();
    }

    setValue(val) {
        if (this.textInputState)
            this.textInputState.setValue(val);
    }

    enableTextInput() {
        if (!this.textInputState) return;
        this.textInputState.enable();
    }

    disableTextInput() {
        if (!this.textInputState) return;
        this.textInputState.disable();
    }

    render() {
        let { style, placeholder } = this.props;
        let { isShow } = this.state;
        return (
            <MyView style={style} hide={!isShow}>
                <MyTextInput ref={(textInputState) => { this.textInputState = textInputState; }}

                    style={{ flex: 1, marginLeft: scale(10), justifyContent: 'center' }}
                    enable={true}
                    // defaultValue={this.t('state_city')} 
                    placeholder={placeholder} />
                <Image
                    style={{ width: scale(23), height: verticalScale(23), resizeMode: 'contain', alignSelf: 'center', marginRight: scale(5) }}
                    source={this.getResources().ic_arrow_down}
                />
            </MyView>
        );
    }
}