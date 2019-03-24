import React, { PureComponent } from 'react';
import {
    Platform,
    StyleSheet,
    Text,
    View,
    ImageBackground,
    Image,
    TouchableOpacity,
    TextInput
} from 'react-native';
import Touchable from 'react-native-platform-touchable';
import BaseComponent from '../../../Core/View/BaseComponent';
import ApiService from '../../../Networking/ApiService';
import Files from '../../Common/Files';
import CustomAvatar from '../../Common/CustomAvatar';
import ProgressUpload from '../../Common/ProgressUpload';
import PopupChangeGroupName from '../../Common/PopupChangeGroupName';
import AppUtil from '../../../Config/AppUtil';
import Config from '../../../Config/Config';
import Networking from '../../../Networking/Networking';
import { verticalScale, scale, fontSize } from '../../../Config/RatioScale';
import MyView from '../../../Core/View/MyView';
import { Avatar } from 'react-native-elements';


export default class GroupMemberHeaderView extends BaseComponent {

    static defaultProps = {
        groupName: '',
        logoGroup: '',
        isAllowEdit: false,
        groupId: '',
        isCreate: false
    }

    constructor(props) {
        super(props);

        this.state = {
            logoGroup: this.props.logoGroup,
            groupName: this.props.groupName
        }
        this.onChangeLogo = this.onChangeLogo.bind(this);
        this.onEditGroupName = this.onEditGroupName.bind(this);
        this.onConfirmClick = this.onConfirmClick.bind(this);
    }

    renderPen(isAllowEdit) {
        if (!isAllowEdit) return null;

        return (
            <Image
                style={styles.img_pen}
                source={this.getResources().pen} />
        )
    }

    render() {
        let { isAllowEdit } = this.props;
        let { logoGroup, groupName } = this.state;

        console.log('GroupMemberHeaderView', groupName, logoGroup);

        return (
            <View style={styles.view_header}>

                <View style={{ width: verticalScale(70), height: verticalScale(70), justifyContent: 'center', alignItems: 'center' }}>
                    <CustomAvatar
                        width={verticalScale(70)}
                        height={verticalScale(70)}
                        uri={logoGroup}
                        onAvatarClick={this.onChangeLogo}
                    />
                    {/* <Avatar rounded
                        containerStyle={[{ backgroundColor: '#CCCCCC' }]}
                        // avatarStyle={styles.avatar_style}
                        source={logoGroup ? { uri: logoGroup } : this.getResources().ic_camera}
                        // icon={this.getResources().ic_camera}
                        height={verticalScale(70)}
                        width={verticalScale(70)}
                    /> */}
                    <View style={{ position: 'absolute', left: scale(20), right: 0, top: verticalScale(20), bottom: 0 }}>
                        <ProgressUpload
                            ref={(progressUpload) => { this.progressUpload = progressUpload; }}
                            isModalView={false}
                        />
                    </View>

                </View>

                <TouchableOpacity disabled={!isAllowEdit}
                    onPress={this.onEditGroupName}
                    style={{ flex: 1 }}>
                    <View style={styles.view_name}>
                        <TextInput allowFontScaling={global.isScaleFont}
                            style={styles.txt_group_name}
                            placeholder={this.t('dat_ten_nhom_title')}
                            placeholderTextColor='#8A8A8F'
                            underlineColorAndroid='rgba(0,0,0,0)'
                            value={groupName}
                            editable={false}
                        />
                        {this.renderPen(isAllowEdit)}
                    </View>
                </TouchableOpacity>
                <PopupChangeGroupName
                    ref={(refPopupChangeGroupName) => { this.refPopupChangeGroupName = refPopupChangeGroupName }}
                    onConfirmClick={this.onConfirmClick} />
                {this.renderInternalLoading()}
            </View>
        );
    }

    onChangeLogo() {
        let {
            isAllowEdit,
            onChangeLogo
        } = this.props;
        if (onChangeLogo && isAllowEdit) {
            this.props.onChangeLogo();
        }
    }

    setLogoUpdate(logoUrl = '') {
        this.setState({
            logoGroup: logoUrl
        })
    }

    setTimeOut() {
        this.intervalId = setInterval(() => {
            if (this.progressUpload) {
                this.progressUpload.hideLoading();
            }
            if (this.intervalId) {
                clearInterval(this.intervalId);
            }
        }, 15000);
    }
    /**
  * upload logo
  */
    requestUploadLogo(imageUri) {
        let { groupId } = this.props;
        let url = Config.getBaseUrl() + ApiService.group_update_logo(groupId);
        let self = this;
        if (this.progressUpload)
            this.progressUpload.showLoading();
        //time out up anh
        console.log('requestUploadLogo.url', url)
        this.setTimeOut();
        AppUtil.upload(url, imageUri, (jsonData) => {
            if (self.intervalId) {
                clearInterval(self.intervalId);
            }
            if (jsonData.hasOwnProperty('error_code')) {
                let error_code = parseInt(jsonData['error_code']);
                if (error_code === 0) {
                    console.log('jsonData', jsonData)
                    let data = jsonData['data'];
                    self.setState({
                        logoGroup: data.image_path
                    }, () => {
                        if (this.props.logoUpdateCallback) {
                            this.props.logoUpdateCallback(data.image_path);
                        }
                    });
                }
            }
            if (self.progressUpload)
                self.progressUpload.hideLoading();
        }, () => {
            if (self.intervalId) {
                clearInterval(self.intervalId);
            }
            if (self.progressUpload)
                self.progressUpload.hideLoading();
        }, (progress) => {
            if (self.progressUpload)
                self.progressUpload.setProgress(progress);
        });
    }



    onEditGroupName() {
        this.refPopupChangeGroupName.setContentAndShow(this.state.groupName);
    }

    onConfirmClick(groupName) {
        let { isCreate } = this.props;
        this.setState({
            groupName: groupName
        }, () => {
            if (groupName && this.props.onChangeGroupName) {
                if (!isCreate) {
                    this.requestChangeGroupName(groupName);
                } else {
                    this.props.onChangeGroupName(groupName);
                }
            }

        })
    }


    requestChangeGroupName(groupName) {
        let { groupId } = this.props;
        let url = Config.getBaseUrl() + ApiService.group_update(groupId);
        console.log('requestChangeGroupName.url', url)
        let self = this;
        let formData = {
            name: groupName
        }
        if (this.internalLoading)
            this.internalLoading.showLoading();
        Networking.httpRequestPost(url, (jsonData) => {
            if (self.internalLoading)
                self.internalLoading.hideLoading();
            console.log('requestChangeGroupName', jsonData)

            if (jsonData.hasOwnProperty('error_code')) {
                let error_code = parseInt(jsonData['error_code']);
                if (error_code === 0) {
                    this.props.onChangeGroupName(groupName);
                } else {
                    // self.popupNofity.setMsg(jsonData['error_msg']);
                }
            }
        }, formData, () => {
            if (self.internalLoading)
                self.internalLoading.hideLoading();
        });
    }

}

const styles = StyleSheet.create({

    view_header: {
        height: verticalScale(100),
        flexDirection: 'row',
        alignItems: 'center',
        paddingLeft: scale(10),
        paddingRight: scale(10)
        // justifyContent: 'center',
        // paddingLeft: 10
    },
    view_line: {
        backgroundColor: '#DADADA',
        height: verticalScale(8)
    },
    txt_group_name: {
        flex: 1,
        color: '#000',
        fontSize: fontSize(17, scale(3)),
        marginRight: scale(10)
    },
    view_name: {
        flex: 1,
        justifyContent: 'space-between',
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: scale(10)
    },
    img_pen: {
        width: scale(15),
        height: scale(15),
        resizeMode: 'contain',
        tintColor: '#A5A5A5'
    }
});