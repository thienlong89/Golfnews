import React from 'react';
import {
    Platform,
    StyleSheet,
    Text,
    View,
    BackHandler,
    FlatList,
    ScrollView
} from 'react-native';
import Touchable from 'react-native-platform-touchable';
import Networking from '../../../Networking/Networking';
import ApiService from '../../../Networking/ApiService';
import { scale, verticalScale, moderateScale, fontSize } from '../../../Config/RatioScale';
import HeaderSearchView from '../../HeaderSearchView';
import DataManager from '../../../Core/Manager/DataManager';
import Constant from '../../../Constant/Constant';
import BaseComponent from '../../../Core/View/BaseComponent';
import ListgolfnewsView from './Screens/Items/ListGolfnewsView';
import SharePostView from './SharePostView';
import PropStatic from '../../../Constant/PropsStatic';
import ListSearchView from './Screens/Items/ListSearchView';

export default class SearchGolfnewsView extends BaseComponent {

    constructor(props) {
        super(props);
        this.inputData = '';
        this.onChangeSearchText = this.onChangeSearchText.bind(this);
        this.onBackPress = this.onBackPress.bind(this);
        this.page = 1;
        this.number = 10;
        this.isLoading = false;
    }

    render() {
        return (
            <View style={styles.container}>
                <HeaderSearchView
                    isHideCancelBtn={true}
                    onChangeSearchText={this.onChangeSearchText}
                    onCancelSearch={this.onBackPress}
                // menuTitle={this.t('done')} 
                />
                <View style={{ flex: 1 }}>
                    <ListSearchView mode_share={true} ref={(refListView) => { this.refListView = refListView; }} />
                    {this.renderInternalLoading()}
                </View>
                {this.renderMessageBar()}
                <SharePostView ref={(refShare) => { this.refShare = refShare; }} />
            </View>
        );
    }

    onBackPress() {
        if (this.props.navigation) {
            this.props.navigation.goBack();
        }
    }

    componentDidMount() {
        // this.rotateToPortrait();
        this.registerMessageBar();
        this.handleHardwareBackPress();
        if (this.refShare) {
            PropStatic.setPopupShare(this.refShare);
        }
        if(this.refListView){
            this.refListView.loadMoreCallback = this.onLoadMore.bind(this);
            this.refListView.onRefreshCallback = this.onRefresh.bind(this);
        }
        // DataManager.loadLocalData([Constant.SEARCH_ALL.QUERY], this.onLoadLocalComplete);

    }


    onRefresh(){
        if(this.isLoading) return;
        this.page = 1;
        this.refListView.fillData([]);
        this.sendRequestSearch();
    }

    onLoadMore(){
        if(this.isLoading) return;
        this.page++;
        this.sendRequestSearch();
    }

    componentWillUnmount() {
        this.unregisterMessageBar();
        if (this.backHandler) {
            this.backHandler.remove();
        }
    }

    handleHardwareBackPress() {
        let self = this;
        this.backHandler = BackHandler.addEventListener('hardwareBackPress', function () {
            if(self.refShare.isShowed()){
                self.refShare.hide();
                return true;
            }
            self.onBackPress();
            return true;
        });
    }

    onChangeSearchText(input) {
        if(!input || !input.length) return;
        this.inputData = input;
        console.log('..................... tim kiem bai viet : ', input);
        this.sendRequestSearch();
    }

    sendRequestSearch() {
        this.isLoading = true;
        this.internalLoading.showLoading();
        let self = this;
        let url = this.getConfig().BASE_URL + ApiService.search_all(this.inputData,this.page);
        console.log(' search all url : ', url);
        Networking.httpRequestGet(url, (jsonData) => {
            // console.log('jsonData: ', jsonData);
            self.internalLoading.hideLoading();
            let { status, data } = jsonData;
            if (status.code && parseInt(status.code) === 200) {
                if (self.refListView) {
                    self.refListView.fillData(data);
                    self.isLoading = false;
                }
            }
        }, () => {
            //time out
            self.internalLoading.hideLoading();
            self.isLoading = false;
        });
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        flexDirection: 'column'
    },
    container_section: {
        margin: scale(10),
        borderWidth: 1,
        borderRadius: scale(10),
        borderColor: '#D6D4D4'
    },
    view_section_header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingLeft: scale(10)
    },
    txt_title_header: {
        color: 'black',
        fontSize: fontSize(15),
        fontWeight: 'bold'
    },
    txt_see_more: {
        color: '#00ABA7',
        fontSize: fontSize(15),
        padding: scale(10)
    },
    line: {
        backgroundColor: '#D6D4D4',
        height: 1
    },
    separator_view: {
        backgroundColor: '#D6D4D4',
        height: 1,
        marginLeft: scale(10),
        marginRight: scale(10)
    }
});