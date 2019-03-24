import BaseModel from '../../Core/Model/BaseModel';

class UserProfile extends BaseModel{
    constructor(baseComponent){
        super(baseComponent);
        this._id = '',
        this.id = '',
        this.phone = '';
        this.user_type = -1;
        this.fullname = '';
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
        this.usga_hc_index_expected  = 0.0,
        this.sync_ehandicap = 0.0,
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
        this.rounds = 0,
        this.friends = 0,
        this.display_ranking_type = '',
        this.system_ranking = 0,
        this.create_time_timestamp = '',
        this.avatar_origin = '',
        this.display_phone = '',
        this.handicap_facility = 0;
        this.text_info_handicap = '';
        this.id_firebase = '';
        this.star = 0;
        this.time_expried_display = '';

        this.listClubs = [];
    }

    parseData(jsonData){
        if(typeof jsonData === 'object' && jsonData.hasOwnProperty('user_type')){
            this.user_type = jsonData['user_type'];
        }
        if(jsonData.hasOwnProperty('phone')){
            this.phone = jsonData['phone'];
        }
        if(jsonData.hasOwnProperty('id')){
            this.id = jsonData['id'];
        }
        if(jsonData.hasOwnProperty('_id')){
            this._id = jsonData['_id'];
        }
        if(jsonData.hasOwnProperty('fullname')){
            this.fullname = jsonData['fullname'];
        }
        this.avatar = jsonData['avatar'] || '';
        if(jsonData.hasOwnProperty('ranking')){
            this.ranking = jsonData['ranking'];
        }
        if(jsonData.hasOwnProperty('ranking_type')){
            this.ranking_type = jsonData['ranking_type'];
        }
        if(jsonData.hasOwnProperty('ranking_manners')){
            this.ranking_manners = jsonData['ranking_manners'];
        }
        if(jsonData.hasOwnProperty('usga_hc_index')){
            this.usga_hc_index = jsonData['usga_hc_index'];
        }
        if(jsonData.hasOwnProperty('usga_hc_index_before')){
            this.usga_hc_index_before = jsonData['usga_hc_index_before'];
        }
        if(jsonData.hasOwnProperty('ranking_system')){
            this.system_ranking = jsonData['ranking_system'];
        }
        if(jsonData.hasOwnProperty('monthly_handicap')){
            this.monthly_handicap = jsonData['monthly_handicap'];
        }
        if(jsonData.hasOwnProperty('usga_hc_index_expected')){
            this.usga_hc_index_expected = jsonData['usga_hc_index_expected'];
        }

        
        if(jsonData.hasOwnProperty('display_ranking_type')){
            this.display_ranking_type = jsonData['display_ranking_type'];
        }
        if(jsonData.hasOwnProperty('default_tee_id')){
            this.default_tee_id = jsonData['default_tee_id'];
        }
        if(jsonData.hasOwnProperty('ehandicap_member_id')){
            this.ehandicap_member_id = jsonData['ehandicap_member_id'];
        }
        if(jsonData.hasOwnProperty('avatar_origin')){
            this.avatar_origin = jsonData['avatar_origin'];
        }
        if(jsonData.hasOwnProperty('id_firebase')){
            this.id_firebase = jsonData['id_firebase'];
        }
        if(jsonData.hasOwnProperty('birthday_display')){
            this.birthday_display = jsonData['birthday_display'];
        }
        if(jsonData.hasOwnProperty('country')){
            this.country = jsonData['country'];
        }
        if(jsonData.hasOwnProperty('star')){
            this.star = jsonData['star'];
        }
        if(jsonData.hasOwnProperty('time_expried_display')){
            this.time_expried_display = jsonData['time_expried_display'];
        }
        if(this.data.hasOwnProperty('country_image')){
            this.country_image = this.data['country_image'];
        }
    }

    parseUserData(jsonData){
        super.parseData(jsonData);
        if(this.data.hasOwnProperty('text_info_handicap')){
            this.text_info_handicap = this.data['text_info_handicap'];
        }
        if(this.data.hasOwnProperty('qa_url')){
            this.qa_url = this.data['qa_url'];
        }

        if(this.data.hasOwnProperty('clubs')){
            this.listClubs = this.data['clubs'];
        }

        if(this.data.hasOwnProperty('url_info_handicap')){
            this.url_info_handicap = this.data['url_info_handicap'];
        }
        if(this.data.hasOwnProperty('event_count')){
            this.event_count = this.data['event_count'];
        }
        if(typeof this.data === 'object' && this.data.hasOwnProperty('personal')){
            this.data = this.data['personal'];
            this.profile = this.data;
            this.profile['clubs'] = this.listClubs;
        }
        
        if(typeof this.data === 'object' && this.data.hasOwnProperty('user_type')){
            this.user_type = this.data['user_type'];
        }
        if(this.data.hasOwnProperty('phone')){
            this.phone = this.data['phone'];
        }
        if(this.data.hasOwnProperty('id')){
            this.id = this.data['id'];
        }
        if(this.data.hasOwnProperty('_id')){
            this._id = this.data['_id'];
        }
        if(this.data.hasOwnProperty('fullname')){
            this.fullname = this.data['fullname'];
        }
        if(this.data.hasOwnProperty('create_time')){
            this.create_time = this.data['create_time'];
        }
        if(this.data.hasOwnProperty('avatar')){
            this.avatar = this.data['avatar'];
        }
        if(this.data.hasOwnProperty('usga_hc_index')){
            this.usga_hc_index = this.data['usga_hc_index'];
        }
        if(this.data.hasOwnProperty('usga_hc_index_expected')){
            this.usga_hc_index_expected = this.data['usga_hc_index_expected'];
        }
        
        if(this.data.hasOwnProperty('usga_hc_index_before')){
            this.usga_hc_index_before = this.data['usga_hc_index_before'];
        }
        if(this.data.hasOwnProperty('hcap_revision_update')){
            this.hcap_revision_update = this.data['hcap_revision_update'];
        }
        if(this.data.hasOwnProperty('birthday')){
            this.birthday = this.data['birthday'];
        }
        if(this.data.hasOwnProperty('country')){
            this.country = this.data['country'];
        }
        if(this.data.hasOwnProperty('state')){
            this.state = this.data['state'];
        }
        if(this.data.hasOwnProperty('city')){
            this.city = this.data['city'];
        }
        if(this.data.hasOwnProperty('address')){
            this.address = this.data['address'];
        }
        if(this.data.hasOwnProperty('gender')){
            this.gender = this.data['gender'];
        }
        if(this.data.hasOwnProperty('ehandicap_club')){
            this.ehandicap_club = this.data['ehandicap_club'];
        }
        if(this.data.hasOwnProperty('ehandicap_member_id')){
            this.ehandicap_member_id = this.data['ehandicap_member_id'];
        }
        if(this.data.hasOwnProperty('ehandicap_upload_date')){
            this.ehandicap_upload_date = this.data['ehandicap_upload_date'];
        }
        if(this.data.hasOwnProperty('default_tee_id')){
            this.default_tee_id = this.data['default_tee_id'];
        }
        if(this.data.hasOwnProperty('monthly_handicap')){
            this.monthly_handicap = this.data['monthly_handicap'];
        }
        if(this.data.hasOwnProperty('sync_ehandicap')){
            this.sync_ehandicap = this.data['sync_ehandicap'];
        }
        if(this.data.hasOwnProperty('ranking')){
            this.ranking = this.data['ranking'];
        }
        if(this.data.hasOwnProperty('ranking_type')){
            this.ranking_type = this.data['ranking_type'];
        }
        if(this.data.hasOwnProperty('ranking_system_last_update')){
            this.ranking_system_last_update = this.data['ranking_system_last_update'];
        }
        if(this.data.hasOwnProperty('ranking_manners')){
            this.ranking_manners = this.data['ranking_manners'];
        }
        if(this.data.hasOwnProperty('receive_notification')){
            this.receive_notification = this.data['receive_notification'];
        }
        if(this.data.hasOwnProperty('usga_hc_index_temp')){
            this.usga_hc_index_temp = this.data['usga_hc_index_temp'];
        }
        if(this.data.hasOwnProperty('is_suspended')){
            this.is_suspended = this.data['is_suspended'];
        }
        if(this.data.hasOwnProperty('system_avatar_path')){
            this.system_avatar_path = this.data['system_avatar_path'];
        }
        if(this.data.hasOwnProperty('allow_using_scorecard_image')){
            this.allow_using_scorecard_image = this.data['allow_using_scorecard_image'];
        }
        if(this.data.hasOwnProperty('type_entry_scorecard')){
            this.type_entry_scorecard = this.data['type_entry_scorecard'];
        }
        if(this.data.hasOwnProperty('rounds')){
            this.rounds = this.data['rounds'];
        }
        if(this.data.hasOwnProperty('friends')){
            this.friends = this.data['friends'];
        }
        if(this.data.hasOwnProperty('display_ranking_type')){
            this.display_ranking_type = this.data['display_ranking_type'];
        }
        if(this.data.hasOwnProperty('ranking_system')){
            this.system_ranking = this.data['ranking_system'];
        }
        if(this.data.hasOwnProperty('create_time_timestamp')){
            this.create_time_timestamp = this.data['create_time_timestamp'];
        }
        if(this.data.hasOwnProperty('avatar_origin')){
            this.avatar_origin = this.data['avatar_origin'];
        }
        if(this.data.hasOwnProperty('display_phone')){
            this.display_phone = this.data['display_phone'];
        }
        if(this.data.hasOwnProperty('handicap_facility')){
            this.handicap_facility = this.data['handicap_facility'];
        }
        if(this.data.hasOwnProperty('country_image')){
            this.country_image = this.data['country_image'];
        }
        if(this.data.hasOwnProperty('birthday_display')){
            this.birthday_display = this.data['birthday_display'];
        }
        if(this.data.hasOwnProperty('create_time_display')){
            this.create_time_display = this.data['create_time_display'];
        }
        if(this.data.hasOwnProperty('phones')){
            this.phones = this.data['phones'];
        }
        if(this.data.hasOwnProperty('avatar_origin')){
            this.avatar_origin = this.data['avatar_origin'];
        }
        if(this.data.hasOwnProperty('id_firebase')){
            this.id_firebase = this.data['id_firebase'];
        }
        if(this.data.hasOwnProperty('time_expried_display')){
            this.time_expried_display = this.data['time_expried_display'];
        }
    }

    getTextInfoHandicap(){
        return this.text_info_handicap;
    }

    getEventCountComing(){
        return this.event_count ? parseInt(this.event_count) : 0;
    }

    getState(){
        return this.state ? this.state : '';
    }

    setState(_state){
        this.state = _state;
    }

    getUrlInfoHandicap(){
        return this.url_info_handicap ? this.url_info_handicap : '';
    }

    getQAUrl(){
        return this.qa_url ? this.qa_url : '';
    }

    getListPhone(){
        return this.phones ? this.phones : [];
    }

    setListPhone(_list_phone){
        this.phones = _list_phone;
    }

    getCreateTimeDisplay(){
        return this.create_time_display ? this.create_time_display : '';
    }

    getDisplayBirthday(){
        return this.birthday_display ? this.birthday_display : '';
    }

    setDisplayBirthday(_birthday){
        this.birthday_display = _birthday;
    }

    getCountryImage(){
        return this.country_image ? this.country_image : '';
    }

    getProfile(){
        return this.profile ? this.profile : {};
    }
    
    getUserType(){
        return this.user_type;
    }

    getUserId(){
        return this.id;
    }

    setUserId(userId){
        this.id = userId;
    }

    getId(){
        return this._id;
    }

    getPhone(){
        return this.phone;
    }

    getFullName(){
        return this.fullname;
    }

    setFullname(fullname) {
        this.fullname = fullname;
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
        return this.avatar;
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
        return this.city ? this.city : '';
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

    getUsgaHcIndexExpected() {
        return this.usga_hc_index_expected;
    }

    getDefaultTeeID() {
        return this.default_tee_id;
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

    setHandicapFacility(_handicap_facility){
        this.handicap_facility = _handicap_facility;
    }

    getOriginAvatar(){
        return this.avatar_origin;
    }

    getFirebaseId(){
        return this.id_firebase;
    }

    getStar(){
        return this.star;
    }

    getExpertDateVip(){
        return this.time_expried_display;
    }

}

module.exports = UserProfile;