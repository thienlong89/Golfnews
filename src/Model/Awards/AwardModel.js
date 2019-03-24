import BaseModel from '../../Core/Model/BaseModel';

class AwardItemModel {
    constructor(stt) {
        this.stt = stt;
    }

    parseData(data) {
        if (data.hasOwnProperty('tee')) {
            this.tee = data['tee'];
        }
        if (data.hasOwnProperty('best_gross')) {
            this.best_score = parseInt(data['best_gross']);
            this.best_score = (this.best_score < 0) ? '+' + Math.abs(this.best_score) : this.best_score;
        }
        if (data.hasOwnProperty('best_net')) {
            this.best_score = parseInt(data['best_net']);
            this.best_score = (this.best_score < 0) ? '+' + Math.abs(this.best_score) : this.best_score;
        }
        if (data.hasOwnProperty('User')) {
            this.user = data['User'];
        }
        if (data.hasOwnProperty('course')) {
            this.course = data['course'];
        }
    }

    getStt() {
        return this.stt ? this.stt : 1;
    }

    getTee() {
        return this.tee ? this.tee : 'blue';
    }

    getBestScore() {
        return this.best_score ? this.best_score : undefined;
    }

    getCource() {
        return this.course ? this.course : '';
    }

    getUser() {
        return this.user ? this.user : {};
    }
}

export default class AwardModel extends BaseModel {
    constructor(baseComponent) {
        super(baseComponent);
        this.tee = 'blue';
        this.list_award_item_model = [];
        //this.best_gross = n
    }

    parseData(jsonData) {
        super.parseData(jsonData);
        if (this.getErrorCode() === 0) {
            let stt = 0;
            for (let itemModel of this.data) {
                stt++;
                let itemAwardModel = new AwardItemModel(stt);
                itemAwardModel.parseData(itemModel);
                this.list_award_item_model.push(itemAwardModel);
            }
        }
    }

    getListAward() {
        return this.list_award_item_model;
    }
}