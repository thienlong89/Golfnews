import BaseModel from '../../Core/Model/BaseModel';
import CLBItemModel from './CLBItemModel';

class ClubInfoListModel extends BaseModel {
    constructor(baseComponent) {
        super(baseComponent);

        this.clubList = [];
        this.list_invitation = [];
        this.list_invitation_permission = [];
    }

    parseData(jsonData) {
        super.parseData(jsonData);

        if (this.data.hasOwnProperty('list_club')) {
            for (let obj of this.data['list_club']) {
                let itemModel = new ClubItemListModel();
                itemModel.parseData(obj);
                this.clubList.push(itemModel);
            }
        }

        if (this.data.hasOwnProperty('list_invitation')) {
            for (let obj of this.data['list_invitation']) {
                let itemModel = new ClubItemListModel();
                itemModel.parseData(obj);
                this.list_invitation.push(itemModel);
            }
        }

        if (this.data.hasOwnProperty('list_invitation_permission')) {
            for (let obj of this.data['list_invitation_permission']) {
                let itemModel = new ClubItemListModel();
                itemModel.parseData(obj);
                this.list_invitation_permission.push(itemModel);
            }
        }
    }

    getClubList() {
        return this.clubList ? this.clubList : [];
    }

    getInviteClubList() {
        return this.list_invitation ? this.list_invitation : [];
    }

    getInvitePermissionClubList() {
        return this.list_invitation_permission ? this.list_invitation_permission : [];
    }
}

class ClubItemListModel {

    constructor() {

        this.id = 0;
        this.user_id = 0;
        this.club_id = 0;
        this.is_user_admin = 0; // 1: chu tich clb
        this.is_general_secretary = 0; // 1: tong thu ky
        this.is_moderator = 0; // 1: ban dieu hanh
        this.is_accepted_permission = 0; // 0: chua chap nhan quyen; 1: da chap nhan quyen
        this.created_at = '';
        this.updated_at = '';
        this.invited_by_user_id = 0;
        this.is_accepted = 0;
        this.type_invented_permission = 0;
        this.club = {};
    }

    parseData(jsonData) {
        if (jsonData.hasOwnProperty('id')) {
            this.id = parseFloat(jsonData['id']);
        }
        if (jsonData.hasOwnProperty('user_id')) {
            this.user_id = parseFloat(jsonData['user_id']);
        }
        if (jsonData.hasOwnProperty('club_id')) {
            this.club_id = parseFloat(jsonData['club_id']);
        }
        if (jsonData.hasOwnProperty('is_user_admin')) {
            this.is_user_admin = parseFloat(jsonData['is_user_admin']);
        }
        if (jsonData.hasOwnProperty('is_general_secretary')) {
            this.is_general_secretary = parseFloat(jsonData['is_general_secretary']);
        }
        if (jsonData.hasOwnProperty('is_moderator')) {
            this.is_moderator = parseFloat(jsonData['is_moderator']);
        }
        if (jsonData.hasOwnProperty('is_accepted_permission')) {
            this.is_accepted_permission = parseFloat(jsonData['is_accepted_permission']);
        }
        if (jsonData.hasOwnProperty('type_invented_permission')) {
            this.type_invented_permission = parseFloat(jsonData['type_invented_permission']);
        }
        if (jsonData.hasOwnProperty('created_at')) {
            this.created_at = jsonData['created_at'];
        }
        if (jsonData.hasOwnProperty('updated_at')) {
            this.updated_at = jsonData['updated_at'];
        }
        if (jsonData.hasOwnProperty('invited_by_user_id')) {
            this.invited_by_user_id = parseFloat(jsonData['invited_by_user_id']);
        }
        if (jsonData.hasOwnProperty('is_accepted')) {
            this.is_accepted = parseFloat(jsonData['is_accepted']);
        }

        if (jsonData.hasOwnProperty('Club')) {
            this.club = new CLBItemModel();
            this.club.paserData(jsonData['Club']);
        }
    }

    getId() { return this.id || 0; }
    getUserId() { return this.user_id || 0; }
    getClubId() { return this.club_id || 0; }
    getIsUserAdmin() { return this.is_user_admin || 0; }
    getIsModerator() { return this.is_moderator || 0; }
    getIsGeneralSecretary() { return this.is_general_secretary || 0; }
    getIsAcceptedPermission() { return this.is_accepted_permission || 0; }
    getTypePermission() { return this.type_invented_permission || 0; }
    getCreatedAt() { return this.created_at || ''; }
    getUpdatedAt() { return this.updated_at || ''; }
    getInvitedByUserId() { return this.invited_by_user_id || 0; }
    getIsAccepted() { return this.is_accepted || 0; }
    getClub() {
        return this.club ? this.club : {};
    }
}

module.exports = ClubInfoListModel;