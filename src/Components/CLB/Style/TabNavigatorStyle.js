import { StyleSheet } from 'react-native';

export default styles = StyleSheet.create({

    container : {
        flex : 1,
    },

    header : {
        height: 80, 
        backgroundColor: '#00aba7' 
    },

    header_search : {
        height: 30, 
        flexDirection: "row", 
        marginTop: 40, 
        marginLeft: 10, 
        marginRight: 10, 
        backgroundColor: '#008986', 
        borderColor: 'gray', 
        borderWidth: 0.5, 
        borderRadius: 15 
    },

    search_view : {
        width: 40, 
        height: 30, 
        justifyContent: 'center', 
        alignItems: 'center' 
    },

    search_image : {
        width: 20, 
        height: 20, 
        resizeMode: 'contain',
        tintColor: '#60CCC9',
    },

    labelStyle: {
        fontSize: 14,
        fontWeight: 'bold',
        // color: '#424242',
        // height: (deviceHeight * 4) / 67,
        position: 'relative',
        alignSelf: 'center',
        // padding: 6,
        // marginTop: 5,
    },

    tabStyle: {
        justifyContent: 'center',
        alignItems: 'center',
        height: 40,
    },
    style: {
        backgroundColor: '#fff',
        height: 40,
    },
    iconStyle: {
        backgroundColor: "#858585"
    },
    indicatorStyle: {
        backgroundColor: '#00aba7'
    },
    input_search: {
        flex: 1,
        fontSize: 14,
        lineHeight : 16,
        paddingBottom: 0,
        paddingTop: 0,
        color: '#FFF'
    }
});