import React from 'react';
import {
    Platform,
    StyleSheet,
    Text,
    View,
    FlatList
} from 'react-native';
import Touchable from 'react-native-platform-touchable';
import BaseComponent from '../../../Core/View/BaseComponent';
import Networking from '../../../Networking/Networking';
import ApiService from '../../../Networking/ApiService';
import MyView from '../../../Core/View/MyView';
import { scale, verticalScale, moderateScale, fontSize } from '../../../Config/RatioScale';
import AdminMemberItem from './AdminMemberItem';

export default class AdminMemberView extends BaseComponent {

    static defaultProps = {
        listType: 0, // 0: danh sach thanh vien; 1: danh sach thanh vien sinh nhat
        clubId: ''
    }

    constructor(props) {
        super(props);

        this.state = {
            playerList: []
        }

        this.onMemberPress = this.onMemberPress.bind(this);
        this.onViewMorePress = this.onViewMorePress.bind(this);
    }

    render() {
        let {
            listType
        } = this.props;
        let {
            playerList
        } = this.state;

        return (
            <View style={styles.container}>
                <View style={styles.view_title}>
                    <Text allowFontScaling={global.isScaleFont} style={styles.txt_title}>{listType === 0 ? this.t('danh_sach_thanh_vien') : this.t('member_birthday_list')}</Text>
                    <Text allowFontScaling={global.isScaleFont} style={styles.txt_more}
                        onPress={this.onViewMorePress}>{this.t('xem_them')}</Text>
                </View>
                <MyView hide={listType != 0} style={styles.view_description}>
                    <Text allowFontScaling={global.isScaleFont} style={styles.txt_description}>{this.t('accuracy_hdc')}</Text>
                </MyView>

                <View style={styles.view_header_list}>
                    <View style={styles.view_stt}>
                        <Text allowFontScaling={global.isScaleFont} style={styles.txt_title_list}>{this.t('stt')}</Text>
                    </View>
                    <View style={styles.view_line} />
                    <View style={styles.view_player_name}>
                        <Text allowFontScaling={global.isScaleFont} style={styles.txt_title_list}>{this.t('member_name_title')}</Text>
                    </View>
                    <View style={styles.view_line} />
                    <View style={styles.view_birthday}>
                        <Text allowFontScaling={global.isScaleFont} style={styles.txt_title_list}>{this.t('birthday')}</Text>
                    </View>
                    <View style={styles.view_line} />
                    <View style={styles.view_hdc}>
                        <Text allowFontScaling={global.isScaleFont} style={styles.txt_title_list}>{this.t('hdc_index')}</Text>
                    </View>
                </View>

                <FlatList
                    ref={(refFlatList) => { this.refFlatList = refFlatList; }}
                    initialNumToRender={5}
                    ItemSeparatorComponent={(sectionId, rowId) => <View key={rowId} style={styles.listview_separator} />}
                    data={playerList}
                    keyboardShouldPersistTaps='always'
                    scrollEventThrottle={16}
                    keyExtractor={item => item.id}
                    renderItem={({ item, index }) =>
                        <AdminMemberItem
                            player={item}
                            index={index + 1}
                            onItemPress={this.onMemberPress} />
                    }
                />
            </View>
        );
    }

    setPlayerData(playerList = []) {
        this.setState({
            playerList: playerList
        })
    }

    onMemberPress(player) {
        let { screenProps } = this.props;
        if (screenProps) {
            screenProps.navigation.navigate('member_profile_navigator',
                {
                    player: player
                })
        }
    }

    onViewMorePress(){
        let { screenProps, listType, clubId, jumpToBirthday } = this.props;
        
        if (screenProps) {
            if(listType===0){
                screenProps.navigation.navigate('admin_list_member_view',
                {
                    clubId: clubId
                })
            } else if(jumpToBirthday){
                jumpToBirthday();
            }
            
        }
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        borderColor: '#D6D4D4',
        borderWidth: 1,
        borderRadius: 10,
        margin: 10,
        // paddingBottom: scale(10)
    },
    view_title: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginLeft: scale(10),
    },
    txt_title: {
        fontSize: fontSize(17),
        color: '#252525',
        fontWeight: 'bold',
        paddingTop: scale(10),
        paddingBottom: scale(10),
    },
    txt_more: {
        color: '#00ABA7',
        fontSize: fontSize(15),
        paddingLeft: scale(10),
        paddingTop: scale(10),
        paddingBottom: scale(10),
        paddingRight: scale(10)
    },
    txt_description: {
        color: '#999999',
        fontSize: fontSize(15)
    },
    view_description: {
        marginLeft: scale(10),
        marginRight: scale(10),
        marginBottom: scale(10)
    },
    view_header_list: {
        flexDirection: 'row',
        backgroundColor: '#E8E8E8',
        minHeight: scale(35)
    },
    view_stt: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    view_player_name: {
        flex: 5,
        justifyContent: 'center',
        alignItems: 'center'
    },
    view_birthday: {
        flex: 2.5,
        justifyContent: 'center',
        alignItems: 'center'
    },
    view_hdc: {
        flex: 2.1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    txt_title_list: {
        color: '#707070',
        fontWeight: 'bold',
        fontSize: fontSize(13)
    },
    view_line: {
        backgroundColor: '#D4D4D4',
        width: 1
    },
    listview_separator: {
        height: 1,
        backgroundColor: '#D4D4D4'
    }
});