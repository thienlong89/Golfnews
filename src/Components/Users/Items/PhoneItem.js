/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    TextInput,
    Dimensions,
    TouchableOpacity
} from 'react-native';
import Touchable from 'react-native-platform-touchable';
import BaseComponent from '../../../Core/View/BaseComponent';
const TAG = "[Vhandicap-v1] PhoneItem : ";

import { scale, verticalScale, fontSize } from '../../../Config/RatioScale';
let { width, height } = Dimensions.get('window');

let screenWidth = Dimensions.get('window').width - scale(15);
//type Props = {};
export default class PhoneItem extends BaseComponent {
    constructor(props) {
        super(props);
        this.state = {
            txtPhone: '',
            isEditAble: false
        }

        this.onClick = this.onClick.bind(this);
    }

    static defaultProps = {
        phone: '',
        isAdded: false,
        view_label: true,
    }

    componentDidMount() {
        // this.setState({
        //     txtPhone: this.props.phone,
        //     add: this.props.add
        // });
    }

    onClick() {
        let {
            isAdded,
            onPhoneChangePress
        } = this.props;

        if (onPhoneChangePress) {
            onPhoneChangePress(isAdded);
        }
    }

    renderBtnEdit(isEditable) {
        if (isEditable) {
            return (
                <TouchableOpacity onPress={this.onClick}>
                    <Image
                        style={styles.image_add}
                        source={this.props.isAdded ? this.getResources().remove_phone : this.getResources().add_phone}
                    />
                </TouchableOpacity>
            )
        }
        return null;
    }

    render() {
        let {
            isEditable
        } = this.state;

        let {
            phone
        } = this.props;
        return (
            <View style={styles.container}>
                <Text allowFontScaling={global.isScaleFont}
                    style={styles.item_label}>
                    {this.props.view_label ? this.t('phone_number') : ''}
                </Text>
                <View style={styles.input_view}>
                    <TextInput allowFontScaling={global.isScaleFont}
                        style={styles.item_input}
                        // onChangeText={(text) => this.setState({ txtPhone: text })}
                        value={phone}
                        placeholder=''
                        editable={false}
                        placeholderTextColor='#424242'
                        underlineColorAndroid='rgba(0,0,0,0)'
                    >
                    </TextInput>

                    {this.renderBtnEdit(isEditable)}
                </View>
            </View>
        );
    }

    setEditAble(isEditable = false) {
        this.setState({
            isEditable: isEditable
        })
    }
}

const styles = StyleSheet.create({
    container: {
        height: verticalScale(40),
        flexDirection: 'row',
        backgroundColor: '#fff',
        alignItems: 'center'
    },

    item_label: {
        flex: 0.9,
        // width : (2*screenWidth)/5+scale(20), 
        fontSize: fontSize(16),//16,
        color: '#a6a6a6',
        marginLeft: scale(10),
        textAlignVertical: 'center'
    },

    item_input: {
        flex: 1,
        fontSize: fontSize(16),// 16,
        lineHeight: fontSize(20, verticalScale(4)),// verticalScale(20),
        color: '#424242',
        paddingTop: 0,
        paddingBottom: 0
    },

    input_view: {
        // flex: 0.6,
        // width : (3*screenWidth)/5-scale(20), 
        flex: 1.8,
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomColor: '#ebebeb',
        borderBottomWidth: 1
    },

    image_add: {
        width: scale(22),
        height: scale(22),
        resizeMode: 'contain',
        marginRight: scale(7)
    }
});