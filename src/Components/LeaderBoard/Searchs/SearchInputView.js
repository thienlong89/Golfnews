import React from 'react';
import { Text, View, TextInput, Image, TouchableWithoutFeedback, StyleSheet, Dimensions } from 'react-native';
import BaseComponent from '../../../Core/View/BaseComponent';
import Touchable from 'react-native-platform-touchable';
import ButtonClearSearch from '../../Chats/ListChats/Items/ButtonClearSearch';
import { scale, verticalScale, fontSize } from '../../../Config/RatioScale';
let { width } = Dimensions.get('window');
let scr_w = width - scale(20);
// import stylesHeaderBar from '../../../Styles/Common/HeaderBar/StyleHeaderBar';

export default class SearchInputView extends BaseComponent {
    constructor(props) {
        super(props);
        this.searchCallback = null;
        this.backCallback = null;
        this.cancelCallback = null;
        this.searchClickCallback = null;
        this.state = {
            // textSearch : '',
            isSearchClick: false
        }

        this.clearSearch = this.clearSearch.bind(this);
        this.text = '';
    }

    onChangeSearch(text) {
        this.text = text;
        if (text && text.length) {
            this.btnClear.show();
        } else {
            this.btnClear.hide();
        }
        if (this.searchCallback) {
            this.searchCallback(text);
        }
    }

    /**
     * back về màn hình trước đó
     */
    onBackClick() {
        if (this.backCallback) {
            this.backCallback();
        }
        return true;
    }

    /**
     * Hủy tìm kiếm
     */
    onCancelClick() {
        this.setState({
            isSearchClick: false,
            textSearch: ''
        });
        if (this.cancelCallback) {
            this.cancelCallback();
        }
    }

    /**
     * nhấn vào button tìm kiếm
     */
    onSearchClick() {
        this.setState({
            isSearchClick: true
        })
        if (this.searchClickCallback) {
            this.searchClickCallback();
        }
    }

    clearSearch() {
        // if (!this.state.isSearchClick) return;
        // this.setState({
        //     isSearchClick: false,
        //     // textSearch : ''
        // });
        if (this.inputView) {
            this.inputView.clear();
            this.inputView.blur();
            console.log("Clear search : ");
        }
        this.text = '';
    }

    render() {
        return (
            <View style={styles.search_view}>
                <Image style={styles.search_img}
                    source={this.getResources().ic_Search} />
                <TouchableWithoutFeedback onPress={() => {
                    console.log("back.......................................");
                    this.inputView.blur();
                }}>
                    <TextInput allowFontScaling={global.isScaleFont}
                        ref={(inputView) => { this.inputView = inputView; }}
                        style={styles.container_body_view_inputtext}
                        placeholder={this.t('find_country')}
                        placeholderTextColor='#dadada'
                        underlineColorAndroid='rgba(0,0,0,0)'
                        returnKeyType={"done"}
                        autoFocus={true}
                        onChangeText={(text) => this.onChangeSearch(text)}
                    // value={this.state.textSearch}
                    >
                    </TextInput>
                </TouchableWithoutFeedback>
                <ButtonClearSearch tintColor={'#A1A1A1'} onClick={this.clearSearch} ref={(btnClear) => { this.btnClear = btnClear; }} style={{ width: scale(40), height: verticalScale(30), alignItems: 'center', justifyContent: 'center' }} />
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
        width: 20,
        height: 20,
        marginLeft: 5,
        resizeMode: 'contain',
        tintColor: '#dadada'
    },
    search_view: {
        height: 30,
        // flex: 1,
        width: scr_w,
        marginLeft: scale(10),
        // marginRight: 10,
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 15,
        borderColor: '#c7c7c7',
        borderWidth: 1,
        backgroundColor: 'white',
        marginTop: verticalScale(10)
    },
    back_img: {
        marginLeft: 10,
        width: 30,
        height: 30,
        resizeMode: 'contain'
    },
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
        paddingLeft: scale(10),
        fontSize: fontSize(14),
        lineHeight: fontSize(17),
        color: '#A1A1A1',
        paddingTop: 0,
        paddingBottom: 0
    },
});