import React from 'react';
import {
    Platform,
    StyleSheet,
    Text,
    Dimensions,
    Modal,
    TouchableWithoutFeedback
} from 'react-native';
import Touchable from 'react-native-platform-touchable';
import BaseComponent from '../../../Core/View/BaseComponent';
import MyView from '../../../Core/View/MyView';
import { scale, verticalScale, fontSize } from '../../../Config/RatioScale';
import { View } from 'react-native-animatable';

const DELAY_TIME = 300;

export default class PopupRemoteGroup extends BaseComponent {

    constructor(props) {
        super(props);

        this.extrasData;
        this.state = {
            isUserAdmin: false,
            isVisible: false
        }

        this.onRemoveGroupPress = this.onRemoveGroupPress.bind(this);
        this.onLeaveGroupPress = this.onLeaveGroupPress.bind(this);
        this.onViewGroupInfoPress = this.onViewGroupInfoPress.bind(this);
        this.onCreateGroupChat = this.onCreateGroupChat.bind(this);
    }

    // shouldComponentUpdate(){
    //     return false;
    // }

    render() {
        let {
            isUserAdmin,
            isVisible
         } = this.state;
        console.log('isUserAdmin.render', isUserAdmin);

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
                            onPress={() => { this.dismiss() }}>
                            <View style={styles.container_content}
                                ref={(refAnimateView) => { this.refAnimateView = refAnimateView }}>

                                <MyView hide={isUserAdmin}>
                                    <Touchable style={styles.touchable_item} onPress={this.onLeaveGroupPress}>
                                        <Text allowFontScaling={global.isScaleFont} style={styles.text_view_image}>{this.t('leave_group')}</Text>
                                    </Touchable>
                                    <View style={styles.line} />
                                </MyView>

                                <MyView hide={!isUserAdmin}>
                                    <Touchable style={styles.touchable_item} onPress={this.onRemoveGroupPress}>
                                        <Text allowFontScaling={global.isScaleFont} style={styles.text_view_image}>{this.t('remove_group')}</Text>
                                    </Touchable>
                                    <View style={styles.line} />
                                </MyView>

                                <Touchable style={styles.touchable_item} onPress={this.onViewGroupInfoPress}>
                                    <Text allowFontScaling={global.isScaleFont} style={styles.text_view_image}>{this.t('group_info')}</Text>
                                </Touchable>
                                {/* <View style={styles.line} />

                                <Touchable style={styles.touchable_item} onPress={this.onCreateGroupChat}>
                                    <Text allowFontScaling={global.isScaleFont} style={styles.text_view_image}>{this.t('create_group_chat')}</Text>
                                </Touchable> */}

                            </View>
                        </View>
                    </TouchableWithoutFeedback>
                </View>

            </Modal>
        );
    }

    show(isModerator = false, extrasData) {
        this.setState({
            isUserAdmin: isModerator,
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

    onLeaveGroupPress() {
        this.dismiss();
        if (this.props.onLeaveGroupPress) {
            this.props.onLeaveGroupPress(this.extrasData);
        }
    }

    onRemoveGroupPress() {
        this.dismiss();
        if (this.props.onRemoveGroupPress) {
            this.props.onRemoveGroupPress(this.extrasData);
        }
    }

    onViewGroupInfoPress() {
        this.dismiss();
        if (this.props.onViewGroupInfoPress) {
            this.props.onViewGroupInfoPress(this.extrasData);
        }
    }

    onCreateGroupChat(){
        this.dismiss();
        if (this.props.onCreateGroupChat) {
            this.props.onCreateGroupChat(this.extrasData);
        }
    }

}

const styles = StyleSheet.create({
    container: {
        // justifyContent: 'space-between',
        // backgroundColor: '#fff',
        // borderTopLeftRadius: verticalScale(10),
        // borderTopRightRadius: verticalScale(10)
        flex: 1,

    },
    popup_style: {
        position: 'absolute',
        bottom: 0,
        width: Dimensions.get('window').width,
        backgroundColor: 'rgba(0,0,0,0)'
    },
    container_content: {
        backgroundColor: '#FFFFFF',
        borderTopLeftRadius: verticalScale(10),
        borderTopRightRadius: verticalScale(10),
        height: verticalScale(180)
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
    container_btn: {
        backgroundColor: '#FFFFFF',
        borderRadius: verticalScale(5),
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: verticalScale(10)
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
        justifyContent: 'center',
        paddingLeft: scale(20),
        minHeight: verticalScale(60)
    }

});