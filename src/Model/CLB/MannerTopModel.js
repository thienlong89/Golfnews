import BaseModel from '../../Core/Model/BaseModel';
import UserProfileModel from '../Home/UserProfileModel';

class MannerTopModel extends BaseModel {

    constructor(baseComponent) {
        super(baseComponent);

        this.memberList = [];
    }

    parseData(jsonData) {
        super.parseData(jsonData);

        if (this.data instanceof Array) {
            for (let obj of this.data) {
                let itemModel = new MannerItemModel();
                itemModel.parseData(obj);
                this.memberList.push(itemModel);
            }
        }
    }

    getMemberList() {
        return this.memberList ? this.memberList : [];
    }
}

class MannerItemModel {

    constructor() {

        this.id = 0;
        this.usga_hc_index = 0;
        this.ranking = 0;
        this.point_ranking = '';
        this.User = {};
    }

    parseData(jsonData) {
        if (jsonData.hasOwnProperty('id')) {
            this.id = jsonData['id'];
        }
        if (jsonData.hasOwnProperty('usga_hc_index')) {
            this.usga_hc_index = jsonData['usga_hc_index'];
        }
        if (jsonData.hasOwnProperty('ranking')) {
            this.ranking = jsonData['ranking'];
        }
        if (jsonData.hasOwnProperty('point_ranking')) {
            this.point_ranking = jsonData['point_ranking'];
        }
        if (jsonData.hasOwnProperty('User')) {
            this.User = new UserProfileModel();
            this.User.parseData(jsonData['User']);
        }
    }

    getId() { return this.id || 0; }
    getUserId() { return this.usga_hc_index || 0; }
    getClubId() { return this.ranking || 0; }
    getIsUserAdmin() { return this.point_ranking || 0; }
    getIsModerator() { return this.User || {}; }
}

module.exports = MannerTopModel;