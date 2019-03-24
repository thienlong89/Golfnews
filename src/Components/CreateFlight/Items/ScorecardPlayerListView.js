import React from 'react';
import { Platform, StyleSheet, Text, View,Dimensions } from 'react-native';
import Touchable from 'react-native-platform-touchable';
import ScorecardPlayerItemView from './ScorecardPlayerItemView';
import {scale, verticalScale, moderateScale} from '../../../Config/RatioScale';
import BaseComponent from '../../../Core/View/BaseComponent';
// let{width,height} = Dimensions.get('window');

export default class ScorecardPlayerListView extends BaseComponent {

    static defaultProps = {
        listPlayer: []
    }

    constructor(props) {
        super(props);
        this.state = {
            item_select: 0
        }
    }

    onSelectPlayerListener(item, index) {
        this.setState({
            item_select: index
        });
        if (this.props.onPlayerSelected != null) {
            this.props.onPlayerSelected(item, index);
        }
    }

    onSelectPlayerPosition(position){
        let listPlayerProps = this.props.listPlayer;
        this.setState({
            item_select: position
        });
        if (this.props.onPlayerSelected != null) {
            this.props.onPlayerSelected(listPlayerProps[position], position);
        }
    }

    render() {
        let listPlayerProps = this.props.listPlayer;
        let players = listPlayerProps.map((item, index) => {
            return (
                <Touchable style={styles.touchable_player}
                    onPress={() => this.onSelectPlayerListener(item, index)}>
                    <View style={[styles.background_player, { borderColor: this.state.item_select === index ? '#00ABA7' : '#FFFFFF' }]}>
                        <ScorecardPlayerItemView player={item} playerIndex={index + 1} />
                        <View style={[styles.cover, { opacity: item.getConfirmed() === 1 ? 0 : 0.7 }]} />
                    </View>

                </Touchable>
            );
        });

        if (listPlayerProps.length < 4) {
            for (let i = listPlayerProps.length; i < 4; i++) {
                players.push(
                    <View style={{ flex: 1 }} />
                );
            }
        }

        return (
            <View style={styles.player_group_all} >
                {players}
            </View>

        );
    }

    componentDidMount() {
        let listPlayerProps = this.props.listPlayer;
        if (listPlayerProps.length > 0) {
            this.onSelectPlayerListener(listPlayerProps[0], 0)
        }

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
        flex: 1,
        flexDirection: 'row',
        paddingLeft: scale(5),
        paddingRight: scale(5)
    },
    touchable_player: {
        flexDirection: 'row',
        flex: 1
    },
    background_player: {
        flexDirection: 'row',
        flex: 1,
        borderWidth: 1,
        borderRadius: scale(5)
    },
    cover: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        top: 0,
        backgroundColor: '#ffffff',
        borderRadius: scale(5)
    }

});