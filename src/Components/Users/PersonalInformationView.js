import React from 'react';
import {
    StyleSheet,
    Text,
    View,
    BackHandler,
    ScrollView,
    Animated
} from 'react-native';
import Touchable from 'react-native-platform-touchable';
import BaseComponent from '../../Core/View/BaseComponent';
import HeaderView from '../Common/HeaderView';
import PersionalHeader from './Items/PersionalHeader';
import PersionalCharacteristics from './Items/PersionalCharacteristics';
import PersionalInfo from './Items/PersionalInfo';
import PhoneNumberEdit from './Items/PhoneNumberEdit';
import PopupAttachImage from '../Common/PopupAttachImage';
import VipAccountInfo from './Items/VipAccountInfo';
import PersonalAccessories from './Items/PersonalAccessories';
import { verticalScale, scale } from '../../Config/RatioScale';
import PopupSelectAccessories from './Items/PopupSelectAccessories';
import PopupInputText from '../Common/PopupInputText';
import PopupYesOrNo from '../Common/PopupYesOrNo';

const TAG = "[Vhandicap-v1] PersonalInformationView : ";

export default class PersonalInformationView extends BaseComponent {
    constructor(props) {
        super(props);
        this.sendUpdateAvatarCallback = null;
        this.userProfile = this.getUserInfo().getUserProfile();
        // this.state = {
        //     scrollY: new Animated.Value(0),
        //     header_expanded_height: verticalScale(150),
        // }

        this.onBackClick = this.onBackClick.bind(this);
        this.onTakePhotoClick = this.onTakePhotoClick.bind(this);
        this.onImportGalleryClick = this.onImportGalleryClick.bind(this);
        this.onAccessoryPress = this.onAccessoryPress.bind(this);
        this.onAccessoryItemPress = this.onAccessoryItemPress.bind(this);
        this.onUpdateSuccess = this.onUpdateSuccess.bind(this);
        this.onCreateNewAccessory = this.onCreateNewAccessory.bind(this);
        this.onNewAccessoryCreated = this.onNewAccessoryCreated.bind(this);
        this.onConfirmPress = this.onConfirmPress.bind(this);
        this.onChangePhonePress = this.onChangePhonePress.bind(this);
    }

    componentDidMount() {
        this.handleHardwareBackPress();
        this.registerMessageBar();
        // this.headerView.setTitle(this.t('persional_info_title'));
        // this.headerView.callbackBack = this.onBackClick.bind(this);
        this.persionalHeader.setNavigation(this.props.navigation);

        this.persionalInfo.updateCompleteCallback = this.updateInfoCompalete.bind(this);
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
            self.onBackClick();
            return true;
        });
    }

    /**
 * load anh từ camera
 */
    async onTakePhotoClick() {
        let imageUri = await this.getAppUtil().onTakePhotoClick(true);
        if (this.sendUpdateAvatarCallback) {
            this.sendUpdateAvatarCallback(imageUri);
        }
    }

    /**
     * load ảnh từ thư viện
     */
    async onImportGalleryClick() {
        let imageUri = await this.getAppUtil().onImportGalleryClick(true);
        //this.sendUploadProfile(imageUri);
        if (this.sendUpdateAvatarCallback) {
            this.sendUpdateAvatarCallback(imageUri);
        }
    }

    /**
     * Button thay đổi ảnh đại diện
     */
    onChangeAvatar() {
        if (!this.popupSelectImage) return;
        this.popupSelectImage.show();

    }

    updateInfoCompalete() {
        this.persionalHeader.updateInfoView();
    }

    onBackClick() {
        if (this.props.navigation) {
            let {
                params
            } = this.props.navigation.state;
            if (params && params.personalCallback) {
                params.personalCallback();
            }
            this.props.navigation.goBack();
        }

        return true;
    }

    onAccessoryPress(type) {
        this.refPopupSelectAccessories.show(type);
    }

    onAccessoryItemPress(data, index) {
        switch (index) {
            case 0:
                this.refPersonalAccessories.onDriverSelected(data);
                break;
            case 1:
                this.refPersonalAccessories.onHybridSelected(data);
                break;
            case 2:
                this.refPersonalAccessories.onWoodenSticksSelected(data);
                break;
            case 3:
                this.refPersonalAccessories.onIronSetSelected(data);
                break;
            case 4:
                this.refPersonalAccessories.onTechnicalSticksSelected(data);
                break;
            case 5:
                this.refPersonalAccessories.onPutterSelected(data);
                break;
            case 6:
                this.refPersonalAccessories.onFilmBallSelected(data);
                break;
            default:
                break;
        }
    }

    onUpdateSuccess() {
        this.showSuccessMsg(this.t('update_success'))
    }

    onCreateNewAccessory(type) {
        this.refPopupInputText.show(type);
    }

    onNewAccessoryCreated(accessory, index) {
        console.log('onNewAccessoryCreated', accessory);
        switch (index) {
            case 0:
                this.refPersonalAccessories.onDriverSelected(accessory);
                break;
            case 1:
                this.refPersonalAccessories.onHybridSelected(accessory);
                break;
            case 2:
                this.refPersonalAccessories.onWoodenSticksSelected(accessory);
                break;
            case 3:
                this.refPersonalAccessories.onIronSetSelected(accessory);
                break;
            case 4:
                this.refPersonalAccessories.onTechnicalSticksSelected(accessory);
                break;
            case 5:
                this.refPersonalAccessories.onPutterSelected(accessory);
                break;
            case 6:
                this.refPersonalAccessories.onFilmBallSelected(accessory);
                break;
            default:
                break;
        }
    }

    onChangePhonePress(isDeletePhone) {
        if (isDeletePhone) {

        } else {
            this.refPopupConfirm.setContent(this.t('confirm_add_phone'), 1);
        }
    }

    onConfirmPress(type, extras) {
        if (type === 1) {
            // Add phone
        }
    }

    render() {
        return (
            <View style={styles.container}>

                <PersionalHeader ref={(persionalHeader) => { this.persionalHeader = persionalHeader; }}
                    parent={this}
                    onBackPress={this.onBackClick} />

                <ScrollView style={{ marginTop: scale(5) }}>
                    <VipAccountInfo
                        userProfile={this.userProfile}
                        navigation={this.props.navigation} />

                    <PersionalInfo ref={(persionalInfo) => { this.persionalInfo = persionalInfo; }}
                        navigation={this.props.navigation}
                        onUpdateSuccess={this.onUpdateSuccess} />
                    <PersonalAccessories
                        ref={(refPersonalAccessories) => { this.refPersonalAccessories = refPersonalAccessories }}
                        onAccessoryPress={this.onAccessoryPress}
                        onUpdateSuccess={this.onUpdateSuccess} />
                    <PhoneNumberEdit
                        onChangePhonePress={this.onChangePhonePress} />
                    <PersionalCharacteristics
                        onUpdateSuccess={this.onUpdateSuccess} />

                </ScrollView>

                <PopupAttachImage ref={(popupSelectImage) => { this.popupSelectImage = popupSelectImage; }}
                    onTakePhotoClick={this.onTakePhotoClick}
                    onImportGalleryClick={this.onImportGalleryClick} />
                <PopupSelectAccessories
                    ref={(refPopupSelectAccessories) => { this.refPopupSelectAccessories = refPopupSelectAccessories }}
                    onAccessoryItemPress={this.onAccessoryItemPress}
                    onCreateNewAccessory={this.onCreateNewAccessory} />
                <PopupInputText
                    ref={(refPopupInputText) => { this.refPopupInputText = refPopupInputText }}
                    onConfirmClick={this.onNewAccessoryCreated} />

                <PopupYesOrNo
                    ref={(refPopupConfirm) => { this.refPopupConfirm = refPopupConfirm; }}
                    confirmText={this.t('agree')}
                    cancelText={this.t('cancel')}
                    onConfirmClick={this.onConfirmPress} />

                {this.renderMessageBar()}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff'
    },
});