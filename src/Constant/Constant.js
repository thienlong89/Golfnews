module.exports.USER = {
    USER_ID: 'user_id',
    USER_TYPE: 'user_type',
    TOKEN: 'token',
    PHONE: 'phone',
    INPUT_SCORE_TYPE: 'input_score_type'
}

module.exports.LEADER_BOARD = {
    RANK_TYPE: {
        TOP_18: "18",
        SINGLE: 'single',
        BOGEY: 'bogey',
        CLUB: 'top_club',
        LADDY: 'lady',
        PRO : 'pro'
    },
    SCREEN_INDEX : {
        PRO : 0,
        SINGLE : 1,
        BOGEY : 2,
        TOP_18 : 3,
        LADDY : 4,
        CLUB : 5
    },
    //ROUTER NAME PHAI GIONG VS ROUTER NAME TRONG FILE LeaderBoardTabNavigator khong la loi day
    ROUTER_NAME : {
        PRO : 'Pro',
        SINGLE : 'Single',
        BOGEY : 'Bogey',
        TOP_18 : 'Top18',
        LADDY : 'Laddy',
        CLUB : 'CLB'
    },
    CACHE_TIME: 5 * 60 * 1000 //5 phut
}

module.exports.MANNER = {
    ROUTER_NAME : {
        BEST_GROSS : 'Bestgross',
        BEST_NET : 'BestNet',
        RANGKING_GOLFER : 'RankingGolfer',
        RANKING_CLUB : 'RankingClub'
    },
}

module.exports.FRIEND = {
    TYPE: {
        FRIEND: 'FRIEND',
        GROUP: 'GROUP',
        CLUB: 'CLUB'
    }
}

module.exports.CACHE = {
    MAX_FRIEND_FLIGHT_ID: 'MAX_FRIEND_FLIGHT_ID',
    MAX_FINISH_FLIGHT_ID: 'MAX_FINISH_FLIGHT_ID',
    MAX_NEWS_ID: 'MAX_NEWS_ID',
    MAX_NOTIFICATION_ID: 'MAX_NOTIFICATION_ID',
    SYNC_INTERVAL_FINISH_FLIGHT: 'SYNC_INTERVAL_FINISH_FLIGHT',
    SYNC_INTERVAL_FRIEND_FLIGHT: 'SYNC_INTERVAL_FRIEND_FLIGHT',
    SYNC_INTERVAL_SINGLE_TOP: 'SYNC_INTERVAL_SINGLE_TOP',
    SYNC_INTERVAL_LADY_TOP: 'SYNC_INTERVAL_LADY_TOP',
    SYNC_INTERVAL_18_TOP: 'SYNC_INTERVAL_18_TOP',
    SYNC_INTERVAL_BOGEY_TOP: 'SYNC_INTERVAL_BOGEY_TOP',
    SYNC_INTERVAL_PRO_TOP: 'SYNC_INTERVAL_PRO_TOP'
}

module.exports.MEMORY_POPUP = 'MEMORY_POPUP';

module.exports.HOME_CACHE_TIME = 2;

module.exports.NUMBER_PAGE_SHARE_VIEW = 10;//số lượng item để share màn hình

module.exports.LANGUAGE = 'LANGUAGE';

module.exports.NAVIGATOR_SCREEN = {
    HOME : 'home',
    FRIEND : 'friend',
    LEADERBOARD : 'bxh',
    CHAT : 'chat',
    COURSE : 'course',
    MENU : 'menu'
}

module.exports.FILTER_TYPE = {
    ALL : 0,
    FLIGHT : 1,
    EVENT : 14,
    FRIEND : 9,
    COMMEND : 17,
    CLUB : 16,
    GROUP : 13
}

module.exports.NEWS_FILTE_TYPE = {
    ALL : 0,
    NOTIFY : 1,
    NEWS : 2,
    TOURNAMENTS : 3,
    ADVERTISING : 4
}

module.exports.SEARCH_ALL = {
    QUERY : 'QUERY',
}

module.exports.CACHE_BASE_URL = {
    LIST : 'LIST',
    MAIN : 'MAIN'
}