/**
 * Thành viên của club thì hiển thị lên list đầu của màn hình thêm thành viên
 */
import React from 'react';
import { StyleSheet, Text, View, Image,Alert } from 'react-native';
import BaseComponent from '../../../Core/View/BaseComponent';
import { Avatar } from 'react-native-elements';
import AppUtil from '../../../Config/AppUtil';
import Touchable from 'react-native-platform-touchable';
import ApiService from '../../../Networking/ApiService';
import Networking from '../../../Networking/Networking';
import MyView from '../../../Core/View/MyView';


export default class ClubItemCircle extends BaseComponent {
    constructor(props) {
        super(props);
    }

    static defaultProps = {
        // userName: '',
        // userId: 'VGA3',
        // club_id: '',
        // eHandicap_member_id: 'DU42',
        // fullname: 'Tre xanh',
        // avatar: '',
        // handicap: '12.8',
        // callbackRemoveMember : null,
    }

    onDeleteClick() {
        let url = this.getConfig().getBaseUrl()+ApiService.club_remove_member(this.props.userId,this.props.club_id);
        console.log("remove member url : ",url);
        Networking.httpRequestGet(url,this.onResponseDeleteMember.bind(this));
    }

    onResponseDeleteMember(jsonData){
        console.log("remove member : ",jsonData);
        if(jsonData.hasOwnProperty('error_code')){
            let error_code = jsonData['error_code'];
            if(error_code === 0){
                //thanh cong
                if(this.props.callbackRemoveMember){
                    this.props.callbackRemoveMember({userId : this.props.userId});
                }
            }else{
                Alert.alert(
                    this.t('thong_bao'),
                    jsonData['error_msg'],
                    [
                      {text: 'OK', onPress: () => console.log('OK Pressed')},
                    ],
                    { cancelable: false }
                  )
            }
        }
    }

    checkMe(userId){
        if(AppUtil.replaceUser(userId) === this.getAppUtil().replaceUser(this.getUserInfo().getId())){
            return true;
        }
        return false;
    }

    render() {
        return (
            <View style={styles.container}>
                <Avatar
                    width={50}
                    height={50}
                    rounded={true}
                    source={(this.props.avatar && AppUtil.formatAvatar(this.props.avatar)) ? { uri: this.props.avatar } : this.getResources().avatar_default_larger}
                />
                <MyView style={styles.delete_view} hide={this.checkMe(this.props.userId)}>
                    <Touchable onPress={this.onDeleteClick.bind(this)}>
                        <Image
                            style={styles.delete_image}
                            source={this.getResources().delete}
                        />
                    </Touchable>
                </MyView>
            </View>
        );
    }
}

const styles = styles = StyleSheet.create({

    container: {
        width: 60,
        height: 60,
        marginLeft: 6,
        //backgroundColor : 'blue',
        marginTop: 5
    },

    container_mask: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        borderRadius: 25,
        backgroundColor: 'green'
    },

    delete_view: {
        width: 20,
        height: 20,
        //backgroundColor: 'red', 
        position: 'absolute',
        right: 5
    },

    delete_image: {
        width: 20, height: 20, resizeMode: 'contain'
    }
});