import BaseModel from '../../Core/Model/BaseModel';
import RoundItemModel from '../Home/RoundItemModel';

class FlightHistoryModel extends BaseModel {
    constructor(baseComponent) {
        super(baseComponent);
        this.historyFlightList = [];
    }

    parseData(jsonData) {
        super.parseData(jsonData);
        if (typeof this.data === 'object') {
            if (this.data.hasOwnProperty('rounds')) {
                let rounds = this.data['rounds'];
                for (let _obj of rounds) {
                    let round = new RoundItemModel();
                    round.parseData(_obj);

                    this.historyFlightList.push(round);
                }
            }
        }
    }

    getHistoryFlightList() {
        return this.historyFlightList;
    }

}

module.exports = FlightHistoryModel;
