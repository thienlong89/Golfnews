var group_chat_cskh = {};
export const setChatCSKH = function(_group_cskh){
    group_chat_cskh = _group_cskh;
}

/**
 * Trả về thông tin nhóm cskh
 */
export const getChatCSKH = function(){
    return group_chat_cskh;
}