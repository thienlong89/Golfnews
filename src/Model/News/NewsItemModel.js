export default class NewsItemModel {

    constructor() {
        this.id = 0;
        this.title = '';
        this.content = '';
        this.shorten_content = '';
        this.published_time = 0;
        this.is_view = 0;

        this.is_top = 0;
        this.img_background = '';
        this.logo_url = '';
        this.type = 0;
        this.is_displayed = 0;
        this.small_text = '';

        this.short_content = '';
        this.width = 0;
        this.height = 0;//:500
        this.url = '';
    }

    parseData(data) {
        if (data.hasOwnProperty('id')) {
            this.id = data['id'];
        }
        if (data.hasOwnProperty('title')) {
            this.title = data['title'];
        }
        if (data.hasOwnProperty('content')) {
            this.content = data['content'];
        }
        if (data.hasOwnProperty('shorten_content')) {
            this.shorten_content = data['shorten_content'];
        }
        if (data.hasOwnProperty('published_time')) {
            this.published_time = data['published_time'];
        }
        if (data.hasOwnProperty('is_view')) {
            // console.log("isView ",data['is_view']);
            this.is_view = parseInt(data['is_view']);
        }

        if(data.hasOwnProperty('is_top')){
            this.is_top = data['is_top'];
        }
        if(data.hasOwnProperty('img_background')){
            this.img_background = data['img_background'];
        }
        if(data.hasOwnProperty('logo_url')){
            this.logo_url = data['logo_url'];
        }
        if(data.hasOwnProperty('type')){
            this.type = data['type'];
        }
        if(data.hasOwnProperty('is_displayed')){
            this.is_displayed = data['is_displayed'];
        }
        if(data.hasOwnProperty('small_text')){
            this.small_text = data['small_text'];
        }
        if(data.hasOwnProperty('short_content')){
            this.short_content = data['short_content'];
        }
        if(data.hasOwnProperty('width')){
            this.width = data['width'];
        }
        if(data.hasOwnProperty('height')){
            this.height = data['height']
        }
        if(data.hasOwnProperty('url')){
            this.url = data['url'];
        }
    }

    getIsDisplay(){
        return this.is_displayed;
    }

    /**
     * Loai tin tuc 1 la tin tuc, 2 la quang cao
     */
    getType(){
        return this.type;
    }

    getLogoUrl(){
        return this.logo_url;
    }

    /**
     * anh nen cua quang cao
     */
    getImgBackground(){
        return this.img_background;
    }

    getTop(){
        return this.is_top;
    }

    getId() {
        return this.id ? this.id : '';
    }

    getTitle() {
        return this.title ? this.title : '';
    }

    getContent() {
        return this.content ? this.content : '';
    }

    getSortenContent() {
        return this.shorten_content ? this.shorten_content : '';
    }

    getPublishedIime() {
        return this.published_time ? this.published_time : '';
    }

    isView() {
        return this.is_view ? true : false;
    }
}