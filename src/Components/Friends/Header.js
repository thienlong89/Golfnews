import React from 'react';
import {View, TextInput, TouchableOpacity, Image } from 'react-native';
import BaseComponent from '../../Core/View/BaseComponent';
import styles from '../../Styles/Friends/StyleFriendView';

export default class Header extends BaseComponent {
    constructor(props) {
        super(props);
        this.state = {
            textSearch: ''
        }
        console.log(this.props);
    }

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.container_header} />
                <View style={styles.container_body_view}>
                    {/* <TouchableOpacity style={styles.container_body_view_top}> */}
                    <TouchableOpacity style={styles.container_body_view_top}>
                        <View style={styles.container_body_view_top_view}>
                            <Image
                                style={styles.container_body_view_top_view_image}
                                source={this.getResources().ic_Search}
                            />
                        </View>
                    </TouchableOpacity>
                    <TextInput allowFontScaling={global.isScaleFont} style={styles.container_body_view_inputtext}
                        placeholder=''
                        placeholderTextColor='#a1a1a1'
                        underlineColorAndroid='rgba(0,0,0,0)'
                        onChangeText={(text) => this.setState({ textSearch: text })}
                        value={this.state.textSearch}>
                    </TextInput>
                </View>
            </View>
        );
    }
}