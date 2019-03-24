import React from 'react';
import {
    Platform,
    StyleSheet,
    Text,
    // View,
    Dimensions,
    KeyboardAvoidingView,
    Modal,
    TouchableWithoutFeedback,
    TextInput
} from 'react-native';
import Touchable from 'react-native-platform-touchable';
import BaseComponent from '../../Core/View/BaseComponent';
import { scale, verticalScale, fontSize } from '../../Config/RatioScale';
import RateFacilityItem from './Items/RateFacilityItem';
import { View } from 'react-native-animatable';

const DELAY_TIME = 300;
let { width } = Dimensions.get('window');
let popupWidth = width - scale(60);
let buttonWidth = parseInt((popupWidth - scale(70)) / 2);
let widthStar = verticalScale(30);
let heightStar = verticalScale(30);

export default class PopupReviewFacilityView extends BaseComponent {

    static defaultProps = {
        content: '',
        confirmText: '',
        cancelText: ''
    }

    constructor(props) {
        super(props);
        this.state = {
            content: this.props.content,
            isVisible: false
        }
        this.onCancelClick = this.onCancelClick.bind(this);
        this.onConfirmClick = this.onConfirmClick.bind(this);
        this.rate = 0;
        this.comment = '';
        this.onCommentChangeText = this.onCommentChangeText.bind(this);
    }

    componentDidMount() {
        // if (this.input) this.input.enable(true);
    }

    rateClick(index) {
        this.rate = index;
        this.updateComponentRate(index);
    }

    refresh() {
        for (let i = 1; i < 6; i++) {
            let component = this.getComponentRate(i);
            if (component) {
                component.unRate();
            }
        }
        // this.input.clear();
        if(this.input){
            this.input.clear();
            this.comment = '';
        }
    }

    // updateComponentRate(index) {
    //     for (let i = 1; i < 6; i++) {
    //         let key = 'rate' + i;
    //         let component = this.refs[key];
    //         if (component) {
    //             console.log('........................... vao day!');
    //             if (i <= index) {
    //                 component.rate();
    //             } else{
    //                 component.unRate();
    //             }
    //         }
    //     }
    // }
    updateComponentRate(rate) {
        for (let i = 1; i <= 5; i++) {
            let component = this.getComponentRate(i);
            if (!component) continue;
            if (i <= rate) {
                component.rate();
            } else {
                component.unRate();
            }
        }
    }

    getComponentRate(index) {
        let com = null;
        switch (index) {
            case 1:
                com = this.rate1;
                break;
            case 2:
                com = this.rate2;
                break;
            case 3:
                com = this.rate3;
                break;
            case 4:
                com = this.rate4;
                break;
            case 5:
                com = this.rate5;
                break;
            default:
                break;
        }
        return com;
    }


    render() {

        let {
            isVisible
        } = this.state;
        return (
            <Modal
                animationType="none"
                transparent={true}
                visible={isVisible}
                onRequestClose={() => {
                    this.dismiss();
                }}>
                <View style={styles.container} />
                <TouchableWithoutFeedback onPress={() => { this.dismiss() }}>
                    <View
                        style={styles.view_contain}
                        onPress={() => { this.dismiss() }}>
                        <View ref={(refAnimateView) => { this.refAnimateView = refAnimateView }}
                            style={styles.container_content}>
                            <View style={styles.popup_header}>
                                <Text allowFontScaling={global.isScaleFont} style={styles.popup_title_style}>{this.t('danh_gia').toUpperCase()}</Text>
                                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                                    <RateFacilityItem ref={(rate1) => { this.rate1 = rate1; }} clickCallback={this.rateClick.bind(this, 1)} style={{ width: widthStar, height: heightStar }} />
                                    <RateFacilityItem ref={(rate2) => { this.rate2 = rate2; }} clickCallback={this.rateClick.bind(this, 2)} style={{ marginLeft: scale(5), width: widthStar, height: heightStar }} />
                                    <RateFacilityItem ref={(rate3) => { this.rate3 = rate3; }} clickCallback={this.rateClick.bind(this, 3)} style={{ marginLeft: scale(5), width: widthStar, height: heightStar }} />
                                    <RateFacilityItem ref={(rate4) => { this.rate4 = rate4; }} clickCallback={this.rateClick.bind(this, 4)} style={{ marginLeft: scale(5), width: widthStar, height: heightStar }} />
                                    <RateFacilityItem ref={(rate5) => { this.rate5 = rate5; }} clickCallback={this.rateClick.bind(this, 5)} style={{ marginLeft: scale(5), width: widthStar, height: heightStar }} />
                                </View>
                            </View>
                            <View style={styles.view_content}>
                                <TextInput
                                    ref={(input) => { this.input = input; }}
                                    allowFontScaling={global.isScaleFont}
                                    style={{ flex: 1, textAlignVertical: 'top' }}
                                    placeholder={this.t('nhan_xet')}
                                    onChangeText={this.onCommentChangeText}
                                    multiline={true}
                                    placeholderTextColor='#a1a1a1'
                                    underlineColorAndroid='rgba(0,0,0,0)'
                                    autoFocus={true}
                                />
                            </View>

                            <View style={styles.container_btn}>
                                <Touchable onPress={this.onCancelClick}>
                                    <View style={{ height: verticalScale(40), width: buttonWidth, borderRadius: 5, backgroundColor: '#e8e8e8', alignItems: 'center', justifyContent: 'center' }}>
                                        <Text allowFontScaling={global.isScaleFont} style={{ fontSize: fontSize(17, scale(3)), color: '#696969' }}>{this.t('event_huy')}</Text>
                                    </View>
                                </Touchable>
                                <Touchable onPress={this.onConfirmClick}>
                                    <View style={{ height: verticalScale(40), width: buttonWidth, borderRadius: 5, backgroundColor: '#00aba7', justifyContent: 'center', alignItems: 'center', marginLeft: scale(10) }}>
                                        <Text allowFontScaling={global.isScaleFont} style={{ fontSize: fontSize(17, scale(3)), color: '#fff' }}>{this.t('send').toUpperCase()}</Text>
                                    </View>
                                </Touchable>
                            </View>
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>
        );
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

    onCommentChangeText(input) {
        this.comment = input;
    }

    onConfirmClick() {
        this.dismiss();
        let rate = this.rate;
        let date = new Date();
        let time = date.getTime();
        let msg = {
            content: this.comment,
            rate: rate,
            type: 'text',
            message: this.comment,
            order: time,
            send_status: false,
            createdAt: time,
            date: date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear(),
            user: {
                avatar: this.getUserInfo().getUserAvatar(),
                fullname: this.getUserInfo().getFullname(),
                userid: this.getUserInfo().getId()
            }
        }
        let { onConfirmClick } = this.props;
        if (onConfirmClick) {
            onConfirmClick(msg);
        }
        this.refresh();
    }

    onCancelClick() {
        this.dismiss();
        this.refresh();
        // if (this.props.onCancelClick != null) {
        //     this.props.onCancelClick(this.type);
        // }
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000000',
        opacity: 0.6
    },
    view_contain: {
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
        width: popupWidth,
        height: popupWidth,
        backgroundColor: '#FFFFFF',
        // justifyContent: 'space-between',
        borderRadius: 7
    },
    popup_style: {
        width: popupWidth,
        height: popupWidth,
        backgroundColor: '#FFFFFF',
        borderRadius: 7
    },
    popup_header: {
        // flexDirection: 'row',
        // backgroundColor: '#F0F0F0',
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
        color: '#424242',
        fontWeight: 'bold',
        fontSize: fontSize(20, scale(6)),// 17,
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
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: verticalScale(7),
        marginBottom: verticalScale(7)
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
    view_content: {
        marginTop: verticalScale(10),
        flex: 1,
        borderColor: '#d8d8d8',
        borderRadius: 5,
        borderWidth: 1,
        marginLeft: scale(7),
        marginRight: scale(7),
        padding: scale(7)
    }
});