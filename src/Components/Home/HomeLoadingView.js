import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    ActivityIndicator
} from 'react-native';
import Touchable from 'react-native-platform-touchable';
import BaseComponent from '../../Core/View/BaseComponent';
import MyView from '../../Core/View/MyView';

/**
 * Hiện màn hình loading ở màn hình Home khi vào app
 * khi load xong thông tin user mới cho chuyển sang màn hình khác
 */
export default class HomeLoadingView extends BaseComponent {
    constructor(props) {
        super(props);
        this.state = {
            visible : false
        }
    }

    setVisible(isVisible){
        if(isVisible === this.state.visible) return;
        this.setState({
            visible : isVisible
        });
    }

    render() {
        return (
            <MyView style={styles.loading} hide={!this.state.visible}>
                <View style={[styles.activityIndicatorWrapper,{marginTop : this.props.top ? this.props.top : 50}]}>
                    <ActivityIndicator
                        animating={this.state.loading} size='large' />
                </View>
            </MyView>
        );
    }
}

const styles = StyleSheet.create({
    loading : {
        position : 'absolute',
        top : 0,
        left : 0,
        bottom : 0,
        right : 0,
       // alignItems: 'center',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        //backgroundColor: '#00000040'
        backgroundColor: 'rgba(0,0,0,0.1)'
    },

    activityIndicatorWrapper: {
        //backgroundColor: '#FFFFFF',
        height: 100,
        width: 100,
        borderRadius: 10,
        //marginTop : 50,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-around'
    },
})