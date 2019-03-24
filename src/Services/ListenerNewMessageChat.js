import UserInfo from '../Config/UserInfo';
import firebaseService from './firebase';

/**
 * Lắng nghe tin nhắn chát cuối cùng để báo cho user
 */
class ListenerNewMessagerChat {
    constructor() {
        this.renderItemCallback = null;
        this.enter_page = false;
        this.user = UserInfo.getFuid();
        this.listFriend = [];
        this.listGroup = [];
        this.listClub = [];

        this.listRef = [];

        this.renderSortListCallback = null;
        this.isEnd = false;

        this.time_check_msg_new = 0;
    }

    destroy() {
        console.log('.................. destroy list listenner chats : ');
        this.listRef.forEach(r => r.off());
    }

    setFuid(_fuid) {
        console.log('.................... set fuid : ', _fuid);
        this.user = _fuid;
    }

    /**
     * Bắt đầu lắng nghe tin nhắn cuối cùng của chát
     * @param {Array} listFriend list các bạn bè
     * @param {Array} listGroup list các nhóm chát
     */
    startListenner(listFriend, listGroup, listClub, _renderCallback = null, _renderSortListCallback = null, time_check_msg_new = 0) {
        if (!listFriend.length && !listGroup.length) return;
        this.listFriend = listFriend;
        this.listGroup = listGroup;
        this.listClub = listClub;
        this.renderItemCallback = _renderCallback;
        this.renderSortListCallback = _renderSortListCallback;
        this.time_check_msg_new = time_check_msg_new;
        console.log('........................load createAt time : ', this.time_check_msg_new);
        this.loadMessageChat();
    }

    /**
     * Lang nghe su kien 
     * @param {*} list 
     * @param {*} type = 1 la club,2 la group,3 la friend
     */
    startListennerMore(obj, timeCheck = 0, type = 1) {
        length = list.length;
        //load tin nhan cuoi cung cua cac group
        // for (i = 0; i < length; i++) {
        // let group_object = list[i];
        let { id } = obj;
        console.log("group id chat======================= ", id);
        if (type === 1) {
            let chatRef = this.getRef().child('chat/club-' + id);
            this.listRef.push(chatRef);
            this.loadMessageItem(chatRef, obj, i === length - 1 ? true : false);
        } else if (type === 2) {
            let chatRef = this.getRef().child('chat/group-' + id);
            this.listRef.push(chatRef);
            this.loadMessageItem(chatRef, obj, i === length - 1 ? true : false);
        }
        // }
    }

    getChatPrivateId(puid_firebase) {
        if (this.user > puid_firebase) return `${this.user}-${puid_firebase}`;
        else return `${puid_firebase}-${this.user}`;
    }

    getRef() {
        return firebaseService.database().ref();
    }

    /**
 * load tin nhan cuoi cung cua cac user,group trong list chat
 */
    loadMessageChat() {

        //load tin nhan cuoi cung cua ban be
        let length = this.listFriend.length;
        let i = 0;
        console.log("lenght friend list : ", length);
        for (i = 0; i < length; i++) {
            //let isEnd = ((i === length-1) || (i === length)) ? true : false;
            let friend_object = this.listFriend[i];
            // let { TargetUser } = friend_object;
            let friend_id_firebase = friend_object.id_firebase;
            console.log("..............player ", friend_id_firebase);
            if (!friend_id_firebase) {
                continue;
            }
            let chatRef = this.getRef().child('chat/' + this.getChatPrivateId(friend_id_firebase));
            this.listRef.push(chatRef);
            //console.log("chat id friend --------------- ",isEnd);
            console.log("..............room id: ", this.getChatPrivateId(friend_id_firebase));
            this.loadMessageItem(chatRef, friend_object);
        }

        length = this.listGroup.length;
        //load tin nhan cuoi cung cua cac group
        for (i = 0; i < length; i++) {
            let group_object = this.listGroup[i];
            let { id } = group_object;
            console.log("group id chat======================= ", id);
            let chatRef = this.getRef().child('chat/group-' + id);
            this.listRef.push(chatRef);
            this.loadMessageItem(chatRef, group_object, false);
        }
        //load tin nhan cuoi cung cua cac club
        length = this.listClub.length;
        for (i = 0; i < length; i++) {
            let club_object = this.listClub[i];
            let { id } = club_object;
            let chatRef = this.getRef().child('chat/club-' + id);
            this.listRef.push(chatRef);
            this.loadMessageItem(chatRef, club_object, true);
        }
    }

    loadMessageItem(chatRef, object, isEnd = false) {
        let message = null;
        chatRef.off();
        chatRef.limitToLast(1).on('child_added', (snapshot) => {
            //dispatch(loadMessagesSuccess(snapshot.val()))

            message = snapshot.val();

            // console.log("message chat check new msg : ", message);
            // let obj = list[0];
            if (message) {
                object.text = message.text;
                // object.type = message.type;
                object.createdAt = message.createdAt;

                // object.isReaded = !this.enter_page;
                console.log('.......................... ', message.createdAt, this.time_check_msg_new, (message.createdAt - this.time_check_msg_new));
                object.isReaded = message.createdAt > this.time_check_msg_new ? false : true;
                let { user } = message;
                if (user) {
                    object.user = user;
                }
            }

            // console.log("message chat check new msg 2 : ", object);

            // //tam bo qua
            // if (this.renderItemCallback) {
            //     this.renderItemCallback(object);
            // }
            if (!this.isEnd) this.isEnd = isEnd;
            if (this.isEnd) {
                this.enter_page = true;
                if (this.renderSortListCallback) {
                    this.renderSortListCallback();
                }
            }
            //chatRef.off();
        });
    }
}

var listener = null;
if (!listener) {
    listener = new ListenerNewMessagerChat();
}
export default listener = listener;