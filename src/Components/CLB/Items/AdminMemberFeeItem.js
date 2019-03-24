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
import moment from 'moment';

const TIME_FORMAT = `DD/MM/YYYY`;

export default class AdminMemberFeeItem extends BaseComponent {

    static defaultProps = {
        index: 1,
        playerItem: {}
    }

    constructor(props) {
        super(props);

        this.state = {

        }
        this.onItemPress = this.onItemPress.bind(this);
        this.onEditExpertDate = this.onEditExpertDate.bind(this);
    }

    refreshItem() {
        this.setState({});
    }

    render() {
        let {
            index,
            playerItem
        } = this.props;

        if (!playerItem) return null;

        let player = playerItem.Users;
        if (!player) return null;

        let avatar = player.getAvatar();
        let playerName = player.getFullName();
        let teeColor = player.getDefaultTeeID();
        let country = player.getUserId();
        let feeType = playerItem.is_pay;
        console.log('playerItem.date_expried_display ', playerItem.date_expried_display)
        let expertDate = playerItem.date_expried_display ? moment(playerItem.date_expried_display).format(TIME_FORMAT) : '';

        return (
            <TouchableOpacity style={styles.touchable_view}
                onPress={this.onItemPress}>

                <View style={styles.container}>
                    <View style={styles.view_stt}>
                        <Text allowFontScaling={global.isScaleFont} style={styles.txt_index}>{index}</Text>
                    </View>
                    <View style={styles.view_line} />
                    
                    <View style={styles.view_player_name}>
                        <CustomAvatar
                            containerStyle={styles.avatar_image}
                            uri={avatar}
                            width={scale(50)}
                            height={scale(50)}
                        />
                        <View style={{ minHeight: scale(50), justifyContent: 'space-between', marginLeft: scale(5), flex: 1 }}>
                            <Text allowFontScaling={global.isScaleFont} style={styles.txt_player_name}>{playerName}</Text>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <View style={[styles.view_tee_color, { backgroundColor: teeColor }]} />
                                <Text allowFontScaling={global.isScaleFont} style={styles.txt_country}>{country}</Text>
                            </View>
                        </View>
                    </View>

                    <View style={styles.view_line} />
                    <View style={styles.view_birthday}>
                    <View style={[styles.view_fee_status, { backgroundColor: feeType === 1 ? '#00AB4F' : feeType === 0 ? 'red' : 'orange' }]}>
                            <Text allowFontScaling={global.isScaleFont} style={styles.txt_birthday}>
                                {feeType === 1 ? this.t('fees_paid') : feeType === 0 ? this.t('no_fee_paid') : feeType === 2 ? this.t('nearly_expired') : ''}
                            </Text>
                        </View>
                    </View>

                    <View style={styles.view_line} />
                    
                    <TouchableOpacity style={styles.view_hdc}
                        onPress={this.onEditExpertDate}>
                        <Text allowFontScaling={global.isScaleFont} style={styles.txt_expert_date}>{feeType != 0 ? expertDate : '--/--/----'}</Text>
                        <Image style={styles.img_edit}
                            source={this.getResources().pen} />
                    </TouchableOpacity>
                </View>
            </TouchableOpacity>
        );
    }

    onItemPress() {
        if (this.props.onItemPress) {
            this.props.onItemPress(this.props.playerItem.Users);
        }
    }

    onEditExpertDate() {
        if (this.props.onEditExpertDate) {
            this.props.onEditExpertDate(this.props.playerItem, this.props.index);
        }
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        flexDirection: 'row',
        borderRadius: scale(10)
    },
    view_index: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    txt_index: {
        color: '#666666',
        fontSize: fontSize(15)
    },
    view_center: {
        flex: 5,
        flexDirection: 'row',
        paddingTop: scale(10),
        paddingBottom: scale(10),
        alignItems: 'center',
    },
    view_birthday: {
        flex: 2.5,
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: scale(15),
        marginTop: scale(15),
    },
    view_hdc: {
        flex: 2.5,
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: scale(15),
        marginTop: scale(15),
    },
    avatar_image: {
        resizeMode: 'contain',
        minHeight: 50,
        minWidth: 50,
    },
    txt_player_name: {
        flex: 1,
        color: '#373737',
        fontSize: fontSize(15),
        fontWeight: 'bold'
    },
    view_tee_color: {
        width: verticalScale(15),
        height: verticalScale(15),
        borderColor: '#919191',
        borderWidth: 0.5
    },
    txt_country: {
        color: '#979797',
        fontSize: fontSize(15),
        marginLeft: scale(8)
    },
    txt_birthday: {
        color: '#FFFFFF',
        fontSize: fontSize(14),
        paddingTop: scale(5),
        paddingBottom: scale(5),
        textAlign: 'center'
    },
    img_edit: {
        width: scale(20),
        height: scale(20),
        resizeMode: 'contain',
        tintColor: '#A5A5A5'
    },
    view_star: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: scale(10)
    },
    view_line: {
        backgroundColor: '#D4D4D4',
        width: 1
    },
    touchable_view: {
        borderRadius: scale(10)
    },
    view_fee_status: {
        marginLeft: scale(5),
        marginRight: scale(5),
        borderRadius: scale(3)
    },
    txt_expert_date: {
        color: '#555555',
        fontSize: fontSize(13),
        paddingTop: scale(5),
        paddingBottom: scale(5),
        textAlign: 'center'
    },
    // img_gender: {
    //     width: scale(40),
    //     height: scale(40),
    //     resizeMode: 'center'
    // }
    view_header_list: {
        flexDirection: 'row',
        backgroundColor: '#E8E8E8',
        minHeight: scale(35),

    },
    view_stt: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    view_player_name: {
        flex: 5,
        justifyContent: 'center',
        paddingLeft: scale(10),
        flexDirection: 'row',
        alignItems: 'center',
        paddingTop: scale(10),
        paddingBottom: scale(10),
    },
    // view_hdc: {
    //     flex: 2.5,
    //     justifyContent: 'center',
    //     alignItems: 'center'
    // },
    txt_title_list: {
        color: '#707070',
        fontWeight: 'bold',
        fontSize: fontSize(13),
        textAlign: 'center'
    },
});