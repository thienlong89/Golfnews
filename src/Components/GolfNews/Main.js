import React from 'react';
import {StackNavigator} from 'react-navigation';
import HomeView from './MobileApp/HomeView';
import { fromLeft, fadeIn } from 'react-navigation-transitions';
import NewsDetailView from './MobileApp/NewsDetailView';
import {View} from 'react-native';
import InfoAppView from './MobileApp/InfoAppView';
import VideoDetailView from './MobileApp/VideoDetailView';
import SearchGolfnewsView from './MobileApp/SearchGolfnewsView';

const AppStack = StackNavigator(
    {
        home : {
            screen : HomeView
        },
        news_detail : {
            screen : NewsDetailView
        },
        video_play : {
            screen : VideoDetailView
        },
        introduct : {
            screen : InfoAppView
        },
        search_all : {
            screen : SearchGolfnewsView
        }
    },
    {
        navigationOptions: {
            header: null
        },
    
        initialRouteName: 'home',
        transparentCard : true,
        transitionConfig: () => fromLeft()
    },
    /*
    {
        initialRouteName: 'home_screen'
    }
    */
);

export default class Main extends React.Component{
    constructor(props){
        super(props);
    }

    render(){
        return(
            <View style={{flex : 1,backgroundColor : 'white'}}>
                <AppStack />
            </View>
        );
    }
}