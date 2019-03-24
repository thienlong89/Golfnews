import BaseModel from '../../Core/Model/BaseModel';
import StateModel from './StateModel';

class ListStateModel extends BaseModel {
    constructor(baseComponent) {
        super(baseComponent);
        this.statesList = [];
    }

    parseData(jsonData) {
        super.parseData(jsonData);
        if (this.data.hasOwnProperty('states')) {
            let states = this.data['states'];
            for (let _obj of states) {
                let state = new StateModel();
                state.paserData(_obj);

                this.statesList.push(state);
            }
        }

    }

    getStateList() {
        return this.statesList;
    }

}

module.exports = ListStateModel;