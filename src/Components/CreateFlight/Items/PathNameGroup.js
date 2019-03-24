import React, { Component } from 'react';
import { Platform, StyleSheet, Text, TouchableOpacity, ScrollView,Dimensions } from 'react-native';

import {scale, verticalScale, fontSize} from '../../../Config/RatioScale';

export default class PathNameGroup extends Component {

    static defaultProps = {
        listPath: [],
        item_select: -1
    }

    constructor(props) {
        super(props);
        this.state = {
            item_select: this.props.item_select
        }
    }

    onSelectPathListener(item, key) {
        console.log('index: ', key);
        this.setState({
            item_select: key
        });
        if (this.props.onPathSelected != null) {
            this.props.onPathSelected(item, key);
        }
    }

    setPathSelected(index) {
        this.setState({
            item_select: index
        });
    }

    render() {

        let paths = this.props.listPath.map((item, key) => {
            let name = item.getName() ? item.getName() : '';
            return (
                <TouchableOpacity onPress={() => this.onSelectPathListener(item, key)}
                    style={[name.length > 1 ? styles.touchable_rectangle : styles.touchable_circle, { backgroundColor: this.state.item_select === key ? '#00ABA7' : '#E8E8E8' }]}>
                    <Text allowFontScaling={global.isScaleFont} style={[styles.path_index, { color: this.state.item_select === key ? '#FFFFFF' : '#707070' }]} >
                        {name}
                    </Text>
                </TouchableOpacity>
            );
        });
        return (
            <ScrollView style={styles.path_group_all}
                contentContainerStyle={styles.content_container_style}
                horizontal={true} >
                {paths}
            </ScrollView>

        );
    }

}

const styles = StyleSheet.create({

    path_group: {
        flexDirection: 'row',
        paddingLeft: scale(15),
        paddingTop: verticalScale(15),
        paddingBottom: verticalScale(15),
        justifyContent: 'center',
        alignItems: 'center'
    },
    path_title: {
        color: '#454545',
        fontSize: fontSize(15,1),// 15,
        marginRight: scale(20),
        justifyContent: 'center'
    },
    path_group_all: {
        flexDirection: 'row',
        flex: 1,
    },
    touchable_circle: {
        height: verticalScale(40),
        width: verticalScale(40),
        borderRadius: verticalScale(20),
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: scale(13),
    },
    touchable_rectangle: {
        height: verticalScale(40),
        minWidth: verticalScale(55),
        borderRadius: verticalScale(4),
        paddingLeft: scale(4),
        paddingRight: scale(4),
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: scale(10),
        fontSize: fontSize(13,-1),// 13
    },
    path_index: {
        textAlign: 'center',
        textAlignVertical: 'center',
        fontSize: fontSize(17,2),// 17,
        alignSelf: 'center'
    },
    content_container_style: {
        justifyContent: 'flex-end',
        alignItems: 'flex-end',
        flexGrow: 1
    }

});