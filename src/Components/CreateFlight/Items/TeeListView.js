import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';
import Touchable from 'react-native-platform-touchable';
import { scale, verticalScale, fontSize } from '../../../Config/RatioScale';

export default class TeeListView extends Component {

    static defaultProps = {
        listTee: [],
        teeDefault: ''
    }

    constructor(props) {
        super(props);
        this.state = {
            listTee: this.props.listTee,
            item_select: this.props.teeDefault
        }
    }

    setChangeTeeList(listTee){
        this.setState({
            listTee: listTee,
        });
    }

    onSelectTeeListener(item, key) {
        console.log('index: ', key);
        this.setState({
            item_select: item.getTeeName()
        });
        if (this.props.onTeeSelected != null) {
            this.props.onTeeSelected(item, key);
        }
    }

    render() {
        let tees = this.state.listTee.map((item, key) => {
            return (
                <Touchable onPress={() => this.onSelectTeeListener(item, key)} style={{ backgroundColor:  '#FFFFFF' }}>
                    <View>
                        <View style={styles.container_item}>
                            <View style={[styles.course_tee_color, { backgroundColor: item.getTeeColor() }]} />
                            <Text allowFontScaling={global.isScaleFont} style={[styles.course_tee_name, { color: this.state.item_select === key ? '#FFFFFF' : '#000000' }]}>{item.getTeeName()}</Text>
                            <View style={styles.course_tee_value_group}>
                                <Text allowFontScaling={global.isScaleFont} style={[styles.course_tee_value_bold,
                                { color: this.state.item_select === key ? '#FFFFFF' : '#000000' }]}>
                                    {`${item.getRating()}/${item.getSlope()} | `}
                                </Text>
                                <Text allowFontScaling={global.isScaleFont} style={[styles.course_tee_value_normal,
                                { color: this.state.item_select === key ? '#FFFFFF' : '#000000' }]}>
                                    {`${item.getLength()} Y`}
                                </Text>
                            </View>
                        </View>
                        <View style={styles.line} />
                    </View>
                </Touchable>
            );
        });
        return (
            <View style={styles.container} >
                {tees}
            </View>

        );
    }

}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#FFFFFF'
    },
    container_item: {
        flexDirection: 'row',
        paddingLeft: scale(25),
        paddingRight: scale(25),
        paddingTop: verticalScale(15),
        paddingBottom: verticalScale(15),
        justifyContent: 'center',
        alignItems: 'center'
    },
    course_tee_color: {
        width: verticalScale(15),
        height: verticalScale(15),
        marginRight: scale(5),
        borderColor: '#919191',
        borderWidth: 0.5
    },
    course_tee_name: {
        flex: 1,
        fontSize: fontSize(15,scale(1)),
        marginLeft: scale(4)
    },
    course_tee_value_group: {
        flexDirection: 'row'
    },
    course_tee_value_bold: {
        fontWeight: 'bold',
        fontSize: fontSize(15,scale(1))
    },
    course_tee_value_normal: {
        fontSize: fontSize(15,scale(1))
    },
    line: {
        height: 0.5,
        backgroundColor: '#EBEBEB'
    }

});