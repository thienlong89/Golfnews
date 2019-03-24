import React, { PureComponent } from 'react';
import {
    Platform,
    StyleSheet,
    Text,
    View,
    Dimensions,
    Image
} from 'react-native';
import Touchable from 'react-native-platform-touchable';

const { width, height } = Dimensions.get('window');

export default class AutoScaleLocalImage extends PureComponent {

    static defaultProps = {
        uri: '',
        customStyle: {},
        screenWidth: width,
        screenHeight: height,
        isResource: false
    }

    constructor(props) {
        super(props);

        this.state = {
            isLoadEnd: false,
            imgWidth: 0,
            imgHeight: 0,
            uri: this.props.uri
        }
        this.onOpenImage = this.onOpenImage.bind(this);

    }



    render() {
        let {
            customStyle,
            isResource
        } = this.props;
        let {
            imgWidth,
            imgHeight,
            uri
        } = this.state;
        console.log('AutoScaleLocalImage.render', uri)
        if (!uri) return null;
        return (
            <Touchable style={[styles.container, customStyle]}
                onPress={this.onOpenImage}>
                <Image
                    style={[styles.image_score, { width: imgWidth, height: imgHeight }]}
                    source={isResource ? uri : {
                        uri: uri
                    }}
                />

            </Touchable>
        );
    }

    componentDidMount() {
        let {
            screenWidth,
        } = this.props;
        Image.getSize(this.state.uri, (width, height) => {
            if (width > 0 && height > 0) {
                return {
                    imgWidth: screenWidth,
                    imgHeight: screenWidth * height / width
                }
            }
        });
    }

    setNewUri(uri) {
        let {
            screenWidth,
        } = this.props;
        Image.getSize(uri, (width, height) => {
            console.log('setNewUri.size', width, height)
            if (width > 0 && height > 0) {
                this.setState({
                    uri: uri,
                    imgWidth: screenWidth,
                    imgHeight: screenWidth * height / width
                })
            }
        });
    }

    onOpenImage() {
        let {
            onOpenImage,
        } = this.props;
        if (onOpenImage) {
            onOpenImage(this.state.uri);
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