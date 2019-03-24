import {StyleSheet, Platform} from 'react-native';
import { verticalScale } from '../../Config/RatioScale';

export default style = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor : '#fff'
    },

    header: {
        height : verticalScale(32),
        flexDirection: 'row',
        backgroundColor: '#f5eded',
        alignItems: 'center',
        justifyContent: 'center'
    },

    body: {
        flex: 1,
        backgroundColor: '#ffffff',
    },

    separator_view : { 
        height : (Platform.OS === 'ios') ? 1 : 0.5,
        backgroundColor : '#ebebeb'
    },

    rank: {
        width : 40,
        textAlign: 'left',
        fontSize: 15,
        marginLeft : 15,
        //backgroundColor: 'blue',
        alignSelf: 'center'
    },

    name: {
        textAlign: 'center',
        flex: 1,
        fontSize: 15,
        //backgroundColor : 'blue'
    },

    hdc: {
        textAlign: 'right',
        width: 50,
        marginRight : 10,
        fontSize: 15,
       // backgroundColor: 'yellow'
    },

    member:{
        textAlign: 'right',
        width: 80,
        fontSize: 15,
    },

    system_rank: {
        flex: 0.2,
        textAlign: 'center',
        fontSize: 13,
        //backgroundColor: 'green'
    },

    listview : {
        flex: 1, 
        marginTop: 3, 
        paddingBottom: 2, 
        paddingLeft: 0, 
        paddingRight: 0 
    },

    listview_clb : {
        marginTop: 3, 
        paddingBottom: 2, 
        paddingLeft: 0, 
        paddingRight: 0 
    },

    view_hide : {
        height: 70, 
        width: null, 
        paddingLeft: 0, 
        paddingRight: 0, 
        backgroundColor: 'rgba(226,254,253,255)' 
    }
});