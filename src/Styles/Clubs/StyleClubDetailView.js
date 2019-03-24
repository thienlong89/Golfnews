import {StyleSheet} from 'react-native';
import {scale, verticalScale,fontSize} from '../../Config/RatioScale';

export default styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor : '#fff'
    },

    back_image : {
        flex: 0.6, 
        resizeMode: 'center' 
    },


    container_body : {
        flex: 1
    },

    body_item_row : {
        minHeight : verticalScale(60), 
        justifyContent: 'center', 
        borderBottomColor: '#ebebeb', 
        borderBottomWidth: 1, 
    },

    item_title_text : {
        fontSize: fontSize(13,-scale(1)), 
        color: '#a8a8a8',
        marginLeft : scale(10)
    },

    item_content_text : {
        fontSize: fontSize(14), 
        color: 'black', 
        fontWeight: 'bold',
        marginLeft :scale(10)
    },

    total_member_view : {
        minHeight : verticalScale(60), 
        justifyContent: 'center', 
    },

    line_view : {
        height : verticalScale(5), 
        justifyContent: 'center', 
        backgroundColor: '#edebeb' 
    },

    container_logo : {
        minHeight : verticalScale(60),
        // justifyContent: 'center', 
        flexDirection: 'row', 
        alignItems: 'center', 
        borderBottomColor: '#ebebeb', 
        borderBottomWidth: 1, 
        marginLeft : scale(15)
    },

    logo_view : {
        flex: 1, 
        flexDirection: 'row', 
        alignItems: 'center' 
    },

    logo_image : {
        resizeMode: 'contain',  
        height: scale(32), 
        width: scale(32) 
    },

    facebook_text : {
        color: '#4d4d4d',  
        fontSize: fontSize(14), 
        marginLeft: scale(5)
    },

    container_location_view : {
        minHeight : verticalScale(70), 
        alignItems: 'center',
        flexDirection: 'row',  
        borderBottomColor: '#ebebeb', 
        borderBottomWidth: 1, 
        marginLeft : scale(15),
        paddingRight : scale(20),
        paddingTop : verticalScale(10),
        paddingBottom : verticalScale(10)
        // marginRight : scale(15)
    },

    location_view : {
        flex: 1, 
        flexDirection: 'row', 
        alignItems: 'center' 
    },

    location_image : {
        resizeMode: 'contain', 
        height: scale(28), 
        width: scale(28),
    },

    address_text : {
        color: '#4d4d4d', 
        fontSize: fontSize(14), 
        marginLeft: scale(7),
        marginRight : scale(15) 
    },

    // container_bottom : {
    //     flex: 0.17, 
    //     justifyContent: 'center' 
    // }
});