import TeeModel from './TeeModel';

export default class TeeInfoModel {
    constructor() {
        this.gold;
        this.blue;
        this.white;
        this.red;
        this.black;
        this.teeList = [];
    }
    parseData(data) {
        if (data.hasOwnProperty('gold')) {
            this.gold = new TeeModel();
            this.gold.parseData(data['gold'], 'Gold', 'gold');
            this.teeList.push(this.gold);
        }
        if (data.hasOwnProperty('blue')) {
            this.blue = new TeeModel();
            this.blue.parseData(data['blue'], 'Blue', 'blue');
            this.teeList.push(this.blue);
        }
        if (data.hasOwnProperty('white')) {
            this.white = new TeeModel();
            this.white.parseData(data['white'], 'White', 'white');
            this.teeList.push(this.white);
        }
        if (data.hasOwnProperty('red')) {
            this.red = new TeeModel();
            this.red.parseData(data['red'], 'Red', 'red');
            this.teeList.push(this.red);
        }
        if (data.hasOwnProperty('black')) {
            this.black = new TeeModel();
            this.black.parseData(data['black'], 'Black', 'black');
            this.teeList.push(this.black);
        }
    }
    getGold() { return this.gold || null; }
    getBlue() { return this.blue || null; }
    getWhite() { return this.white || null; }
    getRed() { return this.red || null; }
    getBlack() { return this.black || null; }
    getTeeList() { return this.teeList || []; }
}
