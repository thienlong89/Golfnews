import UserProfileModel from '../Home/UserProfileModel';
import PostStatusModel from '../Social/PostStatusModel';
import Utils from '../../Utils';
import CLBItemModel from './CLBItemModel';

class PostStatusItemModel {

    constructor() {
        this.id = 0;
        this.user_id = 0;
        this.club_id = 0;
        this.topic_id = 0;
        this.content = '';
        this.img_content = '';
        this.created_at = '';
        this.updated_at = '';
        this.is_timestamp = 0;
        this.timeDisplay = '';

        this.user = {};
        this.topic = {};
        this.post_status = {};
        this.club = {};
    }
    parseData(data) {
        if (data.hasOwnProperty('id')) {
            this.id = parseFloat(data['id']);
        }
        if (data.hasOwnProperty('user_id')) {
            this.user_id = parseFloat(data['user_id']);
        }
        if (data.hasOwnProperty('club_id')) {
            this.club_id = parseFloat(data['club_id']);
        }
        if (data.hasOwnProperty('topic_id')) {
            this.topic_id = parseFloat(data['topic_id']);
        }
        if (data.hasOwnProperty('content')) {
            this.content = data['content'];
        }
        if (data.hasOwnProperty('img_content')) {
            this.img_content = data['img_content'];
        }
        if (data.hasOwnProperty('created_at')) {
            this.created_at = data['created_at'];
        }
        if (data.hasOwnProperty('updated_at')) {
            this.updated_at = data['updated_at'];
        }
        if (data.hasOwnProperty('is_timestamp')) {
            this.is_timestamp = parseFloat(data['is_timestamp']);
        }

        if (data.hasOwnProperty('Topic')) {
            this.topic = data['Topic'];
        }

        if (data.hasOwnProperty('User')) {
            this.user = new UserProfileModel();
            this.user.parseData(data['User'])
        }

        try {
            if (data.hasOwnProperty('Club')) {
                this.club = new CLBItemModel();
                this.club.paserData(data['Club'])
            }
        } catch (error) {
            console.log('PostStatusModel.error', error)
        }

        if (data.hasOwnProperty('info_feel_status')) {
            try {
                this.post_status = new PostStatusModel();
                this.post_status.parseData(data['info_feel_status'], data['user_feel_status']);
            } catch (error) {
                console.log('PostStatusModel.error', error)
            }

        }

        this.timeDisplay = Utils.getFormatTime(this.is_timestamp);
    }
    getId() { return this.id || 0; }
    getUserId() { return this.user_id || 0; }
    getClubId() { return this.club_id || 0; }
    getTopicId() { return this.topic_id || 0; }
    getContent() { return this.content || ''; }
    getImgContent() { return this.img_content || ''; }
    getCreatedAt() { return this.created_at || ''; }
    getUpdatedAt() { return this.updated_at || ''; }
    getIsTimestamp() { return this.is_timestamp || 0; }
    getTopic() { return this.topic || {}; }
    getUser() { return this.user || {}; }
    getPostStatus() { return this.post_status || {}; }
    getTimeDisplay() { return this.timeDisplay || ''; }
    getClub() { return this.club || {}; }
}

module.exports = PostStatusItemModel;