import React from 'react';
import { Platform, StyleSheet, Text, View, Image, Dimensions } from 'react-native';
import Touchable from 'react-native-platform-touchable';
import BaseComponent from '../../Core/View/BaseComponent';
import PopupDialog, { SlideAnimation } from 'react-native-popup-dialog';
import HtmlText from '../../Core/Common/HtmlBoldText';

import { scale, verticalScale, fontSize } from '../../Config/RatioScale';
let { width, height } = Dimensions.get('window');
const slideAnimation = new SlideAnimation({
    slideFrom: 'bottom',
});

export default class PopupYesOrNo extends BaseComponent {

    static defaultProps = {
        content: '',
        confirmText: '',
        cancelText: ''
    }

    constructor(props) {
        super(props);
        this.type = -1;
        this.extrasData = null;
        this.state = {
            content: this.props.content
        }
        this.onCancelClick = this.onCancelClick.bind(this);
        this.onConfirmClick = this.onConfirmClick.bind(this);
    }

    setContent(content, typeData = -1, extrasData = null) {
        this.setState({
            content: content
        }, () => {
            this.show();
            this.type = typeData;
            this.extrasData = extrasData;
        });
    }

    render() {
        
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
                    <HtmlText
                        style={styles.popup_content}
                        message={this.state.content}
                    />
                    <View>
                        <View style={styles.line} />
                        <View style={styles.container_btn}>
                            <Touchable style={styles.touchable_btn} onPress={this.onCancelClick}>
                                <Text allowFontScaling={global.isScaleFont} style={styles.confirm_text}>{this.props.cancelText}</Text>
                            </Touchable>
                            <View style={styles.line_horizontal} />
                            <Touchable style={styles.touchable_btn} onPress={this.onConfirmClick}>
                                <Text allowFontScaling={global.isScaleFont} style={styles.confirm_text}>{this.props.confirmText}</Text>
                            </Touchable>
                        </View>
                    </View>

                </View>
            </PopupDialog>
        );
    }

    show(extrasData = null) {
        this.extrasData = extrasData;
        this.popupDialog.show();
        //console.log('popupDialog.show()');
    }

    dismiss() {
        this.popupDialog.dismiss();
        //console.log('popupDialog.dismiss()');
    }

    onConfirmClick() {
        this.popupDialog.dismiss();
        if (this.props.onConfirmClick != null) {
            this.props.onConfirmClick(this.type, this.extrasData);
        }
    }

    onCancelClick() {
        this.popupDialog.dismiss();
        if (this.props.onCancelClick != null) {
            this.props.onCancelClick(this.type);
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
        width: scale(320),
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
        fontSize: fontSize(15, scale(1)),// 15,
        marginTop: verticalScale(10),
        marginBottom: verticalScale(10),
        textAlign: 'center',
        justifyContent: 'center'
    },
    container_btn: {
        flexDirection: 'row'
    },
    line: {
        backgroundColor: '#ADADAD',
        height: 1,
        marginTop: verticalScale(10)
    },
    line_horizontal: {
        backgroundColor: '#ADADAD',
        width: 1
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