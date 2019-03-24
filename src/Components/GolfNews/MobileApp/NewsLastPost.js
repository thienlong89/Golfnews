import React from 'react';
import { View } from 'react-native';
import BaseComponent from '../../../Core/View/BaseComponent';
import ListgolfnewsView from './Screens/Items/ListGolfnewsView';
import ApiService from '../../../Networking/ApiService';
import Networking from '../../../Networking/Networking';
import HeaderLastPost from './Screens/Header/HeaderLastPost';

/**
 * Lấy các bài viết mới nhất
 */
export default class NewsLastPost extends BaseComponent {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        this.sendRequestLastPost();
    }

    sendRequestLastPost() {
        let url = this.getConfig().BASE_URL + ApiService.news_list_latest();
        console.log('....................... last post : ', url);
        let self = this;
        Networking.httpRequestGet(url, (jsonData) => {
            let { status, data } = jsonData;
            if (!status || !data) return;
            if (status.code &&  parseInt(status.code) === 200) {//feake tam
                if (data.length) {
                    self.headerLastPost.showHeaderTitle('TIN MỚI NHẤT');
                    self.listView.fillData(data);
                }
            }
        }, () => {

        });
    }

    render() {
        return (
            <View style={{ flex: 1, backgroundColor: 'white' }}>
                <HeaderLastPost ref={(headerLastPost) => { this.headerLastPost = headerLastPost }} />
                <ListgolfnewsView ref={(listView) => { this.listView = listView; }} type={1} />
            </View>
        );
    }
}