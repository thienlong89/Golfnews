import { StyleSheet, Dimensions } from 'react-native';

import { scale, verticalScale, fontSize } from '../../Config/RatioScale';
let { width, height } = Dimensions.get('window');

export default styles = StyleSheet.create({

    container: {
        flex: 1,
    },

    labelStyle: {
        fontSize: fontSize(14, scale(2)),// 18,
        fontWeight: '400',
        //color: '#858585',
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
        paddingBottom: 2,
        paddingTop: 2,
        paddingLeft: 0,
        paddingRight: 0
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
    img_share: {
        width: 25,
        height: 25,
        resizeMode: 'contain',
        tintColor: '#fff'
    }
});