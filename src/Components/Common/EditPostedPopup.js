import React from 'react';
import {
    Platform,
    StyleSheet,
    Text,
    // View,
    Dimensions,
    Modal,
    TouchableWithoutFeedback,
    Image
} from 'react-native';
import Touchable from 'react-native-platform-touchable';
import BaseComponent from '../../Core/View/BaseComponent';
import { View } from 'react-native-animatable';

const DELAY_TIME = 300;

export default class EditPostedPopup extends BaseComponent {

    constructor(props) {
        super(props);
        this.state = {
            isVisible: false
        }
    }

    render() {

        let { isVisible } = this.state;

        return (
            <Modal
                animationType="none"
                transparent={true}
                visible={isVisible}
                onRequestClose={() => {
                    this.dismiss();
                }}>
                <TouchableWithoutFeedback onPress={() => { this.dismiss() }}>
                    <View style={styles.container} />
                </TouchableWithoutFeedback>

                <View
                    ref={(refAnimateView) => { this.refAnimateView = refAnimateView }}
                    style={styles.view_content}>
                    <Touchable onPress={this.onEditPostPress.bind(this)}>
                        <View style={styles.view_item_top}>
                            <Image
                                style={styles.img_icon}
                                source={this.getResources().pen}
                            />
                            <Text allowFontScaling={global.isScaleFont} style={styles.txt_content}>{this.t('edit_post')}</Text>
                        </View>
                    </Touchable>

                    <View style={styles.line} />
                    <Touchable onPress={this.onDeletePostPress.bind(this)}>
                        <View style={styles.view_item}>
                            <Image
                                style={styles.img_icon}
                                source={this.getResources().ic_trash}
                            />
                            <Text allowFontScaling={global.isScaleFont} style={styles.txt_content}>{this.t('delete_post')}</Text>
                        </View>
                    </Touchable>

                </View>
            </Modal>
        );
    }

    show() {
        this.setState({
            isVisible: true
        }, () => {
            this.slideUp();
        })
    }

    dismiss() {
        this.slideDown();
        setTimeout(() => {
            this.setState({
                isVisible: false
            })
        }, DELAY_TIME)

    }

    slideUp() {
        if (this.refAnimateView)
            this.refAnimateView.animate('fadeInUp', DELAY_TIME)
    }

    slideDown() {
        if (this.refAnimateView)
            this.refAnimateView.animate('fadeOutDown', DELAY_TIME)
    }

    onEditPostPress() {
        this.dismiss();
        if (this.props.onEditPostPress) {
            this.props.onEditPostPress();
        }
    }

    onDeletePostPress() {
        this.dismiss();
        if (this.props.onDeletePostPress) {
            this.props.onDeletePostPress();
        }
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000000',
        opacity: 0.6
    },
    view_content: {
        backgroundColor: '#FFF',
        borderTopLeftRadius: 15,
        borderTopRightRadius: 15,
        position: 'absolute',
        bottom: 0,
        right: 0,
        left: 0
    },
    view_item_top: {
        flexDirection: 'row',
        alignItems: 'center',
        borderTopLeftRadius: 15,
        borderTopRightRadius: 15,
        padding: 15
    },
    view_item: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 15
    },
    img_icon: {
        width: 20,
        height: 20,
        resizeMode: 'contain',
        tintColor: '#808080'
    },
    txt_content: {
        fontSize: 15,
        color: '#3D3D3D',
        marginLeft: 20
    },
    line: {
        height: 1,
        backgroundColor: '#E0E0E0'
    }

});