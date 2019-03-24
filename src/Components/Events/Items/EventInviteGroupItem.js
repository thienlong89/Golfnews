import React from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    Dimensions
} from 'react-native';
import Touchable from 'react-native-platform-touchable';
import BaseComponent from '../../../Core/View/BaseComponent';
import { Avatar } from 'react-native-elements';
import ApiService from '../../../Networking/ApiService';
import Networking from '../../../Networking/Networking';
import MyView from '../../../Core/View/MyView';
import ItemLoading from '../../Common/ItemLoadingView';
import { scale, verticalScale, fontSize } from '../../../Config/RatioScale';

let { width, height } = Dimensions.get('window');

export default class EventInviteGroupItem extends BaseComponent {

    constructor(props) {
        super(props);
        this.state = {
            isInvited: this.props.data.isInvited(),
            isLoading: false
        }
        this.onSendInviteClick = this.onSendInviteClick.bind(this);
    }

    checkAvatar(data) {
        return (data && data.getLogo()) ? { uri: data.getLogo() } : this.getResources().avatar_event_default;
    }

    showLoading() {
        this.setState({
            isLoading: true,
        }, () => {
            this.itemLoading.showLoading();
        });

    }

    hideLoading() {
        this.setState({
            isLoading: false,
        }, () => {
            this.itemLoading.hideLoading();
        });

    }

    /**
     * Gui loi moi den nhom
     */
    onSendInviteClick() {
        let { data, event_id } = this.props;
        let url = this.getConfig().getBaseUrl() + ApiService.event_send_invite_to_group(event_id, data.getId());
        let self = this;
        console.log("url", url);
        this.showLoading();
        Networking.httpRequestGet(url, (jsonData) => {
            console.log("jsonData", jsonData);
            self.hideLoading();
            if (jsonData.hasOwnProperty('error_code')) {
                let error_code = parseInt(jsonData['error_code']);
                if (error_code === 0) {
                    self.setState({
                        isInvited: true
                    });
                }
            }
        }, () => {
            self.hideLoading();
        });
    }

    render() {
        let { data } = this.props;
        let { isInvited, isLoading } = this.state;
        return (
            <View style={styles.container}>
                <Avatar
                    width={verticalScale(45)}
                    height={verticalScale(45)}
                    rounded={true}
                    source={this.checkAvatar(data)}
                />

                <View style={styles.body}>
                    <Text allowFontScaling={global.isScaleFont} style={styles.name} numberOfLines={1}>{data.getName()}</Text>
                    <Text allowFontScaling={global.isScaleFont} style={styles.total_member}>{data.getTotalMember()} {this.t('member_title')}</Text>
                </View>

                <Touchable onPress={this.onSendInviteClick}>
                    <MyView style={styles.my_view_button} hide={isInvited}>
                        <Text allowFontScaling={global.isScaleFont} style={styles.button_text}>{isLoading ? '' : this.t('send')}</Text>
                        <ItemLoading ref={(itemLoading) => { this.itemLoading = itemLoading; }} />
                    </MyView>
                </Touchable>

                <MyView hide={isLoading || !isInvited}>
                    <Image
                        style={styles.img}
                        source={this.getResources().btn_save}
                    />
                </MyView>

            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        height: verticalScale(60),
        flexDirection: 'row',
        // justifyContent: 'center',
        alignItems: 'center',
        marginLeft: scale(10),
        marginRight: scale(10)
    },

    button_text: {
        fontSize: fontSize(14, -1),// 13, 
        color: '#fff',
        textAlignVertical: 'center',
        textAlign: 'center',
        paddingLeft: 5,
        paddingRight: 5
    },

    my_view_button: {
        marginLeft: scale(10),
        minWidth: scale(60),
        height: verticalScale(36),
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#00ABA7',
        borderRadius: scale(5)
    },

    my_view_img: {
        width: scale(60),
        height: verticalScale(60),
        justifyContent: 'center',
        alignItems: 'center'
    },

    logo_view: {
        height: verticalScale(60),
        width: scale(50),
        justifyContent: 'center',
        alignItems: 'center'
    },

    body: {
        flex: 1,
        marginLeft: scale(10)
    },

    img: {
        width: verticalScale(30),
        height: verticalScale(30),
        resizeMode: 'contain',
        alignSelf: 'center',
        tintColor: '#00ABA7'
    },

    name: {
        fontSize: fontSize(16, 1),// 16,
        color: '#000',
        textAlignVertical: 'center',
        fontWeight: 'bold'
    },

    total_member: {
        fontSize: fontSize(14),// 14,
        color: '#adadad',
        textAlignVertical: 'center'
    }
});