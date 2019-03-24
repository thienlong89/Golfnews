import CLBItemModel from '../CLB/CLBItemModel';
import UserProfileModel from '../Home/UserProfileModel';
import moment from 'moment';

class ClubEventItemModel {

    constructor() {
        this.id = 0;
        this.name = '';
        this.club_id = 0;
        this.user_created = 0;
        this.facility_id = 0;
        this.tee_time = '';
        this.tee_timestamp = 0;
        this.is_done = 0;
        this.total_joined = 0;
        this.created_at = '';
        this.updated_at = '';
        this.is_accepted = 0;
        this.club = null;
        this.name_course = '';
        this.tee_time_display = '';
        this.day = '';
        this.month = '';
        this.list_user_displayed = [];
        this.total_img_display = 0;
    }
    parseData(data) {
        if (data.hasOwnProperty('id')) {
            this.id = parseFloat(data['id']);
        }
        if (data.hasOwnProperty('name')) {
            this.name = data['name'];
        }
        if (data.hasOwnProperty('club_id')) {
            this.club_id = parseFloat(data['club_id']);
        }
        if (data.hasOwnProperty('user_created')) {
            this.user_created = parseFloat(data['user_created']);
        }
        if (data.hasOwnProperty('facility_id')) {
            this.facility_id = parseFloat(data['facility_id']);
        }
        if (data.hasOwnProperty('tee_time')) {
            this.tee_time = data['tee_time'];
        }
        if (data.hasOwnProperty('is_timestamp')) {
            this.tee_timestamp = data['is_timestamp'];
        }
        if (data.hasOwnProperty('is_done')) {
            this.is_done = parseFloat(data['is_done']);
        }
        if (data.hasOwnProperty('total_joined')) {
            this.total_joined = parseFloat(data['total_joined']);
        }
        if (data.hasOwnProperty('created_at')) {
            this.created_at = data['created_at'];
        }
        if (data.hasOwnProperty('updated_at')) {
            this.updated_at = data['updated_at'];
        }
        if (data.hasOwnProperty('is_accepted')) {
            this.is_accepted = parseFloat(data['is_accepted']);
        }
        if (data.hasOwnProperty('name_course')) {
            this.name_course = data['name_course'];
        }
        if (data.hasOwnProperty('total_img_display')) {
            this.total_img_display = data['total_img_display'];
        }
        if (data.hasOwnProperty('Club')) {
            this.club = new CLBItemModel();
            this.club.paserData(data['Club'])
        }

        if (this.tee_timestamp && this.tee_timestamp != 0) {
            let teeTime = moment(this.tee_timestamp * 1000);//.format("MMM");
            this.tee_time_display = teeTime.format("HH:mm, DD/MM/YYYY")
            this.month = teeTime.format("MMM");
            this.day = teeTime.format("DD")
        }

        if (data.hasOwnProperty('list_user_displayed')) {
			for (let obj of data['list_user_displayed']) {
				let user = new UserProfileModel();
				user.parseData(obj);
				this.list_user_displayed.push(user);
			}
		}
    }
    getId() { return this.id || 0; }
    getName() { return this.name || ''; }
    getClubId() { return this.club_id || 0; }
    getUserCreated() { return this.user_created || 0; }
    getFacilityId() { return this.facility_id || 0; }
    getTeeTime() { return this.tee_time || ''; }
    getIsDone() { return this.is_done || 0; }
    getTotalJoined() { return this.total_joined || 0; }
    getCreatedAt() { return this.created_at || ''; }
    getUpdatedAt() { return this.updated_at || ''; }
    getIsAccepted() { return this.is_accepted || 0; }
    getClub() { return this.club || null; }
    getCourseName() { return this.name_course || ''; }
    getTeeTimestamp() { return this.tee_timestamp || ''; }
    getDay() { return this.day || ''; }
    getMonth() { return this.month || ''; }
    getTeeTimeDisplay() { return this.tee_time_display || ''; }
    getListPlayer() { return this.list_user_displayed || []; }
    getTotalTraditionImg() { return this.total_img_display || 0; }
}

module.exports = ClubEventItemModel;