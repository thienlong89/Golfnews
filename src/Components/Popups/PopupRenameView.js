import React from 'react';
import { StyleSheet, Text, View, Image, Dimensions } from 'react-native';
import Touchable from 'react-native-platform-touchable';
import BaseComponent from '../../Core/View/BaseComponent';
import PopupDialog, { SlideAnimation } from 'react-native-popup-dialog';

import { scale, verticalScale, fontSize } from '../../Config/RatioScale';
import MyTextField from '../CustomComponent/MyTextField';
let { width, height } = Dimensions.get('window');
let popupWidth = width - scale(40);

/**
 * Dùng khi xác nhận kết bạn hoặc hủy kết bạn
 */
export default class PopupRenameView extends BaseComponent {

    static defaultProps = {
        content: '',
        confirmText: '',
        cancelText: ''
    }

    constructor(props) {
        super(props);
        this.state = {
            content: this.props.content,
            oldName: ''
        }
        this.onCancelClick = this.onCancelClick.bind(this);
        this.onConfirmClick = this.onConfirmClick.bind(this);
        this.onDismissed = this.onDismissed.bind(this);

        this.confirmCallback = null;

        this.okCallback = null;
        this.cancelCallback = null;

        this.isShowed = false;
        this.action = false;
    }

    setContent(content, title = '') {
        this.setState({
            oldName: content,
            title: title
        }, () => {
            this.show();
        });
    }

    render() {
        const slideAnimation = new SlideAnimation({
            slideFrom: 'bottom',
        });
        let { cancelText, confirmText } = this.props;
        let { oldName, title } = this.state;
        return (
            <PopupDialog
                ref={(popupDialog) => { this.popupDialog = popupDialog; }}
                dialogAnimation={slideAnimation}
                onDismissed={this.onDismissed}
                dialogStyle={styles.popup_style}>
                <View style={styles.container}>
                    <View style={styles.popup_header}>
                        <Text allowFontScaling={global.isScaleFont} style={styles.popup_title_style}>{title}</Text>
                        <Image
                            style={styles.header_icon}
                            source={this.getResources().logo_popup}
                        />
                    </View>
                    <View style={{ flex: 1, justifyContent: 'center',paddingBottom : verticalScale(10) }}>
                        <Text allowFontScaling={global.isScaleFont} style={styles.text_old_name}>{this.t('old_name')}
                            <Text allowFontScaling={global.isScaleFont} style={{ fontWeight: 'normal' }}>
                                : {oldName}
                            </Text>

                        </Text>
                        <View style={styles.view_textfield}>
                            <MyTextField
                                ref={(refNewName) => { this.refNewName = refNewName; }}
                                label={this.t('new_name_input')}
                                style={{ width: popupWidth - scale(40), minHeight: verticalScale(30), marginLeft: scale(10), paddingBottom: 0, paddingTop: 0 }}
                                tintColor='#737373'
                                lineWidth={0}
                                activeLineWidth={0}
                                disabledLineWidth={0}
                                labelFontSize={fontSize(16, scale(2))}
                                fontSize={fontSize(17, scale(3))}
                                // onSubmitEditing={this.titleSubmit}
                                // onChangeText={this.onChangeText}
                                // onFocus={() => this.onHandicapScoreFocus()}
                                error={''}
                                // keyboardType='numeric'
                                errorColor='#FF0000'
                            />
                        </View>
                    </View>
                    <View>
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
        this.isShowed = true;
        //console.log('popupDialog.show()');
    }

    isShow() {
        return this.isShowed;
    }

    dismiss() {
        this.popupDialog.dismiss();
        this.isShowed = false;
        //console.log('popupDialog.dismiss()');
    }

    onConfirmClick() {
        this.action = true;
        this.popupDialog.dismiss();
        if (this.confirmCallback) {
            this.confirmCallback(this.refNewName.getValue());
        }
        if (this.okCallback) {
            this.okCallback(this.refNewName.getValue());
        }
    }

    onDismissed() {
        this.isShowed = false;
        if (this.action) {
            this.action = false;
            return;
        }
        if (this.cancelCallback) {
            this.cancelCallback();
        }
    }

    onCancelClick() {
        this.action = true;
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

    text_old_name : {
        marginTop : verticalScale(10),
        marginLeft: scale(10), 
        fontSize: fontSize(16, scale(2)), 
        color: 'black', 
        fontWeight: 'bold' 
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
        fontSize: fontSize(20, scale(6)),// 17,
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
        justifyContent: 'center'
    },
    container_btn: {
        flexDirection: 'row'
    },
    line: {
        backgroundColor: '#ADADAD',
        height: verticalScale(0.5),
        marginTop: verticalScale(10)
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
    },

    view_textfield : {
        flex : 1,
        justifyContent : 'center',
        borderColor : '#a1a1a1',
        borderWidth : 1,
        marginLeft : scale(10),
        marginRight : scale(10),
        marginTop : verticalScale(10)
    }
});