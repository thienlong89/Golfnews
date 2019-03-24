/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    ActivityIndicator,
} from 'react-native';
import Touchable from 'react-native-platform-touchable';
import BaseComponent from '../../Core/View/BaseComponent';
import MyView from '../../Core/View/MyView';

/**
 * Màn hình hiện thanh laoding đi kèm với item App
 */
export default class ItemLoadingView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false
        }
    }

    static defaultProps = {

    }

    hideLoading(msg = '') {
        this.setState({
            loading: false
        });
    }

    showLoading(msg = '') {
        //tgian du lau thi tat luon
        this.setState({
            loading: true
        });
        console.log(msg);
    }

    componentDidMount() {

    }

    render() {
        return (
            <MyView style={[styles.activityIndicatorNotOverlay,{top : this.props.top,left : this.props.left,right : this.props.right,bottom : this.props.bottom}]} hide={!this.state.loading}>
                <ActivityIndicator
                    animating={this.state.loading} size='small' />
            </MyView>
        );
    }
}

const styles = StyleSheet.create({
    activityIndicatorNotOverlay: {
        position: 'absolute',
        // top: 10,
        // left: 0,
        // right: 0,
        // bottom: 0,
        justifyContent: 'center',
        alignItems: 'center'
    }
});