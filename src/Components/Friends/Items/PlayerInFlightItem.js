import React from 'react';
import {
    Platform,
    StyleSheet,
    Text,
    View,
    BackHandler,
    Image,
    TouchableOpacity,
    ScrollView
} from 'react-native';
import Touchable from 'react-native-platform-touchable';
import BaseComponent from '../../../Core/View/BaseComponent';
import CustomAvatar from '../../Common/CustomAvatar';
import MyView from '../../../Core/View/MyView';

export default class PlayerInFlightItem extends BaseComponent {

    constructor(props) {
        super(props);
        this.userProfile = this.getUserInfo().getUserProfile();
        this.user_ids = [this.userProfile.getId()]
        this.state = {
            playerList: [this.userProfile]
        }
    }

    renderPlayerList() {
        let { playerList } = this.state;

        let playerItems = playerList.map((player, index) => {
            let avatar = player.getAvatar();
            let name = index === 0 ? player.getFullName() : player.getFullname();
            return (
                <View style={styles.view_item_player}>
                    <View style={styles.view_player}>
                        <CustomAvatar
                            width={50}
                            height={50}
                            uri={avatar}
                        />

                        <MyView style={styles.touchable_delete}
                            hide={index === 0}>
                            <TouchableOpacity
                                onPress={this.onRemovePlayerPress.bind(this, player, index)}>
                                <Image
                                    style={styles.img_delete}
                                    source={this.getResources().delete} />
                            </TouchableOpacity>
                        </MyView>

                    </View>
                    <Text allowFontScaling={global.isScaleFont} style={styles.txt_player_name}
                        numberOfLines={1}>
                        {name}
                    </Text>
                </View>

            )
        })

        return (
            <ScrollView style={styles.view_players}
                horizontal={true}>
                {playerItems}
            </ScrollView>
        )
    }

    render() {

        let { playerList } = this.state;

        return (
            <View style={styles.container}>
                <View style={styles.view_header}>
                    <Text allowFontScaling={global.isScaleFont} style={styles.txt_player_in_flight}>{this.t('player_in_flight').format(playerList.length)}</Text>

                    <MyView hide={playerList.length === 4} style={{ height: 25 }}>
                        <TouchableOpacity onPress={this.onAddPlayerPress.bind(this)}>
                            <Image
                                style={styles.img_icon_add}
                                source={this.getResources().ic_add_member} />
                        </TouchableOpacity>
                    </MyView>

                </View>

                {this.renderPlayerList()}

            </View>
        );
    }

    onRemovePlayerPress(player, index) {
        this.user_ids.splice(index, 1);
        this.state.playerList.splice(index, 1);
        this.setState({
            playerList: this.state.playerList
        });
    }

    onAddPlayerPress() {
        if (this.state.playerList.length < 4) {
            this.props.navigation.navigate('search_user_view',
                {
                    onSearchCallback: this.onSearchCallback.bind(this),
                    'user_ids': this.user_ids
                });
        }

    }

    onSearchCallback(friendItemModel) {
        if (friendItemModel != null) {
            console.log('onSearchCallback', friendItemModel)
            this.user_ids.push(friendItemModel.getId());
            this.setState({
                playerList: [...this.state.playerList, friendItemModel]
            });
        }
    }

}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#FFFFFF',
        padding: 10
    },
    view_header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20
    },
    view_players: {
        flexDirection: 'row'
    },
    txt_player_in_flight: {
        fontSize: 16,
        color: '#737373'
    },
    img_icon_add: {
        width: 25,
        height: 25,
        resizeMode: 'contain',
        tintColor: '#858585',
    },
    view_player: {
        width: 60,
        marginRight: 20
    },
    view_item_player: {
        alignItems: 'center',
        maxWidth: 80
    },
    txt_player_name: {
        fontSize: 12,
        color: '#828282',
        marginTop: 5
    },
    img_delete: {
        height: 20,
        width: 20,
        resizeMode: 'contain'
    },
    touchable_delete: {
        position: 'absolute',
        right: 0,
        top: 0
    }
});