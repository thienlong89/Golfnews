import {StyleSheet,Dimensions} from 'react-native';

import {scale, verticalScale, fontSize} from '../../Config/RatioScale';
let{width,height} = Dimensions.get('window');


const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    bottom_container: {
        height: verticalScale(55),
        alignItems: 'center',
        justifyContent: 'flex-end'
    },
    bottom_menu: {
        flexDirection: 'row',
        height: verticalScale(55),
        backgroundColor: '#F9F9F9',
        alignItems: 'flex-end',
        justifyContent: 'flex-end',
        borderTopColor: '#E5E5E5',
        borderTopWidth: 1
    },
    item_view: {
        height: verticalScale(55),
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    center_item: {
        height: verticalScale(55),
        flex: 1.5,
        marginLeft: scale(10),
        marginRight: scale(10)
    },
    touchable_enter_score: {
        flex: 1,
        marginLeft: scale(10),
        marginRight: scale(10),
        position: 'absolute',
        bottom: 0
    },
    item_enter_score: {
        flexDirection: 'column',
        height: verticalScale(60),
        width: scale(90),
        alignItems: 'center',
        justifyContent: 'center',
        //resizeMode : 'contain'
    },
    txt_enter_score: {
        color: '#FFFFFF',
        fontSize: fontSize(12,-scale(4)),
        fontWeight: 'bold',
        marginTop: verticalScale(2)
    },
    icon_home: {
        width:  scale(40),
        height: scale(40),
        resizeMode: 'contain',
        aspectRatio: 0.6
    },
    icon_friend: {
        width:  scale(40),
        height: scale(50),
        resizeMode: 'contain',
        aspectRatio: 0.65
    },
    icon_notifications: {
        width: scale(40),
        height: scale(40),
        resizeMode: 'contain',
        aspectRatio: 0.6
    },
    icon_menu: {
        width: scale(40),
        height: scale(40),
        resizeMode: 'contain',
        aspectRatio: 0.6
    },
    icon_enter_score: {
        width: scale(90),
        height: verticalScale(65),
        resizeMode: 'contain'
    },
    scoreboard: {
        width: scale(30),
        height: verticalScale(30),
        resizeMode: 'contain',
        tintColor: '#FFFFFF'
    },
    view_badge: {
        width: scale(50),
        height: verticalScale(40),
        //flex: 1,
        flexDirection: 'row',
        position: 'absolute',
        alignItems: 'flex-end',
        justifyContent: 'flex-end'
    },
    badge: {
        // height:  verticalScale(28),
       // width : verticalScale(28),
        position: 'absolute',
        alignItems: 'center',
        justifyContent: 'center',
        padding : 5
        // flex: 1
    },
    text_badge: {
        fontSize: fontSize(11,-scale(3)),
        color: "#ffffff",
        textAlign : 'center'
        //lineHeight: verticalScale(12)
    }
});

module.exports = styles;
