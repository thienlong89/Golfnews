import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View, Dimensions } from 'react-native';
import Touchable from 'react-native-platform-touchable';
import { scale, verticalScale, fontSize } from '../../../Config/RatioScale';
// let{width,height} = Dimensions.get('window');

export default class CourseListView extends Component {

    static defaultProps = {
        listCourse: []
    }

    constructor(props) {
        super(props);
        this.state = {
            item_select: -1
        }
    }

    onSelectCourseListener(item, key) {
        console.log('index: ', key);
        this.setState({
            item_select: key,
            teeColor: '#FFFFFF'
        });
        if (this.props.onCourseSelected != null) {
            this.props.onCourseSelected(item, key);
        }
    }

    render() {
        let courses = this.props.listCourse.map((item, key) => {
            return (
                <Touchable onPress={() => this.onSelectCourseListener(item, key)}
                    style={{
                        backgroundColor: this.state.item_select === key ? '#00ABA7' : '#FFFFFF', borderBottomLeftRadius: scale(5),
                        borderBottomRightRadius: scale(5)
                    }}>
                    <View>
                        <Text allowFontScaling={global.isScaleFont} style={styles.course_item}>{item.getTitle()}</Text>
                        <View style={styles.line} />
                    </View>
                </Touchable>
            );
        });
        return (
            <View style={styles.container} >
                {courses}
            </View>

        );
    }

}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#FFFFFF',
        borderBottomLeftRadius: scale(5),
        borderBottomRightRadius: scale(5)
    },
    course_item: {
        paddingLeft: scale(25),
        paddingRight: scale(25),
        paddingTop: verticalScale(15),
        paddingBottom: verticalScale(15),
        justifyContent: 'center',
        alignItems: 'center',
        color: '#000000',
        fontSize: fontSize(14)
    },
    line: {
        height: verticalScale(0.5),
        backgroundColor: '#EBEBEB'
    }

});