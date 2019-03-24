import React from 'react';
import { View, Text, WebView, BackHandler, Dimensions, ScrollView, StyleSheet,PixelRatio } from 'react-native';
import BaseComponent from '../../../Core/View/BaseComponent';
import CustomLoadingView from '../../Common/CustomLoadingView';
import ApiService from '../../../Networking/ApiService';
import Networking from '../../../Networking/Networking';
import HeaderView from './Screens/Header/HeaderView';
import HTML from 'react-native-render-html';
let { width } = Dimensions.get('window');
import YouTube from 'react-native-youtube';
import Video from 'react-native-video';

export default class VideoDetailView extends BaseComponent {
    constructor(props) {
        super(props);
        let { params } = this.props.navigation.state;
        this.title = (params && params.title) ? params.title : '';
        this.slug = (params && params.slug) ? params.slug : '';
        this.youtube_id = (params && params.youtube_id) ? params.youtube_id : null;
        console.log('.......................... youtube id : ', this.youtube_id);
        this.post = null;
        this.backHandler = null;
        this.onBackClick = this.onBackClick.bind(this);
    }

    componentDidMount() {
        if (this.refHeader) {
            this.refHeader.setHeaderLeft(this.getResourceGolfnews().ic_back, this.onBackClick);
        }
        this.backHandler = BackHandler.addEventListener('hardwareBackPress', this.onBackClick);
        if (this.refLoading) {
            this.refLoading.showLoading();
        }
        this.rotateToPortrait();
        // this.sendRequestDetail();
    }

    onBackClick() {
        let { navigation } = this.props;
        if (navigation) {
            navigation.goBack();
        }
        return true;
    }

    showLoading() {
        if (this.refLoading) {
            this.refLoading.showLoading();
        }
    }

    hideLoading() {
        if (this.refLoading) {
            this.refLoading.hideLoading();
        }
    }

    // sendRequestDetail() {
    //     if (!this.slug) return;
    //     let self = this;
    //     let url = this.getConfig().BASE_URL + ApiService.news_view_post(this.slug);
    //     console.log('............................... slug url : ', url);
    //     this.showLoading();
    //     Networking.httpRequestGet(url, (jsonData) => {
    //         self.hideLoading();
    //         let { status, data } = jsonData;
    //         if (!status || !data) return;
    //         if (status.code && parseInt(status.code) === 200) {
    //             let { post, relatedPosts } = data;
    //             self.post = post;
    //             this.setState({});
    //         }
    //     }, () => {
    //         self.hideLoading();
    //     });
    // }

    // renderPost() {
    //     if (!this.post || !this.post.detail) return null;
    //     let detail = this.post.detail;
    //     console.log('............................. detail : ', detail);
    //     return (
    //         <View style={{ flex: 1, backgroundColor: 'white' }}>
    //             <ScrollView>
    //                 <Text style={{ fontSize: 16, color: 'black', fontWeight: 'bold', marginTop: 10 }}>{detail.title ? detail.title : ''}</Text>
    //                 <Text style={{ fontSize: 12, color: '#F36F25', marginTop: 5 }}>{detail.category.title ? detail.category.title : ''}</Text>
    //                 {/* <WebView html={detail.content ? detail.content : ''}
    //                 source={{ baseUrl: '' }}
    //                 // onLoadStart={this.onLoadStart}
    //                 // onLoadEnd={this.onLoadEnd}
    //                 startInLoadingState={true}
    //                 style={{ flex: 1, backgroundColor: 'white', marginTop: 6 }}

    //             /> */}
    //                 <HTML baseFontStyle={{ fontSize: 16, color: 'black' }}
    //                     html={detail.content ? detail.content : ''} imagesMaxWidth={width}
    //                     containerStyle={{ backgroundColor: 'white' }}
    //                 />
    //             </ScrollView>
    //         </View>
    //     )
    // }
    renderVideoYoutube() {
        return (
            // <YouTube
            //     apiKey={'AIzaSyBo6LiDWHSm5-XQyIwmEujf_TzxjD1sK70'}
            //     videoId={this.youtube_id}   // The YouTube video ID
            //     play={true}             // control playback of video with true/false
            //     fullscreen={false}       // control whether the video should play in fullscreen or inline
            //     loop={false}             // control whether the video should loop when ended

            //     onReady={e => { if (this.refLoading) this.refLoading.hideLoading(); }}
            //     // onChangeState={e => this.setState({ status: e.state })}
            //     // onChangeQuality={e => this.setState({ quality: e.quality })}
            //     onError={e => {
            //         if (this.refLoading) {
            //             this.refLoading.hideLoading();
            //         }
            //         console.log('..................... co loi roi : ', e);
            //     }}

            //     style={{ alignSelf: 'stretch', height: 300 }}
            // />

            // <Video source={{ uri: `https://www.youtube.com/watch?v=${this.youtube_id}` }}   // Can be a URL or a local file.
            //             ref={(ref) => {
            //                 this.player = ref
            //             }}
            //             controls={true}
            //             // resizeMode='stretch'
            //             resizeMode='cover'
            //             muted={false}
            //             paused={false}
            //             onLoadStart={() => {
            //                 console.log('................................ bat dau load video  : ');
            //             }}

            //                  // Callback when remote video is buffering
            //             onError={(error) => {
            //                 console.log('....................load user loi ,', error);
            //             }}               // Callback when video cannot be loaded
            //             style={styles.backgroundVideo} />

            <WebView
                style={styles.video}
                onLoadEnd={() => {
                    if (this.refLoading) {
                        this.refLoading.hideLoading();
                    }
                }}
                //`https://www.youtube.com/embed/${videoUrl}?controls=1&showinfo=0`
                source={{ uri: `https://www.youtube.com/watch?v=${this.youtube_id}&showinfo=0` }}
                // source={{ uri: `https://www.youtube.com/embed/${this.youtube_id}?showinfo=0&autoplay=1` }}
            />
        );

        // <WebView
        //     style={{flex : 1}}
        //     source={{ uri: `https://www.youtube.com/watch?v=${this.youtube_id}`}}
        // />
    }

    render() {
        return (
            <View style={{ flex: 1, backgroundColor: 'white' }}>
                <HeaderView ref={(refHeader) => { this.refHeader = refHeader; }} title={this.title} hide_right={true}/>
                <View style={{ flex: 1, padding: 6 }}>
                    {this.renderVideoYoutube()}
                    <CustomLoadingView ref={(refLoading) => { this.refLoading = refLoading }} />
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    video: {
        alignSelf: 'stretch',
        height: PixelRatio.roundToNearestPixel(
            width  / (16 / 9)
        ),
        marginLeft: 0,
        marginRight: 0
    }
})