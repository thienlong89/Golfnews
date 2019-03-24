import UserRoundModel from './UserRoundModel';
import PostStatusModel from '../../Social/PostStatusModel';

export default class FlightSummaryModel {
	constructor() {
		this.date_played_display = '';
		this.flight_name = '';
		this.status = 0;
		this.type = 0;
		this.id = 0;
		this.datePlayed = '';
		this.facilityId = 0;
		this.goldSlope = 0;
		this.blueSlope = 0;
		this.whiteSlope = 0;
		this.redSlope = 0;
		this.blackSlope = 0;
		this.dateLastUpdate = '';
		this.dateCreate = '';
		this.UserRounds = [];
		this.datePlayedTimestamp = '';
		this.url_scorecards = '';
		this.array_url_scorecard = [];
		this.is_like = 0;
		this.tee_id = '';
		this.type_flight = 1;
		this.total_feel = '';
		this.user_feel_status = 0;
		this.list_img_upload_status = [];
	}
	parseData(data) {
		// console.log('parseData', JSON.stringify(data));

		if (data.hasOwnProperty('tee_id')) {
			this.tee_id = data['tee_id'];
		}
		if (data.hasOwnProperty('selected_round_for_handicap_index')) {
			this.selected_round_for_handicap_index = data['selected_round_for_handicap_index'];
		}
		if (data.hasOwnProperty('date_played_display')) {
			this.date_played_display = data['date_played_display'];
		}
		if (data.hasOwnProperty('flight_name')) {
			this.flight_name = data['flight_name'];
		}
		if (data.hasOwnProperty('path_id1')) {
			this.path_id1 = parseFloat(data['path_id1']);
		}
		if (data.hasOwnProperty('path_id2')) {
			this.path_id2 = parseFloat(data['path_id2']);
		}
		if (data.hasOwnProperty('path_id3')) {
			this.path_id3 = parseFloat(data['path_id3']);
		}
		if (data.hasOwnProperty('status')) {
			this.status = parseFloat(data['status']);
		}
		if (data.hasOwnProperty('type')) {
			this.type = data['type'];
		}
		if (data.hasOwnProperty('id')) {
			this.id = parseFloat(data['id']);
		}
		if (data.hasOwnProperty('date_played')) {
			this.date_played = data['date_played'];
		}
		if (data.hasOwnProperty('facility_id')) {
			this.facility_id = parseFloat(data['facility_id']);
		}
		if (data.hasOwnProperty('gold_slope')) {
			this.gold_slope = parseFloat(data['gold_slope']);
		}
		if (data.hasOwnProperty('blue_slope')) {
			this.blue_slope = parseFloat(data['blue_slope']);
		}
		if (data.hasOwnProperty('white_slope')) {
			this.white_slope = parseFloat(data['white_slope']);
		}
		if (data.hasOwnProperty('red_slope')) {
			this.red_slope = parseFloat(data['red_slope']);
		}
		if (data.hasOwnProperty('black_slope')) {
			this.black_slope = parseFloat(data['black_slope']);
		}
		if (data.hasOwnProperty('date_last_update')) {
			this.date_last_update = data['date_last_update'];
		}
		if (data.hasOwnProperty('date_create')) {
			this.date_create = data['date_create'];
		}
		if (data.hasOwnProperty('course_rating')) {
			this.course_rating = data['course_rating'];
		}
		if (data.hasOwnProperty('slope_rating')) {
			this.slope_rating = data['slope_rating'];
		}
		if (data.hasOwnProperty('gross')) {
			this.gross = data['gross'];
		}
		if (data.hasOwnProperty('net')) {
			this.net = data['net'];
		}
		try {
			if (data.hasOwnProperty('url_scorecards')) {
				this.url_scorecards = data['url_scorecards'];
			}
			if (data.hasOwnProperty('array_url_scorecard')) {
				for (let obj of data['array_url_scorecard']) {
					this.array_url_scorecard.push(obj);
				}
			}
		} catch (error) {
			console.log('FlightSummaryModel', error)
		}
		if (data.hasOwnProperty('is_like')) {
			this.is_like = data['is_like'];
		}
		if (data.hasOwnProperty('UserRounds')) {
			for (let obj of data['UserRounds']) {
				let user = new UserRoundModel();
				user.parseData(obj);
				this.UserRounds.push(user);
			}
		}
		if (data.hasOwnProperty("Flight")) {
			let flight_data = data['Flight'];
			if (flight_data.flight_name && flight_data.flight_name.length) {
				this.flight_name = flight_data.flight_name;
			}
			if (flight_data.hasOwnProperty('id')) {
				this.id = parseFloat(flight_data['id']);
			}
			if (flight_data.hasOwnProperty('url_scorecards')) {
				this.url_scorecards = flight_data['url_scorecards'];
			}
		}

		if (data.hasOwnProperty('date_played_timestamp')) {
			this.date_played_timestamp = data['date_played_timestamp'];
		}

		if (data.hasOwnProperty('awards')) {
			this.awards = data['awards'];
		}

		if (data.hasOwnProperty('type_flight')) {
			this.type_flight = data['type_flight'];
		}

		if (data.hasOwnProperty('user_feel_status')) {
			this.user_feel_status = data['user_feel_status'];
		}

		if (data.hasOwnProperty('total_feel')) {
			try {
				this.total_feel = new PostStatusModel();
				this.total_feel.parseData(data['total_feel'], this.user_feel_status);
			} catch (error) {
				console.log('PostStatusModel.error', error);
			}
		}


		if (data.hasOwnProperty('list_img_upload_status')) {
			for (let obj of data['list_img_upload_status']) {
				this.list_img_upload_status.push(obj);
			}
		}

	}

	getAwards() {
		return this.awards ? this.awards : '';
	}

	getAdjust() {
		return this.net ? this.net : '';
	}

	getGross() {
		return this.gross ? this.gross : '';
	}

	getSlopeRating() {
		return this.slope_rating ? this.slope_rating : '';
	}
	getCourseRating() { return this.course_rating ? this.course_rating : '' }

	getDatePlayedDisplay() { return this.date_played_display || ''; }
	getFlightName() { return this.flight_name || ''; }
	getPathId1() { return this.path_id1 || 0; }
	getPathId2() { return this.path_id2 || 0; }
	getPathId3() { return this.path_id3 || 0; }
	getStatus() { return this.status || 0; }
	getType() { return this.type || ''; }
	getId() { return this.id || 0; }
	getDatePlayed() { return this.date_played || ''; }
	getFacilityId() { return this.facility_id || 0; }
	getGoldSlope() { return this.gold_slope || 0; }
	getBlueSlope() { return this.blue_slope || 0; }
	getWhiteSlope() { return this.white_slope || 0; }
	getRedSlope() { return this.red_slope || 0; }
	getBlackSlope() { return this.black_slope || 0; }
	getDateLastUpdate() { return this.date_last_update || ''; }
	getDateCreate() { return this.date_create || ''; }
	getUserRounds() { return this.UserRounds || null; }
	getDatePlayedTimestamp() { return this.date_played_timestamp || 0 }
	getUrlScorecard() { return this.url_scorecards || ''; }
	getUrlScorecardArray() { return this.array_url_scorecard || []; }
	isLiked() { return this.is_like || 0; }

	getTypeFlight() { return this.type_flight || 1; }

	setTypeFlight(type_flight = 1) { this.type_flight = type_flight }

	setPathId1(_pathId1) {
		this.path_id1 = _pathId1;
	}

	setPathId2(_pathId2) {
		this.path_id2 = _pathId2;
	}

	setPathId3(_pathId3) {
		this.path_id3 = _pathId3;
	}

	setFlightName(_flightName) {
		this.flight_name = _flightName;
	}

	setUrlScorecard(_url_scorecards) { this.url_scorecards = _url_scorecards; }

	setUrlScorecardArray(arrayImgs = []) { this.array_url_scorecard = arrayImgs; }

	getPostStatus() {
		return this.total_feel;
	}

	setPostStatus(total_feel) {
		if (total_feel)
			this.total_feel = total_feel;
	}

	getUserStatus() {
		return this.user_feel_status;
	}

	setUserStatus(status) {
		this.user_feel_status = status;
	}

	getListImgUploadStatus() { return this.list_img_upload_status || []; }
}
