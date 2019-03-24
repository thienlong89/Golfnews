import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';
import Touchable from 'react-native-platform-touchable';

export default class HandicapOverKeyboard extends Component {

    static defaultProps = {
        currentOver: '',
        itemSelected: -1
    }

    constructor(props) {
        super(props);
        this.state = {
            item_selected: this.props.itemSelected
        }
    }

    render() {
        let list_above = ['-2', '-1', 'Par', 'Bogey', '+2'];
        let list_below = ['+3', '+4', '+5', '+6', '+7'];
        
        let listAbove = list_above.map((item, index) => {
            return (
                <Touchable style={[styles.keyboard_element, { backgroundColor: ( this.props.currentOver === item) ? '#CECECE' : 'rgba(0,0,0,0)' }]}
                    onPress={() => this.onKeyboardAboveListener(item, index)}>
                    <Text allowFontScaling={global.isScaleFont} style={styles.text_element} numberOfLines={1}>{item}</Text>
                </Touchable>
            );
        });

        let listBelow = list_below.map((item, index) => {
            return (
                <Touchable style={[styles.keyboard_element, { backgroundColor: (this.props.currentOver === item) ? '#CECECE' : 'rgba(0,0,0,0)' }]}
                    onPress={() => this.onKeyboardBelowListener(item, index, listAbove.length)}>
                    <Text allowFontScaling={global.isScaleFont} style={styles.text_element} numberOfLines={1}>{item}</Text>
                </Touchable>
            );
        });

        return (
            <View style={styles.container}>
                <View style={styles.keyboard_row}>
                    {listAbove}
                </View>
                <View style={styles.keyboard_row}>
                    {listBelow}
                </View>
            </View>
        );
    }

    onKeyboardAboveListener(score, index) {
        this.onEnterScore(score);
        this.setState({
            item_selected: index
        })
    }

    onKeyboardBelowListener(score, index, length) {
        this.onEnterScore(score);
        this.setState({
            item_selected: (index + length)
        })
    }

    onEnterScore(score) {
        if (this.props.onScore != null) {
            this.props.onScore(score);
        }
    }

}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#EDEDED'
    },
    keyboard_row: {
        flexDirection: 'row',
    },
    keyboard_element: {
        flex: 1,
        paddingTop: 10,
        paddingBottom: 10,
        justifyContent: 'center',
        alignItems: 'center',
        borderColor: '#FFFFFF',
        borderWidth: 1
    },
    text_element: {
        color: '#545454',
        fontWeight: 'bold',
        fontSize: 19
    },
    image_element: {
        width: 25,
        height: 25,
        resizeMode: 'contain'
    }
});