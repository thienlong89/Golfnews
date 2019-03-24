import { StyleSheet,Dimensions } from 'react-native';
import {scale, verticalScale, fontSize} from '../../../Config/RatioScale';
let{width,height} = Dimensions.get('window');

export default styles = StyleSheet.create({
    container_view : {
        //flex: 1, 
        flexDirection: 'row',  
        //paddingTop: 3, 
        //paddingBottom: 3, 
        alignItems : 'center',
        height: verticalScale(60) 
    },

    avatar_view : {
        height: verticalScale(50), 
        width: verticalScale(50) ,
        marginLeft : scale(10), 
        justifyContent: 'center', 
        alignItems: 'center' 
    },

    avatar_view_image : {
        resizeMode: 'contain', 
        height: verticalScale(50), 
        width: verticalScale(50),
        marginLeft : scale(10),  
    },

    container_content_view : {
        flex: 1, 
        justifyContent: 'center',
        marginLeft : scale(10) 
    },

    text_name : {
        flex: 0.4, 
        fontWeight: 'bold', 
        fontSize: fontSize(16,1),// 16 
    },

    text_member : {
        flex: 0.3, 
        color: '#adadad', 
        fontSize: fontSize(14,-1), //14 
    }
});