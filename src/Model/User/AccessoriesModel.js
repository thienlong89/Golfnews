import BaseModel from '../../Core/Model/BaseModel';

export default class AccessoriesModel extends BaseModel {
    constructor(baseComponent) {
        super(baseComponent);

        this.accessories = [];
        this.balls = [];
    }

    parseData(jsonData) {
        super.parseData(jsonData);

        if (this.data.hasOwnProperty('ball')) {
            let ballLs = this.data['ball'];
            if (ballLs instanceof Array) {
                for (let obj of ballLs) {
                    let accessory = new Accessory();
                    accessory.parseData(obj);
                    this.balls.push(accessory);
                }
            }
        }

        if (this.data.hasOwnProperty('other')) {
            let others = this.data['other'];
            if (others instanceof Array) {
                for (let obj of others) {
                    let accessory = new Accessory();
                    accessory.parseData(obj);
                    this.accessories.push(accessory);
                }
            }
        }
        
    }

    getAccessories() {
        return this.accessories;
    }

    getBalls() {
        return this.balls;
    }
}

class Accessory {
    constructor() {
        id: '';
        name: '';
        logo_url: '';
        created_at: '';
        updated_at: '';
    }

    parseData(data) {
        if (data.hasOwnProperty('id')) {
            this.id = data['id'];
        }
        if (data.hasOwnProperty('name')) {
            this.name = data['name'];
        }
        if (data.hasOwnProperty('logo_url')) {
            this.logo_url = data['logo_url'];
        }
        if (data.hasOwnProperty('created_at')) {
            this.created_at = data['created_at'];
        }
        if (data.hasOwnProperty('updated_at')) {
            this.updated_at = data['updated_at'];
        }
    }

    getId() {
        return this.id || '';
    }

    getName() {
        return this.name || '';
    }

    getLogoUrl() {
        return this.logo_url || '';
    }

    getCreateAt() {
        return this.created_at || '';
    }

    getUpdateAt() {
        return this.updated_at || '';
    }
}