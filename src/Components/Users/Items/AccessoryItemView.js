import React from 'react';
import {
    Platform,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import Touchable from 'react-native-platform-touchable';
import BaseComponent from '../../../Core/View/BaseComponent';
import { scale, verticalScale, moderateScale } from '../../../Config/RatioScale';
import * as Progress from 'react-native-progress';
import { createImageProgress } from 'react-native-image-progress';
import FastImage from 'react-native-fast-image';
const Images = createImageProgress(FastImage);

export default class AccessoryItemView extends BaseComponent {

    static defaultProps = {
        accessory: '',
        index: 0,
        isSelected: false
    }

    constructor(props) {
        super(props);

        this.state = {

        }
        this.onItemPress = this.onItemPress.bind(this);
    }

    render() {
        let {
            accessory
        } = this.props;
        if (accessory && accessory.logo_url) {
            return (
                <Touchable style={styles.container}
                    onPress={this.onItemPress}>
                    <Images
                        style={styles.img_logo}
                        // imageStyle={{
                        //     width: width,
                        //     height: height,
                        //     borderRadius: width / 2
                        // }}
                        source={{
                            uri: accessory.logo_url,
                        }}
                        resizeMode={FastImage.resizeMode.contain}
                        indicator={Progress.Circle}
                    />
                </Touchable>
            );
        }
        return null;
    }

    onItemPress() {
        let {
            accessory,
            onItemPress
        } = this.props;
        if (onItemPress) {
            onItemPress(accessory);
        }
    }

}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#FFFFFF',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
    },
    img_logo: {
        width: scale(100),
        height: scale(50),
    }
});