import React from 'react';
import {
    Platform,
    StyleSheet,
    Text,
    Image,
    Dimensions,
    Modal,
    TouchableWithoutFeedback
} from 'react-native';
import Touchable from 'react-native-platform-touchable';
import BaseComponent from '../../Core/View/BaseComponent';
import PopupDialog, { SlideAnimation } from 'react-native-popup-dialog';
import HtmlText from '../../Core/Common/HtmlBoldText';
import { View } from 'react-native-animatable';
import { scale, verticalScale, fontSize } from '../../Config/RatioScale';

const DELAY_TIME = 300;

let { width, height } = Dimensions.get('window');

export default class PopupUpgradeVip extends BaseComponent {

    constructor(props) {
        super(props);
        this.state = {
            isVisible: false
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        return this.state.isVisible!=nextState.isVisible;
    }

    render() {
        // const slideAnimation = new SlideAnimation({
        //     slideFrom: 'bottom',
        // });
        let {
            isVisible
        } = this.state;
        return (
            // <PopupDialog
            //     ref={(popupDialog) => { this.popupDialog = popupDialog; }}
            //     dialogAnimation={slideAnimation}
            //     dialogStyle={styles.popup_style}>
            <Modal
                animationType="none"
                transparent={true}
                visible={isVisible}
                onRequestClose={() => {
                    this.dismiss();
                }}>
                <View style={styles.container} />

                <TouchableWithoutFeedback onPress={() => { this.dismiss() }}>
                    <View style={styles.view_content}>
                        <View style={styles.container_content}
                            ref={(refAnimateView) => { this.refAnimateView = refAnimateView }}>
                            <View style={styles.popup_header}>
                                <Text allowFontScaling={global.isScaleFont} style={styles.popup_title_style}>{this.t('notify')}</Text>
                                <Image
                                    style={styles.header_icon}
                                    source={this.getResources().logo_popup}
                                />
                            </View>

                            <Text allowFontScaling={global.isScaleFont} style={styles.popup_content}>
                                {this.t('upgrade_vip_notify')}
                            </Text>
                            <View>
                                <View style={styles.line} />
                                <View style={styles.container_btn}>
                                    <Touchable style={styles.touchable_btn} onPress={this.onCancelClick.bind(this)}>
                                        <Text allowFontScaling={global.isScaleFont} style={styles.confirm_text}>{this.t('skip')}</Text>
                                    </Touchable>
                                    <View style={styles.line_horizontal} />
                                    <Touchable style={styles.touchable_btn} onPress={this.onConfirmClick.bind(this)}>
                                        <Text allowFontScaling={global.isScaleFont} style={styles.confirm_text}>{this.t('upgrade_vip')}</Text>
                                    </Touchable>
                                </View>
                            </View>

                        </View>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>
            // </PopupDialog>
        );
    }

    onConfirmClick() {
        this.dismiss();
        if (this.props.onConfirmClick != null) {
            this.props.onConfirmClick();
        }
    }

    onCancelClick() {
        this.dismiss();
        if (this.props.onCancelClick != null) {
            this.props.onCancelClick();
        }
    }

    show() {
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
            this.refAnimateView.animate('fadeInUp', DELAY_TIME)
    }

    slideDown() {
        if (this.refAnimateView)
            this.refAnimateView.animate('fadeOutDown', DELAY_TIME)
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000000',
        opacity: 0.6
    },
    popup_style: {
        width: scale(320),
        height: verticalScale(220),
        backgroundColor: '#FFFFFF',
        borderRadius: 8
    },
    popup_header: {
        flexDirection: 'row',
        backgroundColor: '#F0F0F0',
        justifyContent: 'center',
        alignItems: 'center'
    },
    header_icon: {
        position: 'absolute',
        width: verticalScale(40),
        height: verticalScale(40),
        resizeMode: 'contain',
        left: scale(3)
    },
    popup_title_style: {
        color: '#000000',
        fontWeight: 'bold',
        fontSize: fontSize(17, scale(3)),// 17,
        marginTop: verticalScale(10),
        marginBottom: verticalScale(10),
        textAlign: 'center'
    },
    popup_content: {
        color: '#696969',
        fontSize: fontSize(15, scale(1)),// 15,
        marginTop: verticalScale(10),
        marginBottom: verticalScale(10),
        marginLeft: verticalScale(20),
        marginRight: verticalScale(20),
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
        paddingTop: verticalScale(15),
        paddingBottom: verticalScale(15),
        justifyContent: 'center',
        alignItems: 'center'
    },
    confirm_text: {
        color: '#757575',
        fontSize: fontSize(17, scale(3)),// 17
    },
    view_content: {
        backgroundColor: 'rgba(0,0,0,0)',
        position: 'absolute',
        bottom: 0,
        right: 0,
        left: 0,
        top: 0,
        justifyContent: 'center',
        alignItems: 'center'
    },
    container_content: {
        width: 320,
        height: 220,
        backgroundColor: '#FFFFFF',
        justifyContent: 'space-between',
        borderRadius: 4
    },
});