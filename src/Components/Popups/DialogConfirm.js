import React from 'react';
import { Platform, StyleSheet, Text, View, Image, Dimensions } from 'react-native';
import Touchable from 'react-native-platform-touchable';
import BaseComponent from '../../Core/View/BaseComponent';
import PopupDialog, { SlideAnimation } from 'react-native-popup-dialog';
import HtmlText from '../../Core/Common/HtmlBoldText';

import { scale, verticalScale, fontSize } from '../../Config/RatioScale';
let { width, height } = Dimensions.get('window');
let popupWidth = width - scale(40);

/**
 * Dùng khi xác nhận kết bạn hoặc hủy kết bạn
 */
export default class DialogConfirm extends BaseComponent {

    static defaultProps = {
        content: '',
        confirmText: '',
        cancelText: ''
    }

    constructor(props) {
        super(props);
        this.state = {
            content: this.props.content
        }
        this.onCancelClick = this.onCancelClick.bind(this);
        this.onConfirmClick = this.onConfirmClick.bind(this);

        this.confirmCallback = null;

        this.okCallback = null;
        this.cancelCallback = null;
    }

    setContent(content) {
        this.setState({
            content: content
        }, () => {
            this.show();
        });
    }

    render() {
        const slideAnimation = new SlideAnimation({
            slideFrom: 'bottom',
        });
        let { cancelText, confirmText } = this.props;
        return (
            <PopupDialog
                ref={(popupDialog) => { this.popupDialog = popupDialog; }}
                dialogAnimation={slideAnimation}
                dialogStyle={styles.popup_style}>
                <View style={styles.container}>
                    <View style={styles.popup_header}>
                        <Text allowFontScaling={global.isScaleFont} style={styles.popup_title_style}>{this.t('notify')}</Text>
                        <Image
                            style={styles.header_icon}
                            source={this.getResources().logo_popup}
                        />
                    </View>
                    <View style={{justifyContent : 'center',alignContent : 'center',flex : 1}}>
                        <HtmlText
                            style={styles.popup_content}
                            message={this.state.content}
                        />
                    </View>
                    <View >
                        <View style={styles.line} />
                        <View style={styles.container_btn}>
                            <Touchable style={styles.touchable_btn} onPress={this.onCancelClick}>
                                <Text allowFontScaling={global.isScaleFont} style={styles.confirm_text}>{cancelText}</Text>
                            </Touchable>
                            <View style={styles.line_horizontal} />
                            <Touchable style={styles.touchable_btn} onPress={this.onConfirmClick}>
                                <Text allowFontScaling={global.isScaleFont} style={styles.confirm_text}>{confirmText}</Text>
                            </Touchable>
                        </View>
                    </View>

                </View>
            </PopupDialog>
        );
    }

    show() {
        this.popupDialog.show();
        //console.log('popupDialog.show()');
    }

    dismiss() {
        this.popupDialog.dismiss();
        //console.log('popupDialog.dismiss()');
    }

    onConfirmClick() {
        this.popupDialog.dismiss();
        if (this.confirmCallback) {
            this.confirmCallback();
        }
        if (this.okCallback) {
            this.okCallback();
        }
    }

    onCancelClick() {
        this.popupDialog.dismiss();
        if (this.cancelCallback) {
            this.cancelCallback();
        }
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        justifyContent: 'space-between',
        borderRadius: 7
    },
    popup_style: {
        width: popupWidth,
        height: verticalScale(220),
        backgroundColor: '#FFFFFF',
        borderRadius: 7
    },
    popup_header: {
        flexDirection: 'row',
        backgroundColor: '#F0F0F0',
        justifyContent: 'center',
        alignItems: 'center',
        borderTopLeftRadius: 7,
        borderTopRightRadius: 7
    },
    header_icon: {
        position: 'absolute',
        width: verticalScale(40),
        height: verticalScale(40),
        resizeMode: 'contain',
        left: scale(3)
    },
    popup_title_style: {
        color: '#685D5D',
        fontWeight: 'bold',
        fontSize: fontSize(17, scale(3)),// 17,
        marginTop: verticalScale(10),
        marginBottom: verticalScale(10),
        textAlign: 'center'
    },
    popup_content: {
        color: '#685D5D',
        fontSize: fontSize(18, scale(4)),// 15,
        // marginTop: verticalScale(10),
        // marginBottom: verticalScale(10),
        margin: scale(15),
        textAlign: 'center',
        justifyContent: 'center',
        flex: 1
    },
    container_btn: {
        flexDirection: 'row',
        minHeight: scale(45)
    },
    line: {
        backgroundColor: '#ADADAD',
        height: verticalScale(0.5)
    },
    line_horizontal: {
        backgroundColor: '#ADADAD',
        width: scale(0.5)
    },
    touchable_btn: {
        flex: 1,
        paddingTop: verticalScale(10),
        paddingBottom: verticalScale(10),
        justifyContent: 'center',
        alignItems: 'center'
    },
    confirm_text: {
        color: '#757575',
        fontSize: fontSize(17, scale(3)),// 17
    }
});