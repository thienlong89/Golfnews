import HoleModel from './HoleModel';

export default class HoleDetailModel {
    constructor() {
        this.flight_id = '';
        this.round_id = '';
        this.holes = [];
    }

    static create(){
		return new HoleDetailModel();
	}

    parseData(jsonData) {
        this.flight_id = jsonData['flight_id'] || '';
        this.round_id = jsonData['round_id'] || '';
        if (jsonData.hasOwnProperty('holes')) {
            for (let obj of jsonData['holes']) {
                let holeModel = new HoleModel();
                holeModel.parseData(obj);
                this.holes.push(holeModel);
                // this.holes.push((HoleModel.create()).parseData(obj));
            }
        }
    }

    getHoles() {
        return this.holes;
    }

}
