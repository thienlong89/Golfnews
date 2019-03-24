/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React from 'react';
import {
    StyleSheet,
    Text,
    View,
    Dimensions,
    Alert,
    Image,
    ListView
} from 'react-native';
import { TextField } from 'react-native-material-textfield';
import Touchable from 'react-native-platform-touchable';
import BaseComponent from '../../Core/View/BaseComponent';
import HeaderView from '../Common/HeaderView';
import MyView from '../../Core/View/MyView';
import ApiService from '../../Networking/ApiService';
import Networking from '../../Networking/Networking';
import EHandicapClubItem from './Items/EHandicapClubItem';
import EHandicapClubModel from '../../Model/EHandicap/EHandicapClubModel';
import PopupNotificationView from '../Popups/PopupNotificationView';
import EHandicapMemberModel from '../../Model/EHandicap/EHandicapMemberModel';
import EHandicapMemberItem from './Items/EHandicapMemberItem';

import {scale, verticalScale, fontSize} from '../../Config/RatioScale';
let{width,height} = Dimensions.get('window');

//const TAG = "[Vhandicap-v1] SynHandicapView : ";

let screenWidth = width - scale(60);
export default class SynHandicapView extends BaseComponent {
    constructor(props) {
        super(props);
        this.list_club = [];
        this.list_member = [];
        this.club_id = '';
        this.member_id = '';
        this.state = {
            club_name: '',
            club_error: '',
            showMe: false,
            member_id: '',
            member_error: '',
            txtMember: '',
            txtHandicap: '',
            dataSource: new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 }),
            showListClub: false,
            showListMember: false,
            dataSourceMember: new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 }),
        }
    }

    onBackClick() {
        let { navigation } = this.props;
        if (navigation) {
            let { params } = navigation.state;
            if (params.onSyncHandicapSuccess) {
                params.onSyncHandicapSuccess();
            }
            navigation.goBack();
        }
        return true;
    }

    componentDidMount() {
        if (this.headerView) {
            this.headerView.setTitle(this.t('sys_handicap_title'));
            this.headerView.callbackBack = this.onBackClick.bind(this);
        }
        this.sendRequestListClub();
    }

    /**
     * Tìm kiếm câu lạc bộ
     * @param {*} input tham số để tìm kiếm
     */
    findClub(input) {
        let list = this.list_club.filter(d => d.name.toLowerCase().indexOf(input.toLowerCase().trim()) >= 0);
        this.setState({
            dataSource: this.state.dataSource.cloneWithRows(list),
        });
    }

    /**
     * Gửi yêu cầu lấy danh sách các câu lạc bộ từ ehandicap
     */
    sendRequestListClub() {
        if (this.list_club.length) return;
        let url = this.getConfig().getBaseUrl() + ApiService.ehandicap_club();
        console.log("url club : ", url);
        // this.loading.showLoading();
        let self = this;

        Networking.httpRequestGet(url, (jsonData) => {
            console.log('club data : ', jsonData);
            self.model = new EHandicapClubModel(self);
            self.model.parseData(jsonData);
            if (self.model.getErrorCode() === 0) {
                for (let d of self.model.getListItem()) {
                    let obj = {
                        id: d.getId(),
                        name: d.getName(),
                        code: d.getCode()
                    }
                    self.list_club.push(obj);
                }

                if (self.list_club.length) {
                    self.setState({
                        //showListClub: true,
                        dataSource: self.state.dataSource.cloneWithRows(self.list_club),
                    });
                }
            }
            self.loading.hideLoading();
        }, () => {
            //time out
            self.loading.hideLoading();
            self.popupTimeOut.showPopup();
        });
    }

    /**
     * Tim kiếm thành viên
     */
    sendRequestSearchMember() {
        //this.loading.showLoading();
        let self = this;
        let url = this.getConfig().getBaseUrl() + ApiService.ehandicap_member_search(this.club_id, this.state.member_id);
        console.log("url search member : ", url);
        Networking.httpRequestGet(url, (jsonData) => {
            // console.log("member search : ", jsonData);
            self.model = new EHandicapMemberModel(self);
            self.model.parseData(jsonData);
            if (self.model.getErrorCode() === 0) {
                self.list_member = [];
                for (let d of self.model.getListMember()) {
                    let obj = {
                        id: d.getId(),
                        member_name: d.getMemberName(),
                        member_handicap: d.getMemberHandicap(),
                        member_id: d.getMemberId()
                    }
                    self.list_member.push(obj);
                }
                if (self.list_member.length) {
                    self.setState({
                        showListMember: true,
                        dataSourceMember: self.state.dataSourceMember.cloneWithRows(self.list_member),
                    });
                }
            }
           // self.loading.hideLoading();
        }, () => {
            //time out
            //self.loading.hideLoading();
           // self.popupTimeOut.showPopup();
        });
    }

    /**
     * Focus ô tìm câu lạc bộ
     */
    onClubIdFocus() {
        this.setState({
            showListClub: true
        });
    }

    onMemberIdFocus() {
        if (!this.state.club_name) {
            this.setState({
                club_error: this.t('club_error')
            }, () => {
                this.textFieldClubId.focus();
            });
        }
    }

    /**
     * Gửi yêu cầu đồng bộ
     */
    sendRequestImportEhandicap() {
        let url = this.getConfig().getBaseUrl() + ApiService.ehandicap_import(this.club_id, this.member_id);
        this.loading.showLoading();
        let self = this;
        console.log("url : ", url);
        Networking.httpRequestGet(url, (jsonData) => {
            console.log("jsonData : ", jsonData);
            if (jsonData.hasOwnProperty('error_code')) {
                let error_code = parseInt(jsonData['error_code']);
                if (error_code === 0) {
                    self.getUserInfo().getUserProfile().setEhandicapClub(this.club_id);
                    self.getUserInfo().getUserProfile().setEhandicapMemberId(this.member_id);
                    self.popupNotify.setCallback(self.onBackClick.bind(self));
                    self.popupNotify.setMsg(jsonData['error_msg']);
                } else if (error_code === 2) {
                    self.onCheckErrorCode(2, '');
                }
                else {
                    self.popupNotify.setMsg(jsonData['error_msg']);
                }
            }
            self.loading.hideLoading();
        }, () => {
            //time out
            self.loading.hideLoading();
            self.popupTimeOut.showPopup();
        });
    }

    /**
     * Button đồng bộ dữ liệu
     */
    onStartSysClick() {
        if (!this.club_id) {
            this.setState({
                club_error: this.t('club_error')
            });
            return;
        }
        if (!this.member_id) {
            this.setState({
                member_error: this.t('member_error')
            });
            return;
        }
        
        this.sendRequestImportEhandicap();

    }

    clubItemClick(data) {
        this.club_id = data.code;
        this.setState({
            showListClub: false,
            club_name: data.name,
            club_error: ''
        });
    }

    /**
     * Click vao thanh vien
     * @param {*} data 
     */
    memberItemClick(data) {
        this.member_id = data.member_id;
        this.setState({
            showListMember: false,
            txtMember: data.member_id,
            showMe: true,
            txtMember: data.member_name,
            txtHandicap: data.member_handicap,
            member_error: ''
        });
    }

    onSubmitEditing() {
        if (this.state.member_id) {
            this.sendRequestSearchMember();
        } else {
            this.setState({
                member_error: this.t('member_error')
            })
        }

    }

    render() {
        let { club_error, showMe, txtHandicap, showListClub, club_name,
            showListMember, txtMember, member_id, member_error } = this.state;
        return (
            <View style={styles.container}>
                <PopupNotificationView ref={(popupNotify) => { this.popupNotify = popupNotify; }} />
                {this.renderLoading()}
                <HeaderView ref={(headerView) => { this.headerView = headerView; }} />
                <Text allowFontScaling={global.isScaleFont} style={styles.msg_text}>{this.t('sys_handicap_msg')}</Text>
                <Image
                    style={styles.logo_img}
                    source={this.getResources().sys_network}
                />
                <View style={styles.container}>
                    <View style={styles.view_textfield}>
                        <TextField allowFontScaling={global.isScaleFont}
                            ref={(textFieldClubId) => { this.textFieldClubId = textFieldClubId; }}
                            label={this.t('club_id')}
                            tintColor='#474040'
                            textColor='#4d4646'
                            lineWidth={scale(0.5)}
                            labelHeight= {verticalScale(22)}
                            activeLineWidth={scale(0.5)}
                            disabledLineWidth={scale(0.5)}
                            labelFontSize={fontSize(15,scale(1))}
                            multiline={false}
                            fontSize={fontSize(17,scale(3))}
                            onFocus={() => this.onClubIdFocus()}
                            error={club_error}
                            errorColor='#FF0000'
                            value={club_name}
                            onChangeText={(input) => {
                                this.setState({ club_name: input });
                                this.findClub(input);
                            }
                            }
                        />
                    </View>
                    <MyView style={styles.myview_list_club} hide={!showListClub}>
                        <ListView
                            style={styles.container}
                            dataSource={this.state.dataSource}
                            renderSeparator={(sectionId, rowId) => <View key={rowId} style={styles.separator} />}
                            enableEmptySections={true}
                            keyboardShouldPersistTaps='always'
                            renderRow={(rowData) =>
                                <Touchable onPress={this.clubItemClick.bind(this, rowData)}>
                                    <EHandicapClubItem
                                        data={rowData}
                                    />
                                </Touchable>
                            }
                        />
                    </MyView>
                    <View style={styles.view_textfield}>
                        <TextField allowFontScaling={global.isScaleFont}
                            ref={(textFieldMemberId) => { this.textFieldMemberId = textFieldMemberId; }}
                            label={this.t('member_name')}
                            tintColor='#474040'
                            textColor='#4d4646'
                            lineWidth={scale(0.5)}
                            labelHeight={verticalScale(22)}
                            activeLineWidth={scale(0.5)}
                            disabledLineWidth={scale(0.5)}
                            labelFontSize={fontSize(15,scale(1))}
                            fontSize={fontSize(17,scale(3))}
                            onFocus={() => this.onMemberIdFocus()}
                            value={member_id}
                            error={member_error}
                            errorColor='#FF0000'
                            onSubmitEditing={this.onSubmitEditing.bind(this)}
                            onChangeText={(input) => {
                                console.log("member id --- ",this.state.club_name)
                                //this.state.club_name ? this.setState({ member_id: input }) : this.setState({ member_id: '' });
                                this.state.club_name ? this.state.member_id = input : this.state.member_id = '';
                                if (this.state.member_id) {
                                    this.sendRequestSearchMember();
                                } 
                                // else {
                                //     this.setState({
                                //         member_error: this.t('member_error')
                                //     })
                                // }

                            }} />
                    </View>
                    <MyView style={styles.myview_list_member} hide={!showListMember}>
                        <ListView
                            style={styles.container}
                            dataSource={this.state.dataSourceMember}
                            renderSeparator={(sectionId, rowId) => <View key={rowId} style={styles.separator} />}
                            enableEmptySections={true}
                            keyboardShouldPersistTaps='always'
                            renderRow={(rowData) =>
                                <Touchable onPress={this.memberItemClick.bind(this, rowData)}>
                                    <EHandicapMemberItem
                                        data={rowData}
                                    />
                                </Touchable>
                            }
                        />
                    </MyView>
                    <MyView style={styles.myvie_it_me} hide={!showMe}>
                        <Text allowFontScaling={global.isScaleFont} style={styles.label_it_me}>{this.t('it_me_label')}</Text>
                        <View style={styles.member_name_view}>
                            <Text allowFontScaling={global.isScaleFont} style={styles.member_name_text}>{txtMember}</Text>
                            <Text allowFontScaling={global.isScaleFont} style={styles.handicap_text}>{this.t('handicap_title')} : {txtHandicap}</Text>
                        </View>
                    </MyView>
                    <Touchable onPress={this.onStartSysClick.bind(this)}>
                        <View style={styles.sys_button_view}>
                            <Text allowFontScaling={global.isScaleFont} style={styles.sys_button_text}>{this.t('sys_handicap_button')}</Text>
                        </View>
                    </Touchable>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },

    sys_button_text: {
        //flex: 1, 
        fontSize: fontSize(20,scale(6)),// 20,
        color: '#fff',
        textAlignVertical: 'center'
    },

    sys_button_view: {
        zIndex: 5,
        height:  verticalScale(60),
        backgroundColor: '#00aba7',
        marginTop: verticalScale(20),
        justifyContent: "center",
        alignItems: 'center'
    },

    handicap_text: {
        fontSize: fontSize(16,scale(2)),// 16,
        color: '#ff0000',
        fontWeight: 'bold',
        flex: 0.4
    },

    member_name_text: {
        fontSize: fontSize(16,scale(2)),// 16,
        color: '#ff0000',
        fontWeight: 'bold',
        flex: 0.6
    },

    member_name_view: {
        height: verticalScale(50),
        flexDirection: 'row',
        marginTop: verticalScale(5),
        alignItems: 'center'
    },

    label_it_me: {
        //height:  20,
        fontSize: fontSize(14),// 14,
        color: '#474040',
        textAlignVertical: 'center'
    },

    myvie_it_me: {
        height: verticalScale(70),
        marginLeft: scale(30),
        marginTop: verticalScale(10),
        justifyContent: 'center'
    },

    myview_list_member: {
        zIndex: 10,
        position: 'absolute',
        left:  scale(30),
        top: verticalScale(140),
        width: screenWidth,
        height: verticalScale(150),
        borderWidth: 1,
        borderColor: '#424242',
        backgroundColor: '#fff'
    },

    separator: {
        height: verticalScale(1),
        backgroundColor: '#424242'
    },

    myview_list_club: {
        zIndex: 10,
        position: 'absolute',
        left: scale(30),
        top: verticalScale(65),
        width: screenWidth,
        height: verticalScale(300),
        borderWidth: scale(1),
        borderColor: '#424242',
        backgroundColor: '#fff'
    },

    logo_img: {
        width: screenWidth,
        height: verticalScale(70),
        alignSelf: 'center',
        resizeMode: 'contain',
        marginTop: verticalScale(5)
    },

    msg_text: {
        //height:   20,
        marginTop: verticalScale(10),
        alignSelf: 'center',
        textAlignVertical: 'center',
        fontSize: fontSize(14),// 14,
        color: '#979797'
    },

    view_textfield: {
        // backgroundColor: 'yellow',
        marginLeft: scale(30),
        marginRight: scale(60),
        marginTop:  verticalScale(10),
        // backgroundColor : 'red'
    },
});