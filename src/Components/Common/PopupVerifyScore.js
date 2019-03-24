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
import HtmlText from '../../Core/Common/HtmlBoldText';

const { width, height } = Dimensions.get("window");
const slideAnimation = new SlideAnimation({
    slideFrom: 'bottom',
});

export default class PopupVerifyScore extends BaseComponent {

    constructor(props) {
        super(props);

        this.state = {
            isMoreUser: false,
            player: ''
        }

        this.onVerifyPlayer = this.onVerifyPlayer.bind(this);
        this.onVerifyForAll = this.onVerifyForAll.bind(this);
        this.onVerifyClose = this.onVerifyClose.bind(this);
    }

    // shouldComponentUpdate(){
    //     return false;
    // }

    render() {
        let {
            isMoreUser,
            player
         } = this.state;
        let playerName = player ? player.User.fullname : '';

        return (
            <PopupDialog
                ref={(popupDialog) => { this.popupDialog = popupDialog; }}
                dialogAnimation={slideAnimation}
                // containerStyle={{ position: 'absolute', bottom: 0 }}
                dialogStyle={[styles.popup_style, { height: isMoreUser ? verticalScale(240) : verticalScale(180) }]}>
                <View style={styles.container}>
                    <View style={styles.container_content}>

                        <View style={styles.touchable_item}>
                            <Text allowFontScaling={global.isScaleFont} style={styles.txt_title}>{this.t('verify_score')}</Text>
                        </View>
                        <View style={styles.line} />

                        <MyView hide={!isMoreUser}>
                            <Touchable style={styles.touchable_item} onPress={this.onVerifyForAll}>
                                {/* <Text allowFontScaling={global.isScaleFont} style={styles.text_view_image}>{this.t('verify_score_all')}</Text> */}
                                <HtmlText
                                    style={styles.text_view_image}
                                    message={this.t('verify_score_all')}
                                />
                            </Touchable>
                            <View style={styles.line} />
                        </MyView>
                        
                        <Touchable style={styles.touchable_item} onPress={this.onVerifyPlayer}>
                            <HtmlText
                                style={styles.text_view_image}
                                message={this.t('verify_score_for').format(playerName)}
                            />
                        </Touchable>
                        <View style={styles.line} />
                        
                        <Touchable style={styles.touchable_item} onPress={this.onVerifyClose}>
                            <Text allowFontScaling={global.isScaleFont} style={styles.txt_close}>{this.t('close')}</Text>
                        </Touchable>

                    </View>
                </View>

            </PopupDialog>
        );
    }

    show(isMoreUser = false, player) {
        this.setState({
            isMoreUser: isMoreUser,
            player: player
        }, () => {
            this.popupDialog.show();
        })
    }

    dismiss() {
        this.popupDialog.dismiss();
    }

    onVerifyPlayer() {
        this.popupDialog.dismiss();
        if (this.props.onVerifyPlayer) {
            this.props.onVerifyPlayer(this.state.player);
        }
    }

    onVerifyForAll() {
        this.popupDialog.dismiss();
        if (this.props.onVerifyForAll) {
            this.props.onVerifyForAll();
        }
    }

    onVerifyClose() {
        this.popupDialog.dismiss();
    }

}

const styles = StyleSheet.create({
    container: {
        justifyContent: 'space-between',
        backgroundColor: '#fff',
        borderRadius: verticalScale(10)
        // borderTopLeftRadius: verticalScale(10),
        // borderTopRightRadius: verticalScale(10)
    },
    popup_style: {
        width: height*2 / 3,
        backgroundColor: 'rgba(0,0,0,0)'
    },
    container_content: {
        backgroundColor: '#FFFFFF',
        borderRadius: verticalScale(10)
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
        // alignItems: 'center'
        height: verticalScale(60),
        justifyContent: 'center',
        alignItems: 'center'
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