import React from 'react';
import { View, Text, Dimensions, StyleSheet,Image } from 'react-native';
import BaseComponent from '../../../Core/View/BaseComponent';
import { fontSize, verticalScale, scale } from '../../../Config/RatioScale';
import { Avatar } from 'react-native-elements';
import Touchable from 'react-native-platform-touchable';
import StaticProps from '../../../Constant/PropsStatic';
import Constant from '../../../Constant/Constant';

let { width } = Dimensions.get('window');
let txtWidth = (width - scale(20)) / 3;

export default class TopItem extends BaseComponent {
    constructor(props) {
        super(props);
        this.onClick = this.onClick.bind(this);
    }

    /**
     * Trả về router trong navigator tương ứng
     * @param {String} ranking_type loại ranking khi lấy data
     */
    getRouter(ranking_type){
        let lowerCaseType = ranking_type.toLowerCase();
        if(lowerCaseType.indexOf('single') >= 0){
            return Constant.LEADER_BOARD.ROUTER_NAME.SINGLE;
        }else if(lowerCaseType.indexOf('bogey') >= 0){
            return Constant.LEADER_BOARD.ROUTER_NAME.BOGEY;
        }else if(lowerCaseType.indexOf('pro') >= 0){
            return Constant.LEADER_BOARD.ROUTER_NAME.PRO;
        }else if(lowerCaseType.indexOf('18+') >= 0){
            return Constant.LEADER_BOARD.ROUTER_NAME.TOP_18;
        }else if(lowerCaseType.indexOf('lady') >= 0){
            return Constant.LEADER_BOARD.ROUTER_NAME.LADDY;
        }else if(lowerCaseType.indexOf('club') >= 0){
            return Constant.LEADER_BOARD.ROUTER_NAME.CLUB
        }
        return undefined;
    }

    onClick() {
        let navigation = StaticProps.getAppSceneNavigator();
        let { type_top,ranking_type } = this.props.data;
        if (navigation) {
            if (type_top === 0) {//bxh
                navigation.navigate('leaderboard', { router: this.getRouter(ranking_type) });
            } else {
                //phong 
                navigation.navigate('award_view', { router: router });
            }
        }
    }

    getElementUser() {
        let { isEnd, data } = this.props;
        let { ranking_type, info } = data;
        // console.log('')
        return (
            <Touchable onPress={this.onClick}>
                <View style={[styles.container, { borderBottomEndRadius: isEnd ? 5 : 0 }]}>
                    <Text style={styles.rank} allowFontScaling={global.isScaleFont}>
                        {`1.${this.getAppUtil().toUpperCaseFirst(ranking_type)}`}
                    </Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
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
                    </View>
                </View>
            </Touchable>
        );
    }

    getElementClub() {
        let { isEnd, data } = this.props;
        let { ranking_type, info,total_member } = data;
        return (
            <Touchable onPress={this.onClick}>
                <View style={[styles.container, { borderBottomEndRadius: isEnd ? 5 : 0 }]}>
                    <Text style={styles.rank} allowFontScaling={global.isScaleFont}>
                        {`1.${this.getAppUtil().toUpperCaseFirst(ranking_type)}`}
                    </Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center'}}>
                        {/* <Avatar
                            containerStyle={{ marginLeft: scale(10), borderColor: '#DFDFDF', borderWidth: 1 }}
                            width={verticalScale(40)}
                            height={verticalScale(40)}
                            source={{ uri: info.logo_url_path }}
                            rounded
                        >
                        </Avatar> */}
                        <Image 
                                style={{marginLeft : scale(10),width : verticalScale(40),height : verticalScale(40),resizeMode : 'contain',backgroundColor : 'white'}}
                                source={{uri : info.logo_url_path}}
                        />
                        <View style={{ marginLeft: scale(10),paddingRight : scale(6) }}>
                            <Text style={styles.txt_fullname} numberOfLines={1} allowFontScaling={global.isScaleFont}>{info.name}</Text>
                            <Text style={styles.txt_userid} allowFontScaling={global.isScaleFont}>{`${total_member} ${this.t('member_title')}`}</Text>
                        </View>
                    </View>
                </View>
            </Touchable>
        );
    }

    render() {
        let { isEnd, data } = this.props;
        let { ranking_type, info,type } = data;
        if(type === 1){
            return this.getElementUser();
        }else if(type === 2){
            return this.getElementClub();
        }else{
            return null;
        }
    }
}

const styles = StyleSheet.create({
    container: {
        height: verticalScale(50),
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
        marginRight : scale(5)
    },

    txt_userid: {
        color: '#979797',
        fontSize: fontSize(15, scale(1)),
        fontWeight: 'normal'
    }
});