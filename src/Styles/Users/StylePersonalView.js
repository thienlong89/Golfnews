import { StyleSheet, Dimensions } from 'react-native';
import { scale, verticalScale, fontSize } from '../../Config/RatioScale';
let { width, height } = Dimensions.get('window');

let screenWidth = width - scale(15);
export default styles = StyleSheet.create({
    container: {
        flex: 1
    },

    container_dac_diem: {
        height: verticalScale(220)
    },

    container_info: {
        // flex: 1,
        backgroundColor: '#fff',
        marginTop: verticalScale(10),
        marginBottom: verticalScale(10),
        marginLeft: scale(10),
        marginRight: scale(10),
        borderRadius: scale(10),
        paddingBottom: scale(10),
        borderWidth: 1,
        borderColor: '#ebebeb'
        // shadowColor: 'rgba(0, 0, 0, 0.3)',
        // shadowOffset: {
        //     width: 0,
        //     height: 5
        // },
        // shadowRadius: scale(10),
        // shadowOpacity: 1.0,
        // elevation: 1,
    },
    txt_edit: {
        fontSize: fontSize(15)
    },

    item_header_view: {
        height: verticalScale(30),
        flexDirection: 'row',
        backgroundColor: '#EDEDED',
        alignItems: 'center',
        borderTopLeftRadius: scale(10),
        borderTopRightRadius: scale(10)
    },

    item_header_text: {
        flex: 1,
        fontSize: fontSize(18, scale(4)),//18
        color: '#919191',
        fontWeight: 'bold',
        marginLeft: scale(10),
        textAlign: 'center'
    },

    pen_image: {
        width: scale(20),
        height: verticalScale(20),
        resizeMode: 'contain',
        alignSelf: 'center',
        marginRight: scale(5)
    },

    item_body_view: {
        height: verticalScale(40),
        flexDirection: 'row',
        borderTopColor: '#ebebeb',
        borderTopWidth: 1,
        backgroundColor: '#fff',
        alignItems: 'center'
    },

    item_label: {
        flex: 2.3,
        fontSize: fontSize(16, scale(2)),//16
        color: '#a6a6a6',
        marginLeft: scale(10),
        //textAlign: 'center',
        //backgroundColor : 'red'
    },

    item_value: {
        fontSize: fontSize(16, scale(2)),//16
        color: '#424242',
        //textAlignVertical: 'center',
        // backgroundColor : 'blue',
        //textAlign : 'center',
    },

    myview_label: {
        width: (2 * screenWidth) / 5 + scale(20),
    },

    myview: {
        //flex: 1,
        flex: 3,
        // justifyContent: 'center',
        // backgroundColor : 'yellow'
        //alignItems : 'center'
    },

    item_input: {
        flex: 3,
        fontSize: fontSize(16, scale(2)),// 16,
        lineHeight: fontSize(16, scale(2) + verticalScale(4)),// verticalScale(20),
        color: '#424242',
        paddingTop: 0,
        paddingBottom: 0,
    },

    datepicker: {
        // width: (3 * screenWidth) / 5,
        flex: 1,
        justifyContent: 'center',
        //backgroundColor : 'green',
        // alignItems: 'center',
    },

    dropdown: {
        width: scale(100),
        height: verticalScale(40),
        marginLeft: 0,
        //backgroundColor : 'blue',
        justifyContent: 'center',
    },

    dropdown_text: {
        //marginVertical: 10,
        //marginHorizontal: 6,
        fontSize: fontSize(16, scale(2)),// 16,
        color: '#424242',
        textAlign: 'left',
        marginLeft: 0,
        //textAlign: 'center',
    },

    text_dropdown: {
        color: '#615B5B',
        paddingLeft: scale(20),
        paddingTop: verticalScale(10),
        paddingBottom: verticalScale(10),
        fontSize: fontSize(16, scale(2))
    },

    dropdown_dropdown: {
        width: (3 * screenWidth) / 5 - scale(20),
        borderColor: 'cornflowerblue',
        marginRight: 0,
        borderWidth: 2,
        borderRadius: 3,
    },

    dropdown_dropdown_gender: {
        width: (3 * screenWidth) / 5 - scale(20),
        borderColor: 'cornflowerblue',
        height: verticalScale(80),
        marginRight: 0,
        borderWidth: 2,
        borderRadius: 3,
    },
    txt_add_more_phone: {
        color: '#a6a6a6',
        fontSize: fontSize(13),
        fontStyle: 'italic',
        marginLeft: scale(10),
        marginRight: scale(10),
        marginBottom: scale(10)
    }
});