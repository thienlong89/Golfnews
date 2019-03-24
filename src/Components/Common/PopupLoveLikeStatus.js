import React from 'react';
import {
    Platform,
    StyleSheet,
    Text,
    // View,
    Dimensions,
    Modal,
    TouchableWithoutFeedback,
    Image,
    TouchableOpacity
} from 'react-native';
import Touchable from 'react-native-platform-touchable';
import BaseComponent from '../../Core/View/BaseComponent';
import { View } from 'react-native-animatable';

const DELAY_TIME = 300;

export default class PopupLoveLikeStatus extends BaseComponent {

    constructor(props) {
        super(props);
        this.refViewAnimation = [];
        this.state = {
            showLikePopup: false,
            likeGroupPos: 0
        }
        this.onRequestClose = this.onRequestClose.bind(this);
        this.onSetHeartClick = this.onSetHeartClick.bind(this);
        this.onSetLikeClick = this.onSetLikeClick.bind(this);
        this.onSetDislikeClick = this.onSetDislikeClick.bind(this);
    }

    render() {

        let { showLikePopup, likeGroupPos } = this.state;


        return (
            <Modal
                visible={showLikePopup}
                animationType="fade"
                transparent={true}
                onRequestClose={() => console.log('onRequestClose')}
            >

                <TouchableWithoutFeedback onPress={this.onRequestClose}>
                    <View style={{ flex: 1 }} />
                </TouchableWithoutFeedback>
                <View style={[styles.view_like_popup_group, { top: likeGroupPos }]}>
                    <TouchableOpacity onPress={this.onSetHeartClick}>
                        <View ref={(viewAnimation) => { this.refViewAnimation[0] = viewAnimation; }}>
                            <Image
                                style={styles.img_icon_popup}
                                source={this.getResources().ic_group_heart}
                            />
                        </View>

                    </TouchableOpacity>
                    <TouchableOpacity onPress={this.onSetLikeClick}>
                        <View ref={(viewAnimation) => { this.refViewAnimation[1] = viewAnimation; }}>
                            <Image
                                style={styles.img_icon_popup}
                                source={this.getResources().ic_group_like}
                            />
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={this.onSetDislikeClick}>
                        <View ref={(viewAnimation) => { this.refViewAnimation[2] = viewAnimation; }}>
                            <Image
                                style={styles.img_icon_popup}
                                source={this.getResources().ic_group_dislike}
                            />
                        </View>
                    </TouchableOpacity>
                </View>

            </Modal>
        );
    }

    onRequestClose() {
        console.log('onRequestClose')
        this.setState({
            showLikePopup: false
        })
    }

    onSetHeartClick() {
        this.setState({
            showLikePopup: false
        }, () => {
            if (this.props.onSetHeartClick) {
                this.props.onSetHeartClick();
            }
        });
    }

    onSetLikeClick() {
        this.setState({
            showLikePopup: false
        }, () => {
            if (this.props.onSetLikeClick) {
                this.props.onSetLikeClick();
            }
        });
    }

    onSetDislikeClick() {
        this.setState({
            showLikePopup: false
        }, () => {
            if (this.props.onSetDislikeClick) {
                this.props.onSetDislikeClick();
            }
        });

    }

    setVisible(visible = false, yPos = 0) {
        console.log('setModalVisible', visible, yPos);
        this.setState({
            showLikePopup: visible,
            likeGroupPos: this.isIphoneX ? yPos - 60 : yPos - 100
        }, () => {
            if (visible) {
                for (let i = 0; i < this.refViewAnimation.length; i++) {
                    if (this.refViewAnimation[i])
                        this.refViewAnimation[i].animate('slideInUp', 500);
                }
            }
        })
    }

}

const styles = StyleSheet.create({
    view_like_popup_group: {
        height: 45,
        width: 150,
        borderRadius: 25,
        backgroundColor: '#fff',
        flexDirection: 'row',
        marginLeft: 10,
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingLeft: 5,
        paddingRight: 5,
        shadowColor: 'black',
        shadowRadius: 2,
        shadowOffset: {
            width: 0,
            height: -3,
        },
        elevation: 4,
        position: 'absolute'
    },
    img_icon_popup: {
        height: 40,
        width: 40,
        resizeMode: 'contain',

    }

});