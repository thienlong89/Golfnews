import BaseModel from '../../Core/Model/BaseModel';
import PostStatusItemModel from './PostStatusItemModel';

class PostStatusModel extends BaseModel {

    constructor(baseComponent) {
        super(baseComponent);

        this.postList = [];
    }

    parseData(data) {
        super.parseData(data);

        if (this.data instanceof Array) {
            for (let obj of this.data) {
                let post = new PostStatusItemModel();
                post.parseData(obj);
                this.postList.push(post);
            }
        }

    }

    getPostList() { return this.postList || [] }

}

module.exports = PostStatusModel;