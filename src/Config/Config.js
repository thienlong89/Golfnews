// module.exports.BASE_URL = 'http://192.168.1.24:8888/api/v3/';
// const url = 'https://api-vga.golfervn.com/apiv3/v3/';
// const url = 'https://staging-api-s2.golfervn.com/api/v3/';
const url = 'http://api.golfnews.vn/';

module.exports.BASE_URL = url;

module.exports.web_url = function(slug){
    return `https://golfnews.vn/${slug}.html`;
}


