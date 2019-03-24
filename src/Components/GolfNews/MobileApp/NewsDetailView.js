import React from 'react';
import { View, Text, WebView, BackHandler, Dimensions, ScrollView, StyleSheet } from 'react-native';
import BaseComponent from '../../../Core/View/BaseComponent';
import CustomLoadingView from '../../Common/CustomLoadingView';
import ApiService from '../../../Networking/ApiService';
import Networking from '../../../Networking/Networking';
import HeaderView from './Screens/Header/HeaderView';
import HTML from 'react-native-render-html';
import ItemNews from './Screens/Items/ItemNews';
import NewsLastPost from './NewsLastPost';
import SharePostView from './SharePostView';
let { width } = Dimensions.get('window');
import PropStatic from '../../../Constant/PropsStatic';

export default class NewsDetailView extends BaseComponent {
    constructor(props) {
        super(props);
        let { params } = this.props.navigation.state;
        this.title = (params && params.title) ? params.title : '';
        this.slug = (params && params.slug) ? params.slug : '';
        this.post = null;
        this.backHandler = null;
        this.onBackClick = this.onBackClick.bind(this);
        this.onItemRelatedPostsClick = this.onItemRelatedPostsClick.bind(this);
        this.relatedPosts = [];
    }

    componentDidMount() {
        if (this.refHeader) {
            this.refHeader.setHeaderLeft(this.getResourceGolfnews().ic_back, this.onBackClick);
        }
        if(this.refShare){
            PropStatic.setPopupShareInNews(this.refShare);
        }
        this.backHandler = BackHandler.addEventListener('hardwareBackPress', this.onBackClick);
        this.sendRequestDetail();
    }

    componentWillUnmount(){
        PropStatic.setPopupShareInNews(null);
    }

    onBackClick() {
        let { navigation } = this.props;
        if (navigation) {
            navigation.goBack();
        }
        return true;
    }

    showLoading() {
        if (this.refLoading) {
            this.refLoading.showLoading();
        }
    }

    hideLoading() {
        if (this.refLoading) {
            this.refLoading.hideLoading();
        }
    }

    sendRequestDetail() {
        if (!this.slug) return;
        let self = this;
        let url = this.getConfig().BASE_URL + ApiService.news_view_post(this.slug);
        console.log('............................... slug url : ', url);
        this.showLoading();
        Networking.httpRequestGet(url, (jsonData) => {
            self.hideLoading();
            let { status, data } = jsonData;
            if (!status || !data) return;
            if (status.code && parseInt(status.code) === 200) {
                let { post, relatedPosts } = data;
                self.post = post;
                self.relatedPosts = relatedPosts;
                this.setState({});
            }
        }, () => {
            self.hideLoading();
        });
    }

    renderPost() {
        if (!this.post || !this.post.detail) return null;
        let detail = this.post.detail;
        console.log('............................. detail : ', detail);
        return (
            <View style={{ flex: 1, backgroundColor: 'white' }}>
                <ScrollView>
                    <Text style={{ fontSize: 16, color: 'black', fontWeight: 'bold', marginTop: 10, marginLeft: 5, marginRight: 5 }}>{detail.title ? detail.title : ''}</Text>
                    <Text style={{ fontSize: 12, color: '#F36F25', marginTop: 5, marginLeft: 5, marginRight: 5 }}>{detail.category.title ? detail.category.title : ''}</Text>
                    {/* <WebView html={detail.content ? detail.content : ''}
                    source={{ baseUrl: '' }}
                    // onLoadStart={this.onLoadStart}
                    // onLoadEnd={this.onLoadEnd}
                    startInLoadingState={true}
                    style={{ flex: 1, backgroundColor: 'white', marginTop: 6 }}
                
                /> */}
                    <HTML baseFontStyle={{ fontSize: 16, color: 'black' }}
                        html={detail.content ? detail.content : ''} imagesMaxWidth={width - 20}
                        containerStyle={{ backgroundColor: 'white', marginLeft: 5, marginRight: 5 }}
                    />
                    <NewsLastPost />
                    {/* {this.newsRelatePost()} */}
                </ScrollView>
            </View>
        )
    }

    onItemRelatedPostsClick(data) {
        let navigation = this.props.navigation;
        if(navigation){
            navigation.navigate('news_detail',{ title: data.title ? data.title : '', slug: data.slug ? data.slug : null });
        }
    }

    renderRelatedPosts() {
        if (!this.relatedPosts || !this.relatedPosts.length) return null;
        let elements = this.relatedPosts.map(d => {
            return (
                <ItemNews
                    onItemClick={this.onItemRelatedPostsClick}
                    data={d}
                />
            )
        });
        return elements;
    }

    newsRelatePost() {
        if (!this.relatedPosts.length) return null;
        return (
            <View style={styles.container}>
                <Text style={styles.txt_title}>{'TIN CÙNG CHUYÊN MỤC'}</Text>
                <View style={styles.view_line}/>
                {this.renderRelatedPosts()}
                
            </View>
        )
    }

    render() {
        return (
            <View style={{ flex: 1, backgroundColor: 'white' }}>
                <HeaderView ref={(refHeader) => { this.refHeader = refHeader; }} title={this.title} hide_right={true}/>
                <View style={{ flex: 1, padding: 6 }}>
                    {this.renderPost()}
                    <CustomLoadingView ref={(refLoading) => { this.refLoading = refLoading }} />
                </View>
                <SharePostView ref={(refShare)=>{this.refShare = refShare;}}/>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container : {
        marginLeft: 6, 
        marginRight: 6,
        marginTop : 7
    },

    txt_title: {
        fontSize: 20,
        color: '#F36F25',
        textAlign: 'left'
    },

    view_line : {
        height : 7,
        width : width-10,
        backgroundColor : '#F36F25'
    }
})