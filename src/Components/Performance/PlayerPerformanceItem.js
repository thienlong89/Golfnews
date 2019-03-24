import React from 'react';
import {
    Platform,
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    Image
} from 'react-native';
import Touchable from 'react-native-platform-touchable';
import BaseComponent from '../../Core/View/BaseComponent';
import { scale, verticalScale, moderateScale, fontSize } from '../../Config/RatioScale';
import CustomAvatar from '../Common/CustomAvatar';
import { Avatar } from 'react-native-elements';

export default class PlayerPerformanceItem extends BaseComponent {

    static defaultProps = {
        playerList: []
    }

    constructor(props) {
        super(props);

        this.state = {
            playerList: this.props.playerList
        }

    }

    render() {
        let {
            playerList
        } = this.state;

        let itemPlayer = playerList.map((dataItem, index) => {
            if (index === 0) return <View style={[styles.view_item_header, {flex: 1.3}]} />;
            if (index === 1) {
                return (
                    <View style={[styles.view_item_header, {flex: 1}]}>
                        <CustomAvatar
                            width={scale(55)}
                            height={scale(55)}
                            uri={dataItem.avatar}
                        />
                    </View>
                )
            } else {
                console.log('dataItem', dataItem)
                if (dataItem != -1) {
                    return (
                        <View style={[styles.view_item_header, {flex: 1}]}>
                            <View>
                                <CustomAvatar
                                    width={scale(55)}
                                    height={scale(55)}
                                    uri={dataItem.avatar}
                                />
                                <TouchableOpacity style={styles.touchable_delete}
                                    onPress={this.onDeletePlayer.bind(this, index)}>
                                    <Image
                                        style={styles.img_delete}
                                        source={this.getResources().ic_remove} />
                                </TouchableOpacity>
                            </View>
                        </View>
                    )
                } else {
                    return (
                        <View style={[styles.view_item_header, {flex: 1}]}>
                            <Avatar rounded
                                containerStyle={[{ backgroundColor: '#FFF' }]}
                                avatarStyle={styles.avatar_style}
                                source={this.getResources().ic_add_player}
                                width={scale(55)}
                                height={scale(55)}
                                onPress={this.onAddPlayerPress.bind(this, index)}
                            />
                        </View>
                    )
                }

            }
        })

        return (
            <View style={[styles.container]}>
                {itemPlayer}
            </View>
        );
    }



    componentDidMount() {

    }

    onDeletePlayer(index) {
        if (this.props.onDeletePlayer) {
            this.props.onDeletePlayer(index);
        }
    }

    onAddPlayerPress(index) {
        if (this.props.onAddPlayerPress) {
            this.props.onAddPlayerPress(index);
        }
    }

}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#FFFFFF',
        flexDirection: 'row',
        marginTop: scale(10)
    },
    view_item_header: {
        borderColor: '#D4D4D4',
        borderWidth: 0.5,
        height: scale(80),
        justifyContent: 'center',
        alignItems: 'center'
    },
    view_item: {
        borderColor: '#D4D4D4',
        borderWidth: 0.5,
        height: scale(80),
        justifyContent: 'center',
        alignItems: 'center'
    },
    txt_data: {
        color: '#3A3A3A',
        opacity: 0.8,
        fontSize: fontSize(16),
        marginLeft: scale(5)
    },
    touchable_delete: {
        position: 'absolute',
        right: 0,
        width: 40,
        height: 40,
        alignItems: 'flex-end'
    },
    img_delete: {
        width: 20,
        height: 20,
        resizeMode: 'contain',
        tintColor: 'red'
    },
    avatar_style: {
        borderColor: '#00ABA7',
        borderWidth: 2,
    },
});