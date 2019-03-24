import BaseModel from '../../Core/Model/BaseModel';

class EventMember{
    constructor(){

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
        if(data.hasOwnProperty('ehandicap_club')){
            this.ehandicap_club = data['ehandicap_club'];
        }
        if(data.hasOwnProperty('ehandicap_member_id')){
            this.ehandicap_member_id = data['ehandicap_member_id'];
        }
        if(data.hasOwnProperty('usga_hc_index')){
            this.usga_hc_index = data['usga_hc_index'];
        }
        if(data.hasOwnProperty('is_accepted')){
            this.is_accepted = data['is_accepted'];
        }
        if(data.hasOwnProperty('course_index')){
            this.course_index = parseFloat(data['course_index']);
        }
    }

    getId(){
        return this.id ? this.id : '';
    }

    getFullname(){
        return this.fullname ? this.fullname : '';
    }

    getAvatar(){
        return this.avatar ? this.avatar : '';
    }

    getClubId(){
        return this.ehandicap_club ? this.ehandicap_club : '';
    }

    getMemberId(){
        return this.ehandicap_member_id ? this.ehandicap_member_id : '';
    }

    getHandicap(){
        return this.usga_hc_index ? this.usga_hc_index : '';
    }

    getAccepted(){
        return this.is_accepted ? parseInt(this.is_accepted) : 0;
    }

    getCourseIndex(){
        return (this.course_index !== undefined) ? this.course_index : '';
    }
}

export default class EventMemberModel extends BaseModel{
    constructor(baseComponent){
        super(baseComponent);
        this.list_member = [];
    }

    parseData(jsonData){
        super.parseData(jsonData);
        if(this.getErrorCode() === 0){
            if(this.data.hasOwnProperty('users')){
                let users = this.data['users'];
                for(let user of users){
                    let itemModel = new EventMember();
                    itemModel.parseData(user);
                    this.list_member.push(itemModel);
                }
            }
        }
    }

    getListMember(){
        return this.list_member;
    }
}