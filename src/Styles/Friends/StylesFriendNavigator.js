import { StyleSheet,Dimensions } from 'react-native';

import {scale, verticalScale, fontSize} from '../../Config/RatioScale';
let{width,height} = Dimensions.get('window');

export default styles = StyleSheet.create({

    container : {
        flex : 1,
    },

    back_img : {
        width: verticalScale(30), 
        height: verticalScale(30), 
        resizeMode: 'contain',
        marginLeft : scale(10), 
        marginTop: verticalScale(40)
    },

    header : {
        height:   verticalScale(80), 
        backgroundColor: '#00aba7',
        flexDirection : 'row',
        // alignItems : 'center' 
    },

    header_search : {
        height: verticalScale(30), 
        width : width-scale(60),
        flexDirection: "row", 
        marginTop: verticalScale(40), 
        marginLeft: scale(10), 
        marginRight: scale(10), 
        backgroundColor: 'rgba(0, 0, 0, 0.2)', 
        borderColor: 'gray', 
        borderWidth: scale(0.5), 
        borderRadius: verticalScale(15) 
    },

    search_view : {
        width:  verticalScale(40), 
        height: verticalScale(30), 
        justifyContent: 'center', 
        alignItems: 'center' 
    },

    search_image : {
        width: verticalScale(17), 
        height: verticalScale(17), 
        resizeMode: 'contain',
        tintColor: '#60CCC9'
    },

    labelStyle: {
        fontSize: fontSize(15,scale(2)),// 18,
        fontWeight: '400',
        // color: '#858585',
        // height: (deviceHeight * 4) / 67,
        position: 'relative',
        alignSelf: 'center',
        // padding: 6,
        marginTop: verticalScale(5),
    },

    tabStyle: {
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: verticalScale(40),
        paddingBottom : 2,
        paddingTop : 2,
        paddingLeft : 0,
        paddingRight : 0
    },
    style: {
        backgroundColor: '#fff',
        minHeight: verticalScale(40),
    },
    iconStyle: {
        backgroundColor: "#858585"
    },
    indicatorStyle: {
        backgroundColor: '#00aba7'
    },
    input_search: {
        flex: 1,
        fontSize: fontSize(14),// 13,
        lineHeight : fontSize(18,verticalScale(4)),// 16,
        paddingBottom: 0,
        paddingTop: 0,
        color: '#FFF'
    }
});