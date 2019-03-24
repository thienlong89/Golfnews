var count_notify_friend = '0';
var count_notify_news = '0';

module.exports.getCountNotiyFriend = function(){
    return count_notify_friend;
}

module.exports.setCountNotifyFriend = function(_count){
    count_notify_friend = _count;
}