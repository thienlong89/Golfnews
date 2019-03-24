import BaseModel from '../../Core/Model/BaseModel';
import StatusModel from './StatusModel';
import PostStatusModel from './PostStatusModel';

class InteractivePlayerModel extends BaseModel {

    constructor(baseComponent) {
        super(baseComponent);

        this.postStatus = {};
        this.likeList = [];
        this.loveList = [];
        this.dislikeList = [];
        this.allStatus = [];
    }

    parseData(jsonData) {
        super.parseData(jsonData);

        if (this.data.hasOwnProperty('total_feel')) {
            this.postStatus = new PostStatusModel();
            this.postStatus.parseData(this.data['total_feel']);
        }
        if (this.data.hasOwnProperty('status')) {
            let info = this.data['status'];

            if (info.hasOwnProperty('like') && info['like'].length > 0) {
                for (let obj of info['like']) {
                    let like = new StatusModel();
                    like.parseData(obj);
                    this.likeList.push(like);
                }
            }

            if (info.hasOwnProperty('love') && info['love'].length > 0) {
                for (let obj of info['love']) {
                    let love = new StatusModel();
                    love.parseData(obj);
                    this.loveList.push(love);
                }
            }

            if (info.hasOwnProperty('unlike') && info['unlike'].length > 0) {
                for (let obj of info['unlike']) {
                    let disLike = new StatusModel();
                    disLike.parseData(obj);
                    this.dislikeList.push(disLike);
                }
            }
        }
        this.allStatus = [...this.likeList, ...this.loveList, ...this.dislikeList];
    }

    getPostStatus() {
        return this.postStatus;
    }

    getLikeList() {
        return this.likeList;
    }

    getLoveList() {
        return this.loveList;
    }

    getDislikeList() {
        return this.dislikeList;
    }

    getAllStatus() {
        return this.allStatus;
    }

}

module.exports = InteractivePlayerModel;
