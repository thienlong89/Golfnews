import { StyleSheet } from 'react-native';
import { verticalScale, scale, fontSize } from '../../Config/RatioScale';

export default styles = StyleSheet.create({
    container : {
        flex : 1,
        backgroundColor : '#00aba7'
    },

    container_header : {
        flex : 0.5,
        backgroundColor : '#00aba7'
    },

    container_body : {
        flex : 0.07,
        backgroundColor : '#00aba7'
    },

    container_body_view : {
        flex : 0.5,
        flexDirection : 'row',
        borderColor: '#c7c7c7',
        margin : verticalScale(7),
        borderWidth: 0.5, 
        borderRadius: verticalScale(25),
        backgroundColor : '#fff'
    },

    container_body_view_top : {
        flex : 0.1
    },

    container_body_view_top_view : {
        flex: 1, 
        justifyContent: 'center', 
        alignItems: 'center'
    },

    container_body_view_top_view_image : {
        flex : 0.6, 
        resizeMode : 'contain'
    },

    container_body_view_inputtext: {
        flex: 0.9, 
        paddingLeft: scale(10),
        fontSize: fontSize(14),
        lineHeight : fontSize(18,scale(4)),
        paddingTop: 0,
        paddingBottom: 0
    },
    
    container_bottom : {
        flex : 0.88
    }
});