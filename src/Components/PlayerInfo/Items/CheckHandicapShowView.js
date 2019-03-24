import React from 'react';
import {View,Text,ImageBackground,StyleSheet} from 'react-native';
import BaseComponent from '../../../Core/View/BaseComponent';
import MyView from '../../../Core/View/MyView';
import {scale,verticalScale,fontSize} from '../../../Config/RatioScale';

export default class CheckHandicapShowView extends BaseComponent {
    constructor(props) {
        super(props);
        this.state = {
            teeColor : '',
            course_name : '',
            isHideHandicap : true,
            handicap_facility : ''
        }
    }

    setDataCourse(teeColor,course_name,handicap_facility){
        console.log(".............................set data course ",teeColor,course_name,handicap_facility);
        this.setState({
            teeColor : teeColor,
            course_name : course_name,
            isHideHandicap : false,
            handicap_facility : handicap_facility
        });
    }

    setHideCourseShow(){
        this.setState({
            isHideHandicap : true
        });
    }

    render() {
        let{teeColor,course_name,isHideHandicap,handicap_facility} = this.state;
        return (
            <MyView style={styles.course_handicap_group} hide={isHideHandicap}>
                <View style={[styles.course_tee, { backgroundColor: teeColor }]} />
                <Text allowFontScaling={global.isScaleFont} style={styles.course_name}>{course_name}</Text>
                <ImageBackground style={styles.bg_handicap}
                    imageStyle={{ resizeMode: 'stretch', height: this.getRatioAspect().verticalScale(30) }}
                    resizeMode='contain'
                    source={this.getResources().ic_circle_blue}>
                    <Text allowFontScaling={global.isScaleFont} style={styles.handicap_facility}>{this.getAppUtil().handicap_display(handicap_facility)}</Text>
                </ImageBackground>
            </MyView>
        );
    }
}

const styles = StyleSheet.create({

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
        fontSize : fontSize(14)
    }
});
