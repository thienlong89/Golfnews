import React from 'react';
import {
    StyleSheet,
    Text,
    View,
    Dimensions,
    Image,
    Platform,
    TextInput
} from 'react-native';
import Touchable from 'react-native-platform-touchable';
import BaseComponent from '../../Core/View/BaseComponent';
import HeaderView from '../Common/HeaderView';
import ModalDropdown from 'react-native-modal-dropdown';
import MyTextInput from '../Common/MyTextInput';
import MyListView from '../Common/MyListView';
import ApiService from '../../Networking/ApiService';
import Networking from '../../Networking/Networking';
import FriendModel from '../../Model/Friends/FriendsModel';
import FacilityCourseModel from '../../Model/Facility/FacilityCourseModel';
import ReasonModel from '../../Model/Reason/ReasonModel';
import PopupNotify from '../Popups/PopupNotificationView';
import {scale, verticalScale, fontSize} from '../../Config/RatioScale';
let{width,height} = Dimensions.get('window');

let view_width = Dimensions.get('window').width - scale(20);
/**
 * liên quan đến report người chơi
 */
export default class ReportUserView extends BaseComponent {
    constructor(props) {
        super(props);
        this.user_id = '';
        this.facility_id = '';
        this.reason = '';
        this.list_reason = []
        this.list_with_users = [];//danh sach cac nguoi hay choi cung
        this.txtNote = '';
        this.list_facility_recent = [];
        this.state = {
            textSearch: '',
            txtTopic : this.t('choosen_topic_report'),
            //txtNote : ''
        }
    }

    onBackClick() {
        let { navigation } = this.props;
        if (navigation) {
            navigation.goBack();
        }
        return true;
    }

    componentDidMount() {
        this.headerView.setTitle(this.t('report_user'))
        this.headerView.callbackBack = this.onBackClick.bind(this);

        this.textInputFacility.enable();

        this.textInputUser.enable();
        //this.textInputUser.focus();
        this.textInputUser.focusCallback = this.onTextInputUserFocus.bind(this);
        this.textInputUser.submitCallback = this.onTextInputUserSubmit.bind(this);
        this.listUserView.itemClickCallback = this.onUserClick.bind(this);

        this.textInputFacility.focusCallback = this.onTextInputFacilityFocus.bind(this);
        this.textInputFacility.submitCallback = this.onTextInputFacilitySubmit.bind(this);
        this.listFacilityView.itemClickCallback = this.onFacilityClick.bind(this);

        //this.sendRequestListPlayWith();
        this.sendRequestTopicReport();
    }

    /**
     * Lấy danh sách các user hay chơi cùng
     */
    sendRequestListPlayWith() {
        if (!this.list_with_users.length) {
            let url = this.getConfig().getBaseUrl() + ApiService.list_play_with();
            let self = this;
            this.internalLoading.showLoading();
            Networking.httpRequestGet(url, (jsonData) => {
                self.internalLoading.hideLoading();
                //console.log("report user : ", jsonData);
                self.model = new FriendModel(self);
                self.model.parseData(jsonData);
                self.list_with_users = self.model.getListFriendData();
                self.textInputUser.focus();
            }, () => {
                self.internalLoading.hideLoading();
            });
        }
    }

    /**
     * Tim kiem user
     */
    sendRequestSearchUser(text) {
        let url = this.getConfig().getBaseUrl() + ApiService.user_search(text);
        let self = this;
        Networking.httpRequestGet(url, (jsonData) => {
            let model = new FriendModel(self);
            model.parseData(jsonData);
            let list = model.getListFriendData();
            self.listUserView.setFillData(list);
        });
    }

    /**
     * Tìm kiếm sân
     * @param {*} text 
     */
    sendRequestSearchFacility(text) {
        let url = this.getConfig().getBaseUrl() + ApiService.search_facility('', '', '', text);
        console.log("url : ",url);
        let self = this;
        Networking.httpRequestGet(url, (jsonData) => {
            let model = new FacilityCourseModel(self);
            model.parseData(jsonData);
            let list = model.getListFacilityCourse();
            self.listFacilityView.setFillData(list);
        });
    }

    /**
     * Lấy chủ đề report
     */
    sendRequestTopicReport() {
        let url = this.getConfig().getBaseUrl() + ApiService.list_reason();
        this.internalLoading.showLoading();
        let self = this;
        Networking.httpRequestGet(url, (jsonData) => {
            self.internalLoading.hideLoading();
            console.log("resean : ",jsonData);
            let model = new ReasonModel(self);
            model.parseData(jsonData);
            if(model.getErrorCode() === 0){
                self.list_reason = model.getListReason();
                self.setState({});
            }
        }, () => {
            self.internalLoading.hideLoading();
        });
    }

    /**
     * Lấy sân hay chơi của user
     */
    sendRequestRecentFacility(){
        if(this.list_facility_recent.length){
            this.listFacilityView.setFillData(this.list_facility_recent);
            return;
        }
        let url = this.getConfig().getBaseUrl() + ApiService.favorite_course();
        this.internalLoading.showLoading();
        let self = this;
        Networking.httpRequestGet(url,(jsonData)=>{
            //console.log("data recent facility : ",jsonData);
            self.internalLoading.hideLoading();
            let model = new FacilityCourseModel(self);
            model.parseData(jsonData);
            if (model.getErrorCode() === 0) {
                self.list_facility_recent = model.getListFacilityCourse();
                //console.log("lsit facility : ",self.list_facility);
                self.listFacilityView.setFillData(self.list_facility_recent);
            }
        },()=>{
            self.internalLoading.hideLoading();
        });
    }

    /**
     * Click vao item user
     * @param {*} data 
     */
    onUserClick(data) {
        this.textInputUser.setValue(data.getFullname());
        this.user_id = data.getUserId();
        this.textInputFacility.focus();
        this.sendRequestRecentFacility();
    }

    /**
     * focus lai o tim san thi lay dnah sach recent
     */
    onTextInputFacilityFocus(){
        this.sendRequestRecentFacility();
    }

    onTextInputFacilitySubmit(text){
        this.sendRequestSearchFacility(text)
    }

    /**
     * click vao item san
     * @param {*} data 
     */
    onFacilityClick(data) {
        this.textInputFacility.setValue(data.getSubTitle());
        this.facility_id = data.getId();
       // this.sendRequestTopicReport();
    }

    onTextInputUserFocus() {
        if(this.list_with_users.length){
            this.listUserView.setFillData(this.list_with_users);
        }
    }

    onTextInputUserSubmit(text) {
        //this.textInputFacility.focus();
        this.sendRequestSearchUser(text);
    }

    /**
     * tao report
     */
    onSendReportClick() {
        let formData = {
            user_id : this.user_id,
            facility_id : this.facility_id,
            reason : this.reason,
            note : this.txtNote,// this.state.txtNote
        }
        console.log("reason : ",formData);
        this.internalLoading.showLoading();
        let self = this;
        let url = this.getConfig().getBaseUrl() + ApiService.report_create();
        Networking.httpRequestPost(url,(jsonData)=>{
            //console.log("reason create : ",jsonData);
            self.internalLoading.hideLoading();
            if(jsonData.hasOwnProperty('error_code')){
                let error_code = parseInt(jsonData['error_code']);
                if(error_code === 0){
                    //thanh cong
                    self.popupNotify.okCallback = self.onBackClick.bind(self);
                    self.popupNotify.setMsg(jsonData['error_msg'])
                }else{
                    self.popupNotify.okCallback = null;
                    self.popupNotify.setMsg(jsonData['error_msg'])
                }
            }
        },formData,()=>{
            self.internalLoading.hideLoading();
        })
    }

    onSearchClick() {

    }


    onSelectedContentReport(data,index){
        this.reason = data;
        this.dropdown_topic.hide();
        this.setState({
            txtTopic : data
        });
    }

    render() {
        return (
            <View style={styles.container}>
                <HeaderView ref={(headerView) => { this.headerView = headerView; }} />
                <View style={{ flex: 1 }}>
                    <View style={styles.search_view}>
                        <Touchable style={styles.search_touchable} onPress={this.onSearchClick.bind(this)}>
                            <Image style={styles.search_image}
                                source={this.getResources().ic_Search} />
                        </Touchable>
                        <MyTextInput style={styles.search_input_text}
                            ref={(textInputUser) => { this.textInputUser = textInputUser; }}
                            placeholder={this.t('input_name_search')} />
                    </View>
                    <View style={styles.search_view}>
                        <Touchable style={styles.search_touchable} onPress={this.onSearchClick.bind(this)}>
                            <Image style={styles.search_image}
                                source={this.getResources().ic_Search} />
                        </Touchable>
                        <MyTextInput ref={(textInputFacility) => { this.textInputFacility = textInputFacility; }}
                            style={styles.search_input_text}
                            placeholder={this.t('input_facility_search')} />
                    </View>
                    <View style={styles.search_view}>
                        <Touchable style={styles.search_touchable} onPress={this.onSearchClick.bind(this)}>
                            <Image style={styles.search_image}
                                source={this.getResources().ic_Search} />
                        </Touchable>
                        <ModalDropdown
                            ref={(dropdown_topic) => { this.dropdown_topic = dropdown_topic; }}
                            defaultValue={this.state.txtTopic}
                            style={styles.dropdown}
                            textStyle={styles.dropdown_text}
                            dropdownStyle={styles.dropdown_dropdown}
                            options={this.list_reason}
                            renderRow={(rowData, index, isSelected) =>
                                <View style={{ backgroundColor: isSelected ? '#99E6FF' : '#FFFFFF' }}>
                                    <Touchable onPress={this.onSelectedContentReport.bind(this,rowData, index)}>
                                        <Text allowFontScaling={global.isScaleFont} style={styles.text_dropdown}>{rowData}</Text>
                                    </Touchable>
                                </View>
                            }
                        />
                        {/* // <View style={styles.right_view}> */}
                        <Image style={styles.dropdown_image}
                            source={this.getResources().s_normal} />
                        {/* </View> */}
                    </View>
                    <View style={styles.note_view}>
                        <Text allowFontScaling={global.isScaleFont} style={styles.note_text}>{this.t('report_label')}</Text>
                        <View style={styles.note_input_view}>
                            <TextInput allowFontScaling={global.isScaleFont}

                                style={{paddingl : scale(10),fontSize : fontSize(14),lineHeight : fontSize(18,verticalScale(4))}}

                                //onChangeText={(text) => this.setState({ txtNote: text })}
                                onChangeText={(text) => {this.txtNote = text}}
                                //value={this.state.txtNote}
                                placeholder={this.t('ly_do_report')}
                                placeholderTextColor='#a1a1a1'
                                underlineColorAndroid='rgba(0,0,0,0)'
                                multiline={true}
                                //numberOfLines={6}
                                //autoFocus={true}
                                //onSubmitEditing={this.onSummit.bind(this)}
                            />
                        </View>
                    </View>

                    <Touchable onPress={this.onSendReportClick.bind(this)}>
                        <View style={styles.button_send}>
                            <Text allowFontScaling={global.isScaleFont} style={{ fontSize: fontSize(18,scale(4)), fontWeight: 'bold', color: '#000' }}>{this.t('send')}</Text>
                        </View>
                    </Touchable>
                    <MyListView ref={(listUserView) => { this.listUserView = listUserView; }}
                        top={verticalScale(60)}
                        left={scale(10)}
                        right={scale(10)}
                        bottom={verticalScale(20)} />
                    <MyListView ref={(listFacilityView) => { this.listFacilityView = listFacilityView; }}
                        top={verticalScale(115)}
                        left={scale(10)}
                        right={scale(10)} 
                        bottom={verticalScale(20)}/>
                    {this.renderInternalLoading()}
                </View>
                <PopupNotify ref={(popupNotify)=>{this.popupNotify = popupNotify;}}/>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff'
    },

    note_view : {
        height: verticalScale(160), 
        marginTop: verticalScale(15), 
        marginLeft: scale(10), 
        marginRight: scale(10) 
    },

    note_text : {
        fontSize: fontSize(14),// 14, 
        color: '#000'
    },

    note_input_view : {
        borderColor : '#000',
        borderWidth : 1,
        marginTop : verticalScale(5),
        flex : 1,
        justifyContent : 'flex-start'
    },

    button_send: {
        height: verticalScale(40),
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: scale(10),
        marginRight: scale(10),
        marginTop: verticalScale(40),
        borderColor: '#a1a1a1',
        borderRadius: 3,
        backgroundColor: '#00aba7',
        borderWidth: (Platform.OS === 'ios') ? 1 : 0.5,
    },

    right_view: {
        width: scale(50),
        height: verticalScale(40),
        backgroundColor: 'green'
    },

    dropdown_image: {
        marginRight: 0,
        width: scale(38),
        height: verticalScale(38),
        resizeMode: 'contain',
        //backgroundColor: 'red'
    },

    search_image: {
        width: scale(23),
        height: verticalScale(23),
        resizeMode: 'contain'
    },

    search_touchable: {
        width: scale(40),
        height: verticalScale(40),
        justifyContent: 'center',
        alignItems: 'center'
    },

    search_view: {
        height: verticalScale(40),
        justifyContent: 'space-around',
        borderColor: '#a1a1a1',
        borderRadius: 3,
        borderWidth: 0.5,
        flexDirection: 'row',
        marginLeft: scale(10),
        marginRight: scale(10),
        marginTop: verticalScale(15)
    },

    search_input_text: {
        flex: 1,
        justifyContent : 'center'
        //paddingLeft: 10
    },

    text_dropdown: {
        color: '#615B5B',
        paddingLeft: scale(20),
        paddingTop: verticalScale(10),
        paddingBottom: verticalScale(10),
        fontSize : fontSize(14)
    },

    dropdown: {
        // width: 100,
        // height: 40,
        flex: 1,
        // marginRight: 10,
        // marginTop : 15,
        // borderWidth : (Platform.OS === 'ios') ? 1 : 0.5,
        // borderColor: '#a1a1a1',
        // borderRadius: 3,
        justifyContent: 'center',
        alignItems: 'flex-start',
        //marginLeft : 10
    },

    dropdown_text: {
        //marginVertical: 10,
        //marginHorizontal: 6,
        fontSize: fontSize(16,scale(2)),// 16,
        color: '#8f8e94',
        textAlign: 'right',
        marginRight: scale(10),
        textAlignVertical: 'center',
    },

    dropdown_dropdown: {
        width: view_width,
        height: verticalScale(160),
        borderColor: 'cornflowerblue',
        // marginRight: -40,
        marginLeft: -scale(40),
        borderWidth: 2,
        borderRadius: 3,
    },

    dropdown_row: {
        flexDirection: 'row',
        height: verticalScale(30),
        alignItems: 'center',
    },

    dropdown_row_text: {
        marginHorizontal: 4,
        fontSize: fontSize(16,scale(2)),// 16,
        color: 'navy',
        textAlignVertical: 'center',
    },

    dropdown_separator: {
        height: 1,
        backgroundColor: 'cornflowerblue',
    },
});