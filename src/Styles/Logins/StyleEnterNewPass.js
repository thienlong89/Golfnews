import { Platform, StyleSheet,Dimensions} from 'react-native';
import {scale, verticalScale, fontSize} from '../../Config/RatioScale';
let{width,height} = Dimensions.get('window');

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF'
    },

    text_msg : {
        color : '#3B3B3B',
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize : fontSize(16,scale(2)),// 16,
        marginTop : verticalScale(35),
        marginLeft : scale(30),
        marginRight : scale(30),
        color : '#8A8A8F',
        textAlign: 'center'
    },

    text_input_background: {
        marginLeft: scale(30),
        marginRight: scale(30),
        borderRadius: scale(5),
        borderColor: '#ADADAD',
        borderWidth: scale(1),
        backgroundColor: '#FFFFFF',
        height: verticalScale(40)
    },
    text_input_margin: {
        paddingLeft: scale(4)
    },
    password_view: {
        flexDirection: 'row',
        marginTop: verticalScale(8),
        alignItems: 'center',
        justifyContent: 'center',
        paddingRight: scale(3)
    },
    password: {
        flex: 1,
        paddingLeft: scale(4),
        paddingTop: 0,
        paddingBottom: 0,
        fontSize : fontSize(4),// 14,
        lineHeight : fontSize(18,verticalScale(4))// 18
    },
    visible_pass: {
        height: verticalScale(15),
        width: scale(25),
        resizeMode: 'contain'
    },
    error_text: {
        color: '#FF0000',
        marginLeft: scale(30),
        marginRight: scale(30),
        marginTop: verticalScale(35),
        fontSize: fontSize(14),// 14,
        marginBottom: verticalScale(5)
    },
    button_disable: {
        backgroundColor: '#B9B9B9',
        height: verticalScale(50),
        alignItems: 'center',
        justifyContent: 'center'
    },
    signin_button: {
        backgroundColor: "#00ABA7",
        height: verticalScale(50),
        marginLeft: scale(30),
        marginRight: scale(30),
        justifyContent : 'center',
        alignItems : 'center',
        borderRadius : scale(5)

    },
    recover_pass_title: {
        color: '#979797',
        textAlign: 'center',
        fontSize: fontSize(15,scale(1)),// 15,
        fontWeight: 'bold',
        marginTop: verticalScale(30)
    },
    recover_pass_phone: {
        color: '#979797',
        textAlign: 'center',
        fontSize: fontSize(20,scale(6)),// 20,
        marginTop: verticalScale(8)
    },
    recover_pass_error_text: {
        color: '#FF0000',
        marginLeft: scale(30),
        marginRight: scale(30),
        marginTop: verticalScale(30),
        fontSize: fontSize(14),// 14,
        marginBottom: verticalScale(3)
    },
    recover_pass_touch: {
        height: verticalScale(50),
        marginTop: verticalScale(20),
        backgroundColor: '#00ABA7',
        justifyContent: 'center',
        alignItems: 'center'
    },
    recover_pass_continue: {
        textAlign: 'center',
        color: '#FFFFFF',
        fontSize: fontSize(20,scale(6)),// 20
    }

});

module.exports = styles;
