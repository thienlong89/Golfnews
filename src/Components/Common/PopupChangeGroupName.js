import React from 'react';
import {
    Platform,
    StyleSheet,
    Text,
    // View,
    Dimensions,
    Modal,
    TouchableWithoutFeedback,
    Image,
    TextInput
} from 'react-native';
import Touchable from 'react-native-platform-touchable';
import BaseComponent from '../../Core/View/BaseComponent';
import { View } from 'react-native-animatable';
import { fontSize, scale } from '../../Config/RatioScale';

const DELAY_TIME = 300;

export default class PopupChangeGroupName extends BaseComponent {

    constructor(props) {
        super(props);
        this.extrasData = null;

        this.state = {
            groupName: this.props.groupName,
            isVisible: false,
        }

        this.onCancelClick = this.onCancelClick.bind(this);
        this.onConfirmClick = this.onConfirmClick.bind(this);
        this.onChangeText = this.onChangeText.bind(this);
    }

    render() {

        let { isVisible, groupName } = this.state;

        return (
            <Modal
                animationType="none"
                transparent={true}
                visible={isVisible}
                onRequestClose={() => {
                    this.dismiss();
                }}>

                <View style={styles.container} />

                {/* <TouchableWithoutFeedback onPress={() => { this.dismiss() }}> */}
                <View
                    style={styles.view_content}
                    onPress={() => { this.dismiss() }}>
                    <View
                        ref={(refAnimateView) => { this.refAnimateView = refAnimateView }}
                        style={styles.container_content}>
                        <Text allowFontScaling={global.isScaleFont} style={styles.popup_title_style}>{this.t('dat_ten_nhom_title')}</Text>

                        <TextInput allowFontScaling={global.isScaleFont}
                            style={styles.txt_group_name}
                            placeholder={this.t('dat_ten_nhom_title')}
                            placeholderTextColor='#8A8A8F'
                            underlineColorAndroid='#D6D4D4'
                            value={groupName}
                            onChangeText={this.onChangeText}
                            multiline={true}
                            autoFocus={true}
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
                {/* </TouchableWithoutFeedback> */}
            </Modal>
        );
    }

    setContentAndShow(groupName) {
        this.setState({
            groupName: groupName,
            isVisible: true
        }, () => {
            this.slideUp();
        })
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

    onCancelClick() {
        this.dismiss();
        if (this.props.onCancelClick) {
            this.props.onCancelClick(this.extrasData);
        }
    }

    onConfirmClick() {
        this.dismiss();
        if (this.props.onConfirmClick) {
            this.props.onConfirmClick(this.state.groupName);
        }
    }

    onChangeText(text) {
        this.setState({
            groupName: text
        })
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000000',
        opacity: 0.6
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
    date_picker: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    view_date: {
        flex: 1,
        marginLeft: scale(15),
        marginRight: scale(15),
        justifyContent: 'center',
    },
    view_line: {
        height: 1,
        backgroundColor: '#D6D4D4'
    },
    img_date: {
        height: scale(25),
        width: scale(25),
        resizeMode: 'contain'
    },
    txt_group_name: {
        marginLeft: 10,
        marginRight: 10
    }

});