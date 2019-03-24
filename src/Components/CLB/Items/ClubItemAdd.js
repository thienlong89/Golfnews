import React from 'react';
import { Text, View } from 'react-native';
import BaseComponent from '../../../Core/View/BaseComponent';
import Touchable from 'react-native-platform-touchable';
import { Avatar } from 'react-native-elements';
import ApiService from '../../../Networking/ApiService';
import styles from '../../../Styles/Group/StyleGroupItem';
import Networking from '../../../Networking/Networking';
import { verticalScale } from '../../../Config/RatioScale';
import PropsStatic from '../../../Constant/PropsStatic';

export default class ClubItemAdd extends BaseComponent {
    constructor(props) {
        super(props);
        //this.isCheck = false;
        this.state = {
            is_member: false,
            is_accepted: false,
            is_send_request: false
        }
        this.onUserClick = this.onUserClick.bind(this);
        this.onAddClick = this.onAddClick.bind(this);
    }

    static defaultProps = {
        data: {},
        club_id: '',
        isCheck: false
    }

    onUserClick() {
        let{userId} = this.props.data;
        let navigation = PropsStatic.getAppSceneNavigator();
        if(navigation){
            navigation.navigate('player_info', { "puid": userId });
        }
    }

    getColorView() {
        let { is_accepted, is_member } = this.state;
        if (!is_member) {
            /*
            if (this.state.is_send_request) {
                console.log("da send invite ");
                return 'rgba(0,171,167,8)'
            } else {
                */
            return '#00aba7';
        } else if (is_accepted) {
            return '#fff';
        } else {
            return '#fff';
        }
    }


    getColorText() {
        if (!this.state.is_member) {
            return '#fff';
        } else if (this.is_accepted) {
            return '#999';
        } else {
            return '#00aba7';
        }
    }

    /**
 * tra ve title trang thai cua user trong club
 * @param {*} club_member object club member cua user
 */
    // checkTitleClubMember(club_member) {
    //    // console.log("club member : ",club_member);
    //     if (club_member && Object.keys(club_member).length) {
    //         //neu co thong tin club thi check tiep is_accepted
    //         let is_accepted = parseInt(club_member['is_accepted']);
    //         console.log("is accepted : ",is_accepted,club_member['invited_by_user_id']);
    //         if (is_accepted === -1) {
    //             //chua nam trong club
    //             return this.t('club_add')
    //         } else if ((is_accepted === 0) && (parseInt(club_member['invited_by_user_id']) === parseInt(this.getUserInfo().getUserId()))) {
    //             //nguoi kia chua dong y
    //             return this.t('club_is_waiting_for_accept');
    //         } else if (is_accepted === 1) {
    //             //da la thanh vien thi hien thi trang thai xoa khoi clb
    //             return this.t('club_remove')
    //         }
    //     } else {
    //         //chua la thanh vien
    //         return this.t('club_add');
    //     }
    //     return this.t('club_add');
    // }

    getTitleButtonAdd() {
        let { is_accepted, is_member } = this.state;
        if (is_member) {
            //neu co thong tin club thi check tiep is_accepted
            if (!is_accepted) {
                //nguoi kia chua dong y
                return this.t('club_is_waiting_for_accept');
            } else if (is_accepted) {
                //da la thanh vien thi hien thi trang thai xoa khoi clb
                return this.t('club_remove')
            }
        } else {
            //chua la thanh vien
            return this.t('club_add');
        }
        return this.t('club_add');
    }


    render() {
        //console.log("data club item isCheck : ",this.isCheck);
        this.checkIsAcceptedMember();
        return (
            <Touchable onPress={this.onUserClick}>
                <View style={styles.container}>
                    <View style={styles.container_avatar}>
                        <Avatar
                            width={verticalScale(50)}
                            height={verticalScale(50)}
                            rounded={true}
                            source={(this.props.data.avatar && this.props.data.avatar.length ? { uri: this.props.data.avatar } : this.getResources().avatar_default_larger)}
                        />
                    </View>
                    <View style={styles.container_body}>
                        <Text allowFontScaling={global.isScaleFont} style={styles.text_body_fullname}>{this.props.data.fullname}</Text>
                        <Text allowFontScaling={global.isScaleFont} style={styles.text_body_userid}>{this.showUserId()}</Text>
                        <Text allowFontScaling={global.isScaleFont} style={styles.text_body_hdc}>{this.t('handicap_title')} : {this.getAppUtil().handicap_display(this.props.data.handicap)}</Text>
                    </View>
                    <Touchable onPress={this.onAddClick}>
                        <View style={[styles.button_add_club, { borderColor: this.getColorText(), backgroundColor: this.getColorView(), borderWidth: 1, borderRadius: 2 }]}>
                            <Text allowFontScaling={global.isScaleFont} style={[styles.text, { color: this.getColorText() }]}>{this.getTitleButtonAdd()}</Text>
                        </View>
                    </Touchable>
                </View>
            </Touchable>
        );
    }

    checkIsAcceptedMember() {
        if (this.props.isCheck) return;
        let club_member = this.props.data.club_member;
        console.log("club data : ", this.props.data);
        let isMember = false, isAccepted = false;
        if (!club_member || !Object.keys(club_member).length) {
            isMember = false;
        } else {
            isMember = true;
            let is_accepted = parseInt(club_member['is_accepted']);
            let isAdmin = parseInt(this.getAppUtil().replaceUser(club_member['invited_by_user_id']));
            if (isAdmin === this.getAppUtil().replaceUser(this.getUserInfo().getId())) {
                isAccepted = (is_accepted === 0) ? false : true;
            }
        }
        this.state.is_member = isMember;
        this.state.is_accepted = isAccepted;
        this.props.isCheck = true;
        // this.setState({
        //     is_member : isMember,
        //     is_accepted : isAccepted,
        // });
    }

    componentDidMount() {
        //console.log("du lieu item , ",this.props.rowData);
        this.checkIsAcceptedMember();
    }

    onAddClick() {

        let url = this.getConfig().getBaseUrl();
        if (this.state.is_member) {
            if (this.state.is_accepted) {
                //xoa khoi club
                url = url + ApiService.club_remove_member(this.props.data.userId, this.props.club_id);
                Networking.httpRequestGet(url, this.onResponseRemoveMember.bind(this), () => {
                    //time out
                });
            } else {
                //chua accept thi goi api huy loi moi
                url = url + ApiService.club_deni_invite(this.props.data.userId);
                Networking.httpRequestGet(url, this.onResponeCancelInvite.bind(this), () => {
                    //time out
                });
                return;
            }
        } else {
            //chưa là thành viên thì send yêu cầu gửi lời mời
            url = url + ApiService.club_send_invite(this.props.data.userId, this.props.club_id);
            Networking.httpRequestPost(url, this.onResponseInvite.bind(this), { "user_ids": [this.props.data.id] }, () => {
                //time out
            });
            return;
        }
        console.log("url send invite to club ", url);
        Networking.httpRequestGet(url, this.onResponseSendInvite.bind(this), () => {
            //time out
        });
    }

    onResponseRemoveMember(jsonData) {
        if (jsonData.hasOwnProperty('error_code')) {
            let error_code = jsonData['error_code'];
            if (error_code === 0) {
                //thanh cong đổi màu button
                this.setState({
                    is_member: false,
                    is_accepted: false,
                });
            }
        }
    }

    onResponeCancelInvite(jsonData) {
        if (jsonData.hasOwnProperty('error_code')) {
            let error_code = jsonData['error_code'];
            if (error_code === 0) {
                //thanh cong đổi màu button
                this.setState({
                    is_member: false,
                    is_accepted: false,
                });
            }
        }
    }

    onResponseInvite(jsonData) {
        console.log("send invite : ", jsonData);
        if (jsonData.hasOwnProperty('error_code')) {
            let error_code = jsonData['error_code'];
            if (error_code === 0) {
                //thanh cong đổi màu button
                this.setState({
                    is_member: true,
                    is_accepted: false,
                });
            }
        }
    }

    onResponseSendInvite(jsonData) {
        console.log("send invite : ", jsonData);
        if (jsonData.hasOwnProperty('error_code')) {
            let error_code = jsonData['error_code'];
            if (error_code === 0) {
                //thanh cong đổi màu button
                this.setState({
                    is_member: true,
                    is_accepted: false,
                });
            }
        }
    }

    showUserId() {
        return (this.props.data.eHandicap_member_id && this.props.data.eHandicap_member_id.length) ? this.props.data.userId + '-' + this.props.data.eHandicap_member_id : this.props.data.userId;
    }
}