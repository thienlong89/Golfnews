import {StyleSheet,Platform,Dimensions} from 'react-native';
import {scale, verticalScale, fontSize} from '../../../Config/RatioScale';
let{width,height} = Dimensions.get('window');

export default styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor : '#fff'
    },

    header: {
        flex: 0.06,
        flexDirection: 'row',
        backgroundColor: '#f5eded',
        alignItems: 'center',
        justifyContent: 'center'
    },

    body: {
        flex: 0.94,
        backgroundColor: '#ffffff',
    },

    separator_view : { 
        height : (Platform.OS === 'ios') ? 1 : 0.5,
        backgroundColor : '#ebebeb'
    },

    rank: {
        flex: 0.13,
        textAlign: 'center',
        fontSize: fontSize(13,-1),//13
        //backgroundColor: 'blue',
        alignSelf: 'center'
    },

    name: {
        textAlign: 'center',
        flex: 0.47,
        fontSize: fontSize(13,-1),// 13,
    },

    hdc: {
        textAlign: 'center',
        flex: 0.2,
        fontSize: fontSize(13,-1),// 13,
       // backgroundColor: 'yellow'
    },

    system_rank: {
        flex: 0.2,
        textAlign: 'center',
        fontSize: fontSize(13,-1),// 13,
        //backgroundColor: 'green'
    },

    listview : {
        flex: 1, 
        marginTop: verticalScale(3), 
        paddingBottom: verticalScale(2), 
        paddingLeft: 0, 
        paddingRight: 0 
    },

    listview_clb : {
        marginTop: verticalScale(3), 
        paddingBottom: verticalScale(2), 
        paddingLeft: 0, 
        paddingRight: 0 
    },

    view_hide : {
        height: verticalScale(70), 
        width: null, 
        paddingLeft: 0, 
        paddingRight: 0, 
        backgroundColor: 'rgba(226,254,253,255)' 
    }
});