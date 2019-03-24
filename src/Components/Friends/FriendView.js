import React from 'react';
import { View,Animated } from 'react-native';
import FriendNavigator from './FriendNavigator';
import { StackNavigator } from 'react-navigation';
import GroupDetailView from '../Groups/GroupDetailView';
import GroupCreateView from '../Groups/GroupAddMemberView';
import BaseComponent from '../../Core/View/BaseComponent';
import ClubHomeView from '../CLB/ClubHomeView';
import ClubAddMemberView from '../CLB/ClubAddMemberView';
import GroupInfoView from '../Groups/GroupInfoView';
import GroupShareView from '../Groups/GroupShareView';
import ClubShareView from '../CLB/ClubShareView';
import { fromLeft } from 'react-navigation-transitions';
import StaticProps from '../../Constant/PropsStatic';
import Constant from '../../Constant/Constant';
import I18n from 'react-native-i18n';
require('../../../I18n/I18n');

const StackFriend = StackNavigator(
    {
        home: { screen: FriendNavigator },
        group_detail: { screen: GroupDetailView },
        club_detail: { screen: ClubHomeView },
        group_create: { screen: GroupCreateView },
        club_add_member: { screen: ClubAddMemberView },
        //group_admin : {screen : GroupAdmin},
        group_share : {
            screen : GroupShareView
        },
        group_info : {screen : GroupInfoView},
        club_share : {
            screen : ClubShareView
        }
    },

    {
        navigationOptions: {
            header: null
        },
        transitionConfig : ()=>fromLeft()
    }
);


export default class FriendView extends BaseComponent {
    constructor(props) {
        super(props);
        // this.state = {
        //     fadeIn: new Animated.Value(0),
        // }
        StaticProps.setCallFun(Constant.NAVIGATOR_SCREEN.FRIEND, this.setTitle.bind(this));
        this.navigation = this.props.navigation;
    }

    static navigationOptions = ({navigation}) => {
        const {params} = navigation.state;
        console.log('...........................params : ',params);
        if(!params){
            return {
                title : I18n.t("handicap"),
                tabBarLabel: I18n.t("handicap")
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
        console.log("........................set title : ",this.t('handicap'));
        this.props.navigation.setParams({
            title: this.t('handicap')
        });
    }

    fadeOut() {
        this.state.fadeIn.setValue(1);
        Animated.timing(
            this.state.fadeIn,
            {
                toValue: 0,
                duration: 3000,
            }
        ).start();
    }

    fadeIn() {
        this.state.fadeIn.setValue(0);
        Animated.timing(
            this.state.fadeIn,
            {
                toValue: 1,
                duration: this.timeAnimationFadeIn,
            }
        ).start();
    }

    render() {
        // let{fadeIn} = this.state;
        return (
            <View style={{ flex: 1}}>
                
                {/* <View style={{ flex: 1 }}> */}
                    <StackFriend screenProps={{ parentNavigator: this.props.screenProps,navigation : this.navigation}} />
                {/* </View> */}
                {this.renderMessageBar()}
            </View>
        );
    }

    componentDidMount(){
        this.registerMessageBar();
        this.registerNotification();
        // this.fadeIn();
    }

    componentWillUnmount(){
        this.unregisterMessageBar();
        // this.fadeOut();
    }
}