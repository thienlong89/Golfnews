class CLBItemModel{
    constructor(){
        this.id = '';
        this.logo = '',
        this.name = '';
        this.totalMember = 0;
        this.avg_handicap = '';
        this.rank = '';
        this.manners = '';
        this.ranking_point_handicap = '';
        this.total_point_ranking_vhandicap = '';
    }

    paserData(data){
        if(data.hasOwnProperty('logo_url_path')){
            this.logo = data['logo_url_path'];
        }
        if(data.hasOwnProperty('name')){
            this.name = data['name'];
        }
        if(data.hasOwnProperty('total_member')){
            this.totalMember = parseInt(data['total_member']) || 0;
        }
        if(data.hasOwnProperty('stt')){
            this.rank = parseInt(data['stt']) || 0;
        }
        if(data.hasOwnProperty('avg_handicap')){
            this.avg_handicap = parseFloat(data['avg_handicap']);
        }
        if(data.hasOwnProperty('avg_handicap_display')){
            this.avg_handicap_display = data['avg_handicap_display'];
        }
        if(data.hasOwnProperty('manners')){
            this.manners = data['manners'];
        }
        if(data.hasOwnProperty('id')){
            this.id = data['id'];
        }
        if(data.hasOwnProperty('is_invited')){
            this.is_invited = data['is_invited'];
        }
        if(data.hasOwnProperty('img_country')){
            this.img_country = data['img_country'];
        }
        if(data.hasOwnProperty('ranking_point_handicap')){
            this.ranking_point_handicap = data['ranking_point_handicap'];
        }
        if(data.hasOwnProperty('total_point_ranking_vhandicap')){
            this.total_point_ranking_vhandicap = data['total_point_ranking_vhandicap'];
        }
    }

    getAvgHandicapDisplay(){
        return this.avg_handicap_display ? this.avg_handicap_display : '';
    }

    isInvited(){
        return this.is_invited ? this.is_invited : false;
    }

    getId(){
        return this.id;
    }
    getLogo(){
        return this.logo ? this.logo : '';
    }

    getName(){
        return this.name ? this.name : '';
    }

    getTotalMember(){
        return this.totalMember ? this.totalMember : 0;
    }

    getHandicap(){
        return this.avg_handicap ? this.avg_handicap : 0;
    }

    getRank(){
        return this.rank ? this.rank : 1;
    }

    getManners(){
        return this.manners ? this.manners : '';
    }

    getCountryImage(){
        return this.img_country ? this.img_country : '';
    }

    getRankingPoint(){
        return this.ranking_point_handicap ? this.ranking_point_handicap : '';
    }

    getTotalRankingPoint(){
        return this.total_point_ranking_vhandicap ? this.total_point_ranking_vhandicap : '';
    }
}

module.exports = CLBItemModel;