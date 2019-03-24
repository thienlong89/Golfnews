import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View, Image, Dimensions } from 'react-native';
import Touchable from 'react-native-platform-touchable';
import BaseComponent from '../../Core/View/BaseComponent';
import PopupDialog, { SlideAnimation } from 'react-native-popup-dialog';
import HtmlText from '../../Core/Common/HtmlBoldText';
import { scale, verticalScale, fontSize } from '../../Config/RatioScale';

export default class PopupNotifyView extends BaseComponent {

    static defaultProps = {
        content: '',
        confirmText: '',
        onDismissOutside: true
    }

    constructor(props) {
        super(props);
        this.extrasData;
        this.state = {
            content: this.props.content
        }
        this.onConfirmClick = this.onConfirmClick.bind(this);
        this.onPopupDismissed = this.onPopupDismissed.bind(this);
    }

    setContent(content, extrasData) {
        this.setState({
            content: content
        }, () => {
            this.extrasData = extrasData;
            this.show();
        });
    }

    render() {
        const slideAnimation = new SlideAnimation({
            slideFrom: 'bottom',
        });
        return (
            <PopupDialog
                ref={(popupDialog) => { this.popupDialog = popupDialog; }}
                dialogAnimation={slideAnimation}
                dismissOnTouchOutside={this.props.onDismissOutside}
                dialogStyle={styles.popup_style}
                onDismissed={this.onPopupDismissed}>
                <View style={styles.container}>
                    <View style={styles.popup_header}>
                        <Text allowFontScaling={global.isScaleFont} style={styles.popup_title_style}>{this.t('notify')}</Text>
                        <Image
                            style={styles.header_icon}
                            source={this.getResources().logo_popup}
                        />
                    </View>
                    <HtmlText
                        style={styles.popup_content}
                        message={this.state.content}
                    />
                    <View>
                        <View style={styles.line} />
                        <View style={styles.container_btn}>
                            <Touchable style={styles.touchable_btn} onPress={this.onConfirmClick}>
                                <Text allowFontScaling={global.isScaleFont} style={styles.confirm_text}>{this.props.confirmText}</Text>
                            </Touchable>
                        </View>
                    </View>

                </View>
            </PopupDialog>
        );
    }

    show() {
        this.popupDialog.show();
        console.log('popupDialog.show()');
    }

    dismiss() {
        this.popupDialog.dismiss();
        console.log('popupDialog.dismiss()');
    }

    onPopupDismissed() {
        if (this.props.onPopupDismissed != null) {
            this.props.onPopupDismissed();
        }
        if (this.props.onConfirmClick != null) {
            this.props.onConfirmClick(this.extrasData);
        }
    }

    onConfirmClick() {
        this.popupDialog.dismiss();
        // if(this.props.onConfirmClick!=null){
        //     this.props.onConfirmClick();
        // }
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
        width: scale(300),
        height: verticalScale(200),
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
        left: scale(7)
    },
    popup_title_style: {
        color: '#000000',
        fontWeight: 'bold',
        fontSize: fontSize(17, 3),// 17,
        marginTop: verticalScale(10),
        marginBottom: verticalScale(10),
        textAlign: 'center'
    },
    popup_content: {
        color: '#000000',
        fontSize: fontSize(15, 1),// 15,
        marginTop: verticalScale(10),
        marginBottom: verticalScale(10),
        textAlign: 'center'
    },
    container_btn: {
        flexDirection: 'row'
    },
    line: {
        backgroundColor: '#ADADAD',
        height: 1,
        marginTop: verticalScale(10)
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