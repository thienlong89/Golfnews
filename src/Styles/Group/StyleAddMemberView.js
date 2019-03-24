import {StyleSheet,Dimensions} from 'react-native';
import {scale, verticalScale, fontSize} from '../../Config/RatioScale';
let{width,height} = Dimensions.get('window');

export default styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor : '#fff'
    },

    list_member_choosen_view : {
        height: verticalScale(60) 
    },

    member_choosen_listview : {
        flex : 1, 
        marginTop: verticalScale(5), 
        paddingLeft: 0, 
        paddingRight: 0
    },

    container_center : {
        flex: 0.09 
    },

    search_view : {
        height : verticalScale(40), 
        justifyContent: 'center', 
        borderColor: '#a1a1a1', 
        borderRadius: scale(3), 
        borderWidth: scale(0.5), 
        flexDirection: 'row', 
        marginLeft: scale(10), 
        marginRight: scale(10), 
        marginTop: verticalScale(5)
    },

    search_touchable : {
        width : verticalScale(40),
        height : verticalScale(40),
        justifyContent : 'center',
        alignItems : 'center'
    },

    search_image : {
        width : verticalScale(23),
        height : verticalScale(23),
        resizeMode: 'contain' 
    },

    search_input_text : {
        flex: 1, 
        paddingLeft: scale(10),
        paddingTop: 0,
        paddingBottom: 0,
        fontSize : fontSize(14),// 14,
        lineHeight : fontSize(18,scale(4)),// 18
    },

    container_bottom : {
        flex: 1, 
        marginTop: verticalScale(7) 
    },

    container_bottom_listview : {
        marginTop: verticalScale(2), 
        paddingBottom: verticalScale(1), 
        paddingLeft: 0, 
        paddingRight: 0 
    },

    separator_view : {
        height: 1, 
        backgroundColor: '#E3E3E3' 
    },

});