import {StyleSheet,Dimensions} from 'react-native';
import {scale, verticalScale, fontSize} from '../../Config/RatioScale';
let{width,height} = Dimensions.get('window');

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff'
    },
    view_note: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginTop: verticalScale(10)
    },
    text_bold: {
        color: '#000000',
        fontWeight: 'bold',
        fontSize : fontSize(15,scale(1))
    },
    text_detail: {
        color: '#949494',
        marginRight: verticalScale(10),
        fontSize : fontSize(14)
    },
    title_list: {
        flexDirection: 'row',
        backgroundColor: '#00BAB6',
        paddingTop: verticalScale(3),
        paddingBottom: verticalScale(3),
        paddingLeft: scale(3),
        paddingRight: scale(3)
    },
    text_rnd: {
        flex: 1,
        color: '#FFFFFF',
        fontWeight: 'bold',
        textAlign: 'center',
        fontSize : fontSize(16,scale(2))
    },
    text_course_tee: {
        flex: 5,
        color: '#FFFFFF',
        fontWeight: 'bold',
        fontSize : fontSize(16,scale(2))
    },
    text_r: {
        minWidth: verticalScale(33),
        color: '#FFFFFF',
        fontWeight: 'bold',
        textAlign: 'center',
        fontSize : fontSize(16,scale(2))
    },
    text_s: {
        minWidth: verticalScale(33),
        color: '#FFFFFF',
        fontWeight: 'bold',
        textAlign: 'center',
        fontSize : fontSize(16,scale(2))
    },
    text_g: {
        minWidth: verticalScale(33),
        color: '#FFFFFF',
        fontWeight: 'bold',
        textAlign: 'center',
        fontSize : fontSize(16,scale(2))
    },
    text_a: {
        minWidth: verticalScale(33),
        color: '#FFFFFF',
        fontWeight: 'bold',
        textAlign: 'center',
        fontSize : fontSize(16,scale(2))
    },
    listview_separator: {
        flex: 1,
        height: 1,
        backgroundColor: '#E3E3E3',
    },
    txt_select_flight: {
        color: '#000000',
        fontSize: fontSize(15),
        marginLeft: scale(10),
        marginRight: scale(10),
        marginTop: scale(15),
        marginBottom: scale(5),
        textAlign: 'center'
    }
});

module.exports = styles;