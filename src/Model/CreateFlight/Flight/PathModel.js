
export default class PathModel {
	constructor() {
		this.id = 0;
		this.facility_id = 0;
		this.name = '';
		this.num_holes = 0;
		this.par = 0;
	}
	parseData(data) {
		if (data.hasOwnProperty('id')) {
			this.id = parseFloat(data['id']);
		}
		if (data.hasOwnProperty('facility_id')) {
			this.facility_id = parseFloat(data['facility_id']);
		}
		if (data.hasOwnProperty('name')) {
			this.name = data['name'];
		}
		if (data.hasOwnProperty('num_holes')) {
			this.num_holes = parseFloat(data['num_holes']);
		}
		if (data.hasOwnProperty('par')) {
			this.par = parseFloat(data['par']);
		}
	}
	getId() { return this.id || 0; }
	getFacilityId() { return this.facility_id || 0; }
	getName() { return this.name || ''; }
	getNumHoles() { return this.num_holes || 0; }
	getPar() { return this.par || 0; }
}
