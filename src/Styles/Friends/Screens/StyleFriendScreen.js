import { StyleSheet,Dimensions } from 'react-native';
import {scale, verticalScale, moderateScale} from '../../../Config/RatioScale';
let{width,height} = Dimensions.get('window');

export default styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor : '#fff'
    },

    separator_listview : {
        height: 1, 
        backgroundColor: '#E3E3E3' 
    },

    container_header: { 
        flex: 0.09, 
        borderColor: '#c7c7c7', 
        borderWidth: 0.5, 
        borderRadius: scale(5), 
        marginLeft: scale(7), 
        marginRight: scale(7), 
        marginTop: verticalScale(7) 
    },

    container_header_view : {
        flex: 1, 
        flexDirection: 'row' 
    },

    container_header_view_search : {
        flex: 0.1, 
        justifyContent: 'center', 
        alignItems: 'center' 
    },

    container_header_view_search_image : {
        width: scale(20), 
        height: verticalScale(20) 
    },

    container_header_view_check_handicap : {
        flex: 0.82, 
        justifyContent: 'center', 
        backgroundColor: 'green' 
    },

    container_header_view_checkbox : {
        flex: 0.08, 
        justifyContent: 'center', 
        alignItems: 'center' 
    },

    container_header_view_checkbox_view : {
        flex: 1, 
        borderColor: '#c7c7c7', 
        borderWidth: 1, 
        justifyContent: 'center', 
        alignItems: 'center'
    },

    container_header_view_checkbox_view_image : {
        resizeMode: 'center' 
    },

    container_body : {
        flex: 1,
        //zIndex : 1 
    },

    container_body_view_me : {
        width: null, 
        height: verticalScale(70), 
        paddingLeft: 0, 
        paddingRight: 0, 
        marginTop: verticalScale(10), 
        backgroundColor: '#d6d4d4',
        justifyContent : 'center' 
    },

    separator_view: {
        height: 1,
        backgroundColor: '#E3E3E3'
    },

    container_body_listview : {
        marginTop: 1, 
        paddingBottom: 1, 
        paddingLeft: 0, 
        paddingRight: 0 
    },
    facility_list: {
        position: 'absolute',
        backgroundColor: '#FFFFFF',
        left: 0,
        right: 0,
        top: verticalScale(5),
        backgroundColor: '#fff',
        bottom: 0
    }
});