import React from 'react';
import {
    Platform,
    StyleSheet,
    Text,
    View,
    Image,
    Linking,
    TouchableOpacity,
    Dimensions
} from 'react-native';
import Touchable from 'react-native-platform-touchable';
import BaseComponent from '../../Core/View/BaseComponent';
import Networking from '../../Networking/Networking';
import ApiService from '../../Networking/ApiService';
import { scale, verticalScale, moderateScale } from '../../Config/RatioScale';
import firebase from 'react-native-firebase';
import TimerMixin from 'react-timer-mixin';
import * as Progress from 'react-native-progress';
import { createImageProgress } from 'react-native-image-progress';
import FastImage from 'react-native-fast-image';
const Images = createImageProgress(FastImage);

const REFRESH_TIME = 60000*2;

const { width, height } = Dimensions.get('window')

export default class BannerAdView extends BaseComponent {

    static defaultProps = {

    }

    constructor(props) {
        super(props);

        this.state = {
            adsList: '',
            layoutWidth: 0
        }
        console.log('BannerAdView', width, height)
        this.onHeaderLayout = this.onHeaderLayout.bind(this);
    }

    // shouldComponentUpdate(nextProps, nextState) {
    //     return typeof this.state.data.id === 'undefined' ||
    //         nextState.data && nextState.data.id != this.state.data.id;
    // }

    // renderAds(adsList) {
    //     if (adsList.length != 2 || layoutWidth < 650) return null;

    //     let adsObject = adsList[1];
    //     return (
    //         <TouchableOpacity style={styles.container}
    //             onPress={this.onAdsPress.bind(this, adsObject.url)}>
    //             <Images
    //                 style={styles.img_content}
    //                 source={{ uri: adsObject.banner_url }}
    //                 resizeMode={FastImage.resizeMode.contain}
    //                 indicator={Progress.Circle} />
    //         </TouchableOpacity>
    //     )
    // }

    renderAds1(adsList) {
        let adsObject = adsList[0];
        return (
            <TouchableOpacity style={styles.container}
                onPress={this.onAdsPress.bind(this, adsObject)}>
                <Images
                    style={styles.img_content}
                    source={{ uri: adsObject.banner_url }}
                    resizeMode={FastImage.resizeMode.contain}
                    indicator={Progress.Circle} />
            </TouchableOpacity>
        )
    }

    renderAds2(adsList, layoutWidth) {
        if (adsList.length != 2 || layoutWidth < 650) return null;

        let adsObject = adsList[1];
        return (
            <TouchableOpacity style={styles.container}
                onPress={this.onAdsPress.bind(this, adsObject)}>
                <Images
                    style={styles.img_content}
                    source={{ uri: adsObject.banner_url }}
                    resizeMode={FastImage.resizeMode.contain}
                    indicator={Progress.Circle} />
            </TouchableOpacity>
        )
    }

    render() {
        let {
            adsList,
            layoutWidth
        } = this.state;
        if (adsList && adsList.length > 0) {
            // let adsListView = adsList.map((adsObject) => {
            //     return (
            //         <TouchableOpacity style={styles.container}
            //             onPress={this.onAdsPress.bind(this, adsObject.url)}>
            //             <Images
            //                 style={styles.img_content}
            //                 source={{ uri: adsObject.banner_url }}
            //                 resizeMode={FastImage.resizeMode.contain}
            //                 indicator={Progress.Circle} />
            //         </TouchableOpacity>
            //     )
            // })
            return (
                <View style={styles.view_content}
                    onLayout={this.onHeaderLayout}>
                    {this.renderAds1(adsList)}
                    {this.renderAds2(adsList, layoutWidth)}
                </View>
            );
        }
        return <View style={{ flex: 1 }} />
    }


    componentDidMount() {
        this.requestAds();
        this.intervalId = TimerMixin.setInterval.call(this, () => {
            this.requestAds();
        }, REFRESH_TIME);
    }

    componentWillUnmount() {
        if (this.intervalId)
            TimerMixin.clearInterval(this.intervalId);
    }

    requestAds() {
        try {
            let url = this.getConfig().getBaseUrl() + ApiService.ads_banner();
            let self = this;
            console.log("url: ", url);
            Networking.httpRequestGet(url, (jsonData) => {

                if (jsonData.error_code === 0) {
                    let dataResponse = jsonData.data;
                    if (dataResponse instanceof Array && dataResponse.length > 0) {
                        this.setState({
                            adsList: dataResponse
                        }, () => {
                            if (firebase) {
                                firebase.analytics().logEvent('onShowBanner', {
                                    adsList: dataResponse
                                })
                            }
                        })
                    }

                }
            }, () => {
                //time out
            });
        } catch (error) {

        }
    }

    onHeaderLayout(event) {
        let widthLt = event.nativeEvent.layout.width;
        console.log('onHeaderLayout', widthLt)
        this.setState({
            layoutWidth: widthLt
        })
    }

    onAdsPress(data) {
        if (data) {
            console.log('onAdsPress', data)
            Linking.canOpenURL(data.url).then(supported => {
                if (supported) {
                    Linking.openURL(data.url);
                } else {
                    console.log("Don't know how to open URI: " + data.url);
                }
            });

            if (firebase) {
                firebase.analytics().logEvent('onPressBanner', {
                    id: data.id,
                    title: data.title,
                    banner: data.banner_url,
                    url: data.url
                })
            }
        }

    }

}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
        flexDirection: 'column',
        width: 320,
        height: 50
    },
    view_content: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'flex-end',
        justifyContent: 'flex-end',
    },
    img_content: {
        width: 320,
        height: 50,
        resizeMode: 'contain'
    }
});