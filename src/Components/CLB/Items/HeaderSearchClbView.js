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
import MyView from '../../../Core/View/MyView';
import { Constants } from '../../../Core/Common/ExpoUtils';
import BaseComponent from '../../../Core/View/BaseComponent';

const WAIT_INTERVAL = 250;

export default class HeaderSearchClbView extends BaseComponent {

    static defaultProps = {
        placeholder: ''
    }


    constructor(props) {
        super(props);
        this.isIphoneX = this.getAppUtil().isIphoneX();
        this.triggerChange = this.triggerTextChange.bind(this);
        this.state = {
            textSearch: '',
            isHideClear: true
        }
    }

    render() {
        let { placeholder } = this.props;
        let { isHideClear } = this.state;

        return (
            <View style={styles.container} >
                <View style={[styles.container_header, this.isIphoneX ? { marginTop: 30 } : {}]}>

                    <Touchable style={styles.touchable_back} onPress={() => this.onPressBack()} >
                        <Image style={styles.icon_back}
                            source={this.getResources().ic_back_large}
                        />
                    </Touchable>
                    <View style={styles.search_group}>
                        <Image
                            style={styles.icon_search}
                            source={this.getResources().ic_Search}
                        />
                        <TextInput allowFontScaling={global.isScaleFont}
                            ref={(textInput) => { this.textInput = textInput; }}
                            style={styles.input_search}
                            placeholder={placeholder ? placeholder : this.t('press_to_search')}
                            placeholderTextColor='#60CCC9'
                            underlineColorAndroid='rgba(0,0,0,0)'
                            // value={this.state.textSearch}
                            onKeyDown={this.handleKeyDown}
                            onChangeText={this.onInputSearchChange.bind(this)}>
                        </TextInput>
                        <MyView hide={isHideClear}>
                            <TouchableOpacity style={styles.touch_clear}
                                onPress={this.onClearSearchClick.bind(this)}>
                                <Image
                                    style={styles.icon_clear}
                                    source={this.getResources().ic_clear}
                                />
                            </TouchableOpacity>
                        </MyView>

                    </View>

                    <Touchable style={styles.touchable_dot}>
                        <Text allowFontScaling={global.isScaleFont} style={styles.txt_dot}>{'•••'}</Text>
                    </Touchable>

                </View>
            </View>
        );
    }

    onPressBack() {
        if (this.props.onPressBack) {
            this.props.onPressBack();
        }

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


}

const styles = StyleSheet.create({
    container: {
        height: 80,
        backgroundColor: '#00ABA7',
    },
    container_header: {
        flex: 1,
        flexDirection: 'row',
        marginTop: Constants.statusBarHeight,
        alignItems: 'center'
    },
    touchable_back: {
        width: 50,
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 15,
        paddingBottom: 15
    },
    icon_back: {
        height: 22,
        width: 22,
        resizeMode: 'contain',
        tintColor: '#FFF',
    },
    search_group: {
        flex: 1,
        flexDirection: 'row',
        backgroundColor: '#008986',
        borderRadius: 15,
        height: 30,
        alignItems: 'center'
    },
    icon_search: {
        resizeMode: 'contain',
        width: 20,
        height: 20,
        marginLeft: 5,
        marginRight: 5,
        tintColor: '#60CCC9'
    },
    input_search: {
        flex: 1,
        fontSize: (Platform.OS === 'ios') ? 16 : 13,
        lineHeight: (Platform.OS === 'ios') ? 20 : 15,
        paddingTop: 0,
        paddingBottom: 0
    },
    touch_clear: {
        padding: 10
    },
    icon_clear: {
        ...Platform.select({
            ios: {
                height: 13,
                width: 13,
                resizeMode: 'contain',
                marginRight: 5
            },
            android: {
                height: 13,
                width: 13,
                marginRight: 5,
                resizeMode: 'contain'
            },
        }),
    },
    txt_dot: {
        color: '#FFF',
        fontSize: 25
    },
    touchable_dot: {
        width: 50,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center'
    }
});

