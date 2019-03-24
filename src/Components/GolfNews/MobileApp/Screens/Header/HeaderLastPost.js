import React from 'react';
import { View, Text,Dimensions,StyleSheet } from 'react-native';
import BaseComponent from '../../../../../Core/View/BaseComponent';
let{width} = Dimensions.get('window');

export default class HeaderLastPost extends BaseComponent {
    constructor(props) {
        super(props);
        this.state = {
            show: true,
            title: ''
        }
    }

    showHeaderTitle(title){
        this.setState({
            show : true,
            title : title
        });
    }

    render() {
        let { show, title } = this.state;
        if (!show) return null;
        return (
            <View style={styles.container}>
                <Text style={styles.txt_title}>{title}</Text>
                <View style={styles.view_line} />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container : {
        marginLeft: 6, 
        marginRight: 10,
        marginTop : 2
    },

    txt_title : {
        fontSize: 20, 
        color: '#F36F25', 
        textAlign: 'left'
    },

    view_line : {
        height : 7,
        width : width-10,
        backgroundColor : '#F36F25'
    }
});