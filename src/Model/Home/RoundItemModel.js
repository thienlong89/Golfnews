import BaseModel from '../../Core/Model/BaseModel';
import FlightModel from './FlightModel';
import UserRoundModel from '../../Model/CreateFlight/Flight/UserRoundModel';
import PostStatusModel from '../Social/PostStatusModel';

class RoundItemModel extends BaseModel {
	constructor() {
		super();
		this.courses_handicap = 0;
		this.id = 0;
		this.user_id = 0;
		this.date_played = '';
		this.index = 0;
		this.par = 0;
		this.gross = 0;
		this.net = 0;
		this.course_rating = 0;
		this.slope_rating = 0;
		this.flight_id = 0;
		this.tee_id = '';
		this.Flight = {};
		this.type = '';
		this.courses_handicap_display = 0;
		this.selected_round_for_handicap_index = '';
		this.over_display = '';
		this.text_display = '';
		this.gross_display = '';
		this.tee = '';
		this.round_id = 0;
		this.state = 0;
		this.stt_user = 0;
		this.confirmed = 0;
		this.submitted = 0;
		this.incompliance = 0;
		this.text_color = '';
		this.allow_to_delete = false;
		this.date_played_display = '';
		this.UserRounds = [];
		this.total_feel = {};
		this.user_feel_status = 0;
		this.differential = 0;
	}

	parseData(data) {
		if (data.hasOwnProperty('courses_handicap')) {
			this.courses_handicap = parseFloat(data['courses_handicap']);
		}
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
		if (data.hasOwnProperty('Flight')) {
			this.Flight = new FlightModel();
			this.Flight.parseData(data['Flight']);
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
		if (data.hasOwnProperty('text_display')) {
			this.text_display = data['text_display'];
		}
		if (data.hasOwnProperty('gross_display')) {
			this.gross_display = data['gross_display'];
		}
		if (data.hasOwnProperty('tee')) {
			this.tee = data['tee'];
		}
		if (data.hasOwnProperty('round_id')) {
			this.round_id = parseFloat(data['round_id']);
		}
		if (data.hasOwnProperty('state')) {
			this.state = parseFloat(data['state']);
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
		if (data.hasOwnProperty('text_color')) {
			this.text_color = (data['text_color']);
		}
		if (data.hasOwnProperty('allow_to_delete')) {
			this.allow_to_delete = (data['allow_to_delete']);
		}
		if (data.hasOwnProperty('date_played_display')) {
			this.date_played_display = (data['date_played_display']);
		}
		if (data.hasOwnProperty('differential')) {
			this.differential = (data['differential']);
		}


		if (data.hasOwnProperty('UserRounds')) {
			let rounds = data['UserRounds'];
			for (let obj of rounds) {
				let user = new UserRoundModel();
				user.parseData(obj);
				this.UserRounds.push(user);
			}
		}

		if (data.hasOwnProperty('user_feel_status')) {
			this.user_feel_status = data['user_feel_status'];
		}

		if (data.hasOwnProperty('total_feel')) {
			try {
				this.total_feel = new PostStatusModel();
				this.total_feel.parseData(data['total_feel'], this.user_feel_status);
			} catch (error) {
				console.log('PostStatusModel.error', error)
			}
		}
	}

	getCoursesHandicap() { return this.courses_handicap || 0; }
	getId() { return this.id || 0; }
	getUserId() { return this.user_id || 0; }
	getDatePlayed() { return this.date_played || ''; }
	getIndex() { return this.index || 0; }
	getPar() { return this.par || 0; }
	getGross() { return this.gross || 0; }
	getNet() { return this.net || 0; }
	getCourseRating() { return this.course_rating || 0; }
	getSlopeRating() { return this.slope_rating || 0; }
	getFlightId() { return this.flight_id || 0; }
	getTeeId() { return this.tee_id || ''; }
	getFlight() { return this.Flight || ''; }
	getType() { return this.type || ''; }
	getCoursesHandicapDisplay() { return this.courses_handicap_display || 0; }
	getSelectedRoundForHandicapIndex() { return this.selected_round_for_handicap_index || false; }
	getOverDisplay() { return this.over_display || ''; }
	getTextDisplay() { return this.text_display || ''; }
	getGrossDisplay() { return this.gross_display || ''; }
	getTee() { return this.tee || ''; }
	getRoundId() { return this.round_id || 0; }
	getState() { return this.state || 0; }
	getSttUser() { return this.stt_user || 0; }
	getConfirmed() { return this.confirmed || 0; }
	getSubmitted() { return this.submitted || 0; }
	getIncompliance() { return this.incompliance || 0; }
	getTextColor() { return this.text_color || '#707070'; }
	getAllowDelete() { return this.allow_to_delete || false; }
	getDatePlayDisplay() { return this.date_played_display || ''; }
	getUserRounds() { return this.UserRounds || null; }
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
	
	getDifferential() { return this.differential || 0; }
}

module.exports = RoundItemModel;
