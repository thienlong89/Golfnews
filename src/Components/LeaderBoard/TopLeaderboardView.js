import React from 'react';
import { View, BackHandler,ScrollView } from 'react-native';
import BaseComponent from '../../Core/View/BaseComponent';
// import LeaderBoardTab from './LeaderBoardTabNavigator';
// import styles from '../../Styles/LeaderBoard/StyleLeaderboardView';
// import Constant from '../../Constant/Constant';
// import ApiService from '../../Networking/ApiService';
// import Networking from '../../Networking/Networking';
import LeaderBoardHeader from './LeaderBoardHeader';
import Constant from '../../Constant/Constant';
import PropsStatic from '../../Constant/PropsStatic';
import I18n from 'react-native-i18n';
import TopUSGAIndexView from './Items/TopUSGAIndexView';
import TopRankingHandicapView from './Items/TopRankingHandicapView';
require('../../../I18n/I18n');

export default class TopLeaderboardView extends BaseComponent{
    constructor(props){
        super(props);
        this.backHandler = null;
        this.onBackClick = this.onBackClick.bind(this);
        this.onSearchClick = this.onSearchClick.bind(this);

        PropsStatic.setCallFun(Constant.NAVIGATOR_SCREEN.LEADERBOARD, this.setTitle.bind(this));
    }

    static navigationOptions = ({navigation}) => {
        const {params} = navigation.state;
        console.log('...........................params : ',params);
        if(!params || !params.title){
            return {
                title : I18n.t("leaderboard_title"),
                tabBarLabel: I18n.t("leaderboard_title")
            }
        }
        return {
            title: params.title,
            tabBarLabel: params.title
            // headerRight: <Button
            //                  title="Refresh"
            //                  onPress={ () => params.handleRefresh() } />

        };
    };

    setTitle(){
        // console.log("........................set title : ",this.t('handicap'));
        this.props.navigation.setParams({
            title: this.t('leaderboard_title')
        });
    }

    componentDidMount(){
        if(this.header){
            this.header.backCallback = this.onBackClick;
            // this.header.searchClickCallback = this.onSearchClick;
        }
        this.backHandler = BackHandler.addEventListener('hardwareBackPress',this.onBackClick);
    }

    componentWillUnmount(){
        if(this.backHandler) this.backHandler.remove();
    }

    onBackClick(){
        let{navigation} = this.props;
        if(navigation){
            navigation.goBack();
        }
        return true;
    }
    //thong bao
    //quangcao
    //cac giai dau
    //tin tuc

    onSearchClick(){
        let navigation = PropsStatic.getAppSceneNavigator();
        if(navigation){
            navigation.navigate('leaderboard_search');
        }
    }

    render(){
        return(
            <View style={{flex : 1}}>
                <LeaderBoardHeader hide_right={true} ref={(header)=>{this.header = header;}}/>
                <ScrollView>
                    <TopUSGAIndexView />
                    <TopRankingHandicapView/>
                </ScrollView>
            </View>
        );
    }
}