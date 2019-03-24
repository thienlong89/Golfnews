import BaseModel from '../../Core/Model/BaseModel';
import FriendItemModel from './FriendItemModel';

class FriendsModel extends BaseModel{
    constructor(baseComponent){
        super(baseComponent);
        this.meItem = null;
        this.listFriends = [];
    }

    parseData(jsonData){
        super.parseData(jsonData);
        if(this.getErrorCode() === 0){
            //console.log("data ",this.data);
            if(this.data.hasOwnProperty('me')){
                let objMe = this.data['me'];
                this.meItem = new FriendItemModel();
                this.meItem.paserData(objMe);
            }
            //man hinh ban be
            if(this.data.hasOwnProperty('friends')){
                let arrayData = this.data['friends'];
                for(let obj of arrayData){
                    let itemModel = new FriendItemModel();
                    itemModel.paserData(obj);
                    this.listFriends.push(itemModel);
                }
                
            }
            //man hinh timf kiem user
            if(this.data.hasOwnProperty('users')){
                let arrayData = this.data['users'];
                for(let obj of arrayData){
                    let itemModel = new FriendItemModel();
                    itemModel.paserData(obj);
                    this.listFriends.push(itemModel);
                }
            }
            //man hinh member cua group
            if(this.data.hasOwnProperty('members')){
                let arrayData = this.data['members'];
                for(let obj of arrayData){
                    let itemModel = new FriendItemModel();
                    itemModel.paserData(obj);
                    this.listFriends.push(itemModel);
                }
            }

            //du lieu nguoi choi gan day
            if(Array.isArray(this.data)){
                for(let obj of this.data){
                    let itemModel = new FriendItemModel();
                    itemModel.paserData(obj);
                    this.listFriends.push(itemModel);
                }
            }
        }
    }

    getMeData(){
        return this.meItem;
    }

    getListFriendData(){
        return this.listFriends;
    }
}

module.exports = FriendsModel;