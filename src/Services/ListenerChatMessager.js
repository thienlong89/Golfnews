import firebaseService from './firebase';
// import SignInFirebase from './SignInFirebase';
import UserInfo from '../Config/UserInfo';
import DataManager from '../Core/Manager/DataManager';
import ApiService from '../Networking/ApiService';
import Networking from '../Networking/Networking';
import Config from '../Config/Config';
import { insert as insertListChat, query as queryListChat } from '../DbLocal/ListChatRealm';
import { insert as insertChat, query as queryChat } from '../DbLocal/ChatsRealm';
// import {insert as insertChat,query as queryChat} from '../Components/Chats/Database/ChatGlobalDatabase';
import SoundManager from '../Core/Manager/SoundManager';
import AppUtil from '../Config/AppUtil';
import HashTable from '../Library/HashTable';//luu cac tin nhan moi den
import ChatDatabaseManager from '../Components/Chats/Database/ChatDatabaseManager';
import { database } from 'react-native-firebase';

// const sound_url = 'turnstart.mp3';

const sound_url = 'swng.wav';

// import AppUtil from '../Config/AppUtil';

// const key = 'timestamp_created_at_chat';
// let state_key = `user_${UserInfo.getId()}_readed`;

/**
 * class lắng nghe khi có tin nhắn mới về
 */
export default class ListenerChatMessager {
    constructor() {
        this.listMessages = [];
        this.chatRef = null;// this.getRef().child("commen/");//.orderByChild('order');
        this.chatRefData = null;// this.chatRef;//.orderByKey();
        this.renderViewCallback = null;
        this.clearCommenCallback = null;

        this.renderBadgeCallback = null;

        this.startLoad = true;
        this.limit_record = 20;
        this.nextChildKey = null;
        this.name = '';
        this.id = '';
        this.inited = false;
        // this.handleSendChatErrorCallback = null;

        this.listChildRef = [];
        this.uid_firebase = UserInfo.getFuid();
        this.listRoomId = [];
        this.total_msg = 0;

        //item nhom chat
        this.listGroup = [];
        this.listFriend = [];
        this.listChats = [];
        this.page = 1;

        this.listDataChat = [];//luu du lieu nhom chat tra ve tu sever
        // this.sendRequestListUserChat();
        this.state_key = '';
        this.soundManager = new SoundManager();
        // this.soundManager.create('../Sounds/sound_message.aiff');
        this.key_chat_cskh = '';
        this.key_chat_trong_tai = '';
        this.is_cskh = false;

        this.hashChatsNew = new HashTable();
        this.hashChatsOld = new HashTable();
        this.hashTableBaseDatabase = new HashTable();

        // this.loadChatCSKH();
        this.is_trong_tai = false;

        this.lock_change_chat_cskh = false;
        this.lock_change_chat_trong_tai = false;
        this.lock_change_chat_private = false;

        this.lock_change_chat_group = false;
    }

    getBaseDatabase(room_id) {
        if (!room_id) return null;
        if (this.hashTableBaseDatabase.containsKey(room_id)) {
            let baseDatabase = this.hashTableBaseDatabase.get(room_id);
            return baseDatabase;
        } else {
            let baseDatabase = new ChatDatabaseManager();
            baseDatabase.init(room_id);
            this.hashTableBaseDatabase.put(room_id, baseDatabase);
            return baseDatabase;
        }
    }

    setLockChangeChatGroup(_lock) {
        this.lock_change_chat_group = _lock;
    }

    setStateKeyReaded(_user_id) {
        let id = AppUtil.replaceUser(_user_id);
        this.state_key = `user_${id}_readed`;
    }

    isTrongTai() {
        return this.is_trong_tai;
    }

    /**
     * 1 la cskh , 2 la trong tai
     * {"error_code":0,"data":[{"id":1,"user_id":4,"identification_chat":["1","2","3"],"type":1,"created_at":"14:09:32,01-03-2019","updated_at":"14:09:47,01-03-2019"},{"id":2,"user_id":6868,"identification_chat":["4","5","6"],"type":1,"created_at":"14:09:32,01-03-2019","updated_at":"14:09:47,01-03-2019"},{"id":3,"user_id":4114,"identification_chat":["7","8","9","0"],"type":1,"created_at":"14:09:32,01-03-2019","updated_at":"14:09:47,01-03-2019"},{"id":4,"user_id":1066,"identification_chat":["1","2","3"],"type":2,"created_at":"14:09:32,01-03-2019","updated_at":"14:09:47,01-03-2019"}],"error_msg":null}
     */
    loadThreadedChat() {
        let url = Config.getBaseUrl() + ApiService.load_identification_cskh_trong_tai();
        console.log('.................. url phan luong : ', url);
        let self = this;
        Networking.httpRequestGet(url, (jsonData) => {
            let { error_code, data } = jsonData;
            if (error_code === 0) {

                let list_cskh = data.filter(d => d.type === 1);
                let list_trong_tai = data.filter(d => d.type === 2);

                let user_id = UserInfo.getId();

                console.log('..................... list cskh : ', list_cskh);
                for (let d of list_cskh) {
                    if (AppUtil.replaceUser(d.user_id) === AppUtil.replaceUser(user_id)) {
                        self.is_cskh = true;
                        self.key_chat_cskh = `cskh_vga${user_id}`;
                        break;
                    }
                }
                if (!self.is_cskh) {
                    for (let d of list_cskh) {
                        let { identification_chat } = d;
                        // let uids = identification_chat.map(u=>parseInt(u));
                        let string_user_id = user_id.toString();
                        let end_letter = string_user_id.charAt(string_user_id.length - 1);
                        if (identification_chat.indexOf(end_letter) >= 0) {
                            self.key_chat_cskh = `cskh_vga${d.user_id}`;
                            break;
                        }
                    }
                }
                console.log('................... CSKH : ', self.is_cskh, self.key_chat_cskh);
                self.listenerChatFromCSKH();

                ///////////////////////// check trong tai //////////////////////////
                console.log('....................... list trong tai : ', list_trong_tai);
                for (let d of list_trong_tai) {
                    if (AppUtil.replaceUser(d.user_id) === AppUtil.replaceUser(user_id)) {
                        self.is_trong_tai = true;
                        self.key_chat_trong_tai = `trong_tai_vga${user_id}`;
                        break;
                    }
                }
                if (!self.is_trong_tai) {
                    for (let d of list_trong_tai) {
                        let { identification_chat } = d;
                        // let uids = identification_chat.map(u=>parseInt(u));
                        let string_user_id = user_id.toString();
                        let end_letter = string_user_id.charAt(string_user_id.length - 1);
                        if (identification_chat.indexOf(end_letter) >= 0) {
                            self.key_chat_trong_tai = `trong_tai_vga${d.user_id}`;
                            break;
                        }
                    }
                }
                console.log('....................... Trong Tai : ', self.is_trong_tai, self.key_chat_trong_tai);
                self.listenerChatFromTrongTai();
            }
        }, () => {

        });
    }

    loadChatCSKH() {
        let refCskh = this.getRef().child('cskh');
        refCskh.on('value', snapshot => {
            snapshot.forEach(data => {
                let key = data.key;

                console.log('....................... check cskh key : ', key);
                let user_id = UserInfo.getId();
                let key_group = `cskh_vga${user_id}_`;

                if (key.indexOf(key_group) >= 0) {
                    this.key_chat_cskh = key;
                    this.is_cskh = true;
                    refCskh.off();
                    //neu la tong dai cskh thi dang ky lang nghe
                    this.listenerChatFromCSKH();
                    return;
                } else {
                    let string_user_id = user_id.toString();
                    let end_letter = string_user_id.charAt(string_user_id.length - 1);
                    let key_khach_hang = `_${end_letter}`;
                    if (key.indexOf(key_khach_hang) >= 0) {
                        this.key_chat_cskh = key;
                        refCskh.off();
                        return;
                    }
                }
            });
        })
    }

    isCskh() {
        return this.is_cskh;
    }

    getCSKHGroupKey() {
        return this.key_chat_cskh;
    }

    getTrongTaiGroupKey() {
        return this.key_chat_trong_tai;
    }

    loadChatTrongTai() {
        let refTrongTai = this.getRef().child('trong_tai');
        refTrongTai.on('value', snapshot => {
            snapshot.forEach(data => {
                let key = data.key;
                let user_id = UserInfo.getId();
                let key_group = `trong_tai_vga${user_id}_`;
                if (key.indexOf(key_group) >= 0) {
                    this.key_chat_trong_tai = key;
                    this.is_trong_tai = true;
                    refTrongTai.off();

                    //neu la to trong tai thi dang ky lang nghe tin nhan
                    this.listenerChatFromTrongTai();
                    return;
                } else {
                    let string_user_id = user_id.toString();
                    let end_letter = string_user_id.charAt(string_user_id.length - 1);
                    let key_tt = `_${end_letter}`;
                    if (key.indexOf(key_tt) >= 0) {
                        this.key_chat_trong_tai = key;
                        refTrongTai.off();
                        return;
                    }
                }
            });
        });
    }

    refeshList() {
        this.listFriend = [];
        this.listClub = [];
        this.listGroup = [];
        this.listChats = [];
    }

    sendRequestListUserChat(more = false) {
        let self = this;
        let url = Config.getBaseUrl() + ApiService.group_chat_list(this.page);
        console.log("url get list user chat " + url);
        Networking.httpRequestGet(url, (jsonData) => {
            let { error_code, data } = jsonData;
            if (error_code === 0) {
                self.refeshList();//xoa du lieu trong list tam
                self.listDataChat = data;
                // console.log('................................... list screen data : ', self.listDataChat);

                // for (let d of data) {
                //     // self.listChats.push(d);
                //     let type = d.type;
                //     let type_chat = d.type_chat;
                //     if (type_chat === 1) {
                //         if (type === 1) {
                //             self.listClub.push(d);
                //         } else{
                //             self.listGroup.push(d);
                //         }
                //         // self.listGroup.push(d);
                //     } else {
                //         self.listFriend.push(d);
                //     }

                // }

                self.loadGroupFromLocal();
                // self.saveLocalData();

            }
        }, () => {
            // if (!more) {
            //     self.listViewChat.hideInternalLoading();
            // }
        });
    }

    saveLocalData() {
        if (!this.listChats.length) return;
        let dataSave = JSON.stringify(this.listChats);
        insertListChat(dataSave);
    }

    refreshBadge() {
        this.total_msg = 0;
    }

    /**
     * Huy view
     */
    destroy() {
        this.listMessages = [];
        this.chatRef = null;
        this.chatRefData = null;
        this.renderViewCallback = null;
        this.clearCommenCallback = null;
        this.startLoad = true;
        this.limit_record = 50;
        this.nextChildKey = null;
        this.name = '';
        this.id = '';
        this.inited = false;
        // this.handleSendChatErrorCallback = null;
        this.unRegisterHandle();

        this.listChildRef = [];
        this.listRoomId = [];
        this.total_msg = 0;

        if (this.refCSKH) this.refCSKH.off();
        if (this.refTrongTai) this.refTrongTai.off();
        if (this.refUser) this.refUser.off();

        let keys = this.hashTableBaseDatabase.keys();
        for(let key of keys){
            let datbase = this.hashTableBaseDatabase.get(key);
            if(database){
                database.deleteAll();
            }
        }
    }
    //-1546853903845
    //-1546920722043

    /**
     * Ham khởi tạo
     * @param {*} name 
     * @param {*} id 
     */
    init(name, id, renderViewCallback, clearCommenCallback = null) {
        this.name = name;
        this.id = id;
        this.user = UserInfo.getFuid();// firebaseService.auth().currentUs;
        console.log('.......................... ss ', this.user);
        // if (!this.user) {
        //     // SignInFirebase.signInFirebase(UserInfo.getPhoneNumber(), '123123');
        //     return;
        // }
        this.renderBadgeCallback = renderViewCallback;
        this.clearCommenCallback = clearCommenCallback;
        this.chatRef = this.getRef().child('chat/' + this.generateId());
        console.log("comment room id ", this.generateId());
        this.chatRefData = this.chatRef;
        this.inited = true;

        // this.loadChatCSKH();
    }

    /**
     * Lắng nghe khi có user mới chát với mình
     * @param {*} timestam_check 
     */
    // listennerForUserChat(timestam_check) {
    //     let ref = this.getRef().child('chat');
    //     ref.off();
    //     ref.on('child_added', child => {
    //         let group = child.val();
    //         let key = child.key;
    //     });
    // }

    /**
     * Load nhom chat tu db local
     */
    loadGroupFromLocal() {
        queryListChat().then((data) => {
            // console.log('...................load list chat tu local 2222: ', data);
            try {
                this.convertData(data);
            } catch (error) {
                console.error('............co loi : ', error);
            }
            // this.convertData(data);
        }, (error) => {
            //load 
            // this.sendRequestListUserChat();
            // console.log('...................load list chat screen loi : ', error);
        });
    }

    convertData(_data) {
        // let data = _data;// JSON.parse(_data);
        // console.log('.....................convertData : ', _data);
        if (Object.keys(_data).length) {
            let data = _data['0'].jsonData;
            data = JSON.parse(data);
            for (let d of data) {
                // console.log('........................... d : ',d);
                // this.listChats.push(d);
                let type = d.type;
                let type_chat = d.type_chat;

                if (type_chat === 1) {
                    if (this.listDataChat.length) {
                        // let groupChat = this.listDataChat.find((item, index) => item.id === d.id);
                        for (let i = 0; i < this.listDataChat.length; i++) {
                            let group = this.listDataChat[i];
                            // console.log('.......................... group id : d id : ', group.id, d.id, group.type, d.type);
                            if (group.id === d.id && d.type === group.type) {

                                this.listDataChat.splice(i, 1);
                                if (group.type === 1) {
                                    console.log('.......................... tim duoc group giong nhau ', group);
                                    //club
                                    // this.listClub.push(group);//bo de test
                                    // d.logo_url_path = group.logo_url_path;
                                    // d.name = group.name;
                                    this.listClub.push(d);
                                } else {
                                    this.listGroup.push(group);
                                    // d.image_path = group.image_path;
                                    // d.name = group.name;
                                    // this.listGroup.push(d);
                                }
                                // this.listGroup.push(group);
                                this.listChats.push(group);
                                break;
                            }
                        }
                    } else {
                        // this.listGroup.push(d);
                        if (d.type === 1) {
                            //club
                            this.listClub.push(d);
                        } else {
                            this.listGroup.push(d);
                        }
                        this.listChats.push(d);
                    }
                    continue;

                } else {
                    // this.listFriend.push(d);
                    // this.listChats.push(d);
                    // console.log('........................... d1 : ', d.type_chat, d.id);
                    if (this.listDataChat.length) {
                        // let groupChat = this.listDataChat.find((item, index) => item.id === d.id);
                        for (let i = 0; i < this.listDataChat.length; i++) {
                            let friend = this.listDataChat[i];
                            if (friend.id === d.id) {
                                this.listDataChat.splice(i, 1);
                                this.listFriend.push(friend);
                                this.listChats.push(friend);
                                continue;
                            }
                        }
                    } else {
                        console.log('........................... d2 : ', d.type_chat, d.id);
                        this.listFriend.push(d);
                        this.listChats.push(d);
                        continue;
                    }
                    //add user
                    console.log('.........................add user : ', d);
                    let obj_check_friend = this.listFriend.find(data => data.action_key === d.action_key);
                    if (!obj_check_friend) {
                        this.listFriend.push(d);
                        this.listChats.push(d);
                    }
                }
            }
            //gop cac nhom tu sever vao de tim  nhom moi
            for (let d of this.listDataChat) {
                let type = d.type;
                let type_chat = d.type_chat;
                if (type_chat === 1) {
                    if (type === 1) {
                        this.listClub.push(d);
                    } else {
                        this.listGroup.push(d);
                    }

                    // this.listGroup.push(d);
                    this.listChats.push(d);

                } else {
                    this.listFriend.push(d);
                    this.listChats.push(d);
                }
            }
            this.listDataChat = [];
            if (this.renderViewCallback) {
                this.renderViewCallback();
            }
            this.loadMessangeChat();
            return;
        }
        console.log('==================================== chay qua day khong============================');
        for (let d of this.listDataChat) {
            let type = d.type;
            let type_chat = d.type_chat;
            if (type_chat === 1) {
                // if (type === 1) {
                //     self.listClub.push(d);
                // } else if (type === 2 || type === 3 || type === 0) {
                //     self.listGroup.push(d);
                // }

                this.listGroup.push(d);
                this.listChats.push(d);

            } else {
                this.listFriend.push(d);
                this.listChats.push(d);
            }
        }
        this.listDataChat = [];
        if (this.renderViewCallback) {
            this.renderViewCallback();
        }

        this.loadMessangeChat();
        // this.listViewChat.setFillData(self.listChats);
        // self.loadMessageChat();
        // ListenerNewMessageChat.startListenner(this.listFriend, this.listGroup, this.listViewChat.renderItem.bind(this), this.sortListChat.bind(this), this.createdAt);
    }



    updateTotalMsg(add = true) {
        this.total_msg = this.total_msg > 0 ? this.total_msg : 0;
        if (this.renderBadgeCallback) {
            this.renderBadgeCallback(this.total_msg);
        }
    }

    setRenderViewCallback(_callback) {
        this.renderViewCallback = _callback;
    }
    /**
     * Tiep tuc lang nghe khi co tin nhan moi duoc add vao
     * @param {*} room_id 
     * @param {*} object 
     * @param {*} time_add_check 
     */
    lisntenerRoomChat(room_id, object, time_add_check) {
        time_add_check++;
        let ref = this.getRef().child('chat/' + room_id);
        ref.off();
        ref.orderByChild('createdAt').startAt(time_add_check).on('child_added', child => {
            let message = child.val();

            console.log('................................ lisntenerRoomChat : ', message);

            let { type } = message;
            if (type !== 'typing') {

                message.type = message.type ? message.type : 'text';
                let { user } = message;

                if (user && user.userid) {
                    if (user.userid.toLowerCase() === UserInfo.getUserId().toLowerCase()) {
                        message.direction = 2;
                    } else {
                        message.direction = 1;
                    }
                    if (object.hasOwnProperty('list_msg_chat_new')) {
                        let list_new = object['list_msg_chat_new'];

                        let length = list_new.length;
                        // console.log('..........................lenght : ', length);
                        if (length) {
                            let objUp = list_new[length - 1];
                            let user_up = objUp.user;
                            if (user_up) {
                                let { userid } = user_up;
                                let userid_check = user.userid;
                                let me = AppUtil.replaceUser(userid) === AppUtil.replaceUser(userid_check);
                                if (me) {
                                    message.hide_avatar = true;
                                }
                            }
                        }

                        list_new.push(message);

                    } else {
                        let list = [message];
                        object.list_msg_chat_new = list;
                    }
                    this.total_msg++;
                    this.updateTotalMsg();
                    if (this.renderViewCallback) {
                        this.renderViewCallback();
                    }
                }
            }
        });
        ref.on('child_removed', child => {
            let message = child.val();

            let { type } = message;
            if (type !== 'typing') {

                message.type = message.type ? message.type : 'text';
                let { user } = message;
                if (user.userid.toLowerCase() === UserInfo.getUserId().toLowerCase()) {
                    message.direction = 2;
                } else {
                    message.direction = 1;
                }
                if (object.hasOwnProperty('list_msg_chat_new')) {
                    let list_new = friend['list_msg_chat_new'];
                    let list_new_length = list_new.length;
                    for (let i = 0; i < list_new_length; i++) {
                        let msg = list_new[i];
                        if (msg.createdAt === message.createdAt) {
                            list_new.splice(i, 1);
                        }
                    }
                }
                this.total_msg--;
                this.updateTotalMsg(false);
                if (this.renderViewCallback) {
                    this.renderViewCallback();
                }
            }
        });
    }

    checkPlaySound(user) {
        console.log('....................... checkPlaySound : ');
        if (!user) {
            this.soundManager.play();
            return;
        }
        let { userid } = user;
        if (!userid) {
            this.soundManager.play();
        } else {
            if (AppUtil.replaceUser(userid) !== UserInfo.getId()) {
                this.soundManager.play();
            }
        }
    }

    getListMessageNew(list = []) {
        let self = this;
        let list_new = list.filter(function (d) {
            return (!d.hasOwnProperty(self.state_key) || !d[self.state_key]);
        });
        // console.log('....................list_new : ', self.state_key, list_new.length);
        return list_new;
    }

    getListMessageOld(list = []) {
        let self = this;
        let list_old = list.filter(function (d) {
            return (d.hasOwnProperty(self.state_key) && d[self.state_key]);
        });
        return list_old;
    }

    /**
     * chia tin nhan cu moi
     * @param {Array} listSource mảng dữ liệu nguồn
     * @param {Array} listNew 
     * @param {Array} listOld 
     */
    formatListNewOld(listSource = [], listNew = [], listOld = []) {
        let key = `user_${UserInfo.getId()}_readed`;
        console.log('................... formatListNewOld : ', key, listSource.length);
        for (let d of listSource) {
            console.log('..................... check : ', d);
            if (!d[key]) {
                // if (!d.hasOwnProperty(key) || !d[key]) {
                console.log('................... formatListNewOld 1 : ');
                listNew.push(d);
            } else {
                console.log('................... formatListNewOld 2 : ');
                listOld.push(d);
                if (listNew.length) {
                    listNew = [];
                }
            }
        }
        console.log('.................... mang moi la : ', listNew.length);
        if (listNew.length) {
            for (let d of listNew) {
                let length = listSource.length;
                for (let i = length - 1; i >= 0; i--) {
                    let s = listSource[i];
                    if (s.createdAt === d.createdAt) {
                        listSource.splice(i, 1);
                        break;
                    }
                }
            }
        }
        listOld = [...listSource];
        console.log('.................... mang moi la : ', listNew.length, listOld.length);
    }

    /**
     * lock khong load tin nhan khi user dang trong man hinh chat
     */
    setLockChangeChatCSKH(lock) {
        this.lock_change_chat_cskh = lock;
    }

    /**
     * lock khong load tin nhan khi user dang trong man hinh chat
     */
    setLockChangeChatTrongTai(lock) {
        this.lock_change_chat_trong_tai = lock;
    }

    // /**
    //  * load tin nhan khi co user moi chat
    //  * @param {String} path 
    //  * @param {Object} friend 
    //  * @param {String} room_id 
    //  * @param {Number} timeCheck 
    //  * @param {*} update_to_friend 
    //  */
    // async listenterMsgUser(path, friend, room_id, timeCheck = 0, update = false, room_chat_id = null) {

    //     let isUpdate_friend = false;
    //     let isPlaySound = false;

    //     let database = this.getBaseDatabase(room_chat_id);
    //     // let ref = this.getRef().child('chat/' + room_id);
    //     let ref = this.getRef().child(path + '/' + room_id);
    //     this.listChildRef.push(ref);
    //     console.log('............... room_id,time check : ', room_id, timeCheck, path);
    //     let time_add_check = 0;// > 0 ? timeCheck : (new Date()).getTime() - 10 * 24 * 60 * 60 * 1000;//load tin nhan cach day 10 ngay
    //     timeCheck = timeCheck > 0 ? timeCheck : (new Date()).getTime();
    //     ref.off();
    //     ref.on('child_changed', child => {
    //         if (this.room_id_locked === room_id) return;
    //         console.log('..........................child change : ', this.room_id_locked, room_id);

    //         let message = child.val();

    //         let { type, state_msg } = message;

    //         if (state_msg && state_msg.indexOf('update') >= 0) return;

    //         if (type !== 'typing') {
    //             let key = child.key;
    //             message.key = key;
    //             message.type = message.type ? message.type : 'text';
    //             let { user } = message;

    //             if (user && user.userid) {

    //                 this.checkPlaySound(user);
    //                 console.log('................... 2 ', room_id);
    //                 if (user.userid.toLowerCase() === UserInfo.getUserId().toLowerCase()) {
    //                     message.direction = 2;
    //                 } else {
    //                     message.direction = 1;
    //                 }

    //                 if (message.hasOwnProperty(this.state_key) && message[this.state_key]) {
    //                     if (friend.hasOwnProperty('list_msg_chat_old')) {
    //                         let list_msg_chat_old = friend['list_msg_chat_old'];

    //                         let length = list_msg_chat_old.length;

    //                         let length_check = length > 5 ? length - 5 : 0;
    //                         let obj_check_duplicate = null;
    //                         for (let i = length - 1; i >= 0; i--) {
    //                             let chat = list_msg_chat_old[i];
    //                             if (chat.createdAt === message.createdAt) {
    //                                 obj_check_duplicate = chat;
    //                                 break;
    //                             }
    //                         }
    //                         if (!obj_check_duplicate) {
    //                             // console.log('..........................lenght : ', length);
    //                             if (length) {
    //                                 let objUp = list_msg_chat_old[length - 1];
    //                                 let user_up = objUp.user;
    //                                 if (user_up) {
    //                                     let { userid } = user_up;
    //                                     let userid_check = user.userid;
    //                                     let me = AppUtil.replaceUser(userid) === AppUtil.replaceUser(userid_check);
    //                                     if (me) {
    //                                         message.hide_avatar = true;
    //                                     }
    //                                 }
    //                             }

    //                             list_msg_chat_old.push(message);
    //                             this.saveChat(message, database);
    //                         }
    //                     } else {
    //                         let list_old = [message];
    //                         friend.list_msg_chat_old = list_old;
    //                     }
    //                 } else {
    //                     this.total_msg++;
    //                     this.updateTotalMsg();
    //                     if (friend.hasOwnProperty('list_msg_chat_new')) {
    //                         let list_new = friend['list_msg_chat_new'];

    //                         let length = list_new.length;

    //                         let length_check = length > 5 ? length - 5 : 0;
    //                         let obj_check_duplicate = null;
    //                         for (let i = length - 1; i >= 0; i--) {
    //                             let chat = list_new[i];
    //                             if (chat.createdAt === message.createdAt) {
    //                                 obj_check_duplicate = chat;
    //                                 break;
    //                             }
    //                         }
    //                         // console.log('..........................lenght : ', length);
    //                         if (!obj_check_duplicate) {
    //                             if (length) {
    //                                 let objUp = list_new[length - 1];
    //                                 let user_up = objUp.user;
    //                                 if (user_up) {
    //                                     let { userid } = user_up;
    //                                     let userid_check = user.userid;
    //                                     let me = AppUtil.replaceUser(userid) === AppUtil.replaceUser(userid_check);
    //                                     if (me) {
    //                                         message.hide_avatar = true;
    //                                     }
    //                                 }
    //                             }

    //                             list_new.push(message);
    //                             this.saveChat(message, database);
    //                             friend.list_msg_chat_new = list_new;
    //                         }
    //                     } else {
    //                         let list = [message];
    //                         friend.list_msg_chat_new = list;
    //                     }
    //                 }

    //                 friend.createdAt = message.createdAt;
    //                 this.checkPlaySound(user);
    //                 if (this.renderViewCallback) {
    //                     this.renderViewCallback();
    //                 }
    //             }
    //         }
    //     });

    //     console.log('............................ lock private : ', this.lock_change_chat_private);
    //     ref.orderByChild('createdAt').startAt(time_add_check).on('child_added', child => {
    //         console.log('.................... rooom lock : ', this.room_id_locked, room_id);
    //         if (this.room_id_locked === room_id) return;

    //         let message = child.val();

    //         let { type } = message;
    //         if (type !== 'typing') {
    //             let key = child.key;
    //             message.key = key;
    //             // console.log('....................... added : ', time_add_check);
    //             message.type = message.type ? message.type : 'text';
    //             let { user } = message;

    //             if (user && user.userid) {

    //                 this.checkPlaySound(user);
    //                 console.log('................... 2 ', room_id);
    //                 if (user.userid.toLowerCase() === UserInfo.getUserId().toLowerCase()) {
    //                     message.direction = 2;
    //                 } else {
    //                     message.direction = 1;
    //                 }

    //                 if (message.hasOwnProperty(this.state_key) && message[this.state_key]) {
    //                     if (friend.hasOwnProperty('list_msg_chat_old')) {
    //                         let list_msg_chat_old = friend['list_msg_chat_old'];

    //                         let length = list_msg_chat_old.length;
    //                         // console.log('..........................lenght : ', length);
    //                         if (length) {
    //                             let objUp = list_msg_chat_old[length - 1];
    //                             let user_up = objUp.user;
    //                             if (user_up) {
    //                                 let { userid } = user_up;
    //                                 let userid_check = user.userid;
    //                                 let me = AppUtil.replaceUser(userid) === AppUtil.replaceUser(userid_check);
    //                                 if (me) {
    //                                     message.hide_avatar = true;
    //                                 }
    //                             }
    //                         }

    //                         list_msg_chat_old.push(message);
    //                         this.saveChat(message, database);
    //                     } else {
    //                         let list_old = [message];
    //                         friend.list_msg_chat_old = list_old;
    //                     }
    //                 } else {
    //                     this.total_msg++;
    //                     console.log('............................total msg : ', this.total_msg);
    //                     this.updateTotalMsg();
    //                     this.saveChat(message, database);
    //                     // if (friend.hasOwnProperty('list_msg_chat_new')) {
    //                     //     let list_new = friend['list_msg_chat_new'];

    //                     //     let length = list_new.length;
    //                     //     // console.log('..........................lenght : ', length);
    //                     //     if (length) {
    //                     //         let objUp = list_new[length - 1];
    //                     //         let user_up = objUp.user;
    //                     //         if (user_up) {
    //                     //             let { userid } = user_up;
    //                     //             let userid_check = user.userid;
    //                     //             let me = AppUtil.replaceUser(userid) === AppUtil.replaceUser(userid_check);
    //                     //             if (me) {
    //                     //                 message.hide_avatar = true;
    //                     //             }
    //                     //         }
    //                     //     }

    //                     //     list_new.push(message);
    //                     //     this.saveChat(message,database);
    //                     //     friend.list_msg_chat_new = list_new;
    //                     // } else {
    //                     //     let list = [message];
    //                     //     friend.list_msg_chat_new = list;
    //                     // }
    //                 }

    //                 friend.createdAt = message.createdAt;
    //                 this.checkPlaySound(user);
    //                 if (this.renderViewCallback) {
    //                     this.renderViewCallback();
    //                 }
    //             }
    //         }
    //     });
    //     ref.on('child_removed', child => {
    //         let message = child.val();

    //         message.type = message.type ? message.type : 'text';
    //         let { user } = message;
    //         if (user.userid.toLowerCase() === UserInfo.getUserId().toLowerCase()) {
    //             message.direction = 2;
    //         } else {
    //             message.direction = 1;
    //         }

    //         if (!message.hasOwnProperty(this.state_key) || !message[this.state_key]) {
    //             if (friend.hasOwnProperty('list_msg_chat_new')) {
    //                 let list_new = friend['list_msg_chat_new'];
    //                 let list_new_length = list_new.length;
    //                 for (let i = 0; i < list_new_length; i++) {
    //                     let msg = list_new[i];
    //                     if (msg.createdAt === message.createdAt) {
    //                         list_new.splice(i, 1);
    //                     }
    //                 }
    //             }
    //             this.total_msg--;
    //             this.updateTotalMsg(false);
    //         }

    //         if (this.renderViewCallback) {
    //             this.renderViewCallback();
    //         }
    //     });
    // }


    /**
     * load tin nhan khi co user moi chat
     * @param {String} path 
     * @param {Object} friend 
     * @param {String} room_id 
     * @param {Number} timeCheck 
     * @param {*} update_to_friend 
     */
    async listenterMsgUser(path, friend, room_id, timeCheck = 0, update = false, room_chat_id = null) {
        // if (this.renderViewCallback && !update_to_friend) {
        //     this.renderViewCallback();
        // }

        let isUpdate_friend = false;
        let isPlaySound = false;

        let database = this.getBaseDatabase(room_chat_id);
        let ref = this.getRef().child(path + '/' + room_id);
        this.listChildRef.push(ref);
        console.log('............... room_id,time check : ', room_id, timeCheck, path);
        let time_add_check = 0;// > 0 ? timeCheck : (new Date()).getTime() - 10 * 24 * 60 * 60 * 1000;//load tin nhan cach day 10 ngay
        timeCheck = timeCheck > 0 ? timeCheck : (new Date()).getTime();
        ref.orderByChild('createdAt').startAt(timeCheck).on('value', snapshot => {
            var items = [];
            snapshot.forEach(child => {
                let message = child.val();

                console.log('................... messager : ', message);
                let { type } = message;
                if (type === 'typing') {
                    let key = child.key;
                    message.key = key;
                    message.type = message.type ? message.type : 'text';
                    let { user } = message;
                    if (user && user.userid) {
                        if (user.userid.toLowerCase() !== UserInfo.getUserId().toLowerCase()) {
                            if (update) {
                                if (!isUpdate_friend) {
                                    friend.id = AppUtil.replaceUser(user.userid);
                                    friend.avatar = user.avatar;
                                    friend.fullname = user.fullname;
                                    friend.createdAt = message.createdAt;
                                    friend.can_delete = 0;
                                    isUpdate_friend = true;

                                    console.log('..................... check friend : ', friend);

                                    if (this.renderViewCallback) {
                                        this.renderViewCallback();
                                    }
                                }
                            }
                        }
                    }
                }
                // if (type !== 'typing') 
                else {

                    let key = child.key;
                    message.key = key;

                    message.type = message.type ? message.type : 'text';
                    let { user } = message;
                    if (user && user.userid) {

                        if (user.userid.toLowerCase() === UserInfo.getUserId().toLowerCase()) {
                            message.direction = 2;
                        } else {
                            if (!isPlaySound) {
                                this.checkPlaySound(user);
                                isPlaySound = true;
                            }
                            message.direction = 1;
                            if (update) {
                                if (!isUpdate_friend) {
                                    friend.id = AppUtil.replaceUser(user.userid);
                                    friend.avatar = user.avatar;
                                    friend.fullname = user.fullname;
                                    friend.createdAt = message.createdAt;
                                    isUpdate_friend = true;

                                    console.log('..................... check friend : ', friend);
                                    if (this.renderViewCallback) {
                                        this.renderViewCallback();
                                    }
                                }
                            }
                        }

                        let length = items.length;
                        // console.log('..........................lenght : ', length);
                        if (length) {
                            let objUp = items[length - 1];
                            let user_up = objUp.user;
                            if (user_up) {
                                let { userid } = user_up;
                                let userid_check = user.userid;
                                let me = AppUtil.replaceUser(userid) === AppUtil.replaceUser(userid_check);
                                if (me) {
                                    message.hide_avatar = true;
                                }
                            }
                        }

                        if (this.hashChatsNew.containsKey(room_chat_id)) {
                            let hashChats = this.hashChatsNew.get(room_chat_id);
                            if (hashChats && hashChats.length) {
                                let chat_check = hashChats.find(d => d.createdAt === message.createdAt);
                                if (!chat_check) {
                                    items.push(message);
                                    this.saveChat(message, database);
                                    hashChats.push(message);
                                    // this.total_msg++;
                                    time_add_check = message.createdAt;
                                }
                            }
                        } else {
                            let list = [];
                            items.push(message);
                            this.saveChat(message, database);
                            list.push(message);
                            // this.total_msg++;
                            time_add_check = message.createdAt;
                            this.hashChatsNew.put(room_chat_id, list);
                        }
                        console.log('................... items.push(message);');

                    }
                }
                // console.log('...................check tin nhan moi : ',room_id, timeCheck,time_add_check,(timeCheck - time_add_check));
            });

            let list_new = [...items];// this.getListMessageNew(items);
            let list_old = []; //this.getListMessageOld(items);
            console.log('............................ items.push : ', items.length);
            // this.formatListNewOld(items, list_new, list_old);


            // if (list_old.length) {
            //     if (friend.hasOwnProperty('list_msg_chat_old')) {
            //         let list_msg_chat_old = friend['list_msg_chat_old'];
            //         list_msg_chat_old = [...list_msg_chat_old, ...list_old]
            //         friend['list_msg_chat_old'] = list_msg_chat_old;
            //     } else {
            //         friend['list_msg_chat_old'] = list_old;
            //     }
            // }
            // console.log('............... list news : ', list_new.length,room_id);
            if (list_new.length) {
                if (friend.hasOwnProperty('list_msg_chat_new')) {
                    let list_msg_chat_new = friend['list_msg_chat_new'];
                    list_msg_chat_new = [...list_msg_chat_new, ...list_new];
                    friend.list_msg_chat_new = list_msg_chat_new;
                } else {
                    friend.list_msg_chat_new = list_new;
                    // this.total_msg = this.total_msg + list_new.length;
                    // this.updateTotalMsg();
                }
                this.total_msg = this.total_msg + list_new.length;
                this.updateTotalMsg();
            }


            friend.createdAt = time_add_check;


            // friend.list_msg_chat_new = items;

            if (this.renderViewCallback) {
                this.renderViewCallback();
            }
            ref.off();

            time_add_check++;

            ref.on('child_changed', child => {
                if (this.room_id_locked === room_id) return;
                console.log('..........................child change : ', this.room_id_locked, room_id);

                let message = child.val();

                let { type, state_msg } = message;

                if (state_msg && state_msg.indexOf('update') >= 0) return;

                if (type !== 'typing') {
                    let key = child.key;
                    message.key = key;
                    message.type = message.type ? message.type : 'text';
                    let { user } = message;

                    if (user && user.userid) {

                        this.checkPlaySound(user);
                        console.log('................... 2 ', room_id);
                        if (user.userid.toLowerCase() === UserInfo.getUserId().toLowerCase()) {
                            message.direction = 2;
                        } else {
                            message.direction = 1;
                        }

                        if (message.hasOwnProperty(this.state_key) && message[this.state_key]) {
                            if (friend.hasOwnProperty('list_msg_chat_old')) {
                                let list_msg_chat_old = friend['list_msg_chat_old'];

                                let length = list_msg_chat_old.length;

                                let length_check = length > 5 ? length - 5 : 0;
                                let obj_check_duplicate = null;
                                for (let i = length - 1; i >= 0; i--) {
                                    let chat = list_msg_chat_old[i];
                                    if (chat.createdAt === message.createdAt) {
                                        obj_check_duplicate = chat;
                                        break;
                                    }
                                }
                                if (!obj_check_duplicate) {
                                    // console.log('..........................lenght : ', length);
                                    if (length) {
                                        let objUp = list_msg_chat_old[length - 1];
                                        let user_up = objUp.user;
                                        if (user_up) {
                                            let { userid } = user_up;
                                            let userid_check = user.userid;
                                            let me = AppUtil.replaceUser(userid) === AppUtil.replaceUser(userid_check);
                                            if (me) {
                                                message.hide_avatar = true;
                                            }
                                        }
                                    }

                                    list_msg_chat_old.push(message);
                                    this.saveChat(message, database);
                                }
                            } else {
                                let list_old = [message];
                                friend.list_msg_chat_old = list_old;
                            }
                        } else {

                            if (this.hashChatsNew.containsKey(room_chat_id)) {
                                let hashChats = this.hashChatsNew.get(room_chat_id);
                                if (hashChats && hashChats.length) {
                                    let chat_check = hashChats.find(d => d.createdAt === message.createdAt);
                                    if (!chat_check) {
                                        items.push(message);
                                        hashChats.push(message);
                                        this.saveChat(message, database);
                                        // this.total_msg++;
                                        time_add_check = message.createdAt;

                                        this.total_msg++;
                                        this.updateTotalMsg();

                                        if (friend.hasOwnProperty('list_msg_chat_new')) {
                                            let list_new = friend['list_msg_chat_new'];

                                            let length = list_new.length;

                                            let length_check = length > 5 ? length - 5 : 0;
                                            let obj_check_duplicate = null;
                                            for (let i = length - 1; i >= 0; i--) {
                                                let chat = list_new[i];
                                                if (chat.createdAt === message.createdAt) {
                                                    obj_check_duplicate = chat;
                                                    break;
                                                }
                                            }
                                            // console.log('..........................lenght : ', length);
                                            if (!obj_check_duplicate) {
                                                if (length) {
                                                    let objUp = list_new[length - 1];
                                                    let user_up = objUp.user;
                                                    if (user_up) {
                                                        let { userid } = user_up;
                                                        let userid_check = user.userid;
                                                        let me = AppUtil.replaceUser(userid) === AppUtil.replaceUser(userid_check);
                                                        if (me) {
                                                            message.hide_avatar = true;
                                                        }
                                                    }
                                                }

                                                list_new.push(message);
                                                this.saveChat(message, database);
                                                friend.list_msg_chat_new = list_new;
                                            }
                                        } else {
                                            let list = [message];
                                            friend.list_msg_chat_new = list;
                                        }

                                        friend.createdAt = message.createdAt;
                                        this.checkPlaySound(user);
                                        if (this.renderViewCallback) {
                                            this.renderViewCallback();
                                        }
                                    }
                                }
                            }
                        }


                    }
                }
            });

            console.log('............................ lock private : ', this.lock_change_chat_private);
            ref.orderByChild('createdAt').startAt(time_add_check).on('child_added', child => {
                console.log('.................... rooom lock : ', this.room_id_locked, room_id);
                if (this.room_id_locked === room_id) return;

                let message = child.val();

                let { type } = message;
                if (type !== 'typing') {
                    let key = child.key;
                    message.key = key;
                    // console.log('....................... added : ', time_add_check);
                    message.type = message.type ? message.type : 'text';
                    let { user } = message;

                    if (user && user.userid) {

                        this.checkPlaySound(user);
                        console.log('................... 2 ', room_id);
                        if (user.userid.toLowerCase() === UserInfo.getUserId().toLowerCase()) {
                            message.direction = 2;
                        } else {
                            message.direction = 1;
                        }

                        if (this.hashChatsNew.containsKey(room_chat_id)) {
                            let hashChats = this.hashChatsNew.get(room_chat_id);
                            if (hashChats && hashChats.length) {
                                let chat_check = hashChats.find(d => d.createdAt === message.createdAt);
                                if (!chat_check) {
                                    items.push(message);
                                    hashChats.push(message);
                                    this.saveChat(message, database);
                                    // this.total_msg++;
                                    time_add_check = message.createdAt;

                                    this.total_msg++;
                                    this.updateTotalMsg();

                                    if (friend.hasOwnProperty('list_msg_chat_new')) {
                                        let list_new = friend['list_msg_chat_new'];

                                        let length = list_new.length;

                                        let length_check = length > 5 ? length - 5 : 0;
                                        let obj_check_duplicate = null;
                                        for (let i = length - 1; i >= 0; i--) {
                                            let chat = list_new[i];
                                            if (chat.createdAt === message.createdAt) {
                                                obj_check_duplicate = chat;
                                                break;
                                            }
                                        }
                                        // console.log('..........................lenght : ', length);
                                        if (!obj_check_duplicate) {
                                            if (length) {
                                                let objUp = list_new[length - 1];
                                                let user_up = objUp.user;
                                                if (user_up) {
                                                    let { userid } = user_up;
                                                    let userid_check = user.userid;
                                                    let me = AppUtil.replaceUser(userid) === AppUtil.replaceUser(userid_check);
                                                    if (me) {
                                                        message.hide_avatar = true;
                                                    }
                                                }
                                            }

                                            list_new.push(message);
                                            this.saveChat(message, database);
                                            friend.list_msg_chat_new = list_new;
                                        }
                                    } else {
                                        let list = [message];
                                        friend.list_msg_chat_new = list;
                                    }

                                    friend.createdAt = message.createdAt;
                                    this.checkPlaySound(user);
                                    if (this.renderViewCallback) {
                                        this.renderViewCallback();
                                    }
                                }
                            }
                        }

                        // if (message.hasOwnProperty(this.state_key) && message[this.state_key]) {
                        //     if (friend.hasOwnProperty('list_msg_chat_old')) {
                        //         let list_msg_chat_old = friend['list_msg_chat_old'];

                        //         let length = list_msg_chat_old.length;
                        //         // console.log('..........................lenght : ', length);
                        //         if (length) {
                        //             let objUp = list_msg_chat_old[length - 1];
                        //             let user_up = objUp.user;
                        //             if (user_up) {
                        //                 let { userid } = user_up;
                        //                 let userid_check = user.userid;
                        //                 let me = AppUtil.replaceUser(userid) === AppUtil.replaceUser(userid_check);
                        //                 if (me) {
                        //                     message.hide_avatar = true;
                        //                 }
                        //             }
                        //         }

                        //         list_msg_chat_old.push(message);
                        //         this.saveChat(message, database);
                        //     } else {
                        //         let list_old = [message];
                        //         friend.list_msg_chat_old = list_old;
                        //     }
                        // } else {
                        //     this.total_msg++;
                        //     console.log('............................total msg : ', this.total_msg);
                        //     this.updateTotalMsg();
                        //     this.saveChat(message, database);
                        //     // if (friend.hasOwnProperty('list_msg_chat_new')) {
                        //     //     let list_new = friend['list_msg_chat_new'];

                        //     //     let length = list_new.length;
                        //     //     // console.log('..........................lenght : ', length);
                        //     //     if (length) {
                        //     //         let objUp = list_new[length - 1];
                        //     //         let user_up = objUp.user;
                        //     //         if (user_up) {
                        //     //             let { userid } = user_up;
                        //     //             let userid_check = user.userid;
                        //     //             let me = AppUtil.replaceUser(userid) === AppUtil.replaceUser(userid_check);
                        //     //             if (me) {
                        //     //                 message.hide_avatar = true;
                        //     //             }
                        //     //         }
                        //     //     }

                        //     //     list_new.push(message);
                        //     //     this.saveChat(message,database);
                        //     //     friend.list_msg_chat_new = list_new;
                        //     // } else {
                        //     //     let list = [message];
                        //     //     friend.list_msg_chat_new = list;
                        //     // }
                        // }

                        // friend.createdAt = message.createdAt;
                        // this.checkPlaySound(user);
                        // if (this.renderViewCallback) {
                        //     this.renderViewCallback();
                        // }
                    }
                }
            });
            ref.on('child_removed', child => {
                let message = child.val();

                message.type = message.type ? message.type : 'text';
                let { user } = message;
                if (user.userid.toLowerCase() === UserInfo.getUserId().toLowerCase()) {
                    message.direction = 2;
                } else {
                    message.direction = 1;
                }

                if (!message.hasOwnProperty(this.state_key) || !message[this.state_key]) {
                    if (friend.hasOwnProperty('list_msg_chat_new')) {
                        let list_new = friend['list_msg_chat_new'];
                        let list_new_length = list_new.length;
                        for (let i = 0; i < list_new_length; i++) {
                            let msg = list_new[i];
                            if (msg.createdAt === message.createdAt) {
                                list_new.splice(i, 1);
                            }
                        }
                    }
                    this.total_msg--;
                    this.updateTotalMsg(false);
                }

                if (this.renderViewCallback) {
                    this.renderViewCallback();
                }
            });
        });
    }

    /**
     * "data":{

    "avg_handicap_display":16.7,
    "logo_url_path":"https://clubs.vhandicap.com/images/img_club/logo/logo_club1534402415.png",
    "img_background":"",
    "id":11,
    "manager_admin_id":0,
    "secretary_admin_id":0,
    "amanuensis":267,
    "moderator_club":6666,
    "home_facility_id":32,
    "name":"Hoàng Mai",
    "country":null,
    "city":null,
    "address":null,
    "about":null,
    "hotline":"+84947661966",
    "email":"hoangmai@gmail.com",
    "facebook_link":null,
    "is_public":1,
    "total_member":41,
    "avg_handicap":16.7,
    "created_at":"2018-08-16",
    "updated_at":"12:49:37,07-01-2019",
    "img_country":null,
    "total_point_ranking_vhandicap":729.7,
    "is_join_club":1

},
     * @param {*} club_id 
     */
    sendRequestInfoChatClub(club_id,body_chat) {
        let url = Config.getBaseUrl() + ApiService.club_info_chat(club_id);
        console.log('.................................. sendRequestInfoChatClub : ',url);
        let self = this;
        Networking.httpRequestGet(url, (jsonData) => {
            let{error_code,data} = jsonData;
            if(error_code === 0){
                let {is_join_club} = data;
                if(is_join_club === 1){
                    data.type_chat = 1;
                    data.type = 1;
                    self.listClub.push(data);
                    self.listChats.push(data);
                    self.startListenerMore(data, 1, body_chat);
                }
            }
        }, () => {

        });
    }

    /**
     * {"error_code":0,"data":{"image_path":"","id":1096,"host_user_id":4,"name":"Chat co notifi","total_member":2,"can_delete":1,"type":2,"created_at":"17:23:00,27-02-2019","updated_at":"17:23:00,27-02-2019","is_joined_group":1},"error_msg":null}
     * @param {*} group_id 
     */
    sendRequestInfoChatGroup(group_id, body_chat) {
        let url = Config.getBaseUrl() + ApiService.group_info_chat(group_id);
        console.log('............................... info group chat : ', url);
        let self = this;
        Networking.httpRequestGet(url, (jsonData) => {
            let { error_code, data } = jsonData;
            if (error_code === 0 && data) {
                let { is_joined_group } = data;
                if (is_joined_group === 1) {
                    //da trong group
                    data.type_chat = 1;
                    self.listGroup.push(data);
                    self.listChats.push(data);
                    self.startListenerMore(data, 2, body_chat);
                }
            }
        }, () => {

        });
    }

    setLockRoomId(_room_id) {
        this.room_id_locked = _room_id;
    }

    /**
     * 
     * @param {*} group 
     * @param {*} type = 1 club,2 group,3 friend
     */
    startListenerMore(group, type, body_chat = null) {
        let { id } = group;
        console.log("group id chat======================= ", id);
        if (!id) return;
        if (type === 1) {
            // let chatRef = this.getRef().child('chat/club-' + id);
            // this.listRef.push(chatRef);
            let room_id = 'club-' + id;
            let time = body_chat ? body_chat.createdAt - 2 : 0;
            this.listenterMsgFriend('chat', group, room_id, time);
        } else if (type === 2) {
            // let chatRef = this.getRef().child('chat/group-' + id);
            // this.listRef.push(chatRef);
            // this.loadMessageItem(chatRef, obj, i === length - 1 ? true : false);
            let room_id = 'group-' + id;
            let time = body_chat ? body_chat.createdAt - 2 : 0;
            this.listenterMsgFriend('chat', group, room_id, time);
        }
    }

    async saveChat(obj, baseDatabase) {
        if (!baseDatabase) return;
        let { user, type } = obj;
        if (type === 'removed'
            || type === 'typing'
            || !user) return;
        let chat_save = Object.assign({}, obj);
        chat_save.user = JSON.stringify(user);
        chat_save.id = chat_save.createdAt;

        // let keys = Object.keys(chat_save);
        // let list_user_readed = [];
        // for (let key of keys) {
        //     if (key.indexOf('user_') >= 0 && key.indexOf('_readed') >= 0) {
        //         let user_id_readed = key.replace('user_', '').replace('_readed', '');
        //         list_user_readed.push(parseInt(user_id_readed));
        //         chat_save[key] = undefined;
        //     }
        // }

        let msg_save = {
            id: chat_save.id,
            key: chat_save.key ? chat_save.key : '',
            type: chat_save.type,
            send_status: chat_save.send_status,
            readed: true,
            data: JSON.stringify(chat_save)
        }
        // chat_save.user_readed = list_user_readed;
        console.log('....................... luu du lieu vao database : ');
        return await baseDatabase.insert(msg_save);
    }

    async listenterMsgFriend(path, friend, room_id, timeCheck = 0, room_database = null) {
        if (this.renderViewCallback) {
            this.renderViewCallback();
        }
        // let ref = this.getRef().child('chat/' + room_id);
        let ref = this.getRef().child(path + '/' + room_id);
        this.listChildRef.push(ref);

        let baseDatabase = this.getBaseDatabase(room_database);
        let time_add_check = 0;

        if (timeCheck === 0) {
            let data_local = await baseDatabase.asyncQueryMsgNewsest();
            console.log('............................. dât_local : ', data_local);
            if (!data_local || !data_local.length) {
                time_add_check = (new Date()).getTime();
            } else {
                let length_local = data_local.length;
                if (length_local) {
                    time_add_check = data_local[0].id;
                    friend.list_msg_chat_old = [JSON.parse(data_local[0].data)];
                }
            }
        }else{
            time_add_check = timeCheck;
        }

        time_add_check++;
        console.log('........................... time_add_check  listenterMsgFriend : ', time_add_check, timeCheck);
        // ref.off();
        ref.orderByChild('createdAt').startAt(time_add_check).on('value', snapshot => {
            var items = [];
            snapshot.forEach(child => {
                let message = child.val();

                let { type } = message;
                if (type !== 'typing') {

                    let key = child.key;
                    message.key = key;

                    message.type = message.type ? message.type : 'text';
                    let { user } = message;
                    if (user && user.userid) {
                        if (user.userid.toLowerCase() === UserInfo.getUserId().toLowerCase()) {
                            message.direction = 2;
                        } else {
                            message.direction = 1;
                        }

                        let length = items.length;
                        // console.log('..........................lenght : ', length);
                        if (length) {
                            let objUp = items[length - 1];
                            let user_up = objUp.user;
                            if (user_up) {
                                let { userid } = user_up;
                                let userid_check = user.userid;
                                let me = AppUtil.replaceUser(userid) === AppUtil.replaceUser(userid_check);
                                if (me) {
                                    message.hide_avatar = true;
                                }
                            }
                        }

                        items.push(message);
                        this.saveChat(message, baseDatabase);
                        // this.total_msg++;
                        time_add_check = message.createdAt;
                    }
                }
                // console.log('...................check tin nhan moi : ',room_id, timeCheck,time_add_check,(timeCheck - time_add_check));
            });

            // let list_new = []; //this.getListMessageNew(items);
            let list_old = []; //this.getListMessageOld(items);
            // this.formatListNewOld(items, list_new, list_old);

            let list_new = items;

            this.hashChatsNew.put(room_id, items);

            console.log('................list cu, list moi listenterMsgFriend: ', list_new.length, list_old.length);


            if (list_old.length) {
                if (friend.hasOwnProperty('list_msg_chat_old')) {
                    let list_msg_chat_old = friend['list_msg_chat_old'];
                    list_msg_chat_old = [...list_msg_chat_old, ...list_old]
                    friend['list_msg_chat_old'] = list_msg_chat_old;
                } else {
                    friend['list_msg_chat_old'] = list_old;
                }
            }
            // console.log('............... list news : ', list_new.length,room_id);
            if (list_new.length) {
                if (friend.hasOwnProperty('list_msg_chat_new')) {
                    let list_msg_chat_new = friend['list_msg_chat_new'];
                    list_msg_chat_new = [...list_msg_chat_new, ...list_new];
                    friend.list_msg_chat_new = list_msg_chat_new;
                } else {
                    friend.list_msg_chat_new = list_new;
                    // this.total_msg = this.total_msg + list_new.length;
                    // this.updateTotalMsg();
                }
                this.total_msg = this.total_msg + list_new.length;
                this.updateTotalMsg();
            }


            friend.createdAt = time_add_check;


            // friend.list_msg_chat_new = items;

            if (this.renderViewCallback) {
                this.renderViewCallback();
            }
            ref.off();

            time_add_check++;
            // console.log('............................ time_add_check : ',room_id, time_add_check);
            ref.orderByChild('createdAt').startAt(time_add_check).on('child_added', child => {
                if (this.room_id_locked === room_id || this.lock_change_chat_private) return;
                let message = child.val();

                let { type } = message;
                if (type !== 'typing') {
                    let key = child.key;
                    message.key = key;
                    message.type = message.type ? message.type : 'text';
                    let { user } = message;

                    if (user && user.userid) {

                        // this.checkPlaySound(user);
                        console.log('................... 2 listenterMsgFriend', room_id);
                        if (user.userid.toLowerCase() === UserInfo.getUserId().toLowerCase()) {
                            message.direction = 2;
                        } else {
                            message.direction = 1;
                        }

                        if (message.hasOwnProperty(this.state_key) && message[this.state_key]) {
                            if (friend.hasOwnProperty('list_msg_chat_old')) {
                                let list_msg_chat_old = friend['list_msg_chat_old'];

                                let length = list_msg_chat_old.length;
                                // console.log('..........................lenght : ', length);
                                if (length) {
                                    let objUp = list_msg_chat_old[length - 1];
                                    let user_up = objUp.user;
                                    if (user_up) {
                                        let { userid } = user_up;
                                        let userid_check = user.userid;
                                        let me = AppUtil.replaceUser(userid) === AppUtil.replaceUser(userid_check);
                                        if (me) {
                                            message.hide_avatar = true;
                                        }
                                    }
                                }

                                list_msg_chat_old.push(message)
                            } else {
                                let list_old = [message];
                                friend.list_msg_chat_old = list_old;
                            }
                        } else {
                            this.total_msg++;
                            this.updateTotalMsg();
                            if (friend.hasOwnProperty('list_msg_chat_new')) {
                                let list_new = friend['list_msg_chat_new'];

                                let length = list_new.length;
                                // console.log('..........................lenght : ', length);
                                if (length) {
                                    let objUp = list_new[length - 1];
                                    let user_up = objUp.user;
                                    if (user_up) {
                                        let { userid } = user_up;
                                        let userid_check = user.userid;
                                        let me = AppUtil.replaceUser(userid) === AppUtil.replaceUser(userid_check);
                                        if (me) {
                                            message.hide_avatar = true;
                                        }
                                    }
                                }

                                list_new.push(message);
                                friend.list_msg_chat_new = list_new;
                            } else {
                                let list = [message];
                                friend.list_msg_chat_new = list;
                            }
                        }
                        //
                        if (this.hashChatsNew.containsKey(room_id)) {
                            let list_chats = this.hashChatsNew.get(room_id);
                            list_chats.push(message);
                        }

                        this.saveChat(message, baseDatabase);

                        friend.createdAt = message.createdAt;
                        this.checkPlaySound(user);
                        if (this.renderViewCallback) {
                            this.renderViewCallback();
                        }
                    }
                }
            });
            ref.on('child_removed', child => {
                let message = child.val();

                message.type = message.type ? message.type : 'text';
                let { user } = message;
                if (user.userid.toLowerCase() === UserInfo.getUserId().toLowerCase()) {
                    message.direction = 2;
                } else {
                    message.direction = 1;
                }

                if (!message.hasOwnProperty(this.state_key) || !message[this.state_key]) {
                    if (friend.hasOwnProperty('list_msg_chat_new')) {
                        let list_new = friend['list_msg_chat_new'];
                        let list_new_length = list_new.length;
                        for (let i = 0; i < list_new_length; i++) {
                            let msg = list_new[i];
                            if (msg.createdAt === message.createdAt) {
                                list_new.splice(i, 1);
                            }
                        }
                    }
                    this.total_msg--;
                    this.updateTotalMsg(false);
                }

                if (this.renderViewCallback) {
                    this.renderViewCallback();
                }
            });
        });
    }

    /**
     * Load tin nhan cu tu local
     */
    loadMessangeChat() {
        //load tin nhan ban be
        for (let friend of this.listFriend) {
            let id_firebase = friend.id_firebase;
            if (!this.uid_firebase || !id_firebase) continue;
            let id_room_chat = this.uid_firebase > id_firebase ? `${this.uid_firebase}-${id_firebase}` : `${id_firebase}-${this.uid_firebase}`;
            let timeCheck = 0;

            let { list_msg_chat_old } = friend;
            if (list_msg_chat_old && list_msg_chat_old.length) {
                let msg_old = list_msg_chat_old[0];
                timeCheck = msg_old.createdAt;
            }
            // else {
            //     timeCheck = 0;
            // }

            console.log('.......................... friend : ', friend)
            let userid = AppUtil.replaceUser(friend.id);

            let room_database_id = userid > UserInfo.getId() ? `vga${UserInfo.getId()}-vga${userid}` : `vga${userid}-vga${UserInfo.getId()}`;

            this.listenterMsgFriend('chat', friend, id_room_chat, timeCheck, room_database_id);
        }

        for (let club of this.listClub) {
            let id = club.id;
            if (!id) continue;
            let id_room_chat = `club-${id}`;
            let timeCheck = 0;

            let { list_msg_chat_old } = club;
            if (list_msg_chat_old && list_msg_chat_old.length) {
                let msg_old = list_msg_chat_old[0];
                timeCheck = msg_old.createdAt + 1;
            }
            //  else {
            //     timeCheck = (new Date()).getTime();
            // }
            this.listenterMsgFriend('chat', club, id_room_chat, timeCheck, id_room_chat);
        }

        for (let group of this.listGroup) {
            let id = group.id;
            if (!id) continue;
            let id_room_chat = `group-${id}`;
            let timeCheck = 0;
            let { list_msg_chat_old } = group;
            if (list_msg_chat_old && list_msg_chat_old.length) {
                let msg_old = list_msg_chat_old[0];
                timeCheck = msg_old.createdAt + 1;
            } 
            // else {
            //     timeCheck = (new Date()).getTime();
            // }
            this.listenterMsgFriend('chat', group, id_room_chat, timeCheck, id_room_chat);
        }
    }

    /**
     * Đăng ki lắng nghe khi có tin nhắn về
     * @param {String} _mode mode để lắng nghe (Chat,Commend) 
     */
    initListener(_mode = 'chat', _renderView) {
        this.mode = _mode;
        // this.renderViewCallback = _renderView;
        this.renderBadgeCallback = _renderView;
        this.chatRef = this.getRef().child(`${this.mode}/`);
        this.uid_firebase = UserInfo.getFuid();
        // this.chatRef = this.getRef().
        this.soundManager.create(sound_url);
        this.loadThreadedChat();
        // this.loadChatCSKH();
        // this.loadChatTrongTai();
        this.listenerChatFromUser();
        // this.loadGroupFromLocal();
        this.sendRequestListUserChat();

        console.log('update mode renderView : ', _renderView, this.uid_firebase);
        this.inited = true;
    }

    /**
     * Lắng nghe tin nhắn chát từ nhóm cskh
     */
    listenerChatFromTrongTai() {
        if (!this.key_chat_trong_tai) return;
        this.refTrongTai = this.getRef().child('trong_tai/' + this.key_chat_trong_tai);
        this.refTrongTai.on('child_changed', snap => {
            if (this.lock_change_chat_trong_tai) return;
            console.log('..................... nhom trong tai change : ', snap.key);
            let items = [];
            snap.forEach(d => {
                // let chat_key = d.key;
                let chat_value = d.val();
                // chat_value.key = chat_key;
                items.push(chat_value);
            });
            let length = items.length;
            if (length) {
                let obj = items[length - 1];
                let { type, user } = obj;
                console.log('........................... obj : ', obj);
                let key = snap.key;
                let keys = key.split('-');
                let id_firebase = (keys.length === 2) ? keys[1] : null;
                if (type !== 'typing' && user) {
                    // let group = {
                    //     type : 0,
                    //     type_chat : 1,
                    //     name : user.fullname,
                    //     id : user.userid,
                    //     avatar : user.avatar,
                    //     id_firebase : id_firebase
                    // }
                    console.log('.......................... user : ', user);


                    obj.id = snap.key;
                    // obj.type = 0;
                    obj.type_chat = 3;
                    obj.name = user.fullname;
                    obj.avatar = user.avatar;
                    obj.id_firebase = id_firebase;
                    obj.User = user;
                    obj.categoriz = 'trong_tai';

                    let obj_group = null;// this.listChats.find(d => { d.type_chat === 3 && d.id === user.userid });

                    let length_obj_group = this.listChats.length;
                    for (let i = length_obj_group - 1; i >= 0; i--) {
                        let d = this.listChats[i];
                        // console.log('................... check grop d ', d);
                        if (d.type_chat === 3 && d.id === snap.key) {
                            obj_group = d;
                            break;
                        }
                    }

                    if (!obj_group) {
                        this.listChats.push(obj);
                        this.checkPlaySound(user);

                        queryChat(snap.key).then((data) => {
                            let timeCheck = 0;
                            if (Object.keys(data).length) {
                                let list_chat = JSON.parse(data['0'].jsonData);
                                obj.list_msg_chat_old = list_chat;
                                let length = list_chat.length;
                                if (length) {
                                    let obj_ = list_chat[length - 1];
                                    timeCheck = obj_.createdAt + 1;
                                }
                            }
                            this.listenterMsgFriend('trong_tai/' + this.key_chat_trong_tai, obj, snap.key, timeCheck);
                        }, (error) => {
                            this.listenterMsgFriend('trong_tai/' + this.key_chat_trong_tai, obj, snap.key, 0);
                        });

                        // if (this.renderViewCallback) {
                        //     this.renderViewCallback();
                        // }
                    } else {
                        //co roi thi chi add tin nhan
                        // this.checkPlaySound(user);
                        if (!this.lock_change_chat_trong_tai) {
                            let { list_msg_chat_new, list_msg_chat_old } = obj_group;
                            if (list_msg_chat_new && list_msg_chat_new.length) {
                                let chat_obj = list_msg_chat_new[list_msg_chat_new.length - 1];
                                let timeCheck = chat_obj.createdAt + 1;
                                this.listenterMsgFriend('trong_tai/' + this.key_chat_trong_tai, obj_group, snap.key, timeCheck);
                            } else if (list_msg_chat_old && list_msg_chat_old.length) {
                                let chat_obj = list_msg_chat_old[list_msg_chat_old.length - 1];
                                let timeCheck = chat_obj.createdAt + 1;
                                this.listenterMsgFriend('trong_tai/' + this.key_chat_trong_tai, obj_group, snap.key, timeCheck);
                            } else {
                                //cha co tin nhan
                                this.listenterMsgFriend('trong_tai/' + this.key_chat_trong_tai, obj_group, snap.key, 0);
                            }

                        }
                    }
                }
            }
        });
    }

    setLockChangeChatPrivate(lock) {
        this.lock_change_chat_private = lock;
    }

    /**
     * Lắng nghe khi có user chat về
     */
    listenerChatFromUser() {
        this.refUser = this.getRef().child('chat');
        this.refUser.on('child_changed', snap => {
            
            let user_key = snap.key;

            if(this.room_id_locked === user_key) return;

            console.log('............... check child change : ', this.room_id_locked, user_key, snap.val());
            let body = snap.val();
            let keys = Object.keys(body);
            let chat = null;
            if (keys.length) {
                //co tin nhan chat
                
                chat = body[keys[keys.length-1]];
            }
            if (this.room_id_locked === user_key) return;
            let fuid = UserInfo.getFuid();
            console.log('........................... listenerChatFromUser : ', user_key, fuid);
            if (user_key.indexOf('group') >= 0) {
                //nhom chat
                console.log('...............................chat ggroup : ');
                let room_id = user_key;
                let _keys = room_id.split('-');
                if (_keys.length <= 1) return;
                let group_id = parseInt(_keys[1]);
                let group_obj = null;

                //tim info cua group

                for (let d of this.listGroup) {
                    console.log('.................... tim group : ', d.type, d.id, group_id);
                    if (d.type > 1 && d.id === group_id) {
                        //tim thay nhom
                        group_obj = d;
                        break;
                    }
                }
                //kiem tra xem co tim duoc khong
                if (group_obj) {
                    console.log('..................... tim duoc group : ', group_obj.id);
                    // if (!this.lock_change_chat_group) {
                    //     let { list_msg_chat_new, list_msg_chat_old } = group_obj;
                    //     if (list_msg_chat_new && list_msg_chat_new.length) {
                    //         let chat_obj = list_msg_chat_new[list_msg_chat_new.length - 1];
                    //         let timeCheck = chat_obj.createdAt + 1;
                    //         this.listenterMsgUser('chat/', group_obj, room_id, timeCheck, false, room_id);
                    //     } else if (list_msg_chat_old && list_msg_chat_old.length) {
                    //         let chat_obj = list_msg_chat_old[list_msg_chat_old.length - 1];
                    //         let timeCheck = chat_obj.createdAt + 1;
                    //         this.listenterMsgUser('chat/', group_obj, room_id, timeCheck, false, room_id);
                    //     } else {
                    //         //cha co tin nhan
                    //         this.listenterMsgUser('chat/', group_obj, room_id, 0, false, room_id);
                    //     }

                    // }
                    this.listenterMsgFriend('chat/', group_obj, room_id, 0, room_id);
                } else {
                    ///chua tim duoc thi lay request len sever
                    this.sendRequestInfoChatGroup(group_id, chat);
                }
            } else if (user_key.indexOf('club') >= 0) {
                //chat club
                console.log('.......................... chat club : ');
                let room_id = user_key;
                let _keys = room_id.split('-');
                if (_keys.length <= 1) return;
                let club_id = parseInt(_keys[1]);
                let club_obj = null;
                //tim info cua group
                for (let d of this.listClub) {
                    if (d.id === club_id) {
                        //tim thay nhom
                        club_obj = d;
                        break;
                    }
                }
                //kiem tra xem co tim duoc khong
                if (club_obj) {
                    // if (!this.lock_change_chat_group) {
                    //     let { list_msg_chat_new, list_msg_chat_old } = club_obj;
                    //     if (list_msg_chat_new && list_msg_chat_new.length) {
                    //         let chat_obj = list_msg_chat_new[list_msg_chat_new.length - 1];
                    //         let timeCheck = chat_obj.createdAt + 1;
                    //         this.listenterMsgUser('chat/', club_obj, room_id, timeCheck, false, room_id);
                    //     } else if (list_msg_chat_old && list_msg_chat_old.length) {
                    //         let chat_obj = list_msg_chat_old[list_msg_chat_old.length - 1];
                    //         let timeCheck = chat_obj.createdAt + 1;
                    //         this.listenterMsgUser('chat/', club_obj, room_id, timeCheck, false, room_id);
                    //     } else {
                    //         //cha co tin nhan
                    //         this.listenterMsgUser('chat/', club_obj, room_id, 0, false, room_id);
                    //     }
                    // }
                    this.listenterMsgFriend('chat/', club_obj, room_id, 0, room_id);

                } else {
                    ///chua tim duoc thi lay request len sever
                    this.sendRequestInfoChatClub(club_id,chat);
                }
            } else if (user_key.indexOf(fuid) >= 0) {
                //lay thong tin user chat vs minh
                let key_length = keys.length;
                for(let i = key_length-1;i>=0;i--){
                    let key = keys[i];
                    let _chat = body[key];
                    if(!_chat.user || !_chat.user.userid) continue;
                    let _userid = AppUtil.replaceUser(_chat.user.userid);
                    if(_userid !== UserInfo.getId()){
                        chat = _chat;
                        break;
                    }
                }

                //user chat
                console.log('..................... user chat : ', user_key);
                if(!chat) return;
                let { user } = chat;
                console.log('..................... user : ',user);
                if(!user || !user.userid) return;

                let _keys = user_key.split('-');
                if (_keys.length <= 1) return;
                let start = _keys[0];
                let end = _keys[1];
                let name = start > end ? start : end;
                let id = start > end ? end : start;

                let room_id = `${name}-${id}`;
                let friend_obj = {
                    type_chat: 0,
                    id_firebase: fuid === start ? end : start,
                    action_key: room_id,
                }

                let obj_check = null;
                let length_list_chat = this.listFriend.length;
                for (let i = length_list_chat - 1; i >= 0; i--) {
                    let d = this.listFriend[i];
                    // console.log('..................... vao day check : ', d.action_key);
                    if (AppUtil.replaceUser (d.id) === AppUtil.replaceUser(user.userid)) {
                        //da ton tai
                        // console.log('.......................ton tai nhom giong ', d);
                        obj_check = d;
                        break;
                    }
                }
                console.log('.............................. them user moi 0 : ',obj_check);
                if (!obj_check) {
                    console.log('.............................. them nhom moi : ', obj_check);
                    this.listChats.push(friend_obj);
                    this.listFriend.push(friend_obj);

                    // let user_body_chat = snap.val();
                    // let { user } = user_body_chat;
                    if (user && user.userid) {
                        friend_obj.avatar = user.avatar ? user.avatar : '';
                        friend_obj.fullname = user.fullname ? user.fullname : '';
                        
                        let userid = AppUtil.replaceUser(user.userid);
                        friend_obj.id = userid;
                        let room_database_id = userid > UserInfo.getId() ? `vga${UserInfo.getId()}-vga${userid}` : `vga${userid}-vga${UserInfo.getId()}`;
                        let timeCheck = chat.createdAt - 2;
                        this.listenterMsgFriend('chat/', friend_obj, room_id, 0, room_database_id);
                    }

                    // queryChat(room_id).then((data) => {
                    //     let timeCheck = 0;
                    //     if (Object.keys(data).length) {
                    //         let list_chat = JSON.parse(data['0'].jsonData);
                    //         friend_obj.list_msg_chat_old = list_chat;
                    //         let length = list_chat.length;
                    //         if (length) {
                    //             let obj_ = list_chat[length - 1];
                    //             timeCheck = obj_.createdAt + 1;
                    //         }
                    //     }
                    //     this.listenterMsgUser('chat/', friend_obj, room_id, timeCheck, true);
                    //     //load xong
                    // }, (error) => {
                    //     console.log('..................... loi ', error);
                    //     this.listenterMsgUser('chat/', friend_obj, room_id, 0, true);
                    // });
                    // if (this.renderViewCallback) {
                    //     this.renderViewCallback();
                    // }
                } else {
                    this.listenterMsgFriend('chat/', obj_check, room_id, 0, room_id);
                    // if (!this.lock_change_chat_private) {
                    //     let userid = AppUtil.replaceUser(obj_check.id);
                    //     let room_database_id = userid > UserInfo.getId() ? `vga${UserInfo.getId()}-vga${userid}` : `vga${userid}-vga${UserInfo.getId()}`;

                    //     let { list_msg_chat_new, list_msg_chat_old } = obj_check;
                    //     if (list_msg_chat_new && list_msg_chat_new.length) {
                    //         let chat_obj = list_msg_chat_new[list_msg_chat_new.length - 1];
                    //         let timeCheck = chat_obj.createdAt + 1;
                    //         this.listenterMsgUser('chat/', obj_check, room_id, timeCheck, false, room_database_id);
                    //     } else if (list_msg_chat_old && list_msg_chat_old.length) {
                    //         let chat_obj = list_msg_chat_old[list_msg_chat_old.length - 1];
                    //         let timeCheck = chat_obj.createdAt + 1;
                    //         this.listenterMsgUser('chat/', obj_check, room_id, timeCheck, false, room_database_id);
                    //     } else {
                    //         //cha co tin nhan
                    //         this.listenterMsgUser('chat/', obj_check, room_id, 0, false, room_database_id);
                    //     }

                    // }
                }
            }
        });
    }

    /**
     * Lắng nghe tin nhắn chát từ nhóm cskh
     */
    listenerChatFromCSKH() {
        if (!this.key_chat_cskh) return;
        this.refCSKH = this.getRef().child('cskh/' + this.key_chat_cskh);
        // this.listChildRef.push(this.refCSKH)
        // this.refCSKH.on('child_added', snap => {
        //     console.log('..................... nhom cskh added : ', snap.key);
        // });
        this.refCSKH.on('child_changed', snap => {
            console.log('..................... nhom cskh change : ', snap.key);
            let items = [];
            snap.forEach(d => {
                // let chat_key = d.key;
                let chat_value = d.val();
                // chat_value.key = chat_key;
                items.push(chat_value);
            });
            let length = items.length;
            if (length) {
                let obj = items[length - 1];
                let { type, user } = obj;
                console.log('........................... obj : ', obj);
                let key = snap.key;
                let keys = key.split('-');
                let id_firebase = (keys.length === 2) ? keys[1] : null;
                if (type !== 'typing' && user) {
                    // let group = {
                    //     type : 0,
                    //     type_chat : 1,
                    //     name : user.fullname,
                    //     id : user.userid,
                    //     avatar : user.avatar,
                    //     id_firebase : id_firebase
                    // }
                    console.log('.......................... user : ', user);


                    obj.id = snap.key;
                    obj.type = 0;
                    // obj.type_chat = 3;
                    obj.name = user.fullname;
                    obj.avatar = user.avatar;
                    obj.id_firebase = id_firebase;
                    obj.User = user;
                    obj.categoriz = 'cskh';

                    let obj_group = null;// this.listChats.find(d => { d.type_chat === 3 && d.id === user.userid });

                    let length_obj_group = this.listChats.length;
                    for (let i = length_obj_group - 1; i >= 0; i--) {
                        let d = this.listChats[i];
                        // console.log('................... check grop d ', d);
                        if (d.type_chat === 3 && d.id === snap.key) {
                            obj_group = d;
                            break;
                        }
                    }

                    if (!obj_group) {
                        this.listChats.push(obj);
                        this.checkPlaySound(user);

                        queryChat(snap.key).then((data) => {
                            let timeCheck = 0;
                            if (Object.keys(data).length) {
                                let list_chat = JSON.parse(data['0'].jsonData);
                                obj.list_msg_chat_old = list_chat;
                                let length = list_chat.length;
                                if (length) {
                                    let obj_ = list_chat[length - 1];
                                    timeCheck = obj_.createdAt + 1;
                                }
                            }
                            this.listenterMsgFriend('cskh/' + this.key_chat_cskh, obj, snap.key, timeCheck);
                        }, (error) => {
                            this.listenterMsgFriend('cskh/' + this.key_chat_cskh, obj, snap.key, 0);
                        });

                        // if (this.renderViewCallback) {
                        //     this.renderViewCallback();
                        // }
                    } else {
                        //co roi thi chi add tin nhan
                        // this.checkPlaySound(user);
                        if (!this.lock_change_chat_cskh) {
                            let { list_msg_chat_new, list_msg_chat_old } = obj_group;
                            if (list_msg_chat_new && list_msg_chat_new.length) {
                                let chat_obj = list_msg_chat_new[list_msg_chat_new.length - 1];
                                let timeCheck = chat_obj.createdAt + 1;
                                this.listenterMsgFriend('cskh/' + this.key_chat_cskh, obj_group, snap.key, timeCheck);
                            } else if (list_msg_chat_old && list_msg_chat_old.length) {
                                let chat_obj = list_msg_chat_old[list_msg_chat_old.length - 1];
                                let timeCheck = chat_obj.createdAt + 1;
                                this.listenterMsgFriend('cskh/' + this.key_chat_cskh, obj_group, snap.key, timeCheck);
                            } else {
                                //cha co tin nhan
                                this.listenterMsgFriend('cskh/' + this.key_chat_cskh, obj_group, snap.key, 0);
                            }

                        }
                    }
                }
            }
        });
    }

    /**
     * Cập nhật lại hàm render
     * @param {Function} _fun 
     */
    updateFuncRenderView(_fun) {
        this.renderViewCallback = _fun;
    }
    /**
     * sinh id lưu trữ comment
     * @param {*} name tên của dạng comment ví dụ flight,club
     * @param {*} id id của dạng đó ví dụ flight_id
     */
    generateId() {
        return `${this.name}-${this.id}`;
    }

    getRef() {
        return firebaseService.database().ref();
    }

    /**
     * Huy lắng nghe tin nhắn
     */
    offListeningChat() {
        this.chatRef.off();
    }

    /**
     * Hủy đăng ký lắng nghe tin nhắn chát
     */
    unRegisterHandle() {
        if (!this.listChildRef.length) return;
        for (let ref of this.listChildRef) {
            ref.off();
        }
        this.listRoomId = [];
        this.total_msg = 0;
        // this.destroy();
    }
}