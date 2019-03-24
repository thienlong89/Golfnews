import BaseModel from '../../Core/Model/BaseModel';

class CLBDetailModel extends BaseModel{
    constructor(baseComponent){
        super(baseComponent);
        this.ngay_tao = '';
        this.chu_tich = '';
        this.tong_thu_ky = '';
        this.lien_he = '';
        this.tong_thanh_vien = 0;
        this.facebook_page = '';
        this.dia_chi = '';
        this.name = '';
    }

    parseData(jsonData){
        super.parseData(jsonData);
        if(this.getErrorCode()===0){
            if(this.data.hasOwnProperty('club')){
                this.data = this.data['club'];
                if(this.data.hasOwnProperty('created_at')){
                    this.ngay_tao = this.data['created_at'];
                }
                if(this.data.hasOwnProperty('manager')){
                    this.chu_tich = this.data['manager'];
                }
                if(this.data.hasOwnProperty('secretary')){
                    this.tong_thu_ky = this.data['secretary'];
                }
                if(this.data.hasOwnProperty('total_member')){
                    this.tong_thanh_vien = parseInt(this.data['total_member']) || 0;
                }
                if(this.data.hasOwnProperty('address')){
                    this.dia_chi = this.data['address'];
                }
                if(this.data.hasOwnProperty('hotline')){
                    this.lien_he = this.data['hotline'];
                }
                if(this.data.hasOwnProperty('facebook_link')){
                    this.facebook_page = this.data['facebook_link'];
                }
                if(this.data.hasOwnProperty('name')){
                    this.name = this.data['name'];
                }
            }
        }
    }

    getName(){
        return this.name;
    }

    getCreateAt(){
        return this.ngay_tao ? this.ngay_tao : '';
    }

    getManager(){
        return this.chu_tich ? this.chu_tich : '';
    }

    getSecretary(){
        return this.tong_thu_ky ? this.tong_thu_ky : '';
    }

    getTotalMembers(){
        return this.tong_thanh_vien;
    }

    getAddress(){
        return this.dia_chi;
    }

    getHotline(){
        return this.lien_he;
    }

    getFacebookPage(){
        return this.facebook_page;
    }
}

module.exports = CLBDetailModel;