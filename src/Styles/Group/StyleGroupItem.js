import {StyleSheet} from 'react-native';
import {scale, verticalScale, fontSize} from '../../Config/RatioScale';

export default styles = StyleSheet.create({
    container : {
        height: verticalScale(70),
        flexDirection: 'row',
        alignItems: 'center'
    },

    button_delete_group : {
        width: scale(100), 
        marginRight: scale(3), 
        height: verticalScale(22), 
        borderColor: '#707070', 
        borderRadius: verticalScale(11), 
        borderWidth: verticalScale(1), 
        justifyContent: 'center', 
        alignItems: 'center' 
    },

    delete_group_text : {
        fontSize: fontSize(12,-scale(3)),// 12, 
        color: '#707070',
        textAlign: 'center'
    },

    handicap_facility_view: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderColor: '#00aba7',
        borderRadius: verticalScale(20),
        width: verticalScale(40), 
        height: verticalScale(40),
        borderWidth: verticalScale(1.5),
        marginRight: scale(10)
    },

    handicap_facility_text: {
        alignSelf: 'center',
        color: '#00aba7',
        fontWeight: 'bold'
    },

    container_container : { 
        flex: 1, 
        flexDirection: 'row', 
        paddingTop: verticalScale(5),
        paddingBottom: verticalScale(5), 
        minHeight: verticalScale(70),
        height: verticalScale(60),
        flexDirection: 'row',
        alignItems: 'center'
    },

    container_avatar : {
        width : verticalScale(50),
        height : verticalScale(50),
        marginLeft : scale(10),
        justifyContent : 'center'
    },

    view_avatar : {
        width : verticalScale(50),
        height : verticalScale(50)
    },

    image_avatar : { 
        resizeMode: 'contain', 
        minHeight: verticalScale(50), 
        minWidth: verticalScale(50) 
    },

    container_body : {
        flex : 1,
        justifyContent : 'center',
        marginLeft : scale(5),
        paddingBottom : verticalScale(5),
        paddingTop : verticalScale(5)
    },

    view_body: {
        flex: 1,
        justifyContent: 'center'
    },

    text_body_fullname : {
        // flex: 0.3, 
        fontWeight: 'bold',
        color : 'black',
        fontSize : fontSize(14),// 14
    },

    text_body_userid :{
        // flex: 0.3, 
        color: '#adadad' ,
        fontSize : fontSize(13,-scale(1)),// 13
    },

    text_body_hdc : {
        // flex: 0.3, 
        color: '#737373',
        fontSize : fontSize(13,-scale(1)),
    },      

    container_add : {
        width : scale(100),
        height : verticalScale(70),
        justifyContent: 'center', 
        alignItems: 'center',
    },

    button_add_club : {
        height : verticalScale(30),
        width : scale(100),
        justifyContent: 'center',
        alignItems: 'center',
        marginRight : scale(10)
    },

    button_add : {
        height : verticalScale(30),
        width : scale(100),
        justifyContent: 'center', 
        alignItems: 'center',
        //backgroundColor : '#4294f7',
        borderWidth : verticalScale(0.5),
        borderRadius : verticalScale(3),
        marginRight : scale(10)
    },

    text : {
        alignSelf : 'center',
        fontSize : fontSize(14),// 16
    },

    text_add_color: {
        color: 'white'
    },

    button_color: {
        color: '#4294f7'
    },
    touchable_delete_user: {
        width: 75,
        flex: 1,
        backgroundColor: '#EE3030',
        justifyContent: 'center',
        alignItems: 'center'
    },
    txt_delete: {
        color: '#fff',
        fontSize: 13
    },
    view_center: {
        flex: 1,
        flexDirection: 'row',
    },
    touchable_tee_view: {
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15
    },
    touchable_delete_group: {
        minWidth: 70,
        height: 60,
        backgroundColor: '#EE3030',
        justifyContent: 'center',
        alignItems: 'center'
    },
    txt_delete: {
        color: '#fff',
        fontSize: 13
    },
    view_delete: {
        position: 'absolute',
        right: 0,
        top: 0,
        bottom: 0,
        height: 60
    }
});