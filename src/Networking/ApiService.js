import UserInfo from '../Config/UserInfo';

//====================API Mobile golfnews=========================//
module.exports.search_all = function(query='',page=1,number = 10){
    return `search/${query}/${page}/${number}`;
}

module.exports.news_category_all = function(){
    return `category/all`;
}

module.exports.news_category_detail = function(cate_slug,page=1,number=10){
    return `category/detail/${cate_slug}/${page}/${number}`;
}

module.exports.news_list_latest = function(page=1,number=5){
    return `latestPosts/${page}/${number}`;
}

/**
 * Xem chi tiet bai viet
 */
module.exports.news_view_post = function(slug){
    return `post/detail/${slug}`;
}

module.exports.video_menu = function(){
    return `category/video`;
}

module.exports.video_slug = function(slug){
    return `category/detail/${slug}`;
}

module.exports.video_list_all = function(){
    return `category/detail/video`;
}

module.exports.television = function(){
    return `schedule-tv`;
}
//=============================END================================//

function getVerified() {
    return `uid=${UserInfo.getId()}&token=${UserInfo.getUserToken()}&lang=${UserInfo.getLang()}`;
}

/** GET */
module.exports.ping_server = function ping_server() {
    return `ping/`;
}

/** GET */
module.exports.setting_in_app_purchase = function setting_in_app_purchase() {
    return `users/setting_inapppurchase?${getVerified()}`;
}

/** POST */
module.exports.verify_iap_vip_ios = function verify_iap_vip_ios() {
    return `users/add_log_inapppurchase_vip_ios?${getVerified()}`;
}

/** POST */
module.exports.verify_iap_vip_android = function verify_iap_vip_android() {
    return `users/add_log_inapppurchase_vip_androi?${getVerified()}`;
}

/** GET */
module.exports.search_course = function search_course(input, page = 1, number = 20) {
    return `facilities/search_courses?${getVerified()}&page=${page}&number=${number}&query=${input}`;
}

/** GET */
module.exports.get_country_list = function get_country_list(page = 1, number = 20) {
    return `users/get_list_country?page=${page}&number=${number}`;
}

module.exports.list_recent_course = function (page = 1, number = 15) {
    return `facilities/recent_courses?${getVerified()}&page=${page}&number=${number}`;
}

/** POST: Check handicap */
module.exports.check_handicap_facility = function check_handicap_facility() {
    return `facilities/get_courses_handicap?${getVerified()}`;
}

/** POST: Check handicap */
module.exports.check_handicap_by_path = function check_handicap_by_path() {
    return `facilities/get_courses_handicap_new_v3?${getVerified()}`;
}

/** GET Finish flight/unfinish flight */
module.exports.home_list_all_rounds = function home_list_all_rounds(page, number = 10) {
    return `rounds/home_list_all_rounds?${getVerified()}&page=${page}&number=${number}`;
}

module.exports.home_list_all_rounds_for_cache = function home_list_all_rounds_for_cache(id_flight_start, isNew = true, page = 1) {
    return `rounds/home_list_all_rounds_for_cache?${getVerified()}&id_flight_start=${id_flight_start}&type=${isNew ? 1 : 2}&number=20&page=${page}`;
}

module.exports.list_round_finished_by_date = function list_round_finished_by_date(time_played_start = 0) {
    return `rounds/list_round_finised_by_date?${getVerified()}&time_played_start=${time_played_start}`;
}

module.exports.view_details_round_for_cache = function view_details_round_for_cache(flight_id) {
    return `rounds/view_details_round_for_cache?${getVerified()}&flight_id=${flight_id}`;
}

//=========================API Group===================//
module.exports.group_add_member = function add_member(group_id) {
    return `group/add_member?${getVerified()}&group_id=${group_id}`;
}

module.exports.group_list_member = function group_list_member(group_id, page = 1, number = 100) {
    return `group/list_member?${getVerified()}&group_id=${group_id}&page=${page}&number=${number}`;
}

module.exports.group_member_flight = function group_member_flight(page = 1, number = 100) {
    return `group/list_flight_by_group?${getVerified()}&page=${page}&number=${number}`;
}

module.exports.list_flight_group_by_id_flight_start = function list_flight_group_by_id_flight_start(id_flight_start) {
    return `group/list_flight_group_by_id_flight_start?${getVerified()}&id_flight_start=${id_flight_start}`;
}

module.exports.group_member_list = function group_member_list(group_id = '', page = 1) {
    return `group/list_member?${getVerified()}&number=20&group_id=${group_id}&page=${page}`;
}

module.exports.group_member_list_new = function group_member_list_new(group_id = '', page = 1) {
    return `group/list_member_new?${getVerified()}&number=20&group_id=${group_id}&page=${page}`;
}

module.exports.group_member_swap = function group_member_swap() {
    return `group/update_flight?${getVerified()}`;
}

module.exports.group_list = function group_list(page = 1, number = 20) {
    return `group/list?${getVerified()}&page=${page}&number=${number}`
}

module.exports.group_remove_member = function group_remove_member(group_id) {
    return `group/remove_member?${getVerified()}&group_id=${group_id}`;
}

module.exports.group_search = function group_search(query, page = 1, number = 20) {
    return `group/search?${getVerified()}&page=${page}&number=${number}&query=${query}`;
}

module.exports.group_delete = function group_delete(group_id) {
    return `group/delete?${getVerified()}&group_id=${group_id}`;
}

module.exports.group_search_user = function group_search_user(group_id, query, page = 1, number = 20) {
    return `group/search_users?${getVerified()}&page=${page}&number=${number}&group_id=${group_id}&q=${query}`;
}

module.exports.search_member_to_add_new_group = function search_member_to_add_new_group(query, page = 1, number = 20) {
    return `group/search_member_to_add_new_group?${getVerified()}&page=${page}&number=${number}&q=${query}`;
}

module.exports.list_member_group_to_add_permission = function list_member_group_to_add_permission(group_id, query, page = 1, number = 20) {
    return `group/list_member_group_to_add_permission?${getVerified()}&group_id=${group_id}&page=${page}&number=${number}&q=${query}`;
}

module.exports.add_permission_group = function add_permission_group(group_id) {
    return `group/add_permission_group?${getVerified()}&group_id=${group_id}`;
}

module.exports.group_block_unlock_flight = function group_block_unlock_flight(group_id, flight_group_id, is_block = 0) {
    return `group/block_or_unlock_flight?${getVerified()}&group_id=${group_id}&flight_group_id=${flight_group_id}&is_block=${is_block}`;
}

module.exports.group_create = function () {
    return `group/create?${getVerified()}`;
}

module.exports.group_upload_logo = function () {
    return `image/upload/user_group?${getVerified()}`;
}

module.exports.group_update = function (group_id) {
    return `group/update?${getVerified()}&group_id=${group_id}`;
}

module.exports.group_update_logo = function (group_id) {
    return `group/update_img_group?${getVerified()}&group_id=${group_id}`;
}

/**
 * upload anh group de share cho ban be
 */
module.exports.group_upload_share = function () {
    return `image/upload/group_share?${getVerified()}`;
}

/**
 * upload anh trong chuc nang chat
 */
module.exports.chat_upload = function () {
    return `image/upload/chat?${getVerified()}`;
}

/**
 * API rời khỏi nhóm
 * @param {*} group_id 
 */
module.exports.group_leave = function (group_id) {
    return `group/exit_group?${getVerified()}&group_id=${group_id}`;
}

/**
 * random đổi chỗ user trong group flight
 * Type = 1 random xáo trộn bất kỳ
 * Type = 2 random theo handicap ASC user
 * @method GET
 */
module.exports.random_swap_user_group_flight = function (group_id, type) {
    return `group/random_flight?${getVerified()}&group_id=${group_id}&type=${type}`;
}

module.exports.change_max_member_flight = function (group_id, flight_group_id, max_member) {
    return `group/change_max_member_flight?${getVerified()}&group_id=${group_id}&flight_group_id=${flight_group_id}&max_member=${max_member}`;
}

/**
 * Chi tiet nhom
 * @param {*} group_id 
 * @method GET
 */
module.exports.group_detail = function (group_id) {
    return `group/view_detail?${getVerified()}&group_id=${group_id}`;
}

module.exports.group_chat_list = function (page = 1, number = 60) {
    return `group/list_chat_recent?${getVerified()}&page=${page}&number=${number}`;
}

/**
 * Lấy thông tin user cho màn hình chát
 */
module.exports.user_info_chat = function (puid) {
    return `users/get_info_chat?${getVerified()}&puid=${puid}`;
}

/**
 * API check user co trong group khong de chat
 */
module.exports.group_info_chat = function(group_id){
    return `group/info?${getVerified()}&group_id=${group_id}`;
}

/**
 * ban notify chat cho user
 * @param {String} puid id user nhận,id group,id club
 * @param {number} type 1 chat user,2 chat group,3 chat club
 * 
    body {
    "mess": "Có thằng chát trong Club"
    }
 */
module.exports.send_notify_chat = function(puid,type){
    return `group/send_notify_chat?${getVerified()}&puid=${puid}&type=${type}`;
}

/**
 * Lấy danh sách user la cskh hay không
 */
module.exports.load_identification_cskh_trong_tai = function(){
    return `users/get_identification_chat`;
}
//===========================End=======================//

//===========================API CLUB==================//
module.exports.club_detai = function club_detai(club_id) {
    return `club/view_detail?${getVerified()}&club_id=${club_id}`;
}

module.exports.club_list = function club_list(page = 1, number = 20) {
    return `club/list?${getVerified()}&page=${page}&number=${number}`;
}

/**
 * danh sach cac clb ma user tham gia
 */
module.exports.club_list_join = function (page = 1, limit = 20) {
    return `club/list_by_user?${getVerified()}&limit=${limit}&page=${page}`
}

module.exports.club_search = function club_search(query, page = 1, number = 20) {
    return `club/search?${getVerified()}&query=${query}&page=${page}&number=${number}`;
}
module.exports.club_list_member = function club_list_member(club_id, page = 1, number = 100) {
    return `club/list_members?${getVerified()}&club_id=${club_id}&number=${number}&page=${page}`;
}

/**
 * Tìm kiếm toàn bộ user có trạng thái trong club
 */
module.exports.club_search_member = function club_search_member(club_id, query, page = 1, number = 20) {
    return `club/search_members?${getVerified()}&club_id=${club_id}&q=${query}&number=${number}&page=${page}`
}

/**
 * tìm kiếm thành viên để set tổng thư kí hoặc ban điều hành
 * type: 1: set quyen tong thu ky, 2: set quyen ban dieu hanh
 * 
 */
module.exports.club_search_member_set_permission = function club_search_member(club_id, type = 1, query, page = 1, number = 20) {
    return `club/search_member_to_set_permission?${getVerified()}&club_id=${club_id}&type=${type}&q=${query}&number=${number}&page=${page}`
}

module.exports.search_member_in_club = function search_member_in_club(club_id, query, page = 1, number = 20) {
    return `club/search_members_club?${getVerified()}&club_id=${club_id}&q=${query}&number=${number}&page=${page}`
}

module.exports.club_remove_member = function club_remove_member(user_id, club_id) {
    return `club/remove_user_from_club?${getVerified()}&user_id=${user_id}&club_id=${club_id}`;
}

module.exports.club_send_invite = function club_send_invite(puid, club_id) {
    return `club/invite_users?${getVerified()}&user_id=${puid}&club_id=${club_id}`;
}

module.exports.club_send_multi_invite = function club_send_invite(club_id) {
    return `club/invite_users?${getVerified()}&club_id=${club_id}`;
}

/**
 * set quyen quan tri vien
 * @param {*} club_id 
 * @param {*} puid 
 * @param {*} type 0: unset lam quan tri, 1: set lam quan tri
 */
module.exports.club_set_moderator = function club_set_moderator(club_id, puid, type = 0) {
    return `club/set_permission_user_moderator_club?${getVerified()}&club_id=${club_id}&puid=${puid}&type=${type}`;
}

module.exports.club_set_secretary = function club_set_secretary(club_id, puid, type = 0) {
    return `club/set_or_unset_permission_user_general_secretary_club?${getVerified()}&club_id=${club_id}&puid=${puid}&type=${type}`;
}

module.exports.set_permission = function set_permission() {
    return `club/set_permission?${getVerified()}`;
}

/**
 * huy lời mời hoặc từ chối lời mời vào club
 * @param {*} params 
 */
module.exports.club_deni_invite = function club_deni_invite(invitation_id) {
    return `club/denied_invitation?${getVerified()}&invitation_id=${invitation_id}`;
}

module.exports.club_check_permission = function club_check_permission(club_id) {
    return `club/view_user_relation?${getVerified()}&club_id=${club_id}`;
}

module.exports.club_accept_invitation = function club_accept_invitation(invitation_id) {
    return `club/accept_invitation?${getVerified()}&invitation_id=${invitation_id}`
}

module.exports.club_accept_upgrade_permission = function club_accept_upgrade_permission(club_id, type = 0) {
    return `club/user_accepted_permission_club?${getVerified()}&club_id=${club_id}&type=${type}`
}

module.exports.club_reject_upgrade_permission = function club_reject_upgrade_permission(club_id) {
    return `club/user_decline_invitation_permission_club?${getVerified()}&club_id=${club_id}`
}

module.exports.club_upload_logo = function () {
    return `image/upload/user_club?${getVerified()}`;
}


module.exports.club_update = function (club_id) {
    return `club/update?${getVerified()}&club_id=${club_id}`;
}

module.exports.club_upload_post = function () {
    return `image/upload/club_post?${getVerified()}&is_single=1`;
}

module.exports.club_upload_create = function () {
    return `image/upload/club_create?${getVerified()}&is_single=1`;
}

module.exports.club_create = function () {
    return `club/create_club_new?${getVerified()}`;
}

module.exports.tournament_create = function () {
    return `tournament/create?${getVerified()}`;
}

module.exports.tournament_view_details = function (tour_id) {
    return `tournament/view_details?${getVerified()}&tour_id=${tour_id}`;
}

module.exports.tournament_participate = function (tour_id) {
    return `tournament/user_join_tour?${getVerified()}&tour_id=${tour_id}`;
}

module.exports.tournament_upload_img_poster = function () {
    return `tournament/upload_img_poster?${getVerified()}`;
}

module.exports.tournament_upload_file_rule_tour = function () {
    return `tournament/upload_file_rule_tour?${getVerified()}`;
}

/**
 * API check xem user cos trong club do khong
 */
module.exports.club_info_chat = function(club_id){
    return `club/info_for_chat?${getVerified()}&club_id=${club_id}`;
}
//===========================END=======================//

//========================API LeaderBoard==============//
module.exports.leaderboard_list = function leaderboard_list(rank, page = 1, number = 20) {
    return `leaderboard/list_new?${getVerified()}&ranking_type=${rank}&page=${page}&number=${number}`;
}

module.exports.leaderboard_search = function leaderboard_search(query, ranking_type, page = 1, number = 20) {
    return `leaderboard/search?${getVerified()}&query=${query}&ranking_type=${ranking_type}&page=${page}&number=${number}`;
}

module.exports.leaderboard_top_usga_index = function () {
    return `leaderboard/get_leaderboard_top_usga_index?${getVerified()}`;
}

/**
 * Top ranking
 */
module.exports.leaderboard_top_ranking = function () {
    return `leaderboard/get_leaderboard_top_ranking_vhandicap?${getVerified()}`;
}
//===============================END===================//

/** GET */
module.exports.favorite_course = function recent() {
    return `facilities/recent?${getVerified()}&latitude=${UserInfo.getLatitude()}&longitude=${UserInfo.getLongitude()}`;
}

/** GET */
module.exports.around_course = function nearby() {
    return `facilities/nearby?${getVerified()}&latitude=${UserInfo.getLatitude()}&longitude=${UserInfo.getLongitude()}`;
}

//https://staging-api-s2.golfervn.com/api/v3/city/list_countries?uid=VGA3

/** GET List countries*/
module.exports.list_countries = function list_countries() {
    return `city/list_countries?${getVerified()}`;
}

/** GET List states*/
module.exports.list_states = function list_states(country_id) {
    return `city/list_states?${getVerified()}&country_id=${country_id}`;
}

/** GET */
module.exports.list_cities = function list_cities(country_id, state_id = null) {
    let url = `city/list_cities?${getVerified()}&country_id=${country_id}`;
    if (state_id) {
        url = url + `&state_id=${state_id}`;
    }
    return url;
}

/** GET */
module.exports.search_facility = function browse(country_id, state_id = '', city_id = null, q = '', page = 1, number = 15) {
    let url = `facilities/browse?${getVerified()}&q=${q}&page=${page}&number=${number}`;
    if (country_id) {
        url = url + `&country_id=${country_id}`;
    }
    if (state_id) {
        url = url + `&state_id=${state_id}`;
    }
    if (city_id) {
        url = url + `&city_id=${city_id}`;
    }
    return url;
}

//=================================API USER================================//
module.exports.user_profile = function profile(puid = null) {
    if (puid) {
        return `users/profile?${getVerified()}&puid=${puid}`;
    } else {
        return `users/profile?${getVerified()}&puid=${UserInfo.getId()}`;
    }
}

module.exports.user_achievement = function () {
    return `users/get_achievement_by_day?${getVerified()}`;
}

module.exports.user_performance = function (facility_id) {
    return `users/get_performance?${getVerified()}&facility_id=${facility_id}`;
}

/**
 * API add id của user khi add vs firebase
 * @param {*} fuid 
 */
module.exports.user_add_fuid = function () {
    return `users/add_firebase?${getVerified()}`;
}

/**
 * Lấy thông tin user để lấy màn hình chát
 * @param {*} page 
 * @param {*} number 
 */
module.exports.get_info_chat_user = function (page = 1, number = 20) {
    return `users/get_info_chat_user?${getVerified()}&page=${page}&number=${number}`;
}

/**
 * Upload profile
 */
module.exports.user_upload_profile = function () {
    return `users/upload_avatar?${getVerified()}`;
}

module.exports.user_search = function user_search(query, page = 1, number = 20, event_id = null) {
    let url = `users/search?page=${page}&number=${number}&username=${query}&uid=${UserInfo.getId()}&token=${UserInfo.getUserToken()}`;
    if (event_id) {
        url = url + `&event_id=${event_id}`;
    }
    return url;
}

module.exports.user_search_all = function (q = '') {
    return `users/search_all?${getVerified()}&q=${q}`;
}

module.exports.user_filter_search_all = function (q = '', type = 1, page = 1) {
    return `users/filter_search_all?${getVerified()}&q=${q}&type=${type}&page=${page}&number=10`;
}

module.exports.user_characteristics_list = function () {
    return `users/characteristics/list?${getVerified()}`;
}

module.exports.user_characteristics_update = function () {
    return `users/characteristics/update?${getVerified()}`;
}

module.exports.user_extra_fields = function () {
    return `users/extra_fields?${getVerified()}`;
}

module.exports.user_update_profile = function user_update_profile() {
    return `users/update_profile?${getVerified()}`;
}

module.exports.user_info_equipment = function (puid) {
    return puid ? `users/info_equipment?${getVerified()}&puid=${puid}` : `users/info_equipment?${getVerified()}`;
}

module.exports.user_get_list_equipment = function (page = 1, number = 20) {
    return `users/get_list_equipment?${getVerified()}&page=${page}&number=${number}`;
}

module.exports.user_update_info_equipment = function () {
    return `users/update_info_equipment?${getVerified()}`;
}

module.exports.user_logout = function () {
    return `users/logout?${getVerified()}`;
}

module.exports.user_login = function (phone, password) {
    return `users/login?phone=${phone}&password=${password}&lang=${UserInfo.getLang()}`;
    // return `users/login_old?phone=${phone}&password=${password}&lang=${UserInfo.getLang()}`;
}

module.exports.user_login_token = function () {
    return `users/login_firebase`;
}

module.exports.update_info_after_register = function (uid = '', is_pro_player = 0, gender = 0, fullName = '') {
    return `users/update_info_after_register?uid=${uid}&is_pro_player=${is_pro_player}&gender=${gender}&fullname=${fullName}`;
}

module.exports.user_register = function () {
    return `register/register`;
}

module.exports.user_recovery_password = function () {
    return `users/recovery_password`;
}

module.exports.get_sms_code = function (phone) {
    return `register/get_sms_code?phone=${phone}`;
}

module.exports.check_phone_number = function (phone, code) {
    return `users/check_phone_number?phone=${phone}&phone_code=${code}`;
}

module.exports.get_sms_code_password_recovery = function (phone, recovery = true) {
    return `users/get_sms_code_password_recovery?phone=${phone}&recovery=${recovery}`;
}


module.exports.user_get_list_friend_by_uid = function (number) {
    return `users/get_list_friend_by_uid?${getVerified()}&number=${number}`;
}

module.exports.verify_code = function (phone, code, none) {
    return `register/verify_code?phone=${phone}&code=${code}&none=${none}`;
}

/**
 * API goi len khi user xem 1 tin tuc
 * @method GET
 * @param {*} magazine_id 
 */
module.exports.user_readed_news = function (magazine_id) {
    return `users/view_magazine?${getVerified()}&magazine_id=${magazine_id}`
}

/**
 * Thay đổi cài đặt thông báo trận đánh của user
 * @param {*} type - trang thái 1 - tắt,0 - bật
 * @method GET
 */
module.exports.change_setting_notice_flight = function (type = 0) {
    return `users/change_setting_notif_flight?${getVerified()}&type=${type}`
}

/**
 * Thay đổi cài đặt thông báo trận đánh của bạn bè
 * @param {*} type trạng thái 1 - tắt,0-bật
 * @method GET
 */
module.exports.change_setting_noitice_flight_friend = function (type = 0) {
    return `users/change_setting_notif_flight_friend?${getVerified()}&type=${type}`;
}

/**
 * Thay đổi cài đặt trạng thái thông báo từ thảo luận
 * @param {number} type trạng thái 1 - tắt,0 - bật
 */
module.exports.change_setting_notice_from_comment = function (type) {
    return `users/change_setting_notif_comment?${getVerified()}&type=${type}`;
}

/**
 * Thay đổi cài đặt ẩn trận đánh vs tất cả mọi người
 * @param {number} type trạng thái 1 là ẩn,0 là hiện
 * @method GET
 */
module.exports.change_setting_hide_flight_all_user = function (type) {
    return `users/change_setting_flight_all?${getVerified()}&type=${type}`;
}

module.exports.get_history_handicap = function get_history_handicap() {
    return `users/get_history_handicap?${getVerified()}`;
}
//===================================END===================================//

/** GET list path*/
module.exports.list_paths = function list_paths(facility_id) {
    return `facilities/list_paths?${getVerified()}&facility_id=${facility_id}`;
}
//==================================API FRiEND=============================//
module.exports.friend_send_request = function send_request(uid2) {
    return `friends/request?${getVerified()}&uid2=${uid2}`;
}

module.exports.friend_denied = function friend_denid(uid2) {
    return `friends/denied?${getVerified()}&uid2=${uid2}`;
}

/**
 * Đồng ý lời mời kết bạn của user uid2
 * @param {*} uid2 
 */
module.exports.friend_accept = function (uid2) {
    return `friends/accept?${getVerified()}&uid2=${uid2}`;
}

module.exports.friend_add = function (puid) {
    return `friends/request?${getVerified()}&uid2=${puid}`;
}

module.exports.friend_remove = function (puid) {
    return `friends/delete?${getVerified()}&uid2=${puid}`;
}

module.exports.friend_search = function friend_search(q, page = 1, number = 20) {
    return `friends/list_search?${getVerified()}&page=${page}&number=${number}&q=${q}`;
}

module.exports.friend_list_notify = function (page = 1, number = 20) {
    return `notification/friend_list?${getVerified()}&page=${page}&number=${number}`;
}

module.exports.get_list_friends_suggest = function () {
    return `users/get_list_friends_suggest?${getVerified()}`;
}

/**
 * lay danh sach ban be
 */
module.exports.friend_list = function (page = 1, is_full = 1, number = 20) {
    return `friends/list?${getVerified()}&is_full=${is_full}&page=${page}&number=${number}`
}

/**
 * lấy danh sách lời mời kết bạn
 * @param {*} page 
 * @param {*} number 
 */
module.exports.friend_list_request = function (page = 1, number = 20) {
    return `friends/list_request?${getVerified()}&page=${page}&number=${number}`;
}
//=====================================END=================================//

//==================================CREATE FLIGHT=============================//
module.exports.create_flight = function create_flight(suggest, type = 1) {
    return `flight/create?uid=${UserInfo.getId()}&token=${UserInfo.getUserToken()}&suggest=${suggest}&type=${type}`;
}


module.exports.flight_update = function flight_update(flight_id, type = 1) {
    return `flight/update?${getVerified()}&flight_id=${flight_id}&type=${type}`;
}

module.exports.view_flight_detail = function view_flight_detail(flight_id) {
    return `flight/view_flight_detail?${getVerified()}&flight_id=${flight_id}`;
}

module.exports.enter_scoring = function enter_scoring(flight_id, is_edit = 0) {
    return `flight/enter_scoring?${getVerified()}&flight_id=${flight_id}&is_edit=${is_edit}`;
}

module.exports.out_flight = function out_flight(flight_id) {
    return `flight/out_flight?${getVerified()}&flight_id=${flight_id}`;
}

module.exports.upload_scorecard = function upload_scorecard(flight_id) {
    return `flight/upload_scorecard_image?${getVerified()}&flight_id=${flight_id}&is_single=1`;
}

module.exports.create_flight_by_image = function create_flight_by_image(facility_id = '') {
    return `flight/create_by_upload_scorecard?${getVerified()}&facility_id=${facility_id}&is_single=1`;
}

module.exports.submit_scorecard = function submit_scorecard(flight_id) {
    return `flight/submit_scorecard?${getVerified()}&flight_id=${flight_id}`;
}

module.exports.verify_scorecard = function verify_scorecard(flight_id, puid) {
    return `flight/confirmed_accept_scorecard?${getVerified()}&flight_id=${flight_id}&puid=${puid}`;
}

module.exports.verify_scorecard_all = function verify_scorecard(flight_id) {
    return `flight/confirmed_accept_scorecard_all?${getVerified()}&flight_id=${flight_id}`;
}

module.exports.rejected_scorecard = function rejected_scorecard(flight_id, puid) {
    return `flight/confirmed_rejected_scorecard?${getVerified()}&flight_id=${flight_id}&puid=${puid}`;
}

module.exports.merge_flight = function merge_flight(flight_id) {
    return `flight/merge?${getVerified()}&flight_id=${flight_id}`;
}

module.exports.friends_recent = function friends_recent() {
    return `friends/recent?${getVerified()}`;
}

module.exports.like_flight = function like_flight(flight_id, status = 1) {
    return `flight/like_flight?${getVerified()}&flight_id=${flight_id}&is_like=${status}`;
}


module.exports.get_course_by_path = function like_flight(facility_id, path_id1, path_id2, path_id3) {
    return `facilities/get_course_by_path?${getVerified()}&facility_id=${facility_id}&path_id1=${path_id1}&path_id2=${path_id2}&path_id3=${path_id3}`;
}
//=====================================END=================================//


//==================================List friend flight=============================//
module.exports.list_friends_flight = function list_friends_flight(page = 1, number = 10) {
    return `flight/list_friends_flight?${getVerified()}&page=${page}&number=${number}`;
}

module.exports.list_friends_flight_for_cache = function list_friends_flight_for_cache(id_flight_start, isNew = true, page = 1) {
    return `flight/list_friends_flight_for_cache?${getVerified()}&id_flight_start=${id_flight_start}&type=${isNew ? 1 : 2}&page=${page}&number=10`;
}

module.exports.history_flight = function (page = 1, puid = null, number = 20) {
    puid = puid ? puid : UserInfo.getId();
    return `rounds/user_history?${getVerified()}&user_id=${puid}&page=${page}&number=${number}`;
}
//=====================================END=================================//

//===================================API Block===============================//
module.exports.block_add = function block_add(user_id) {
    return `users/block/add?${getVerified()}&user_id=${user_id}`;
}

module.exports.block_remove = function block_remove(user_id) {
    return `users/block/remove?${getVerified()}&user_id=${user_id}`;
}

module.exports.block_list = function block_list(page = 1, number = 20) {
    return `users/block/list?${getVerified()}&page=${page}&number=${number}`;
}

/**
 * lay tong so nguoi da chan
 */
module.exports.block_count = function () {
    return `users/block/count?${getVerified()}`;
}

module.exports.default_setting = function () {
    return `users/default_setting_values?${getVerified()}`;
}
//======================================END=================================//

//=============================Up load anh=================================//
module.exports.upload_image = function () {
    return `image/upload?${getVerified()}`;
}
//=================================END=====================================//

//===============================HANDICAP==================================//
module.exports.ehandicap_club = function () {
    return `club?${getVerified()}`;
}

module.exports.ehandicap_member_search = function (club_id, name) {
    return `ehandicap/member_search?${getVerified()}&club_id=${club_id}&name=${name}`;
}

module.exports.ehandicap_import = function (club_id, member_id) {
    return `rounds/import?${getVerified()}&club=${club_id}&member_id=${member_id}`;
}
//=================================END====================================//

//==================================NEWS==================================//
module.exports.news_list = function (page = 1, number = 15) {
    return `magazine/list?${getVerified()}&page=${page}&number=${number}`;
}

module.exports.news_list_for_cache = function (id_magazine_start = 0, isNew = true) {
    return `magazine/list_for_cache?${getVerified()}&id_magazine_start=${id_magazine_start}&type=${isNew ? 1 : 2}`;
}

module.exports.news_detail = function (news_id) {
    return `magazine/view_detail?${getVerified()}&magazine_id=${news_id}`;
}
//==================================END==================================//

//==================================Thong ke=============================//
module.exports.statistical_list_nearby = function (mode) {
    return `statistical/list_nearby?${getVerified()}&mode=${mode}`;
}

module.exports.statistical_list_other_user = function (puid) {
    return `statistical/list_nearby?${getVerified()}&mode=10&puid=${puid}`;
}

module.exports.statistical_list_year = function () {
    return `statistical/list_year?${getVerified()}`;
}
//=====================================END===============================//

//======================================CERTIFICATE=============================//
module.exports.certificate_list = function () {
    return `rounds/user_certificate?${getVerified()}`;
}

module.exports.user_update_certificate = function () {
    return `rounds/user_update_certificate?${getVerified()}`;
}

/**
 * Lấy certificate của người chơi khác
 * @param {*} puid 
 */
module.exports.certificate_user_other_list = function (puid) {
    return `rounds/user_certificate?${getVerified()}&puid=${puid}`;
}

/**
 * Upload anh certificate để share cho bạn bè
 */
module.exports.certificate_upload_share = function () {
    return `image/upload/certificate_share?${getVerified()}`;
}

module.exports.upload_avatar_certificate = function () {
    return `image/upload/avatar_certificate?${getVerified()}`;
}
//========================================END===================================//

//===================================NOTIFICATION===============================//
module.exports.notification_list = function (page = 1, number = 20) {
    return `notification/notification_list?${getVerified()}&page=${page}&number=${number}`;
}

module.exports.notification_list_for_cache = function (id_notification_start = 0, isNew = true) {
    return `notification/notification_list_for_cache?${getVerified()}&id_notification_start=${id_notification_start}&type=${isNew ? 1 : 2}`;
}

module.exports.notification_count = function () {
    return `notification/counting?${getVerified()}`;
}

module.exports.notification_delete = function (id) {
    return `notification/notification_delete?${getVerified()}&id=${id}`
}

module.exports.notification_read = function (notification_id) {
    return `notification/view_notification?${getVerified()}&id_notification=${notification_id}`;
}

/**
 * filter notification theo type
 */
module.exports.notification_filter = function (type, page = 1, number = 20) {
    return `notification/fliter_noti?${getVerified()}&page=${page}&type=${type}&number=${number}`;
}

module.exports.notification_view_all = function () {
    return `notification/view_all_notification?${getVerified()}`;
}
//======================================END====================================//

//=====================================EVENT===================================//
module.exports.club_event_list = function (page = 1, club_id) {
    if (club_id) {
        return `event_club/list_events?${getVerified()}&number=20&page=${page}&club_id=${club_id}`;
    }
    return `event_club/list_events?${getVerified()}&number=20&page=${page}`;
}

module.exports.club_traditional_list = function (club_id, page = 1) {
    return `club/get_traditional_club?${getVerified()}&club_id=${club_id}&number=20&page=${page}`;
}

module.exports.club_traditional_image_list = function (club_id, page = 1) {
    return `event_club/get_list_img_by_event_club?${getVerified()}&event_club_id=${club_id}&number=20&page=${page}`;
}

module.exports.upload_traditional_image = function (club_id) {
    return `status/user_add_img_status_event_club?${getVerified()}&event_club_id=${club_id}&is_single=1`;
}

module.exports.get_appointment_list = function (page = 1) {
    return `event/list?${getVerified()}&number=20&page=${page}`;
}

module.exports.event_upload_share = function () {
    return `image/upload/event_share?${getVerified()}`;
}

module.exports.event_list = function (page = 1, number = 15) {
    return `event/list?${getVerified()}&page=${page}&number=${number}`
}

module.exports.event_create = function () {
    return `event/create?${getVerified()}`;
}
module.exports.event_list_members = function (event_id, page = 1, number = 100) {
    return `event/list_members?${getVerified()}&event_id=${event_id}&page=${page}&number=${number}`;
}

module.exports.appointment_block_unlock_flight = function appointment_block_unlock_flight(event_id, flight_event_id, is_block = 0) {
    return `event/block_or_unlock_flight?${getVerified()}&event_id=${event_id}&flight_event_id=${flight_event_id}&is_block=${is_block}`;
}

module.exports.event_new_create = function () {
    return `event_club/create?${getVerified()}`;
}

module.exports.get_event_info_details = function (event_id = '') {
    return `event_club/view_details?${getVerified()}&event_id=${event_id}`;
}

module.exports.event_member_list_flight = function (page = 1) {
    return `event_club/list_flight_by_event?${getVerified()}&page=${page}`;
}

module.exports.event_club_participate = function (event_id = '') {
    return `event_club/add_member?${getVerified()}&event_id=${event_id}`;
}

module.exports.player_leave_event = function (event_id = '') {
    return `event_club/leave_events?${getVerified()}&event_id=${event_id}`;
}

module.exports.event_club_update = function () {
    return `event_club/update?${getVerified()}`;
}

module.exports.event_club_delete = function () {
    return `event_club/remove_events?${getVerified()}`;
}

module.exports.event_club_swap_player = function () {
    return `event_club/update_flight?${getVerified()}`;
}

module.exports.event_club_random_flight = function (event_id, type) {
    return `event_club/random_flight?${getVerified()}&event_id=${event_id}&type=${type}`;
}

module.exports.change_max_member = function (event_id, flight_event_id, max_member) {
    return `event_club/change_max_member?${getVerified()}&event_id=${event_id}&flight_event_id=${flight_event_id}&max_member=${max_member}`;
}

module.exports.list_flight_event_by_id_flight_start = function (id_flight_start) {
    return `event_club/list_flight_event_by_id_flight_start?${getVerified()}&id_flight_start=${id_flight_start}`;
}

module.exports.event_block_unlock_flight = function event_block_unlock_flight(event_id, flight_event_id, is_block = 0) {
    return `event_club/block_or_unlock_flight?${getVerified()}&event_club_id=${event_id}&flight_event_id=${flight_event_id}&is_block=${is_block}`;
}

/**
 * Cập nhật event POST
 */
module.exports.event_update = function () {
    return `event/update?${getVerified()}`;
}

module.exports.event_send_invite_to_club = function (event_id, club_id) {
    return `event/send_invite_to_club?${getVerified()}&event_id=${event_id}&club_id=${club_id}`;
}

module.exports.event_send_invite_to_group = function (event_id, group_id) {
    return `event/send_invite_to_group?${getVerified()}&event_id=${event_id}&group_id=${group_id}`;
}

module.exports.get_appointment_detail = function (event_id = '') {
    return `event/view_detail?${getVerified()}&event_id=${event_id}`;
}

module.exports.get_list_flight_by_event = function (page = 1) {
    return `event/get_list_flight_by_event?${getVerified()}&page=${page}`;
}

module.exports.get_list_flight_event_by_id_flight_start = function (id_flight_start, page = 1) {
    return `event/get_list_flight_event_by_id_flight_start?${getVerified()}&id_flight_start=${id_flight_start}&page=${page}`;
}

module.exports.delete_appointment = function (event_id) {
    return `event/delete?${getVerified()}&event_id=${event_id}`;
}

module.exports.random_flight_appointment = function (event_id, type = 1) {
    return `event/random_flight?${getVerified()}&event_id=${event_id}&type=${type}`;
}

module.exports.change_max_member_appointment = function (event_id, flight_event_id, max_member = 4) {
    return `event/change_max_member?${getVerified()}&event_id=${event_id}&flight_event_id=${flight_event_id}&max_member=${max_member}`;
}

module.exports.swap_player_appointment = function () {
    return `event/update_flight?${getVerified()}`;
}

module.exports.member_cancel_invitation_appointment = function (event_id) {
    return `event/member_cancel_invitation?${getVerified()}&event_id=${event_id}`;
}

module.exports.member_accept_invitation_appointment = function (event_id) {
    return `event/member_accept_invitation?${getVerified()}&event_id=${event_id}`;
}

/**
 * Lay dnah sach group de send invite
 */
module.exports.event_list_group = function (event_id, page = 1, number = 20) {
    return `event/list_group?${getVerified()}&page=${page}&number=${number}&event_id=${number}`;
}

/**
 * Lấy danh sách club để send invite
 */
module.exports.event_list_club = function (event_id, page = 1, number = 20) {
    return `event/list_club?${getVerified()}&page=${page}&number=${number}&event_id=${event_id}`;
}

/**
 * Đồng ý tham ra event
 * @param {*} event_id 
 */
module.exports.event_member_accept_invitation = function (event_id) {
    return `event/member_accept_invitation?${getVerified()}&event_id=${event_id}`;
}

/**
 * Tu chối tham gia event
 * @param {*} event_id 
 */
module.exports.event_member_cancel_event = function (event_id) {
    return `event/member_cancel_invitation?${getVerified()}&event_id=${event_id}`;
}

/**
 * Xoa event
 * @param {*} event_id 
 */
module.exports.event_delete = function (event_id) {
    return `event/delete?${getVerified()}&event_id=${event_id}`;
}

module.exports.event_remove_member = function (event_id, puid) {
    return `event/delete_member_event?${getVerified()}&event_id=${event_id}&puid=${puid}`;
}

module.exports.event_add_member = function (event_id, puid) {
    return `event/add_member_event?${getVerified()}&event_id=${event_id}&puid=${puid}`;
}
/**
 * Lay thong tin chi tiet cua event
 * @param {*} event_id 
 */
module.exports.event_detail = function (event_id) {
    return `event/view_detail?${getVerified()}&event_id=${event_id}`
}
//=====================================END=====================================//

//======================================REPORT SAN=============================//
module.exports.report_facility_create = function (facility_id) {
    return `facility_report/create?${getVerified()}&facility_id=${facility_id}`;
}

/**
 * Bao co san moi
 * @param {*} longitude 
 * @param {*} latitude 
 */
module.exports.report_facility_new = function (longitude, latitude) {
    return `facility_report/new?${getVerified()}&longitude=${longitude}&latitude=${latitude}`;
}

module.exports.report_facility_new_update = function (longitude, latitude, id_facility_report_new) {
    return `facility_report/update_facility_new_report?${getVerified()}&longitude=${longitude}&latitude=${latitude}&id_facility_report_new=${id_facility_report_new}`;
}
//=========================================END=================================//

//======================================UPLOAD IMAGE=============================//
module.exports.upload_to_share_scorecard = function () {
    return `image/upload/share_scorecard?${getVerified()}`;
}
//=========================================END=================================//

//======================================CAPTCHA=============================//
module.exports.get_captcha = function () {
    return `captcha?${getVerified()}`;
}

module.exports.get_captcha_auth = function (keydata = '') {
    return `users/get_captcha_firebase?keydata=${keydata}`;
}

module.exports.verify_captcha = function (puid = '', capstr = '', keydata = '') {
    return `verified?${getVerified()}&act=profile&keydata=${keydata}&capstr=${capstr}&puid=${puid}`;
}

module.exports.verify_captcha_auth = function (capstr = '', keydata = '', phone = '') {
    return `users/verify_captcha_firebase?&keydata=${keydata}&capstr=${capstr}&phone=${phone}`;
}
//=========================================END=================================//

//===============================LUAT GOLF VA DIEU KHOAN=======================//
module.exports.term_list = function (group_id, page = 1, number = 20) {
    return `terms/list?${getVerified()}&page=${page}&number=${number}&group_id=${group_id}`;
}

/**
 * lay danh sach cac nhom luat va dieu khoan
 */
module.exports.term_group_list = function () {
    return `terms/list_group?${getVerified()}`;
}
//=========================================END=================================//
module.exports.push_register = function (token_device) {
    return `push/register?${getVerified()}&token_device=${token_device}`;
}

//===================================REPORT USER================================//
/**
 * Danh sách các người chơi hay chơi cùng
 */
module.exports.list_play_with = function () {
    return `users/list_most_play_with?${getVerified()}`;
}

/**
 * Lấy điểm handicap dự kiến
 */
module.exports.get_handicap_index_expected = function () {
    return `users/usga_hc_index_expected?${getVerified()}`;
}

module.exports.get_list_img_upload_flight = function () {
    return `users/get_list_img_upload_flight?${getVerified()}`;
}

module.exports.get_all_img_upload_flight = function (page = 1) {
    return `users/get_all_img_upload_flight?${getVerified()}&number=20&page=${page}`;
}

/**
 * Danh sach cac ly do de report
 */
module.exports.list_reason = function () {
    return `user_report/list_reason?${getVerified()}`;
}

module.exports.report_create = function () {
    return `user_report/create?${getVerified()}`;
}
//=======================================END====================================//
/**
 * update ngon ngu
 */
module.exports.change_language = function () {
    return `language/change?${getVerified()}`;
}

//=======================================END====================================//
/**
 * get weather info
 */
module.exports.get_weather_info = function (facility_id = '', time = '') {
    return `facilities/weather?${getVerified()}&facility_id=${facility_id}&time=${time}`;
}

/**
 * lay 10 tran tot nhat
 */
module.exports.list_best_round = function () {
    return `rounds/list_betnet_rounds?${getVerified()}`;
}

//=======================================SOCIAL====================================//
/**
 * 
 * @param {*} id_stt  id của status đó
 * @param {*} type_feel cảm xúc của user đối với status: 1: thích, 2: love, 3: unlike
 * @param {*} type kiểu status: 1: flight 2: eventclub 3: postclub 4: postpublic
 */
module.exports.like_status = function (id_stt = '', type_feel = 0, type = 1) {
    return `status/add_feel?${getVerified()}&id_stt=${id_stt}&type=${type}&type_feel=${type_feel}`;
}

module.exports.get_interactive_info = function (id_stt = '', type = 1) {
    return `status/get_info?${getVerified()}&id_stt=${id_stt}&type=${type}`;
}

module.exports.view_detail_status_for_flight = function (id_stt = '', type = 1) {
    return `status/view_detail_status_for_flight?${getVerified()}&flight_id=${id_stt}&type=${type}`;
}

module.exports.user_add_img_status_flight = function (flight_id = '') {
    return `status/user_add_img_status_flight?${getVerified()}&flight_id=${flight_id}&is_single=1`;
}

/////////////////////////////
module.exports.get_club_info = function (club_id = '') {
    return `club/info?${getVerified()}&club_id=${club_id}`;
}

module.exports.get_post_by_topic = function (club_id = '', topic_id, page = 1) {
    return `club/list_post_by_topic?${getVerified()}&club_id=${club_id}&number=10&topic_id=${topic_id}&page=${page}`;
}

module.exports.get_all_post = function (page = 1) {
    return `club/list_all_post?${getVerified()}&number=10&page=${page}`;
}

module.exports.create_post_topic = function () {
    return `club/create_new_post_topic?${getVerified()}`;
}

module.exports.remove_post_club = function () {
    return `club/remove_post?${getVerified()}`;
}

module.exports.update_post_club = function () {
    return `club/update_post?${getVerified()}`;
}

module.exports.get_all_post_by_topic = function (club_id = '', page = 1) {
    return `club/list_all_post_by_club?${getVerified()}&club_id=${club_id}&number=10&page=${page}`;
}

module.exports.club_list_member_new = function club_list_member_new(club_id, page = 1, number = 10) {
    return `club/list_members_new?${getVerified()}&club_id=${club_id}&number=${number}&page=${page}`;
}

module.exports.club_upload_img_background = function club_upload_img_background(club_id) {
    return `club/upload_img_background?${getVerified()}&club_id=${club_id}`;
}

module.exports.admin_club_list_member = function admin_club_list_member(club_id) {
    return `club/list_member_for_manager_club?${getVerified()}&club_id=${club_id}`;
}

module.exports.list_member_club_with_star = function list_member_club_with_star(club_id, page = 1, number = 20) {
    return `club/list_member_club_with_star?${getVerified()}&club_id=${club_id}&page=${page}&number=${number}`;
}

module.exports.club_list_member_birthday_in_month = function club_list_member_birthday_in_month(club_id, page = 1, number = 20) {
    return `club/list_member_birthday_in_month?${getVerified()}&club_id=${club_id}&page=${page}&number=${number}`;
}

module.exports.club_list_member_birthday_next_by_month = function club_list_member_birthday_next_by_month(club_id, month = 1) {
    return `club/list_member_birthday_next_by_month?${getVerified()}&club_id=${club_id}&month=${month}`;
}

module.exports.list_member_club_by_expried_date = function list_member_club_by_expried_date(club_id, type = 1, page = 1, number = 20) {
    return `club/list_member_club_by_expried_date?${getVerified()}&club_id=${club_id}&type=${type}&page=${page}&number=${number}`;
}

module.exports.club_get_course_handicap = function club_get_course_handicap(club_id, page = 1, number = 20) {
    return `club/get_course_handicap?${getVerified()}&club_id=${club_id}&number=${number}&page=${page}`;
}

module.exports.club_get_course_handicap_by_club_id_with_page = function club_get_course_handicap_by_club_id_with_page(club_id, page = 1, number = 20) {
    return `club/get_course_handicap_by_club_id_with_page?${getVerified()}&club_id=${club_id}&number=${number}&page=${page}`;
}

module.exports.club_update_expried_time = function club_update_expried_time() {
    return `club/update_expried_time?${getVerified()}`;
}

module.exports.club_get_top_manner_club = function club_get_top_manner_club(club_id, page = 1, number = 20) {
    return `club/get_top_manner_club?${getVerified()}&club_id=${club_id}&number=${number}&page=${page}`;
}

module.exports.update_info_club = function update_info_club(club_id) {
    return `club/update_info_club?${getVerified()}&club_id=${club_id}`;
}

module.exports.upload_logo_club = function upload_logo_club(club_id) {
    return `club/upload_logo_club?${getVerified()}&club_id=${club_id}`;
}
/////////////////////////////

module.exports.get_public_post = function (page = 1) {
    return `post_public/list_all_post?${getVerified()}&number=10&page=${page}`;
}

module.exports.create_public_post = function () {
    return `post_public/create?${getVerified()}`;
}

module.exports.remove_public_post = function () {
    return `post_public/remove_post?${getVerified()}`;
}

module.exports.update_public_post = function () {
    return `post_public/update?${getVerified()}`;
}

//==================================API CHAT=======================================//
/**
 * Điều khiển bật/tắt chức năng chát
 */
module.exports.setting_open_chat = function(){
    return `users/setting_open_chat?${getVerified()}`;
}

/**
 * lay thong tin xem co goi dc cho user puid khong
 */
module.exports.call_to_user = function(puid){
    return `users/call_with_puid?${getVerified()}&puid=${puid}`;
}

// module.exports.setting_call_user = function(puid){
//     return `users/setting_open_call?${getVerified()}&=3`
// }

/**
 * tao nhom chat
 * @method POST
 * @body {"uid":"vga3","list_user":["VGA28","VGA4073","VGA2726","VGA135","VGA452"]}
 */
module.exports.group_chat_create = function () {
    return `group_chat/create?${getVerified()}`;
}

/**
 * Them vao danh sach lich su chat
 * @param {*} uid2 group_id,club_id,user_id
 * @param {*} type 1 la chat group,2 la chat user
 */
module.exports.group_chat_add_history = function (uid2, type) {
    let date = new Date();
    let timestamp = date.getTime();
    timestamp = parseInt(timestamp / 1000);
    return `group_chat/add_history_chat_user?${getVerified()}&uid2=${uid2}&type=${type}&time=${timestamp}`;
}

/**
 * lay lich su chat
 * @param {*} page 
 * @param {*} number 
 * @method GET
 */
module.exports.group_chat_recent = function (page = 1, number = 10) {
    return `group_chat/list_chat_recent?${getVerified()}&page=${page}&numper=${number}`;
}


/**
 * Xoa nhom chat
 * @method POST
 * @BODY {"uid" :"VGA4","group_chat_id" : 285}
 */
module.exports.group_chat_delete = function () {
    return `group_chat/delete?${getVerified()}`;
}

module.exports.group_chat_search = function (query, page = 1, number = 20) {
    return `group_chat/search?${getVerified()}&page=${page}&number=${number}&query=${query}`;
}

module.exports.group_chat_total_member = function (group_chat_id) {
    return `group_chat/get_total_member?${getVerified()}&group_chat_id=${group_chat_id}`;
}

/**
 * Thêm thành viên vào nhóm chat
 * @method POST
 * @BODY 
 * {
	"group_chat_id" :3,
	"list_user" : [4114,5005]
 * }
 */
module.exports.group_chat_add_member = function () {
    return `group_chat/add_member?${getVerified()}`;
}

/**
 * Tìm kiểm user để thêm vào nhóm chát
 */
module.exports.group_chat_search_user = function (group_chat_id, q = '', page = 1, number = 20) {
    return `group_chat/search_to_add_group_chat?${getVerified()}&group_chat_id=${group_chat_id}&page=${page}&number=${number}&q=${q}`;
}

/**
 * Thay đổi tên nhóm chát,avatar...
 * @method POST
 * @body 
 * {
	"group_chat_id" : 268,
	"name" : "Change Name Group 268"
 * }
 */
module.exports.group_chat_edit = function () {
    return `group_chat/rename?${getVerified()}`;
}

/**
 * Lấy danh sách user trong nhóm chát
 */
module.exports.group_chat_list_member = function (group_chat_id, page = 1, number = 20) {
    return `group_chat/list_member?${getVerified()}&group_chat_id=${group_chat_id}&page=${page}&number=${number}`;
}

/**
 * Xóa thành viên khỏi nhóm chát
 * @method POST
 * @body
 * {
	"group_chat_id" : 3,
	"list_user_remove" : [5,4,4114]
 * }
*/
module.exports.group_chat_remove_member = function () {
    return `group_chat/remove_member?${getVerified()}`;
}

module.exports.group_chat_leave = function (group_chat_id) {
    return `group_chat/leave_group_chat?${getVerified()}&group_chat_id=${group_chat_id}`;
}
//======================================END========================================//

//=================================API COMMENT=====================================//
/**
 * Post so comment len sv
 * @param {*} id_topic id chu de vi du flight_id
 * @param {*} type_topic loai chu de 
 * type['flight','eventclub','postclub']
 * @method GET
 */
module.exports.post_total_comment = function (id_topic, type_topic) {
    return `status/add_comment?${getVerified()}&id_stt=${id_topic}&type=${type_topic}`;
}
//======================================END========================================//

//===================================API AWARD=====================================//
/**
 * top 20 nguoi co diem gross tot nhat
 * @method GET
 */
module.exports.top_best_gross = function (page = 1, number = 20) {
    return `topawards/best_gross?${getVerified()}&page=${page}&number=${number}`;
}

/**
 * top 20 nguoi co diem net tot nhat
 * @method GET
 */
module.exports.top_best_net = function (page = 1, number = 20) {
    return `topawards/best_net?${getVerified()}&page=${page}&number=${number}`;
}

module.exports.ranking_club_vhandicap = function (page = 1, number = 20) {
    return `topawards/ranking_club_vhandicap?${getVerified()}&page=${page}&number=${number}`;
}


module.exports.search_awards = function (type, query, page = 1, number = 20) {
    return `topawards/search_awards?${getVerified()}&type=${type}&query=${query}&page=${page}&number=${number}`;
}

/**
 * Bảng xếp hạng phong độ golfer
 * @method GET
 */
module.exports.top_ranking_golfer = function (page = 1, number = 20) {
    return `leaderboard/get_leaderboard_top_manners_vhandicap?${getVerified()}&page=${page}&number=${number}`;
}
//========================================END======================================//

//+++++++++++++++++++++++++++Chart - Bieu do thong ke++++++++++++++++++++++++++++++//
/**
 * Thống kê trận đánh
 * @method GET
 */
module.exports.user_chart = function (_puid = null) {
    return _puid ? `users/get_history?${getVerified()}&puid=${_puid}` : `users/get_history?${getVerified()}`;
}
//+++++++++++++++++++++++++++++++++++++++END+++++++++++++++++++++++++++++++++++++++//

module.exports.get_achievement = function (puid) {
    return `users/get_achievement?${getVerified()}&puid=${puid}`;
}

//++++++++++++++++++++++++++++++++++++COMMENT++++++++++++++++++++++++++++++++++++//
/**
 * upload anh trong chuc nang comment
 */
module.exports.comment_upload = function () {
    return `image/upload/comment?${getVerified()}`;
}
//+++++++++++++++++++++++++++++++++++++END+++++++++++++++++++++++++++++++++++++++//

//===================================REVIEW FACILITY=============================//
/**
 * Lấy thông tin review sân
 * @method GET
 */
module.exports.facility_review_info = function (facility_id) {
    return `facility_review/view_details?${getVerified()}&facility_id=${facility_id}`
}

/**
 * Gửi đánh giá sân
 * @method POST
 * @body {facility_id,rate,review}
 */
module.exports.facility_rate = function () {
    return `facility_review/add_rate?${getVerified()}`;
}

module.exports.facility_review_focus = function () {
    return `facility_review/index?${getVerified()}`;
}

module.exports.search_facility_review = function (query) {
    return `facility_review/search_facility_review?${getVerified()}&q=${query}`;
}
//==========================================END==================================//

/**
 * Lấy danh sách chát
 * @method GET
 */
//========================================CHAT===================================//
module.exports.list_chat = function (page = 1, number = 10) {
    return `group_chat/list_chat_recent?${getVerified()}&page=${page}&number=${number}`;
}
//========================================END====================================//

//======================================NEWS====================================//
/**
 * Lọc trong màn hình tin tức
 * Type :

    Thông báo
    Tin Tức
    Giai đấu
    Quảng Cáo


 */
module.exports.news_filter = function (type, page = 1, number = 20) {
    return `magazine/filter_magazine?${getVerified()}&page=${page}&number=${number}&type=${type}`;
}

/**
 * Đánh dấu tất cả các notification là đã đọc
 */
module.exports.view_all = function () {
    return `magazine/view_all?${getVerified()}`;
}
//========================================END===================================//
module.exports.ads_banner = function ads_banner() {
    return `adv/get_random_avd?${getVerified()}`;
}
