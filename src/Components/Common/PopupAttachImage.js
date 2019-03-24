import React from 'react';
import {
    Platform,
    StyleSheet,
    Text,
    View,
    Dimensions,
    TouchableOpacity
} from 'react-native';
import Touchable from 'react-native-platform-touchable';
import BaseComponent from '../../Core/View/BaseComponent';
import PopupDialog, { SlideAnimation } from 'react-native-popup-dialog';
import MyView from '../../Core/View/MyView';
import { scale, verticalScale, fontSize } from '../../Config/RatioScale';
let { width, height } = Dimensions.get('window');

const slideAnimation = new SlideAnimation({
    slideFrom: 'bottom',
});

export default class PopupAttachImage extends BaseComponent {

    constructor(props) {
        super(props);
        this.extrasData;
        this.state = {
            hasImage: false
        }

        this.onViewImageClick = this.onViewImageClick.bind(this);
        this.onImportGalleryClick = this.onImportGalleryClick.bind(this);
        this.onTakePhotoClick = this.onTakePhotoClick.bind(this);
    }

    shouldComponentUpdate(nextProps, nextState) {
        return nextState.hasImage != this.state.hasImage;
    }

    render() {
        
        return (
            <PopupDialog
                ref={(popupDialog) => { this.popupDialog = popupDialog; }}
                dialogAnimation={slideAnimation}
                containerStyle={{ position: 'absolute', bottom: 0 }}
                dialogStyle={[styles.popup_style, { height: this.state.hasImage ? verticalScale(180) : verticalScale(120) }]}>
                <View style={styles.container}>
                    <View style={styles.container_content}>

                        <MyView hide={!this.state.hasImage}>
                            <TouchableOpacity style={styles.touchable_item} onPress={this.onViewImageClick}>
                                <Text allowFontScaling={global.isScaleFont} style={styles.text_view_image}>{this.t('view_image')}</Text>
                            </TouchableOpacity>
                            <View style={styles.line} />
                        </MyView>

                        <TouchableOpacity style={styles.touchable_item} onPress={this.onImportGalleryClick}>
                            <Text allowFontScaling={global.isScaleFont} style={styles.text_item}>{this.t('library')}</Text>
                        </TouchableOpacity>

                        <View style={styles.line} />
                        <TouchableOpacity style={styles.touchable_item} onPress={this.onTakePhotoClick}>
                            <Text allowFontScaling={global.isScaleFont} style={styles.text_item}>{this.t('take_photo')}</Text>
                        </TouchableOpacity>

                    </View>
                    {/* <Touchable style={styles.container_btn} onPress={this.onExitClick.bind(this)}>
                        <Text allowFontScaling={global.isScaleFont} style={styles.text_exit}>{this.t('exit')}</Text>
                    </Touchable> */}

                </View>

            </PopupDialog>
        );
    }

    show(hasImage = false, extrasData = '') {
        this.extrasData = extrasData;
        if (hasImage) {
            this.setState({
                hasImage: hasImage
            }, () => {
                this.popupDialog.show();
            });
        } else {
            this.popupDialog.show();
        }

    }

    dismiss() {
        this.popupDialog.dismiss();
    }

    onViewImageClick() {
        this.popupDialog.dismiss();
        if (this.props.onViewImageClick != null) {
            this.props.onViewImageClick(this.extrasData);
        }
    }

    onTakePhotoClick() {
        this.popupDialog.dismiss();
        if (this.props.onTakePhotoClick != null) {
            this.props.onTakePhotoClick(this.extrasData);
        }
    }

    onImportGalleryClick() {
        this.popupDialog.dismiss();
        if (this.props.onImportGalleryClick != null) {
            this.props.onImportGalleryClick(this.extrasData);
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
        width: width,
        backgroundColor: 'rgba(0,0,0,0)'
    },
    container_content: {
        backgroundColor: '#FFFFFF',
        borderTopLeftRadius: 7,
        borderTopRightRadius: 7
    },
    container_btn: {
        backgroundColor: '#FFFFFF',
        borderTopLeftRadius: 7,
        borderTopRightRadius: 7,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: verticalScale(10)
    },
    text_item: {
        color: '#685D5D',
        fontSize: fontSize(17, scale(2)),// 17,
        paddingTop: verticalScale(15),
        paddingBottom: verticalScale(15)
    },
    text_view_image: {
        color: '#00ABA7',
        fontSize: fontSize(17, scale(2)),// 17,
        paddingTop: verticalScale(10),
        paddingBottom: verticalScale(10)
    },
    text_exit: {
        color: '#685D5D',
        fontSize: fontSize(17, scale(2)),// 17,
        paddingTop: verticalScale(10),
        paddingBottom: verticalScale(10),
        fontWeight: 'bold',
    },
    line: {
        backgroundColor: '#ADADAD',
        height: 0.5
    },
    touchable_item: {
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: scale(60)
    }

});