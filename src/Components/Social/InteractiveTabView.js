import React from 'react';
import {
    Platform,
    StyleSheet,
    Text,
    View,
    Animated,
    ScrollView,
    ListView,
    Image,
    BackHandler
} from 'react-native';
import Touchable from 'react-native-platform-touchable';
import BaseComponent from '../../Core/View/BaseComponent';
import Networking from '../../Networking/Networking';
import ApiService from '../../Networking/ApiService';
import { TabNavigator, TabBarTop } from 'react-navigation';
import AllInteractPlayerView from './Interactive/AllInteractPlayerView';
import LikePlayerListView from './Interactive/LikePlayerListView';
import LovePlayerListView from './Interactive/LovePlayerListView';
import DislikePlayerListView from './Interactive/DislikePlayerListView';
import Swiper from 'react-native-swiper';
import MyView from '../../Core/View/MyView';
import InteractivePlayerModel from '../../Model/Social/InteractivePlayerModel';
import InteractiveTabHeader from './Interactive/InteractiveTabHeader';
import HeaderView from '../HeaderView';


export default class InteractiveTabView extends BaseComponent {

    static defaultProps = {
        flightId: '',
        uid: '',
        statusType: 1 //1 : flight 2 : eventclub 3 : postclub 4 : postpublic, 5: appointment
    }

    constructor(props) {
        super(props);
        this.tabType = ['All'];
        this.flightId = this.props.navigation.state.params.flightId;
        this.uid = this.getUserInfo().getId();
        this.statusType = this.props.navigation.state.params.statusType || 1;
        this.state = {
            postStatus: {},
            likeList: [],
            loveList: [],
            dislikeList: [],
            listAll: []
        }

        this.onBackPress = this.onBackPress.bind(this);
    }

    setFlightId(flightId = '') {
        this.flightId = flightId;
    }

    render() {
        let { likeList, loveList, dislikeList, listAll } = this.state;

        let tabview = [<AllInteractPlayerView
            listAll={listAll}
            uid={this.uid}
            navigation={this.props.navigation} />];
        if (loveList.length > 0) {
            tabview.push(<LovePlayerListView
                loveList={loveList}
                uid={this.uid}
                navigation={this.props.navigation} />);
            this.tabType.push('Love');
        }
        if (likeList.length > 0) {
            tabview.push(<LikePlayerListView
                likeList={likeList}
                uid={this.uid}
                navigation={this.props.navigation} />);
            this.tabType.push('Like');
        }
        if (dislikeList.length > 0) {
            tabview.push(<DislikePlayerListView
                dislikeList={dislikeList}
                uid={this.uid}
                navigation={this.props.navigation} />);
            this.tabType.push('Dislike');
        }

        return (
            <View style={styles.container}>
                <View style={styles.view_line} />
                <HeaderView
                    title={this.t('player_interactive')}
                    handleBackPress={this.onBackPress} />
                <InteractiveTabHeader
                    ref={(refInteractiveTabHeader) => { this.refInteractiveTabHeader = refInteractiveTabHeader }}
                    loveCount={loveList.length}
                    likeCount={likeList.length}
                    dislikeCount={dislikeList.length} />
                <Swiper
                    showsButtons={false}
                    loop={false}
                    showsPagination={false}
                    onIndexChanged={(index) => this.onViewPagerChange(index)}
                    key={tabview.length}>

                    {tabview}

                </Swiper>
                {this.renderLoading()}
            </View>
        );
    }

    onViewPagerChange(index) {
        this.refInteractiveTabHeader.setTabType(this.tabType[index]);
    }

    onBackPress() {
        if (this.props.navigation) {
            this.props.navigation.goBack();
        }
    }

    componentDidMount() {
        this.rotateToPortrait();
        // this.registerMessageBar();
        this.handleHardwareBackPress();

        this.requestInteractiveInfo();
    }

    componentWillUnmount() {
        // this.unregisterMessageBar();
        if (this.backHandler) {
            this.backHandler.remove();
        }
    }

    handleHardwareBackPress() {
        let self = this;
        this.backHandler = BackHandler.addEventListener('hardwareBackPress', function () {
            self.onBackPress();
            return true;
        });
    }

    requestInteractiveInfo() {
        this.loading.showLoading();
        let self = this;
        let url = this.getConfig().getBaseUrl() + ApiService.get_interactive_info(this.flightId, this.statusType);
        console.log('url', url);
        Networking.httpRequestGet(url, this.onInteractiveInfoResponse.bind(this), () => {
            //time out
            self.loading.hideLoading();
            // console.log('showErrorMsg7')
            // self.showErrorMsg(self.t('time_out'))
        });
    }

    onInteractiveInfoResponse(jsonData) {
        this.loading.hideLoading();

        this.model = new InteractivePlayerModel(this);
        this.model.parseData(jsonData);
        if (this.model.getErrorCode() === 0) {
            console.log('onInteractiveInfoResponse', this.model.getPostStatus());
            this.setState({
                postStatus: this.model.getPostStatus(),
                likeList: this.model.getLikeList(),
                loveList: this.model.getLoveList(),
                dislikeList: this.model.getDislikeList(),
                listAll: this.model.getAllStatus()
            })
        } else {
            // console.log('showErrorMsg8')
            // this.showErrorMsg(jsonData['error_msg']);
        }

    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFF',
    },
    iconStyle: {
        backgroundColor: "#858585"
    },
    indicatorStyle: {
        backgroundColor: '#00aba7'
    },
    labelStyle: {
        fontSize: 18,
        fontWeight: 'bold',
        //color: '#858585',
        // height: (deviceHeight * 4) / 67,
        position: 'relative',
        alignSelf: 'center',
        // padding: 6,
        marginTop: 5,
    },

    tabStyle: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    style: {
        backgroundColor: '#fff'
    },
    view_tab_header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10
    },
    line_indicator: {
        height: 1,
        // marginTop: 15
    },
    tab_navigator: {
        // justifyContent: 'center',
        // alignItems: 'center',
        height: 32,
        justifyContent: 'space-between',
    },
    view_line: {
        height: 1,
        backgroundColor: '#E0E0E0',
        position: 'absolute',
        top: 42,
        right: 10,
        left: 10
    },
    icon_heart: {
        width: 23,
        height: 23,
        resizeMode: 'contain',
        marginRight: 3
    },
    view_icon_group: {
        flexDirection: 'row',
        paddingLeft: 12,
        paddingRight: 12,
        justifyContent: 'center',
        alignItems: 'center'
    },
    view_all_group: {
        paddingLeft: 12,
        paddingRight: 12,
        alignItems: 'center',
        fontSize: 14
    },
    txt_number: {
        fontSize: 14
    }
});