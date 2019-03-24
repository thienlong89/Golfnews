import { Platform, StyleSheet,Dimensions} from 'react-native';
import {scale, verticalScale, fontSize} from '../../Config/RatioScale';
let{width,height} = Dimensions.get('window');

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFF'
    },
    text_suggest: {
        color: '#3B3B3B',
        textAlign: 'center',
        fontWeight: 'bold',
        marginTop:  verticalScale(30),
        marginBottom: verticalScale(25),
        fontSize : fontSize(15)
    },
    text_input_background: {
        marginLeft: scale(30),
        marginRight: scale(30),
        borderRadius: scale(5),
        borderColor: '#ADADAD',
        borderWidth: scale(1),
        backgroundColor: '#FFFFFF',
        height: verticalScale(35)
    },
    txt_triangle: {
        color: '#7E7E7E',
        fontSize: 13,
        marginLeft: 5,
        marginRight: 5
    },
    text_input_bg : {
        flexDirection: 'row',
        marginRight: scale(30),
        marginLeft :  scale(30),
        borderRadius: scale(20),
        borderColor: '#CECECE',
        borderWidth: scale(1),
        backgroundColor: '#FFFFFF',
        height: verticalScale(40),
        fontSize: 15,
        alignItems: 'center',
    },

    text_input_margin: {
        paddingLeft:  scale(5),
        //marginLeft: 30,
        // marginRight: 30,
        // borderRadius: 5,
        // borderColor: '#ADADAD',
        // borderWidth: 1,
        // backgroundColor: '#FFFFFF',
        height: verticalScale(40),
        fontSize : fontSize(14),// 14,
        lineHeight : fontSize(18,verticalScale(4)),// 18
    },
    text_error: {
        color: '#FF0000',
        fontSize: fontSize(13,-scale(1)),// 13,
        marginLeft: scale(30),
        marginRight: scale(30),
        marginTop: verticalScale(5)
    },
    text_continue_touch: {
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 80,
    },
    touchable_continue: {
        backgroundColor: '#00ABA7',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 25,
        height:  verticalScale(50),
        marginTop: verticalScale(100),
    },
    text_continue: {
        textAlign: 'center',
        color: '#FFFFFF',
        paddingLeft: 20,
        paddingRight: 20,
        fontSize: fontSize(20,scale(6)),// 20
    }
});

module.exports = styles;
