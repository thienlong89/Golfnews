import { StyleSheet, Dimensions } from 'react-native';

import { scale, verticalScale, fontSize } from '../../../Config/RatioScale';
let { width, height } = Dimensions.get('window');
import ExpoUtil from '../../../../ExpoUtils/ExpoUtils';
import { Constants } from '../../../Core/Common/ExpoUtils';

export default styles = StyleSheet.create({
    container: {
        flex: 1
    },

    container_top: {
        flex: 0.05,
        backgroundColor: '#00aba7'
    },

    container_content: {
        flex: 0.1,
        backgroundColor: '#00aba7'
    },

    content_view: {
        height: verticalScale(80),
        backgroundColor: '#00aba7',
        justifyContent: 'flex-end'
    },

    header_view: {
        flex: 1,
        flexDirection: 'row',
        marginTop: Constants.statusBarHeight,
        alignItems: 'center'
    },

    container_back: {
        flex: 0.15
    },

    back_view: {
        width: scale(40),
        height: verticalScale(50),
        justifyContent: 'center',
        alignItems: 'center'
    },

    touch_back: {
        width: verticalScale(50),
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: scale(15),
        paddingBottom: scale(15)
        //backgroundColor : 'green'
    },

    touch_right: {
        width: scale(50),
        height: verticalScale(30),
        marginRight: 0,
        alignItems: 'flex-end'
    },

    back_image: {
        height: verticalScale(22),
        width: verticalScale(22),
        resizeMode: 'contain',
        marginLeft: scale(4)
    },

    title_view: {
        flex: 0.8,
        justifyContent: 'center',
        alignItems: 'center'
    },

    title_text: {
        flex: 1,
        color: 'white',
        fontSize: fontSize(20, scale(6)),// 20,
        textAlign: 'center',
        textAlignVertical: 'center',
        fontWeight: 'bold'
    },

    container_left: {
        flex: 0.1
    },

    left_view: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },

    right_image: {
        width: scale(26),
        height: verticalScale(26),
        resizeMode: 'contain',
        marginRight: scale(6)
    },

    text_input: {
        flex: 1,
        minHeight: verticalScale(30),
        borderColor: '#c7c7c7',
        borderWidth: 0.5,
        borderRadius: scale(5),
        backgroundColor: '#fff',
        paddingLeft: scale(6),
        marginTop: verticalScale(10),
        marginBottom: verticalScale(10),
        marginLeft: scale(10),
        marginRight: scale(10),
        paddingTop: 0,
        paddingBottom: 0,
        fontSize: fontSize(14),// 14,
        lineHeight: verticalScale(18)
    },

    text_left: {
        flex: 0.2
    },

    container_right: {
        flex: 0.15,
        justifyContent: 'center',
        alignItems: 'flex-end'
    },

    right_view: {
        width: scale(50),
        height: verticalScale(50),
        justifyContent: 'center',
        alignItems: 'flex-end',
    },

    right_text: {
        color: 'white',
        fontSize: fontSize(16),// 16,
        textAlign: 'center',
        marginRight: scale(7)
    },
});