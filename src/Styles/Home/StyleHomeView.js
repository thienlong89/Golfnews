import { Platform, StyleSheet, Dimensions } from 'react-native';
import { scale, verticalScale, fontSize } from '../../Config/RatioScale';
let { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: '#FFFFFF',
        // backgroundColor : '#00aba7'
    },
    background_home: {
        width: null,
        // minHeight:  verticalScale(130),
        height: verticalScale(130),
        // marginTop : verticalScale(35),
        // paddingBottom : verticalScale(5),
        backgroundColor: 'white'
        // resizeMode: 'cover'
    },

    img_bg_grass: {
        width: width,
        height: verticalScale(90),
        resizeMode: 'cover'
    },

    view_content: {
        position: 'absolute',
        left: 0,
        top: 0,
        right: 0,
        bottom: 0
    },
    line: {
        height: 0.5,
        backgroundColor: 'rgba(255, 255, 255, 0.3)',
        marginTop: verticalScale(25)
    },
    user_group: {
        flex: 1,
        position: 'absolute',
        top: verticalScale(8),
        right: scale(10),
        // marginTop : verticalScale(35),
        // alignItems: 'flex-end',
        alignItems: 'center',
        flexDirection: 'row',
        paddingTop: 5
    },
    avatar: {
        padding: 2,
        height: verticalScale(80),
        width: scale(80),
        backgroundColor: '#FFFFFF'
    },
    avatar_container: {
        marginTop: verticalScale(10),
        backgroundColor: '#fff',
        marginLeft: scale(35)
    },
    avatar_style: {
        borderColor: '#FFFFFF',
        borderWidth: 2
    },
    user_name: {
        color: 'white',//'#383838',
        fontWeight: 'bold',
        fontSize: fontSize(19, scale(3)),
        ...Platform.select({
            ios: {
                marginTop: verticalScale(8)
            },
            android: {
                marginTop: verticalScale(2),
            }
        }),
        // marginLeft : scale(20)
    },
    user_id: {
        color: '#1e1e1e',//'#9C9C9C',
        fontWeight: 'bold',
        fontSize: fontSize(19, scale(3)),
        // marginTop : verticalScale(7)
        // marginLeft: 5
    },
    view_row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        ...Platform.select({
            ios: {
                marginTop: verticalScale(5)
            },
            android: {
                marginTop: 0
            }
        }),
        // alignItems: 'flex-start'
    },
    img_search: {
        width: scale(25),
        height: scale(25),
        resizeMode: 'contain',
        tintColor: 'black',
        marginTop: scale(5)
    },
    handicap_group: {
        position: 'absolute',
        flexDirection: 'row',
        // height: verticalScale(100),
        justifyContent: 'flex-end',
        right: scale(10),
        top: 2
        //backgroundColor : 'green'
    },
    country: {
        width: verticalScale(35),
        height: verticalScale(35),
        marginLeft: 2,
        marginTop: verticalScale(10)
    },
    handicap_bg: {
        width: scale(50),
        height: verticalScale(50),
        alignItems: 'center',
        justifyContent: 'center',
        //resizeMode : 'contain'
    },
    handicap_text: {
        color: '#FFFFFF',
        fontWeight: 'bold',
        fontSize: fontSize(18, scale(4)),
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: verticalScale(5)
    },
    ranking_group: {
        flexDirection: 'row',
        height: verticalScale(50),
        alignItems: 'flex-end',
        justifyContent: 'space-between',
        marginRight: scale(10),
        marginLeft: scale(10),
        backgroundColor: 'red'
    },
    event: {
        height: verticalScale(30),
        width: scale(30),
        resizeMode: 'contain',
        marginLeft: scale(10),
        marginBottom: scale(10)
    },
    ranking: {
        position: 'absolute',
        height: verticalScale(30),
        width: scale(30),
        marginRight: scale(10)
    },
    flight_group: {
        height: verticalScale(40),
        backgroundColor: '#F2F2F2',
        alignItems: 'center',
        justifyContent: 'center'
    },
    indicator_group: {
        flexDirection: 'row',
        height: verticalScale(30),
        alignItems: 'center',
        justifyContent: 'center'
    },
    indicator_line: {
        height: verticalScale(1),
        backgroundColor: '#E3E3E3',
    },
    flight_group_text: {
        color: '#716A6A',
        fontWeight: 'bold'
    },
    viewpaget_style: {
        flex: 1
    },
    swiper_style: {
        flex: 1
    },
    indicator_custom: {
        height: verticalScale(2),
        width: scale(50),
        margin: verticalScale(5)
    },
    listview_separator: {
        flex: 1,
        height: 1,
        backgroundColor: '#E3E3E3',
    },
    item_friend_flight_container: {
        flex: 1,
        paddingTop: verticalScale(10)
    },
    item_friend_flight: {
        flex: 1,
        flexDirection: 'row',
        height: verticalScale(30),
        justifyContent: 'space-between',
        marginLeft: scale(5),
        marginRight: scale(5)
    },
    flight_name: {
        flex: 3,
        color: '#1A1A1A',
        fontSize: fontSize(16),
        textAlignVertical: 'center'
    },
    flight_time: {
        flex: 1,
        color: '#B8B8B8',
        fontSize: fontSize(16),
        textAlignVertical: 'center',
        textAlign: 'right'
    },
    popup_style: {
        width: scale(300),
        height: verticalScale(200),
    },
    popup_title_style: {
        color: '#FFFFFF',
        fontSize: fontSize(16),
        marginTop: verticalScale(10),
        marginBottom: verticalScale(10),
        textAlign: 'center'
    },
    popup_content_group: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginLeft: scale(20),
        marginRight: scale(20),
        marginTop: verticalScale(5),
        marginBottom: verticalScale(5)
    },
    popup_system_ranking_group: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginLeft: scale(20),
        marginTop: verticalScale(5),
        marginBottom: verticalScale(5)
    },
    popup_handicap_title: {
        color: '#FFFFFF',
        fontSize: fontSize(16),
        textAlign: 'center',
        alignItems: 'center'
    },
    popup_handicap_value: {
        color: '#FFFFFF',
        fontSize: fontSize(16),
        fontWeight: 'bold',
        textAlign: 'center',
        alignItems: 'center'
    },
    popup_handicap_value_system: {
        color: '#FFFFFF',
        fontSize: fontSize(16),
        fontWeight: 'bold',
        textAlign: 'center',
        alignItems: 'center',
        marginRight: scale(20)
    },
    ranking_manner: {
        position: 'absolute',
        height: verticalScale(10),
        width: verticalScale(10),
        resizeMode: 'contain',
        right: scale(5),
        bottom: scale(5)
    },
    avatar_bg_vip: {
        width: 81,
        height: 81,
        position: 'absolute',
        bottom: 0
    },
    view_upgrade: {
        position: 'absolute',
        width: 30,
        height: 30,
        borderRadius: 15,
        borderColor: '#fff',
        borderWidth: 2,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#D1403F',
        bottom: 0,
        right: scale(-8)
    },
    img_arrow_up: {
        width: 15,
        height: 15,
        resizeMode: 'contain'
    }

});

module.exports = styles;