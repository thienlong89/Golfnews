import React from 'react';
import {
    Platform,
    StyleSheet,
    Text,
    View,
    Dimensions,
    TouchableOpacity,
    FlatList,
    Image,
    TextInput
} from 'react-native';
import Touchable from 'react-native-platform-touchable';
import BaseComponent from '../../Core/View/BaseComponent';
import PopupDialog, { SlideAnimation } from 'react-native-popup-dialog';
import { scale, verticalScale, fontSize } from '../../Config/RatioScale';

let { width, height } = Dimensions.get('window');
const slideAnimation = new SlideAnimation({
    slideFrom: 'bottom',
});

export default class PopupInputText extends BaseComponent {

    constructor(props) {
        super(props);
        this.extrasData;
        this.isPopupShowing = false;
        this.page = 1;
        this.inputText = '';
        this.state = {
        }

        this.onCancelClick = this.onCancelClick.bind(this);
        this.onConfirmClick = this.onConfirmClick.bind(this);
        this.onChangeText = this.onChangeText.bind(this);
    }


    render() {

        return (
            <PopupDialog
                ref={(popupDialog) => { this.popupDialog = popupDialog; }}
                dialogAnimation={slideAnimation}
                containerStyle={{ position: 'absolute', bottom: 0 }}
                dialogStyle={[styles.popup_style, {}]}>
                <View style={styles.container}>
                    <View
                        ref={(refAnimateView) => { this.refAnimateView = refAnimateView }}
                        style={styles.container_content}>
                        <Text allowFontScaling={global.isScaleFont} style={styles.popup_title_style}>{this.t('create_accessory')}</Text>

                        <TextInput allowFontScaling={global.isScaleFont}
                            style={styles.txt_input}
                            placeholder={this.t('enter_info')}
                            placeholderTextColor='#8A8A8F'
                            underlineColorAndroid='#D6D4D4'
                            onChangeText={this.onChangeText}
                            // multiline={true}
                            autoFocus={false}
                        />

                        <View>
                            <View style={styles.line} />
                            <View style={styles.container_btn}>
                                <Touchable style={styles.touchable_btn} onPress={this.onCancelClick}>
                                    <Text allowFontScaling={global.isScaleFont}
                                        style={styles.confirm_text}>{this.t('cancel')}</Text>
                                </Touchable>
                                <View style={styles.line_horizontal} />
                                <Touchable style={styles.touchable_btn} onPress={this.onConfirmClick}>
                                    <Text allowFontScaling={global.isScaleFont}
                                        style={styles.confirm_text}>{this.t('confirm')}</Text>
                                </Touchable>
                            </View>
                        </View>
                    </View>
                </View>

            </PopupDialog>
        );
    }

    componentDidMount() {
    }


    show(extrasData = '') {
        this.extrasData = extrasData;
        this.popupDialog.show();
        this.isPopupShowing = true;

    }

    dismiss() {
        this.popupDialog.dismiss();
        this.isPopupShowing = false;
    }

    onChangeText(input) {
        this.inputText = input;
    }

    onConfirmClick() {
        this.dismiss();
        if (this.props.onConfirmClick) {
            this.props.onConfirmClick(this.inputText, this.extrasData);
        }
    }

    onCancelClick() {
        this.dismiss();
    }
}

const styles = StyleSheet.create({
    container: {
        justifyContent: 'space-between',
        backgroundColor: 'rgba(0,0,0,0)',
        flex: 1,
    },
    container_content: {
        width: 320,
        height: 220,
        backgroundColor: '#FFFFFF',
        justifyContent: 'space-between',
        borderRadius: 6
    },
    popup_style: {
        width: 320,
        height: 220,
        backgroundColor: '#FFFFFF',
        borderRadius: 6
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
    },

    popup_header: {
        flexDirection: 'row',
        backgroundColor: '#F0F0F0',
        justifyContent: 'center',
        alignItems: 'center'
    },
    header_icon: {
        position: 'absolute',
        width: 40,
        height: 40,
        resizeMode: 'contain',
        left: 3
    },
    popup_title_style: {
        color: '#685D5D',
        fontWeight: 'bold',
        fontSize: 17,
        marginTop: 10,
        marginBottom: 10,
        textAlign: 'center'
    },
    popup_content: {
        color: '#685D5D',
        fontSize: 15,
        marginTop: 10,
        marginBottom: 10,
        textAlign: 'center',
        justifyContent: 'center'
    },
    container_btn: {
        flexDirection: 'row'
    },
    line: {
        backgroundColor: '#ADADAD',
        height: 0.5,
        marginTop: 10
    },
    line_horizontal: {
        backgroundColor: '#ADADAD',
        width: 0.5
    },
    touchable_btn: {
        flex: 1,
        paddingTop: 10,
        paddingBottom: 10,
        justifyContent: 'center',
        alignItems: 'center'
    },
    confirm_text: {
        color: '#757575',
        fontSize: 17
    },
    view_line: {
        height: 1,
        backgroundColor: '#D6D4D4'
    },
    txt_input: {
        marginLeft: scale(10),
        marginRight: scale(10),
        fontSize: fontSize(15)
    }
});