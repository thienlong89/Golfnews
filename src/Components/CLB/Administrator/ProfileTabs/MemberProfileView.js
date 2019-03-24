import React from 'react';
import {
    Platform,
    StyleSheet,
    Text,
    View,
    ScrollView
} from 'react-native';
import Touchable from 'react-native-platform-touchable';
import BaseComponent from '../../../../Core/View/BaseComponent';
import Networking from '../../../../Networking/Networking';
import ApiService from '../../../../Networking/ApiService';
import { scale, verticalScale, moderateScale, fontSize } from '../../../../Config/RatioScale';

export default class MemberProfileView extends BaseComponent {

    static defaultProps = {

    }

    constructor(props) {
        super(props);
        let { player } = this.props.screenProps.navigation.state.params;
        this.player = player;
        this.state = {

        }

    }

    render() {
        if (!this.player) return null;
        return (
            <ScrollView style={styles.container}>
                <View style={styles.view_item}>
                    <Text allowFontScaling={global.isScaleFont} style={styles.txt_label}>{this.t('name')}</Text>
                    <Text allowFontScaling={global.isScaleFont} style={styles.txt_value}>{this.player.getFullName()}</Text>
                    <View style={styles.view_line} />
                </View>
                <View style={styles.view_item}>
                    <Text allowFontScaling={global.isScaleFont} style={styles.txt_label}>{this.t('birthday')}</Text>
                    <Text allowFontScaling={global.isScaleFont} style={styles.txt_value}>{this.player.getDisplayBirthday()}</Text>
                    <View style={styles.view_line} />
                </View>
                <View style={styles.view_item}>
                    <Text allowFontScaling={global.isScaleFont} style={styles.txt_label}>{this.t('gender')}</Text>
                    <Text allowFontScaling={global.isScaleFont} style={styles.txt_value}>{this.player.getGender() === 0 ? this.t('male') : this.t('female')}</Text>
                    <View style={styles.view_line} />
                </View>
                <View style={styles.view_item}>
                    <Text allowFontScaling={global.isScaleFont} style={styles.txt_label}>{this.t('country')}</Text>
                    <Text allowFontScaling={global.isScaleFont} style={styles.txt_value}>{this.player.getCountry()}</Text>
                    <View style={styles.view_line} />
                </View>
                <View style={styles.view_item}>
                    <Text allowFontScaling={global.isScaleFont} style={styles.txt_label}>{this.t('city')}</Text>
                    <Text allowFontScaling={global.isScaleFont} style={styles.txt_value}>{this.player.getCity()}</Text>
                    <View style={styles.view_line} />
                </View>
                <View style={styles.view_item}>
                    <Text allowFontScaling={global.isScaleFont} style={styles.txt_label}>{this.t('phone_number')}</Text>
                    <Text allowFontScaling={global.isScaleFont} style={styles.txt_value}>{this.player.getPhone()}</Text>
                    <View style={styles.view_line} />
                </View>
                
                {this.renderMessageBar()}
            </ScrollView>
        );
    }



    componentDidMount() {
        this.registerMessageBar();
    }

    componentWillUnmount() {
        this.unregisterMessageBar();

    }


}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        flexDirection: 'column',
        padding: scale(10),
        // marginTop: scale(15)
    },
    view_item: {
        marginTop: scale(25)
    },
    txt_label: {
        fontSize: fontSize(15),
        color: '#B2B2B2'
    },
    txt_value: {
        fontSize: fontSize(18),
        fontWeight: '400',
        color: '#242424',
        marginTop: scale(3)
    },
    view_line: {
        height: 0.8,
        backgroundColor: '#D6D4D4',
        marginTop: scale(3)
    }
});