import BaseModel from '../../Core/Model/BaseModel';
import UserProfileModel from '../Home/UserProfileModel';

class GroupMemberModel extends BaseModel {

    constructor(baseComponent) {
        super(baseComponent);
        this.memberList = [];
        this.adminList = [];
        this.users = [];
    }
    parseData(data) {
        super.parseData(data);
        if (this.data.hasOwnProperty('list_admin_group')) {
            for (let obj of this.data['list_admin_group']) {
                let admin = new UserProfileModel();
                admin.parseData(obj);
                admin.is_accepted = 1;
                this.adminList.push(admin);
            }
        }
        
        if (this.data.hasOwnProperty('list_member')) {
            for (let obj of this.data['list_member']) {
                let member = new UserProfileModel();
                member.parseData(obj);
                member.is_accepted = 1;
                this.memberList.push(member);
            }
        }

        if (this.data.hasOwnProperty('users')) {
            for (let obj of this.data['users']) {
                let member = new UserProfileModel();
                member.parseData(obj);
                member.is_accepted = 1;
                this.users.push(member);
            }
        }
    }
    getAdminList() { return this.adminList || []; }
    getMemberList() { return this.memberList || []; }
    getPlayerList() { return this.users || []; }
}

module.exports = GroupMemberModel;