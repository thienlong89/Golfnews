import React from 'react';
import {
    Platform,
    StyleSheet,
    Text,
    View,
    Dimensions
} from 'react-native';
import Touchable from 'react-native-platform-touchable';
import BaseComponent from '../../Core/View/BaseComponent';
import PopupDialog, { SlideAnimation } from 'react-native-popup-dialog';
import MyView from '../../Core/View/MyView';
import { scale, verticalScale, fontSize } from '../../Config/RatioScale';

const { width, height } = Dimensions.get("window");
const slideAnimation = new SlideAnimation({
    slideFrom: 'bottom',
});

export default class PopupSwapTypeSelect extends BaseComponent {

    constructor(props) {
        super(props);

        this.onHDCSwap = this.onHDCSwap.bind(this);
        this.onRandomSwap = this.onRandomSwap.bind(this);
        this.onPopupClose = this.onPopupClose.bind(this);
    }

    shouldComponentUpdate() {
        return false;
    }

    render() {

        return (
            <PopupDialog
                ref={(popupDialog) => { this.popupDialog = popupDialog; }}
                dialogAnimation={slideAnimation}
                containerStyle={{ position: 'absolute', bottom: 0 }}
                dialogStyle={[styles.popup_style, { height: verticalScale(165) }]}>
                <View style={styles.container}>
                    <View style={styles.container_content}>

                        <Touchable style={[styles.touchable_item, { backgroundColor: 'rgba(0,0,0,0)' }]} onPress={this.onHDCSwap}>
                            <Text allowFontScaling={global.isScaleFont} style={styles.text_view_image}>{this.t('swap_hdc')}</Text>
                        </Touchable>
                        <View style={styles.line} />

                        <Touchable style={styles.touchable_item} onPress={this.onRandomSwap}>
                            <Text allowFontScaling={global.isScaleFont} style={styles.text_view_image}>{this.t('swap_random')}</Text>
                        </Touchable>
                        <View style={styles.line} />

                        <Touchable style={styles.touchable_item} onPress={this.onPopupClose}>
                            <Text allowFontScaling={global.isScaleFont} style={styles.txt_close}>{this.t('close')}</Text>
                        </Touchable>

                    </View>
                </View>

            </PopupDialog>
        );
    }

    show() {
        this.popupDialog.show();
    }

    dismiss() {
        this.popupDialog.dismiss();
    }

    onHDCSwap() {
        this.popupDialog.dismiss();
        if (this.props.onHDCSwap) {
            this.props.onHDCSwap();
        }
    }

    onRandomSwap() {
        this.popupDialog.dismiss();
        if (this.props.onRandomSwap) {
            this.props.onRandomSwap();
        }
    }

    onPopupClose() {
        this.popupDialog.dismiss();
    }

}

const styles = StyleSheet.create({
    container: {
        justifyContent: 'space-between',
        backgroundColor: '#fff',
        borderTopLeftRadius: verticalScale(10),
        borderTopRightRadius: verticalScale(10),
    },
    popup_style: {
        position: 'absolute',
        bottom: 0,
        width: width,
        backgroundColor: 'rgba(0,0,0,0)'
    },
    container_content: {
        backgroundColor: '#FFFFFF',
        borderRadius: verticalScale(10),
        borderTopLeftRadius: verticalScale(10),
        borderTopRightRadius: verticalScale(10),
    },
    text_item: {
        color: '#685D5D',
        fontSize: fontSize(17, scale(3)),
        paddingTop: verticalScale(10),
        paddingBottom: verticalScale(10)
    },
    text_view_image: {
        color: '#3D3D3D',
        fontSize: fontSize(17, scale(3)),
        paddingTop: verticalScale(10),
        paddingBottom: verticalScale(10)
    },
    text_exit: {
        color: '#685D5D',
        fontSize: fontSize(17, scale(3)),
        paddingTop: verticalScale(10),
        paddingBottom: verticalScale(10),
        fontWeight: 'bold',
    },
    line: {
        backgroundColor: '#ADADAD',
        height: 0.5
    },
    touchable_item: {
        // alignItems: 'center'
        height: verticalScale(55),
        justifyContent: 'center',
        alignItems: 'center',
        borderTopLeftRadius: verticalScale(10),
        borderTopRightRadius: verticalScale(10),
    },
    txt_title: {
        fontSize: fontSize(18, scale(3)),
        fontWeight: 'bold',
        color: '#454545'
    },
    txt_close: {
        color: '#FF0000',
        fontSize: fontSize(17, scale(3)),
        paddingTop: verticalScale(10),
        paddingBottom: verticalScale(10)
    }

});