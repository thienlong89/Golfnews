import { Platform, StyleSheet,Dimensions} from 'react-native';
import {scale, verticalScale, fontSize} from '../../Config/RatioScale';
let{width,height} = Dimensions.get('window');

let screenWidth = width - scale(25);
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF'
    },

    error_view : {
        height : verticalScale(20),
        marginTop : verticalScale(10),
        marginLeft : scale(25),
        marginRight : scale(25)
    },

    error_text : {
        fontSize : fontSize(14),// 14,
        color : 'red',
        textAlignVertical : 'center'
    },

    dropdown: {
        width : (3*screenWidth)/5-scale(25),
        height: verticalScale(40),
        marginLeft: 0,
        //backgroundColor : 'blue',
        justifyContent: 'center',
    },

    dropdown_text: {
        //marginVertical: 10,
        //marginHorizontal: 6,
        fontSize: fontSize(16,scale(2)),// 16,
        color: '#8f8e94',
        textAlign: 'left',
        marginLeft: 0,
        textAlignVertical: 'center',
    },

    text_dropdown: {
        color: '#615B5B',
        paddingLeft: scale(20),
        paddingTop: verticalScale(10),
        paddingBottom: verticalScale(10),
        fontSize : fontSize(14)
    },

    dropdown_dropdown: {
        width: (3*screenWidth)/5-scale(25),
        borderColor: 'cornflowerblue',
        marginRight: 0,
        borderWidth: scale(2),
        borderRadius: 3,
    },

    item_body_view: {
        height: verticalScale(40),
        marginLeft : scale(25),
        marginRight : scale(25),
        flexDirection: 'row',
        borderTopColor: '#ebebeb',
        borderTopWidth: verticalScale(1),
        backgroundColor: '#fff',
        alignItems : 'center'
    },

    item_label: {
        width: (2 * screenWidth) / 5+scale(20),
        fontSize: fontSize(16,scale(2)),// 16,
        color: '#a6a6a6',
        marginLeft: 0,
        textAlignVertical: 'center',
        //backgroundColor : 'red'
    },

    item_value: {
        flex: 1,
        fontSize: fontSize(16,scale(2)),// 16,
        color: '#a6a6a6',
        textAlignVertical: 'center',
        //backgroundColor : 'blue'
    },

    myview_label : {
        width: (2 * screenWidth) / 5+scale(20),
    },

    myview: {
        flex: 1,
        justifyContent: 'center'
    },


    touch_facebook: {
        marginTop: verticalScale(15),
        marginRight: scale(20),
        marginLeft: scale(20)
    },
    facebook_group: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    },
    facebook_icon: {
        height: verticalScale(40),
        width: verticalScale(40),
        resizeMode: 'contain'
    },
    facebook_text: {
        color: '#979797',
        marginLeft: scale(15),
        fontSize :fontSize(15,scale(1)),// 15
    },
    or_enter_info: {
        color: '#979797',
        fontWeight: 'bold',
        marginTop: verticalScale(5),
        textAlign: 'center',
        fontSize : fontSize(17,scale(3))
    },
    view_textfield: {
        marginLeft: verticalScale(25),
        marginRight: verticalScale(25)
    },
    gender: {
        color: '#8A8A8F',
        marginLeft: verticalScale(25),
        marginRight: verticalScale(25),
        marginTop: verticalScale(10),
        fontSize: fontSize(17,scale(3)),// 17
    },
    gender_group: {
        flexDirection: 'row',
        marginLeft: scale(25),
        marginRight: scale(25),
        marginBottom: verticalScale(15)
    },
    gender_text_normal: {
        color: '#8A8A8F',
        alignSelf: 'flex-end',
        fontSize: fontSize(17,scale(3)),// 17
    },
    gender_male: {
        marginRight: scale(5),
        fontSize: fontSize(17,scale(3)),// 17
    },
    gender_female: {
        marginLeft: scale(5),
        fontSize: fontSize(17,scale(3)),// 17
    },
    touch_complete: {
        marginTop: verticalScale(20),
        backgroundColor: '#00ABA7',
        justifyContent : 'center',
        alignItems : 'center',
        height : verticalScale(50)
    },
    text_complete: {
        width: scale(200),
        textAlign: 'center',
        color: '#FFFFFF',
        //textAlign: 'center',
        fontSize: fontSize(20,scale(6)),// 20
    }

});

module.exports = styles;
