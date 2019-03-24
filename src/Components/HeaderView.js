import React from 'react';
import { Platform, StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import Touchable from 'react-native-platform-touchable';
import MyView from '../Core/View/MyView';
import { Constants } from '../Core/Common/ExpoUtils';
import BaseComponent from '../Core/View/BaseComponent';
import { scale, verticalScale, fontSize } from '../Config/RatioScale';

export default class HeaderView extends BaseComponent {

    static defaultProps = {
        showBack: true,
        title: '',
        handleBackPress: null,
        menuTitle: '',
        iconMenu: null,
        showMap: false,
        iconMenuStyle: null,
        isEnable: true
    }


    constructor(props) {
        super(props);
        this.isIphoneX = this.getAppUtil().isIphoneX();
        this.state = {
            isEnable: this.props.isEnable,
            right_icon: this.getResources().ic_map_header,
            showMap: this.props.showMap
        }

        this.onPressBack = this.onPressBack.bind(this);
        this.onIconMapClick = this.onIconMapClick.bind(this);
        this.onIconMenuClick = this.onIconMenuClick.bind(this);
        this.onMenuHeaderClick = this.onMenuHeaderClick.bind(this);
    }

    render() {

        let { showBack, iconMenu, title, menuTitle, iconMenuStyle } = this.props;
        let { isEnable, right_icon, icon_search, showMap } = this.state;
        console.log('HeaderView', showMap, right_icon, icon_search)
        return (
            <View style={styles.container} >
                <View style={[styles.container_header, this.isIphoneX ? { marginTop: 30 } : {}]}>

                    <MyView hide={showBack} style={{ width: 50 }}></MyView>
                    <MyView hide={!showBack}>
                        <Touchable style={styles.touchable_back} onPress={this.onPressBack} >
                            <Image style={styles.icon_back}
                                source={this.getResources().ic_back_large}
                            />
                        </Touchable>
                    </MyView>

                    <View style={[styles.view_title, { marginRight: showMap && iconMenu ? 40 : 0 }]}>
                        <Text allowFontScaling={global.isScaleFont} style={styles.text_title} numberOfLines={1}>{title}</Text>
                    </View>

                    <MyView hide={showMap === false}
                        style={{ position: 'absolute', right: iconMenu ? 40 : 0 }}>
                        <TouchableOpacity style={[styles.touchable_menu, { marginRight: 10 }]} onPress={this.onIconMapClick} >
                            <Image
                                style={icon_search ? styles.search_icon : styles.icon_menu}
                                // source={this.getResources().ic_map_header}
                                source={right_icon}
                            />
                        </TouchableOpacity>
                    </MyView>

                    <MyView hide={iconMenu === ''}
                        style={{ position: 'absolute', right: 0 }}>
                        <TouchableOpacity style={[styles.touchable_menu, { marginRight: 8 }]} onPress={this.onIconMenuClick} >
                            <Image
                                style={iconMenuStyle ? iconMenuStyle : styles.icon_menu}
                                source={iconMenu}
                            />
                        </TouchableOpacity>
                    </MyView>

                    <MyView hide={menuTitle === ''}>
                        <TouchableOpacity style={styles.touchable_menu}
                            onPress={this.onMenuHeaderClick}
                            disabled={!isEnable}>
                            <Text allowFontScaling={global.isScaleFont}
                                style={[styles.menu_title, { color: isEnable ? '#FFF' : '#60CCC9' }]}>{menuTitle}</Text>
                        </TouchableOpacity>
                    </MyView>

                    <MyView hide={menuTitle != ''} style={{ width: 50 }}></MyView>

                </View>
            </View>
        );
    }

    setMenuEnable(isEnable = true) {
        this.setState({
            isEnable: isEnable
        })
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

    onIconMapClick() {
        if (this.props.onIconMapClick != null) {
            this.props.onIconMapClick();
        }
    }

    setRightIcon(_icon) {
        this.props.showMap = true;
        this.setState({
            right_icon: _icon,
            icon_search: true,
            showMap: true
        });
    }

    setHideRight() {
        this.setState({
            showMap: false
        });
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
        width: verticalScale(22),
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
        resizeMode: 'contain'
    },
    search_icon: {
        width: verticalScale(24),
        height: verticalScale(24),
        tintColor: 'white',
        resizeMode: 'contain'
    }
});