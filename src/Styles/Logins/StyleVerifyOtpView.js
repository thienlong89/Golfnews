import { Platform, StyleSheet,Dimensions} from 'react-native';
import {scale, verticalScale, fontSize} from '../../Config/RatioScale';
let{width,height} = Dimensions.get('window');

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF'
    },
    text_suggest: {
        color: '#3B3B3B',
        textAlign: 'center',
        marginTop: verticalScale(40),
        marginBottom: verticalScale(10),
        marginLeft: scale(20),
        marginRight: scale(20),
        fontSize : fontSize(14)
    },
    input_otp_group: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: verticalScale(20)
    },
    input_group: {
        marginLeft: scale(12),
        marginRight: scale(12)
    },
    input_line: {
        height: verticalScale(2),
        backgroundColor: '#919191'
    },
    input_text: {
        color: "#919191",
        textAlign: 'center',
        fontSize: fontSize(35,scale(26)),// 40,
        lineHeight : fontSize(40,scale(30)),// 44,
        minWidth: scale(30)
    },
    touch_resend: {
        marginTop: verticalScale(50),
        height: verticalScale(50),
        backgroundColor: '#00ABA7',
        justifyContent: 'center',
        alignItems: 'center'
    },
    resend_otp: {
        textAlign: 'center',
        color: '#FFFFFF',
        fontSize: fontSize(20,scale(6)),// 20
    },
    text_error: {
        color: '#FF0000',
        fontSize: fontSize(15,scale(1)),// 15,
        marginLeft: scale(30),
        marginRight: scale(30),
        marginTop: verticalScale(5),
        textAlign: 'center'
    }

});

module.exports = styles;
