import React from 'react';
import {
    Platform,
    StyleSheet,
    Text,
    View,
    Image,
    Dimensions,
    ImageBackground,
    TouchableOpacity,
    Modal
} from 'react-native';
import BaseComponent from '../../Core/View/BaseComponent';
import PopupDialog, { SlideAnimation } from 'react-native-popup-dialog';

import { scale, verticalScale, fontSize } from '../../Config/RatioScale';
const { width, height } = Dimensions.get('window');

export default class PopupMemoryView extends BaseComponent {

    static defaultProps = {
        content: {
            achievement: '',
            score: ''
        }
    }

    constructor(props) {
        super(props);
        this.extrasData = null;
        this.state = {
            content: this.props.content,
            showPopup: false
        }
        this.onCloseClick = this.onCloseClick.bind(this);
        this.onViewScorecardClick = this.onViewScorecardClick.bind(this);
        this.onShareClick = this.onShareClick.bind(this);
    }

    setContentAndShow(content) {
        this.setState({
            content: content
        }, () => {
            this.show();
        });
    }

    render() {
        let {
            content,
            showPopup
        } = this.state;
        
        return (
            // <PopupDialog
            //     ref={(popupDialog) => { this.popupDialog = popupDialog; }}
            //     dialogAnimation={slideAnimation}
            //     dialogStyle={styles.popup_style}>

            <Modal
                visible={showPopup}
                animationType="fade"
                transparent={true}
                onRequestClose={this.onCloseClick}>
                <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', alignItems: 'center' }}>
                    <ImageBackground style={styles.container}
                        resizeMode='cover'
                        resizeMethod={'resize'}
                        source={this.getResources().ic_memory_bg}>
                        <View style={styles.view_header}>
                            <Image
                                style={styles.img_stick_ball}
                                source={this.getResources().ic_stick_ball} />
                            <Text allowFontScaling={global.isScaleFont} style={styles.txt_anniversary}>
                                {this.t('anniversary')}
                            </Text>
                            <TouchableOpacity style={styles.touchable_close}
                                onPress={this.onCloseClick}>
                                <Image
                                    style={styles.img_close}
                                    source={this.getResources().ic_delete} />
                            </TouchableOpacity>

                        </View>
                        <View style={styles.center}>
                            <Text allowFontScaling={global.isScaleFont} style={styles.txt_today}>
                                {this.t('anniversary_last_year')}
                            </Text>
                            <Text allowFontScaling={global.isScaleFont} style={styles.txt_achievement}>
                                {content.achievement}
                            </Text>
                            <Text allowFontScaling={global.isScaleFont} style={styles.txt_score}>
                                {content.score}
                            </Text>
                        </View>

                        <View style={styles.view_bottom}>
                            <TouchableOpacity style={styles.touchable_view_scorecard}
                                onPress={this.onViewScorecardClick}>
                                <Text allowFontScaling={global.isScaleFont} style={styles.txt_btn}>{this.t('view_scorecard')}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.touchable_share}
                                onPress={this.onShareClick}>
                                <Text allowFontScaling={global.isScaleFont} style={styles.txt_btn}>{this.t('share')}</Text>
                            </TouchableOpacity>
                        </View>

                    </ImageBackground>
                </View>
            </Modal>
        );
    }

    show(extrasData = null) {
        this.extrasData = extrasData;
        // this.popupDialog.show();
        this.setState({
            showPopup: true
        })
    }

    dismiss() {
        // this.popupDialog.dismiss();
        this.setState({
            showPopup: false
        })
    }

    onCloseClick() {
        this.setState({
            showPopup: false
        }, () => {
            if (this.props.onClose) {
                this.props.onClose();
            }
        })
    }

    onViewScorecardClick() {
        this.setState({
            showPopup: false
        }, () => {
            if (this.props.onViewScorecard) {
                this.props.onViewScorecard();
            }
        })
    }

    onShareClick() {
        this.setState({
            showPopup: false
        }, () => {
            if (this.props.onShareMemory) {
                this.props.onShareMemory();
            }
        })
    }
}

const styles = StyleSheet.create({
    container: {
        width: scale(320),
        height: scale(220),
    },
    popup_style: {
        width: scale(320),
        height: scale(250),
        backgroundColor: 'rgba(0,0,0,0)',
        borderRadius: 7
    },
    view_header: {
        flexDirection: 'row',
        height: scale(50),
        backgroundColor: '#00ABA7',
        alignItems: 'center',
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10
    },
    img_stick_ball: {
        width: scale(45),
        height: scale(45),
        resizeMode: 'contain'
    },
    txt_anniversary: {
        flex: 1,
        color: 'white',
        fontSize: fontSize(18),
        alignItems: 'center',
        textAlign: 'center'
    },
    img_close: {
        width: scale(30),
        height: scale(30),
        resizeMode: 'contain',
        tintColor: 'white'
    },
    touchable_close: {
        width: scale(50),
        height: scale(50),
        justifyContent: 'center',
        alignItems: 'center'
    },
    center: {
        flex: 1,
        justifyContent: 'space-around',
        alignItems: 'center',
        marginTop: scale(10),
        marginBottom: scale(10)
    },
    txt_today: {
        color: '#3D3D3D',
        fontSize: fontSize(15),
    },
    txt_achievement: {
        color: 'black',
        fontSize: fontSize(22),
        fontWeight: 'bold'
    },
    txt_score: {
        color: '#FF4329',
        fontSize: fontSize(22),
        fontWeight: 'bold'
    },
    view_bottom: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: scale(20),
        marginLeft: scale(20),
        marginRight: scale(20)
    },
    txt_btn: {
        color: 'white',
        fontSize: fontSize(17)
    },
    touchable_view_scorecard: {
        backgroundColor: '#00C1BC',
        height: scale(40),
        flex: 1,
        marginRight: 10,
        borderRadius: scale(20),
        justifyContent: 'center',
        alignItems: 'center'
    },
    touchable_share: {
        backgroundColor: '#00C25D',
        height: scale(40),
        flex: 1,
        marginLeft: 10,
        borderRadius: scale(20),
        justifyContent: 'center',
        alignItems: 'center'
    }
});