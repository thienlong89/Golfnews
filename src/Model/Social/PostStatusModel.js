class PostStatusModel {
    constructor() {
        this.id = 0;
        this.flight_id = 0;
        this.like_count = 0;
        this.love_count = 0;
        this.unlike_count = 0;
        this.comment_count = 0;
        this.total_count = 0;
        this.img_upload_count = 0;
        this.myStatus = 0;
    }

    parseData(jsonData, myStatus = 0) {
        if (jsonData.hasOwnProperty('id')) {
            this.id = jsonData['id'];
        }
        if (jsonData.hasOwnProperty('flight_id')) {
            this.flight_id = jsonData['flight_id'];
        }
        if (jsonData.hasOwnProperty('like_count')) {
            this.like_count = jsonData['like_count'];
        }
        if (jsonData.hasOwnProperty('love_count')) {
            this.love_count = jsonData['love_count'];
        }
        if (jsonData.hasOwnProperty('unlike_count')) {
            this.unlike_count = jsonData['unlike_count'];
        }
        if (jsonData.hasOwnProperty('comment_count')) {
            this.comment_count = jsonData['comment_count'];
        }
        if (jsonData.hasOwnProperty('img_upload_count')) {
            this.img_upload_count = jsonData['img_upload_count'];
        }
        
        this.myStatus = myStatus;
        this.total_count = this.like_count + this.love_count + this.unlike_count;
    }

    getId() {
        return this.id;
    }

    getFlightId() {
        return this.flight_id;
    }

    getLikeCount() {
        return this.like_count;
    }

    getLoveCount() {
        return this.love_count;
    }
    getDislikeCount() {
        return this.unlike_count;
    }

    getCommentCount() {
        return this.comment_count;
    }

    getTotalCount() {
        return this.total_count;
    }

    getImgCommentCount() {
        return this.img_upload_count;
    }

    getMyStatus() {
        return this.myStatus;
    }
}

module.exports = PostStatusModel;
