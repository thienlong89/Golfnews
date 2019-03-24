import BaseModel from '../../Core/Model/BaseModel';
import RoundItemModel from './RoundItemModel';

class FinishFlightModel extends BaseModel {
    constructor(baseComponent) {
        super(baseComponent);
        this.unfinished_round_count = 0;
        this.rounds = [];
        this.list_id_remove = [];
    }

    parseData(jsonData) {
        super.parseData(jsonData);
        if (this.data.hasOwnProperty('unfinished_round_count_display')) {
            this.unfinished_round_count = this.data['unfinished_round_count_display'];
        }
        if (this.data.hasOwnProperty('rounds')) {
            let rounds = this.data['rounds'];
            for (let _obj of rounds) {
                let roundItemModel = new RoundItemModel();
                roundItemModel.parseData(_obj);

                this.rounds.push(roundItemModel);
            }
        }

        if (this.data.hasOwnProperty('list_id_remove')) {
            this.list_id_remove = this.data['list_id_remove'];
        }

    }

    getRoundList() {
        return this.rounds;
    }

    getListRemove(){
        return this.list_id_remove;
    }

    getUnfinishCount() {
        return this.unfinished_round_count;
    }

}

module.exports = FinishFlightModel;
