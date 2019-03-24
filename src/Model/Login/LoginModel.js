import BaseModel from '../../Core/Model/BaseModel';
import UserProfileModel from '../../Model/Home/UserProfileModel';

class LoginModel extends BaseModel{
    constructor(baseComponent){
        super(baseComponent);
        this.userId = '';
        this.userType = '';
        this.token = '';
        this.profile = {};
    }

    parseData(jsonData){
        super.parseData(jsonData);
        if(typeof this.data === 'object' && this.data.hasOwnProperty('user_type')){
            this.user_type = this.data['user_type'];
        }
        if(this.data.hasOwnProperty('token')){
            this.token = this.data['token'];
        }
        if(this.data.hasOwnProperty('uid')){
            this.user_id = this.data['uid'];
        }
        if(this.data.hasOwnProperty('profile')){
            this.profile = new UserProfileModel();
            this.profile.parseData(this.data['profile']);
        }
    }

    getUserId(){
        return this.user_id;
    }

    getUserType(){
        return this.user_type;
    }

    getToken(){
        return this.token;
    }

    getUserProfile(){
        return this.profile;
    }
}

module.exports = LoginModel;