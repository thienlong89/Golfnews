import React from 'react';
import { View, Text, Dimensions, Image, StyleSheet } from 'react-native';
import BaseComponent from '../../../Core/View/BaseComponent';
import { scale, verticalScale, fontSize } from '../../../Config/RatioScale';
import CountText from '../../Facilities/Reviews/Items/TextCount';
import Touchable from 'react-native-platform-touchable';
import ModalDropdown from 'react-native-modal-dropdown';
import MyView from '../../../Core/View/MyView';
let { width } = Dimensions.get('window');
let line_w = 2 * width / 3;
import I18n from 'react-native-i18n';
import CustomModalDropdown from '../../CustomComponent/CustomModalDropdow';
import FilterScreen from '../../Notification/Screens/FilterScreen';
// import BasePureComponent from '../../../Core/View/BasePureComponent';

// const options = [
//     I18n.t('all'),
//     I18n.t('flight_key'),
//     I18n.t('event_key'),
//     I18n.t('group'),
//     I18n.t('commen_key'),
//     I18n.t('friend'),
//     I18n.t('club_key')
// ]

// const keys = [
//     'All',
//     'Flight',
//     'Event',
//     'Group',
//     'Commend',
//     'Friend',
//     'Club'
// ]

export default class HeaderScreen extends BaseComponent {
    constructor(props) {
        super(props);
        this.countFinishFlight = 0;
        this.onSelect = this.onSelect.bind(this);

        this.filterCallback = null;
        this.state = {
            color: 'red'
        }

        this.onSelect = this.onSelect.bind(this);
        let { options } = this.props;
        this.options = options;
    }

    getCountUnFinishFlight() {
        return this.countFinishFlight > 0 ? `(${this.countFinishFlight})` : '';
    }

    updateCount(_count) {
        this.countFinishFlight = _count;
        if (this.refCountFinish) {
            this.refCountFinish.updateValue(this.getCountUnFinishFlight());
        }
    }

    /**
     * back lai tu man hinh filter screen
     */
    onBackData(key, value) {
        // let value = options[index];
        // let key = keys[index];
        if(key !== 'choosen_is_readed'){
            this.refCountFinish.updateValue(` (${value.toUpperCase()})`);
        }
        if (this.filterCallback) {
            this.filterCallback(key);
        }
    }

    onSelect(index) {
        // this.refDropdown.hide();
        // let value = options[index];
        // let key = keys[index];
        // this.refCountFinish.updateValue(`(${value})`);
        // if (this.filterCallback) {
        //     this.filterCallback(key);
        // }

        if (this.filterScreen) {
            if (this.options) {
                this.filterScreen.show(this.options);
            }else{
                this.filterScreen.show();
            }
        }
    }

    componentDidMount() {
        let { show } = this.props;
        if (show) {
            this.refCountFinish.updateValue(` (${this.t('all').toUpperCase()})`);
        }
        if (this.filterScreen) {
            this.filterScreen.callbackData = this.onBackData.bind(this);
        }
    }

    render() {
        let { title, show, color } = this.props;
        let hide = show ? false : true;
        // let{color} = this.state;
        return (
            <View style={{ alignItems: 'center', backgroundColor: 'white', height: verticalScale(35), justifyContent: 'space-between' }}>
                <View style={{ width: line_w, height: 1, alignSelf: 'center', backgroundColor: '#dedede' }}></View>
                <View style={{ justifyContent: 'center', alignItems: 'center', width: width }}>
                    <Text allowFontScaling={global.isScaleFont} style={{ fontSize: fontSize(14), fontWeight: 'bold', color: '#00aba7' }}>{title}
                        <CountText ref={(refCountFinish) => { this.refCountFinish = refCountFinish; }} style={{ color: color }} count={this.getCountUnFinishFlight()} />
                    </Text>
                    {/* <View style={{ position: 'absolute', top: verticalScale(5), right: scale(10),backgroundColor : 'red' }}>
                        <Image style={{ position: 'absolute', top: 0, right: 0, resizeMode: 'contain', width: scale(40), height: verticalScale(20) }}
                            source={this.getResources().ic_option}
                        />
                    </View> */}
                    <MyView style={styles.dropdow} hide={hide}>
                        <Text allowFontScaling={global.isScaleFont} style={styles.dropdown_text} onPress={this.onSelect}>{'● ● ●'}</Text>
                        {/* <CustomModalDropdown
                            options={options}
                            defaultValue={'●●●'}
                            ref={(refDropdown) => { this.refDropdown = refDropdown; }}
                            style={styles.view}
                            textStyle={styles.dropdown_text}
                            dropdownStyle={styles.dropdown_style}
                            // onSelect={this.onSelect}
                            renderRow={(rowData, index, isSelected) =>
                                <View style={{ backgroundColor: isSelected ? '#99E6FF' : '#FFFFFF', paddingLeft: scale(10), paddingBottom: verticalScale(10), paddingTop: verticalScale(10) }}>
                                    <Touchable onPress={() => this.onSelect(index)}>
                                        <Text allowFontScaling={global.isScaleFont} style={styles.dropdown_text}>{rowData}</Text>
                                    </Touchable>
                                </View>
                            } /> */}
                    </MyView>
                </View>
                <View style={{ height: 1, width: width, backgroundColor: '#DEDEDE' }}></View>
                <FilterScreen ref={(filterScreen) => { this.filterScreen = filterScreen; }} />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    dropdow: {
        position: 'absolute',
        right: scale(5),
        // width: scale(80),
        // height: verticalScale(20),
        // borderRadius : 2,
        // borderWidth : 1,
        // borderColor : '#747474'
    },

    view: {
        position: 'absolute',
        top: 0,
        right: 0,
        width: scale(80),
        height: verticalScale(20),
    },

    dropdown_text: {
        fontSize: fontSize(7, -scale(3)),
        color: '#626262',
        padding: 10,
    },
    dropdown_style: {
        // borderColor: 'cornflowerblue',
        marginRight: scale(30),
        borderWidth: 2,
        borderRadius: 3,
        borderColor: '#000',
        width: scale(120),
        // height : verticalScale(300),
        marginTop: -20,
    },
});