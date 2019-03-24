import React from 'react';
import BaseComponent from "../../../../Core/View/BaseComponent";
import {
    View,
    Image,
    TextInput,
    StyleSheet,
    Platform
} from 'react-native';
import MyView from '../../../../Core/View/MyView';
import { scale, verticalScale, fontSize } from '../../../../Config/RatioScale';
import Touchable from 'react-native-platform-touchable';

export default class SearchFacilityView extends BaseComponent {

    static defaultProps = {
        isShow: false
    }

    constructor(props) {
        super(props);
        this.state = {
            isShow: this.props.isShow,
            input: ''
        }
        this.onCourseDropDownClick = this.onCourseDropDownClick.bind(this);
        this.onChangeInputSearchFacility = this.onChangeInputSearchFacility.bind(this);
        this.onSearchFacilityFocus = this.onSearchFacilityFocus.bind(this);
    }

    hide() {
        // if(this.textInputFacility) this.textInputFacility.clear();
        return;
        // let { isShow } = this.state;
        // if (!isShow) return;
        // this.clear();
        // this.setState({
        //     isShow: false
        // });
    }

    show() {
        let { isShow } = this.state;
        if (isShow) return;
        this.setState({
            isShow: true
        });
    }

    onCourseDropDownClick() {
        let { onCourseDropDownClick } = this.props;
        if (onCourseDropDownClick) {
            onCourseDropDownClick();
        }
    }

    onSearchFacilityFocus() {
        let { onSearchFacilityFocus } = this.props;
        if (onSearchFacilityFocus) {
            onSearchFacilityFocus();
        }
    }

    onChangeInputSearchFacility(text) {
        let { onChangeInputSearchFacility } = this.props;
        this.setState({
            input: text
        }, () => {
            if (onChangeInputSearchFacility) {
                onChangeInputSearchFacility(text);
            }
        })

    }

    clear() {
        if (!this.textInputFacility) return;
        this.textInputFacility.clear();
    }

    clearFocus() {
        if (!this.textInputFacility) return;
        this.textInputFacility.blur();
    }

    setValue(value = ''){
        this.setState({
            input: value
        })
    }

    render() {
        let { isShow, input } = this.state;
        return (
            <MyView style={{ flexDirection: 'row', padding: 0.5, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F5F5F5', borderColor: '#DBDBDB', borderWidth: 0.5, borderRadius: 5 }} hide={!isShow}>
                <Image
                    style={styles.icon_search}
                    source={this.getResources().ic_Search} />
                <View style={styles.input_search}>
                    <TextInput allowFontScaling={global.isScaleFont} style={styles.text_input_facility}
                        ref={(textInputFacility) => { this.textInputFacility = textInputFacility }}
                        placeholderTextColor='#A1A1A1'
                        placeholder={this.t('golf_course')}
                        underlineColorAndroid='rgba(0,0,0,0)'
                        value={input}
                        onFocus={this.onSearchFacilityFocus}
                        onChangeText={this.onChangeInputSearchFacility}>
                    </TextInput>
                </View>

                <Touchable onPress={this.onCourseDropDownClick}>
                    <Image
                        style={styles.arrow_down_search}
                        source={this.getResources().ic_arrow_down}
                    />
                </Touchable>
            </MyView>
        );
    }
}

const styles = StyleSheet.create({
    text_input_facility: {
        height: verticalScale(37.5),
        color: '#A1A1A1',
        fontSize: fontSize(17),// 17,
        lineHeight: fontSize(21, verticalScale(4)),// 21,
        paddingLeft: scale(5),
        paddingTop: 0,
        paddingBottom: 0
    },

    input_search: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        height: verticalScale(37.5)
    },

    icon_search: {
        ...Platform.select({
            ios: {
                width: scale(23),
                height: verticalScale(23),
                marginLeft: 5,
                marginRight: 5
            },
            android: {
                width: scale(23),
                height: verticalScale(23),
                marginLeft: 5,
                marginRight: 5
            }
        }),
        resizeMode: 'contain',
        // backgroundColor: '#FFFFFF',
        borderColor: '#DBDBDB',
        marginBottom: 1
    },

    arrow_down_search: {
        ...Platform.select({
            ios: {
                width: scale(20),
                height: verticalScale(20),
                marginLeft: 5,
                marginRight: 5
            },
            android: {
                width: scale(20),
                height: verticalScale(20),
                marginLeft: 5,
                marginRight: 5
            }
        }),
        resizeMode: 'contain',
        borderColor: '#DBDBDB'
    },
});