import React from 'react';
import {
    Platform,
    StyleSheet,
    Text,
    View,
    Image,
    TouchableOpacity,
    TextInput
} from 'react-native';
import Touchable from 'react-native-platform-touchable';
import MyView from '../../Core/View/MyView';
import { Constants } from '../../Core/Common/ExpoUtils';
import BaseComponent from '../../Core/View/BaseComponent';
import { scale, verticalScale, fontSize } from '../../Config/RatioScale';

const WAIT_INTERVAL = 250;

export default class HeaderSearchView extends BaseComponent {

    static defaultProps = {
        showBack: true,
        title: '',
        handleBackPress: null,
    }


    constructor(props) {
        super(props);
        this.isIphoneX = this.getAppUtil().isIphoneX();
        this.state = {
            isEnable: this.props.isEnable,
            isSearching: false
        }
        this.onPressBack = this.onPressBack.bind(this);
        this.onIconMenuClick = this.onIconMenuClick.bind(this);
        this.onInputSearchChange = this.onInputSearchChange.bind(this);
        this.handleKeyDown = this.handleKeyDown.bind(this);
        this.triggerChange = this.triggerTextChange.bind(this);
    }

    renderCenter(isSearching, title) {
        if (!isSearching) {
            return (
                <View style={styles.view_title}>
                    <Text allowFontScaling={global.isScaleFont} style={styles.text_title} numberOfLines={1}>{title}</Text>
                </View>
            )
        } else {
            return (
                <TextInput allowFontScaling={global.isScaleFont}
                    ref={(textInput) => { this.textInput = textInput; }}
                    style={styles.input_search}
                    placeholder={this.t('press_to_search')}
                    placeholderTextColor='#a1a1a1'
                    underlineColorAndroid='rgba(0,0,0,0)'
                    // value={this.state.textSearch}
                    autoFocus={true}
                    onKeyDown={this.handleKeyDown}
                    onChangeText={this.onInputSearchChange} />
            )
        }
    }

    renderRightIcon(isSearching) {
        if (!isSearching) {
            return (
                <TouchableOpacity style={[styles.touchable_menu, { marginRight: 8 }]}
                    onPress={this.onIconMenuClick} >
                    <Image
                        style={styles.icon_menu}
                        source={this.getResources().ic_Search1}
                    />
                </TouchableOpacity>
            )
        } else {
            return (
                <View style={{ width: 50, height: 50 }} />
            )
        }

    }

    render() {

        let { showBack, title } = this.props;
        let { isSearching } = this.state;

        return (
            <View style={styles.container} >
                <View style={[styles.container_header, this.isIphoneX ? { marginTop: 30 } : {}]}>

                    <MyView hide={showBack} style={{ width: 50 }}></MyView>
                    <MyView hide={!showBack}>
                        <Touchable style={styles.touchable_back}
                            onPress={this.onPressBack} >
                            <Image style={styles.icon_back}
                                source={this.getResources().ic_back_large}
                            />
                        </Touchable>
                    </MyView>

                    {this.renderCenter(isSearching, title)}

                    {this.renderRightIcon(isSearching)}

                </View>
            </View>
        );
    }

    onPressBack() {
        console.log(this.props);
        if (this.state.isSearching) {
            this.setState({
                isSearching: false
            }, ()=>{
                if (this.props.cancelSearchPress) {
                    this.props.cancelSearchPress();
                }
            })
        } else if (this.props.handleBackPress != null) {
            this.props.handleBackPress();
        }

    }

    cancelSearch(){
        this.setState({
            isSearching: false
        })
    }

    onIconMenuClick() {
        this.setState({
            isSearching: !this.state.isSearching
        })
    }

    onInputSearchChange(input) {
        clearTimeout(this.timer);
        if (input.length > 0) {
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
        width: verticalScale(25),
        height: verticalScale(25),
        resizeMode: 'contain'
    },
    input_search: {
        flex: 1,
        fontSize: fontSize(14, scale(2)),// 13,
        lineHeight: fontSize(20, verticalScale(5)),
        minHeight: scale(30),
        paddingLeft: scale(3),
        paddingTop: 0,
        paddingBottom: 0,
        backgroundColor: '#fff',
        borderRadius: scale(7),
        color: '#000'
    },

});