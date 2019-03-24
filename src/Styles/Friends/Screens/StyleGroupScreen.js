import { StyleSheet, Dimensions, Platform } from 'react-native';

export default styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff'
    },

    container_header: {
        flex: 0.12,
        marginTop: 6
    },

    container_header_view: {
        backgroundColor: '#00aba7',
        height: 35,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        margin: 7
    },

    separator_view: {
        borderColor: '#d6d4d4',
        borderWidth: (Platform.OS === 'ios') ? 1 : 0.5,
    },

    container_header_view_image: {
        width: 14,
        height: 14,
        resizeMode: 'contain'
    },

    container_header_view_text: {
        color: 'white'
    },

    container_body: {
        flex: 1
    },

    container_body_listview: {
        marginTop: 6,
        paddingBottom: 2,
        borderTopColor: '#ebebeb',
        borderTopWidth: 0.5,
        paddingLeft: 0,
        paddingRight: 0
    },

    popup_dialog_dialogstyle: {
        alignSelf: 'center',
        borderRadius: 10,
        borderWidth: 1,
        borderColor: 'white',
        transform: [
            { translateY: -Dimensions.get('window').height / 3 },
        ],
    },

    popup_dialog_header: {
        flex: 0.2,
        justifyContent: 'center',
        alignItems: 'center'
    },

    popup_dialog_header_text: {
        fontWeight: 'bold',
        alignSelf: 'center'
    },

    popup_dialog_body: {
        flex: 0.5,
        justifyContent: 'center',
        alignItems: 'center'
    },

    popup_dialog_body_top: {
        flex: 0.3
    },

    popup_dialog_body_center: {
        flex: 0.4
    },

    popup_dialog_body_bottom: {
        flex: 0.3
    },

    popup_dialog_bottom: {
        flex: 0.3,
        flexDirection: 'row',
        borderTopColor: "#adadad",
        borderTopWidth: 0.5
    },

    popup_dialog_bottom_top: {
        flex: 0.5
    },

    popup_dialog_bottom_top_view: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        borderRightWidth: 0.5,
        borderRightColor: '#adadad'
    },

    popup_dialog_bottom_top_text: {
        color: '#757575',
        alignSelf: 'center'
    },

    popup_dialog_bottom_bottom: {
        flex: 0.5
    },

    popup_dialog_bottom_bottom_view: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },

    popup_dialog_bottom_bottom_text: {
        color: '#757575',
        alignSelf: 'center'
    },

    popup_dialog_textinput: {
        paddingLeft: 3,
        borderRadius: 3,
        borderWidth: 0.5,
        borderColor: '#adadad'
    },
    touchable_add_group: {
        width: 44,
        height: 44,
        backgroundColor: '#00ABA7',
        borderRadius: 22,
        position: 'absolute',
        right: 10,
        bottom: 10,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: 'black',
        shadowRadius: 2,
        shadowOffset: {
            width: 0,
            height: -3,
        },
        elevation: 4,
    },
    img_add_group: {
        width: 25,
        height: 25,
        resizeMode: 'contain'
    }
});