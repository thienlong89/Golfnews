import {StyleSheet,Dimensions} from 'react-native';
import {scale, verticalScale, fontSize} from '../../../Config/RatioScale';
let{width,height} = Dimensions.get('window');

export default styles = StyleSheet.create({
    container: {
        //flex: 1, 
        height: verticalScale(70) 
    },

    container_content : {
        height: verticalScale(60), 
        flexDirection: 'row', 
        //borderColor: 'gray', 
        //borderWidth: 0.5, 
        paddingTop: verticalScale(3), 
        paddingBottom: verticalScale(3), 
    },

    ranking_view : {
        flex: 0.12, 
        justifyContent: 'center', 
        alignItems: 'center' 
    },

    ranking_text : {
        color: '#8c8c8c', 
        fontSize: fontSize(14),// 14 
    },

    avatar_container : {
        flex: 0.15, 
        justifyContent: 'center', 
        alignItems: 'center'
    },

    // avatar_view : {
    //     flex: 1, 
    //     width: 50, 
    //     height: 50 ,
    //     justifyContent: 'center', 
    //     alignItems: 'center',
    //     marginRight : 5
    // },

    avatar_image : {
        resizeMode: 'contain', 
        height: verticalScale(40), 
        width: scale(40),
        marginTop : verticalScale(10),
        marginLeft : scale(10)
    },

    user_container : {
        flex: 0.51,
        justifyContent : 'center',
        marginLeft : scale(10)
    },

    // user_view : {
    //     flex: 1, 
    //     justifyContent: 'center'
    // },

    user_fullname_text : {
        fontWeight: 'bold',
        fontSize: fontSize(14),// 14 
    },

    user_id_text : {
        color: '#adadad',
        fontSize: fontSize(13,scale(1)),// 13 
    },

    handicap_view : {
        flex: 0.12, 
        justifyContent: 'center', 
        alignItems: 'center' 
    },

    handicap_text : {
        color: '#000', 
        fontSize: fontSize(14),// 14, 
        textAlign: 'right' 
    },

    system_ranking_view : {
        flex: 0.2, 
        justifyContent: 'center', 
        alignItems: 'center'
    },

    system_ranking_text : {
        color: '#000', 
        fontSize: fontSize(14),// 14, 
        fontWeight: 'bold', 
        textAlign: 'right' 
    },

    raning_manner_view : {
        flex: 0.05, 
        justifyContent: 'center', 
        alignItems: 'center'
    },

    raning_manner_view_hide : {
        flex: 1, 
        justifyContent: 'center', 
        alignItems: 'center',
        width : scale(16),
        height : scale(16)
    },

    raning_manner_image : {
        resizeMode: 'contain', 
        width: scale(8), 
        height: scale(8)
    }
});