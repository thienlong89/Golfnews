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
import CustomAvatar from '../../Common/CustomAvatar';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

export default class TraditionalImageItem extends BaseComponent {

    static defaultProps = {
        uri: '',
        player: ''
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
            uri,
            player
        } = this.props;
        if (!uri) return null;
        let {
            width,
            height
        } = this.state;
        return (
            <Touchable style={styles.container}
                onPress={this.onOpenImage}>
                <View>
                    <Images
                        style={[styles.image_score, { width: width, height: height }]}
                        source={{
                            uri: uri
                        }}
                        resizeMode={FastImage.resizeMode.contain}
                        indicator={Progress.Circle}
                    />
                    {/* <Image
                        style={[styles.image_score, { width: width, height: height }]}
                        source={{ uri: uri }} /> */}
                    <View style={styles.avatar}>
                        <CustomAvatar
                            width={scale(35)}
                            height={scale(35)}
                            // containerStyle={styles.avatar}
                            uri={player.avatar} />
                    </View>
                </View>

            </Touchable>
        );
    }

    componentDidMount() {
        Image.getSize(this.props.uri, (width, height) => {
            console.log('ImageFlightItemFull', width, height)
            this.setState({
                width: screenWidth,
                height: screenWidth * height / width
            }, () => {
                console.log('componentDidMount', this.state.width, this.state.height)
            })
        });
    }

    onOpenImage() {
        if (this.props.onOpenImage) {
            this.props.onOpenImage(this.props.uri);
        }
    }

}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#FFFFFF',
    },
    image_score: {
        resizeMode: 'contain'
    },
    avatar: {
        position: 'absolute',
        left: 5,
        top: 5
    }
});