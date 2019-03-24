import React from 'react';
import {
    Platform,
    StyleSheet,
    Text,
    View,
    Dimensions,
    Image
} from 'react-native';
import Touchable from 'react-native-platform-touchable';
import BaseComponent from '../../../Core/View/BaseComponent';
import { scale, verticalScale, moderateScale } from '../../../Config/RatioScale';
import * as Progress from 'react-native-progress';
import { createImageProgress } from 'react-native-image-progress';
import FastImage from 'react-native-fast-image';
const Images = createImageProgress(FastImage);

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

export default class ImageFlightItemFull extends BaseComponent {

    static defaultProps = {
        uri: '',
        data: null
    }

    constructor(props) {
        super(props);

        this.state = {
            isLoadEnd: false,
            width: 0,
            height: 0
        }
        this.onOpenImage = this.onOpenImage.bind(this);

    }

    render() {
        let {
            uri
        } = this.props;
        if (!uri) return null;
        let {
            width,
            height
        } = this.state;
        return (
            <Touchable style={styles.container}
                onPress={this.onOpenImage}>
                <Images
                    style={[styles.image_score, { width: width, height: height }]}
                    source={{
                        uri: uri
                    }}
                    resizeMode={FastImage.resizeMode.cover}
                    indicator={Progress.Circle}
                />

            </Touchable>
        );
    }

    componentDidMount() {
        Image.getSize(this.props.uri, (width, height) => {
            console.log('ImageFlightItemFull', width, height)
            this.setState({
                width: screenWidth,
                height: screenWidth * height / width
            })
        });
    }

    onOpenImage() {
        let {
            uri,
            data,
            onOpenImage
        } = this.props;
        if (onOpenImage) {
            onOpenImage(uri, data);
        }
    }

}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#FFFFFF',
    },
    image_score: {
        resizeMode: 'contain'
    }
});