import React from 'react';
import {
    Platform,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import Touchable from 'react-native-platform-touchable';
import BaseComponent from '../../../Core/View/BaseComponent';
import Networking from '../../../Networking/Networking';
import ApiService from '../../../Networking/ApiService';
import { scale, verticalScale, moderateScale } from '../../../Config/RatioScale';
import InviteJoinClub from './InviteJoinClub';
import InvitePermissionClub from './InvitePermissionClub';

export default class InviteJoinClubList extends BaseComponent {

    static defaultProps = {

    }

    constructor(props) {
        super(props);

        this.state = {
            inviteList: [],
            invitePermissionList: []
        }

    }

    render() {
        let {
            inviteList,
            invitePermissionList
        } = this.state;

        let clubView = inviteList.map((clubItem, index) => {
            if (index === 0) {
                return (
                    <InviteJoinClub
                        club={clubItem.getClub()}
                        onAcceptJoinClub={this.onAcceptJoinClub.bind(this, clubItem, index)}
                        onDenyJoinClub={this.onDenyJoinClub.bind(this, clubItem, index)} />
                )
            } else {
                return (
                    <View>
                        <View style={styles.line} />
                        <InviteJoinClub
                            club={clubItem.getClub()}
                            onAcceptJoinClub={this.onAcceptJoinClub.bind(this, clubItem, index)}
                            onDenyJoinClub={this.onDenyJoinClub.bind(this, clubItem, index)} />
                    </View>
                )
            }
        })


        let invitePermissionListView = invitePermissionList.map((clubItem, index) => {
            if (index === 0 && inviteList.length === 0) {
                return (
                    <InvitePermissionClub
                        club={clubItem.getClub()}
                        type={clubItem.getTypePermission()}
                        onAcceptJoinClub={this.onAcceptPermissionClub.bind(this, clubItem, index)}
                        onDenyJoinClub={this.onDenyPermissionClub.bind(this, clubItem, index)} />
                )
            } else {
                return (
                    <View>
                        <View style={styles.line} />
                        <InvitePermissionClub
                            club={clubItem.getClub()}
                            type={clubItem.getTypePermission()}
                            onAcceptJoinClub={this.onAcceptPermissionClub.bind(this, clubItem, index)}
                            onDenyJoinClub={this.onDenyPermissionClub.bind(this, clubItem, index)} />
                    </View>
                )
            }
        })

        return (
            <View style={[styles.container, styles.border_shadow, inviteList.length > 0 || invitePermissionList.length > 0 ? {
                padding: scale(10),
                marginLeft: scale(10),
                marginRight: scale(10),
                marginTop: scale(10)
            } : {}]}>

                {clubView}
                {invitePermissionListView}
            </View>
        );
    }

    setInviteClubList(inviteList, invitePermissionList = []) {
        console.log('invitePermissionList', invitePermissionList)
        this.setState({
            inviteList: inviteList,
            invitePermissionList: invitePermissionList
        })
    }

    onAcceptJoinClub(clubItem, index) {
        if (this.props.onAcceptJoinClub) {
            this.props.onAcceptJoinClub(clubItem, index);
        }
    }

    onDenyJoinClub(clubItem, index) {
        if (this.props.onDenyJoinClub) {
            this.props.onDenyJoinClub(clubItem, index);
        }
    }

    onAcceptPermissionClub(clubItem, index, type) {
        if (this.props.onAcceptPermissionClub) {
            this.props.onAcceptPermissionClub(clubItem, index, type);
        }
    }

    onDenyPermissionClub(clubItem, index, type) {
        if (this.props.onDenyPermissionClub) {
            this.props.onDenyPermissionClub(clubItem, index, type);
        }
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#FFFFFF',

    },
    border_shadow: {
        elevation: 4,
        shadowOffset: { width: 0, height: -3 },
        shadowColor: "grey",
        shadowOpacity: 1,
        shadowRadius: scale(8),
        borderRadius: scale(8),

    },
    line: {
        height: 1,
        backgroundColor: '#D6D4D4',
        marginBottom: 8,
        marginRight: 8,
        marginLeft: 8
    }
});