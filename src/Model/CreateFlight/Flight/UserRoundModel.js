import UserProfileModel from '../../Home/UserProfileModel';
import HoleUserModel from './HoleUserModel';

export default class UserRoundModel {
	constructor() {
		this.id = 0;
		this.user_id = 0;
		this.date_played = '';
		this.index = 0;
		this.courses_handicap = 0;
		this.par = 0;
		this.gross = 0;
		this.net = 0;
		this.course_rating = 0;
		this.slope_rating = 0;
		this.flight_id = 0;
		this.tee_id = '';
		this.round_id = 0;
		this.state = 0;
		this.tee = '';
		this.stt_user = 0;
		this.confirmed = 0;
		this.submitted = 0;
		this.incompliance = 0;
		this.date_update = '';
		this.type = '';
		this.courses_handicap_display = '';
		this.selected_round_for_handicap_index = '';
		this.over_display = '';
		this.gross_display = '';
		this.User = {};
		this.UserRoundHoles = [];
		this.can_edit = 0;
		this.can_delete = 0;
	}
	parseData(data) {
		if (data.hasOwnProperty('id')) {
			this.id = parseFloat(data['id']);
		}
		if (data.hasOwnProperty('user_id')) {
			this.user_id = parseFloat(data['user_id']);
		}
		if (data.hasOwnProperty('date_played')) {
			this.date_played = data['date_played'];
		}
		if (data.hasOwnProperty('index')) {
			this.index = parseFloat(data['index']);
		}
		if (data.hasOwnProperty('courses_handicap')) {
			this.courses_handicap = parseFloat(data['courses_handicap']);
		}
		if (data.hasOwnProperty('par')) {
			this.par = parseFloat(data['par']);
		}
		if (data.hasOwnProperty('gross')) {
			this.gross = parseFloat(data['gross']);
		}
		if (data.hasOwnProperty('net')) {
			this.net = parseFloat(data['net']);
		}
		if (data.hasOwnProperty('course_rating')) {
			this.course_rating = parseFloat(data['course_rating']);
		}
		if (data.hasOwnProperty('slope_rating')) {
			this.slope_rating = parseFloat(data['slope_rating']);
		}
		if (data.hasOwnProperty('flight_id')) {
			this.flight_id = parseFloat(data['flight_id']);
		}
		if (data.hasOwnProperty('tee_id')) {
			this.tee_id = data['tee_id'];
		}
		if (data.hasOwnProperty('round_id')) {
			this.round_id = parseFloat(data['round_id']);
		}
		if (data.hasOwnProperty('state')) {
			this.state = parseFloat(data['state']);
		}
		if (data.hasOwnProperty('tee')) {
			this.tee = data['tee'];
		}
		if (data.hasOwnProperty('stt_user')) {
			this.stt_user = parseFloat(data['stt_user']);
		}
		if (data.hasOwnProperty('confirmed')) {
			this.confirmed = parseFloat(data['confirmed']);
		}
		if (data.hasOwnProperty('submitted')) {
			this.submitted = parseFloat(data['submitted']);
		}
		if (data.hasOwnProperty('incompliance')) {
			this.incompliance = parseFloat(data['incompliance']);
		}
		if (data.hasOwnProperty('date_update')) {
			this.date_update = data['date_update'];
		}
		if (data.hasOwnProperty('type')) {
			this.type = data['type'];
		}
		if (data.hasOwnProperty('courses_handicap_display')) {
			this.courses_handicap_display = parseFloat(data['courses_handicap_display']);
		}
		if (data.hasOwnProperty('selected_round_for_handicap_index')) {
			this.selected_round_for_handicap_index = data['selected_round_for_handicap_index'];
		}
		if (data.hasOwnProperty('over_display')) {
			this.over_display = data['over_display'];
		}
		if (data.hasOwnProperty('gross_display')) {
			this.gross_display = data['gross_display'];
		}
		if (data.hasOwnProperty('User')) {
			this.User = new UserProfileModel();
			this.User.parseData(data['User']);
		}
		if (data.hasOwnProperty('UserRoundHoles')) {
			let holes = data['UserRoundHoles'];
			for (let obj of holes) {
				let holeUserModel = new HoleUserModel();
				holeUserModel.parseData(obj);
				this.UserRoundHoles.push(holeUserModel);
			}
		}
		if (data.hasOwnProperty('can_edit')) {
			this.can_edit = data['can_edit'];
		}
		if (data.hasOwnProperty('can_delete')) {
			this.can_delete = data['can_delete'];
		}
	}
	getId() { return this.id || 0; }
	getUserId() { return this.user_id || 0; }
	getDatePlayed() { return this.date_played || ''; }
	getIndex() { return this.index || 0; }
	getCoursesHandicap() { return this.courses_handicap || 0; }
	getPar() { return this.par || 0; }
	getGross() { return this.gross || 0; }
	getNet() { return this.net || 0; }
	getCourseRating() { return this.course_rating || 0; }
	getSlopeRating() { return this.slope_rating || 0; }
	getFlightId() { return this.flight_id || 0; }
	getTeeId() { return this.tee_id || ''; }
	getRoundId() { return this.round_id || 0; }
	getState() { return this.state || 0; }
	getTee() { return this.tee || ''; }
	getSttUser() { return this.stt_user || 0; }
	getConfirmed() { return this.confirmed || 0; }
	getSubmitted() { return this.submitted || 0; }
	getIncompliance() { return this.incompliance || 0; }
	getDateUpdate() { return this.date_update || ''; }
	getType() { return this.type || ''; }
	getCoursesHandicapDisplay() { return this.courses_handicap_display || ''; }
	getSelectedRoundForHandicapIndex() { return this.selected_round_for_handicap_index || ''; }
	getOverDisplay() { return this.over_display || ''; }
	getGrossDisplay() { return this.gross_display || ''; }
	getUser() {
		return this.User;
	}
	getHoldUserList() {
		return this.UserRoundHoles;
	}
	getCanEdit() { return this.can_edit || 0; }
	getCanDelete() { return this.can_delete || 0; }

	setUserId(_userId) { this.user_id = _userId; }
	setTeeId(_teeId) { this.tee_id = _teeId; }
	setTee(_tee) { this.tee = _tee; }
	setUser(_user) { this.User = _user; }
	setHoldUserList(_userRoundHoles) { this.UserRoundHoles = _userRoundHoles; }
	setCoursesHandicapDisplay(_coursesHandicapDisplay) { this.courses_handicap_display = _coursesHandicapDisplay }
	setState(_state) { this.state = _state; }
	setSubmitted(_submitted) { this.submitted = _submitted; }
	setConfirmed(_confirmed) { this.confirmed = _confirmed; }
}
