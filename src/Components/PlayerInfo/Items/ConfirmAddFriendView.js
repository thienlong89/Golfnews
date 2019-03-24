import React from 'react';
import {
    Platform,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import Touchable from 'react-native-platform-touchable';
import BaseComponent from '../../../Core/View/BaseComponent';

export default class ConfirmAddFriendView extends BaseComponent {

    static defaultProps = {

    }

    constructor(props) {
        super(props);
        this.onAcceptInviteFriendClick = this.onAcceptInviteFriendClick.bind(this);
        this.onRejectInviteFriendClick = this.onRejectInviteFriendClick.bind(this);
        this.state = {

        }
    }

    shouldComponentUpdate(){
        return false;
    }

    render() {
        return (
            <View style={styles.container}>
                <Text allowFontScaling={global.isScaleFont} style={{ color: '#666666', fontSize: 15, marginTop: 5, marginBottom: 5 }}>{this.t('sent_invite')}</Text>
                <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginBottom: 5 }}>
                    <Touchable style={{ minWidth: 80, backgroundColor: '#00ABA7', justifyContent: 'center', alignItems: 'center', borderRadius: 3, marginRight: 5 }}
                        onPress={this.onAcceptInviteFriendClick}>
                        <Text allowFontScaling={global.isScaleFont} style={{ color: '#FFF', fontSize: 15, paddingLeft: 10, paddingRight: 10, paddingTop: 5, paddingBottom: 5 }}>
                            {this.t('chap_nhan')}
                        </Text>
                    </Touchable>

                    <Touchable style={{ minWidth: 80, borderColor: '#B3B3B3', borderWidth: 1, borderRadius: 3, justifyContent: 'center', alignItems: 'center', marginLeft: 5 }}
                        onPress={this.onRejectInviteFriendClick}>
                        <Text allowFontScaling={global.isScaleFont} style={{ color: '#5E5E5E', fontSize: 15, paddingLeft: 10, paddingRight: 10, paddingTop: 5, paddingBottom: 5 }}>
                            {this.t('deny')}
                        </Text>
                    </Touchable>
                </View>
            </View>
        );
    }

    onAcceptInviteFriendClick(){
        if(this.props.onAcceptInviteFriendClick){
            this.props.onAcceptInviteFriendClick();
        }
    }

    onRejectInviteFriendClick(){
        if(this.props.onRejectInviteFriendClick){
            this.props.onRejectInviteFriendClick();
        }
    }


}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#FFFFFF',
        justifyContent: 'center',
        alignItems: 'center',
        height: 80
    },
});