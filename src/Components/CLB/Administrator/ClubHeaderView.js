import React from 'react';
import { Platform, StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import Touchable from 'react-native-platform-touchable';
import { Constants } from '../../../Core/Common/ExpoUtils';
import BaseComponent from '../../../Core/View/BaseComponent';
import { scale, verticalScale, fontSize } from '../../../Config/RatioScale';

export default class ClubHeaderView extends BaseComponent {

    static defaultProps = {
        title: '',
        handleBackPress: null,
        subTitle: '',
        iconMenu: null,
        iconMenuStyle: null,
    }



    constructor(props) {
        super(props);
        this.isIphoneX = this.getAppUtil().isIphoneX();
        this.state = {
        }
    }

    render() {

        let { iconMenu, title, subTitle, iconMenuStyle } = this.props;

        return (
            <View style={styles.container} >
                <View style={[styles.container_header, this.isIphoneX ? { marginTop: 30 } : {}]}>

                    <Touchable style={styles.touchable_back} onPress={() => this.onPressBack()} >
                        <Image style={styles.icon_back}
                            source={this.getResources().ic_back_large}
                        />
                    </Touchable>

                    <View style={[styles.view_title]}>
                        <Text allowFontScaling={global.isScaleFont} style={styles.text_title} numberOfLines={1}>{title}</Text>
                        <Text allowFontScaling={global.isScaleFont} style={styles.text_sub_title} numberOfLines={1}>{subTitle}</Text>
                    </View>


                    <TouchableOpacity style={[styles.touchable_menu, { marginRight: 8 }]} onPress={() => this.onIconMenuClick()} >
                        <Image
                            style={iconMenuStyle ? iconMenuStyle : styles.icon_menu}
                            source={iconMenu}
                        />
                    </TouchableOpacity>

                </View>
            </View>
        );
    }

    onPressBack() {
        console.log(this.props);
        if (this.props.parentNavigator != null) {
            this.props.parentNavigator.pop();
        }

        if (this.props.handleBackPress != null) {
            this.props.handleBackPress();
        }
    }

    onMenuHeaderClick() {
        if (this.props.onMenuHeaderClick != null) {
            this.props.onMenuHeaderClick();
        }
    }

    onIconMenuClick() {
        if (this.props.onIconMenuClick != null) {
            this.props.onIconMenuClick();
        }
    }

}

const styles = StyleSheet.create({
    container: {
        height: verticalScale(80),
        backgroundColor: '#00ABA7',
    },
    container_header: {
        flex: 1,
        flexDirection: 'row',
        marginTop: Constants.statusBarHeight,
        alignItems: 'center'
    },
    touchable_back: {
        width: verticalScale(50),
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: scale(15),
        paddingBottom: scale(15)
    },
    icon_back: {
        height: verticalScale(22),
        width: 22,
        resizeMode: 'contain',
        marginLeft: scale(4)
    },
    view_title: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    text_title: {
        color: '#FFFFFF',
        fontWeight: 'bold',
        fontSize: fontSize(20, scale(6)),// 17,
        paddingBottom: 0
    },
    text_sub_title: {
        color: '#B9F2F0',
        fontSize: fontSize(16, scale(6)),// 17,
        paddingTop: 0
    },
    menu_title: {
        width: verticalScale(50),
        color: '#FFFFFF',
        fontSize: fontSize(15, scale(1)),// 15,
        alignItems: 'center',
        textAlign: 'center'
    },
    touchable_menu: {
        height: verticalScale(50),
        justifyContent: 'center'
    },
    icon_menu: {
        width: verticalScale(40),
        height: verticalScale(40),
        resizeMode: 'contain',
        tintColor: '#fff'
    }

});