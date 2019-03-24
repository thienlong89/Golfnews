import firebaseService from '../../Services/firebase';
import CommentManager from './CommentManager';
import HashTable from '../../Library/HashTable';

class ListennerCommentManager{
    constructor(){
        this.type = 'flight';//discu_club,event,flight
        this.listCommentManager = new HashTable();
    }

    listenerForCommentFlight(){
        if(this.id === 0) return;
        this.ref = firebaseService.database().ref().child(`${this.parent}/${this.type}-${this.id}`);
        this.ref.limitToLast(this.count_record).on('value',snap=>{
            snap.forEach(comment=>{
                let key = comment.key;
            })
        });
    }

    /**
     * add CommentManager vào hashTable
     * @param {String} key 
     * @param {CommentManager} value
     */
    addListennerComment(key,value){
        if(this.listCommentManager.containsKey(key)){
            return;
        }
        this.listCommentManager.put(key,value);
    }

    /**
     * Xóa 1 CommentManager 
     * @param {String} key flight-id,event-id,club-id
     */
    removeListennerComment(key){
        if(!this.listCommentManager.containsKey(key)) return;
        this.listCommentManager.remove(key);
    }

    /**
     * Tạo mới hoặc trả về clas CommentManager
     * @param {String} key flight-id,event-id,club-id
     */
    getListennerComment(key){
        console.log('................... getListennerComment : ',key);
        if(this.listCommentManager.containsKey(key)){
            return this.listCommentManager.get(key);
        }
        let commentManager = new CommentManager();
        this.listCommentManager.put(key,commentManager);
        return commentManager;
    }
}

var listennerCommentManager = null;
if(!listennerCommentManager){
    listennerCommentManager = new ListennerCommentManager();
}

export default listennerCommentManager = listennerCommentManager;