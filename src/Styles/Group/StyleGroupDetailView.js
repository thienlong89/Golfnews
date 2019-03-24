import {StyleSheet,Platform,Dimensions} from 'react-native';
import {scale, verticalScale, fontSize} from '../../Config/RatioScale';

export default styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor : '#fff'
    },

    container_content : {
        flex: 1
    },

    container_content_listview : {
        marginTop:  verticalScale(2), 
        paddingBottom: verticalScale(1), 
        paddingLeft: 0, 
        paddingRight: 0 
    },

    separator_listview : {
        height: 1, 
        backgroundColor: '#E3E3E3' 
    },
    
    dropdown_menu_view_member : {
        position: 'absolute', 
        borderColor : '#414141',
        borderWidth : (Platform.OS === 'ios') ? 1 : 1, 
        width: scale(160), 
        height: verticalScale(45), 
        right: scale(10), 
        top: verticalScale(70)
    },

    dropdown_menu_view_host : {
        position: 'absolute',
        borderColor : '#414141',
        borderWidth : (Platform.OS === 'ios') ? 1 : 1, 
        width: scale(160), 
        height: verticalScale(90), 
        right: scale(10), 
        top: verticalScale(70)
    },

    menu_info_view : {
        width: scale(160), 
        height: verticalScale(45), 
        backgroundColor: '#fff', 
        justifyContent: 'center' 
    },

    menu_group_delete_view : {
        width: scale(160), 
        height: verticalScale(45), 
        backgroundColor: '#cffaf9', 
        justifyContent: 'center'
    },

    menu_text : {
        marginLeft: scale(10),
        fontSize : fontSize(14),
        color: '#6e6e6e' 
    },

    share_view: {
<<<<<<< HEAD
        height: verticalScale(40),
        marginBottom: verticalScale(10),
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#00aba7',
        marginLeft: scale(10),
        marginRight: scale(10)
=======
        position: 'absolute',
        right: 10,
        bottom: 10,
>>>>>>> handicap_v3
    },

    delete_group : {
        height: verticalScale(40),
        marginBottom: verticalScale(10),
        //flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#00aba7',
        marginLeft: scale(10),
        marginRight: scale(10)
    },

    delete_text : {
        fontSize : fontSize(20,scale(6)),// 20,
        color : '#fff',
        textAlign : 'center'
    },

    share_image: {
        width: scale(30),
        height: verticalScale(20),
        resizeMode: 'contain'
    },

    share_text: {
        marginLeft: scale(8),
        color: 'white',
        textAlign: 'center',
<<<<<<< HEAD
        fontSize: fontSize(20,scale(6)),// 20
=======
        fontSize: 20
    },
    img_share_logo: {
        width: 25,
        height: 25,
        resizeMode: 'contain'
    },
    touchable_share_logo: {
        width: 44,
        height: 44,
        backgroundColor: '#00ABA7',
        borderRadius: 22,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: 'black',
        shadowRadius: 2,
        shadowOffset: {
            width: 0,
            height: -3,
        },
        elevation: 4,
>>>>>>> handicap_v3
    }
});