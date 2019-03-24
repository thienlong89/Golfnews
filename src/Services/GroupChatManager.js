import firebaseService from './firebase';
// import SignInFirebase from './SignInFirebase';
import UserInfo from '../Config/UserInfo';
import AppUtil from '../Config/AppUtil';
import { warn } from '../Core/Debug/Logger';

/**
 * class nay tạo nhóm chát trên firebase tương ứng vs nhóm va club trên sever
 */
export default class GroupChatManager {
    constructor() {

        this.group_id = '';
        this.group_name = '';
        this.chatRef = this.getRef().child('group_chats');
        this.createdAt_check = 0;
        this.listGroups = [];
    }

    init(group_id, group_name, renderCallback = null) {
        this.group_id = group_id;
        this.group_name = group_name;
        this.renderViewCallback = renderCallback;
        this.init = true;
        console.log('..............................create group firebase ', this.group_id);
    }

    setRenderViewCallback(_callback){
        this.renderViewCallback = _callback;
    }

    getRef() {
        return firebaseService.database().ref();
    }

    /**
     * Tạo nhóm chát
     * @param {Array} list_users mảng các user id
     */
    createGroupChat(list_users,data) {
        if (!this.group_id) {
            warn('Bạn chưa kowir tạo nên không thể tạo nhóm chát được');
            return;
        }
        let date = new Date();
        let time = date.getTime();
        let group_chat_obj = {
            id: this.group_id,
            name: this.group_name,
            createdAt: time,
            order: -1 * time,
            list_users: list_users,
            host_user_id : data.host_user_id,
            created_at : data.created_at,
            image_path : data.image_path,
            type_chat : 1
        }
        this.sendToFirebase(group_chat_obj);
    }

    /**
     * Gui tin nhan den firebase
     * @param {*} message 
     */
    sendToFirebase(message) {
        this.chatRef.push().set(message, (error) => {
            if (error) {
                if (this.handleSendChatErrorCallback) {
                    this.handleSendChatErrorCallback(message, true);
                }
                console.log("Khong gui dc tin nhan den firebase  khi tao group chat", error);
            } else {
                if (this.handleSendChatErrorCallback) {
                    this.handleSendChatErrorCallback(message, false);
                }
                console.log("gui tin nhan tao group chat den firebase thanh cong!!!!!!");
            }
        });
    }

    /**
     * add item vao list co kiem tra bị duplicate
     * @param {Array} listTemp 
     * @param {*} obj 
     */
    addToList(listTemp, obj) {
        let objCheck = this.listGroups.find(d => {
            // console.log("or target ", parseInt(obj.createdAt), parseInt(d.createdAt));
            return (parseInt(d.group_id) === parseInt(obj.group_id));
        });
        // console.log("check duplicate  ", objCheck);
        if (objCheck) {
            this.isLoadPre = false;
            return;
        }
        listTemp.push(obj);
    }

    registerListenerGroup(_time_check){
        this.createdAt_check = _time_check ? _time_check : (new Date()).getTime();
        this.listenForItems();
        this.listenForItemsChange();
        this.listenForItemRemove();
    }

    /**
     * lang nghe khi co su thay doi comment
     */
    listenForItems() {
        // if (!this.inited) {
        //     console.warn("Bạn phải gọi hàm init trước nếu không chức năng này không thể hoạt động");
        //     return;
        // }
        this.chatRef.off();
        //update ngay 24/11/2018
        this.chatRef.orderByChild('createdAt').startAt(this.createdAt_check).on("child_added", snap => {
            // get children as an array
            var items = [];
            let group = snap.val();
            // console.log("listen item message : ", chat);
            // chat.type = chat.type ? chat.type : 'text';
            group.key = snap.key;
            // let { user } = chat;
            // if (AppUtil.replaceUser(user.userid) === AppUtil.replaceUser(UserInfo.getUserId())) {
            //     chat.direction = 2;
            // } else {
            //     chat.direction = 1;
            // }
            this.addToList(items, group);
            if (this.renderViewCallback && items.length) {

                //moi lan co tin nhan ve thi save lai
                // this.saveChatToLocal();
                // this.renderViewCallback(this.listGroups);
                this.renderViewCallback(group);
            }
        });
    }

    /**
     * lang nghe khi co su thay doi comment
     */
    listenForItemsChange() {
        // if (!this.inited) {
        //     console.warn("Bạn phải gọi hàm init trước nếu không chức năng này không thể hoạt động");
        //     return;
        // }
        // this.chatRef.off();
        this.chatRef.on("child_changed", snap => {
            // get children as an array
            // console.log('.......................change ', snap.val());
            let { type } = snap.val();
            console.log('type change ............... ', type);

            let chat = snap.val();
            chat.key = snap.key;
            this.listGroups.push(chat);

            if (this.renderViewCallback) {
                this.renderViewCallback(this.listGroups);
            }

        });
    }

    listenForItemRemove() {
        this.chatRef.on('child_removed', child => {
            let group = child.val();
            console.log('....... co nhom bi xoa : ', group);
        })
    }
}