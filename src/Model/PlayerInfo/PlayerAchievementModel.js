import BaseModel from '../../Core/Model/BaseModel';
import RoundItemModel from '../Home/RoundItemModel';

class PlayerAchievementModel extends BaseModel{
    constructor(baseComponent){
        super(baseComponent);

        this.list_round_HIO = [],
        this.list_round_ALBATROSS = [],
        this.list_round_EAGLE = []
    }

    parseData(jsonData) {
        super.parseData(jsonData);
        
        if (this.data.hasOwnProperty('list_round_HIO')) {
            let rounds = this.data['list_round_HIO'];
            for (let _obj of rounds) {
                let roundItemModel = new RoundItemModel();
                roundItemModel.parseData(_obj);
                this.list_round_HIO.push(roundItemModel);
            }
        }

        if (this.data.hasOwnProperty('list_round_ALBATROSS')) {
            let rounds = this.data['list_round_ALBATROSS'];
            for (let _obj of rounds) {
                let roundItemModel = new RoundItemModel();
                roundItemModel.parseData(_obj);
                this.list_round_ALBATROSS.push(roundItemModel);
            }
        }

        if (this.data.hasOwnProperty('list_round_EAGLE')) {
            let rounds = this.data['list_round_EAGLE'];
            for (let _obj of rounds) {
                let roundItemModel = new RoundItemModel();
                roundItemModel.parseData(_obj);
                this.list_round_EAGLE.push(roundItemModel);
            }
        }
    }

    getHIOList(){
        return this.list_round_HIO;
    }

    getAlbatrossList(){
        return this.list_round_ALBATROSS;
    }

    getEagleList(){
        return this.list_round_EAGLE;
    }

    
}

module.exports = PlayerAchievementModel;
