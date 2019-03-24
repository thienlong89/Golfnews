import React from 'react';
import { View, Text } from 'react-native';
import BaseComponent from '../../../Core/View/BaseComponent';
import { verticalScale, fontSize, scale } from '../../../Config/RatioScale';
import Touchable from 'react-native-platform-touchable';

export default class AcceptRejectInviteFriend extends BaseComponent {
    constructor(props) {
        super(props);
        this.state = {
            show: true
        }

        this.acceptCallback = null;
        this.rejectCallback = null;

        this.onAcceptClick = this.onAcceptClick.bind(this);
        this.onRejectClick = this.onRejectClick.bind(this);
    }

    show() {
        let { show } = this.state;
        if (show) return;
        this.setState({
            show: true
        });
    }

    hide(friend_status = null) {
        let { show } = this.state;
        if (!show) return;
        this.props.friend_status = friend_status;
        this.setState({
            show: false
        })
    }

    onAcceptClick(){
        if(this.acceptCallback){
            this.acceptCallback();
        }
    }

    onRejectClick(){
        if(this.rejectCallback){
            this.rejectCallback();
        }
    }

    render() {
        let { friend_status } = this.props;
        let { show } = this.props;
        if (friend_status === 2) {
            //no gui loi moi den minh
            show = true;
            this.state.show = true;
        }
        if (!show) return null;
        return (
            <View style={{ height: verticalScale(50), justifyContent: 'center', alignItems: 'center', marginTop: verticalScale(10) }}>
                <Text allowFontScaling={global.isScaleFont} style={{ fontSize: fontSize(16, scale(2)), color: '#666' }}>{this.t('sended_invite')}</Text>
                <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                    <Touchable onPress={this.onAcceptClick}>
                        <View style={{ width: scale(100), height: verticalScale(30), borderRadius: 5, backgroundColor: '#00aba7', justifyContent: 'center', alignItems: 'center' }}>
                            <Text allowFontScaling={global.isScaleFont} style={{ fontSize: fontSize(16, scale(2)), color: '#fff' }}>{this.t('chap_nhan')}</Text>
                        </View>
                    </Touchable>
                    <Touchable onPress={this.onRejectClick}>
                        <View style={{ width: scale(100), height: verticalScale(30), marginLeft: scale(10), borderRadius: 5, backgroundColor: '#fff', borderColor: '#666', borderWidth: 1, justifyContent: 'center', alignItems: 'center' }}>
                            <Text allowFontScaling={global.isScaleFont} style={{ fontSize: fontSize(16, scale(2)), color: '#666' }}>{this.t('reject_invite')}</Text>
                        </View>
                    </Touchable>
                </View>
            </View>
        );
    }
}