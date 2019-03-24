import React from 'react';
import {
    Platform,
    StyleSheet,
    Text,
    View,
    BackHandler,
    ScrollView,
    TouchableOpacity,
    Image,
    Dimensions,
    KeyboardAvoidingView,
    TextInput
} from 'react-native';
import Touchable from 'react-native-platform-touchable';
import BaseComponent from '../../Core/View/BaseComponent';
import HeaderView from '../HeaderView';
import Networking from '../../Networking/Networking';
import ApiService from '../../Networking/ApiService';
import { scale, verticalScale, fontSize } from '../../Config/RatioScale';
import PopupAttachImage from '../Common/PopupAttachImage';
import DatePicker from 'react-native-datepicker';
import { Avatar } from 'react-native-elements';
import moment from 'moment';
import PopupNotifyView from '../Common/PopupNotifyView';

const { width, height } = Dimensions.get("window");
const TIME_FORMAT = 'DD-MM-YYYY';

export default class ClubCreateView extends BaseComponent {

    static defaultProps = {

    }

    constructor(props) {
        super(props);

        this.clubName = '';
        this.creator = '';
        this.state = {
            logo_uri: '',
            create_date: '',
            activityImgs: ['', '', '', '', ''],
            countryCode: '',
            clubName: '',
            submitDisable: true
        }

        this.onBackPress = this.onBackPress.bind(this);
        this.onUploadLogoPress = this.onUploadLogoPress.bind(this);
        this.onImportGalleryClick = this.onImportGalleryClick.bind(this);
        this.onTakePhotoClick = this.onTakePhotoClick.bind(this);
        this.onDateChange = this.onDateChange.bind(this);
        this.onSelectCountry = this.onSelectCountry.bind(this);
        this.onCountryCodeCallback = this.onCountryCodeCallback.bind(this);
        this.onInputCreatorNameChange = this.onInputCreatorNameChange.bind(this);
        this.onInputClubNameChange = this.onInputClubNameChange.bind(this);
        this.onSubmitRecord = this.onSubmitRecord.bind(this);
        this.onPopupNotifyConfirm = this.onPopupNotifyConfirm.bind(this);
    }

    renderClubName() {
        return (
            <View style={styles.view_item_row}>
                {/* <Image
                    style={styles.img_icon}
                    source={this.getResources().ic_account} /> */}
                <TextInput allowFontScaling={global.isScaleFont}
                    style={styles.input_name}
                    placeholder={this.t('club_name')}
                    placeholderTextColor='#979797'
                    underlineColorAndroid='rgba(0,0,0,0)'
                    onChangeText={this.onInputClubNameChange}
                />
            </View>
        )
    }

    renderLogoImage(logo_uri) {
        console.log('renderLogoImage', logo_uri)
        if (logo_uri) {
            return (
                <Avatar
                    width={scale(70)}
                    height={scale(70)}
                    // containerStyle={{ marginLeft: scale(10), marginTop: verticalScale(10) }}
                    rounded={true}
                    source={{ uri: logo_uri }}
                    onPress={this.onUploadLogoPress} />
            )
        } else {
            return (
                <TouchableOpacity style={styles.touchable_logo}
                    onPress={this.onUploadLogoPress}>
                    <Image
                        style={styles.img_camera}
                        source={this.getResources().ic_image_add} />
                </TouchableOpacity>
            )
        }
    }

    renderActivityImgs(activityImgs) {
        let size = (width - 60) / 5;
        let imgList = activityImgs.map((img, index) => {
            if (img) {
                return (
                    <Image
                        style={[styles.img_activity, { width: size, height: size, maxHeight: scale(70), maxWidth: scale(70) }]}
                        source={{ uri: img }} />
                )
            } else {
                return (
                    <TouchableOpacity style={[styles.touchable_activity, { width: size, height: size, maxHeight: scale(70), maxWidth: scale(70) }]}
                        onPress={this.onUploadActivity.bind(this, index)}>
                        <Image
                            style={styles.img_camera}
                            source={this.getResources().ic_image_add} />
                    </TouchableOpacity>
                )
            }

        })

        return (
            <View style={styles.view_img_activity}>
                {imgList}
            </View>
        )
    }

    renderCreateDate(create_date) {
        return (
            <View style={styles.view_item_row}>
                <Image
                    style={styles.img_icon}
                    source={this.getResources().ic_calender} />

                <DatePicker
                    ref={(datePicker) => { this.datePicker = datePicker; }}
                    style={styles.datepicker}
                    mode='date'
                    allowFontScaling={global.isScaleFont}
                    date={create_date}
                    placeholder={this.t('dd_mm_yyyy')}
                    format={TIME_FORMAT}
                    // minDate={`${strMinDate}`}
                    // maxDate={`${strMaxDate}`}
                    confirmBtnText={this.t('agree')}
                    cancelBtnText={this.t('cancel')}
                    androidMode='spinner'
                    showIcon={false}
                    // iconSource={this.getResources().ic_calender}
                    customStyles={{
                        dateInput: {
                            borderWidth: 0,
                            justifyContent: 'flex-start',
                            flexDirection: 'row',
                        },
                        placeholderText: {
                            fontSize: fontSize(15),
                            color: '#979797',
                        },
                        dateText: {
                            fontSize: fontSize(15),
                            color: '#424242',
                        },
                        // dateIcon: {
                        //     height: scale(25),
                        //     width: scale(25),
                        //     resizeMode: 'contain',
                        // }
                    }}
                    onDateChange={this.onDateChange}
                />
            </View>
        )
    }

    renderCreator() {
        return (
            <View style={styles.view_item_row}>
                <Image
                    style={styles.img_icon}
                    source={this.getResources().ic_account} />
                <TextInput allowFontScaling={global.isScaleFont}
                    style={styles.input_name}
                    placeholder={this.t('name')}
                    placeholderTextColor='#979797'
                    underlineColorAndroid='rgba(0,0,0,0)'
                    onChangeText={this.onInputCreatorNameChange}
                />

            </View>
        )
    }

    render() {
        let {
            create_date,
            logo_uri,
            activityImgs,
            countryCode,
            submitDisable
        } = this.state;
        return (
            <KeyboardAvoidingView style={styles.container}
                behavior="padding"
                enabled>
                <HeaderView
                    title={this.t('create_club')}
                    handleBackPress={this.onBackPress} />

                <ScrollView style={styles.scrollview_container}>
                    <Text allowFontScaling={global.isScaleFont} style={styles.txt_provide_info}>
                        {this.t('club_provide_info')}
                    </Text>

                    <Text allowFontScaling={global.isScaleFont} style={styles.txt_title_item}>
                        {this.t('club_name_create')}
                    </Text>
                    {this.renderClubName()}
                    <View style={styles.line} />

                    <View style={styles.view_logo}>
                        <Text allowFontScaling={global.isScaleFont} style={styles.txt_title_item}>
                            {this.t('club_upload_logo')}
                        </Text>
                        {this.renderLogoImage(logo_uri)}
                    </View>

                    <Text allowFontScaling={global.isScaleFont} style={styles.txt_title_item}>
                        {this.t('club_upload_activities')}
                    </Text>
                    {this.renderActivityImgs(activityImgs)}

                    <Text allowFontScaling={global.isScaleFont} style={styles.txt_title_item}>
                        {this.t('club_create_date')}
                    </Text>
                    {this.renderCreateDate(create_date)}
                    <View style={styles.line} />

                    <Text allowFontScaling={global.isScaleFont} style={styles.txt_title_item}>
                        {this.t('club_creator')}
                    </Text>
                    {this.renderCreator()}
                    <View style={styles.line} />

                    <Text allowFontScaling={global.isScaleFont} style={styles.txt_title_item}>
                        {this.t('club_country')}
                    </Text>
                    <TouchableOpacity onPress={this.onSelectCountry}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Avatar rounded
                                width={scale(20)}
                                height={scale(20)}
                                containerStyle={[styles.img_icon_rectangle, { marginRight: 0 }]}
                                source={countryCode.image ? countryCode.image : this.getResources().world}
                            />
                            <Text allowFontScaling={global.isScaleFont} style={styles.txt_triangle}>{'▼'}</Text>
                            <Text allowFontScaling={global.isScaleFont} style={styles.txt_country}>
                                {countryCode.name ? countryCode.name : this.t('country')}
                            </Text>
                        </View>
                    </TouchableOpacity>
                    <View style={[styles.line, { marginBottom: 10, marginTop: 3 }]} />
                </ScrollView>

                <View style={styles.view_submit}>
                    <TouchableOpacity style={[styles.touchable_submit, { opacity: submitDisable ? 0.5 : 1 }]}
                        onPress={this.onSubmitRecord}
                        disabled={submitDisable}>
                        <Text allowFontScaling={global.isScaleFont} style={styles.txt_submit}>
                            {this.t('send_record')}
                        </Text>
                    </TouchableOpacity>
                </View>

                <PopupAttachImage
                    ref={(popupAttachImage) => { this.popupAttachImage = popupAttachImage; }}
                    onTakePhotoClick={this.onTakePhotoClick}
                    onImportGalleryClick={this.onImportGalleryClick} />

                <PopupNotifyView
                    ref={(popupNotify) => { this.popupNotify = popupNotify; }}
                    content={this.t('club_create_recorded')}
                    confirmText={this.t('ok')}
                    onConfirmClick={this.onPopupNotifyConfirm} />
                {this.renderMessageBar()}
                {this.renderLoading()}
            </KeyboardAvoidingView>
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

    onUploadLogoPress() {
        this.popupAttachImage.show(null, -1);
    }

    onUploadActivity(index) {
        console.log('onUploadActivity', index)
        this.popupAttachImage.show(null, index);
    }

    onDateChange(date) {
        this.setState({
            create_date: date,
            submitDisable: this.isSubmitDisable(this.state.logo_uri, date, this.state.countryCode)
        })
    }

    onInputClubNameChange(input) {
        this.clubName = input;
        this.setState({
            submitDisable: this.isSubmitDisable()
        })
    }

    onInputCreatorNameChange(input) {
        console.log('onInputCreatorNameChange', input);
        this.creator = input;
        this.setState({
            submitDisable: this.isSubmitDisable()
        })
    }

    onTakePhotoClick = async (index) => {
        let imageUri = await this.getAppUtil().onTakePhotoClick(index === -1 ? true : false);
        // console.log('imageUri', imageUri);
        if (!imageUri.didCancel) {
            this.getAppUtil().resizeImage(imageUri.path, imageUri.width, imageUri.height, imageUri.size)
                .then(({ uri }) => {
                    console.log('uri', uri)
                    this.setDataImage(index, uri);
                })
                .catch(err => {
                    console.log(err);
                    this.setDataImage(index, imageUri.path);
                });
        }

    }

    onImportGalleryClick = async (index) => {
        let imageUri = await this.getAppUtil().onImportGalleryClick(index === -1 ? true : false);
        // console.log('imageUri', imageUri.path, index);
        if (!imageUri.didCancel) {
            this.getAppUtil().resizeImage(imageUri.path, imageUri.width, imageUri.height, imageUri.size)
                .then(({ uri }) => {
                    console.log('uri', uri)
                    this.setDataImage(index, uri);
                })
                .catch(err => {
                    console.log(err);
                    this.setDataImage(index, imageUri.path);
                });
        }
    }

    setDataImage(index, path) {
        if (index === -1) {
            this.setState({
                logo_uri: path,
                submitDisable: this.isSubmitDisable(path, this.state.create_date, this.state.countryCode)
            }, () => {
                // this.onUploadAvatar(imageUri);
            });
        } else {
            this.state.activityImgs[index] = path;
            this.setState({
                activityImgs: this.state.activityImgs,
                submitDisable: this.isSubmitDisable()
            }, () => {
                // this.onUploadAvatar(imageUri);
            });
        }

    }

    onSelectCountry() {
        console.log('onSelectCountry', this.props)
        this.props.navigation.navigate('country_code_screen', {
            'title': this.t('country'),
            countryCodeCallback: this.onCountryCodeCallback
        })
    }

    onCountryCodeCallback(countryCode) {
        this.setState({
            countryCode: countryCode,
            submitDisable: this.isSubmitDisable(this.state.logo_uri, this.state.create_date, countryCode)
        })
    }

    isSubmitDisable(logo_uri, create_date, countryCode) {
        if (this.clubName && countryCode && create_date && this.creator && logo_uri) {
            console.log('isSubmitDisable.true')
            return false;
        }
        console.log('isSubmitDisable.false')
        return true;
    }

    onSubmitRecord() {
        this.uploadImage();
    }

    uploadImage() {
        this.loading.showLoading();
        let self = this;
        let url = this.getConfig().getBaseUrl() + ApiService.club_upload_create();
        let imgList = this.state.activityImgs.filter((item) => {
            return item != '';
        })
        console.log('imgList', [this.state.logo_uri, ...imgList])

        this.getAppUtil().upload_mutil(url, [this.state.logo_uri, ...imgList],
            (jsonData) => {
                if (jsonData.error_code === 0) {
                    let uris = jsonData.data.image_paths.map((obj) => {
                        return obj.url;
                    })
                    if (uris && uris.length > 0) {
                        this.requestCreateClub(uris);
                    } else {
                        this.loading.hideLoading();
                    }

                }
            }, (error) => {
                console.log('onPostCallback.error', error);
                this.loading.hideLoading();
            }, (progress) => {
                console.log('progress', progress)
            });
    }

    requestCreateClub(uris) {
        let {
            countryCode,
            create_date
        } = this.state;
        let time = moment(create_date, TIME_FORMAT);
        let timestamp = (new Date(time)).getTime();
        let imgActivity = uris.slice(1, uris.length);
        let fromData = {
            "name": this.clubName,
            "logo": uris[0],
            "img_path": imgActivity,
            "date_created": timestamp / 1000,
            "name_user_created": this.creator,
            "sortname_country": countryCode.sortname
        }

        console.log('onSubmitRecord', fromData)

        let self = this;

        let url = this.getConfig().getBaseUrl() + ApiService.club_create();
        Networking.httpRequestPost(url, (jsonData) => {
            self.loading.hideLoading();
            if (jsonData.error_code === 0) {
                self.popupNotify.show();
            } else {
                self.showErrorMsg(jsonData.error_msg);
            }

        }, fromData, () => {
            //time out
            self.loading.hideLoading();
            self.showErrorMsg(self.t('time_out'));
        });
    }

    onPopupNotifyConfirm() {
        this.onBackPress();
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    scrollview_container: {
        flex: 1,
        flexDirection: 'column',
        paddingLeft: 10,
        paddingRight: 10,
        paddingTop: 10,
        paddingBottom: 10
    },
    txt_provide_info: {
        color: '#424242',
        fontSize: 18,
        fontWeight: 'bold'
    },
    view_logo: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    txt_title_item: {
        color: '#808080',
        fontSize: fontSize(15),
        marginTop: scale(25),
        marginBottom: scale(10),
        textAlign: 'center'
    },
    touchable_logo: {
        width: scale(70),
        height: scale(70),
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#EEEEEE',
        borderRadius: scale(35)
    },
    img_camera: {
        width: scale(25),
        height: scale(25),
        resizeMode: 'contain'
    },
    touchable_activity: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#EEEEEE'
    },
    img_activity: {
        resizeMode: 'cover'
    },
    view_img_activity: {
        flexDirection: 'row',
        justifyContent: 'space-around'
    },
    touchable_submit: {
        backgroundColor: '#00ABA7',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: scale(15),
        marginTop: scale(10),
        height: scale(45),
        borderRadius: 5
    },
    view_submit: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    txt_submit: {
        color: 'white',
        fontSize: fontSize(18),
        paddingLeft: scale(20),
        paddingRight: scale(20)
    },
    datepicker: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    line: {
        height: 1,
        backgroundColor: '#D5D5D5'
    },
    view_item_row: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    img_icon: {
        height: scale(20),
        width: scale(20),
        resizeMode: 'contain',
        marginRight: scale(10),
        tintColor: '#858585'
    },
    img_icon_rectangle: {
        height: scale(20),
        width: scale(20),
        resizeMode: 'contain',
        tintColor: '#858585'
    },
    input_name: {
        fontSize: fontSize(15),
        color: '#424242',
        flex: 1,
        lineHeight: fontSize(18),
        padding: 0
    },
    txt_triangle: {
        color: '#7E7E7E',
        fontSize: fontSize(10),
        marginLeft: scale(30)
    },
    txt_country: {
        color: '#444444',
        fontSize: fontSize(15),
        marginLeft: scale(15)
    }
});