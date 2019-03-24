
import React from 'react';
import { View, Dimensions, Text, TouchableOpacity, Image } from 'react-native';
import BaseComponent from '../../../../../Core/View/BaseComponent';
import { createImageProgress } from 'react-native-image-progress';
const Images = createImageProgress(FastImage);
import * as Progress from 'react-native-progress';
import FastImage from 'react-native-fast-image';
import ShowInfoVideo from './ShowInfoView';
import PropStatic from '../../../../../Constant/PropsStatic';
let window = Dimensions.get('window');

export default class ItemVideo extends BaseComponent {
    constructor(props) {
        super(props);
        this.onItemClick = this.onItemClick.bind(this);
        this.showInfoVideo = this.showInfoVideo.bind(this);
        this.onShowShareClick = this.onShowShareClick.bind(this);
    }

    getSize() {
        let width = window.width - 20;
        let height = Math.round((9 * width) / 16);
        return {
            width: width,
            height: height
        }
    }

    onItemClick() {
        let { onItemClick, data } = this.props;
        if (onItemClick && data) {
            onItemClick(data);
        }
    }

    showInfoVideo() {
        if (this.refShowInfo) {
            this.refShowInfo.show();
        }
    }

    onShowShareClick() {
        let { slug } = this.props.data;
        let { mode_share } = this.props;
        if (mode_share) {
            let popup = PropStatic.getPopupShare();
            if (popup && slug) {
                popup.show(this.getConfig().web_url(slug));
            }
        } else {
            let popup = PropStatic.getDialogApp();
            if (popup && slug) {
                popup.show(this.getConfig().web_url(slug));
            }
        }
    }

    // onShowShareClick() {
    //     let popup = PropStatic.getDialogApp();
    //     let { slug } = this.props.data;
    //     if (popup && slug) {
    //         popup.show(this.getConfig().web_url(slug));
    //     }
    // }

    render() {
        let { category, title, thumbnail_16x9, timeDiff, chapeau } = this.props.data;
        return (
            <TouchableOpacity activeOpacity={0.9} onPress={this.onItemClick}>
                <View style={{ marginLeft: 10, marginRight: 10, marginTop: 10, borderRadius: 5, borderColor: '#adadad', borderWidth: 0.5 }}>
                    <Images
                        style={{
                            width: this.getSize().width,
                            height: this.getSize().height,
                            borderColor: '#adadad',
                            borderWidth: 0,
                            // borderTopLeftRadius: 5,
                            // borderTopRightRadius: 5,
                            // borderBottomLeftRadius: 5,
                            // borderBottomRightRadius: 5,
                            borderRadius: 5
                        }}
                        imageStyle={{
                            width: this.getSize().width,
                            height: this.getSize().height,
                            // borderTopLeftRadius: 5,
                            // borderTopRightRadius: 5,

                            // borderBottomLeftRadius: 5,
                            // borderBottomRightRadius: 5,
                            borderRadius: 5
                            // borderRadius: width/2
                        }}
                        source={{
                            uri: thumbnail_16x9,
                            priority: FastImage.priority.normal,
                        }}
                        resizeMode={FastImage.resizeMode.contain}
                        indicator={Progress.Circle}
                    />
                    <View style={{
                        position: 'absolute', top: 0, bottom: 0, left: 0, right: 0,borderRadius : 5,
                        backgroundColor: 'rgba(0,0,0,0.6)',
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}>
                        <Image
                            style={{ width: 50, height: 50, resizeMode: 'contain', tintColor: 'white' }}
                            source={this.getResourceGolfnews().ic_play_video}
                        />
                        <View style={{ flexDirection: 'row', alignItems: 'center', padding: 10, position: 'absolute', zIndex: 2, bottom: 20 }}>
                            <Text allowFontScaling={global.isScalefont} style={{ fontSize: 12, color: 'white' }}>{category.title}</Text>
                            <Text allowFontScaling={global.isScalefont} style={{ flex: 1, fontSize: 12, color: 'white', marginLeft: 10 }}>{timeDiff}</Text>

                            <TouchableOpacity style={{ width: 50, height: 20, marginRight: 10, justifyContent: 'flex-end' }} onPress={this.onShowShareClick}>
                                <Text allowFontScaling={global.isScalefont} style={{ fontSize: 10, color: 'white', textAlign: 'right' }}>{'●●●'}</Text>
                            </TouchableOpacity>{/* <Text allowFontScaling={global.isScalefont} style={{ fontSize: 10, color: 'white' }}>{'●●●'}</Text> */}
                        </View>
                        {/* <Text allowFontScaling={global.isScalefont}
                            style={{ fontSize: 12, color: 'white', position: 'absolute', left: 10, bottom: 30 }}>
                            {category.title}
                            <Text allowFontScaling={global.isScalefont}
                                style={{ flex: 1, fontSize: 12, color: 'gray', marginLeft: 10 }}>
                                    {timeDiff}
                            </Text>
                        </Text> */}
                        <Text allowFontScaling={global.isScalefont}
                            numberOfLines={1}
                            style={{ fontSize: 16, color: 'white', fontWeight: 'bold', position: 'absolute', left: 10, bottom: 10, right: 30 }}>
                            {title}
                        </Text>
                        <TouchableOpacity style={{ position: 'absolute', right: 5, top: 5, width: 30, height: 30 }} onPress={this.showInfoVideo}>
                            <Image
                                style={{ position: 'absolute', zIndex: 3, width: 20, height: 20, resizeMode: 'contain', tintColor: 'white', top: 5, right: 5 }}
                                source={this.getResourceGolfnews().ic_introduct}
                            />
                        </TouchableOpacity>
                        {/* <View style={{
                            position: 'absolute', top: 0, left: 0, bottom: 0, right: 0,
                            backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 10,
                            justifyContent : 'flex-end'
                        }}>
    
                        </View> */}
                        <ShowInfoVideo ref={(refShowInfo) => { this.refShowInfo = refShowInfo; }} info={chapeau} />
                    </View>
                    {/* <View style={{ flexDirection: 'row', alignItems: 'center', padding: 10 }}>
                        <Text allowFontScaling={global.isScalefont} style={{ fontSize: 12, color: '#F36F25' }}>{category.title}</Text>
                        <Text allowFontScaling={global.isScalefont} style={{ flex: 1, fontSize: 12, color: 'gray', marginLeft: 10 }}>{timeDiff}</Text>
                        <Text allowFontScaling={global.isScalefont} style={{ fontSize: 10, color: 'gray' }}>{'●●●'}</Text>
                    </View>
                    <Text allowFontScaling={global.isScalefont} style={{ fontSize: 16, color: 'black', fontWeight: 'bold', marginLeft: 10, marginTop: 10 }}>{title}</Text>
                    <Text allowFontScaling={global.isScalefont} style={{ fontSize: 16, color: 'black', marginLeft: 10, marginTop: 10 }} numberOfLines={4}>{chapeau}</Text> */}
                </View>
            </TouchableOpacity >
        );
    }
}