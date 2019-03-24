import React from 'react';
import {
    Platform,
    StyleSheet,
    Text,
    View,
    Dimensions,
    TouchableOpacity
} from 'react-native';
import Touchable from 'react-native-platform-touchable';
import BaseComponent from '../../../../Core/View/BaseComponent';
import Networking from '../../../../Networking/Networking';
import ApiService from '../../../../Networking/ApiService';
import ComHeader from './ComHeader';
import { scale, verticalScale, moderateScale, fontSize } from '../../../../Config/RatioScale';
import CustomAvatar from '../../../Common/CustomAvatar';
import ListFriendModel from '../../../../Model/User/ListFriendModel';

const { width, height } = Dimensions.get('window');

export default class ComFriends extends BaseComponent {

    static defaultProps = {

    }

    constructor(props) {
        super(props);
        this.userProfile = this.getUserInfo().getUserProfile();
        this.state = {
            friendList: [],
            totalFriend: 0
        }
        this.maxNumber = 0;
        this.w = scale(40);

        this.onViewAllFriend = this.onViewAllFriend.bind(this);
    }

    renderEmptyFriend() {
        return (
            <Text allowFontScaling={global.isScaleFont} style={styles.txt_empty_friend}>{this.t('no_friends')}</Text>
        )
    }

    renderFriendList(friendList, totalFriend) {
        let w = scale(40);
        // let extras = totalFriend - friendList.length;
        let friendViews = friendList.map((player, index) => {
            if (totalFriend > this.maxNumber && index < this.maxNumber - 1 || totalFriend<=this.maxNumber) {
                return (
                    <CustomAvatar
                        width={w}
                        height={w}
                        containerStyle={{ marginRight: 5 }}
                        view_style={{ marginRight: 5 }}
                        uri={player.getAvatar()}
                        onAvatarClick={this.onViewAllFriend} />
                )
            } else {
                return (
                    <View style={{ width: w, height: w, borderRadius: w / 2, justifyContent: 'center', alignItems: 'center' }}>
                        <CustomAvatar
                            width={w}
                            height={w}
                            // style={{ marginRight: 5 }}
                            uri={player.getAvatar()}
                            onAvatarClick={this.onViewAllFriend} />
                        <View style={[styles.view_member_more, {
                            width: w,
                            height: w,
                            borderRadius: w / 2,
                        }]} />
                        <View style={styles.txt_member_more}>
                            <Text allowFontScaling={global.isScaleFont} style={styles.txt_count}>{`•••`}</Text>
                        </View>

                    </View>

                )
            }
        })

        return (
            <View style={styles.view_friend_list}>
                {totalFriend > 0 ? friendViews : this.renderEmptyFriend()}
            </View>
        )
    }

    render() {
        let {
            friendList,
            totalFriend
        } = this.state;
        return (
            <TouchableOpacity style={styles.container}
                onPress={this.onViewAllFriend}>
                {/* <ComHeader title={`${this.t('is_friend')} (${totalFriend})`} /> */}
                <View style={styles.view_header}>
                    <Text allowFontScaling={global.isScaleFont} style={{ fontSize: fontSize(16, scale(2)), color: '#444' }}>{`${this.t('is_friend')} (${totalFriend})`}</Text>
                </View>
                {this.renderFriendList(friendList, totalFriend)}
            </TouchableOpacity>
        );
    }

    componentDidMount() {
        this.maxNumber = Math.round((width - scale(20)) / scale(50));
        this.requestGetFriend(this.maxNumber);
    }

    requestGetFriend(number) {
        let self = this;
        let url = this.getConfig().getBaseUrl() + ApiService.user_get_list_friend_by_uid(number);
        console.log('url', url);
        Networking.httpRequestGet(url, (jsonData) => {
            self.model = new ListFriendModel();
            self.model.parseData(jsonData);
            if (self.model.getErrorCode() === 0) {
                self.setState({
                    friendList: self.model.getFriendList(),
                    totalFriend: self.model.getTotalFriend()
                })
            }
        }, () => {
            //time out
            // console.log('showErrorMsg7')
            // self.showErrorMsg(self.t('time_out'))
        });
    }

    onViewAllFriend() {
        if (this.props.onViewAllFriend) {
            this.props.onViewAllFriend();
        }
    }
}

const styles = StyleSheet.create({
    container: {
        borderColor: 'rgba(0,0,0,0.25)',
        borderRadius: 5,
        borderWidth: 1,
        marginLeft: scale(10),
        marginRight: scale(10),
        marginTop: verticalScale(10)
    },
    view_header: {
        borderTopLeftRadius: 5,
        borderTopRightRadius: 5,
        backgroundColor: '#efeff4',
        height: verticalScale(30),
        justifyContent: "center",
        alignItems: 'center'
    },
    view_friend_list: {
        flexDirection: 'row',
        marginTop: scale(5),
        marginBottom: scale(5),
        justifyContent: 'center',
        alignItems: 'center'
    },
    view_member_more: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#000',
        opacity: 0.5
    },
    txt_member_more: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        justifyContent: 'center',
        alignItems: 'center'
    },
    txt_count: {
        color: '#fff',
        fontSize: fontSize(15)
    },
    txt_empty_friend: {
        color: '#707070',
        fontSize: fontSize(15)
    }
});