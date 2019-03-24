import { StyleSheet,Dimensions } from 'react-native';
import {scale, verticalScale, fontSize} from '../../Config/RatioScale';
let{width,height} = Dimensions.get('window');

export default styles = StyleSheet.create({
    private_image: {
        width: scale(30),
        height: verticalScale(30),
        resizeMode: 'contain',
        marginLeft: scale(10)
    },

    item_view_notify: {
        minHeight: verticalScale(50),
        alignItems: 'center',
        flexDirection: 'row',
        borderTopColor: '#ebebeb',
        borderTopWidth: 1,
        marginLeft :scale(40)
    },

    dropdown: {
        width: scale(120),
        height: verticalScale(30),
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
        fontSize : fontSize(14),
    },

    dropdown_dropdown: {
        width: scale(120),
        borderColor: 'cornflowerblue',
        marginRight: 0,
        marginTop: verticalScale(5),
        borderWidth: 2,
        borderRadius: scale(3),
    },

    container: {
        flex: 1,
        backgroundColor: '#fff',
    },

    item_view_notify: {
        minHeight: verticalScale(50),
        paddingBottom : verticalScale(5),
        paddingTop : verticalScale(5),
        alignItems: 'center',
        flexDirection: 'row',
        borderTopColor: '#ebebeb',
        borderTopWidth: 1,
        marginLeft : scale(40)
    },

    item_view: {
        height: verticalScale(50),
        alignItems: 'center',
        flexDirection: 'row',
        borderBottomColor: '#ebebeb',
        borderBottomWidth: 1
    },

    private_view : {
        height: verticalScale(50),
        alignItems: 'center',
        flexDirection: 'row',
        marginLeft : 40
    },

    logo_image: {
        width: scale(30),
        height: verticalScale(30),
        resizeMode: 'contain',
        marginLeft: scale(10)
    },

    alert_icon_view: {
        width: scale(60), height: verticalScale(40), justifyContent: 'center', alignItems: 'center', marginRight: scale(10)
    },

    alert_icon_image: {
        width: scale(50),
        height: verticalScale(30),
        resizeMode: 'contain'
    },

    alert_text: {
        flex: 1,
        textAlignVertical: 'center',
        fontSize: fontSize(16,scale(2)), color: '#424242',
        marginLeft: scale(10)
    },

    text_lang : {
        fontSize: fontSize(16,scale(2)), color: '#424242',
        marginRight : scale(8)
    },

    language_view: {
        minWidth: scale(120),
        height: verticalScale(50),
        // borderColor : '#adadad',
        // borderRadius : 5,
        // borderWidth : 1,
        justifyContent : 'flex-end',
        flexDirection: 'row',
        marginRight: scale(10),
        paddingLeft : scale(5),
        alignItems: 'center',
        // backgroundColor : 'green'
    },

    language_arrow: {
        width: verticalScale(20),
        height: verticalScale(20),
        resizeMode: 'contain'
    },

    tee_logo_view: {
        width: verticalScale(25),
        height: verticalScale(25),
        marginLeft: scale(10),
       // backgroundColor: 'blue',
        borderColor: '#929292',
        borderWidth: 2
    },

    tee_modal_view: {
        width: scale(90),
        height: verticalScale(50),
        flexDirection: 'row',
        marginRight: scale(10),
        alignItems: 'center',
        // backgroundColor : 'yellow',
        justifyContent : 'flex-end'
    },

    tee_image: {
        width: verticalScale(20),
        height: verticalScale(20),
        resizeMode: 'contain'
    },

    textButton: {
        color: 'deepskyblue',
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: 'deepskyblue',
        margin: scale(2),
    },

    dropdown_tee: {
        minWidth:scale(80),
        height: verticalScale(40),
        right: 0,
    },

    dropdown_dropdown_tee: {
        minWidth: scale(80),
        height: verticalScale(120),
        borderColor: 'cornflowerblue',
        marginRight: -scale(20),
        borderWidth: 2,
        borderRadius: 3,
    },

    dropdown: {
        width: scale(100),
        height: verticalScale(30),
        right: 0,
        //borderWidth: 0,
        //borderRadius: 3,
        //backgroundColor: 'cornflowerblue',
    },

    dropdown_text: {
        //marginVertical: 10,
        //marginHorizontal: 6,
        fontSize: fontSize(18,scale(4)),// 16,
        // color: '#8f8e94',
        color : '#424242',
        textAlign: 'right',
        marginRight: scale(10),
        textAlignVertical: 'center',
    },

    dropdown_dropdown: {
        width: scale(120),
        height: verticalScale(160),
        borderColor: 'cornflowerblue',
        marginRight: -scale(20),
        borderWidth: 2,
        borderRadius: 3,
    },

    dropdown_row: {
        flexDirection: 'row',
        height: verticalScale(30),
        alignItems: 'center',
    },

    dropdown_row_text: {
        marginHorizontal: 4,
        fontSize: fontSize(16,scale(2)),// 16,
        color: 'navy',
        textAlignVertical: 'center',
    },
    dropdown_separator: {
        height: 1,
        backgroundColor: 'cornflowerblue',
    },

    block_obsever_view : {
        flex: 1, 
        justifyContent: 'center', 
        // marginLeft: scale(10),
        borderBottomColor: '#ebebeb',
        borderBottomWidth: 1,
    },

    block_obsever_text : {
        // marginTop : verticalScale(5),
        marginRight : scale(5),
        textAlignVertical: 'center', 
        fontSize: fontSize(14),// 14, 
        color: '#424242'
    },

    block_have_text : {
        // marginTop : verticalScale(5),
        marginRight : scale(5),
        textAlignVertical: 'center', 
        fontSize: fontSize(14),// 14, 
        color: '#00aba7'
    },

    private_view_left : {
        width: scale(30),
         height: verticalScale(30), 
         marginLeft: scale(10) 
    },

    hide_flight_view : {
        flex: 1, 
        height : verticalScale(50),
        flexDirection: 'row', 
        borderBottomColor: '#ededed', 
        borderBottomWidth: 1,
        alignItems : 'center'
    },

    hide_flight_text : {
        flex: 1, 
        textAlignVertical: 'center', 
        fontSize: 14, 
        color: '#424242', 
        marginLeft: scale(10) 
    },

    hide_flight_icon_view : {
        width: scale(60), 
        height: verticalScale(40), 
        justifyContent: 'center', 
        alignItems: 'center', 
        marginRight: scale(10) 
    },

    hide_flight_icon_image : {
        width: scale(50), 
        height: verticalScale(30), 
        resizeMode: 'contain' 
    }
});