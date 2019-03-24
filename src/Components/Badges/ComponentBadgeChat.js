import React from 'react';
import { View,Text,ImageBackground } from 'react-native';
import Files from '../Common/Files';
import {verticalScale,fontSize,scale} from '../../Config/RatioScale';

/**
 * Hiển thị số tin nhắn chát,notification,newa trên thành Badge
 */
export default class ComponentBadgeChat extends React.Component {
    constructor(props) {
        super(props);
        this.total_chat = 0;//fake
    }

    updateView(_total){
        this.total_chat = _total;
        this.setState({});
    }

    /**
     * Xoa bớt notification count
     * @param {Number} _count  số count xóa boét
     */
    removeCount(_count){
        this.total_chat = this.total_chat-_count;
        this.total_chat = this.total_chat >= 0 ? this.total_chat : 0;
        this.setState({});
    }

    formatBadge(){
        // console.log('................ type of ',typeof this.total_chat);
        return (typeof this.total_chat === 'number' && this.total_chat > 99) ? '99+' : this.total_chat;
    }

    getElementCountChat() {
        // this.total_chat = 50;
        if (!this.total_chat || this.total_chat === '0') return null;
        return (
            <ImageBackground style={{ position: 'absolute', zIndex: 100, top: 5, right: 1, width: verticalScale(20), height: verticalScale(20), justifyContent: 'center', alignItems: 'center' }}
                resizeMode={'contain'}
                source={Files.sprites.bg_notifi_count}
            >
                <Text allowFontScaling={global.isScaleFont} style={{ fontSize: fontSize(11, -scale(3)), color: 'white', textAlign: 'center' }}>
                    {this.formatBadge()}
                </Text>
            </ImageBackground>
        );
    }

    render() {
        let { tabWidth, tabHeight } = this.props;
        return (
            <View pointerEvents="none" style={{ width: tabWidth, height: tabHeight, backgroundColor: 'transparent' }}>
                {this.getElementCountChat()}
            </View>
        );
    }
}
