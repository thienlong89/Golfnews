import TeeInfoModel from './TeeInfoModel';

export default class CourseModel {
	constructor() {
		this.facilityId = 0;
		this.pathId1 = 0;
		this.pathId2 = 0;
		this.title = '';
		this.blackSlope = '';
		this.goldSlope = 0;
		this.blueSlope = 0;
		this.whiteSlope = 0;
		this.redSlope = 0;
		this.blackRating = '';
		this.goldRating = 0;
		this.blueRating = 0;
		this.whiteRating = 0;
		this.redRating = 0;
		this.blackLength = '';
		this.goldLength = 0;
		this.blueLength = 0;
		this.whiteLength = 0;
		this.redLength = 0;
		this.tee_info = {};
	}
	parseData(data) {
		if (data.hasOwnProperty('facility_id')) {
			this.facilityId = parseFloat(data['facility_id']);
		}
		if (data.hasOwnProperty('path_id1')) {
			this.pathId1 = parseFloat(data['path_id1']);
		}
		if (data.hasOwnProperty('path_id2')) {
			this.pathId2 = parseFloat(data['path_id2']);
		}
		if (data.hasOwnProperty('title')) {
			this.title = data['title'];
		}
		if (data.hasOwnProperty('black_slope')) {
			this.blackSlope = data['black_slope'];
		}
		if (data.hasOwnProperty('gold_slope')) {
			this.goldSlope = parseFloat(data['gold_slope']);
		}
		if (data.hasOwnProperty('blue_slope')) {
			this.blueSlope = parseFloat(data['blue_slope']);
		}
		if (data.hasOwnProperty('white_slope')) {
			this.whiteSlope = parseFloat(data['white_slope']);
		}
		if (data.hasOwnProperty('red_slope')) {
			this.redSlope = parseFloat(data['red_slope']);
		}
		if (data.hasOwnProperty('black_rating')) {
			this.blackRating = data['black_rating'];
		}
		if (data.hasOwnProperty('gold_rating')) {
			this.goldRating = parseFloat(data['gold_rating']);
		}
		if (data.hasOwnProperty('blue_rating')) {
			this.blueRating = parseFloat(data['blue_rating']);
		}
		if (data.hasOwnProperty('white_rating')) {
			this.whiteRating = parseFloat(data['white_rating']);
		}
		if (data.hasOwnProperty('red_rating')) {
			this.redRating = parseFloat(data['red_rating']);
		}
		if (data.hasOwnProperty('black_length')) {
			this.blackLength = data['black_length'];
		}
		if (data.hasOwnProperty('gold_length')) {
			this.goldLength = parseFloat(data['gold_length']);
		}
		if (data.hasOwnProperty('blue_length')) {
			this.blueLength = parseFloat(data['blue_length']);
		}
		if (data.hasOwnProperty('white_length')) {
			this.whiteLength = parseFloat(data['white_length']);
		}
		if (data.hasOwnProperty('red_length')) {
			this.redLength = parseFloat(data['red_length']);
		}
		if (data.hasOwnProperty('tees_info')) {
			this.tee_info_full = data['tees_info'];
			// console.log('tee info full..................................... ', this.tee_info_full);

			this.teeListAvailable = [];
			let tees_info = data['tees_info'];
			let keys = Object.keys(tees_info);
			for (let key of keys) {
				let obj_tee = tees_info[key];
				//{ tee: 'black', color: 'black' }
				let tee = { tee: key, color: key, rating: obj_tee['rating'], slope: obj_tee['slope'], length: obj_tee['length'] };
				this.teeListAvailable.push(tee);
			}

			// this.tee_info = new TeeInfoModel();
			// this.tee_info.parseData(data['tees_info'])
		}
		
		if (data.hasOwnProperty('tees_info_gender')) {
			let tees_info_gender = data['tees_info_gender'];
			// console.log('tee info full..................................... ', this.tee_info_full);

			this.teeListAvailable2 = [];
			let keys = Object.keys(tees_info_gender);
			for (let key of keys) {
				let obj_tee_men = tees_info_gender[key].men;
				let obj_tee_women = tees_info_gender[key].women;
				//{ tee: 'black', color: 'black' }
				let tee = {
					tee: key, 
					color: key,
					rating: {
						men: obj_tee_men ? obj_tee_men['rating'] : null,
						women: obj_tee_women ? obj_tee_women['rating'] : null
					},
					slope: {
						men: obj_tee_men ? obj_tee_men['slope'] : null,
						women: obj_tee_women ? obj_tee_women['slope'] : null
					},
					length: {
						men: obj_tee_men ? obj_tee_men['length'] : null,
						women: obj_tee_women ? obj_tee_women['length'] : null
					}
				};
				this.teeListAvailable2.push(tee);
			}
		}
	}

	getTeeInfofull() {
		return this.tee_info_full ? this.tee_info_full : [];
	}

	getFacilityId() { return this.facilityId || 0; }
	getPathId1() { return this.pathId1 || 0; }
	getPathId2() { return this.pathId2 || 0; }
	getTitle() { return this.title || ''; }
	getBlackSlope() { return this.blackSlope || ''; }
	getGoldSlope() { return this.goldSlope || 0; }
	getBlueSlope() { return this.blueSlope || 0; }
	getWhiteSlope() { return this.whiteSlope || 0; }
	getRedSlope() { return this.redSlope || 0; }
	getBlackRating() { return this.blackRating || ''; }
	getGoldRating() { return this.goldRating || 0; }
	getBlueRating() { return this.blueRating || 0; }
	getWhiteRating() { return this.whiteRating || 0; }
	getRedRating() { return this.redRating || 0; }
	getBlackLength() { return this.blackLength || ''; }
	getGoldLength() { return this.goldLength || 0; }
	getBlueLength() { return this.blueLength || 0; }
	getWhiteLength() { return this.whiteLength || 0; }
	getRedLength() { return this.redLength || 0; }
	// getTeeInfo() { return this.tee_info || {}; }
	getTeeInfo() { return this.teeListAvailable ? this.teeListAvailable : []; }
	getTeeInfoGender() { return this.teeListAvailable2 ? this.teeListAvailable2 : []; }
}
