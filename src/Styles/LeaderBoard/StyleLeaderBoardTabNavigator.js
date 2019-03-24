import { StyleSheet } from 'react-native';
import {scale, verticalScale, fontSize} from '../../Config/RatioScale';
// let{width,height} = Dimensions.get('window');

export default styles = StyleSheet.create({
    container: {
        flex: 1
    },

    labelStyle: {
        fontSize: fontSize(13,-1),//13
        fontWeight: 'bold',
        //color: '#858585',
        // height: (deviceHeight * 4) / 67,
        position: 'relative',
        alignSelf: 'center',
        // padding: 6,
        marginTop: verticalScale(2),
    },

    tabStyle: {
        justifyContent: 'center',
        alignItems: 'center',
        padding : 0
    },

    style: {
        backgroundColor: '#fff'
    },

    iconStyle: {
        backgroundColor: "#858585"
    },
    
    indicatorStyle: {
        backgroundColor: '#00aba7'
    }
});