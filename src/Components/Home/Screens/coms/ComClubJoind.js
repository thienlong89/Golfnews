import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import BaseComponent from '../../../../Core/View/BaseComponent';
import { fontSize, scale, verticalScale } from '../../../../Config/RatioScale';
import {Avatar} from 'react-native-elements';
import ListClubView from './ListClubView';

export default class ComClubJoind extends BaseComponent {
    constructor(props) {
        super(props);
        this.profile = this.getUserInfo().getUserProfile().data;

        // console.log('......................................... profile : ',this.profile);
        this.clubList = this.props.listClubs ? this.props.listClubs : (this.profile.hasOwnProperty('clubs') ? this.profile['clubs'] : []);
    }

    updateData(listClub){
        this.clubList = listClub;
        // this.setState({

        // });
        if(this.refListClub){
            this.refListClub.setFillData(this.clubList);
        }
    }

    render() {
        if(!this.clubList.length) return null;

        // let clubViewList = this.clubList.map((item, key) => {
        //     return <Avatar containerStyle={{ marginRight: scale(10) }}
        //         rounded={true}
        //         width={verticalScale(45)}
        //         height={verticalScale(45)}
        //         avatarStyle={{ borderColor: '#fff', borderWidth: 1 }}
        //         source={{ uri: item.logo_url_path }} />;
        // });
        return (
            <View style={{justifyContent : 'space-between', paddingTop: verticalScale(15), paddingBottom: verticalScale(15), paddingLeft: scale(15), borderColor: 'rgba(0,0,0,0.25)', borderRadius: 5, borderWidth: 1, marginLeft: scale(10), marginRight: scale(10), marginTop: verticalScale(10), flexDirection: 'row', alignItems: 'center' }}>
                <Text allowFontScaling={global.isScaleFont} style={{ fontSize: fontSize(15, scale(1)), color: '#505050' }}>{this.t('club_joined')}</Text>
                <View style={styles.club_icon_group}>
                    {/* {clubViewList} */}
                    <ListClubView ref={(refListClub)=>{this.refListClub = refListClub;}} clubList={this.clubList}/>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({

    club_icon_group: {
        // flexDirection: 'row',
        height: verticalScale(40),
        marginRight: scale(10),
        marginLeft : scale(10)
    },
});