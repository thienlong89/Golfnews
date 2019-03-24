import { StyleSheet,Dimensions } from 'react-native';
import {scale, verticalScale, fontSize} from '../../../Config/RatioScale';
let{width,height} = Dimensions.get('window');

export default styles = StyleSheet.create({
    container: {
        //flex: 1, 
        // minHeight: verticalScale(6),
        flexDirection: 'row',
        paddingTop: verticalScale(5),
        paddingBottom: verticalScale(5),
        minHeight: verticalScale(80),
        alignItems : 'center'
    },

    container_content: {
        flexDirection: 'row',
        paddingTop: verticalScale(5),
        paddingBottom: verticalScale(5),
        minHeight: verticalScale(70),
        backgroundColor: '#FFFFFF'
    },

    container_content_top: {
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: verticalScale(5),
        marginBottom: verticalScale(5),
        marginLeft: scale(15),
        marginRight: scale(10)
    },

    container_content_center: {
        flex: 1,
        justifyContent: 'center'
    },

    container_content_bottom: {
        flexDirection: 'row',
        padding: scale(5),
        justifyContent: 'center',
        alignItems: 'center',
    },

    avatar_style: {
        borderColor: '#FFFFFF',
        borderWidth: 2
    },

    avatar_view: {
        //flex: 1,
        width: scale(50),
        height: verticalScale(50),
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: verticalScale(5),
        marginBottom: verticalScale(5),
        marginLeft: scale(15),
        marginRight: scale(10)
    },

    avatar_image: {
        resizeMode: 'contain',
        minHeight: verticalScale(50),
        minWidth: scale(50),
        marginLeft: scale(10)
    },

    view_style: {
        marginLeft: scale(10)
    },

    container_content_view: {
        flex: 1,
        justifyContent: 'space-between',
        marginLeft : scale(10),
        paddingBottom : verticalScale(5),
        paddingTop : verticalScale(5)
    },

    fullname_text: {
        // flex: 0.3,
        fontWeight: 'bold',
        fontSize : fontSize(16,scale(2))
    },

    user_id_text: {
        // flex: 0.3,
        color: '#adadad',
        fontSize : fontSize(14),
        marginTop: scale(2),
        marginBottom: scale(2)
    },

    // container_handicap: {
    //     flex: 0.3
    // },

    handicap_view: {
        flex: 1,
        flexDirection: 'row'
    },

    handicap_text: {
        // flex: 0.9,
        // marginLeft: scale(5),
        color: '#adadad',
        fontSize : fontSize(14)
    },

    tee_view: {
        width: scale(13),
        height: verticalScale(13),
        marginBottom: verticalScale(3),
        marginTop: verticalScale(3),
        borderColor: '#919191',
        borderWidth: 0.5
    },

    container_handicap_facility: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    container_handicap_facility_delete: {
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: scale(37)
    },
    handicap_facility_view: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderColor: '#00aba7',
        borderRadius: scale(20),
        width: scale(40),
        height: scale(40),
        borderWidth: scale(1.5),
        marginRight: scale(10)
    },

    handicap_facility_text: {
        alignSelf: 'center',
        color: '#00aba7',
        fontWeight: 'bold',
        fontSize : fontSize(14)
        //fontSize : 25
    },

    icon_remove: {
        width:  scale(17),
        height: scale(17),
        resizeMode: 'contain'
    },
    touchable_icon_remove: {
        paddingLeft: scale(10),
        paddingTop: verticalScale(10),
        paddingBottom: verticalScale(10),
        paddingRight: scale(10)
    },
    touchable_tee_view: {
        justifyContent: 'center',
        alignItems: 'center'
    }
});