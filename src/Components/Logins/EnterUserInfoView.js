import React from 'react';
import {
    Platform,
    StyleSheet,
    Text,
    View,
    BackHandler,
    KeyboardAvoidingView,
    TouchableOpacity,
    Image,
    Alert
} from 'react-native';
import Touchable from 'react-native-platform-touchable';
import BaseComponent from '../../Core/View/BaseComponent';
import HeaderView from '../HeaderView';
import Networking from '../../Networking/Networking';
import ApiService from '../../Networking/ApiService';
import { scale, verticalScale, fontSize } from '../../Config/RatioScale';
import { TextField } from 'react-native-material-textfield';
import DataManager from '../../Core/Manager/DataManager';
import Constant from '../../Constant/Constant';
import UpdateUserInfoView from './SyncInfo/UpdateUserInfoView';
import SyncFacebookView from './SyncInfo/SyncFacebookView';
import SyncContactView from './SyncInfo/SyncContactView';
import Swiper from 'react-native-swiper';
import PaginationView from './SyncInfo/PaginationView';
import Contacts from 'react-native-contacts';
import Permissions from 'react-native-permissions'

export default class EnterUserInfoView extends BaseComponent {

    constructor(props) {
        super(props);
        this.userInfo = this.getUserInfo();
        this.onBackPress = this.onBackPress.bind(this);
        this.onContinuePress = this.onContinuePress.bind(this);
        this.onSyncFacebookCallback = this.onSyncFacebookCallback.bind(this);
        this.onContactCallback = this.onContactCallback.bind(this);
        // this.onCompleteUpdate = this.onCompleteUpdate.bind(this);
        this.checks = [this.getResources().ic_checked, this.getResources().ic_score_circle]
        this.name = '';
        this.contacts = [];
        this.userInfo = {};
        this.state = {
            isMale: true,
            isProfession: false,
            error_name: ''
        }
    }

    render() {

        let { isMale, isProfession } = this.state;

        return (
            <View style={styles.container}>
                <HeaderView
                    title={this.t('enter_info')}
                    handleBackPress={this.onBackPress} />

                <View style={styles.view_content}>
                    <View style={styles.view_border_swiper}>
                        {/* <Swiper
                            ref={(swiper) => { this.swiper = swiper; }}
                            showsButtons={false}
                            loop={false}
                            showsPagination={false}

                            // onIndexChanged={this.onViewScoreBoardChange.bind(this)}
                            // index={this.userSelected}
                            // key={scoreBoard.length}
                            style={styles.swiper_content}
                            scrollEnabled={false}
                        > */}
                            <UpdateUserInfoView
                                onContinuePress={this.onContinuePress} />
                            {/* <SyncFacebookView
                                onSyncCallback={this.onSyncFacebookCallback} />
                            <SyncContactView
                                onContactCallback={this.onContactCallback} /> */}
                        {/* </Swiper> */}
                    </View>

                    {/* <PaginationView
                        ref={(refPaginationView) => this.refPaginationView = refPaginationView} /> */}

                </View>

                {this.renderMessageBar()}
                {this.renderLoading()}
            </View>
        );
    }

    onBackPress() {
        if (this.props.navigation) {
            this.props.navigation.goBack();
        }
    }

    componentDidMount() {
        this.rotateToPortrait();
        this.registerMessageBar();
        this.handleHardwareBackPress();
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
            self.onBackPress();
            return true;
        });
    }

    onContinuePress(userInfo) {
        this.userInfo = userInfo;
        let self = this;
        Alert.alert(
            this.t('notify'),
            this.t('sync_with_contacts'),
            [
                // {
                //     text: this.t('cancel'), onPress: () => {
                //         BackAndroid.exitApp();
                //     }, style: 'cancel'
                // },
                {
                    text: this.t('ok'), onPress: () => {
                        self.onGetContacts();
                    }
                }
            ],
            {
                cancelable: false
            }
        );
        // this.swiper.scrollBy(1);
        // this.refPaginationView.setCurrentPage(1);
    }

    onGetContacts() {
        Permissions.check('contacts').then(response => {
            // Response is one of: 'authorized', 'denied', 'restricted', or 'undetermined'
            // this.setState({ photoPermission: response })
            console.log('response', response)
            if (response === 'undetermined') {
                Permissions.request('contacts', { type: 'always' }).then(response => {
                    if (response === 'authorized') {
                        Contacts.getAllWithoutPhotos((err, contacts) => {
                            if (err) {
                                this.requestUpdateInfo(this.userInfo, []);
                                throw err
                            };

                            // contacts returned
                            for (let contact of contacts) {
                                try {
                                    this.contacts.push(contact.phoneNumbers[0].number)
                                } catch (error) {
                                    console.log('onContactPress.error', error);
                                }
                            }
                            console.log(this.contacts)
                            this.requestUpdateInfo(this.userInfo, this.contacts);

                        })
                    } else {
                        this.requestUpdateInfo(this.userInfo, this.contacts);
                    }
                })
            } else if (response === 'authorized') {
                Contacts.getAllWithoutPhotos((err, contacts) => {
                    if (err) {
                        this.requestUpdateInfo(this.userInfo, []);
                        throw err
                    };

                    // contacts returned
                    for (let contact of contacts) {
                        try {
                            this.contacts.push(contact.phoneNumbers[0].number)
                        } catch (error) {
                            console.log('onContactPress.error', error);
                        }
                    }
                    console.log(this.contacts)
                    this.requestUpdateInfo(this.userInfo, this.contacts);

                })
            } else {
                this.requestUpdateInfo(this.userInfo, this.contacts);
            }
        })

    }

    onSyncFacebookCallback(friendIds) {
        this.swiper.scrollBy(1);
        this.refPaginationView.setCurrentPage(2);
    }

    onContactCallback(contacts) {
        console.log('onContactCallback', contacts);
        console.log('this.userInfo', this.userInfo)
        this.requestUpdateInfo(this.userInfo, contacts);
    }

    // onCompleteUpdate() {
    //     if (this.name === '') {
    //         this.setState({
    //             error_name: this.t('error_name')
    //         })
    //     } else {
    //         this.requestUpdateInfo();
    //     }
    // }

    /**
     * 0: nam, 1: nu
     * 0: chuyen nghiep, 1: nghiep du
     */
    requestUpdateInfo(userInfo, contacts) {
        this.loading.showLoading();
        let url = this.getConfig().getBaseUrl() + ApiService.update_info_after_register(userInfo.uid, userInfo.isProfession ? 1 : 0, userInfo.isMale ? 0 : 1, userInfo.fullName);
        let self = this;
        console.log('url', url);

        let formData = {
            'list_id_friends_facebook': [],
            'list_phonebook_sync': contacts
        }

        Networking.httpRequestPost(url, (jsonData) => {
            console.log('requestUpdateInfo', jsonData)
            if (jsonData.error_code === 0) {
                self.getUserInfo().setUserType(3);
                self.saveData(3)
                if (contacts.length > 0) {
                    self.props.navigation.replace('suggest_friend_view', { 'phone': this.phone, 'isNewUser': true });
                } else {
                    self.props.navigation.replace('LeaderBoardView', { 'isNewUser': true });
                }

            } else {
                self.showErrorMsg(jsonData.error_msg);
            }
            if (self.loading)
                self.loading.hideLoading();
        }, formData, () => {
            if (self.loading)
                self.loading.hideLoading();
        });

    }

    saveData(userType) {
        DataManager.saveLocalData(
            [[Constant.USER.USER_TYPE, userType.toString()]], (error) => console.log('saveLocalData', error));
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    text_suggest: {
        color: '#3B3B3B',
        textAlign: 'center',
        marginTop: verticalScale(30),
        marginBottom: verticalScale(30),
        marginLeft: scale(20),
        marginRight: scale(20),
        fontSize: fontSize(17),
        fontWeight: 'bold'
    },
    view_content: {
        flex: 1,
        backgroundColor: '#F6F6F6'
    },
    txt_gender: {
        fontSize: fontSize(17, scale(3)),
        color: '#525252'
    },
    view_gender: {
        flexDirection: 'row'
    },
    txt_male: {
        fontSize: fontSize(15, scale(1))
    },
    view_item: {
        flexDirection: 'row'
    },
    img_check: {
        width: verticalScale(25),
        height: verticalScale(25),
        resizeMode: 'contain',
        marginRight: scale(15),
    },
    view_btn: {
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: verticalScale(30)
    },
    touchable_complete: {
        backgroundColor: '#00ABA7',
        minHeight: verticalScale(40),
        borderRadius: verticalScale(20),
        justifyContent: 'center',
        alignItems: 'center'
    },
    txt_complete: {
        color: '#fff',
        fontSize: fontSize(17, scale(3)),
        paddingLeft: scale(30),
        paddingRight: scale(30)
    },
    view_textfield: {
        marginLeft: verticalScale(25),
        marginRight: verticalScale(25)
    },
    swiper_content: {
        margin: scale(20),
        backgroundColor: 'rgba(0, 0, 0, 0)'
    },
    view_border_swiper: {
        backgroundColor: '#fff',
        flex: 1,
        marginLeft: 20,
        marginRight: 20,
        marginTop: 20,
        marginBottom: 20,
        borderColor: '#DEDEDE',
        borderRadius: 10,
        borderWidth: 1,
        padding: scale(10)
    }
});