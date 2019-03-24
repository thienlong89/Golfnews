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
import utils from '../../../Utils';
import HtmlBoldText from '../../../Core/Common/HtmlBoldText';
import MyImage from '../../../Core/Common/MyImage';
import ApiService from '../../../Networking/ApiService';
import Networking from '../../../Networking/Networking';
import ItemLoading from '../../Common/ItemLoadingView';
import MyView from '../../../Core/View/MyView';
import { Avatar } from 'react-native-elements';

import { scale, verticalScale, fontSize } from '../../../Config/RatioScale';
import NotifyFriendItem from './NotifyFriendItem';

export default class NotifyItem extends BaseComponent {
    constructor(props) {
        super(props);
        this.state = {
            message: '',
            isLoading: false
        }

        this.onDeleteClick = this.onDeleteClick.bind(this);
        this.onItemClick = this.onItemClick.bind(this);
    }

    static defaultProps = {
        data: '',
        parentNavigator: null
    }

    // shouldComponentUpdate() {
    //     return false;
    // }

    checkIcon() {
        let { data } = this.props;
        return data.getIconImage().length ? { uri: data.getIconImage() } : '';
    }

    componentDidMount() {
        this.sendRequestReadNoti();
    }

    sendRequestReadNoti() {
        let { id,is_view } = this.props.data;
        if(is_view && is_view === 1) return;
        let url = this.getConfig().getBaseUrl() + ApiService.notification_read(id);
        this.Logger().log('.................... url doc tin nhan : ', url);
        Networking.httpRequestGet(url, (jsonData) => {
            console.log('................jsonData doc tin nhan : ', jsonData);
        });
    }

    onNotifyClick() {
        let { data } = this.props;
        let flight_id = parseInt(data.getFlightId());
        if (flight_id > 0) {
            //lam gi do
            this.sendRequestFlight(flight_id);
            return;
        }
        // console.log("Notify click............", flight_id);
    }

    removeSelf() {
        let { remove, data } = this.props;
        if (remove && data) {
            remove(data);
        }
    }

    onDeleteClick() {
        let { data } = this.props;
        let url = this.getConfig().getBaseUrl() + ApiService.notification_delete(data.getId());
        console.log("url delete : ", url);
        let self = this;
        this.itemLoading.showLoading();
        this.setState({
            isLoading: true
        });
        Networking.httpRequestGet(url, (jsonData) => {
            // console.log('jsonData xoa ', jsonData);
            if (jsonData.hasOwnProperty('error_code')) {
                self.itemLoading.hideLoading();
                let error_code = parseInt(jsonData['error_code']);
                if (error_code === 0) {
                    self.setState({
                        isLoading: false
                    });
                    self.removeSelf();
                } else {
                    self.setState({
                        isLoading: false
                    });
                }
            }
        }, () => {
            self.itemLoading.hideLoading();
            self.setState({
                isLoading: false
            });
        });
    }

    onItemClick() {
        let { onItemClickCallback, data } = this.props;
        if (onItemClickCallback && data) {
            onItemClickCallback(data)
            // return;
        }
        this.props.data.is_view = 1;
        this.setState({});
    }

    getElementFriend() {
        let { data, onAddFriend, onRejectFriend } = this.props;
        return (
            <NotifyFriendItem data={data}
                onRejectFriend={onRejectFriend}
                onAddFriend={onAddFriend}
            />
        )
    }

    getElementNotifi() {
        let { data } = this.props;
        let is_view = data.is_view;
        return (
            <Touchable onPress={this.onItemClick}>
                <View style={[styles.container, { backgroundColor: (is_view && is_view === 1) ? '#fff' : '#ddf6f7'}]}>
                    {/* <MyImage style={{ width: scale(40), height: verticalScale(50), marginTop: verticalScale(5), marginLeft: scale(5), resizeMode: 'contain' }}
                        uri={data.display_image}
                        imageDefault={this.getResources().avatar_event_default} /> */}
                    <Avatar
                        rounded={true}
                        width={verticalScale(50)}
                        height={verticalScale(50)}
                        source={{ uri: data.display_image }}
                        containerStyle={{ marginLeft: scale(5) }}
                    />
                    <View style={{ flex: 1, marginLeft: scale(5), marginTop: verticalScale(5), marginBottom: verticalScale(5) }}>
                        <HtmlBoldText
                            style={styles.text}
                            message={data.getMessage()}
                        />
                        <View style={styles.tini_camera_view}>
                            <Image
                                style={styles.tini_camera_img}
                                source={this.checkIcon()}
                            />
                            <Text allowFontScaling={global.isScaleFont} style={styles.timestamp_text}>{utils.getFormatAgoTime(data.getDateCreateTimestamp())}</Text>
                        </View>
                    </View>
                    {/* <Touchable onPress={this.onDeleteClick}>
                        <MyView style={{ width: scale(26), height: scale(26), marginRight: scale(5), justifyContent: 'center', alignItems: 'center' }} hide={this.state.isLoading}>
                            <Image
                                style={{ width: scale(26), height: scale(26), resizeMode: 'contain' }}
                                source={this.getResources().ic_remove}
                            />
                        </MyView>
                    </Touchable> */}
                    <MyView style={{ width: scale(26), height: scale(26), marginRight: scale(5), justifyContent: 'center', alignItems: 'center' }} hide={!this.state.isLoading}>
                    </MyView>
                    <ItemLoading ref={(itemLoading) => { this.itemLoading = itemLoading; }}
                        top={verticalScale(20)}
                        right={scale(15)} />
                </View>
            </Touchable>
        );
    }

    render() {
        let { data } = this.props;
        let is_view = data.is_view;
        let { notification_type } = data;
        console.log('is_view ', is_view);
        if (notification_type === 9) {
            return this.getElementFriend();
        }
        return this.getElementNotifi();
    }
}

const styles = StyleSheet.create({
    container: {
        minHeight: verticalScale(60),
        flexDirection: 'row',
        alignItems: 'center'
    },

    text: {
        color: 'black',
        fontSize: fontSize(14),//14,
        marginTop: verticalScale(5),
        marginRight: scale(5)
    },

    bold: {
        color: 'black',
        fontSize: fontSize(14),//14,
        marginTop: verticalScale(5),
        marginRight: scale(5),
        fontWeight: 'bold'
    },

    text_bold: {
        fontWeight: 'bold'
    },

    tini_camera_view: {
        height: verticalScale(16),
        flexDirection: 'row',
        marginTop: verticalScale(3),
        alignItems: 'center',
        // marginBottom : verticalScale(3)
    },

    tini_camera_img: {
        width: scale(16),
        height: verticalScale(16),
        resizeMode: 'contain'
    },

    timestamp_text: {
        marginLeft: scale(5),
        fontSize: fontSize(12, -scale(2)),//12,
        color: '#bdbdbd',
        // marginBottom: verticalScale(3)
    }
});