import React from 'react';
import {
    Platform,
    StyleSheet,
    Text,
    View,
    BackHandler,
    Image,
    TouchableOpacity,
    TextInput,
    Keyboard,
    KeyboardAvoidingView
} from 'react-native';
import Touchable from 'react-native-platform-touchable';
import BaseComponent from '../../../Core/View/BaseComponent';
import HeaderView from '../../HeaderView';
import Networking from '../../../Networking/Networking';
import ApiService from '../../../Networking/ApiService';
import { scale, verticalScale, moderateScale, fontSize } from '../../../Config/RatioScale';
import PopupAttachImage from '../../Common/PopupAttachImage';

export default class UpdateClubInfoView extends BaseComponent {

    static defaultProps = {

    }

    constructor(props) {
        super(props);

        let { clubName, clubId, logoUrl, introduce } = this.props.navigation.state.params;
        this.clubName = clubName;
        this.clubId = clubId;
        this.isMenuEnable = false;
        this.isLogoUpdate = false;
        this.isUpdateSuccess = false;
        this.oldIntroduce = introduce;
        this.logoUri = logoUrl;
        this.state = {
            introduceClb: introduce,
            logoUri: logoUrl
        }

        this.onBackPress = this.onBackPress.bind(this);
        this.onChangeLogoPress = this.onChangeLogoPress.bind(this);
        this.onChangeText = this.onChangeText.bind(this);
        this.onMenuHeaderClick = this.onMenuHeaderClick.bind(this);
        this.onTakePhotoClick = this.onTakePhotoClick.bind(this);
        this.onImportGalleryClick = this.onImportGalleryClick.bind(this);
    }

    render() {
        let {
            introduceClb,
            logoUri
        } = this.state;

        return (
            <KeyboardAvoidingView style={styles.container}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 40 : 10}
                behavior="padding"
                enabled>
                <View style={styles.container}>
                    <HeaderView
                        ref={(refHeaderView) => { this.refHeaderView = refHeaderView }}
                        title={this.t('club_info')}
                        handleBackPress={this.onBackPress}
                        menuTitle={this.t('done')}
                        onMenuHeaderClick={this.onMenuHeaderClick}
                        isEnable={false} />

                    <View style={styles.container_content}>
                        <View style={[styles.view_border, { marginTop: scale(10) }]}>
                            <Text allowFontScaling={global.isScaleFont} style={[styles.txt_title, {}]}>{this.t('logo_club')}</Text>
                            <View style={styles.line} />
                            <View style={styles.view_logo}>
                                <Image
                                    style={styles.img_logo}
                                    source={{ uri: logoUri }} />
                                <View style={styles.view_select_file}>
                                    <TouchableOpacity style={styles.touchable_select_file}
                                        onPress={this.onChangeLogoPress}>
                                        <Text allowFontScaling={global.isScaleFont} style={styles.txt_select_file}>{this.t('select_file')}</Text>
                                    </TouchableOpacity>
                                </View>

                            </View>
                        </View>
                        {/* <KeyboardAvoidingView style={styles.container}
                        keyboardVerticalOffset={Platform.OS === 'ios' ? 10 : 0}
                        behavior="padding"
                        enabled> */}
                        <View style={[styles.view_border, { flex: 1, marginTop: scale(20), paddingBottom: scale(3) }]}>
                            <Text allowFontScaling={global.isScaleFont} style={[styles.txt_title, {}]}>{this.t('introduce_about_club')}</Text>
                            <View style={styles.line} />
                            <TextInput allowFontScaling={global.isScaleFont}
                                style={styles.input_introduce}
                                placeholder={this.t('enter_info')}
                                placeholderTextColor='#8A8A8F'
                                underlineColorAndroid='rgba(0,0,0,0)'
                                value={introduceClb}
                                onChangeText={this.onChangeText}
                                multiline={true}
                            />
                        </View>
                        {/* </KeyboardAvoidingView> */}
                        {this.renderInternalLoading()}
                    </View>

                    <PopupAttachImage
                        ref={(popupAttachImage) => { this.popupAttachImage = popupAttachImage; }}
                        onTakePhotoClick={this.onTakePhotoClick}
                        onImportGalleryClick={this.onImportGalleryClick} />

                    {this.renderMessageBar()}
                </View>
            </KeyboardAvoidingView>
        );
    }

    onBackPress() {
        if (this.props.navigation) {
            this.props.navigation.goBack();
            if (this.isUpdateSuccess && this.props.navigation.state.params.updateCallback) {
                this.props.navigation.state.params.updateCallback(this.state.introduceClb, this.logoUri);
            }
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

    onChangeLogoPress() {
        Keyboard.dismiss();
        this.popupAttachImage.show();
    }

    onTakePhotoClick = async () => {
        let imageUri = await this.getAppUtil().onTakePhotoClick(true);
        // console.log('imageUri', imageUri);

        if (!imageUri.didCancel) {
            this.setState({
                logoUri: imageUri.path,
            }, () => {
                if (!this.isMenuEnable) {
                    this.refHeaderView.setMenuEnable(true);
                    this.isMenuEnable = true;
                    this.isLogoUpdate = true;
                }

            });
        }

    }

    onImportGalleryClick = async () => {
        let imageUri = await this.getAppUtil().onImportGalleryClick(true);
        // console.log('imageUri', Platform.OS === 'android' ? 'file://' + imageUri.path : imageUri);
        if (!imageUri.didCancel) {
            this.setState({
                logoUri: imageUri.path,
            }, () => {
                if (!this.isMenuEnable) {
                    this.refHeaderView.setMenuEnable(true);
                    this.isMenuEnable = true;
                    this.isLogoUpdate = true;
                }
            });
        }
    }

    onChangeText(text) {
        if (text) {
            this.setState({
                introduceClb: text
            }, () => {
                if (text !== this.oldIntroduce) {
                    if (!this.isMenuEnable) {
                        this.refHeaderView.setMenuEnable(true);
                        this.isMenuEnable = true;
                    }
                } else if (!this.isLogoUpdate && this.isMenuEnable) {
                    this.refHeaderView.setMenuEnable(false);
                    this.isMenuEnable = false;
                }
            })
        } else if (!this.isLogoUpdate) {
            this.refHeaderView.setMenuEnable(false);
            this.isMenuEnable = false;
        }
    }

    onMenuHeaderClick() {
        // if (this.isLogoUpdate && this.state.introduceClb != this.oldIntroduce){

        // }
        Keyboard.dismiss();
        this.requestUpdateInfo();
    }

    requestUpdateInfo() {
        let formData = {
            "about": this.state.introduceClb
        }
        this.refHeaderView.setMenuEnable(false);
        console.log('formData check cap ', formData);
        let url = this.getConfig().getBaseUrl() + ApiService.update_info_club(this.clubId);
        console.log('url', url);
        this.internalLoading.showLoading();
        let self = this;
        Networking.httpRequestPost(url, (jsonData) => {
            console.log('requestUpdateInfo', jsonData)
            if (jsonData.error_code === 0) {
                self.isUpdateSuccess = true;
                console.log('isLogoUpdate', self.isLogoUpdate)
                if (self.isLogoUpdate) {
                    self.requestUploadImage();
                } else {
                    self.onBackPress();
                }

            } else {
                self.showErrorMsg(jsonData.error_msg);
                self.refHeaderView.setMenuEnable(true);
            }
            self.internalLoading.hideLoading();
        }, formData, () => {
            self.refHeaderView.setMenuEnable(true);
            self.internalLoading.hideLoading();
        });
    }

    requestUploadImage() {
        let self = this;
        // this.progressUpload.showLoading();
        let url = this.getConfig().getBaseUrl() + ApiService.upload_logo_club(this.clubId);
        console.log('url', url);
        this.getAppUtil().upload(url, this.state.logoUri,
            this.onUploadSuccess.bind(this),
            (error) => {
                // self.progressUpload.hideLoading();
                self.onBackPress();
            }, (progress) => {
                // self.progressUpload.setProgress(progress);
            });
    }

    onUploadSuccess(jsonData) {
        self.onBackPress();
        console.log('onUploadSuccess', jsonData);
        // this.progressUpload.hideLoading();
        if (jsonData != null && jsonData.hasOwnProperty('error_code')) {
            if (jsonData['error_code'] === 0) {
                try {
                    this.isUpdateSuccess = true;
                    this.logoUri = jsonData['data'].logo_url_path;
                } catch (error) {
                    console.log(error);
                }

            } else {
                // console.log('showErrorMsg3')
                // this.showErrorMsg(jsonData['error_msg']);
            }
        }
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        flexDirection: 'column'
    },
    container_content: {
        flex: 1,
        margin: scale(10)
    },
    txt_title: {
        fontSize: fontSize(15),
        color: '#474747',
        fontWeight: 'bold',
        marginLeft: scale(10),
        marginTop: scale(5),
        marginBottom: scale(5)
    },
    view_logo: {
        flexDirection: 'row',
        margin: scale(10)
    },
    img_logo: {
        width: scale(90),
        height: scale(90),
        resizeMode: 'contain'
    },
    view_select_file: {
        justifyContent: 'center'
    },
    touchable_select_file: {
        borderColor: '#0BABA6',
        borderWidth: 1,
        borderRadius: scale(6),
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: scale(20)
    },
    txt_select_file: {
        color: '#0BABA6',
        fontSize: fontSize(14),
        paddingLeft: scale(20),
        paddingRight: scale(20),
        paddingTop: scale(10),
        paddingBottom: scale(10)
    },
    input_introduce: {
        flex: 1,
        padding: 4,
        fontSize: fontSize(14),
        marginLeft: scale(10),
        marginRight: scale(10),
        textAlignVertical: 'top'
        // maxHeight: scale(60)
        // backgroundColor: '#fff',
        // borderRadius: 20,
        // borderColor: '#C2C2C2',
        // borderWidth: 1,
    },
    view_border: {
        borderWidth: 1,
        borderColor: '#D6D4D4',
        borderRadius: scale(6)
    },
    line: {
        height: 1,
        backgroundColor: '#D6D4D4'
    }
});