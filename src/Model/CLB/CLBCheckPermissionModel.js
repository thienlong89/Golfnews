import BaseModel from '../../Core/Model/BaseModel';

export default class CLBCheckPermissionModel extends BaseModel{
    constructor(baseComponent){
        super(baseComponent);
        this.invitation_id = '';
        this.created_at = '';
        this.invited_by_user_id = '';
        this.club_id = '';
        this.is_user_admin = '';
        this.is_accepted = 0;
        this.is_member = false;
    }

    parseData(jsonData){
        super.parseData(jsonData);
        if(this.data.hasOwnProperty('invitation')){
            this.data = this.data['invitation'];
            //check xem co thong tin invitatinon khong
            //neu khong co thi uer khong dc xem thanh vien
            if(!Object.keys(this.data).length){
                this.is_member = false;
                return;
            }

            if(this.data.hasOwnProperty('club_id')){
                this.club_id = this.data['club_id'];
            }
            if(this.data.hasOwnProperty('created_at')){
                this.created_at = this.data['created_at'];
            }
            if(this.data.hasOwnProperty('id')){
                this.invitation_id = this.data['id'];
            }
            if(this.data.hasOwnProperty('invited_by_user_id')){
                this.invited_by_user_id = this.data['invited_by_user_id'];
            }
            if(this.data.hasOwnProperty('is_user_admin')){
                this.is_user_admin = parseInt(this.data['is_user_admin']) || false;
            }
            if(this.data.hasOwnProperty('is_accepted')){
                this.is_accepted = this.data['is_accepted'];
            }
            this.is_member = true;
        }else{
            this.is_member = false;
        }
    }

    IsMember(){
        return this.is_member;
    }

    getInvitationId(){
        return this.invitation_id;
    }

    getCreateAt(){
        return this.created_at;
    }

    getUserInvited(){
        return this.invited_by_user_id;
    }
    
    getClubId(){
        return this.club_id;
    }

    IsAdmin(){
        return this.is_user_admin === 1 ? true : false;
    }

    IsAccepted(){
        return this.is_accepted === 1 ? true : false;
    }
}