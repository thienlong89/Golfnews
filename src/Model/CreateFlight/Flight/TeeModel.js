
export default class TeeModel {
	constructor() {
        this.name = '';
        this.color = '';
		this.slope = 0;
		this.rating = 0;
		this.length = 0;
	}
	parseData(data, _name, _color) {
        this.name = _name;
        this.color = _color;
		if (data.hasOwnProperty('slope')) {
			this.slope = data['slope'];
		}
		if (data.hasOwnProperty('rating')) {
			this.rating = data['rating'];
		}
		if (data.hasOwnProperty('length')) {
			this.length = data['length'];
		}
    }
    
    getTeeName() { return this.name || ''; }
    getTeeColor() { return this.color || ''; }
	getSlope() { return this.slope || 0; }
	getRating() { return this.rating || 0; }
	getLength() { return this.length || 0; }
}
