import React from 'react';
import {
    Platform,
    StyleSheet,
    Text,
    View,
    Image,
    TouchableWithoutFeedback
} from 'react-native';
import Touchable from 'react-native-platform-touchable';
import BasePureComponent from '../../../Core/View/BasePureComponent';
import { scale, verticalScale, fontSize } from '../../../Config/RatioScale';

export default class HideFlightSetting extends BasePureComponent {

    static defaultProps = {

    }

    constructor(props) {
        super(props);
        this.state = {
            isHideFlight: false
        }
        this.onSettingPress = this.onSettingPress.bind(this);
    }

    render() {
        let { isHideFlight } = this.state;

        return (
            <View style={[styles.container, styles.border_shadow]}>
                <View style={{ flex: 1 }}>
                    <Text allowFontScaling={global.isScaleFont} style={styles.txt_title}>{this.t('hide_this_flight_title')}</Text>
                    <Text allowFontScaling={global.isScaleFont} style={styles.txt_sub_title}>{this.t('hide_this_flight_sub')}</Text>
                </View>
                <TouchableWithoutFeedback onPress={this.onSettingPress}>
                    <Image
                        style={styles.img_setting}
                        source={isHideFlight ? this.getResources().ic_on : this.getResources().ic_off}
                    />
                </TouchableWithoutFeedback>
            </View>
        );
    }


    onSettingPress() {
        let { isHideFlight } = this.state;
        this.setState({
            isHideFlight: !isHideFlight
        }, () => {
            if(this.props.isHideFlight){
                this.props.isHideFlight(this.state.isHideFlight);
            }
        })
    }


}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        flexDirection: 'row',
        paddingLeft: scale(10),
        paddingRight: scale(10),
        paddingTop: scale(10),
        paddingBottom: scale(10),
        alignItems: 'center',
        marginTop: scale(10),
        marginBottom: scale(10)
    },
    txt_title: {
        fontSize: fontSize(16),
        color: '#5B5A5A',
        fontWeight: '500'
    },
    txt_sub_title: {
        fontSize: fontSize(13),
        color: '#979797',
        fontStyle: 'italic'
    },
    img_setting: {
        width: scale(50),
        height: verticalScale(30),
        resizeMode: 'contain',
    },
    border_shadow: {
        elevation: 4,
        shadowOffset: { width: 0, height: -3 },
        shadowColor: "grey",
        shadowOpacity: 1,
        shadowRadius: scale(8),
        borderRadius: scale(8),
        margin: scale(10)
      }
});