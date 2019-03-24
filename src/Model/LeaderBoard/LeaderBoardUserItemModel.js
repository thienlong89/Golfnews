class LeaderBoardUserItemModel {
    constructor() {
        this.userId = '';
        this.fullname = '';
        this.avatar = '';
        this.ranking_type = '';
        this.ranking = 0;
        this.handicap = undefined;
        this.ranking_system = 0;
        this.ranking_manners = '';
        this._id = '';
        this.display_ranking_type = '';
        this.ehandicap_member_id = '';
        this.country_image = '';
    }

    paserData(data) {
        if (data.hasOwnProperty('id')) {
            this.userId = data['id'];
        }
        if (this.userId === '' && data.hasOwnProperty('userId')) {
            this.userId = data['userId'];
        }
        if (data.hasOwnProperty('fullname')) {
            this.fullname = data['fullname'];
        }
        if (data.hasOwnProperty('avatar')) {
            this.avatar = data['avatar'];
        }
        if (data.hasOwnProperty('ranking_type')) {
            this.ranking_type = data['ranking_type'];
        }
        if (data.hasOwnProperty('display_ranking_type')) {
            this.display_ranking_type = data['display_ranking_type'];
        }
        if (data.hasOwnProperty('usga_hc_index')) {
            this.handicap = parseFloat(data['usga_hc_index']);
        }
        if (data.hasOwnProperty('handicap')) {
            this.handicap = parseFloat(data['handicap']);
        }
        if (data.hasOwnProperty('ranking')) {
            this.ranking = data['ranking'];
        }
        if (data.hasOwnProperty('ranking_system')) {
            this.ranking_system = data['ranking_system'];
        }
        if (data.hasOwnProperty('ranking_manners')) {
            this.ranking_manners = data['ranking_manners'];
        }
        if (data.hasOwnProperty('ehandicap_member_id')) {
            this.ehandicap_member_id = data['ehandicap_member_id'];
        }
        if (data.hasOwnProperty('_id')) {
            this._id = data['_id'];
        }
        if(data.hasOwnProperty('country_image')){
            this.country_image = data['country_image'];
        }
    }

    getUserId() {
        return this.userId ? this.userId : '';
    }

    getFullName() {
        return this.fullname ? this.fullname : '';
    }

    getAvatar() {
        return this.avatar ? this.avatar : '';
    }

    getRankingType() {
        return this.ranking_type ? this.ranking_type : '';
    }

    getRanking() {
        return this.ranking ? this.ranking : 0;
    }

    getHandicap() {
        return this.handicap !== undefined ? this.handicap : 0;
    }

    getRankingSystem() {
        return this.ranking_system ? this.ranking_system : 0;
    }

    getRankingManners() {
        return this.ranking_manners ? this.ranking_manners : 0;
    }

    get_Id() {
        return this._id ? this._id : '';
    }

    getDisplayRankingType() {
        return this.display_ranking_type ? this.display_ranking_type : '';
    }

    getMemberId() {
        return this.ehandicap_member_id ? this.ehandicap_member_id : '';
    }

    getCountryImage() {
        return this.country_image;
    }
}

module.exports = LeaderBoardUserItemModel;