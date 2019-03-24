import I18n from 'react-native-i18n';
global.BIRTHDAY_FORMAT = 'DD/MM/YYYY';
global.Tee_time = 'HH:mm, DD/MM/YYYY';
global.db_name = 'VHandicap.db';
global.db_table = [
    { name: 'Flight', colum: ['flight_id', 'data'] }
];
global.DROPDOWN_SEX = [
    { id: 0, name: I18n.t('male') },
    { id: 1, name: I18n.t('female') }
];//0 - Nam , 1 - Nu
global.preferred_hand = [
    { id: 0, name: I18n.t('tay_phai') },
    { id: 1, name: I18n.t('tay_trai') }
]

global.statistical_mode = [
    { mode: '10', name: I18n.t('mode_10') },
    { mode: '20', name: I18n.t('mode_20') },
    { mode: '50', name: I18n.t('mode_50') },
    { mode: 'all', name: I18n.t('mode_all') },
]

global.default_tees = [];
global.default_languages = [];

global.alertType = {
    success: "success",
    error: 'error',
    warning: 'warning',
    extra: 'extra',
    info: 'info'
};
/**
 * chi load danh sach quoc gia 1 lan
 */
global.list_countries = [];
global.list_cities = {};//object lưu các thành phố theo quốc gia, chỉ load 1 lần
global.list_states = {};

global.change_notify = false;//cờ check để load notify
global.list_notify_id_readed = [];
// global.function_refresh_count_notify = null;
global.isUpgradeTut = false;

global.home_list_history_flight_logout = false;//check man hinh history neu logout
global.home_list_friend_flight_logout = false;//check man hinh ban be neu logout

global.is_profile_loaded = false; //check da load duoc thong tin user hay chua
//cờ check localtion ở màn hình HOME
global.check_location = false;
//cờ check nếu có lệnh load lại profile
global.load_refresh_profile = false;

global.isAppJustActive = true;

global.isScaleFont = false;

global.shouldUpdateFinishFlight = false;

global.flightIdRefresh = '';

global.isNewNotifyReceived = false;
global.public_count = 0;
global.clb_count = 0;

global.topics = [
    { id: '1', name: I18n.t('topic_tool'), icon: '' },
    { id: '2', name: I18n.t('topic_technology'), icon: '' },
    { id: '3', name: I18n.t('topic_law'), icon: '' },
    { id: '4', name: I18n.t('topic_appointment'), icon: '' },
    { id: '5', name: I18n.t('topic_award'), icon: '' },
    { id: '6', name: I18n.t('topic_social_active'), icon: '' }
]

global.type_topic_comment = {
    FLIGHT : 1,
    EVENT_CLUB : 2,
    POST_CLUB : 3,
    POST_PUBLIC : 4,
    EVENT : 5
}

global.total_chat = 0;

global.isProfileDidUpdate = false;
global.isProfileDidUpdate2 = false;

global.createdAt_check = 0;

global.enableScrollChat = true;

global.isVipAccount = false;

global.base_url = '';
