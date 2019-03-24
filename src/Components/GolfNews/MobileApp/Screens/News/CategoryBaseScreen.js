import React from 'react';
import {View,Text} from 'react-native';
import BaseComponent from '../../../../../Core/View/BaseComponent';
import ApiService from '../../../../../Networking/ApiService';
import Networking from '../../../../../Networking/Networking';
import ListgolfnewsView from '../Items/ListGolfnewsView';
import CustomLoadingView from '../../../../Common/CustomLoadingView';

export default class CategoryBaseScreen extends BaseComponent{
    constructor(props){
        super(props);
        this.category = '';
        this.type = this.props.type;//video 1,tin tuc = 2
        this.slug = this.props.slug;
        this.show = true;
        this.path = this.props.path;

       
        this.page = 1;
        this.number = 10;

        this.isLoading = false;
        console.log('................... params : ',this.props.slug,this.props.path);
    }

    componentDidMount(){
        this.sendRequestListNews();
        if(this.listView){
            this.listView.loadMoreCallback = this.onLoadMore.bind(this);
            this.listView.onRefreshCallback = this.onRefresh.bind(this);
        }
    }

    onLoadMore(){
        if(this.isLoading) return; 
        this.page++;
        this.sendRequestListNews(true);
    }

    onRefresh(){
        if(this.isLoading) return;
        this.page = 1;
        this.listView.fillData([]);
        this.sendRequestListNews();
    }

    showLoading(){
        if(this.refLoading){
            this.refLoading.showLoading();
        }
    }

    hideLoading(){
        if(this.refLoading){
            this.refLoading.hideLoading();
        }
    }

    sendRequestListNews(more = false){
        this.isLoading = true;
        let url = this.getConfig().BASE_URL + ApiService.news_category_detail(this.slug,this.page,this.number);
        console.log('......................... requestListNew : ',url);
        let self = this;
        this.showLoading();
        Networking.httpRequestGet(url,(jsonData)=>{
            self.hideLoading();
            let{status,data} = jsonData;
            if(!status || !data) return;
            if(parseInt(status.code) === 200){
                self.listView.fillData(data,more,()=>{
                    self.isLoading = false;
                });
            }
        },()=>{
            self.hideLoading();
        });
    }

    render(){
        if(!this.slug) return null;
        return(
            <View style={{flex : 1,justifyContent : 'center',alignItems : 'center'}}>
                {/* <Text style={{color : 'green',fontSize : 24}}>Demo Category</Text> */}
                <ListgolfnewsView ref={(listView)=>{this.listView = listView;}} type={this.type}/>
                <CustomLoadingView backgroundColor={'transparent'} ref={(refLoading)=>{this.refLoading = refLoading}}/>
            </View>
        )
    }
}