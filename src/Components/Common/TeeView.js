import React from 'react';
import {
    Platform,
    StyleSheet,
    Text,
    View,
    Image,
    TouchableOpacity
} from 'react-native';
import BaseComponent from '../../Core/View/BaseComponent';
import MyView from '../../Core/View/MyView';
import { scale, verticalScale, fontSize } from '../../Config/RatioScale';

export default class TeeView extends BaseComponent {

    static defaultProps = {
        teeObject: {}
    }

    constructor(props) {
        super(props);
        this.state = {
            teeObject: this.props.teeObject
        }
    }

    componentWillReceiveProps({ teeObject }) {
        this.setState({
            teeObject: teeObject
        })
    }

    render() {
        let { teeObject } = this.state;
        if (!teeObject) {
            return (
                // <View style={styles.container}>
                //     {/* <MyView style={[styles.view_tee_color, { backgroundColor: teeColor }]} hide={!this.getAppUtil().checkColorValid(teeColor)} /> */}
                //     <Text allowFontScaling={global.isScaleFont} style={styles.txt_tee_name}
                //         numberOfLines={1}>
                //         {'Tee'}
                //     </Text>
                //     <Image
                //         style={styles.img_arrow_down}
                //         source={this.getResources().ic_arrow_down}
                //     />
                // </View>
                null
            );
        }

        let teeName = teeObject.tee || teeObject.name;
        let teeColor = teeObject.color;
        if (teeName) {
            return (
                // <TouchableOpacity
                //     onPress={this.onChangeTeePress.bind(this)}>
                <View style={styles.container}>
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

                // </TouchableOpacity>
            );
        } else {
            // return (
            //     <View style={styles.container}>
            //         {/* <MyView style={[styles.view_tee_color, { backgroundColor: teeColor }]} hide={!this.getAppUtil().checkColorValid(teeColor)} /> */}
            //         <Text allowFontScaling={global.isScaleFont} style={styles.txt_tee_name}
            //             numberOfLines={1}>
            //             {'Tee'}
            //         </Text>
            //         <Image
            //             style={styles.img_arrow_down}
            //             source={this.getResources().ic_arrow_down}
            //         />
            //     </View>
            // );
            return null;
        }

    }

    setTeeSelected(teeSelected = {}) {
        this.setState({
            teeObject: teeSelected
        })
    }

    onChangeTeePress() {
        if (this.props.onChangeTeePress) {
            this.props.onChangeTeePress();
        }
    }

}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingLeft: scale(5),
        paddingRight: scale(5),
        minWidth: scale(50)
    },
    view_tee_color: {
        width: verticalScale(15),
        height: verticalScale(15),
        borderColor: '#919191',
        borderWidth: 0.5
    },
    img_arrow_down: {
        width: verticalScale(10),
        height: verticalScale(10),
        resizeMode: 'contain',
        marginTop: verticalScale(3),
        tintColor: '#CECECE'
    },
    txt_tee_name: {
        color: '#424242',
        fontSize: fontSize(13, -scale(1)),
    }
});