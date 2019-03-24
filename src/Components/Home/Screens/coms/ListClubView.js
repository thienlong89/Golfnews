import React from 'react';
import { View, ListView, Image, TouchableOpacity } from 'react-native';
import BaseComponent from '../../../../Core/View/BaseComponent';
import { Avatar } from 'react-native-elements';
import { verticalScale, scale } from '../../../../Config/RatioScale';
import Touchable from 'react-native-platform-touchable';
import ApiService from '../../../../Networking/ApiService';
import Networking from '../../../../Networking/Networking';
import StaticProps from '../../../../Constant/PropsStatic';

export default class ListClubView extends BaseComponent {
    constructor(props) {
        super(props);
        let { clubList } = this.props;
        this.dataSource = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
        console.log('................... club list : ', clubList);
        if (clubList && clubList.length) {
            this.dataSource = this.dataSource.cloneWithRows(clubList);
        }
    }

    setFillData(_data) {
        console.log('.................... list Club : ', _data);
        if (!_data || !_data.length) return;
        let dataSource = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
        this.dataSource = dataSource.cloneWithRows(_data);
    }

    onClickItemClub(data) {
        console.log('.............................. club click : ',data);
        let{id} = data;
        if(!id) return;
        this.sendRequestClubInfo(id);
    }

    checkIsAdminClub(listAdmin) {
        if (!listAdmin.length) return false;
        let admin = listAdmin.find(d => this.getUserInfo().getId() === d._id);
        if (admin) return true;
        return false;
    }

    //isModerator
    checkIsModeratorClub(listModerator) {
        if (!listModerator.length) return false;
        let moderator = listModerator.find(d => this.getUserInfo().getId() === d._id);
        if (moderator) return true;
        return false;
    }

    //isGeneralSecretary
    checkIsGeneralSecretaryClub(listSecreatary) {
        if (!listSecreatary.length) return false;
        let secreatary = listSecreatary.find(d => this.getUserInfo().getId() === d._id);
        if (secreatary) return true;
        return false;
    }

    sendRequestClubInfo(clubId) {
        let url = this.getConfig().getBaseUrl() + ApiService.get_club_info(clubId);
        let self = this;
        let navigation = StaticProps.getAppSceneNavigator();
        if (!navigation) return;
        Networking.httpRequestGet(url, (jsonData) => {
            let { error_code, data } = jsonData;
            if (error_code === 0) {
                let { club } = data;
                if (club) {
                    let { id, name, logo_url_path, total_member, list_user_admin_club, list_user_moderator_club, list_user_general_secretary_club } = club;
                    navigation.navigate('introduce_club_view', {
                        clubId: id,
                        clubName: name,
                        logoUrl: logo_url_path,
                        isAdmin: self.checkIsAdminClub(list_user_admin_club),
                        isGeneralSecretary: self.checkIsGeneralSecretaryClub(list_user_general_secretary_club),
                        isModerator: self.checkIsModeratorClub(list_user_moderator_club),
                        isAccepted: true,
                        isMember: true,
                        totalMember: total_member
                    });
                }
            } else {
                // self.refDialogMsg.setMsg(self.t('request_error'));
            }
        }, () => {
            // self.refDialogMsg.setMsg(self.t('request_error'));
        });
    }

    render() {
        return (
            <ListView style={{ flex: 1 }}
                // renderSeparator={(sectionId, rowId) => <View key={rowId} style={styles.listview_separator} />}
                dataSource={this.dataSource}
                keyboardShouldPersistTaps='always'
                horizontal={true}
                renderRow={(rowData) =>
                    // <Avatar containerStyle={{ marginRight: scale(10) }}
                    //     rounded={true}
                    //     width={verticalScale(40)}
                    //     height={verticalScale(40)}
                    //     avatarStyle={{ borderColor: '#fff', borderWidth: 1 }}
                    //     source={{ uri: rowData.logo_url_path }} />
                    <TouchableOpacity onPress={this.onClickItemClub.bind(this,rowData)}>
                        <Image style={{ width: scale(40), height: verticalScale(40), resizeMode: 'contain', marginRight: scale(10) }}
                            source={{ uri: rowData.logo_url_path }}
                        />
                    </TouchableOpacity>
                }
            />
        )
    }
}