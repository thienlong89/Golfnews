import React from 'react';
import BaseComponent from "../../../Core/View/BaseComponent";
import { View, Image, Dimensions, Text, StyleSheet, TextInput, TouchableWithoutFeedback, Keyboard } from "react-native";
import { Constants } from '../../../Core/Common/ExpoUtils';
import Touchable from 'react-native-platform-touchable';
// import ButtonClearSearch from './Items/ButtonClearSearch';
import { scale, verticalScale, fontSize } from '../../../Config/RatioScale';
import ButtonClearSearch from '../../Chats/ListChats/Items/ButtonClearSearch';


export default class HeaderGroup extends BaseComponent {
    constructor(props) {
        super(props);
        this.backCallback = null;
        this.searchCallback = null;
        this.state = {
            textSearch: '',
            isSearch: true
        }

        this.onFocusCallback = null;

        this.onClearSearch = this.onClearSearch.bind(this);
        this.onFocus = this.onFocus.bind(this);
        this.onBackClick = this.onBackClick.bind(this);

        this.onSearchClick = this.onSearchClick.bind(this);
        this.onRightClick = this.onRightClick.bind(this);
    }

    onBackClick() {
        let { backClick } = this.props;
        if (backClick) {
            backClick();
        }
    }

    onRightClick() {
        let { righClick } = this.props;
        if (righClick) {
            righClick();
        }
    }

    onSearchClick() {
        this.setState({
            isSearch: true
        })
    }

    onChangeSearch(text) {
        if (text && text.length) {
            this.btnClear.show();
        } else {
            this.btnClear.hide();
        }
        if (this.searchCallback) {
            this.searchCallback(text);
        }
    }

    onFocus() {
        if (this.onFocusCallback) {
            this.onFocusCallback();
        }
    }

    focus() {
        this.inputView.focus();
    }

    onClearSearch() {
        this.inputView.blur();
        this.inputView.clear();
        this.btnClear.hide();
        let { clearSearchClick } = this.props;
        if (clearSearchClick) {
            clearSearchClick();
        }
    }

    getElementTite() {
        let { isSearch } = this.state;
        if (!isSearch) {
            let { title } = this.props;
            return (
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <Text allowFontScaling={global.isScaleFont} style={{ fontSize: fontSize(20, scale(6)), color: '#fff', fontWeight: 'bold' }}>{title}</Text>
                </View>
            );
        } else {
            return (
                <View style={styles.search_view}>
                    <Image style={styles.search_img_tiny}
                        source={this.getResources().ic_Search} />
                    {/* <TouchableWithoutFeedback onPress={()=>{
                            console.log("back.......................................");
                            this.inputView.blur();
                        }}> */}
                    <TextInput allowFontScaling={global.isScaleFont}
                        ref={(inputView) => { this.inputView = inputView; }}
                        style={styles.container_body_view_inputtext}
                        placeholder={this.t('search')}
                        placeholderTextColor='#dadada'
                        underlineColorAndroid='rgba(0,0,0,0)'
                        returnKeyType={"done"}
                        onFocus={this.onFocus}
                        onChangeText={(text) => this.onChangeSearch(text)}
                    // value={this.state.textSearch}
                    >
                    </TextInput>
                    {/* </TouchableWithoutFeedback> */}
                    <ButtonClearSearch onClick={this.onClearSearch} ref={(btnClear) => { this.btnClear = btnClear; }} style={{ width: scale(40), height: verticalScale(30), alignItems: 'center', justifyContent: 'center' }} />
                </View>
            );
        }
    }

    getElementRight() {
        let { isSearch } = this.state;
        if (!isSearch) {
            return (
                <Touchable onPress={this.onSearchClick}>
                    <Image style={styles.search_img}
                        source={this.getResources().ic_Search} />
                </Touchable>
            )
        } else {
            return (
                <Touchable onPress={this.onRightClick}>
                    <View style={{ width: 50, height: 30, justifyContent: 'center', alignItems: 'center' }}>
                        <Text allowFontScaling={global.isScaleFont} style={{ fontSize: fontSize(14), color: 'white' }}>{this.t('done')}</Text>
                    </View>
                </Touchable>
            )
        }
    }

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.body}>
                    <Touchable style={styles.touch} onPress={this.onBackClick}>
                        <Image style={styles.back_img}
                            source={this.getResources().ic_back} />
                    </Touchable>
                    {/* <View style={styles.search_view}>
                        <Image style={styles.search_img}
                            source={this.getResources().ic_Search} />
                
                        <TextInput ref={(inputView) => { this.inputView = inputView; }}
                            allowFontScaling={global.isScaleFont} style={styles.container_body_view_inputtext}
                            placeholder={this.t('search')}
                            placeholderTextColor='#dadada'
                            underlineColorAndroid='rgba(0,0,0,0)'
                            returnKeyType={"done"}
                            onFocus={this.onFocus}
                            onChangeText={(text) => this.onChangeSearch(text)}
                        // value={this.state.textSearch}
                        >
                        </TextInput>
                        <ButtonClearSearch onClick={this.onClearSearch} ref={(btnClear) => { this.btnClear = btnClear; }} style={{ width: scale(40), height: verticalScale(30), alignItems: 'center', justifyContent: 'center' }} />
                    </View> */}
                    {this.getElementTite()}
                    {/* <Touchable onPress={this.onBackClick}>
                        <Image style={styles.search_img}
                            source={this.getResources().ic_Search} />
                    </Touchable> */}
                    {this.getElementRight()}
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        height: 80,
        backgroundColor: '#00aba7'
    },
    search_img: {
        width: 30,
        height: 30,
        marginRight: 6,
        resizeMode: 'contain',
        tintColor: 'white'
    },

    search_img_tiny: {
        width: 20,
        height: 20,
        marginLeft: 6,
        resizeMode: 'contain',
        tintColor: 'white'
    },

    search_view: {
        height: 30,
        flex: 1,
        marginLeft: 10,
        marginRight: 10,
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 15,
        backgroundColor: 'rgba(0, 0, 0, 0.2)'
    },
    back_img: {
        marginLeft: 10,
        width: 30,
        height: 30,
        resizeMode: 'contain'
    },
    // search_img: {
    //     marginRight: 10,
    //     width: 30,
    //     height: 30,
    //     resizeMode: 'contain'
    // },
    touch: {
        width: 40,
        height: 30
    },
    body: {
        marginTop: 30,
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1
    },
    container_body_view_inputtext: {
        flex: 1,
        paddingLeft: 10,
        fontSize: 14,
        lineHeight: 16,
        color: '#fff',
        paddingTop: 0,
        paddingBottom: 0
    },
});