import React from 'react';
import { View, Dimensions, Text, TouchableOpacity } from 'react-native';
import BaseComponent from '../../../../../Core/View/BaseComponent';
import { createImageProgress } from 'react-native-image-progress';
const Images = createImageProgress(FastImage);
import * as Progress from 'react-native-progress';
import FastImage from 'react-native-fast-image';
let window = Dimensions.get('window');
import PropStatic from '../../../../../Constant/PropsStatic';

export default class ItemNews extends BaseComponent {
    constructor(props) {
        super(props);
        this.onItemClick = this.onItemClick.bind(this);
        this.onShowShareClick = this.onShowShareClick.bind(this);
    }

    getSize() {
        let width = window.width - 10;
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

    onShowShareClick() {
        let { slug } = this.props.data;
        let { mode_share } = this.props;
        let popupShare = PropStatic.getPopupShareInNews();
        if(popupShare){
            popupShare.show(this.getConfig().web_url(slug));
            return;
        }
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

    render() {
        let { category, title, thumbnail_16x9, timeDiff, chapeau } = this.props.data;
        return (
            <TouchableOpacity activeOpacity={0.9} onPress={this.onItemClick}>
                <View style={{ marginLeft: 5, marginRight: 5, marginTop: 10, borderRadius: 5, borderColor: '#adadad', borderWidth: 0.5 }}>
                    <Images
                        style={{
                            width: this.getSize().width,
                            height: this.getSize().height,
                            borderColor: '#adadad',
                            borderWidth: 0,
                            borderTopLeftRadius: 5,
                            borderTopRightRadius: 5,
                        }}
                        imageStyle={{
                            width: this.getSize().width,
                            height: this.getSize().height,
                            borderTopLeftRadius: 5,
                            borderTopRightRadius: 5,
                            // borderRadius: width/2
                        }}
                        source={{
                            uri: thumbnail_16x9,
                            priority: FastImage.priority.normal,
                        }}
                        resizeMode={FastImage.resizeMode.contain}
                        indicator={Progress.Circle}
                    />
                    <View style={{ flexDirection: 'row', alignItems: 'center', padding: 10 }}>
                        <Text allowFontScaling={global.isScalefont} style={{ fontSize: 12, color: '#F36F25' }}>{category.title}</Text>
                        <Text allowFontScaling={global.isScalefont} style={{ flex: 1, fontSize: 12, color: 'gray', marginLeft: 10 }}>{timeDiff}</Text>
                        <TouchableOpacity style={{ width: 50, height: 20, marginRight: 10, justifyContent: 'flex-end' }} onPress={this.onShowShareClick}>
                            <Text allowFontScaling={global.isScalefont} style={{ fontSize: 10, color: 'gray', textAlign: 'right' }}>{'●●●'}</Text>
                        </TouchableOpacity>
                    </View>
                    <Text allowFontScaling={global.isScalefont} style={{ fontSize: 16, color: 'black', fontWeight: 'bold', marginLeft: 10, marginTop: 10 }}>{title}</Text>
                    <Text allowFontScaling={global.isScalefont} style={{ fontSize: 16, color: 'black', marginLeft: 10, marginTop: 10 }} numberOfLines={4}>{chapeau}</Text>
                </View>
            </TouchableOpacity>
        );
    }
}