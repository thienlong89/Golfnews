import React from 'react';
import {
    Platform,
    StyleSheet,
    Text,
    View,
    Image,
    Modal,
    Dimensions,
    TouchableWithoutFeedback
} from 'react-native';
import Touchable from 'react-native-platform-touchable';
import BaseComponent from '../../../Core/View/BaseComponent';
import PopupDialog, { SlideAnimation } from 'react-native-popup-dialog';
import CustomAvatar from '../../Common/CustomAvatar';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

export default class JoinFlightPopup extends BaseComponent {

    static defaultProps = {
        content: '',
        confirmText: '',
        cancelText: ''
    }

    constructor(props) {
        super(props);
        this.state = {
            content: this.props.content,
            isShow: false
        }
    }

    setContent(content) {
        this.setState({
            content: content
        }, () => {
            this.show();
        });
    }

    render() {
        let { isShow } = this.state;
        let flightName = 'Tam dao golf course';
        let teeTime = '11:00 - 13/9/2018';
        let number = '3/4';
        let distance = '15 km';

        return (
            <Modal
                ref={(popupDialog) => { this.popupDialog = popupDialog; }}
                visible={isShow}
                transparent
                animationType="slide"
                onRequestClose={this.onRequestClose.bind(this)}>
                <View style={{ justifyContent: 'center', alignItems: 'center', flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.6)' }}>
                    <View style={styles.container}>
                        <View style={styles.popup_header}>
                            <Text allowFontScaling={global.isScaleFont} style={styles.popup_title_style}>{this.t('join_flight')}</Text>
                            <Image
                                style={styles.header_icon}
                                source={this.getResources().logo_popup}
                            />
                        </View>

                        <View style={styles.content_center}>
                            <CustomAvatar
                                width={50}
                                height={50} />
                            <View style={{marginLeft: 10}}>
                                <Text allowFontScaling={global.isScaleFont} style={styles.course_name}>{flightName}</Text>
                                <Text allowFontScaling={global.isScaleFont} style={styles.txt_tee_time}>
                                    {`${this.t('tee_time')}: `}
                                    <Text allowFontScaling={global.isScaleFont} style={styles.txt_tee_time_bold}>{teeTime}</Text>
                                </Text>
                                <View style={{ flexDirection: 'row' }}>
                                    <View style={styles.view_group}>
                                        <Image
                                            style={styles.img_icon}
                                            source={this.getResources().ic_group}
                                        />
                                        <Text allowFontScaling={global.isScaleFont} style={styles.txt_tee_time}>{number}</Text>
                                    </View>

                                    <View style={[styles.view_group, {marginLeft: 20}]}>
                                        <Image
                                            style={styles.img_icon}
                                            source={this.getResources().ic_pin}
                                        />
                                        <Text allowFontScaling={global.isScaleFont} style={styles.txt_tee_time}>{distance}</Text>
                                    </View>
                                </View>
                            </View>
                        </View>

                        <View>
                            <View style={styles.line} />
                            <View style={styles.container_btn}>
                                <Touchable style={styles.touchable_btn} onPress={this.onCancelClick.bind(this)}>
                                    <Text allowFontScaling={global.isScaleFont} style={styles.confirm_text}>{this.t('cancel')}</Text>
                                </Touchable>
                                <View style={styles.line_horizontal} />
                                <Touchable style={styles.touchable_btn} onPress={this.onConfirmClick.bind(this)}>
                                    <Text allowFontScaling={global.isScaleFont} style={styles.confirm_text}>{this.t('accept')}</Text>
                                </Touchable>
                            </View>
                        </View>
                    </View>


                </View>
            </Modal>
        );
    }

    show() {
        // this.popupDialog.show();
        //console.log('popupDialog.show()');
        this.setState({
            isShow: true
        })
    }

    dismiss() {
        this.setState({
            isShow: false
        })
    }

    onRequestClose() {
        this.dismiss();
    }

    onConfirmClick() {
        this.setState({
            isShow: false
        }, () => {
            if (this.props.onConfirmClick) {
                this.props.onConfirmClick();
            }
        })

    }

    onCancelClick() {
        this.setState({
            isShow: false
        }, () => {
            if (this.props.onCancelClick) {
                this.props.onCancelClick();
            }
        })

    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#FFFFFF',
        justifyContent: 'space-between',
        borderRadius: 4,
        width: screenWidth - 50,
        height: (2 * screenWidth) / 3,
    },
    popup_style: {
        width: 320,
        height: 220,
        backgroundColor: '#FFFFFF',
        borderRadius: 4,
        zIndex: 10
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
        height: 0.5
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
    content_center: {
        flex: 1,
        flexDirection: 'row',
        padding: 10
    },
    course_name: {
        color: '#1A1A1A',
        fontSize: 17,
        fontWeight: 'bold'
    },
    txt_tee_time: {
        color: '#1A1A1A',
        fontSize: 13,
    },
    txt_tee_time_bold: {
        color: '#1A1A1A',
        fontSize: 13,
        fontWeight: 'bold'
    },
    view_group: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    img_icon: {
        width: 15,
        height: 15,
        resizeMode: 'contain',
        marginRight: 4
    },
});