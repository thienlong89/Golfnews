import BaseModel from '../../Core/Model/BaseModel';

class EHandicapMemberItemModel{
    constructor(){}

    parseData(data){
        if(data.hasOwnProperty('id')){
            this.id = data['id'];
        }
        if(data.hasOwnProperty('club_id')){
            this.club_id = data['club_id'];
        }
        if(data.hasOwnProperty('member_id')){
            this.member_id = data['member_id'];
        }
        if(data.hasOwnProperty('member_name')){
            this.member_name = data['member_name'];
        }
        if(data.hasOwnProperty('member_nickname')){
            this.member_nickname = data['member_nickname'];
        }
        if(data.hasOwnProperty('home_tee')){
            this.home_tee = data['home_tee'];
        }
        if(data.hasOwnProperty('member_index')){
            this.member_index = data['member_index'];
        }
        if(data.hasOwnProperty('member_handicap')){
            this.member_handicap = data['member_handicap'];
        }
    }

    getId(){
        return this.id ? this.id : '';
    }

    getClubId(){
        return this.club_id ? this.club_id : '';
    }

    getMemberId(){
        return this.member_id ? this.member_id : '';
    }

    getMemberName(){
        return this.member_name ? this.member_name : '';
    }

    getMemberNickname(){
        return this.member_nickname ?  this.member_nickname : '';
    }

    getHomeTee(){
        return this.home_tee ? this.home_tee : '';
    }

    getMemberIndex(){
        return this.member_index ? this.member_index : '';
    }

    getMemberHandicap(){
        return this.member_handicap ? this.member_handicap : '';
    }
}

export default class EHandicapMemberModel extends BaseModel{
    constructor(baseComponent){
        super(baseComponent);
        this.list_members = [];
    }

    parseData(jsonData){
        super.parseData(jsonData);
        if(this.getErrorCode()===0){
            for(let d of this.data){
                let itemModel = new EHandicapMemberItemModel();
                itemModel.parseData(d);
                this.list_members.push(itemModel);
            }
        }
    }

    getListMember(){
        return this.list_members;
    }
}