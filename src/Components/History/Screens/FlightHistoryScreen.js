import React from 'react';
import {StyleSheet, Text, View,Dimensions } from 'react-native';
import Touchable from 'react-native-platform-touchable';
import BaseComponent from '../../../Core/View/BaseComponent';
import FlightHistoryList from '../../PlayerInfo/FlightHistoryList';
import HeaderView from '../../Common/HeaderView';

import {scale, verticalScale, fontSize} from '../../../Config/RatioScale';

export default class FlightHistoryScreen extends BaseComponent {

    constructor(props) {
        super(props);
        this.onPressStatistical = this.onPressStatistical.bind(this);
        this.showMessange = this.showMessange.bind(this);
        this.puid = this.props.screenProps.puid;
    }

    componentDidMount() {
        this.registerMessageBar();
    }

    componentWillUnmount() {
        this.unregisterMessageBar();
    }

    showMessange(msg) {
        this.showErrorMsg(msg);
    }

    render() {
        return (
            <View style={styles.container}>
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
        alignItems : 'flex-end'
    },
    text_title: {
        color: '#979797',
        fontWeight: 'bold',
        fontSize: fontSize(17,1),// 17,
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