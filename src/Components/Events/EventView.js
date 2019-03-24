import React from 'react';
import {
    StyleSheet,
    View,
    ListView,
    RefreshControl
} from 'react-native';
import Touchable from 'react-native-platform-touchable';
import BaseComponent from '../../Core/View/BaseComponent';
import HeaderView from './Header/Header';
import ApiService from '../../Networking/ApiService';
import Networking from '../../Networking/Networking';
import Item from './Items/EventItem';
import EventModel from '../../Model/Events/EventModel';

export default class EventView extends BaseComponent {
    constructor(props) {
        super(props);
        this.page = 1;
        this.list_event = [];
        this.state = {
            refreshing: false,
            dataSource: new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 }),
        }

        this.onRefresh = this.onRefresh.bind(this);
        this.onLoadMore = this.onLoadMore.bind(this);
    }

    componentDidMount() {
        if (this.headerView) {
            this.headerView.setTitle(this.t('event'));
            this.headerView.callbackBack = this.onBackClick.bind(this);
            this.headerView.callbackRight = this.onCreateEventClick.bind(this);
        }
        this.sendRequestListEvent();
    }

    /**
     * refresh lai list event
     */
    refresh_count_event() {
        let { params } = this.props.navigation.state;
        if (params.refresh_count_event) {
            params.refresh_count_event();
        }
    }

    /**
     * Tao sự kiện
     */
    onCreateEventClick() {
        let { navigation } = this.props;
        if (navigation) {
            navigation.navigate('event_create', { "refresh": this.onRefresh.bind(this),'refresh_count_event' : this.refresh_count_event.bind(this)});
        }
    }

    onBackClick() {
        let { navigation } = this.props;
        //console.log('navigation ', this.props);
        this.refresh_count_event();
        if (navigation) {
            navigation.goBack();
        }
    }

    showLoading(){
        if(this.internalLoading){
            this.internalLoading.showLoading();
        }
    }

    hideLoading(){
        if(this.internalLoading){
            this.internalLoading.hideLoading();
        }
    }

    /**
     * Gửi request lấy list event
     */
    sendRequestListEvent() {
        let url = this.getConfig().getBaseUrl() + ApiService.event_list(this.page);
        console.log("event list : ",url);
        this.showLoading();
        let self = this;
        Networking.httpRequestGet(url, (jsonData) => {
            self.hideLoading();
            self.model = new EventModel();
            self.model.parseData(jsonData);
            if (self.model.getErrorCode() === 0) {
                for (let d of self.model.getListItem()) {
                    let obj = {
                        name: d.getName(),
                        user_host_id: d.getHostId(),
                        facility_name: d.getFacility().getSubTitle(),
                        tee_time: d.getTeeTime(),
                        avatar: d.getHostUser().getAvatar(),
                        create_at_timestamp: d.getDateCreateTimestamp(),
                        coming: d.isComing(),
                        id: d.getId(),
                        facility_id: d.getFacilityId()
                    }
                    self.list_event.push(obj);
                }
                if (self.list_event.length) {
                    self.setState({
                        dataSource: self.state.dataSource.cloneWithRows(self.list_event),
                    });
                }
            }
            //self.internalLoading.hideLoading();
        }, () => {
            //time out
            //self.internalLoading.hideLoading();
            self.hideLoading();
            self.popupTimeOut.showPopup();
        });
    }

    /**
     * click vao item event
     * @param {*} data 
     */
    onItemClick(data) {
        let { navigation } = this.props;
        let host_id = this.getAppUtil().replaceUser(data.user_host_id);
        if(host_id === this.getAppUtil().replaceUser(this.getUserInfo().getId())){
            navigation.navigate('event_detail_admin', { data: data });
        }else{
            navigation.navigate('event_detail_member', { data: data,onRefresh : this.onRefresh.bind(this) });
        }
        console.log("host_id : ", host_id);
        /*
        if(host_id.indexOf(this.getUserInfo().getId()) >= 0 || host_id.indexOf(this.getUserInfo().getUserId())){
            //man hình host
        }else{
            //man hình user thường
        }
        */
        //navigation.navigate('event_detail_member', { data: data });
    }

    /**
     * load trang tiếp theo
     */
    onLoadMore() {
        if (!this.internalLoading || this.list_event.length < 10) return;
        this.page++;
        this.sendRequestListEvent();
    }

    /**
     * load lại dữ liệu
     */
    onRefresh() {
        this.page = 1;
        this.list_event = [];
        this.sendRequestListEvent();
    }

    removeFromListView(data){
        this.list_event = this.getAppUtil().remove(this.list_event,data);
        let dataSource = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
        this.setState({
            dataSource : dataSource.cloneWithRows(this.list_event)
        });
    }

    render() {
        return (
            <View style={styles.container}>
                {/* {this.renderLoading()} */}
                <HeaderView ref={(headerView) => { this.headerView = headerView; }} />
                <View style={{ flex: 1 }}>
                    <ListView style={styles.list_view}
                        dataSource={this.state.dataSource}
                        onEndReachedThreshold={5}
                        enableEmptySections={true}
                        keyboardShouldPersistTaps='always'
                        renderSeparator={(sectionId, rowId) => <View key={rowId} style={styles.separator_view} />}
                        onEndReached={this.onLoadMore}
                        renderRow={(rowData) =>
                            // <Touchable onPress={this.onItemClick.bind(this, rowData)}>
                                <Item data={rowData} onItemClick={this.onItemClick.bind(this,rowData)} removeFromListView={this.removeFromListView.bind(this,rowData)}/>
                            // </Touchable>
                        }
                        refreshControl={
                            <RefreshControl
                                refreshing={this.state.refreshing}
                                onRefresh={this.onRefresh}
                            />
                        } />
                    {this.renderInternalLoading()}
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff'
    },

    separator_view: {
        height: 1,
        backgroundColor: '#E3E3E3'
    },

    list_view: {
        flex: 1,
        marginTop: 5
    }
})