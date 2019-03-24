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
    Dimensions,
    Alert,
    Image,
    ListView,
    Modal,
    TextInput,
} from 'react-native';
import Touchable from 'react-native-platform-touchable';
import BaseComponent from '../../Core/View/BaseComponent';
import { verticalScale, scale, fontSize } from '../../Config/RatioScale';
//import DisplayHTML from 'react-native-display-html';
//import HTLMText from 'react-native-htmltext';

const TAG = "[Vhandicap-v1] PopupVerifiedPhone : ";
let screenWidth = Dimensions.get('window').width;
let popupWidth = screenWidth - 40;
let popupHeight = (2 * popupWidth) / 3;
let buttonWidth = popupWidth / 2;

//type Props = {};
export default class PopupVerifiedPhone extends BaseComponent {
    constructor(props) {
        super(props);
        this.state = {
            isShow: false,
            input1: '',
            input2: '',
            input3: '',
            input4: '',
        }
    }

    onSubmmitEditing1() {

    }

    onSubmmitEditing2() {

    }

    onSubmmitEditing3() {

    }

    onSubmmitEditing4() {

    }

    dimiss(){
        this.setState({
            isShow : false,
        });
    }

    render() {
        return (
            <Modal
                transparent={true}
                animationType={'fade'}
                visible={this.state.isShow}
                onRequestClose={() => { console.log('close modal') }}>
                <View style={styles.modalBackground}>
                    <View style={{ width: popupWidth, height: popupHeight, backgroundColor: '#fff', borderColor: '#fff', borderWidth: 1, borderRadius: 5 }}>
                        <Text allowFontScaling={global.isScaleFont} style={{ height: 30, textAlign: 'center', fontSize: 20, fontWeight: 'bold', color: '#454545', marginTop: 15 }}>{this.t('verified')}</Text>
                        <Text allowFontScaling={global.isScaleFont} style={{ height: 40, textAlign: 'center', fontSize: 14, color: '#979797', marginTop: 5 }}>{this.t('verified_phone')}</Text>

                        <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                            <TextInput allowFontScaling={global.isScaleFont} style={styles.input_phone}
                                ref={(textInputSearch) => { this.textInputSearch = textInputSearch; }}
                                placeholder='1'
                                placeholderTextColor='#a1a1a1'
                                underlineColorAndroid='#919191'
                                onSubmitEditing={this.onSubmmitEditing1.bind(this)}
                                onChangeText={(text) => this.setState({
                                    input1: text
                                })}
                                value={this.state.input1} />
                            <TextInput allowFontScaling={global.isScaleFont} style={styles.input_phone}
                                ref={(textInputSearch) => { this.textInputSearch = textInputSearch; }}
                                placeholder='2'
                                placeholderTextColor='#a1a1a1'
                                underlineColorAndroid='#919191'
                                onSubmitEditing={this.onSubmmitEditing2.bind(this)}
                                onChangeText={(text) => this.setState({
                                    input2: text
                                })}
                                value={this.state.input2}>
                            </TextInput>
                            <TextInput allowFontScaling={global.isScaleFont} style={styles.input_phone}
                                ref={(textInputSearch) => { this.textInputSearch = textInputSearch; }}
                                placeholder='3'
                                placeholderTextColor='#a1a1a1'
                                underlineColorAndroid='#919191'
                                onSubmitEditing={this.onSubmmitEditing3.bind(this)}
                                onChangeText={(text) => this.setState({
                                    input3: text
                                })}
                                value={this.state.input3}>
                            </TextInput>
                            <TextInput allowFontScaling={global.isScaleFont} style={styles.input_phone}
                                ref={(textInputSearch) => { this.textInputSearch = textInputSearch; }}
                                placeholder='4'
                                placeholderTextColor='#a1a1a1'
                                underlineColorAndroid='#919191'
                                onSubmitEditing={this.onSubmmitEditing4.bind(this)}
                                onChangeText={(text) => this.setState({
                                    input4: text
                                })}
                                value={this.state.input4}>
                            </TextInput>
                        </View>
                        <View style={{ height: 60, flexDirection: 'row', borderTopWidth: 0.5, borderTopColor: '#adadad' }}>
                            <View style={{ width: buttonWidth, height: 60, justifyContent: 'center', alignItems: 'center' }}>
                                <Text allowFontScaling={global.isScaleFont} style={{ textAlign: 'center', fontSize: 16, color: '#757575' }}>{this.t('bo_qua')}</Text>
                            </View>
                            <View style={{ width: buttonWidth, height: 60, justifyContent: 'center', alignItems: 'center', borderLeftWidth: 0.5, borderLeftColor: '#adadad' }}>
                                <Text allowFontScaling={global.isScaleFont} style={{ textAlign: 'center', fontSize: 16, color: '#757575' }}>{this.t('agree')}</Text>
                            </View>
                        </View>
                    </View>
                </View>
            </Modal>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
    },

    input_phone: {
        width: verticalScale(40),
        height: verticalScale(40),
        marginLeft: scale(5),
        fontSize: fontSize(40,scale(26)),
        fontWeight: 'bold',
        color: '#919191',
        paddingTop: 0,
        paddingBottom: 0,
        lineHeight : fontSize(44,scale(30))
    },

    modalBackground: {
        flex: 1,
        alignItems: 'center',
        flexDirection: 'column',
        justifyContent: 'space-around',
        backgroundColor: '#00000040'
    },
});