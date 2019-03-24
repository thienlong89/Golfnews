import React from 'react';
import { View, Image, Dimensions } from 'react-native';
import BaseComponent from '../../../Core/View/BaseComponent';

import { TabNavigator, TabBarBottom, SafeAreaView,cre } from 'react-navigation';//TabBarBottom
import TelevisionScreen from './Screens/TelevisionScreen';
import Files from '../../Common/Files';
import VideoScreen from './Screens/VideoScreen';
import NewsScreen from './Screens/NewsScreen';
import PropStatic from '../../../Constant/PropsStatic';
import SharePostView from './SharePostView';
import InfoAppView from './InfoAppView';

const tabHeight = 60;
let { width } = Dimensions.get('window');
let tabWidth = width / 6

const TabScreen = TabNavigator(
    {
        Television: {
            screen: TelevisionScreen,
            navigationOptions: {
                title: 'Truyền hình',
                tabBarIcon: ({ tintColor, focused }) => (
                    <Image
                        source={Files.golfnews.ic_television}
                        style={[{ width: 30, height: 20,resizeMode : 'contain' }, { tintColor: tintColor }]}
                    />
                ),
                // tabBarVisible : false
            }
        },
        Video: {
            screen: VideoScreen,
            navigationOptions: {
                title: 'Phát lại',
                tabBarIcon: ({ tintColor, focused }) => (
                    <Image
                        source={Files.golfnews.ic_video}
                        style={[{ width: 20, height: 20,resizeMode : 'contain' }, { tintColor: tintColor }]}
                    />
                )
            }
        },
        News: {
            screen: NewsScreen,
            navigationOptions: {
                title: 'Tin tức',
                tabBarIcon: ({ tintColor, focused }) => {
                    if (focused) {
                        return (
                            <Image
                                source={Files.golfnews.ic_golfnews_choosen}
                                style={{ width: 40, height: 30, resizeMode: 'contain' }}
                            />
                        );
                    } else {
                        return (
                            <Image
                                source={Files.golfnews.ic_golfnews_gray}
                                style={{ width: 40, height: 30, resizeMode: 'contain' }}
                            />
                        );
                    }
                }
            }
        },
    },
    {
        tabBarComponent: TabBarBottom,
        navigationOptions: ({ navigation }) => ({
            header: null//<Header/>,
            
        }),
        tabBarOptions: {
            activeTintColor: '#F36F25',
            allowFontScaling: false,
            inactiveTintColor: '#ABABAB',
            upperCaseLabel: false,
            activeBackgroundColor: '#F3F2F4',
            inactiveBackgroundColor: '#F3F2F4',
            showLabel: true,
            showIcon: true,
            labelStyle: {
                fontSize: 14,
                marginBottom: 7,
                // backgroundColor : 'green'
            },
            // tabStyle: styles.tabStyle,
            style: {
                height: tabHeight,
            },
            iconStyle: {
                // marginTop : 7,
                width : 30,
                height : 30,
                // backgroundColor : 'red'
            },
            // indicatorStyle: styles.indicatorStyle
        },
        tabBarPosition: 'bottom',
        animationEnabled: false,
        swipeEnabled: true,
        lazy: true,
        // backgroundColor: 'rgba(249, 249, 249, 0.8)'
    }
);

TabScreen.navigationOptions = ({ navigation }) => {
    let tabBarVisible = true;
    if (navigation.state.index === 0) {
      tabBarVisible = false;
    }
  
    return {
      tabBarVisible,
    };
  };

export default class HomeView extends BaseComponent {
    constructor(props) {
        super(props);
    }

    componentDidMount(){
        this.rotateToLandscape();
        let {navigation} = this.props;
        if(navigation){
            PropStatic.setAppSceneNavigator(navigation);
        }
        if(this.refShare){
            PropStatic.setDialogApp(this.refShare);
        }
        if(this.refInfoApp){
            PropStatic.setComponentInfoApp(this.refInfoApp);
        }
    }

    render() {

        return (
            <View style={{ flex: 1 }}>
                <TabScreen />
                <SharePostView ref={(refShare)=>{this.refShare = refShare;}}/>
                <InfoAppView ref={(refInfoApp)=>{this.refInfoApp = refInfoApp;}}/>
            </View>
        );
    }
}