import {StyleSheet} from 'react-native';
import { verticalScale, scale, fontSize } from '../../Config/RatioScale';

export default styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor : '#fff'
    },

    header : {
        height: verticalScale(150), 
        flexDirection: 'row', 
        alignItems: 'center',
        paddingLeft : scale(10) 
    },

    header_text : {
        marginLeft: scale(6), 
        fontSize: fontSize(20,scale(6)), 
        color: '#1a1a1a', 
        fontWeight: 'bold' 
    },

    line_big : {
        height: verticalScale(10), 
        backgroundColor: '#f2f2f2'
    },

    member_list_view : {
        height:verticalScale(30), 
        justifyContent: 'center', 
        flexDirection: 'row', 
        alignItems: 'center' 
    },

    member_list_text : {
        marginLeft : scale(10), 
        flex: 1, 
        fontSize: fontSize(14), 
        color: '#828282' 
    },

    add_member_view : {
        width: verticalScale(30), 
        height: verticalScale(30), 
        justifyContent: 'center', 
        alignItems: 'center'
    },

    add_member_image : {
        width: verticalScale(22), 
        height: verticalScale(22), 
        resizeMode: 'contain', 
        marginRight: scale(10) 
    },

    container_content : {
        flex: 1
    },

    container_content_listview : {
        marginTop: verticalScale(2), 
        paddingBottom: 1, 
        paddingLeft: 0, 
        paddingRight: 0 
    },

    separator_listview : {
        height: 1, 
        backgroundColor: '#E3E3E3' 
    },
    
    dropdown_menu_view_member : {
        position: 'absolute', 
        width: scale(160), 
        height: verticalScale(45), 
        right: scale(10), 
        top: verticalScale(70)
    },

    dropdown_menu_view_host : {
        position: 'absolute', 
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
        height: verticalScale(40),
        marginBottom: verticalScale(10),
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#00aba7',
        marginLeft: scale(10),
        marginRight: scale(10)
    },

    share_image: {
        width: scale(30),
        height: verticalScale(20),
        resizeMode: 'center'
    },

    share_text: {
        marginLeft: scale(8),
        color: 'white',
        textAlign: 'center',
        fontSize: fontSize(20,scale(6))
    }
});