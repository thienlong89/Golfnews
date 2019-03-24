import React from 'react';
import {
    Platform,
    StyleSheet,
    Text,
    View,
    Dimensions,
    PixelRatio,
    WebView
} from 'react-native';
import Touchable from 'react-native-platform-touchable';
import BaseComponent from '../../../../Core/View/BaseComponent';
import { scale, verticalScale, moderateScale, fontSize } from '../../../../Config/RatioScale';
import YouTube from 'react-native-youtube'

const { width, height } = Dimensions.get('window');

export default class ReviewCourseVideo extends BaseComponent {

    static defaultProps = {

    }

    constructor(props) {
        super(props);

        this.state = {
            videoUrl: ''
        }

    }

    render() {
        let {
            videoUrl
        } = this.state;

        if (videoUrl) {
            return (
                <View style={styles.container}>
                    <Text allowFontScaling={global.isScaleFont} style={styles.txt_title}>{this.t('video').toUpperCase()}</Text>
                    {/* <YouTube
                        videoId={videoUrl} // The YouTube video ID
                        play={false}             // control playback of video with true/false
                        fullscreen={false}       // control whether the video should play in fullscreen or inline
                        loop={true}             // control whether the video should loop when ended
                        apiKey="AIzaSyDsTc4kY2H0jy4IhqsfzGcLJ8jrDVzt_IU"
                        onReady={e => this.setState({ isReady: true })}
                        onChangeState={e => this.setState({ status: e.state })}
                        onChangeQuality={e => this.setState({ quality: e.quality })}
                        onError={e => console.log('onError', e)}

                        style={styles.video}
                    /> */}
                    <WebView
                        style={styles.video}
                        source={{ uri: `https://www.youtube.com/embed/${videoUrl}?controls=1&showinfo=0` }}
                    />
                </View>
            );
        }
        return null;
    }

    setVideoUrl(videoUrl = '') {
        console.log('setVideoUrl', videoUrl)
        this.setState({
            videoUrl: videoUrl
        })
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#FFFFFF',
        flexDirection: 'column'
    },
    txt_title: {
        fontSize: fontSize(17, scale(6)),
        color: '#424242',
        fontWeight: 'bold',
        marginLeft: scale(10),
        marginTop: scale(10),
        marginBottom: scale(10)
    },
    video: {
        alignSelf: 'stretch',
        height: PixelRatio.roundToNearestPixel(
            (width - scale(20)) / (16 / 9)
        ),
        marginLeft: scale(10),
        marginRight: scale(10)
    }
});