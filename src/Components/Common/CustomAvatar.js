import React from 'react';
import {
    Platform,
    StyleSheet,
    View,
    Image,
    TouchableOpacity
} from 'react-native';
import BaseComponent from '../../Core/View/BaseComponent';
import { Avatar } from 'react-native-elements';
import * as Progress from 'react-native-progress';
import { createImageProgress } from 'react-native-image-progress';
import FastImage from 'react-native-fast-image';
const Images = createImageProgress(FastImage);

import StaticProps from '../../Constant/PropsStatic';

export default class CustomAvatar extends BaseComponent {

    constructor(props) {
        super(props);
        this.onAvatarClick = this.onAvatarClick.bind(this);
    }

    static defaultProps = {
        uri: '',
        height: 81,
        width: 81,
        containerStyle: {},
        resizeMode: '',
        defaultSource: ''
    }

    render() {
        let { uri, height, width, containerStyle, view_style, resizeMode, defaultSource } = this.props;
        if (uri) {
            return <TouchableOpacity style={view_style ? view_style : null}
                onPress={this.onAvatarClick}>
                <Images
                    style={{
                        width: width,
                        height: height,
                        borderRadius: width / 2,
                        backgroundColor: '#CCCCCC'
                    }}
                    imageStyle={{
                        width: width,
                        height: height,
                        borderRadius: width / 2
                    }}
                    source={{
                        uri: uri,
                    }}
                    resizeMode={resizeMode === '' ? FastImage.resizeMode.contain : FastImage.resizeMode.cover}
                    indicator={Progress.Circle}
                />
            </TouchableOpacity>
        } else {
            return (
                <TouchableOpacity style={view_style ? view_style : null}
                    onPress={this.onAvatarClick}>
                    <Avatar rounded
                        containerStyle={[containerStyle, { backgroundColor: '#CCCCCC' }]}
                        avatarStyle={styles.avatar_style}
                        source={defaultSource ? defaultSource : this.getResources().avatar_default_larger}
                        height={height}
                        width={width}
                    />
                </TouchableOpacity>
            );
        }
    }
    //this.navigation.navigate('persional_information', { "puid": this.uid });
    onAvatarClick() {
        let{onAvatarClick,puid} = this.props;
        if(puid){
            let navigation = StaticProps.getAppSceneNavigator();
            if(!navigation) return;
            let isMe = (this.getAppUtil().replaceUser(puid) === this.getUserInfo().getId()) ? true : false
            if(isMe){
                navigation.navigate('persional_information', { "puid": puid });
            }else{
                navigation.navigate('player_info', { "puid": puid });
            }
            return;
        }

        if (onAvatarClick) {
            onAvatarClick();
        }
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    avatar_container: {
    },
    avatar_style: {
        borderColor: '#CCCCCC',
        borderWidth: 2,
    },
    avatar_bg_vip: {
        position: 'absolute',
        bottom: 0
    }
});