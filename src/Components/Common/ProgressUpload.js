/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    Modal,
    Platform,Dimensions
} from 'react-native';
import MyView from '../../Core/View/MyView';
import * as Progress from 'react-native-progress';
import {scale, verticalScale, moderateScale} from '../../Config/RatioScale';
let{width,height} = Dimensions.get('window');

//const TAG = "[Vhandicap-v1] LoaderView : ";
const DELAY_TIME = 1200;//3 GIAY

export default class ProgressUpload extends Component {

    static defaultProps = {
        isModalView: true,
        showsText: true
    }

    constructor(props) {
        super(props);
        this.startTime = 0;
        this.state = {
            loading: false,
            progress: 0
        }
    }

    hideLoading() {
        if (!this.state.loading) return;
        if (Platform.OS === 'android') {
            this.setState({
                loading: false
            });
            return;
        }
        if (this.props.isModalView) {
            let endTime = (new Date()).getTime();
            if ((endTime - this.startTime) >= DELAY_TIME) {
                this.setState({
                    loading: false
                });
                // console.log(msg);
            } else {
                //delay them 3 giay
                let deltaTime = Math.floor(endTime - this.startTime);
                deltaTime = DELAY_TIME - deltaTime;
                // console.log("delta time : ", deltaTime);
                this.delayHide(deltaTime);
            }
        } else {
            this.setState({
                loading: false
            });
        }

    }

    showLoading() {
        this.startTime = (new Date()).getTime();
        //tgian du lau thi tat luon
        this.setState({
            loading: true,
            progress: 0
        });
    }

    setProgress(progress = 0) {
        this.setState({
            progress: progress
        });
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

    render() {
        if (this.props.isModalView) {
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
                            <Progress.Circle
                                style={styles.progress}
                                progress={this.state.progress}
                                showsText={this.props.showsText}
                                size={verticalScale(70)}
                                color='#00ABA7'
                            />
                        </View>
                    </View>
                </Modal>
            );
        } else {
            // dung trong viec thay avatar
            return (
                <MyView style={styles.activityIndicatorNotOverlay} hide={!this.state.loading}>
                    <Progress.Circle
                        style={styles.progress}
                        progress={this.state.progress}
                        showsText={this.props.showsText}
                        size={verticalScale(60)}
                        color='#00ABA7'
                    />
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
        backgroundColor: 'rgba(0,0,0,0.85)'
    },
    activityIndicatorWrapper: {
        //backgroundColor: '#FFFFFF',
        height:  verticalScale(100),
        width: verticalScale(100),
        borderRadius: verticalScale(10),
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-around'
    },
    activityIndicatorNotOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: scale(20),
        bottom: verticalScale(30),
        justifyContent: 'center',
        alignItems: 'center'
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
        paddingVertical: verticalScale(20),
    },
    // welcome: {
    //     fontSize: 20,
    //     textAlign: 'center',
    //     margin: 10,
    // },
    circles: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    progress: {
        margin:  scale(10)
    },
});