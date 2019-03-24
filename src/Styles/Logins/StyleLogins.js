import React from 'react';
import { Platform, StyleSheet, Text, View, Image, TextInput, TouchableOpacity } from 'react-native';
import { scale, fontSize, verticalScale } from '../../Config/RatioScale';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'space-between',
        backgroundColor: '#fff'
    },
    view_logo: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 50
    },
    txt_title: {
        color: '#0A0A0A',
        fontSize: fontSize(15),
        fontWeight: '500',
        textAlign: 'center',
        marginTop: scale(50)
    },
    view_bottom: {
        alignItems: 'center',
        marginBottom: scale(30)
    },
    view_power_by: {
        flexDirection: 'row',
        // justifyContent: 'center',
        alignItems: 'center',
    },
    txt_powered: {
        color: '#0A0A0A',
        fontSize: fontSize(13),
        marginBottom: scale(5)
    },
    img_vgs_holding: {
        height: scale(40),
        // width: scale(200),
        resizeMode: 'contain',
    },
    txt_copyright: {
        color: '#585858',
        fontSize: fontSize(11),
        marginTop: scale(10)
    },
    view_vhandicap: {
        height: verticalScale(80),
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        opacity: 0.5
    },
    logo: {
        height: verticalScale(80),
        width: verticalScale(80),
        resizeMode: 'contain'
    },
    img_vhandicap: {
        ...Platform.select({
            ios: {
                height: scale(55)
            },
            android: {
                height: scale(50),
            }
        }),
        width: null,
        resizeMode: 'contain'
    },
    txt_official_handicap: {
        color: '#0A0A0A',
        fontSize: fontSize(11, -2),
    }, 
    view_opacity: {
        flex: 1,
        // width: screenWidth,
        backgroundColor: '#fff',
        opacity: 0.5
    },
    row_center: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 20
    },
    left: {
        flex: 1,
        justifyContent: 'center'
    },
    middle: {
        flex: 5,
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    bottom: {
        position: 'absolute',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
        bottom: 0
    },
    right: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'flex-end'
    },
    password: {
        flex: 1,
        paddingLeft: 4
    },
    signin_button: {
        backgroundColor: "#00ABA7",
        height: 45,
        marginLeft: 30,
        marginRight: 30,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 20
    },
    signup_button: {
        backgroundColor: "#00C25D",
        height: 45,
        marginLeft: 30,
        marginRight: 30,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 20
    },
    logo: {
        height: 80,
        width: 80
    },

    text_forgot_pass: {
        color: '#0BACA7',
        alignItems: 'center',
        justifyContent: 'center',
    },
    text_input_background: {
        flexDirection: 'row',
        marginLeft: 30,
        marginRight: 30,
        backgroundColor: '#FFFFFF',
        height: 40,
        borderColor: '#C2C2C2',
        borderRadius: 20,
        borderWidth: 1,
        alignItems: 'center'
    },
    text_input_margin: {
        paddingLeft: 4
    },
    password_view: {
        flexDirection: 'row',
        marginTop: 8,
        alignItems: 'center',
        justifyContent: 'center',
        paddingRight: 3
    },
    visible_pass: {
        height: 15,
        width: 25,
        resizeMode: 'contain'
    },
    error_text: {
        color: '#FF0000',
        marginLeft: 30,
        marginRight: 30,
        marginTop: 15,
        fontSize: 14,
        marginBottom: 5
    },
    language_group: {
        flexDirection: 'row',
        height: 50,
        alignItems: 'center',
        justifyContent: 'center'
    },
    vietnam: {
        marginLeft: 5,
        marginRight: 5,
        color: '#657D00'
    },
    english: {
        marginLeft: 5,
        marginRight: 5,
        //color: '#919191'
    },
    img_icon: {
        width: 23,
        height: 23,
        marginLeft: 10,
    },
    txt_triangle: {
        color: '#7E7E7E',
        fontSize: 13,
        marginLeft: 5,
        marginRight: 5
    },
    input_captcha: {
        flex: 1,
        padding: 4,
        fontSize: 14,
        lineHeight: 18,
        height: 40,
        backgroundColor: '#fff',
        borderRadius: 20,
        borderColor: '#C2C2C2',
        borderWidth: 1,
        textAlign: 'center'
    },
    image_captcha_container: {
        height: 40,
        backgroundColor: '#EEEEEE',
        borderRadius: 18,
        justifyContent: 'center',
        alignItems: 'center'
    },

});

module.exports = styles;
