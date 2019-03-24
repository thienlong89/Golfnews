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
 * hieenj manf hinh loading- chi dung trong mot so truong hop khi khong dung duoc Loadingview(xay ra tren ios)
 */
export default class CustomLoadingView extends BaseComponent {

    static defaultProps = {
        isVisible: false
    }

    constructor(props) {
        super(props);
        this.state = {
            visible: this.props.isVisible
        }
    }

    setVisible(isVisible) {
        this.setState({
            visible: isVisible
        });
    }

    showLoading() {
        this.setVisible(true);
    }

    hideLoading() {
        let { visible } = this.state;
        if (!visible) return;
        this.setVisible(false);
    }

    render() {
        let { backgroundColor } = this.props;
        return (
            <MyView style={[styles.loading, { backgroundColor: backgroundColor ? backgroundColor : 'rgba(0,0,0,0.6)' }]} hide={!this.state.visible}>
                <View style={[styles.activityIndicatorWrapper, { marginTop: this.props.top ? this.props.top : 0 }]}>
                    <ActivityIndicator
                        color='#F36F25'
                        animating={this.state.loading} size='large' />
                </View>
            </MyView>
        );
    }
}

const styles = StyleSheet.create({
    loading: {
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
        alignItems: 'center',
        flexDirection: 'column',
        zIndex: 2
        // justifyContent: 'space-around',
        //backgroundColor: '#00000040'
        // backgroundColor: 'rgba(0,0,0,0.6)'
    },

    activityIndicatorWrapper: {
        //backgroundColor: '#FFFFFF',
        height: 100,
        width: 100,
        borderRadius: 10,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-around'
    },
})