import BaseModel from '../../Core/Model/BaseModel';
import UserProfileModel from '../Home/UserProfileModel';

class ClubMemberModel extends BaseModel {

    constructor() {
        super();
        this.memberList = [];
        this.adminList = [];    // chu tich clb
        this.generalSecretaryList = [];    // tong thu ky
        this.moderatorList = [];// quan tri vien
        this.birthdayMemberList = [];
    }
    parseData(data) {
        super.parseData(data);
        if (this.data.hasOwnProperty('list_user_admin')) {
            for (let obj of this.data['list_user_admin']) {
                let admin = new UserProfileModel();
                admin.parseData(obj);
                admin.status_friends = obj.status_friends;
                admin.is_accepted_permission = obj.is_accepted_permission;
                admin.invented_permission_type = obj.invented_permission_type;
                this.adminList.push(admin);
            }
        }

        if (this.data.hasOwnProperty('list_user_general_secretary_club')) {
            for (let obj of this.data['list_user_general_secretary_club']) {
                let generalSecretary = new UserProfileModel();
                generalSecretary.parseData(obj);
                generalSecretary.status_friends = obj.status_friends;
                generalSecretary.is_accepted_permission = obj.is_accepted_permission;
                generalSecretary.invented_permission_type = obj.invented_permission_type;
                this.generalSecretaryList.push(generalSecretary);
            }
        }

        if (this.data.hasOwnProperty('list_user_moderator_club')) {
            for (let obj of this.data['list_user_moderator_club']) {
                let moderator = new UserProfileModel();
                moderator.parseData(obj);
                moderator.status_friends = obj.status_friends;
                moderator.is_accepted_permission = obj.is_accepted_permission;
                moderator.invented_permission_type = obj.invented_permission_type;
                this.moderatorList.push(moderator);
            }
        }
        
        if (this.data.hasOwnProperty('list_members')) {
            for (let obj of this.data['list_members']) {
                let member = new UserProfileModel();
                member.parseData(obj);
                member.status_friends = obj.status_friends;
                member.is_accepted = obj.is_accepted;
                member.star = obj.star;
                this.memberList.push(member);
            }
        }

        if (this.data.hasOwnProperty('list_member_birthday_in_month')) {
            for (let obj of this.data['list_member_birthday_in_month']) {
                let member = new UserProfileModel();
                member.parseData(obj);
                member.status_friends = obj.status_friends;
                member.is_accepted = obj.is_accepted;
                member.star = obj.star;
                this.birthdayMemberList.push(member);
            }
        }

        if (this.data instanceof Array) {
            for (let obj of this.data) {
                let member = new UserProfileModel();
                member.parseData(obj);
                member.status_friends = obj.status_friends;
                member.is_accepted = obj.is_accepted;
                member.star = obj.star;
                member.is_pay = obj.is_pay;
                member.date_expried_display = obj.date_expried_display;
                member.is_expried_time = obj.is_expried_time;
                this.memberList.push(member);
            }
        }
    }
    getAdminList() { return this.adminList || []; }
    getMemberList() { return this.memberList || []; }
    getGeneralSecretaryList() { return this.generalSecretaryList || []; }
    getModeratorList() { return this.moderatorList || []; }
    getBirthdayMemberList() { return this.birthdayMemberList || []; }
}

module.exports = ClubMemberModel;