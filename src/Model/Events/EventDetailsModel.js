import BaseModel from '../../Core/Model/BaseModel';
import UserProfileModel from '../Home/UserProfileModel';
import moment from 'moment';
import PostStatusModel from '../Social/PostStatusModel';
import FacilityCourseItemModel from '../Facility/FacilitiCourseItemModel';

class EventDetailsModel extends BaseModel {

	constructor() {
		super();
		this.id = 0;
		this.name = '';
		this.club_id = 0;
		this.user_created = 0;
		this.facility_id = 0;
		this.tee_time = '';
		this.is_done = 0;
		this.total_joined = 0;
		this.created_at = '';
		this.updated_at = '';
		this.is_accepted = 0;
		this.creator = {};
		this.name_course = '';
		this.tee_timestamp = 0;
		this.tee_time_display = '';
		this.day = '';
		this.month = '';
		// this.post_status = {};
		this.course = {};
		this.listTee = [];
		this.total_feel = {};
		this.user_feel_status = 0;
	}
	parseData(data) {
		super.parseData(data);

		if (this.data.hasOwnProperty('id')) {
			this.id = parseFloat(this.data['id']);
		}
		if (this.data.hasOwnProperty('name')) {
			this.name = this.data['name'];
		}
		if (this.data.hasOwnProperty('club_id')) {
			this.club_id = parseFloat(this.data['club_id']);
		}
		if (this.data.hasOwnProperty('user_created')) {
			this.user_created = parseFloat(this.data['user_created']);
		}
		if (this.data.hasOwnProperty('facility_id')) {
			this.facility_id = parseFloat(this.data['facility_id']);
		}
		if (this.data.hasOwnProperty('tee_time')) {
			this.tee_time = this.data['tee_time'];
		}
		if (this.data.hasOwnProperty('is_done')) {
			this.is_done = parseFloat(this.data['is_done']);
		}
		if (this.data.hasOwnProperty('total_joined')) {
			this.total_joined = parseFloat(this.data['total_joined']);
		}
		if (this.data.hasOwnProperty('created_at')) {
			this.created_at = this.data['created_at'];
		}
		if (this.data.hasOwnProperty('updated_at')) {
			this.updated_at = this.data['updated_at'];
		}
		if (this.data.hasOwnProperty('is_accepted')) {
			this.is_accepted = parseFloat(this.data['is_accepted']);
		}
		if (this.data.hasOwnProperty('name_course')) {
			this.name_course = this.data['name_course'];
		}
		if (this.data.hasOwnProperty('UserHostEvent')) {
			this.creator = new UserProfileModel();
			this.creator.parseData(this.data['UserHostEvent'])
		}

		if (this.data.hasOwnProperty('is_timestamp')) {
			this.tee_timestamp = this.data['is_timestamp'];
		}
		if (this.tee_timestamp && this.tee_timestamp != 0) {
			let teeTime = moment(this.tee_timestamp * 1000);
			this.tee_time_display = teeTime.format("HH:mm, DD/MM/YYYY")
			this.month = teeTime.format("MMM");
			this.day = teeTime.format("DD")
		}

		if (this.data.hasOwnProperty('user_feel_status')) {
			this.user_feel_status = this.data['user_feel_status'];
		}

		if (this.data.hasOwnProperty('total_feel')) {
			try {
				this.total_feel = new PostStatusModel();
				this.total_feel.parseData(this.data['total_feel'], this.user_feel_status);
				console.log('total_feel', this.total_feel)
			} catch (error) {
				console.log('PostStatusModel.error', error)
			}
		}

		if (this.data.hasOwnProperty('course')) {
			this.course = new FacilityCourseItemModel();
			this.course.paserData(this.data['course'])
		}

		if (this.data.hasOwnProperty('list_tee')) {
			this.listTee = this.data['list_tee'].map((obj) => {
				return { tee: obj.name, color: obj.color }
			})
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
	getCreator() { return this.creator || {}; }
	getFacility() { return this.facility || {}; }
	getTeeTimestamp() { return this.tee_timestamp || ''; }
	getDay() { return this.day || ''; }
	getMonth() { return this.month || ''; }
	getTeeTimeDisplay() { return this.tee_time_display || ''; }
	getPostStatus() {
		return this.total_feel;
	}

	getUserStatus(){
		return this.user_feel_status;
	}

	setPostStatus(total_feel) {
		if (total_feel)
			this.total_feel = total_feel;
	}

	setUserStatus(status){
		this.user_feel_status = status;
	}
	getCourseName() { return this.name_course || ''; }
	getCourse() { return this.course || {}; }
	getListTee() { return this.listTee || []; }
}

module.exports = EventDetailsModel;