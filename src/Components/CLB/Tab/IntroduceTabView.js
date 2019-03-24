import React from 'react';
import {
    Platform,
    StyleSheet,
    Text,
    View,
    ScrollView,
    Image,
    TouchableOpacity,
    Dimensions
} from 'react-native';
import Touchable from 'react-native-platform-touchable';
import BaseComponent from '../../../Core/View/BaseComponent';
import Networking from '../../../Networking/Networking';
import ApiService from '../../../Networking/ApiService';
import CustomAvatar from '../../Common/CustomAvatar';
import ClbTabView from '../Items/ClbTabView';

const screenHeight = Dimensions.get('window').height;

export default class IntroduceTabView extends BaseComponent {

    static defaultProps = {

    }

    constructor(props) {
        super(props);
        this.state = {

        }
    }

    renderIntroduceGroup() {
        let content = 'Xin chào tất cả thành viên trong CLB CM88.\nĐây là Group chính thức cập nhật thông tin hoạt động của CLB mình.\nĐồng thời là nơi chia sẻ, tương tác giữa các thành viên trong CLB với nhau';
        return (
            <View style={styles.view_introduce}>
                <Text allowFontScaling={global.isScaleFont} style={styles.txt_title}>{this.t('introduce_about_club')}</Text>
                <View style={styles.line} />
                <Text allowFontScaling={global.isScaleFont} style={styles.txt_content}>{content}</Text>
            </View>
        )
    }

    renderMemberList() {
        let ls = ['A', 'A', 'A', 'A', 'A', 'A', 'A', 'A'];
        

        let lsAvatar = ls.map(() => {
            return (
                <CustomAvatar
                    width={30}
                    height={30}
                    style={{marginRight: 5}} />
            )
        })

        return (
            <View style={styles.view_ls_member}>
                {lsAvatar}
            </View>
        )
    }

    renderMemberGroup() {
        let number = 10;
        let admin = 'Đức Vertu';
        let member = 'A, B';
        let club = 'CLB CM88'

        return (
            <View style={styles.view_group}>
                <View style={styles.view_header_group}>
                    <Text allowFontScaling={global.isScaleFont} style={styles.txt_title}>{`${this.t('member')} • ${number}`}</Text>
                    <TouchableOpacity>
                        <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                            <Text allowFontScaling={global.isScaleFont} style={styles.txt_sub_title}>{this.t('view_all')}</Text>
                            <Image
                                style={styles.img_arrow_right}
                                source={this.getResources().ic_arrow_right}
                            />
                        </View>
                    </TouchableOpacity>
                </View>
                <View style={styles.line} />

                {this.renderMemberList()}
                <Text allowFontScaling={global.isScaleFont} style={styles.txt_member_title}>{this.t('is_member').format(member, club)}</Text>

                <Text allowFontScaling={global.isScaleFont} style={styles.txt_sub_title}>{this.t('admin')}</Text>
                <CustomAvatar
                    width={30}
                    height={30} 
                    style={{marginLeft: 10}} />
                <Text allowFontScaling={global.isScaleFont} style={styles.txt_admin_title}>{`${admin} ${this.t('is_admin')}`}</Text>
            </View>
        )
    }

    render() {
        return (
            <ScrollView style={styles.container}>
                {this.renderIntroduceGroup()}
                {this.renderMemberGroup()}
                {this.renderIntroduceGroup()}
                {this.renderIntroduceGroup()}
                {this.renderIntroduceGroup()}
            </ScrollView>
        );
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#DADADA',
        minHeight: screenHeight -50,
    },
    view_introduce: {
        backgroundColor: '#fff',
        marginTop: 10,
        marginBottom: 5
    },
    txt_title: {
        color: '#000',
        fontSize: 15,
        fontWeight: 'bold',
        padding: 10
    },
    line: {
        height: 0.5,
        backgroundColor: '#D6D4D4'
    },
    txt_content: {
        color: '#757575',
        fontSize: 15,
        padding: 10
    },
    view_group: {
        backgroundColor: '#fff',
        marginTop: 5,
        marginBottom: 5
    },
    view_header_group: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    txt_sub_title: {
        color: '#8B8B8B',
        fontSize: 15,
        padding: 10
    },
    img_arrow_right: {
        height: 15,
        width: 15,
        resizeMode: 'contain',
        tintColor: '#8B8B8B',
        marginRight: 10,
    },
    view_ls_member: {
        flexDirection: 'row',
        padding: 10
    },
    txt_admin_title: {
        color: '#292929',
        fontSize: 15,
        padding: 10
    },
    txt_member_title: {
        color: '#292929',
        fontSize: 15,
        paddingLeft: 10,
        paddingRight: 10,
        paddingBottom: 5
    }
});