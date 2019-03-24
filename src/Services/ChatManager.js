import firebaseService from './firebase';
// import SignInFirebase from './SignInFirebase';
import UserInfo from '../Config/UserInfo';
import AppUtil from '../Config/AppUtil';
import { insert, query } from '../DbLocal/ChatsRealm';
import SoundManager from '../Core/Manager/SoundManager';
// const state_key = `user_${UserInfo.getId()}_readed`;

const sound_url = 'msg_reviecei.wav';
// import AppUtil from '../Config/AppUtil';
/**
 * class quan ly chuc nang chat
 */
export default class ChatManager {
    constructor() {
        this.listMessages = [];
        this.chatRef = null;// this.getRef().child("commen/");//.orderByChild('order');
        this.chatRefData = null;// this.chatRef;//.orderByKey();
        this.renderViewCallback = null;
        this.renderViewNotScrollCallback = null;

        this.clearCommenCallback = null;
        this.startLoad = true;
        this.limit_record = 15;
        this.nextChildKey = null;
        this.name = '';
        this.id = '';
        this.inited = false;
        this.handleSendChatErrorCallback = null;

        this.listChildRef = [];

        this.createdAt_check = 0;

        this.state_key = '';

        this.soundManager = new SoundManager();
        this.soundManager.create(sound_url);

        this.obj_typing_chat = null;

        this.key_hide = '';

        this.isLock = true;
    }

    setLock(_lock) {
        this.isLock = _lock;
    }

    setStateKeyReaded(_user_id) {
        this.state_key = `user_${_user_id}_readed`;
    }

    setKeyHide(_user_id) {
        this.key_hide = `user_${_user_id}_hided`;
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
        this.limit_record = 15;
        this.nextChildKey = null;
        this.name = '';
        this.id = '';
        this.inited = false;
        this.handleSendChatErrorCallback = null;
        this.readedCallback = null;
    }

    /**
     * Ham callback khi co user doc tin tuc
     * @param {*} _callback 
     */
    setRenderReadedCallback(_callback) {
        this.readedCallback = _callback;
    }

    /**
     * lang nghe tin nhan khi co user push
     */
    initListingMsg() {
        //lang nghe khi co tin nhan ve
        this.chatRef = this.getRef().child('chat');

        // this.chatRef.orderByChild()
        console.log("initListingMSG---");
        //console.log("comment room id ", this.generateId());
        this.chatRefData = this.chatRef;
        this.inited = true;
        this.chatRef.once("child_added", snap => {
            // get children as an array
            //var items = [];
            snap.forEach(child => {
                //var name = child.val().uid == this.user.uid ? this.user.name : name1;
                let commen = child.val();
                //if (commen.id !== 'count_update') {
                // console.log("listen item message global : ", commen);
                //   commen.type = commen.type ? commen.type : 'text';
                //this.listMessages.push(commen);
                //}
            });
            if (this.renderViewCallback) {
                this.renderViewCallback();
            }
        });
    }

    /**
     * Lưu dữ liệu vào local
     */
    saveChatToLocal() {
        let id = this.name + '-' + this.id;
        let length = this.listMessages.length;
        if (length < 50) {
            insert(id, JSON.stringify(this.listMessages));
        } else {
            let list = this.listMessages.splice(length - 50, 50);
            insert(id, JSON.stringify(list));
        }
    }

    /**
     * Load dữ liệu từ local
     */
    loadChatFromLocal() {
        query().then((data) => {
            console.log('...................laod list chat screen tu local : ', data);
            // this.fillData();
            if (data) {
                this.listMessages = JSON.parse(data);
                let length = this.listMessages.length;
                if (length) {
                    let obj_end = this.listMessages[length - 1];
                    this.createdAt_check = obj_end.createdAt;
                    if (this.renderViewCallback) {
                        let l = this.listMessages.length;
                        if (l <= 12) {
                            this.renderViewCallback(this.listMessages);
                        } else {
                            let list = this.listMessages.slice(l - 12, l);
                            console.log('..........................length : ', list.length);
                            this.renderViewCallback(list);
                        }
                    }
                    //wait 500 ms de load tin moi
                    setTimeout(() => {
                        this.loadNewMessageFromSever();
                    }, 500)
                } else {
                    this.loadMessanger();
                }
            } else {
                this.loadMessanger();
            }
        }, (error) => {
            //load loi
            this.loadMessanger();
            console.log('...................load list chat screen loi : ', error);
        });
    }

    /**
     * Ham khởi tạo
     * @param {*} name 
     * @param {*} id 
     */
    init(name, id, renderViewCallback, renderViewNotScrollCallback, clearCommenCallback = null) {
        this.name = name;
        this.id = id;
        this.user = UserInfo.getFuid();// firebaseService.auth().currentUs;
        console.log('.......................... ss ', this.user);
        // if (!this.user) {
        //     // SignInFirebase.signInFirebase(UserInfo.getPhoneNumber(), '123123');
        //     return;
        // }
        this.renderViewCallback = renderViewCallback;
        this.renderViewNotScrollCallback = renderViewNotScrollCallback;
        this.clearCommenCallback = clearCommenCallback;
        this.chatRef = this.getRef().child('chat/' + this.generateId());
        console.log("comment room id ", this.generateId());
        this.chatRefData = this.chatRef;
        this.inited = true;
    }

    setRenderTypingCallback(_typingCallback, _hideTypingCallback) {
        this.renderTypingCallback = _typingCallback;
        this.renderHideTypingCallback = _hideTypingCallback;
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

    deleteTypingChat() {
        console.log('................. delete chat : ', this.obj_typing_chat);
        if (this.obj_typing_chat) {
            let { key } = this.obj_typing_chat;
            if (key) {
                let chatRef = this.chatRef.child(key);
                chatRef.remove((error) => {
                    chatRef.off();
                });
            }
        }
        if (this.clearTimeout) {
            clearTimeout(this.clearTimeout);
        }
    }

    /**
     * Gui tin nhan den firebase
     * @param {*} message 
     */
    sendToFirebase(message) {
        let { type } = message;

        if (type === 'typing') {
            this.obj_typing_chat = message;
            this.clearTimeout = setTimeout(() => {
                this.deleteTypingChat();
            }, 15000);
        } else if (this.obj_typing_chat) {
            let { key } = this.obj_typing_chat;
            if (key) {
                //co ton tai 
                if (this.clearTimeout) {
                    clearTimeout(this.clearTimeout);
                }
                let chatRef = this.chatRef.child(key);
                message[this.state_key] = true;
                chatRef.update(message, (error) => {
                    if (error) {
                        if (this.handleSendChatErrorCallback) {
                            this.handleSendChatErrorCallback(message, true);
                        }
                        console.log("Khong gui dc tin nhan den firebase ", error);
                    } else {
                        if (this.handleSendChatErrorCallback) {
                            this.handleSendChatErrorCallback(message, false);
                        }
                        console.log("gui tin nhan den firebase thanh cong!!!!!!");
                    }
                    chatRef.off();
                    this.obj_typing_chat = null;
                });
                return;
            }
        }
        message[this.state_key] = true;
        this.chatRef.push().set(message, (error) => {
            if (error) {
                if (this.handleSendChatErrorCallback) {
                    this.handleSendChatErrorCallback(message, true);
                }
                console.log("Khong gui dc tin nhan den firebase ", error);
            } else {
                if (this.handleSendChatErrorCallback) {
                    this.handleSendChatErrorCallback(message, false);
                }
                console.log("gui tin nhan den firebase thanh cong!!!!!!");
            }
        });
    }

    /**
     * update trang thai da doc
     * @param {*} list 
     */
    updateStateReaded(msg_obj) {

        let key = msg_obj.key;
        let state_readed = msg_obj[this.state_key];
        if (!state_readed) {
            //chua luu thi update
            let refChatData = this.chatRefData.child('/' + key);
            // let date = new Date();
            // let time = date.getTime();
            let item = {
                state_msg: 'update'
            };
            item[this.state_key] = true;
            refChatData.update(item, (error) => {
                if (!error) {
                    console.log('...............updater trang thai da doc thanh cong');
                }
                refChatData.off();
            });
        }
    }

    /**
     * An tin nhan cho minh
     */
    updateHideMsg(msg_obj) {
        let key = msg_obj.key;
        let state_hided = msg_obj[this.key_hide];
        if (!state_hided) {
            //chua luu thi update
            let refChatData = this.chatRefData.child('/' + key);
            // let date = new Date();
            // let time = date.getTime();
            let item = {};
            item[this.key_hide] = true;
            refChatData.update(item, (error) => {
                if (!error) {
                    console.log('...............updater trang thai da doc thanh cong');
                }
                refChatData.off();
            });
        }
    }

    /**
     * gui commen
     * @param {*} msg 
     */
    sendMsg(msg) {
        this.sendToFirebase(msg);
        console.log("message_obj : ", msg);
        if (this.clearCommenCallback) {
            this.clearCommenCallback();
        }
    }

    /**
     * Lấy tông comment không phân trang
     */
    loadTotalChat() {
        if (!this.inited) {
            console.warn("Bạn phải gọi hàm init trước nếu không chức năng này không thể hoạt động");
            return;
        }
        ///this.chatRef.set("day la gia tri value");
        //this.chatRefData.parent.ref.num
        this.chatRef.on('value', (snapshot) => {
            var items = [];
            // this.countComment = snapshot.numChildren();
            snapshot.forEach(child => {
                //var name = child.val().uid == this.user.uid ? this.user.name : name1;
                let message = child.val();
                // if (message.id !== 'count_update') {
                if (!this.nextChildKey) {
                    this.nextChildKey = message.order;
                    console.log("................nextChildKey : ", this.nextChildKey);
                }
                //console.log("listen item message : ", message);
                message.type = message.type ? message.type : 'text';
                let { user } = message;
                if (user.userid.toLowerCase() === UserInfo.getUserId().toLowerCase()) {
                    message.direction = 2;
                } else {
                    message.direction = 1;
                }
                items.push(message);
                // }
            });
            this.listMessages = items.slice(0);
            this.startLoad = true;
            if (this.renderViewCallback) {
                this.renderViewCallback(this.listMessages);
            }
        });
    }

    /**
     * load 10 comment dau tien
     * autu đăng ký lắng nghe tin nhắn đến
     */
    loadMessanger() {
        if (!this.inited) {
            console.warn("Bạn phải gọi hàm init trước nếu không chức năng này không thể hoạt động");
            return;
        }
        ///this.chatRef.set("day la gia tri value");
        //this.chatRefData.parent.ref.num
        console.log('............................................................ loadMessanger');
        this.chatRef.limitToLast(this.limit_record).on('value', (snapshot) => {
            var items = [];
            snapshot.forEach(child => {
                //var name = child.val().uid == this.user.uid ? this.user.name : name1;
                let message = child.val();

                let { type, state_msg } = message;
                if (!state_msg) {
                    if (type !== 'typing') {

                        if (!this.nextChildKey) {
                            this.nextChildKey = message.order;
                            // console.log("................nextChildKey : ", this.nextChildKey);
                        }

                        //loai bo nhung tin nhan ma minh an
                        if (!message.hasOwnProperty(this.key_hide) || !message[this.key_hide]) {
                            // continue;
                            //bo qua tin nhan bi xoa
                            //}

                            // console.log("listen item message : ", message);
                            message.type = message.type ? message.type : 'text';
                            message.key = child.key;

                            this.createdAt_check = message.createdAt;
                            console.log('........................createdAt check ', this.createdAt_check);

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

                                // console.log('.........................hide_avatar : ',message);

                                items.push(message);
                                this.listChildRef.push(child);
                            }
                        }
                    }
                }
            });
            this.listMessages = items.slice(0);
            this.startLoad = true;
            //auto lang nghe
            this.createdAt_check = (new Date()).getTime();
            this.listenForItems();
            this.listenForItemsChange();//lang nghe su kien change
            // this.listenForItemsRemove();
            if (this.renderViewCallback) {
                this.renderViewCallback(this.listMessages);
                // console.log("chat................................... ",this.listMessages);
            }
        });
    }

    /**
     * lang nghe khi co su thay doi tin nhan
     */
    listenChangeAndAddMsg() {
        console.log('................................ listenChangeAndAddMsg : ');
        this.startLoad = true;
        this.listenForItems();
        this.listenForItemsChange();//lang nghe su kien change
        // this.listenForItemsRemove();
    }

    /**
     * load trang comment tiep theo
     */
    loadMessageMore() {
        if (!this.inited) {
            console.warn("Bạn phải gọi hàm init trước nếu không chức năng này không thể hoạt động");
            return;
        }
        if (this.nextChildKey === null) return;
        // this.chatRef.off();
        let key = this.nextChildKey;
        this.nextChildKey = null;
        this.chatRef.orderByChild('order').startAt(key, 'order').limitToFirst(this.limit_record).on('value', (snapshot) => {
            var items = [];
            let snapCount = snapshot.numChildren();
            if (snapshot === 0) {
                this.nextChildKey = null;
            }
            console.log('.......................... load pre : ', snapshot.numChildren());
            let count = 0;
            snapshot.forEach(child => {
                //var name = child.val().uid == this.user.uid ? this.user.name : name1;
                count++;
                let message = child.val();
                let check = false;
                let { type } = message;
                if (type !== 'typing') {
                    // if (message.id !== 'count_update') {

                    //loai bo nhung tin nhan ma minh an
                    if (!message.hasOwnProperty(this.key_hide) || !message[this.key_hide]) {
                        // continue;
                        //bo qua tin nhan bi xoa
                        //}

                        // if (!this.nextChildKey) {
                        this.nextChildKey = message.order;
                        if (key === this.nextChildKey) {
                            console.log(".....................tim thay key giong nhau ", this.nextChildKey);
                            check = true;
                            // continue;
                        }
                        console.log("................nextChildKey more : ", this.nextChildKey);
                        // }
                        console.log("listen item message check : ", check);
                        if (!check) {
                            message.type = message.type ? message.type : 'text';
                            let { user } = message;
                            if (user && user.userid) {
                                if (user.userid.toLowerCase() === UserInfo.getUserId().toLowerCase()) {
                                    message.direction = 2;
                                } else {
                                    message.direction = 1;
                                }
                                // this.addToList(items, message);
                                items.push(message);
                                // this.listMessages.unshift(message);

                                this.listChildRef.push(child);
                            }
                        }
                    }
                }
            });
            if (!items.length) return;
            console.log('.................. tin nhan truoc do la : ', items.length, count);
            items = items.reverse();
            if (this.listMessages.length) {
                this.addPropertyHideAvatar(items, this.listMessages[0]);
            } else {
                this.addPropertyHideAvatar(items);
            }
            this.listMessages = items.concat(this.listMessages);
            this.startLoad = true;
            if (this.renderViewNotScrollCallback) {
                this.renderViewNotScrollCallback(this.listMessages, 20);
            }
        });
    }

    /**
     * Load tin nhắn mới từ sever
     */
    loadNewMessageFromSever() {
        this.chatRef.orderByChild('createdAt').startAt(this.createdAt_check).on('value', (snapshot) => {
            var items = [];
            snapshot.forEach(child => {
                //var name = child.val().uid == this.user.uid ? this.user.name : name1;
                let message = child.val();

                if (!this.nextChildKey) {
                    this.nextChildKey = message.order;
                    // console.log("................nextChildKey : ", this.nextChildKey);
                }
                // console.log("listen item message : ", message);
                message.type = message.type ? message.type : 'text';
                message.key = child.key;

                this.createdAt_check = message.createdAt;
                console.log('........................createdAt check ', this.createdAt_check);

                let { user } = message;
                if (user.userid.toLowerCase() === UserInfo.getUserId().toLowerCase()) {
                    message.direction = 2;
                } else {
                    message.direction = 1;
                }
                items.push(message);
                this.listChildRef.push(child);
            });
            this.listMessages = items.slice(0);
            this.startLoad = true;
            //auto lang nghe
            this.listenForItems();
            this.listenForItemsChange();//lang nghe su kien change
            if (this.renderViewNotScrollCallback) {
                // console.log("chat................................... ",this.listMessages);
                this.renderViewNotScrollCallback(this.listMessages);
            }
        });
    }

    checkDuplicate(obj) {
        let { type } = obj;
        let obj_check = null;
        if (type !== 'typing') {

            let length = this.listMessages.length;
            let length_check = length > 30 ? length - 30 : 0;
            for (let i = length - 1; i >= 0; i--) {
                let d = this.listMessages[i];
                console.log("or target ", parseInt(obj.createdAt), parseInt(d.createdAt));
                if (obj.createdAt === d.createdAt) {
                    obj_check = d;
                    break;
                }
            }
            // let length = this.listMessages.length;
            console.log('....................... length : ', length);
            if (length) {
                let objUp = this.listMessages[length - 1];
                let { user } = objUp;
                if (user) {
                    let { userid } = user;
                    let userid_check = obj.user.userid;
                    let me = AppUtil.replaceUser(userid) === AppUtil.replaceUser(userid_check);
                    if (me) {
                        obj.hide_avatar = true;
                    }
                }
                listTemp.push(obj);
            } else {
                listTemp.push(obj);
            }
        }
        return obj_check;
    }

    /**
     * add item vao list co kiem tra bị duplicate
     * @param {*} listTemp 
     * @param {*} obj 
     */
    addToList(listTemp, obj) {
        let { type } = obj;

        if (type !== 'typing') {
            console.log('................. listTemp', listTemp);
            // let length = this.listMessages.length;
            // let listClone = this.listMessages.slice(length-5,length-1);
            // let objCheck = this.listMessages.find(d => {
            //     console.log("or target ", parseInt(obj.createdAt), parseInt(d.createdAt));
            //     return (parseInt(d.createdAt) === parseInt(obj.createdAt));
            // });

            let objCheck = null;
            let length = this.listMessages.length;
            let length_check = length > 30 ? length - 30 : 0;
            for (let i = length - 1; i >= 0; i--) {
                let d = this.listMessages[i];
                console.log("or target ", parseInt(obj.createdAt), parseInt(d.createdAt));
                if (obj.createdAt === d.createdAt) {
                    objCheck = d;
                    break;
                }
            }

            console.log("check duplicate  ", objCheck);
            if (objCheck) {
                // this.isLoadPre = false;
                return;
            }
            // let length = this.listMessages.length;
            console.log('....................... length : ', length);
            if (length) {
                let objUp = this.listMessages[length - 1];
                let { user } = objUp;
                if (user) {
                    let { userid } = user;
                    let userid_check = obj.user.userid;
                    let me = AppUtil.replaceUser(userid) === AppUtil.replaceUser(userid_check);
                    if (me) {
                        obj.hide_avatar = true;
                    }
                }
                listTemp.push(obj);
            } else {
                listTemp.push(obj);
            }
        }
    }

    /**
     * Thêm thuộc tính ẩn avatar cho mảng
     * @param {Array} list 
     * @param {Object} objEnd thêm đối tượng cuối để loại bỏ nếu đang view avatar
     */
    addPropertyHideAvatar(list, objEnd = null) {
        let userid_check = null;
        for (let data of list) {
            let { user } = data;
            if (user && user.userid) {
                if (!userid_check) {
                    userid_check = user.userid;
                    continue;
                }

                let me = AppUtil.replaceUser(userid_check) === AppUtil.replaceUser(user.userid);
                if (me) {
                    data.hide_avatar = true;
                } else {
                    userid_check = user.userid;
                }
            }
        }
        if (objEnd) {
            let { user } = objEnd;
            if (user && user.userid) {
                let me = AppUtil.replaceUser(userid_check) === AppUtil.replaceUser(user.userid);
                if (me) {
                    objEnd.hide_avatar = true;
                } else {
                    objEnd.hide_avatar = undefined;
                }
            }
        }
    }

    checkPlaySound(user) {
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

    /**
     * lang nghe khi co su thay doi comment
     */
    listenForItems() {
        if (!this.inited) {
            console.warn("Bạn phải gọi hàm init trước nếu không chức năng này không thể hoạt động");
            return;
        }

        // if (!this.startLoad) return;
        this.chatRef.off();
        console.log('............................ listenForItems 0 : ', this.createdAt_check);
        this.createdAt_check = this.createdAt_check !== 0 ? this.createdAt_check : (new Date()).getTime();
        console.log('............................ listenForItems : ', this.inited, this.createdAt_check);
        //update ngay 24/11/2018
        this.chatRef.orderByChild('createdAt').startAt(this.createdAt_check).on("child_added", snap => {
            if (this.isLock) return;
            // get children as an array
            var items = [];
            let chat = snap.val();

            console.log('.......................parent key : ', snap.ref.parent.key);

            let { type } = chat;
            if (type === 'removed') return;

            if (type === 'typing') {
                if (!this.obj_typing_chat || !this.obj_typing_chat.createdAt || parseInt(chat.createdAt) !== parseInt(this.obj_typing_chat.createdAt)) {
                    if (this.renderTypingCallback) {
                        this.renderTypingCallback(chat);
                    }
                } else {
                    console.log('..........................============ copy : ');
                    if (parseInt(this.obj_typing_chat.createdAt) === parseInt(chat.createdAt)) {
                        // this.obj_typing_chat = Object.assign({}, chat);

                        if (this.obj_typing_chat) this.obj_typing_chat.key = snap.key;
                    }
                    console.log('..........................============ copy : 2', this.obj_typing_chat);
                }
                return;
            } else {
                if (this.renderHideTypingCallback) {
                    this.renderHideTypingCallback();
                }
            }

            //loai bo nhung tin nhan ma minh an
            if (chat.hasOwnProperty(this.key_hide) && chat[this.key_hide]) {
                return;
                //bo qua tin nhan bi xoa
            }

            console.log("listen item message : ", chat);
            chat.type = chat.type ? chat.type : 'text';
            chat.key = snap.key;
            let { user } = chat;
            if (AppUtil.replaceUser(user.userid) === AppUtil.replaceUser(UserInfo.getUserId())) {
                chat.direction = 2;
            } else {
                chat.direction = 1;
            }

            this.checkPlaySound(user);

            this.addToList(items, chat);
            if (this.renderViewCallback && items.length) {
                let obj = items[0];
                //update ngay 2-1-2019
                this.updateStateReaded(obj);
                // this.listMessages.push1(obj);
                this.pushToList(obj);
                // this.listMessages.unshift(obj);
                //moi lan co tin nhan ve thi save lai
                this.saveChatToLocal();
                this.renderViewCallback(this.listMessages);
            }
        });
    }

    deleteChat(ref, callback) {
        ref.remove((error) => {
            if (callback) {
                callback(error);
            }
        });
    }

    listenForItemsRemove() {
        console.warn("Bạn phải gọi hàm init trước nếu không chức năng này không thể hoạt động");
        if (!this.inited) {

            return;
        }
        console.warn("Bạn phải gọi hàm init trước nếu không chức năng này không thể hoạt động 2");
        this.chatRef.on("child_removed", snap => {
            // get children as an array
            console.log('.......................childe removed ', snap.val());
            let { type } = snap.val();
            if (type !== 'typing') {
                console.log('type remove ............... ', snap.val());
                let { user } = snap.val();
                if (user && user.userid) {
                    if (AppUtil.replaceUser(user.userid) === UserInfo.getId()) {
                        //dang la minh
                        return;
                    }
                }
                ///////////////////////////////////////////////
                for (let d of this.listMessages) {
                    if (d.key === snap.key) {
                        d.type = 'removed';
                        this.saveChatToLocal();
                        if (this.renderViewCallback) {
                            this.renderViewCallback(this.listMessages);
                        }
                        return;
                    }
                }
            }
        });
    }

    /**
     * lang nghe khi co su thay doi comment
     */
    listenForItemsChange() {
        if (!this.inited) {
            console.warn("Bạn phải gọi hàm init trước nếu không chức năng này không thể hoạt động");
            return;
        }
        if (!this.startLoad) return;
        // this.chatRef.off();

        this.chatRef.on("child_changed", snap => {
            if (this.isLock) return;
            // get children as an array
            console.log('.......................change ', snap.val());

            let chat = snap.val();
            let { type, state_msg } = chat;
            console.log('.....................state_msg : ', state_msg);
            //neu la tin nhan upate thi khong them moi chi can check trang thai
            if (state_msg && state_msg.indexOf('update') >= 0) {
                console.log('.....................state_msg 2 : ', state_msg);
                let { user } = chat;
                if (!user || !user.userid || !this.readedCallback) return;
                console.log('.....................state_msg 3 : ', user);
                if (AppUtil.replaceUser(user.userid) === UserInfo.getId()) {
                    console.log('.....................readedCallback 0: ', state_msg);
                    if (this.readedCallback) {
                        console.log('.....................readedCallback : ', state_msg);
                        this.readedCallback(chat);
                    }
                }
                return;
            }

            console.log('type change 0 ............... ', snap.val(), type);
            // var items = [];
            if (type !== 'typing') {
                console.log('type change ............... ', type, chat);
                if (type === 'removed') {
                    for (let d of this.listMessages) {
                        if (d.createdAt === chat.createdAt) {
                            d.type = 'removed';
                            this.saveChatToLocal();
                            if (this.renderViewCallback) {
                                this.renderViewCallback(this.listMessages);
                            }
                            //xoa tin nhan
                            return;
                        }

                    }
                }


                if (this.renderHideTypingCallback) {
                    this.renderHideTypingCallback();
                }
                ///////////////////////////////////////////
                if (type !== 'smart') {
                    let chat = snap.val();
                    chat.key = snap.key;
                    let items = [];

                    chat.type = chat.type ? chat.type : 'text';
                    let { user } = chat;
                    if (!user || !user.userid) return;
                    if (AppUtil.replaceUser(user.userid) === AppUtil.replaceUser(UserInfo.getUserId())) {
                        chat.direction = 2;

                        // if (this.readedCallback) {
                        //     this.readedCallback(chat);
                        // }
                    } else {
                        chat.direction = 1;
                        //cap nhat trang thai da doc
                    }

                    // this.updateStateReaded(chat);
                    // this.listMessages.push(chat);
                    //moi lan co tin nhan ve thi save lai
                    // this.saveChatToLocal();


                    this.addToList(items, chat);
                    console.log('.........................AddToList change: ', items.length);
                    if (this.renderViewCallback && items.length) {
                        let obj = items[0];
                        console.log('................obj tim duoc : ', obj);
                        //update ngay 2-1-2019
                        this.updateStateReaded(obj);
                        // this.listMessages.push1(obj);
                        this.pushToList(obj);
                        //moi lan co tin nhan ve thi save lai
                        this.saveChatToLocal();
                        this.renderViewCallback(this.listMessages);
                    }
                    return;
                }
                ///////////////////////////////////////////////
                let index = this.listMessages.findIndex(d => d.key === snap.key);
                console.log('change ', index);
                if (index !== -1) {
                    this.listMessages.splice(index, 1);
                    let chat = snap.val();
                    chat.key = snap.key;
                    this.updateStateReaded(chat);
                    // this.listMessages.push1(chat);

                    this.saveChatToLocal();

                    if (this.renderViewCallback) {
                        this.renderViewCallback(this.listMessages);
                    }
                }
            }
        });
    }

    /**
     * Add element vao mang co tinh doi cho
     * @param {*} msg 
     */
    pushToList(msg) {
        let length = this.listMessages.length;
        if (length) {
            let obj = this.listMessages[length - 1];
            if (obj.createdAt < msg.createdAt) {
                //swap
                this.listMessages[length - 1] = msg;
                this.listMessages.push(obj);
            }
        } else {
            this.listMessages.push(msg);
        }
        length = this.listMessages.length;
        if (length > 30) {
            this.listMessages = this.listMessages.slice(length - 30, length);
        }
    }
}