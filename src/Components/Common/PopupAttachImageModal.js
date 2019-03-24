import React from 'react';
import {
    Platform,
    StyleSheet,
    Text,
    Dimensions,
    TouchableOpacity,
    Modal,
    TouchableWithoutFeedback
} from 'react-native';
import Touchable from 'react-native-platform-touchable';
import BaseComponent from '../../Core/View/BaseComponent';
import MyView from '../../Core/View/MyView';
import { scale, verticalScale, fontSize } from '../../Config/RatioScale';
let { width, height } = Dimensions.get('window');
import { View } from 'react-native-animatable';

const DELAY_TIME = 250;

export default class PopupAttachImageModal extends BaseComponent {

    constructor(props) {
        super(props);
        this.extrasData;
        this.state = {
            hasImage: false,
            isVisible: false
        }

        this.onViewImageClick = this.onViewImageClick.bind(this);
        this.onImportGalleryClick = this.onImportGalleryClick.bind(this);
        this.onTakePhotoClick = this.onTakePhotoClick.bind(this);
    }

    shouldComponentUpdate(nextProps, nextState) {
        return nextState.hasImage != this.state.hasImage
            || nextState.isVisible != this.state.isVisible;
    }

    render() {
        let {
            isVisible,
            hasImage
        } = this.state;

        return (
            <Modal
                animationType="none"
                transparent={true}
                visible={isVisible}
                onRequestClose={() => {
                    this.dismiss();
                }}>
                <View style={styles.container}>
                    <View style={{
                        flex: 1,
                        backgroundColor: '#000000',
                        opacity: 0.6
                    }} />
                    <TouchableWithoutFeedback onPress={() => { this.dismiss() }}>

                        <View
                            style={styles.view_content}
                            ref={(refAnimateView) => { this.refAnimateView = refAnimateView }}>
                            <View style={styles.container_content}>

                                <MyView hide={!hasImage}>
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

                        </View>
                    </TouchableWithoutFeedback>
                </View>
            </Modal>
        );
    }

    show(hasImage = false, extrasData = '') {
        this.setState({
            hasImage: hasImage,
            isVisible: true
        }, () => {
            this.extrasData = extrasData;
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


    onViewImageClick() {
        this.dismiss();
        if (this.props.onViewImageClick != null) {
            this.props.onViewImageClick(this.extrasData);
        }
    }

    onTakePhotoClick() {
        this.dismiss();
        if (this.props.onTakePhotoClick != null) {
            this.props.onTakePhotoClick(this.extrasData);
        }
    }

    onImportGalleryClick() {
        this.dismiss();
        if (this.props.onImportGalleryClick != null) {
            this.props.onImportGalleryClick(this.extrasData);
        }
    }

    onExitClick() {
        this.dismiss();
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1
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
        fontSize: fontSize(17, scale(2)),
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
    },
    view_content: {
        backgroundColor: 'rgba(0,0,0,0)',
        position: 'absolute',
        bottom: 0,
        right: 0,
        left: 0,
        top: 0,
        justifyContent: 'flex-end',
    },

});