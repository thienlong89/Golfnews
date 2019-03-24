class PlayerModel{
    constructor(){
        this.user_id = '',
        this.phone = '';
        this.user_type = -1;
        this.full_name = '';
        this.create_time = '',
        this.avatar = '',
        this.usga_hc_index = 0.0,
        this.usga_hc_index_before = 0.0,
        this.hcap_revision_update = ''
        this.birthday ='',
        this.country = '',
        this.city = '',
        this.address = '',
        this.gender = 0,
        this.ehandicap_club = '',
        this.ehandicap_member_id = '',
        this.ehandicap_upload_date = '',
        this.default_tee_id = '',
        this.monthly_handicap = 0.0,
        this.sync_ehandicap = 0.0,
        this.usga_hc_index_expected  = 0.0,
        this.ranking = 0.0,
        this.ranking_type = '',
        this.ranking_system_last_update = '',
        this.ranking_manners = '',
        this.receive_notification = 0,
        this.usga_hc_index_temp = 0.0,
        this.is_suspended = 0,
        this.system_avatar_path = '',
        this.allow_using_scorecard_image = 0,
        this.type_entry_scorecard = 0,
        this.friends = 0,
        this.display_ranking_type = '',
        this.system_ranking = 0,
        this.create_time_timestamp = '',
        this.avatar_origin = '',
        this.display_phone = '',
        this.rounds = {},
        this.handicap_facility = 0
    }

    parsePlayerData(data){
        if(data.hasOwnProperty('phone')){
            this.phone = data['phone'];
        }
        if(data.hasOwnProperty('id')){
            this.user_id = data['id'];
        }
        if(data.hasOwnProperty('fullname')){
            this.full_name = data['fullname'];
        }
        if(data.hasOwnProperty('create_time')){
            this.create_time = data['create_time'];
        }
        if(data.hasOwnProperty('avatar')){
            this.avatar = data['avatar'];
        }
        if(data.hasOwnProperty('usga_hc_index')){
            this.usga_hc_index = data['usga_hc_index'];
        }
        if(data.hasOwnProperty('usga_hc_index_before')){
            this.usga_hc_index_before = data['usga_hc_index_before'];
        }
        if(data.hasOwnProperty('hcap_revision_update')){
            this.hcap_revision_update = data['hcap_revision_update'];
        }
        if(data.hasOwnProperty('birthday')){
            this.birthday = data['birthday'];
        }
        if(data.hasOwnProperty('country')){
            this.country = data['country'];
        }
        if(data.hasOwnProperty('city')){
            this.city = data['city'];
        }
        if(data.hasOwnProperty('address')){
            this.address = data['address'];
        }
        if(data.hasOwnProperty('gender')){
            this.gender = data['gender'];
        }
        if(data.hasOwnProperty('ehandicap_club')){
            this.ehandicap_club = data['ehandicap_club'];
        }
        if(data.hasOwnProperty('ehandicap_member_id')){
            this.ehandicap_member_id = data['ehandicap_member_id'];
        }
        if(data.hasOwnProperty('ehandicap_upload_date')){
            this.ehandicap_upload_date = data['ehandicap_upload_date'];
        }
        if(data.hasOwnProperty('default_tee_id')){
            this.default_tee_id = data['default_tee_id'];
        }
        if(data.hasOwnProperty('monthly_handicap')){
            this.monthly_handicap = data['monthly_handicap'];
        }
        if(data.hasOwnProperty('usga_hc_index_expected')){
            this.usga_hc_index_expected = data['usga_hc_index_expected'];
        }

        
        if(data.hasOwnProperty('sync_ehandicap')){
            this.sync_ehandicap = data['sync_ehandicap'];
        }
        if(data.hasOwnProperty('ranking')){
            this.ranking = data['ranking'];
        }
        if(data.hasOwnProperty('ranking_type')){
            this.ranking_type = data['ranking_type'];
        }
        if(data.hasOwnProperty('ranking_system_last_update')){
            this.ranking_system_last_update = data['ranking_system_last_update'];
        }
        if(data.hasOwnProperty('ranking_manners')){
            this.ranking_manners = data['ranking_manners'];
        }
        if(data.hasOwnProperty('receive_notification')){
            this.receive_notification = data['receive_notification'];
        }
        if(data.hasOwnProperty('usga_hc_index_temp')){
            this.usga_hc_index_temp = data['usga_hc_index_temp'];
        }
        if(data.hasOwnProperty('is_suspended')){
            this.is_suspended = data['is_suspended'];
        }
        if(data.hasOwnProperty('system_avatar_path')){
            this.system_avatar_path = data['system_avatar_path'];
        }
        if(data.hasOwnProperty('allow_using_scorecard_image')){
            this.allow_using_scorecard_image = data['allow_using_scorecard_image'];
        }
        if(data.hasOwnProperty('type_entry_scorecard')){
            this.type_entry_scorecard = data['type_entry_scorecard'];
        }
        
        if(data.hasOwnProperty('friends')){
            this.friends = data['friends'];
        }
        if(data.hasOwnProperty('display_ranking_type')){
            this.display_ranking_type = data['display_ranking_type'];
        }
        if(data.hasOwnProperty('system_ranking')){
            this.system_ranking = data['system_ranking'];
        }
        if(data.hasOwnProperty('create_time_timestamp')){
            this.create_time_timestamp = data['create_time_timestamp'];
        }
        if(data.hasOwnProperty('avatar_origin')){
            this.avatar_origin = data['avatar_origin'];
        }
        if(data.hasOwnProperty('display_phone')){
            this.display_phone = data['display_phone'];
        }
        if(data.hasOwnProperty('rounds')){
            this.rounds = data['rounds'];
        }
        if(data.hasOwnProperty('handicap_facility')){
            this.handicap_facility = data['handicap_facility'];
        }
    }
    
    getUserType(){
        return this.user_type;
    }

    getUserId(){
        return this.user_id;
    }

    getPhone(){
        return this.phone;
    }

    getFullName(){
        return this.full_name;
    }

    setFullname(fullname) {
        this.full_name = fullname;
    }

    getDisplay_ranking_type() {
        return this.display_ranking_type;
    }

    setDisplay_ranking_type(display_ranking_type) {
        this.display_ranking_type = display_ranking_type;
    }

    getCreateTime() {
        return this.create_time;
    }

    setCreateTime(createTime) {
        this.create_time = createTime;
    }

    getAvatar() {
        return 'https://scontent.fhan3-1.fna.fbcdn.net/v/t1.0-1/p160x160/24852361_1046175158855470_7122217931950938706_n.jpg?_nc_cat=0&oh=0f73ebd780c09f7e9ded440434ff61a1&oe=5B60E928';//this.avatar;
    }

    setAvatar(avatar) {
        this.avatar = avatar;
    }

    getUsgaHcIndex() {
        return this.usga_hc_index;
    }

    setUsgaHcIndex(usgaHcIndex) {
        this.usga_hc_index = usgaHcIndex;
    }

    getUsgaHcIndexBefore() {
        return this.usga_hc_index_before;
    }

    setUsgaHcIndexBefore(usgaHcIndexBefore) {
        this.usga_hc_index_before = usgaHcIndexBefore;
    }

    getHcapRevisionUpdate() {
        return this.hcap_revision_update;
    }

    setHcapRevisionUpdate(hcapRevisionUpdate) {
        this.hcap_revision_update = hcapRevisionUpdate;
    }

    getBirthday() {
        return this.birthday;
    }

    setBirthday(birthday) {
        this.birthday = birthday;
    }

    getCountry() {
        return this.country;
    }

    setCountry(country) {
        this.country = country;
    }

    getCity() {
        return this.city;
    }

    setCity(city) {
        this.city = city;
    }

    getAddress() {
        return this.address;
    }

    setAddress(address) {
        this.address = address;
    }

    getGender() {
        return this.gender;
    }

    setGender(gender) {
        this.gender = gender;
    }

    getEhandicapClub() {
        return this.ehandicap_club;
    }

    setEhandicapClub(ehandicapClub) {
        this.ehandicap_club = ehandicapClub;
    }

    getEhandicapMemberId() {
        return this.ehandicap_member_id;
    }

    setEhandicapMemberId(ehandicapMemberId) {
        this.ehandicap_member_id = ehandicapMemberId;
    }

    getDefaultTeeID() {
        return this.default_tee_id;
    }
    getUsgaHcIndexExpected() {
        return this.usga_hc_index_expected;
    }
    setUsgaIndexExpected(_handicap_expected){
        this.usga_hc_index_expected = _handicap_expected;
    }
    setDefaultTeeID(defaultTeeID) {
        this.default_tee_id = defaultTeeID;
    }

    getMonthlyHandicap() {
        return this.monthly_handicap;
    }

    setMonthlyHandicap(monthlyHandicap) {
        this.monthly_handicap = monthlyHandicap;
    }

    getRanking() {
        return this.ranking;
    }

    setRanking(ranking) {
        this.ranking = ranking;
    }

    getRankingType() {
        return this.ranking_type;
    }

    setRankingType(rankingType) {
        this.ranking_type = rankingType;
    }

    getSystem_ranking() {
        return this.system_ranking;
    }

    setSystem_ranking(system_ranking) {
        this.system_ranking = system_ranking;
    }

    getRanking_manners() {
        return this.ranking_manners;
    }

    setRanking_manners(ranking_manners) {
        this.ranking_manners = ranking_manners;
    }

    getType_entry_scorecard() {
        return this.type_entry_scorecard;
    }

    setType_entry_scorecard(type_entry_scorecard) {
        this.type_entry_scorecard = type_entry_scorecard;
    }

    getRounds() {
        return this.rounds;
    }

    setRounds(rounds) {
        this.rounds = rounds;
    }

    getFriends() {
        return this.friends;
    }

    setFriends(friends) {
        this.friends = friends;
    }

    getAllow_using_scorecard_image() {
        return this.allow_using_scorecard_image;
    }

    setAllow_using_scorecard_image(allow_using_scorecard_image) {
        this.allow_using_scorecard_image = allow_using_scorecard_image;
    }

    getHandicap_facility() {
        return this.handicap_facility;
    }
}

module.exports = PlayerModel;
