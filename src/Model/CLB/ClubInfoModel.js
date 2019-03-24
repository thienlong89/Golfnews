import BaseModel from '../../Core/Model/BaseModel';
import UserProfileModel from '../Home/UserProfileModel';

class ClubInfoModel extends BaseModel {

    constructor() {
        super();
        this.avg_handicap_display = '';
        this.logo_url_path = '';
        this.img_background = '';
        this.id = 0;
        this.name = '';
        this.moderator_club = 0;
        this.amanuensis = 0;
        this.country = '';
        this.city = '';
        this.address = '';
        this.about = '';
        this.hotline = 0;
        this.email = '';
        this.created_at = '';
        this.total_member = 0;
        this.avg_handicap = '';
        this.facebook_link = '';
        this.adminList = [];
        this.list_user_general_secretary_club = [];
        this.list_user_moderator_club = [];
        this.memberList = [];
        this.friendList = [];
        this.topicList = [];
        this.imgList = [];
        this.uid_in_club = '';
        this.total_img_traditional = 0;
        this.img_traditional_display = [];
        this.invented_permission_club = '';
    }
    parseData(data) {
        super.parseData(data);
        if (this.data.hasOwnProperty('club')) {
            let club = this.data['club'];

            if (club.hasOwnProperty('avg_handicap_display')) {
                this.avg_handicap_display = club['avg_handicap_display'];
            }
            if (club.hasOwnProperty('logo_url_path')) {
                this.logo_url_path = club['logo_url_path'];
            }
            if (club.hasOwnProperty('img_background')) {
                this.img_background = club['img_background'];
            }
            if (club.hasOwnProperty('id')) {
                this.id = parseFloat(club['id']);
            }
            if (club.hasOwnProperty('name')) {
                this.name = club['name'];
            }
            if (club.hasOwnProperty('moderator_club')) {
                this.moderator_club = parseFloat(club['moderator_club']);
            }
            if (club.hasOwnProperty('amanuensis')) {
                this.amanuensis = parseFloat(club['amanuensis']);
            }
            if (club.hasOwnProperty('country')) {
                this.country = club['country'];
            }
            if (club.hasOwnProperty('city')) {
                this.city = club['city'];
            }
            if (club.hasOwnProperty('address')) {
                this.address = club['address'];
            }
            if (club.hasOwnProperty('about')) {
                this.about = club['about'];
            }
            if (club.hasOwnProperty('hotline')) {
                this.hotline = parseFloat(club['hotline']);
            }
            if (club.hasOwnProperty('email')) {
                this.email = club['email'];
            }
            if (club.hasOwnProperty('created_at')) {
                this.created_at = club['created_at'];
            }
            if (club.hasOwnProperty('total_member')) {
                this.total_member = parseFloat(club['total_member']);
            }
            if (club.hasOwnProperty('avg_handicap')) {
                this.avg_handicap = club['avg_handicap'];
            }
            if (club.hasOwnProperty('facebook_link')) {
                this.facebook_link = club['facebook_link'];
            }
            if (club.hasOwnProperty('list_user_admin_club')) {
                for (let obj of club['list_user_admin_club']) {
                    let admin = new UserProfileModel();
                    admin.parseData(obj);
                    this.adminList.push(admin);
                }
    
            }

            if (club.hasOwnProperty('list_user_general_secretary_club')) {
                for (let obj of club['list_user_general_secretary_club']) {
                    let secretaryGeneral = new UserProfileModel();
                    secretaryGeneral.parseData(obj);
                    this.list_user_general_secretary_club.push(secretaryGeneral);
                }
    
            }

            if (club.hasOwnProperty('list_user_moderator_club')) {
                for (let obj of club['list_user_moderator_club']) {
                    let admin = new UserProfileModel();
                    admin.parseData(obj);
                    this.list_user_moderator_club.push(admin);
                }
    
            }
    
            if (club.hasOwnProperty('list_member')) {
                for (let obj of club['list_member']) {
                    let member = new UserProfileModel();
                    member.parseData(obj);
                    this.memberList.push(member);
                }
    
            }
    
            if (club.hasOwnProperty('list_friends_in_club')) {
                for (let obj of club['list_friends_in_club']) {
                    this.friendList.push(obj);
                }
    
            }

            if (club.hasOwnProperty('list_topic')) {
                for (let obj of club['list_topic']) {
                    this.topicList.push(obj);
                }
    
            }

            if (club.hasOwnProperty('list_img')) {
                for (let obj of club['list_img']) {
                    this.imgList.push(obj);
                }
            }

            if (club.hasOwnProperty('uid_in_club')) {
                this.uid_in_club = club['uid_in_club'];
            }

            if (club.hasOwnProperty('total_img_traditional')) {
                this.total_img_traditional = club['total_img_traditional'];
            }

            if (club.hasOwnProperty('img_traditional_display')) {
                this.img_traditional_display = club['img_traditional_display'];
            }

            if (club.hasOwnProperty('invented_permission_club')) {
                this.invented_permission_club = club['invented_permission_club'];
            }
        }
        
    }
    getLogoUri() { return this.logo_url_path || ''; }
    getImgBackground() { return this.img_background || ''; }
    getId() { return this.id || 0; }
    getName() { return this.name || ''; }
    getModerator() { return this.moderator_club || 0; }
    getAmanuensis() { return this.amanuensis || 0; }
    getCountry() { return this.country || ''; }
    getCity() { return this.city || ''; }
    getAddress() { return this.address || ''; }
    getAbout() { return this.about || ''; }
    getHotline() { return this.hotline || 0; }
    getEmail() { return this.email || ''; }
    getCreatedAt() { return this.created_at || ''; }
    getTotalMember() { return this.total_member || 0; }
    getFacebookLink() { return this.facebook_link || ''; }
    getAdminList() { return this.adminList || []; }
    getSecretaryGeneralList() { return this.list_user_general_secretary_club || []; }
    getModeratorList() { return this.list_user_moderator_club || []; }
    getMemberList() { return this.memberList || []; }
    getFriendList() { return this.friendList || []; }
    getTopicList() { return this.topicList || []; }
    getImgList() { return this.imgList || []; }
    getPermissionClub() { return this.uid_in_club || ''; }
    getTraditionalImgList() { return this.img_traditional_display || []; }
    getTotalTraditionalImg() { return this.total_img_traditional || 0; }
    getInvitePermissionClub() { return this.invented_permission_club || ''; }
}

module.exports = ClubInfoModel;