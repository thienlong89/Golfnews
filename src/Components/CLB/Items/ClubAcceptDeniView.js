/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React from 'react';
import {
    StyleSheet,
    Text,
    View,
    Dimensions,
    Alert,
    Image,
    ListView
} from 'react-native';
import Touchable from 'react-native-platform-touchable';
import BaseComponent from '../../../Core/View/BaseComponent';
import Networking from '../../../Networking/Networking';
import ApiService from '../../../Networking/ApiService';
import {scale,verticalScale,fontSize} from '../../../Config/RatioScale';

// const TAG = "[Vhandicap-v1] ClubAcceptDeniView : ";
let screenWidth = Dimensions.get('window').width;
let buttonWidth = (screenWidth - scale(30)) / 2;


//type Props = {};
export default class ClubAcceptDeniView extends BaseComponent {
    constructor(props) {
        super(props);
    }

    static defaultProps = {
        invitation_id: '',
        acceptCallback: null,
        deniedCallback: null
    }

    onDeniedClick() {
        let self = this;
        let url = this.getConfig().getBaseUrl() + ApiService.club_deni_invite(this.props.invitation_id);
        this.loading.showLoading();
        Networking.httpRequestGet(url, (jsonData) => {
            self.loading.hideLoading();
            console.log("denied data : ", jsonData);
            if (jsonData.hasOwnProperty('error_code')) {
                let error_code = parseInt(jsonData['error_code']);
                if (error_code === 0) {
                    if (self.props.deniedCallback) {
                        self.props.deniedCallback();
                    }
                }
            }
        }, () => {
            //time out
            self.loading.hideLoading();
            self.popupTimeOut.showPopup();
        });
    }

    onAcceptClick() {
        let url = this.getConfig().getBaseUrl() + ApiService.club_accept_invitation(this.props.invitation_id);
        let self = this;
        this.loading.showLoading();
        Networking.httpRequestGet(url, (jsonData) => {
            self.loading.hideLoading();
            if (jsonData.hasOwnProperty('error_code')) {
                let error_code = parseInt(jsonData['error_code']);
                if (error_code === 0) {
                    if (self.props.acceptCallback) {
                        self.props.acceptCallback();
                    }
                }
            }
        }, () => {
            //time out
            self.loading.hideLoading();
            self.popupTimeOut.showPopup();
        })
    }

    render() {
        return (
            <View style={styles.container}>
                {this.renderLoading()}
                <Text allowFontScaling={global.isScaleFont} style={styles.text}>{this.t('secretary_add_member')}</Text>
                <View style={styles.body}>
                    <Touchable onPress={this.onAcceptClick.bind(this)}>
                        <View style={styles.button_accept}>
                            <Text allowFontScaling={global.isScaleFont} style={styles.text_accept}>{this.t('accept')}</Text>
                        </View>
                    </Touchable>
                    <Touchable onPress={this.onDeniedClick.bind(this)}>
                        <View style={styles.button_deni}>
                            <Text allowFontScaling={global.isScaleFont} style={styles.text_deni}>{this.t('denied')}</Text>
                        </View>
                    </Touchable>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        height: verticalScale(70),
        marginTop: verticalScale(10),
        justifyContent: 'center',
    },

    text: {
        flex: 1,
        marginLeft: scale(10),
        fontSize: fontSize(14),
        color: '#3b3b3b'
    },

    text_accept: {
        fontSize: fontSize(14),
        color: '#fff',
        textAlign: 'center'
    },

    text_deni: {
        fontSize: fontSize(14),
        color: '#5e5e5e',
        textAlign: 'center'
    },

    body: {
        height: verticalScale(50),
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },

    button_accept: {
        width: buttonWidth,
        height: verticalScale(30),
        backgroundColor: '#00aba7',
        marginLeft: scale(10),
        justifyContent: 'center',
        alignItems: 'center',
        borderColor: '#00aba7',
        borderWidth: verticalScale(1),
        borderRadius: verticalScale(3)
    },

    button_deni: {
        width: buttonWidth,
        height: verticalScale(30),
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderColor: '#b2b2b2',
        borderWidth: verticalScale(1),
        borderRadius: verticalScale(3),
        marginRight: scale(10)
    }
});