import BaseModel from '../../Core/Model/BaseModel';
import LeaderBoardUserItemModel from './LeaderBoardUserItemModel';

class LeaderBoardModel extends BaseModel{
    constructor(baseComponent){
        super(baseComponent);
        this.itemMe = null;
        this.listUsers = [];
        this.ranking_type = '';
    }

    parseData(jsonData){
        super.parseData(jsonData);
        //console.log("json data ",this.data);
        if(this.getErrorCode()===0){
            if(this.data.hasOwnProperty('ranking_type')){
                this.ranking_type = this.data['ranking_type'];
            }
            if(this.data.hasOwnProperty('me')){
                let objMe = this.data['me'];
               // console.log("type of ",(typeof objMe));
                if(objMe instanceof Object){
                    this.itemMe = new LeaderBoardUserItemModel();
                    this.itemMe.paserData(objMe);
                }
            }
            if(this.data.hasOwnProperty('users')){
                let array_user = this.data['users'];
                let i=0,length = array_user.length;
               // console.log("length data : ",array_user);
                for(;i<length;i++){
                    let item = array_user[i];
                    let itemModel = new LeaderBoardUserItemModel();
                    itemModel.paserData(item);
                    this.listUsers.push(itemModel);
                }
            }
        }
    }

    getItemMe(){
        return this.itemMe ? this.itemMe : null;
    }

    getRankingType(){
        return this.ranking_type ? this.ranking_type : '';
    }

    getListUsers(){
        return this.listUsers ? this.listUsers : [];
    }
}

module.exports = LeaderBoardModel;