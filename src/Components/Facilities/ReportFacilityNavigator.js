import React from 'react';
import {
    StyleSheet,
    View,
    Dimensions,
    Platform,
    Text,
    Image
} from 'react-native';
//import Touchable from 'react-native-platform-touchable';
import BaseComponent from '../../Core/View/BaseComponent';
import ReportNewFacilityView from './Reviews/Screens/ReportNewFacilityScreen';
import ReportErrorFacilityScreen from './Reviews/Screens/ReportErrorFacilityScreen';

import { TabNavigator, TabBarTop } from 'react-navigation';
import I18n from 'react-native-i18n';
import { fontSize, scale, verticalScale } from '../../Config/RatioScale';
require('../../../I18n/I18n');
import ModalDropdown from 'react-native-modal-dropdown';

const screenWidth = Dimensions.get('window').width - scale(20);

let tabHeight = (Platform.OS === 'ios') ? verticalScale(48) : verticalScale(40);
let indicatorHeight = (Platform.OS === 'ios') ? tabHeight - 2 : tabHeight;

// const Tab = TabNavigator(
//     {
//         ReportNewFacilityView: {
//             screen: ReportNewFacilityView,
//             navigationOptions: {
//                 title: I18n.t('report_new_facility'),
//                 fontSize: 10,
//             }
//         },
//         ReportErrorFacilityScreen: {
//             screen: ReportErrorFacilityScreen,
//             navigationOptions: {
//                 title: I18n.t('report_error_facility'),
//                 fontSize: 10,
//             }
//         },
//     },
//     {
//         tabBarComponent: TabBarTop,
//         navigationOptions: ({ navigation }) => ({
//             header: null//<Header/>
//         }),
//         tabBarOptions: {
//             allowFontScaling: false,
//             activeTintColor: '#fff',
//             inactiveTintColor: '#00aba7',
//             upperCaseLabel: false,
//             activeBackgroundColor: '#00aba7',
//             inactiveBackgroundColor: 'fff',
//             showLabel: true,
//             //renderIndicator: () => null,
//             labelStyle: {
//                 fontSize: fontSize(16, scale(2)),
//                 //textAlignVertical : 'center',
//                 textAlign: 'center'
//             },

//             tabStyle: {
//                 justifyContent: 'center',
//                 alignItems: 'center',
//                 height: tabHeight,
//                 width: screenWidth / 2,
//                 justifyContent: 'center'
//             },
//             style: {
//                 backgroundColor: '#fff',
//                 height: tabHeight,
//                 width: screenWidth,
//                 marginLeft: scale(30),
//                 marginTop: verticalScale(16),
//                 marginRight: scale(30),
//                 marginBottom: verticalScale(10),
//                 borderColor: '#424242',
//                 borderWidth: 0.5,
//                 borderRadius: verticalScale(3),
//                 //alignItems : 'center'
//             },
//             //iconStyle: styles.iconStyle,
//             indicatorStyle: { backgroundColor: '#00aba7', height: indicatorHeight, marginTop: (Platform.OS === 'ios') ? 1 : null, marginBottom: (Platform.OS === 'ios') ? 1 : null, marginLeft: 0.5, alignSelf: 'center', marginRight: 0.5, width: screenWidth / 2 }
//         },
//         tabBarPosition: 'top',
//         animationEnabled: false,
//         swipeEnabled: true,
//         lazy: true,
//         backgroundColor: '#ffffff'
//     }
// );

export default class ReportFacilityNavigator extends BaseComponent {
    constructor(props) {
        super(props);

        this.state = {
            currentScreen: 0
        }
        this.onChangeScreen = this.onChangeScreen.bind(this);
    }

    onChangeScreen(data) {
        if (this.state.currentScreen != data) {
            this.setState({
                currentScreen: data
            })
        }

    }

    renderScreen(currentScreen) {
        if (parseInt(currentScreen) === 0) {
            return (
                <ReportNewFacilityView />
            )
        } else {
            return (
                <ReportErrorFacilityScreen />
            )
        }

    }

    render() {
        let {
            currentScreen
        } = this.state;

        return (
            <View style={{ flex: 1, backgroundColor: 'white' }}>
                <View style={styles.view_select_screen}>

                    <View style={{flex: 1, minHeight: scale(40), justifyContent: 'center'}}>
                        <ModalDropdown
                            options={[this.t('report_new_facility'), this.t('report_error_facility')]}
                            defaultValue={this.t('report_new_facility')}
                            // style={styles.dropdown_tee}
                            textStyle={styles.textStyle}
                            dropdownStyle={styles.dropdown_style}
                            onSelect={this.onChangeScreen}
                            renderRow={(rowData, index, isSelected) =>
                                <View style={{ backgroundColor: isSelected ? '#99E6FF' : '#CBCBCB' }}>
                                    <Text allowFontScaling={global.isScaleFont} style={styles.text_dropdown}>{rowData}</Text>
                                </View>
                            } />
                    </View>
                    <Image
                        style={styles.img_dropdown}
                        source={this.getResources().ic_arrow_down} />
                </View>

                {this.renderScreen(currentScreen)}

                {/* <Tab screenProps={{ parentNavigation: this.props.navigation }} /> */}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        flexDirection: 'column'
    },
    text_dropdown: {
        color: '#4D4D4D',
        fontSize: fontSize(15),
        padding: scale(10)
    },
    view_select_screen: {
        flexDirection: 'row',
        margin: scale(10),
        borderColor: '#CBCBCB',
        borderWidth: 1,
        borderRadius: scale(5),
        minHeight: scale(40),
        alignItems: 'center'
    },
    textStyle: {
        fontSize: fontSize(15, scale(2)),// 16,
        color: '#4D4D4D',
        marginLeft: scale(10),
        minHeight: scale(30),
        ...Platform.select({
            ios: {
                marginTop: scale(10),
            },
            android: {
                marginTop: scale(5),
            }
        }),
    },
    dropdown_style: {
        // borderColor: 'cornflowerblue',
        // marginRight: -scale(20),
        width: screenWidth,
        borderWidth: 2,
        borderRadius: 3,
        backgroundColor: '#CBCBCB'
    },
    img_dropdown: {
        width: scale(15),
        height: scale(15),
        marginRight: scale(10),
        resizeMode: 'contain'
    }
});