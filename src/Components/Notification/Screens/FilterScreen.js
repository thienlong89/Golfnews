import React from 'react';
import { View as V, Text, Modal, TouchableWithoutFeedback, StyleSheet } from 'react-native';
import Touchable from 'react-native-platform-touchable';
import BaseComponent from '../../../Core/View/BaseComponent';
import { View } from 'react-native-animatable';
import I18n from 'react-native-i18n';
import { fontSize, scale, verticalScale } from '../../../Config/RatioScale';

const DELAY_TIME = 300;

/**
 * Màn hình chon filter loại thông báo
 */
export default class FilterScreen extends BaseComponent {
    constructor(props) {
        super(props);
        this.state = {
            isVisible: false
        }
        // this.onClickItem = this.onClickItem.bind(this);
        this.callbackData = null;
        this.options = [];
    }

    show(options = options) {
        this.options = options;
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
            this.refAnimateView.animate('fadeInUp', DELAY_TIME);
    }

    slideDown() {
        if (this.refAnimateView)
            this.refAnimateView.animate('fadeOutDown', DELAY_TIME);
    }

    onClickItem(index,data) {
        let key = data.key;// keys[index];
        let value = data.value;// options[index];
        if(this.callbackData){
            this.callbackData(key,value);
        }
        this.dismiss();
    }

    getElement() {
        return this.options.map((d, index) => {
            return (
                <Touchable onPress={this.onClickItem.bind(this,index,d)}>
                    <V style={{minHeight : verticalScale(40),borderBottomColor : '#E0E0E0',borderBottomWidth : 1,padding : verticalScale(10)}}>
                        <Text allowFontScaling={global.isScaleFont} style={{ fontSize: fontSize(18, scale(4)), fontWeight: 'normal', color: '#000', textAlign: 'center' }}>
                            {d.value}
                        </Text>
                    </V>
                </Touchable>
            );
        });
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
                    {/* <ScrollView>
                    
                    </ScrollView> */}
                    {this.getElement()}
                </View>
            </Modal>
        );
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
});