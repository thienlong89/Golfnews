import React from 'react';
import { Platform, StyleSheet, View,Dimensions } from 'react-native';
import Touchable from 'react-native-platform-touchable';
import ScorePlayerItemView from './ScorePlayerItemView'
import { Avatar } from 'react-native-elements';
// import MyView from '../../../Core/View/MyView';
import BaseComponent from '../../../Core/View/BaseComponent';

import {scale, verticalScale, fontSize} from '../../../Config/RatioScale';

const listDefault = [0, 0, 0, 0];

export default class PlayerListView extends BaseComponent {

    static defaultProps = {
        // listPlayer: [],
        userSelected: 0,
        isHostUser: false
    }

    constructor(props) {
        super(props);
        this.isHostUser = this.props.isHostUser;
        this.state = {
            item_select: this.props.userSelected,
            listPlayer: [],
        }
    }

    initData(isHostUser) {
        this.isHostUser = isHostUser;
    }

    onSelectPlayerListener(item, index) {
        this.setState({
            item_select: index
        });
        if (this.props.onPlayerSelected != null) {
            this.props.onPlayerSelected(item, index);
        }
    }

    setPlayerSelected(position) {
        this.setState({
            item_select: position
        });
    }

    onAddPlayerListener(index) {
        if (this.props.onAddPlayerClick != null) {
            this.props.onAddPlayerClick(index);
        }
    }

    onGuestAddPlayerWarning() {
        if (this.props.onGuestAddPlayerWarning != null) {
            this.props.onGuestAddPlayerWarning();
        }
    }

    onLongPressPlayerListener(item, index) {
        if (this.props.onLongPressPlayerListener != null) {
            this.props.onLongPressPlayerListener(item, index);
        }
    }

    setPlayerList(playerList) {
        console.log('setPlayerList', playerList.length);
        this.setState({
            listPlayer: playerList
        })
    }

    render() {
        console.log('PlayerListView.render');
        let listPlayerProps = this.state.listPlayer;
        let playerList = [...listPlayerProps, ...listDefault.slice(0, 4 - listPlayerProps.length)];
        let players = playerList.map((item, index) => {
            if (typeof item === 'object') {
                return (
                    <Touchable style={style = styles.touchable_player}
                        onPress={() => this.onSelectPlayerListener(item, index)}
                        onLongPress={() => this.onLongPressPlayerListener(item, index)}>
                        <View style={[style = styles.background_player, { borderColor: this.state.item_select === index ? '#00ABA7' : '#FFFFFF' }]}>
                            <ScorePlayerItemView player={item} />

                            <View style={[styles.cover, { opacity: this.state.item_select === index ? 0 : 0.7 }]} />
                        </View>

                    </Touchable>
                );
            } else {
                return (
                    <Touchable style={{ flexDirection: 'row', flex: 1, justifyContent: 'center' }}
                        onPress={!this.isHostUser ? this.onGuestAddPlayerWarning.bind(this) : this.onAddPlayerListener.bind(this, index)}>
                        <Avatar 
                            width={verticalScale(50)}
                            height={verticalScale(50)}
                            //medium 
                            rounded
                            containerStyle={styles.avatar_container}
                            avatarStyle={styles.avatar_style}
                            source={this.getResources().ic_add_player}
                        />
                    </Touchable>
                )
            }
        })

        return (
            <View style={styles.player_group_all} >
                {players}
            </View>

        );
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center',
        paddingBottom: verticalScale(10)
    },
    player_group_all: {
        flexDirection: 'row',
        paddingTop: verticalScale(5),
        paddingLeft: scale(5),
        paddingRight: scale(5),
        paddingBottom: verticalScale(5)
    },
    player_group: {
        flexDirection: 'row',
        paddingLeft: scale(15),
        paddingTop: verticalScale(15),
        paddingBottom: verticalScale(15),
        justifyContent: 'center',
        alignItems: 'center'
    },
    player_title: {
        color: '#454545',
        fontSize: fontSize(15,scale(1)),// 15,
        marginRight: scale(20),
        justifyContent: 'center'
    },
    player_index: {
        height: verticalScale(40),
        width: verticalScale(40),
        borderRadius: verticalScale(20),
        textAlign: 'center',
        textAlignVertical: 'center',
        fontSize: fontSize(17,scale(3)),// 17,
        marginRight: scale(13),
        alignSelf: 'center'
    },
    avatar_container: {
    },
    avatar_style: {
        borderColor: '#EFEFF4',
        borderWidth: scale(0.5)
    },
    touchable_player: {
        flexDirection: 'row',
        flex: 1
    },
    background_player: {
        flexDirection: 'row',
        flex: 1,
        borderWidth: scale(1),
        borderRadius: scale(5)
    },
    cover: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        top: 0,
        backgroundColor: '#ffffff'
    },
    delete_container: {
        position: 'absolute',
        justifyContent: 'center',
        alignItems: 'center',
        right: 0,
        top: 0
    },
    delete_icon: {
        width: verticalScale(17),
        height: verticalScale(17),
        resizeMode: 'contain'
    }

});