import React from 'react';
import { View, Text } from 'react-native';
import BaseComponent from '../../../../Core/View/BaseComponent';
import HeaderView from './Header/HeaderView';
import { TabBarBottom, createTabNavigator,cre } from 'react-navigation';//TabBarBottom
import CategoryBaseScreen from './News/CategoryBaseScreen';
import PropStatic from '../../../../Constant/PropsStatic';
import InfoAppView from '../InfoAppView';
const tabHeight = 40;

const navigationConfig = {
    tabBarComponent: TabBarBottom,
    navigationOptions: ({ navigation }) => ({
        header: null//<Header/>
    }),
    tabBarOptions: {
        activeTintColor: '#F36F25',
        allowFontScaling: false,
        inactiveTintColor: '#ABABAB',
        upperCaseLabel: false,
        activeBackgroundColor: '#F3F2F4',
        inactiveBackgroundColor: 'white',
        scrollEnabled: true,
        showLabel: true,
        // showIcon: true,
        labelStyle: {
            fontSize: 14,
            marginLeft : 5,
            padding: 0,
            // minWidth : 60
            // marginBottom: 7,
            // backgroundColor : 'green'

        },
        // tabStyle: styles.tabStyle,
        style: {
            height: tabHeight,
            backgroundColor: 'white',
            borderBottomWidth: 0.5,
            borderBottomColor: 'rgba(0,0,0,0.25)',
            elevation: 0, // remove shadow on Android
            // shadowOpacity: 0, // remove shadow on iOS
        },
        // iconStyle: {
        //     // marginTop : 7,
        //     width: 30,
        //     height: 30,
        //     // backgroundColor : 'red'
        // },
        tabStyle: {
            // backgroundColor: 'green',
            // height: 18,
            paddingTop: 10
        },
        indicatorStyle: {
            backgroundColor: '#F36F25',
            height: 5
        }
    },
    tabBarPosition: 'top',
    animationEnabled: false,
    swipeEnabled: true,
    lazy: true,
    // backgroundColor: 'rgba(249, 249, 249, 0.8)'
}

const TYPE = {
    NEWS: 1,
    VIDEO: 2
}

export default class BaseScreen extends BaseComponent {
    constructor(props) {
        super(props);
        this.data = [];
        this.onNavigatorClick = this.onNavigatorClick.bind(this);
        this.onSearchAll = this.onSearchAll.bind(this);
    }

    createCategory() {
        if (!this.data || !this.data.length) return null;

        const dynamicScreenName = {};

        // data.forEach(subCategory => {
        //     dynamicScreenName[`${subCategory.name}`] = {
        //         screen: () => <CategoryBaseScreen />, navigationOptions: {
        //             title: title
        //         }
        //     };
        // });

        for (let d of this.data) {
            let category = d.parent;
            let { title, id } = category;
            // console.log('..................... this.data : ', category);
            dynamicScreenName[`${id}`] = {
                screen: (props) => <CategoryBaseScreen {...props} slug={category.slug} path={category.path} type={TYPE.NEWS} />, navigationOptions: {
                    title: title,
                    tabBarLabel: title,
                }
            }
            // NewsScreen.tab.state.nav.routes.push(new_tab);
        }

        console.log('............................. createCategory : ', dynamicScreenName);
        const SubCategoryTabs = createTabNavigator(dynamicScreenName, navigationConfig);
        return <SubCategoryTabs />;
    }

    createCategoryVideo() {
        if (!this.data || !this.data.length) return null;

        const dynamicScreenName = {};
        for (let d of this.data) {
            // let category = d.parent;
            let { title, id, slug, path } = d;

            dynamicScreenName[`${id}`] = {
                screen: (props) => <CategoryBaseScreen {...props} slug={slug} path={path} type={TYPE.VIDEO} />, navigationOptions: {
                    tabBarLabel: ({ tintColor, focused }) => (
                        // <View style={{flex : 1}}>
                            <Text
                                adjustsFontSizeToFit={true}
                                style={{ fontSize: 14, color: tintColor, lineHeight: 16,height : 18, alignSelf : 'flex-start',marginBottom : 5 }}
                            >
                                {title}
                            </Text>
                        // </View>
                    )
                }
            }
        }

        console.log('............................. createCategory video: ', dynamicScreenName);
        const SubCategoryTabs = createTabNavigator(dynamicScreenName, navigationConfig);
        return <SubCategoryTabs />;
    }

    onNavigatorClick() {
        // let navigation = PropStatic.getAppSceneNavigator();
        // if (navigation) {
        //     navigation.navigate('introduct');
        // }
        let componentInfoApp = PropStatic.getComponentInfoApp();
        if(componentInfoApp){
            componentInfoApp.show();
        }
    }

    onSearchAll() {
        let navigation = PropStatic.getAppSceneNavigator();
        if (navigation) {
            navigation.navigate('search_all');
        }
    }

    renderAppInfo(){
        return(
            <InfoAppView ref={(refAppInfo)=>{this.refAppInfo = refAppInfo;}}/>
        );
    }

    renderHeader() {
        return (
            <HeaderView onNavigatorClick={this.onNavigatorClick} search={this.onSearchAll} ref={(header) => { this.header = header; }} />
        );
    }
}