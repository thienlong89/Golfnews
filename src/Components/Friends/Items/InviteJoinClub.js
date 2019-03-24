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

export default class InviteJoinClub extends BaseComponent {

    static defaultProps = {
        club: {}
    }

    constructor(props) {
        super(props);

        this.state = {

        }

        this.onAcceptJoinClub = this.onAcceptJoinClub.bind(this);
        this.onDenyJoinClub = this.onDenyJoinClub.bind(this);

    }

    render() {
        let {
            club
        } = this.props;
        console.log('InviteJoinClub', club)
        if (Object.keys(club).length) {
            return (
                <View style={styles.container}>
                    <Image
                        style={styles.img_club}
                        source={{ uri: club.logo }}
                    />
                    <View style={styles.view_right}>
                        <Text allowFontScaling={global.isScaleFont} style={styles.txt_introduce}>{this.t('you_added_club').format(club.name)}</Text>
                        <View style={styles.view_confirm}>
                            <TouchableOpacity onPress={this.onAcceptJoinClub}
                                style={styles.touchable_accept}>
                                <Text allowFontScaling={global.isScaleFont} style={styles.txt_accept}>{this.t('accept')}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={this.onDenyJoinClub}
                                style={styles.touchable_deny}>
                                <Text allowFontScaling={global.isScaleFont} style={styles.txt_deny}>{this.t('denied')}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                </View>
            );
        } else {
            return null;
        }

    }

    onAcceptJoinClub() {
        if (this.props.onAcceptJoinClub) {
            this.props.onAcceptJoinClub();
        }
    }

    onDenyJoinClub() {
        if (this.props.onDenyJoinClub) {
            this.props.onDenyJoinClub();
        }
    }

}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#FFFFFF',
        flexDirection: 'row',
        // justifyContent: 'center',
        alignItems: 'center',
        marginBottom: scale(10)
    },
    img_club: {
        width: scale(60),
        height: scale(60),
        resizeMode: 'contain'
    },
    view_right: {
        flex: 1,
        justifyContent: 'space-between',
        marginLeft: scale(10)
    },
    view_confirm: {
        flexDirection: 'row'
    },
    touchable_accept: {
        backgroundColor: '#00ABA7',
        minWidth: scale(100),
        minHeight: scale(35),
        borderRadius: scale(5),
        justifyContent: 'center',
        alignItems: 'center'
    },
    touchable_deny: {
        backgroundColor: '#fff',
        minWidth: scale(100),
        minHeight: scale(40),
        borderRadius: scale(5),
        justifyContent: 'center',
        alignItems: 'center',
        borderColor: '#B3B3B3',
        borderWidth: 1,
        marginLeft: scale(10)
    },
    txt_introduce: {
        fontSize: fontSize(16),
        color: '#5E5E5E'
    },
    txt_accept: {
        fontSize: fontSize(15),
        color: '#fff',
        marginLeft: scale(8),
        marginRight: scale(8),
        paddingTop: scale(5),
        paddingBottom: scale(5)
    },
    txt_deny: {
        fontSize: fontSize(15),
        color: '#5E5E5E',
        marginLeft: scale(8),
        marginRight: scale(8),
        paddingTop: scale(5),
        paddingBottom: scale(5)
    }
});