import React from 'react';
import {
    StyleSheet,
    Text,
    View,
    Dimensions,
    BackHandler
} from 'react-native';
import Touchable from 'react-native-platform-touchable';
import BaseComponent from '../../Core/View/BaseComponent';
import FlightHistoryList from '../PlayerInfo/FlightHistoryList';
import HeaderView from '../HeaderView';

import { scale, verticalScale, fontSize } from '../../Config/RatioScale';
let { width, height } = Dimensions.get('window');

export default class FlightHistoryView extends BaseComponent {

    constructor(props) {
        super(props);
        this.onPressStatistical = this.onPressStatistical.bind(this);
        this.showMessange = this.showMessange.bind(this);
        let { params } = this.props.navigation.state;
        if (params && params.puid) {
            this.puid = params.puid;
        } else {
            this.puid = this.getUserInfo().getUserId();
        }
        this.state = {

        }
        this.onBackPress = this.onBackPress.bind(this);
    }

    componentDidMount() {
        this.rotateToPortrait();
        this.registerMessageBar();
        this.handleHardwareBackPress();
    }

    componentWillUnmount() {
        this.unregisterMessageBar();
        if (this.backHandler) {
            this.backHandler.remove();
        }
    }

    handleHardwareBackPress() {
        let self = this;
        this.backHandler = BackHandler.addEventListener('hardwareBackPress', function () {
            self.onBackPress();
            return true;
        });
    }

    showMessange(msg) {
        this.showErrorMsg(msg);
    }

    render() {
        return (
            <View style={styles.container}>
                {/* <HeaderView ref={(headerView) => { this.headerView = headerView; }} /> */}
                <HeaderView
                    title={this.t('flight_history')}
                    handleBackPress={this.onBackPress} />
                {/* <View style={styles.title_group}>
                    <Text allowFontScaling={global.isScaleFont} style={styles.text_title}>{this.t('flight_history')}</Text>

                    <Touchable style={styles.touch_statistical} onPress={this.onPressStatistical}>
                        <Text allowFontScaling={global.isScaleFont} style={styles.text_statistical}>{this.t('statistical')}</Text>
                    </Touchable>
                </View> */}
                <View style={styles.view_history_list}>
                    <FlightHistoryList showErrorMsgCallback={this.showMessange}
                        parentNavigator={this.props.navigation}
                        puid={this.puid ? this.puid : ''} />
                </View>
                {this.renderMessageBar()}
            </View>
        );
    }

    onBackPress() {
        let { navigation } = this.props;
        if (navigation) {
            navigation.goBack();
        }
        return true;
    }

    /**
     * Mở màn hình thông kê
     */
    onPressStatistical() {
        //console.log('onPressStatistical');
        let { navigation } = this.props;
        if (navigation) {
            navigation.navigate('statistical');
        }
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF'
    },
    title_group: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginLeft: scale(10),
        marginRight: scale(10),
        marginTop: verticalScale(10),
        alignItems: 'flex-end'
    },
    text_title: {
        color: '#979797',
        fontWeight: 'bold',
        fontSize: fontSize(17, 1),// 17,
        //alignSelf: 'flex-end'
    },
    touch_statistical: {
        backgroundColor: '#FFFFFF',
        borderColor: '#4294F7',
        borderWidth: 1,
        paddingTop: verticalScale(10),
        paddingBottom: verticalScale(10),
        paddingLeft: scale(15),
        paddingRight: scale(15)
    },
    text_statistical: {
        color: '#4294F7',
        fontSize: fontSize(16),// 16
    },
    view_history_list: {
        marginTop: verticalScale(15),
        flex: 1
    }

});