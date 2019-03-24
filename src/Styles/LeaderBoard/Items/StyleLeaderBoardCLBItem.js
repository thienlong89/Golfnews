import {StyleSheet,Dimensions} from 'react-native';
import {scale, verticalScale, fontSize} from '../../../Config/RatioScale';
let{width,height} = Dimensions.get('window');

export default styles = StyleSheet.create({
    container: {
        height : verticalScale(60),
        flexDirection: 'row', 
       // borderColor: '#d6d4d4', 
       // borderWidth: 0.5, 
        paddingTop: verticalScale(3), 
        paddingBottom: verticalScale(3), 
    },

    container_content : {
        flex: 1, 
        flexDirection: 'row', 
        borderColor: '#d6d4d4', 
        borderWidth: 0.5, 
        paddingTop: verticalScale(3), 
        paddingBottom: verticalScale(3), 
        height: verticalScale(60)
    },

    rank_view : {
        flex: 0.1, 
        justifyContent: 'center', 
        alignItems: 'center' 
    },

    rank_text : {
        color: '#8c8c8c', 
        fontSize:  fontSize(13,-scale(2)),// 13 
    },

    logo_view : {
        flex: 0.18, 
        justifyContent: 'center', 
        alignItems: 'center'
    },

    logo_image : {
        resizeMode: 'contain', 
        height: verticalScale(40), 
        width: scale(40),
        marginLeft : scale(10),
        marginTop : verticalScale(10), 
    },

    club_name_container : {
        flex: 0.55,
        marginLeft : scale(5),
        justifyContent : 'center'
    },

    club_name_view : {
        flex: 1, 
        justifyContent: 'center'
    },

    club_name_text : {
        fontWeight: 'bold', 
        fontSize: fontSize(14),// 14 
    },

    member_view : {
        flex: 0.15, 
        justifyContent: 'center',
        alignItems : 'center' 
    },

    member_text : {
        color: 'black',
        fontSize : fontSize(12,-scale(2))
    },

    score_view : {
        flex: 0.2, 
        justifyContent: 'center',
        alignItems : 'center'
    },

    score_text : {
        color: 'black',
        fontSize : fontSize(12,-2) 
    },

    ranking_mamnner_view : {
        flex: 0.05, 
        justifyContent: 'center', 
        alignItems: 'center' 
    },

    ranking_mamnner_image : {
        resizeMode: 'contain', 
        width: scale(8), 
        height: scale(8)
    }
});