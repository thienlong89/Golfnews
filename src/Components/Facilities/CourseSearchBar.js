import React from 'react';
import BaseComponent from '../../Core/View/BaseComponent';
import { StyleSheet, View, Image, TextInput, Dimensions } from 'react-native';
import Touchable from 'react-native-platform-touchable';
import TeeViewHorizontal from '../Common/TeeViewHorizontal';
import { scale, verticalScale, fontSize } from '../../Config/RatioScale';


export default class CourseSearchBar extends BaseComponent {

    static defaultProps = {
        isSearching: false
    }

    constructor(props) {
        super(props);
        this.state = {
            keySearch: ''
        }
        this.onChangeTeeAll = this.onChangeTeeAll.bind(this);
        this.onChangeSearchText = this.onChangeSearchText.bind(this);
        this.onFocusSearch = this.onFocusSearch.bind(this);
    }

    render() {
        return (
            <View style={{ height: verticalScale(40), flexDirection: 'row', marginLeft: 5, marginRight: 5, alignItems: 'center', marginTop: 10, marginBottom: 10 }}>
                <View style={styles.search_course_group}>
                    <Image
                        style={styles.icon_search}
                        source={this.getResources().ic_Search}
                    />

                    <TextInput allowFontScaling={global.isScaleFont}
                        ref={(inputText) => { this.inputText = inputText; }}
                        style={styles.input_search}
                        placeholder={this.t('select_course')}
                        placeholderTextColor='#a1a1a1'
                        underlineColorAndroid='rgba(0,0,0,0)'
                        onChangeText={this.onChangeSearchText}
                        onFocus={this.onFocusSearch}>
                        {/* value={this.props.isSearching ? this.state.keySearch : ''} */}

                    </TextInput>
                    {/* <Touchable style={styles.touchable_check_course}> */}
                    {/* <View style={styles.bg_down_arrow}> */}
                    <Image
                        style={{ resizeMode: 'contain', width: this.getRatioAspect().scale(40), height: this.getRatioAspect().verticalScale(40) }}
                        source={this.getResources().s_normal}
                    />
                    {/* </View> */}
                    {/* </Touchable> */}
                </View>
                <Touchable
                    onPress={this.onChangeTeeAll}>
                    <TeeViewHorizontal
                        ref={(refTeeViewHorizontal) => { this.refTeeViewHorizontal = refTeeViewHorizontal; }}
                    />
                </Touchable>
            </View>
        );
    }

    setTeeSelected(teeObject = {}) {
        this.refTeeViewHorizontal.setTeeSelected(teeObject);
    }

    onChangeTeeAll() {
        if (this.props.onChangeTeeAll) {
            this.props.onChangeTeeAll();
        }
    }

    onBlur() {
        if (this.inputText) {
            this.inputText.blur();
            this.inputText.clear();
        }
    }

    onChangeSearchText(input) {
        let { onChangeText } = this.props;
        if (onChangeText)
            onChangeText(input);
        // this.setState({
        //     keySearch: input
        // })
    }

    onFocusSearch() {
        // this.setState({
        //     keySearch: ''
        // })
        this.inputText.clear();
        let { onFocusSearch } = this.props;
        if (onFocusSearch)
            onFocusSearch('');
        this.onBlur();
    }

}

const styles = StyleSheet.create({
    container: {
        paddingBottom: scale(10),
        backgroundColor: '#FFFFFF'
    },

    search_course_group: {
        // height: verticalScale(40),
        flex: 1,
        borderColor: '#c7c7c7',
        borderWidth: verticalScale(0.5),
        borderRadius: verticalScale(5),
        // margin: verticalScale(10),
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF'
    },
    icon_search: {
        //flex: 0.1,
        height: verticalScale(20),
        width: scale(20),
        marginLeft: scale(10),
        resizeMode: 'contain'
    },
    input_search: {
        flex: 1,
        paddingLeft: scale(10),
        paddingTop: 0,
        paddingBottom: 0,
        fontSize: fontSize(14),// 14,
        lineHeight: fontSize(18, 2),// verticalScale(18)
    },
    touchable_check_course: {
        // flex: 0.1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    bg_down_arrow: {
        flex: 1,
        padding: 0.5,
        justifyContent: 'center',
        alignItems: 'center'
    }
});