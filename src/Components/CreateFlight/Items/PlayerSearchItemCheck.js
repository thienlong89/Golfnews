import React from 'react';
import {
    Platform,
    StyleSheet,
    Text,
    View,
    Image,
    TouchableOpacity
} from 'react-native';
import Touchable from 'react-native-platform-touchable';
import BaseComponent from '../../../Core/View/BaseComponent';
import Networking from '../../../Networking/Networking';
import ApiService from '../../../Networking/ApiService';
import { scale, verticalScale, moderateScale, fontSize } from '../../../Config/RatioScale';
import CustomAvatar from '../../Common/CustomAvatar';

export default class PlayerSearchItemCheck extends BaseComponent {

    static defaultProps = {
        player: '',
        index: 0
    }

    constructor(props) {
        super(props);

        this.state = {

        }
        this.onRemovePlayerPress = this.onRemovePlayerPress.bind(this);
    }

    renderRemoveBtn(index) {
        if (index != 0) {
            return (
                <TouchableOpacity style={styles.touchable_remove}
                    onPress={this.onRemovePlayerPress}>
                    <Image
                        style={styles.img_remove}
                        source={this.getResources().ic_remove} />
                </TouchableOpacity>
            )
        } else {
            return null;
        }
    }

    render() {
        let {
            player,
            index
        } = this.props;
        console.log('player', player);
        let playerName = '';
        try {
            playerName = player.getFullName();
        } catch (error) {
            playerName = player.getFullname();
        }

        return (
            <View style={styles.container}>
                <View>
                    <CustomAvatar
                        width={scale(50)}
                        height={scale(50)}
                        // onAvatarClick={this.onCreateEventPress}
                        uri={player.getAvatar()} />
                    {this.renderRemoveBtn(index)}
                </View>
                {/* <Text allowFontScaling={global.isScaleFont} style={styles.txt_player_name}>{playerName}</Text> */}
                <Text allowFontScaling={global.isScaleFont} style={styles.txt_player_id}>{player.getUserId()}</Text>

            </View>
        );
    }

    onBackPress() {
        if (this.props.navigation) {
            this.props.navigation.goBack();
        }
    }

    componentDidMount() {
    }

    onRemovePlayerPress() {
        let {
            player,
            index,
            onRemovePlayerPress
        } = this.props;
        if (onRemovePlayerPress) {
            onRemovePlayerPress(player, index);
        }
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
    },
    txt_player_name: {
        fontWeight: 'bold',
        color: 'black',
        fontSize: fontSize(14),// 14)
        marginTop: scale(5)
    },
    txt_player_id: {
        color: '#adadad',
        fontSize: fontSize(13, -scale(1)),// 13
    },
    img_remove: {
        width: scale(20),
        height: scale(20),
        resizeMode: 'contain',
        tintColor: 'red'
    },
    touchable_remove: {
        position: 'absolute',
        right: -12
    }
});