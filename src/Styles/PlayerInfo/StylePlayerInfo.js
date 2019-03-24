import { Platform, StyleSheet, Dimensions } from 'react-native';
import { scale, verticalScale, fontSize } from '../../Config/RatioScale';
let { width, height } = Dimensions.get('window');
// let { width } = Dimensions.get('window');
let btn_width = parseInt((width - scale(30)) / 2);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF'
    },
    background_home: {
        width: null,
        height: verticalScale(260),
        flexDirection: 'column'
    },
    container_content: {
        flex: 1
    },
    header_line: {
        height: verticalScale(0.5),
        backgroundColor: '#4DFFFFFF',
        marginTop: verticalScale(25)
    },
    swiper_page1: {

    },
    swiper_page2: {
        flex: 1,
        justifyContent: 'center'
    },
    player_info_view: {
        flexDirection: 'row',
        marginRight: scale(10)
    },
    player_view: {
        flex: 3,
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    ranking_view: {
        flex: 4,
        backgroundColor: '#330D0D0D',
        borderRadius: scale(10),
        marginTop: verticalScale(10)
    },
    avatar_container: {
        marginTop: verticalScale(10)
    },
    avatar_style: {
        borderColor: '#FFFFFF',
        borderWidth: 2
    },
    user_name: {
        color: '#FFFFFF',
        fontWeight: 'bold',
        fontSize: fontSize(15),// 15,
        marginTop: verticalScale(5)
    },
    user_id: {
        color: '#FCFF66',
        fontWeight: 'bold',
        fontSize: fontSize(15),// 15,
        marginTop: verticalScale(2)
    },
    user_club_id: {
        color: '#77FCEC',
        // fontWeight: 'bold',
        // fontSize: 15,
        // marginTop: 2
    },
    ranking_title: {
        backgroundColor: '#EFEFF4',
        borderRadius: scale(8),
        color: '#014736',
        textAlign: 'center',
        textAlignVertical: 'center',
        fontSize: fontSize(15),// 15,
        paddingTop: verticalScale(3),
        paddingBottom: verticalScale(3)
    },
    ranking_view_item: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginRight: scale(20),
        marginLeft: scale(10)
    },
    ranking_text: {
        color: '#FFFFFF'
    },
    ranking_value: {
        color: '#FFE24A',
        fontWeight: 'bold'
    },
    ranking_line: {
        backgroundColor: '#FFFFFF',
        marginRight: scale(20),
        marginLeft: scale(10),
        marginTop: verticalScale(3),
        marginBottom: verticalScale(3),
        height: 0.5
    },
    ranking_manner: {
        position: 'absolute',
        height: verticalScale(10),
        width: scale(10),
        resizeMode: 'contain',
        right: scale(5)
    },
    ranking_view_system: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginRight: 0,
        marginLeft: scale(10),
        alignItems: 'center'
    },
    ranking_system_value: {
        color: '#FFE24A',
        fontWeight: 'bold',
        marginRight: scale(20)
    },
    club_group_bg: {
        flex: 1,
        width: null,
        marginRight: scale(10),
        marginLeft: scale(10),
        marginTop: verticalScale(20)
    },
    club_group_view: {
        flexDirection: 'row',
        height: verticalScale(30),
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    club_joined: {
        color: '#014736',
        marginLeft: scale(10)
    },
    club_icon_group: {
        flexDirection: 'row',
        height: verticalScale(40),
        marginRight: scale(10)
    },
    club_logo: {
        height: verticalScale(45),
        width: verticalScale(45),
        marginLeft: scale(10),
        marginRight: scale(10)
    },
    player_info_item_first: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginLeft: scale(45),
        marginRight: scale(45)
    },
    player_info_item: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginLeft: scale(45),
        marginRight: scale(45),
        marginTop: verticalScale(10)
    },
    player_info_label: {
        color: '#FFFFFF',
        fontSize: fontSize(15),// 15
    },
    player_info_value: {
        color: '#FFFFFF',
        fontWeight: 'bold',
        fontSize: fontSize(15),//15
    },
    touchable_back: {
        position: 'absolute',
        height: verticalScale(50),
        width: scale(50),
        marginTop: verticalScale(25)

    },
    icon_back: {
        height: verticalScale(22),
        width: scale(22),
        resizeMode: 'contain',
        marginTop: verticalScale(15),
        marginLeft: scale(10)
    },
    indicator_group: {
        position: 'absolute',
        flexDirection: 'row',
        height: verticalScale(20),
        alignItems: 'center',
        justifyContent: 'center',
        bottom: 0,
        left: 0,
        right: 0
    },
    indicator_custom: {
        height: verticalScale(2),
        width: scale(50),
        margin: verticalScale(5)
    },
    touchable_friend: {
        position: 'absolute',
        height: verticalScale(40),
        width: scale(50),
        right: 0,
        bottom: 0,
        justifyContent: 'flex-end',
        alignItems: 'flex-end'

    },
    icon_friend: {
        height: verticalScale(25),
        width: verticalScale(25),
        resizeMode: 'contain',
        marginRight: scale(10),
        marginBottom: verticalScale(5)
    },
    search_course_group: {
        height: verticalScale(35),
        borderColor: '#c7c7c7',
        borderWidth: 0.5,
        borderRadius: 5,
        marginLeft: scale(10),
        marginRight: scale(10),
        marginTop: verticalScale(10),
        flexDirection: 'row',
        alignItems: 'center'
    },
    icon_search: {
        flex: 0.1,
        height: verticalScale(20),
        width: verticalScale(20),
        resizeMode: 'center'
    },
    input_search: {
        flex: 0.8,
        paddingLeft: scale(10)
    },
    touchable_check_course: {
        flex: 0.1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    bg_down_arrow: {
        flex: 1,
        padding: 0.5,
        justifyContent: 'center',
        alignItems: 'center'
    },
    line_vertical: {
        height: 5,
        backgroundColor: '#DADADA',
        width: width
    },
    course_handicap_group: {
        flexDirection: 'row',
        marginLeft: scale(10),
        marginRight: scale(10),
        marginBottom: verticalScale(10),
        minHeight: verticalScale(30),
        alignItems: 'center'
    },
    course_tee: {
        width: verticalScale(15),
        height: verticalScale(15),
        marginRight: scale(5),
        borderColor: '#919191',
        borderWidth: verticalScale(0.5)
    },
    course_name: {
        color: '#666666',
        fontSize: fontSize(14),// 14,
        marginRight: scale(40)
    },
    bg_handicap: {
        position: 'absolute',
        width: verticalScale(32),
        height: verticalScale(32),
        right: 0,
        justifyContent: 'center',
        alignItems: 'center'
    },
    handicap_facility: {
        color: '#00BAB6',
        textAlign: 'center',
        textAlignVertical: 'center',
        fontSize: fontSize(14)
    },
    line_history: {
        height: verticalScale(4),
        backgroundColor: '#E5E5E5',
        marginBottom: verticalScale(5)
    },
    flight_history_btn_view: {
        backgroundColor: '#FFFFFF',
        height: verticalScale(50),
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
    },
    touchable_flight_history: {
        flex: 1,
        height: verticalScale(40),
        justifyContent: 'center',
        alignItems: 'center'
    },
    text_flight_history: {
        color: '#00BAB6',
        fontSize: fontSize(14)
    },
    flight_history_group: {
        marginTop: verticalScale(10),
        flex: 1,
        backgroundColor: '#FFFFFF'
    },
    flight_history_invisible_group: {
        marginTop: verticalScale(10),
        marginBottom: verticalScale(10),
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    cannot_view_history_text: {
        color: 'red',
        fontSize: fontSize(17, scale(2)),// 17,
        marginLeft: scale(20),
        marginRight: scale(20),
        textAlign: 'center'
    },
    flight_history_title_group: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingLeft: scale(10),
        paddingRight: scale(10)
    },
    flight_history_title: {
        color: '#545454',
        fontWeight: 'bold',
        fontSize: fontSize(14)
    },
    list_spinner: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        borderColor: '#C7C7C7',
        borderWidth: 1,
        marginLeft: scale(10),
        marginRight: scale(10)
    },
    listview_separator: {
        flex: 1,
        height: 1,
        backgroundColor: '#E3E3E3',
    },
    scrollContainer: {

    },
    title: {
        marginVertical: verticalScale(16),
        color: "black",
        fontWeight: "bold",
        fontSize: fontSize(24, scale(8)),// 24
    },

    btn_text: {
        marginLeft: scale(15), 
        fontSize: fontSize(16, scale(2)), 
        color: '#343434'
    },

    view_btn : {
        width: btn_width, 
        height: verticalScale(50), 
        borderColor: 'rgba(0,0,0,0.25)', 
        borderRadius: 5, 
        borderWidth: 1, 
        marginLeft: scale(10), 
        flexDirection: 'row', 
        alignItems: 'center' 
    },

    btn_img : {
        width: verticalScale(30), 
        height: verticalScale(30), 
        marginLeft: scale(15), 
        resizeMode: 'contain', 
        tintColor: '#282828' 
    }
});

module.exports = styles;