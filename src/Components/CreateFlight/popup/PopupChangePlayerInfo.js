import React from 'react';
import { Platform, StyleSheet, Text, View, Dimensions } from 'react-native';
import Touchable from 'react-native-platform-touchable';
import BaseComponent from '../../../Core/View/BaseComponent';
import PopupDialog, { SlideAnimation } from 'react-native-popup-dialog';
import {scale, verticalScale, fontSize} from '../../../Config/RatioScale';
let{width,height} = Dimensions.get('window');

export default class PopupChangePlayerInfo extends BaseComponent {

    static defaultProps = {
        playerPosition: 0
    }

    constructor(props) {
        super(props);
        this.state = {

        }
    }

    render() {
        const slideAnimation = new SlideAnimation({
            slideFrom: 'bottom',
        });
        return (
            <PopupDialog
                ref={(popupDialog) => { this.popupDialog = popupDialog; }}
                dialogAnimation={slideAnimation}
                dialogStyle={styles.popup_style}>
                <View style={styles.container}>
                    <View style={styles.container_content}>
                        <Touchable style={styles.touchable_item} onPress={this.onEditPlayerClick.bind(this)}>
                            <Text allowFontScaling={global.isScaleFont} style={styles.text_item}>{this.t('edit')}</Text>
                        </Touchable>

                        <View style={styles.line} />
                        <Touchable style={styles.touchable_item}
                            onPress={this.onDeletePlayerClick.bind(this)}>
                            <Text allowFontScaling={global.isScaleFont} style={[styles.text_item_delete, { color: '#FF0000'}]}>{this.t('delete')}</Text>
                        </Touchable>

                    </View>
                    <Touchable style={styles.container_btn} onPress={this.onExitClick.bind(this)}>
                        <Text allowFontScaling={global.isScaleFont} style={styles.text_exit}>{this.t('exit')}</Text>
                    </Touchable>

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

    onEditPlayerClick() {
        this.popupDialog.dismiss();
        if (this.props.onEditPlayerClick != null) {
            this.props.onEditPlayerClick();
        }
    }

    onDeletePlayerClick() {
        this.popupDialog.dismiss();
        if (this.props.onDeletePlayerClick != null) {
            this.props.onDeletePlayerClick();
        }
    }

    onExitClick() {
        this.popupDialog.dismiss();
    }

}

const styles = StyleSheet.create({
    container: {
        justifyContent: 'space-between',
        backgroundColor: 'rgba(0,0,0,0)'
    },
    popup_style: {
        position: 'absolute',
        bottom: 0,
        width: width - scale(30),
        backgroundColor: 'rgba(0,0,0,0)',
        height: verticalScale(170)
    },
    container_content: {
        backgroundColor: '#FFFFFF',
        borderRadius: scale(5)
    },
    container_btn: {
        backgroundColor: '#FFFFFF',
        borderRadius: scale(5),
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: verticalScale(10)
    },
    text_item: {
        color: '#685D5D',
        fontSize: fontSize(17,scale(3)),// 17,
        paddingTop: verticalScale(10),
        paddingBottom: verticalScale(10)
    },
    text_item_delete: {
        fontSize:fontSize(17,scale(3)),// 17,
        paddingTop: verticalScale(10),
        paddingBottom: verticalScale(10)
    },
    text_exit: {
        color: '#685D5D',
        fontSize: fontSize(17,scale(3)),// 17,
        paddingTop: verticalScale(10),
        paddingBottom: verticalScale(10),
        fontWeight: 'bold',
    },
    line: {
        backgroundColor: '#ADADAD',
        height: verticalScale(0.5)
    },
    touchable_item: {
        justifyContent: 'center',
        alignItems: 'center'
    }

});