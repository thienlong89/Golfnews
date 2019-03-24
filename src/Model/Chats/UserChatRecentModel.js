import BaseModel from '../../Core/Model/BaseModel';

class UserItemChat{
    constructor(_type){
        this.type = _type;
    }

    parseData(data){
        if(data.hasOwnProperty('id')){
            this.id = data['id'];
        }
        if(data.hasOwnProperty('fullname')){
            this.fullname = data['fullname'];
        }
        if(data.hasOwnProperty('avatar')){
            this.avatar = data['avatar'];
        }
        if(data.hasOwnProperty('id_firebase')){
            this.id_firebase = data['id_firebase'];
        }
    }

    getUserId(){
        return this.id ? this.id : '';
    }

    getFullname(){
        return this.fullname ? this.fullname : '';
    }

    getAvatar(){
        return this.avatar ?  this.avatar : '';
    }

    getIdFirebaseChat(){
        return this.id_firebase ? this.id_firebase : '';
    }
}

/**
 * model khi lay danh sach hay chat gan day cua user
 */
export default class UserChatRecentModel extends  BaseModel{
    constructor(baseComponent){
        super(baseComponent);
        this.listChats = [];
    }

    parseData(jsonData){
        super.parseData(jsonData);
        if(jsonData.hasOwnProperty('data')){
            this.data = jsonData['data'];
            for(let row of this.data){
                if(row.hasOwnProperty('FriendChats')){
                    let rowData = row['FriendChats'];
                    let ItemModel = new UserItemChat('friend');
                    ItemModel.parseData(rowData);
                    this.listChats.push(ItemModel);
                }
            }
        }
    }

    getListUsers(){
        return this.listChats;
    }
}