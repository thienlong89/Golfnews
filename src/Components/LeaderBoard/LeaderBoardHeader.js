import React from 'react';
import { Text, View, TextInput, Image, TouchableOpacity } from 'react-native';
import BaseComponent from '../../Core/View/BaseComponent';
import Touchable from 'react-native-platform-touchable';
import stylesHeaderBar from '../../Styles/Common/HeaderBar/StyleHeaderBar';
import MyView from '../../Core/View/MyView';

export default class LeaderBoardHeader extends BaseComponent {
    constructor(props) {
        super(props);

        this.isIphoneX = this.getAppUtil().isIphoneX();
        this.searchCallback = null;
        this.backCallback = null;
        this.cancelCallback = null;
        this.searchClickCallback = null;
        this.state = {
            isSearchClick: false
        }

        this.onBackClick = this.onBackClick.bind(this);
        this.onSearchClick = this.onSearchClick.bind(this);
        this.onCancelClick = this.onCancelClick.bind(this);
        this.onChangeText = this.onChangeText.bind(this);
    }

    onChangeText(textInput) {
        // this.setState({
        //     textSearch: textInput
        // });
        if (this.searchCallback) {
            this.searchCallback(textInput);
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
        if (!this.state.isSearchClick) return;
        this.setState({
            isSearchClick: false,
            // textSearch : ''
        });
        if (this.inputSearch) {
            this.inputSearch.clear();
            console.log("Clear search : ");
        }
    }

    render() {
        let { isSearchClick } = this.state;
        let { hide_right } = this.props;
        if (!isSearchClick) {
            return (
                <View style={stylesHeaderBar.content_view}>
                    <View style={[stylesHeaderBar.header_view, this.isIphoneX ? { marginTop: 30 } : {}]}>
                        <TouchableOpacity style={stylesHeaderBar.touch_back}
                            onPress={this.onBackClick}>
                            <Image
                                style={stylesHeaderBar.back_image}
                                source={this.getResources().ic_back_large}
                            />

                        </TouchableOpacity>
                        <Text allowFontScaling={global.isScaleFont} style={stylesHeaderBar.title_text}>{this.t('leaderboard_title')}</Text>
                        <MyView hide={hide_right}>
                            <TouchableOpacity style={stylesHeaderBar.touch_right} onPress={this.onSearchClick}>
                                <Image
                                    style={stylesHeaderBar.right_image}
                                    source={this.getResources().ic_Search1}
                                />
                            </TouchableOpacity>
                        </MyView>
                        <MyView hide={!hide_right}
                            style={{ width: 50 }} />
                    </View>
                </View >
            )
        } else {
            return <View style={stylesHeaderBar.content_view}>
                <View style={stylesHeaderBar.header_view}>
                    <TouchableOpacity style={stylesHeaderBar.touch_back} onPress={this.onBackClick}>
                        <Image
                            style={stylesHeaderBar.back_image}
                            source={this.getResources().ic_back}
                        />
                    </TouchableOpacity>
                    <TextInput allowFontScaling={global.isScaleFont} ref={(input) => { this.inputSearch = input }}
                        style={stylesHeaderBar.text_input}
                        placeholder=''
                        placeholderTextColor='#a1a1a1'
                        underlineColorAndroid='rgba(0,0,0,0)'
                        autoFocus={true}
                        onChangeText={this.onChangeText}
                    // value={this.state.textSearch}
                    >
                    </TextInput>
                    <TouchableOpacity onPress={this.onCancelClick}>
                        <View style={stylesHeaderBar.right_view}>
                            <Text allowFontScaling={global.isScaleFont} style={stylesHeaderBar.right_text}>{this.t('cancel_title')}</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
        }
    }
}