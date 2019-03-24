import React from 'react';
import {
    Platform,
    StyleSheet,
    Text,
    View,
    TextInput,
    TouchableOpacity,
    Image
} from 'react-native';
import Touchable from 'react-native-platform-touchable';
import BaseComponent from '../../Core/View/BaseComponent';
import MyView from '../../Core/View/MyView';
import I18n from 'react-native-i18n';
import { scale } from '../../Config/RatioScale';

const WAIT_INTERVAL = 250;

export default class SearchInputText extends BaseComponent {

    static defaultProps = {
        placeholder: '',
        autoFocus: true,
        wait_interval: WAIT_INTERVAL
    }

    constructor(props) {
        super(props);
        this.triggerChange = this.triggerTextChange.bind(this);
        this.onClearSearchClick = this.onClearSearchClick.bind(this);
        this.onInputSearchChange = this.onInputSearchChange.bind(this);
        this.textSearch = '';
        this.onFocus = this.onFocus.bind(this);
        this.onBlur = this.onBlur.bind(this);
        this.state = {
            textSearch: '',
            isHideClear: true
        }
    }

    onBlur(){
        let{onBlur} = this.props;
        if(onBlur){
            onBlur();
        }
    }

    onFocus(){
        let{onFocus} = this.props;
        if(onFocus){
            onFocus();
        }
    }

    render() {
        return (
            <View style={styles.search_group}>
                <Image
                    style={styles.icon_search}
                    source={this.getResources().ic_Search}
                />
                <TextInput allowFontScaling={global.isScaleFont}
                    ref={(textInput) => { this.textInput = textInput; }}
                    style={styles.input_search}
                    placeholder={(this.props.placeholder != null && this.props.placeholder != '') ? this.props.placeholder : I18n.t('press_to_search')}
                    placeholderTextColor='#a1a1a1'
                    underlineColorAndroid='rgba(0,0,0,0)'
                    onFocus={this.onFocus}
                    onBlur={this.onBlur}
                    // value={this.state.textSearch}
                    autoFocus={this.props.autoFocus}
                    onKeyDown={this.handleKeyDown}
                    onChangeText={this.onInputSearchChange}>
                </TextInput>
                <MyView hide={this.state.isHideClear}>
                    <TouchableOpacity style={styles.touch_clear} onPress={this.onClearSearchClick}>
                        <Image
                            style={styles.icon_clear}
                            source={this.getResources().ic_clear}
                        />
                    </TouchableOpacity>
                </MyView>

            </View>
        );
    }

    componentDidMount() {
        this.timer = null;
    }

    hideClear(input){
        let{isHideClear} = this.state;
        if(!isHideClear) return;
        this.setState({
            isHideClear : false
        },() => {
            if (input.length > 1) {
                this.timer = setTimeout(this.triggerChange, this.props.wait_interval);
            } 
            // else {
            //     this.triggerTextChange();
            // }
        });;
    }

    showClear(){
        let{isHideClear} = this.state;
        if(isHideClear) return;
        this.setState({
            isHideClear : true
        });//,() => this.triggerTextChange())
    }

    onInputSearchChange(input) {
        this.textSearch = input;
        this.triggerTextChange();
        clearTimeout(this.timer);
        if (input.length > 0) {
            this.hideClear(input);
            // this.setState({
            //     isHideClear: false,
            //     textSearch: input
            // }, () => {
            //     if (input.length > 1) {
            //         this.timer = setTimeout(this.triggerChange, this.props.wait_interval);
            //     } else {
            //         this.triggerTextChange();
            //     }
            // });

        } else {
            this.showClear();
            // this.setState({
            //     isHideClear: true,
            //     textSearch: input
            // }, () => this.triggerTextChange());
        }

    }

    handleKeyDown(e) {
        if (e.keyCode === ENTER_KEY) {
            this.triggerChange();
        }
    }

    triggerTextChange() {
        let{onChangeSearchText} = this.props;
        if(onChangeSearchText){
            onChangeSearchText(this.textSearch);
        }
        // if (this.props.onChangeSearchText != null) {
        //     this.props.onChangeSearchText(this.state.textSearch);
        // }
    }

    blur(){
        this.textInput.blur();
    }

    onClearSearchClick() {
        this.textInput.clear();
        this.textInput.blur();
        this.setState({
            isHideClear: true,
            textSearch: ''
        }, ()=>{
            // this.textInput.clear();
        });
        if (this.props.onChangeSearchText) {
            this.props.onChangeSearchText('');
        }
    }



}

const styles = StyleSheet.create({
    search_group: {
        flexDirection: 'row',
        backgroundColor: '#FFFFFF',
        // marginLeft: 10,
        // marginRight: 10,
        // marginTop: 10,
        // marginBottom: 10,
        height: 40,
        alignItems: 'center',
        // borderWidth: 1,
        borderRadius: scale(8),
        // borderColor: '#A1A1A1'
    },
    icon_search: {
        ...Platform.select({
            ios: {
                resizeMode: 'contain',
                width: 23,
                height: 23,
                marginLeft: 5,
                marginRight: 5
            },
            android: {
                width: 23,
                height: 23,
                marginLeft: 5,
                marginRight: 5,
                resizeMode: 'contain'
            },
        }),
    },
    input_search: {
        flex: 1,
        fontSize:  (Platform.OS === 'ios') ? 16 : 15,
        lineHeight : (Platform.OS === 'ios') ? 20 : 15,
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
});