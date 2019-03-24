import React from 'react';
import { Platform, StyleSheet, Text, View, Image, TextInput, TouchableOpacity, Dimensions } from 'react-native';
import { Component } from 'react';
import MyView from '../Core/View/MyView';
import I18n from 'react-native-i18n';
import { Constants } from '../Core/Common/ExpoUtils';
import Touchable from 'react-native-platform-touchable';
import BaseComponent from '../Core/View/BaseComponent';
import { scale, verticalScale, fontSize } from '../Config/RatioScale';
let { width, height } = Dimensions.get('window');

const WAIT_INTERVAL = 250;

export default class HeaderSearchView extends BaseComponent {

    static defaultProps = {
        showBack: true,
        placeholder: '',
        handleBackPress: null,
        isHideCancelBtn: true,
        autoFocus: true,
        menuTitle: ''
    }

    constructor(props) {
        super(props);
        this.triggerChange = this.triggerTextChange.bind(this);
        this.state = {
            textSearch: '',
            isHideClear: true
        }

        this.onInputSearchChange = this.onInputSearchChange.bind(this);
        this.onClearSearchClick = this.onClearSearchClick.bind(this);
        this.onCancelSearchClick = this.onCancelSearchClick.bind(this);

        this.focused = false;
    }

    componentDidMount() {
        this.timer = null;
    }

    onPressBack() {
        if (this.props.parentNavigator != null) {
            this.props.parentNavigator.pop();
        }

        if (this.props.handleBackPress != null) {
            this.props.handleBackPress();
        }
    }

    render() {
        let {
            menuTitle
        } = this.props;
        return (
            <View style={styles.container} >

                <Touchable style={styles.touchable_back}
                    onPress={this.onCancelSearchClick} >
                    <Image style={styles.icon_back}
                        source={this.getResourceGolfnews().ic_back}
                    />
                </Touchable>

                <View style={styles.search_group}>
                    <Image
                        style={styles.icon_search}
                        source={this.getResourceGolfnews().ic_search}
                    />
                    <TextInput allowFontScaling={global.isScaleFont}
                        ref={(textInput) => { this.textInput = textInput; }}
                        style={styles.input_search}
                        placeholder={(this.props.placeholder != null && this.props.placeholder != '') ? this.props.placeholder : 'Nhập từ khóa để tìm kiếm...'}
                        placeholderTextColor='#a1a1a1'
                        underlineColorAndroid='rgba(0,0,0,0)'
                        // value={this.state.textSearch}
                        autoFocus={true}
                        onKeyDown={this.handleKeyDown}
                        onChangeText={this.onInputSearchChange}>
                    </TextInput>
                    <MyView hide={this.state.isHideClear}>
                        <TouchableOpacity style={styles.touch_clear} onPress={this.onClearSearchClick}>
                            <Image
                                style={styles.icon_clear}
                                source={this.getResourceGolfnews().ic_clear}
                            />
                        </TouchableOpacity>
                    </MyView>

                </View>

                <MyView hide={this.props.isHideCancelBtn}>
                    <Touchable onPress={this.onCancelSearchClick} style={styles.view_cancel}>
                        <Text allowFontScaling={global.isScaleFont} style={styles.text_cancel}>{menuTitle ? menuTitle : this.t('cancel_title')}</Text>
                    </Touchable>
                </MyView>

            </View>
        );
    }

    onInputSearchChange(input) {
        clearTimeout(this.timer);
        if (input.length > 0) {
            this.focused = true;
            this.setState({
                isHideClear: false,
                textSearch: input
            }, () => {
                if (input.length > 1) {
                    this.timer = setTimeout(this.triggerChange, WAIT_INTERVAL);
                } else {
                    this.triggerTextChange();
                }
            });

        } else {
            if(!this.focused) return;
            this.setState({
                isHideClear: true,
                textSearch: input
            }, () => this.triggerTextChange());
        }

    }

    handleKeyDown(e) {
        if (e.keyCode === ENTER_KEY) {
            this.triggerChange();
        }
    }

    triggerTextChange() {
        if (this.props.onChangeSearchText != null) {
            this.props.onChangeSearchText(this.state.textSearch);
        }
    }

    onClearSearchClick() {
        this.setState({
            isHideClear: true,
            textSearch: ''
        }, () => {
            this.textInput.clear();
        });
        if (this.props.onChangeSearchText) {
            this.props.onChangeSearchText('');
        }
    }

    onCancelSearchClick() {
        if (this.props.onCancelSearch != null) {
            this.props.onCancelSearch();
        }
    }
}

const styles = StyleSheet.create({
    container: {
        height: verticalScale(80),
        flexDirection: 'row',
        backgroundColor: '#F36F25',
        paddingTop: Constants.statusBarHeight,
        alignItems: 'center'
    },
    search_group: {
        flex: 1,
        flexDirection: 'row',
        backgroundColor: '#FFFFFF',
        borderRadius: scale(15),
        // marginLeft: scale(20),
        marginRight: scale(20),
        height: verticalScale(30),
        alignItems: 'center'
    },
    icon_search: {
        ...Platform.select({
            ios: {
                resizeMode: 'contain',
                width: verticalScale(23),
                height: verticalScale(23),
                marginLeft: scale(5),
                marginRight: scale(5)
            },
            android: {
                width: verticalScale(23),
                height: verticalScale(23),
                marginLeft: scale(5),
                marginRight: scale(5),
                resizeMode: 'contain'
            },
        }),
    },
    input_search: {
        flex: 1,
        fontSize: fontSize(13, scale(2)),// 13,
        lineHeight: fontSize(17, verticalScale(5)),
        paddingTop: 0,
        paddingBottom: 0
    },
    touch_clear: {
        padding: scale(10)
    },
    icon_clear: {
        ...Platform.select({
            ios: {
                height: verticalScale(13),
                width: verticalScale(13),
                resizeMode: 'contain',
                marginRight: scale(5)
            },
            android: {
                height: verticalScale(13),
                width: verticalScale(13),
                marginRight: scale(5),
                resizeMode: 'contain'
            },
        }),
    },
    view_cancel: {
        padding: scale(10)
    },
    text_cancel: {
        color: '#FFFFFF',
        fontSize: fontSize(15, scale(1)),// 15
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
});

