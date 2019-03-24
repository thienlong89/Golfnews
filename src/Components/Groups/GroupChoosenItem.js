import React from 'react';
import { View, Image, Alert } from 'react-native';
import BaseComponent from '../../Core/View/BaseComponent';
import { Avatar } from 'react-native-elements';
import styles from '../../Styles/Group/StyleGroupChoosenItem';
import AppUtil from '../../Config/AppUtil';
import Touchable from 'react-native-platform-touchable';
import ApiService from '../../Networking/ApiService';
import Networking from '../../Networking/Networking';
import MyView from '../../Core/View/MyView';
import ItemLoading from '../Common/ItemLoadingView';

export default class ItemChoosen extends BaseComponent {
    constructor(props) {
        super(props);
    }

    static defaultProps = {
        data: null,
        group_id: '',
        callbackRemoveMember: null
    }

    showItemLoading(){
        if(this.itemLoading){
            this.itemLoading.showLoading();
        }
    }

    hideItemLoading(){
        if(this.itemLoading){
            this.itemLoading.hideLoading();
        }
    }

    onDeleteClick() {
        let{isInGroup} = this.props.data;
        console.log("user da trong group ",isInGroup);
        if(!isInGroup) return;

        let url = this.getConfig().getBaseUrl() + ApiService.group_remove_member(this.props.group_id);
        //this.itemLoading.showLoading();
        this.showItemLoading();
        let self = this;
        //console.log("user ",this.props.data);
        Networking.httpRequestPost(url, (jsonData) => {
            console.log("remove member : ",jsonData);
            //self.itemLoading.hideLoading();
            self.hideItemLoading();
            if (jsonData.hasOwnProperty('error_code')) {
                let error_code = parseInt(jsonData['error_code']);
                if (error_code === 0) {
                    if (self.props.callbackRemoveMember) {
                        self.props.callbackRemoveMember(self.props.data);
                    }
                } else {
                    //loi
                    Alert.alert(
                        self.t('thong_bao'),
                        jsonData['error_msg'],
                        [
                            { text: 'OK', onPress: () => console.log('OK Pressed') },
                        ],
                        { cancelable: false }
                    )
                }
            }
        }, { "user_ids": [this.props.data.userId] }, () => {
            //time out
            //self.itemLoading.hideLoading();
            self.hideItemLoading();
           // self.popupTimeOut.showPopup();
        });
    }

    checkIsMe(userId){
        if(userId.toLowerCase() === this.getUserInfo().getUserId().toLowerCase()){
            return true;
        }
        return false;
    }

    render() {
        let { data } = this.props;
        return (
            <View style={styles.container}>
                {/* {this.renderLoading()} */}
                <View
                    style={styles.avatar_view}
                >
                    <Avatar
                        width={50}
                        height={50}
                        rounded={true}
                        source={(data.avatar && AppUtil.formatAvatar(data.avatar)) ? { uri: data.avatar } : this.getResources().avatar_default_larger}
                    />
                    <MyView style={styles.delete_view} hide={this.checkIsMe(data.userId)}>
                        <Touchable onPress={this.onDeleteClick.bind(this)}>
                            <Image
                                style={styles.delete_image}
                                source={this.getResources().delete}
                            />
                        </Touchable>
                    </MyView>
                </View>
                <ItemLoading ref={(itemLoading)=>{this.itemLoading = itemLoading;}}
                            left={15}
                            top={15}/>
            </View>
        );
    }
}