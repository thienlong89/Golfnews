import {StyleSheet,Platform,Dimensions} from 'react-native';
import {scale, verticalScale, fontSize} from '../../../Config/RatioScale';
let{width,height} = Dimensions.get('window');

export default styles = StyleSheet.create({
    container: {
        flex: 1
    },

    button_delete_group : {
        width: scale(100), 
        marginRight: scale(3), 
        height: verticalScale(22), 
        borderColor: '#707070', 
        borderRadius: scale(11), 
        borderWidth: 1, 
        justifyContent: 'center', 
        alignItems: 'center' 
    },

    delete_group_text : {
        fontSize: fontSize(12,-3),// 12, 
        color: '#707070',
        textAlign: 'center'
    },

    container_content: {
        // flex : 1,
        flexDirection: 'row',
        alignItems: 'center',
        //paddingTop : 3,
        //paddingBottom : 3,
        height : verticalScale(60)
    },

    container_logo : {
        flex : 0.2,
        justifyContent : 'center',
        alignItems : 'center', 
        margin : scale(5)
    },

    logo_view : {
        width : verticalScale(50),
        height : verticalScale(50),
        alignItems : 'center',
        justifyContent : 'center',
        marginLeft : scale(10),
       // marginTop : 5,
    },

    logo_image: {
        resizeMode: 'contain',
        minHeight : verticalScale(50),
        minWidth : verticalScale(50),
        marginLeft : scale(10),
        marginTop :verticalScale(5), 
    },
    avatar_style: {
        borderColor: '#CCCCCC',
        borderWidth: 1
    },

    container_content_body : {
        flex : 1,
        marginLeft : scale(10),
        justifyContent : 'center'
    },

    body_view: {
        flex: 1,
        justifyContent: 'center'
    },

    group_name_text : {
        flex : 0.4,
        fontWeight : 'bold' , 
        fontSize : fontSize(16,1),// 16
    },

    member_text : {
        flex : 0.3,
        color : '#adadad',
        fontSize : fontSize(14),// 14
    },

    view_delete: {
        position: 'absolute',
        right: 0,
        top: 0,
        bottom: 0,
        height: verticalScale(60)
    },

    txt_delete: {
        color: '#fff',
        fontSize: fontSize(13,-scale(1)),
        margin  : scale(3),
        textAlign : 'center'
    },

    touchable_delete_group: {
        minWidth: scale(70),
        height: verticalScale(60),
        backgroundColor: '#EE3030',
        justifyContent: 'center',
        alignItems: 'center'
    },
});