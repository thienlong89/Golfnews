import React from 'react';
import { Platform, StyleSheet, Text, View, Image, Dimensions } from 'react-native';
import Touchable from 'react-native-platform-touchable';
import BaseComponent from '../../../Core/View/BaseComponent';
// import MyView from '../../../Core/View/MyView';

import {scale, verticalScale, fontSize} from '../../../Config/RatioScale';
let{width,height} = Dimensions.get('window');

const DIRECTION = ['FAILSE', 'DRAWN', 'NORMAL', 'SLICE', 'FAIRWAY']

export default class HoleDirectionView extends BaseComponent {

    static defaultProps = {
        directionPosition: 2,
        disableChangeScore: false,
        holeDirection: ''
    }

    constructor(props) {
        super(props);
        let position = DIRECTION.findIndex((teeDirection) => {
            return this.props.holeDirection === teeDirection;
        });
        this.state = {
            directionPosition:  position != -1 ? position : 2,
            disableChangeScore: this.props.disableChangeScore
        }
    }

    setData(direction, disableChangeScore) {
        let position = DIRECTION.findIndex((teeDirection) => {
            return direction === teeDirection;
        });
        this.setState({
            directionPosition: position != -1 ? position : 2,
            disableChangeScore: disableChangeScore
        });
    }

    render() {
        return (
            <View style={styles.direction_container}>
                <Touchable onPress={this.state.disableChangeScore ? this.onGuestCannotChangeClick.bind(this) : this.onChangeHoleDirection.bind(this, 0)}>
                    <View style={styles.direction_item}>
                        <Image
                            style={styles.direction_icon}
                            source={this.state.directionPosition === 0 ? this.getResources().ic_failse_normal : this.getResources().ic_failse_normal}
                            tintColor={this.state.directionPosition === 0 ? '#00ABA7' : '#6E6E6E'}
                        />
                        <Text allowFontScaling={global.isScaleFont} style={[styles.direction_text, { color: this.state.directionPosition === 0 ? '#00ABA7' : '#6E6E6E' }]}>{DIRECTION[0]}</Text>
                    </View>
                </Touchable>

                <Touchable onPress={this.state.disableChangeScore ? this.onGuestCannotChangeClick.bind(this) : this.onChangeHoleDirection.bind(this, 1)}>
                    <View style={styles.direction_item}>
                        <Image
                            style={styles.direction_icon}
                            source={this.state.directionPosition === 1 ? this.getResources().ic_drawn_normal : this.getResources().ic_drawn_normal}
                            tintColor={this.state.directionPosition === 1 ? '#00ABA7' : '#6E6E6E'}
                        />
                        <Text allowFontScaling={global.isScaleFont} style={[styles.direction_text, { color: this.state.directionPosition === 1 ? '#00ABA7' : '#6E6E6E' }]}>{DIRECTION[1]}</Text>
                    </View>
                </Touchable>

                <Touchable onPress={this.state.disableChangeScore ? this.onGuestCannotChangeClick.bind(this) : this.onChangeHoleDirection.bind(this, 2)}>
                    <View style={styles.direction_item}>
                        <Image
                            style={styles.direction_icon}
                            source={this.state.directionPosition === 2 ? this.getResources().ic_normal_normal : this.getResources().ic_normal_normal}
                            tintColor={this.state.directionPosition === 2 ? '#00ABA7' : '#6E6E6E'}
                        />
                        <Text allowFontScaling={global.isScaleFont} style={[styles.direction_text, { color: this.state.directionPosition === 2 ? '#00ABA7' : '#6E6E6E' }]}>{DIRECTION[2]}</Text>
                    </View>
                </Touchable>

                <Touchable onPress={this.state.disableChangeScore ? this.onGuestCannotChangeClick.bind(this) : this.onChangeHoleDirection.bind(this, 3)}>
                    <View style={styles.direction_item}>
                        <Image
                            style={styles.direction_icon}
                            source={this.state.directionPosition === 3 ? this.getResources().ic_slice_normal : this.getResources().ic_slice_normal}
                            tintColor={this.state.directionPosition === 3 ? '#00ABA7' : '#6E6E6E'}
                        />
                        <Text allowFontScaling={global.isScaleFont} style={[styles.direction_text, { color: this.state.directionPosition === 3 ? '#00ABA7' : '#6E6E6E' }]}>{DIRECTION[3]}</Text>
                    </View>
                </Touchable>

                <Touchable onPress={this.state.disableChangeScore ? this.onGuestCannotChangeClick.bind(this) : this.onChangeHoleDirection.bind(this, 4)}>
                    <View style={styles.direction_item}>
                        <Image
                            style={styles.direction_icon}
                            source={this.state.directionPosition === 4 ? this.getResources().ic_fairway_normal : this.getResources().ic_fairway_normal}
                            tintColor={this.state.directionPosition === 4 ? '#00ABA7' : '#6E6E6E'}
                        />
                        <Text allowFontScaling={global.isScaleFont} style={[styles.direction_text, { color: this.state.directionPosition === 4 ? '#00ABA7' : '#6E6E6E' }]}>{DIRECTION[4]}</Text>
                    </View>
                </Touchable>

            </View>
        );

    }

    onChangeHoleDirection(position) {
        this.setState({ directionPosition: position });
        if (this.props.onUpdateHoleDirection) {
            this.props.onUpdateHoleDirection(DIRECTION[position]);
        }
    }

    onGuestCannotChangeClick() {
        if (this.props.onGuestCannotChangeClick) {
            this.props.onGuestCannotChangeClick();
        }
    }

}

const styles = StyleSheet.create({
    direction_container: {
        flexDirection: 'row',
        marginLeft: scale(10),
        marginRight: scale(10),
        marginBottom: verticalScale(10),
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    direction_item: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    direction_icon: {
        height: verticalScale(20),
        resizeMode: 'contain'
    },
    direction_text: {
        fontSize: fontSize(14),// 14
    }
});