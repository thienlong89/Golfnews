import React from 'react';
import { View, Text, Dimensions, StyleSheet, Image } from 'react-native';
import BaseComponent from '../../../Core/View/BaseComponent';
import { fontSize, verticalScale, scale } from '../../../Config/RatioScale';
import { Avatar } from 'react-native-elements';
import Touchable from 'react-native-platform-touchable';
import StaticProps from '../../../Constant/PropsStatic';
import Constant from '../../../Constant/Constant';

let { width } = Dimensions.get('window');
let txtWidth = (width - scale(20)) / 3;

export default class TopItemRanking extends BaseComponent {
    constructor(props) {
        super(props);
        this.onClick = this.onClick.bind(this);
    }

    /**
     * Trả về router trong navigator tương ứng
     * @param {String} ranking_type loại ranking khi lấy data
     */
    getRouter(ranking_type) {
        let lowerCaseType = ranking_type.toLowerCase();
        if (lowerCaseType.indexOf('best_gross') >= 0) {
            return Constant.MANNER.ROUTER_NAME.BEST_GROSS;
        } else if (lowerCaseType.indexOf('best_net') >= 0) {
            return Constant.MANNER.ROUTER_NAME.BEST_NET;
        } else if (lowerCaseType.indexOf('ranking_golfer') >= 0) {
            return Constant.MANNER.ROUTER_NAME.RANGKING_GOLFER;
        } else if (lowerCaseType.indexOf('ranking_club') >= 0) {
            return Constant.MANNER.ROUTER_NAME.RANKING_CLUB;
        }
        return undefined;
    }

    onClick() {
        let navigation = StaticProps.getAppSceneNavigator();
        if (navigation) {
            //phong 
            let { ranking_handicap_type } = this.props.data;
            let router = this.getRouter(ranking_handicap_type);
            navigation.navigate('award_view', { router: router });
        }
    }

    getElementListUser(_users) {
        // console.log('...................... typeof : ', _users.length,typeof _user);
        // let length = _users.length;
        // if (length === undefined) {
        let { User } = _users;
        if (!User) return null;
        return (
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Avatar
                    containerStyle={{ marginLeft: scale(10), borderColor: '#DFDFDF', borderWidth: 1 }}
                    width={verticalScale(40)}
                    height={verticalScale(40)}
                    source={{ uri: User.avatar }}
                    rounded
                >
                </Avatar>
                <View style={{ marginLeft: scale(10) }}>
                    <Text style={styles.txt_fullname} numberOfLines={1} allowFontScaling={global.isScaleFont}>{User.fullname}</Text>
                    <Text style={styles.txt_userid} allowFontScaling={global.isScaleFont}>{User.id}</Text>
                </View>
            </View>
        );
        // } else {
        //     // console.log('.......................vao day : ',_users.length);
        //     let l = _users.length;
        //     let elements = _users.map((d,index) => {
        //         let { User } = d;
        //         // console.log('....................... User : ', User);
        //         if (!User) return null;
        //         return (
        //             <View style={{paddingTop : verticalScale(10),paddingBottom : verticalScale(10), flexDirection: 'row', alignItems: 'center',borderBottomColor : '#DFDFDF',borderBottomWidth : index < l-1 ? 1 : 0}}>
        //                 <Avatar
        //                     containerStyle={{ marginLeft: scale(10), borderColor: '#DFDFDF', borderWidth: 1 }}
        //                     width={verticalScale(40)}
        //                     height={verticalScale(40)}
        //                     source={{ uri: User.avatar }}
        //                     rounded
        //                 >
        //                 </Avatar>
        //                 <View style={{ marginLeft: scale(10) }}>
        //                     <Text style={styles.txt_fullname} numberOfLines={1} allowFontScaling={global.isScaleFont}>{User.fullname}</Text>
        //                     <Text style={styles.txt_userid} allowFontScaling={global.isScaleFont}>{User.id}</Text>
        //                 </View>
        //             </View>
        //         )
        //     });
        //     return elements;
        // }
    }

    getElementUser() {
        let { isEnd, data } = this.props;
        if (!data) return null;
        let { ranking_handicap_type, value } = data;
        let ranking_title = ranking_handicap_type.replace('_', ' ');
        // console.log('')
        return (
            <Touchable onPress={this.onClick}>
                <View style={[styles.container, { borderBottomEndRadius: isEnd ? 5 : 0 }]}>
                    <Text style={styles.rank} allowFontScaling={global.isScaleFont}>
                        {`1.${this.getAppUtil().toUpperCaseFirst(ranking_title)}`}
                    </Text>
                    {/* <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Avatar
                            containerStyle={{ marginLeft: scale(10), borderColor: '#DFDFDF', borderWidth: 1 }}
                            width={verticalScale(40)}
                            height={verticalScale(40)}
                            source={{ uri: info.avatar }}
                            rounded
                        >
                        </Avatar>
                        <View style={{ marginLeft: scale(10) }}>
                            <Text style={styles.txt_fullname} numberOfLines={1} allowFontScaling={global.isScaleFont}>{info.fullname}</Text>
                            <Text style={styles.txt_userid} allowFontScaling={global.isScaleFont}>{info.id}</Text>
                        </View>
                    </View> */}
                    <View style={{ flex: 1 }}>
                        {this.getElementListUser(value)}
                    </View>
                </View>
            </Touchable>
        );
    }

    getElementClub() {
        let { isEnd, data } = this.props;
        if (!data) return null;
        let { value, ranking_handicap_type } = data;
        let { logo_url_path, total_member, name } = value;
        let ranking_title = ranking_handicap_type.replace('_', ' ');
        return (
            <Touchable onPress={this.onClick}>
                <View style={[styles.container, { borderBottomEndRadius: isEnd ? 5 : 0 }]}>
                    <Text style={styles.rank} allowFontScaling={global.isScaleFont}>
                        {`1.${this.getAppUtil().toUpperCaseFirst(ranking_title)}`}
                    </Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        {/* <Avatar
                            containerStyle={{ marginLeft: scale(10), borderColor: '#DFDFDF', borderWidth: 1 }}
                            width={verticalScale(40)}
                            height={verticalScale(40)}
                            source={{ uri: logo_url_path }}
                            rounded
                        >
                        </Avatar> */}
                        <Image
                            style={{ marginLeft: scale(10), width: verticalScale(40), height: verticalScale(40), resizeMode: 'contain', backgroundColor: 'white' }}
                            source={{ uri: logo_url_path }}
                        />
                        <View style={{ marginLeft: scale(10), paddingRight: scale(6) }}>
                            <Text style={styles.txt_fullname} numberOfLines={1} allowFontScaling={global.isScaleFont}>{name}</Text>
                            <Text style={styles.txt_userid} allowFontScaling={global.isScaleFont}>{`${total_member} ${this.t('member_title')}`}</Text>
                        </View>
                    </View>
                </View>
            </Touchable>
        );
    }

    render() {
        let { isEnd, data } = this.props;
        let { ranking_handicap_type, info, type } = data;
        if (ranking_handicap_type === 'ranking_club') {
            return this.getElementClub();
        } else {
            return this.getElementUser();
        }
    }
}

const styles = StyleSheet.create({
    container: {
        minHeight: verticalScale(50),
        borderTopColor: '#DFDFDF',
        borderTopWidth: 1,
        flexDirection: 'row', alignItems: 'center'
    },

    rank: {
        width: txtWidth,
        color: '#939393',
        fontSize: fontSize(14),
        marginLeft: scale(10)
    },

    txt_fullname: {
        color: '#2b2b2b',
        fontSize: fontSize(15, scale(1)),
        fontWeight: 'bold',
        marginRight: scale(5)
    },

    txt_userid: {
        color: '#979797',
        fontSize: fontSize(15, scale(1)),
        fontWeight: 'normal'
    }
});