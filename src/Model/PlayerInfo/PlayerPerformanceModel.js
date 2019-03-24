import BaseModel from '../../Core/Model/BaseModel';
import PlayerPerformanceItemModel from './PlayerPerformanceItemModel';

class PlayerPerformanceModel extends BaseModel {

    constructor(baseComponent) {
        super(baseComponent);

        this.playerPerformanceList = [];
    }

    parseData(jsonData) {
        super.parseData(jsonData);

        if (this.data.hasOwnProperty('permance_uid')) {
            let performance = this.data['permance_uid'];
            let playerPerformance = new PlayerPerformanceItemModel();
            playerPerformance.parseData(performance, true);
            this.playerPerformanceList.push(playerPerformance);
        }

        if (this.data.hasOwnProperty('permance_other_id')) {
            let performanceOther = this.data['permance_other_id'];
            for (let _obj of performanceOther) {
                let playerPerformance = new PlayerPerformanceItemModel();
                playerPerformance.parseData(_obj, false);
                this.playerPerformanceList.push(playerPerformance);
            }
        }

    }

    getPerformanceList() {
        return this.playerPerformanceList;
    }

}

module.exports = PlayerPerformanceModel;
