import UserProfile from '../../Model/Home/UserProfileModel'

class StatusModel {

    constructor() {
        this.id = 0;
        this.user_id = 0;
        this.type_feel = 0;
        this.id_stt = 0;
        this.type = '';
        this.created_at = '';
        this.updated_at = '';
        this.status_friend = 0;
        this.user_profile = {};
    }

    parseData(data) {
        if (data.hasOwnProperty('id')) {
            this.id = parseFloat(data['id']);
        }
        if (data.hasOwnProperty('user_id')) {
            this.user_id = parseFloat(data['user_id']);
        }
        if (data.hasOwnProperty('type_feel')) {
            this.type_feel = parseFloat(data['type_feel']);
        }
        if (data.hasOwnProperty('id_stt')) {
            this.id_stt = parseFloat(data['id_stt']);
        }
        if (data.hasOwnProperty('type')) {
            this.type = data['type'];
        }
        if (data.hasOwnProperty('created_at')) {
            this.created_at = data['created_at'];
        }
        if (data.hasOwnProperty('updated_at')) {
            this.updated_at = data['updated_at'];
        }
        if (data.hasOwnProperty('status_friend')) {
            this.status_friend = parseFloat(data['status_friend']);
        }
        if (data.hasOwnProperty('Users')) {
            this.user_profile = new UserProfile();
            this.user_profile.parseData(data['Users']);
        }
    }
    getId() { return this.id || 0; }
    getUserId() { return this.user_id || 0; }
    getTypeFeel() { return this.type_feel || 0; }
    getIdStt() { return this.id_stt || 0; }
    getType() { return this.type || ''; }
    getCreatedAt() { return this.created_at || ''; }
    getUpdatedAt() { return this.updated_at || ''; }
    getStatusFriend() { return this.status_friend || 0; }
    getUserProfile() { return this.user_profile || {}; }
}

module.exports = StatusModel;
