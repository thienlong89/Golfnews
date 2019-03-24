import React from 'react';
import {
    Platform,
    StyleSheet,
    Text,
    TouchableOpacity,
    Image,
    ScrollView,
    Dimensions
} from 'react-native';
import Touchable from 'react-native-platform-touchable';
import BaseComponent from '../../../Core/View/BaseComponent';
import MyView from '../../../Core/View/MyView';
import { scale, verticalScale, fontSize } from '../../../Config/RatioScale';
let { width, height } = Dimensions.get('window');
import { View } from 'react-native-animatable';

export default class CourseSlopeView extends BaseComponent {

    static defaultProps = {
    }

    constructor(props) {
        super(props);
        this.state = {
            isShowCourseSlope: false
        }

        this.onShowSlopePress = this.onShowSlopePress.bind(this);
    }

    shouldComponentUpdate(){
        return false;
    }

    render() {
        return (
            <View style={styles.touchable_course_slope}>
                <Touchable onPress={this.onShowSlopePress}>
                    <Text allowFontScaling={global.isScaleFont} style={styles.text_course_slope}>{this.t('course_slope')}</Text>
                </Touchable>
            </View>
        )
    }

    onShowSlopePress() {
        if(this.props.onShowSlopePress){
            this.props.onShowSlopePress();
        }
    }

    onHideSlopePress(isShowCourseSlope) {
        this.setState({
            isShowCourseSlope: !isShowCourseSlope
        }, () => {
            if (this.refLikeCommentView)
                this.refLikeCommentView.animate('fadeInUp', 200)
            if (this.refSlopeView)
                this.refSlopeView.animate('fadeOutUp', 200)
        })
    }

}

const styles = StyleSheet.create({
    course_slope_container: {
        flex: 1,
        justifyContent: 'space-between',
        marginRight: scale(5)
    },
    touchable_course_slope: {
        marginLeft: scale(10),
        justifyContent: 'center',
        alignItems: 'flex-start'
    },
    text_course_slope: {
        color: '#00ABA7',
        fontSize: fontSize(15),// 15,
        paddingTop: verticalScale(5),
        paddingBottom: verticalScale(5),
        paddingLeft: verticalScale(10),
        paddingRight: verticalScale(10),
        minWidth: scale(80),
        borderColor: '#00ABA7',
        borderWidth: 1,
        borderRadius: 3,
        textAlign: 'center'
    },
    view_course_slope: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    icon_close_slope: {
        height: verticalScale(25),
        width: verticalScale(25),
        resizeMode: 'contain',
        marginLeft: scale(7)
    },
    tee_info_container: {
        flexDirection: 'row',
        height: verticalScale(30),
        justifyContent: 'flex-start',
        alignItems: 'center'
    },
    view_tee_color: {
        width: verticalScale(23),
        height: verticalScale(23),
        borderWidth: scale(1),
        borderColor: '#A1A1A1',
        marginLeft: scale(5)
    },
    txt_tee_slope_title: {
        color: '#716A6A',
        fontSize: fontSize(13, -scale(3)),// 13,
        includeFontPadding: false
    },
    txt_tee_slope_value: {
        color: '#716A6A',
        fontWeight: 'bold',
        fontSize: fontSize(13, -scale(3)),// 13,
        includeFontPadding: false
    },
    content_container_style: {
        justifyContent: 'flex-start',
        alignItems: 'center',
        flexGrow: 1
    }
});