import {StyleSheet} from 'react-native';

export default styles = StyleSheet.create({

    container : {
        width: 50,
        height: 50,
        marginLeft : 6,
        //backgroundColor : 'blue',
        marginTop : 5
    },

    container_mask: {
        width: 40,
        height: 40,
        justifyContent : 'center',
        borderRadius : 25 ,
        backgroundColor : 'green'
    },

    avatar_view : {
        flex : 1,
        //justifyContent : 'center',
        //backgroundColor : 'red',
    },

    delete_view : {
        width: 16, 
        height: 16, 
        //backgroundColor: 'red', 
        position: 'absolute', 
        right: 0 
    },

    delete_image : {
        width: 16, height: 16 
    }
});