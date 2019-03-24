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
    Image,
    ListView,
    Modal,
    ActivityIndicator,
    Platform
} from 'react-native';
import Touchable from 'react-native-platform-touchable';
import BaseComponent from '../../Core/View/BaseComponent';
import MyView from '../../Core/View/MyView';

const TAG = "[Vhandicap-v1] LoaderView : ";
const DELAY_TIME = 1200;//3 GIAY

//type Props = {};
export default class LoadingView extends Component {
    constructor(props) {
        super(props);
        this.startTime = 0;
        this.state = {
            loading: false
        }
    }

    static defaultProps = {
        isShowOverlay: true
    }

    isLoading(){
        return this.state.isLoading;
    }

    hideLoading(msg = '') {
        if(!this.state.loading) return;
        if(Platform.OS === 'android'){
            this.setState({
                loading: false
            });
            return;
        }
        if (this.props.isShowOverlay) {
            let endTime = (new Date()).getTime();
            if ((endTime - this.startTime) >= DELAY_TIME) {
                this.setState({
                    loading: false
                });
                console.log(msg);
            } else {
                //delay them 3 giay
                let deltaTime = Math.floor(endTime - this.startTime);
                deltaTime = DELAY_TIME - deltaTime;
                console.log("delta time : ", deltaTime);
                this.delayHide(deltaTime);
            }
        } else {
            this.setState({
                loading: false
            });
        }
    }

    isLoading(){
        return this.state.isLoading;
    }

    showLoading(msg = '') {
        this.startTime = (new Date()).getTime();
        //tgian du lau thi tat luon
        this.setState({
            loading: true
        });
        console.log(msg);
    }

    /**
     * delay lai 3giây mới tắt - fix lỗi khi animation vừa chạy thì không ẩn đc trong ios
     */
    delayHide(deltaTime) {
        var refreshIntervalId = setInterval(() => {
            this.setState({
                loading: false
            });
            clearInterval(refreshIntervalId);
        }, deltaTime);
    }

    componentDidMount() {
        /*
        var refreshIntervalId =setInterval(() => {
            this.setState({
                loading: !this.state.loading
            });
            clearInterval(refreshIntervalId);
            if(this.props.callbackTimeOut){
                this.props.callbackTimeOut();
            }
        }, 30000);
        */
    }

    render() {
        if (this.props.isShowOverlay) {
            return (
                <Modal
                    ref={(modal) => { this.modal = modal; }}
                    transparent={true}
                    animationType={'fade'}
                    visible={this.state.loading}
                    //hidesWhenStopped={true}
                    supportedOrientations={['portrait', 'portrait-upside-down', 'landscape', 'landscape-left', 'landscape-right']}
                    onRequestClose={() => { console.log('close modal') }}>
                    <View style={styles.modalBackground}>
                        <View style={styles.activityIndicatorWrapper}>
                            <ActivityIndicator
                                animating={this.state.loading} size='large' />
                        </View>
                    </View>
                </Modal>
            );
        } else {
            return (
                <MyView style={styles.activityIndicatorNotOverlay} hide={!this.state.loading}> 
                    <ActivityIndicator
                        animating={this.state.loading} size='large' />
                </MyView>
            );
        }

    }
}

const styles = StyleSheet.create({
    modalBackground: {
        flex: 1,
        alignItems: 'center',
        flexDirection: 'column',
        justifyContent: 'space-around',
        //backgroundColor: '#00000040'
        backgroundColor: 'rgba(0,0,0,0.6)'
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
    activityIndicatorNotOverlay: {
        position: 'absolute',
        top: 10,
        left: 0,
        right: 0,
       // bottom: 0,
        justifyContent: 'center',
        alignItems: 'center'
    }
});