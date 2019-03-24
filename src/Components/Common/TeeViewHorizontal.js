import React from 'react';
import {
    Platform,
    StyleSheet,
    Text,
    View,
    Image
} from 'react-native';
import Touchable from 'react-native-platform-touchable';
import BaseComponent from '../../Core/View/BaseComponent';
import MyView from '../../Core/View/MyView';
import { scale, verticalScale, fontSize } from '../../Config/RatioScale';


export default class TeeViewHorizontal extends BaseComponent {

    static defaultProps = {
        teeObject: {}
    }

    constructor(props) {
        super(props);
        this.state = {
            teeObject: this.props.teeObject
        }
    }

    render() {
        let { teeObject } = this.state;
        this.Logger().log('................................. teeObject', teeObject);
        let { isNoneBoder } = this.props;
        if (teeObject) {
            let teeName = teeObject.tee;
            let teeColor = teeObject.color;

            if (teeName) {
                return (
                    // <Touchable style={{minHeight: 40}}
                    //     onPress={this.onChangeTeePress.bind(this)}>
                    <View style={isNoneBoder ? styles.container_none_border : styles.container}>
                        <MyView style={[styles.view_tee_color, { backgroundColor: teeColor }]} hide={!this.getAppUtil().checkColorValid(teeColor)} />
                        <Text allowFontScaling={global.isScaleFont} style={styles.txt_tee_name}
                            numberOfLines={1}>
                            {teeName}
                        </Text>
                        <Image
                            style={styles.img_arrow_down}
                            source={this.getResources().ic_arrow_down}
                        />
                    </View>
                    // </Touchable>
                );
            } else {
                return (
                    <View style={isNoneBoder ? styles.container_none_border : styles.container}>
                        {/* <MyView style={[styles.view_tee_color, { backgroundColor: teeColor }]} hide={!this.getAppUtil().checkColorValid(teeColor)} /> */}
                        <Text allowFontScaling={global.isScaleFont} style={styles.txt_tee_name}>
                            {'Tee'}
                        </Text>
                        <Image
                            style={styles.img_arrow_down}
                            source={this.getResources().ic_arrow_down}
                        />
                    </View>
                )
            }
        } else {
            return (
                <View style={isNoneBoder ? styles.container_none_border : styles.container}>
                    {/* <MyView style={[styles.view_tee_color, { backgroundColor: teeColor }]} hide={!this.getAppUtil().checkColorValid(teeColor)} /> */}
                    <Text allowFontScaling={global.isScaleFont} style={styles.txt_tee_name}>
                        {'Tee'}
                    </Text>
                    <Image
                        style={styles.img_arrow_down}
                        source={this.getResources().ic_arrow_down}
                    />
                </View>
            );
        }
    }

    setTeeSelected(teeSelected) {
        console.log('setTeeSelected', teeSelected)
        this.setState({
            teeObject: teeSelected
        });
    }

    onChangeTeePress() {
        if (this.props.onPress) {
            this.props.onPress();
        }
    }

}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        height: verticalScale(40),
        minWidth: scale(40),
        marginLeft: scale(10),
        borderColor: '#C7C7C7',
        borderWidth: Platform.OS === 'android' ? 0.5 : 1,
        borderRadius: verticalScale(5)
    },

    container_none_border: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        height: verticalScale(40),
        minWidth: scale(40),
        marginLeft: scale(10),
        // borderColor: '#C7C7C7',
        // borderWidth: 0.5,
        // borderRadius: 5
    },

    view_tee_color: {
        width: verticalScale(15),
        height: verticalScale(15),
        borderColor: '#919191',
        borderWidth: Platform.OS === 'android' ? 0.5 : 1,
        marginLeft: scale(5)
    },
    img_arrow_down: {
        width: verticalScale(10),
        height: verticalScale(10),
        resizeMode: 'contain',
        marginTop: verticalScale(3),
        marginRight: scale(5),
        tintColor: '#CECECE'
    },
    txt_tee_name: {
        color: '#424242',
        fontSize: fontSize(13, -scale(1)),
        marginLeft: scale(5),
        marginRight: scale(5)
    }
});