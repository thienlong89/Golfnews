import React from 'react';
import {
    Platform,
    StyleSheet,
    Text,
    View,
    BackHandler,
    KeyboardAvoidingView,
    Image,
    TextInput,
    TouchableOpacity,
    ScrollView,
    Dimensions
} from 'react-native';
import Touchable from 'react-native-platform-touchable';
import BaseComponent from '../../Core/View/BaseComponent';
import HeaderView from '../HeaderView';
import Networking from '../../Networking/Networking';
import ApiService from '../../Networking/ApiService';
import { scale, verticalScale, moderateScale, fontSize } from '../../Config/RatioScale';
import PopupAttachImage from '../Common/PopupAttachImage';
import DatePicker from 'react-native-datepicker';
import PopupNotifyView from '../Common/PopupNotifyView';
import moment from 'moment';
import AutoScaleLocalImage from '../Common/AutoScaleLocalImage';

const { width } = Dimensions.get('window');
const TIME_FORMAT = 'HH:mm, DD/MM/YYYY';

export default class CreateTournamentsView extends BaseComponent {

    static defaultProps = {

    }

    constructor(props) {
        super(props);

        // const timestamp = Date.now();
        let minDate = new Date();
        this.strMinDate = `${minDate.getHours()}:${minDate.getMinutes()}, ${minDate.getDate()}/${minDate.getMonth() + 1}/${minDate.getFullYear()}`;

        this.tournamentName = '';
        this.numberGolfer = 0;
        this.fees = 0;
        this.phoneNumber = '';
        this.facilitySelected = '';
        this.regulationPath = '';
        this.posterLink = '';
        this.regulationsLink = '';
        this.state = {
            isCreateEnable: false,
            posterUrl: '',
            regulationName: '',
            courseName: '',
            datetime: '',
            feesDisplay: ''
        }

        this.onBackPress = this.onBackPress.bind(this);
        this.onInputTournamentNameChange = this.onInputTournamentNameChange.bind(this);
        this.onInputCourseNameChange = this.onInputCourseNameChange.bind(this);
        this.onInputCompetitionDayChange = this.onInputCompetitionDayChange.bind(this);
        this.onInputNumberGolferChange = this.onInputNumberGolferChange.bind(this);
        this.onInputFeesChange = this.onInputFeesChange.bind(this);
        this.onInputPhoneChange = this.onInputPhoneChange.bind(this);
        this.onSelectImageFilePress = this.onSelectImageFilePress.bind(this);
        this.onSelectRegulationsPress = this.onSelectRegulationsPress.bind(this);
        this.onCreateTournamentPress = this.onCreateTournamentPress.bind(this);
        this.onTakePhotoClick = this.onTakePhotoClick.bind(this);
        this.onImportGalleryClick = this.onImportGalleryClick.bind(this);
        this.onRemovePosterPress = this.onRemovePosterPress.bind(this);
        this.onFacilityFocus = this.onFacilityFocus.bind(this);
        this.onItemCourseCallback = this.onItemCourseCallback.bind(this);
        this.onPopupNotifyConfirm = this.onPopupNotifyConfirm.bind(this);
    }

    renderImageFile(posterUrl) {
        if (posterUrl) {
            return (
                <View style={{ flex: 1 }}>
                    {/* <Image
                        style={styles.img_poster}
                        source={{ uri: posterUrl }} />
                    <TouchableOpacity style={styles.touchable_remove_poster}
                        onPress={this.onRemovePosterPress}>
                        <Image style={styles.img_close}
                            source={this.getResources().ic_delete} />
                    </TouchableOpacity> */}
                    <AutoScaleLocalImage
                        ref={(refPosterImg) => { this.refPosterImg = refPosterImg }}
                        // customStyle={styles.scorecard}
                        screenWidth={width}
                        onOpenImage={this.onSelectImageFilePress} />
                    <TouchableOpacity style={styles.touchable_close}
                        onPress={this.onRemovePosterPress}>
                        <Image
                            style={styles.img_close}
                            source={this.getResources().ic_x} />
                    </TouchableOpacity>
                </View>

            )
        } else {
            return (
                <Text allowFontScaling={global.isScaleFont} style={styles.txt_select}>{`+ ${this.t('select_image_file')}`}</Text>
            )
        }
    }

    renderRegulationName(regulationName) {
        if (regulationName) {
            return (
                <Text allowFontScaling={global.isScaleFont} style={styles.txt_select}>{regulationName}</Text>
            )
        } else {
            return (
                <Text allowFontScaling={global.isScaleFont} style={styles.txt_select}>{`+ ${this.t('select_regulations_file')}`}</Text>
            )
        }
    }

    renderDateTime(datetime) {
        return (
            <DatePicker
                ref={(datePicker) => { this.datePicker = datePicker; }}
                style={styles.datepicker}
                mode='datetime'
                allowFontScaling={global.isScaleFont}
                date={datetime}
                placeholder={this.t('dd_mm_yyyy')}
                format={TIME_FORMAT}
                minDate={this.strMinDate}
                // maxDate={`${strMaxDate}`}
                confirmBtnText={this.t('agree')}
                cancelBtnText={this.t('cancel')}
                androidMode='spinner'
                showIcon={false}
                // iconSource={this.getResources().ic_calender}
                customStyles={{
                    dateInput: {
                        borderWidth: 0,
                        alignItems: 'flex-start',
                        // justifyContent: 'flex-start',
                        // flexDirection: 'row',
                        flex: 1
                    },
                    placeholderText: {
                        fontSize: fontSize(14),
                        color: '#979797',
                    },
                    dateText: {
                        fontSize: fontSize(14),
                        color: '#060606',
                        alignItems: 'center',
                        justifyContent: 'center',
                    },

                }}
                onDateChange={this.onInputCompetitionDayChange}
            />
        )
    }

    render() {
        let {
            isCreateEnable,
            posterUrl,
            regulationName,
            courseName,
            datetime,
            feesDisplay
        } = this.state;
        return (
            <View style={styles.container}>
                <HeaderView
                    title={this.t('create_tournament')}
                    handleBackPress={this.onBackPress} />
                <Text allowFontScaling={global.isScaleFont} style={styles.txt_title}>{this.t('create_tournament_title')}</Text>
                <KeyboardAvoidingView style={styles.view_content}
                    behavior="padding"
                    enabled>

                    <ScrollView style={{ paddingLeft: scale(10), paddingRight: scale(10) }}>
                        <View style={styles.view_item}>
                            <Image
                                style={styles.img_icon}
                                source={this.getResources().ic_tournament} />
                            <Text allowFontScaling={global.isScaleFont} style={styles.txt_item_title}>{this.t('tournament_name')}</Text>
                        </View>
                        <TextInput allowFontScaling={global.isScaleFont}
                            style={styles.input_text}
                            placeholder={this.t('enter_info')}
                            placeholderTextColor='#8A8A8F'
                            underlineColorAndroid='rgba(0,0,0,0)'
                            onChangeText={this.onInputTournamentNameChange}
                        />
                        <View style={styles.view_line} />


                        <View style={styles.view_item}>
                            <Image
                                style={styles.img_icon}
                                source={this.getResources().ic_map_header} />
                            <Text allowFontScaling={global.isScaleFont} style={styles.txt_item_title}>{this.t('golf_course')}</Text>
                        </View>
                        <TextInput allowFontScaling={global.isScaleFont}
                            style={styles.input_text}
                            placeholder={this.t('enter_info')}
                            placeholderTextColor='#8A8A8F'
                            underlineColorAndroid='rgba(0,0,0,0)'
                            onChangeText={this.onInputCourseNameChange}
                            onFocus={this.onFacilityFocus}
                            value={courseName}
                        />
                        <View style={styles.view_line} />


                        <View style={styles.view_item}>
                            <Image
                                style={styles.img_icon}
                                source={this.getResources().tee_time_icon} />
                            <Text allowFontScaling={global.isScaleFont} style={styles.txt_item_title}>{this.t('competition_day')}</Text>
                        </View>
                        {/* <TextInput allowFontScaling={global.isScaleFont}
                            style={styles.input_text}
                            placeholder={this.t('enter_info')}
                            placeholderTextColor='#8A8A8F'
                            underlineColorAndroid='rgba(0,0,0,0)'
                            onChangeText={this.onInputCompetitionDayChange}
                        /> */}
                        {this.renderDateTime(datetime)}
                        <View style={styles.view_line} />


                        <View style={styles.view_row}>
                            <View style={{ flex: 1, marginRight: scale(10) }}>
                                <View style={styles.view_item}>
                                    <Image
                                        style={styles.img_icon}
                                        source={this.getResources().cactranbanbe} />
                                    <Text allowFontScaling={global.isScaleFont} style={styles.txt_item_title}>{this.t('number_of_golfers')}</Text>
                                </View>
                                <TextInput allowFontScaling={global.isScaleFont}
                                    style={styles.input_text}
                                    placeholder={this.t('enter_info')}
                                    placeholderTextColor='#8A8A8F'
                                    underlineColorAndroid='rgba(0,0,0,0)'
                                    keyboardType='numeric'
                                    maxLength={6}
                                    onChangeText={this.onInputNumberGolferChange}
                                />
                                <View style={styles.view_line} />
                            </View>

                            <View style={{ flex: 1, marginLeft: scale(10) }}>
                                <View style={styles.view_item}>
                                    <Image
                                        style={styles.img_icon}
                                        source={this.getResources().ic_fees} />
                                    <Text allowFontScaling={global.isScaleFont} style={styles.txt_item_title}>{this.t('fees')}</Text>
                                </View>
                                <View style={{ flexDirection: 'row', alignItems: 'flex-end' }}>
                                    <TextInput allowFontScaling={global.isScaleFont}
                                        style={styles.input_text}
                                        placeholder={this.t('enter_info')}
                                        placeholderTextColor='#8A8A8F'
                                        keyboardType='numeric'
                                        underlineColorAndroid='rgba(0,0,0,0)'
                                        onChangeText={this.onInputFeesChange}
                                        value={feesDisplay}
                                    />
                                    <Text allowFontScaling={global.isScaleFont} style={styles.txt_vnd}>{'VNĐ'}</Text>
                                </View>
                                <View style={styles.view_line} />
                            </View>
                        </View>

                        <View style={styles.view_item}>
                            <Image
                                style={styles.img_icon}
                                source={this.getResources().ic_smartphone} />
                            <Text allowFontScaling={global.isScaleFont} style={styles.txt_item_title}>{this.t('phone_creator_tournament')}</Text>
                        </View>
                        <TextInput allowFontScaling={global.isScaleFont}
                            style={styles.input_text}
                            placeholder={this.t('enter_info')}
                            placeholderTextColor='#8A8A8F'
                            keyboardType='numeric'
                            maxLength={20}
                            underlineColorAndroid='rgba(0,0,0,0)'
                            onChangeText={this.onInputPhoneChange}
                        />
                        <View style={styles.view_line} />


                        <View style={styles.view_row}>
                            <TouchableOpacity style={{ flex: 1 }}>
                                <View style={styles.view_item}>
                                    <Image
                                        style={styles.img_icon}
                                        source={this.getResources().ic_picture_blue} />
                                    <Text allowFontScaling={global.isScaleFont} style={styles.txt_item_title}>{this.t('upload_poster')}</Text>
                                </View>
                            </TouchableOpacity>

                            {/* <TouchableOpacity style={{ flex: 1 }}>
                                <View style={styles.view_item}>
                                    <Image
                                        style={styles.img_icon}
                                        source={this.getResources().ic_regulations} />
                                    <Text allowFontScaling={global.isScaleFont} style={styles.txt_item_title}>{this.t('regulations')}</Text>
                                </View>
                            </TouchableOpacity> */}
                        </View>

                        <View style={styles.view_row}>
                            <TouchableOpacity style={{ flex: 1, backgroundColor: '#F5F5F5', marginTop: scale(5) }}
                                onPress={this.onSelectImageFilePress}>
                                {this.renderImageFile(posterUrl)}
                            </TouchableOpacity>

                            {/* <TouchableOpacity style={{ flex: 1 }}
                                onPress={this.onSelectRegulationsPress}>
                                {this.renderRegulationName(regulationName)}
                            </TouchableOpacity> */}
                        </View>
                    </ScrollView>

                </KeyboardAvoidingView>

                <View style={styles.view_bottom}>
                    <TouchableOpacity style={[styles.touchable_create, { opacity: isCreateEnable ? 1 : 0.5 }]}
                        disabled={!isCreateEnable}
                        onPress={this.onCreateTournamentPress}>
                        <Text allowFontScaling={global.isScaleFont} style={styles.txt_create_tournament}>{this.t('create_tournament')}</Text>
                    </TouchableOpacity>
                </View>

                <PopupAttachImage
                    ref={(popupAttachImage) => { this.popupAttachImage = popupAttachImage; }}
                    onTakePhotoClick={this.onTakePhotoClick}
                    onImportGalleryClick={this.onImportGalleryClick} />

                <PopupNotifyView
                    ref={(popupNotify) => { this.popupNotify = popupNotify; }}
                    content={this.t('tournament_created')}
                    confirmText={this.t('ok')}
                    onConfirmClick={this.onPopupNotifyConfirm} />
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

    onInputTournamentNameChange(input) {
        this.tournamentName = input;
        this.validateInputData();
    }

    onInputCourseNameChange(input) {

    }

    onFacilityFocus(isFocus) {
        if (isFocus) {
            if (this.props.navigation) {
                this.props.navigation.navigate('search_facility_view',
                    {
                        "onItemCoursePress": this.onItemCourseCallback
                    });
            }
        }
    }

    onItemCourseCallback(facility) {
        console.log('onItemCourseCallback', facility);
        this.facilitySelected = facility;
        this.setState({
            courseName: facility.sub_title
        }, () => {
            this.validateInputData();
        })
    }

    onInputCompetitionDayChange(input) {
        this.setState({
            datetime: input
        }, () => {
            this.validateInputData();
        })
    }

    onInputNumberGolferChange(input) {
        this.numberGolfer = input;
        this.validateInputData();
    }

    onInputFeesChange(input = '') {
        while (input.includes(',')) {
            input = input.replace(',', '');
        }
        this.fees = input;
        console.log('onInputPhoneChange', input);
        this.phoneNumber = input;
        let format = this.getAppUtil().formatMoney(input, 0);
        this.setState({
            feesDisplay: format
        })
    }

    onInputPhoneChange(input) {
        this.phoneNumber = input;
        this.validateInputData();
    }

    onSelectImageFilePress() {
        this.popupAttachImage.show();
    }

    async onSelectRegulationsPress() {
        let file = await this.getAppUtil().onImportFile();
        console.log('onSelectRegulationsPress', file);
        if (file) {
            console.log(
                file.uri,
                file.type, // mime type
                file.fileName,
                file.fileSize
            );
        }
        if (file && file.uri) {
            this.setState({
                regulationName: file.fileName
            }, () => {
                this.requestUploadRegulations(file.uri);
                this.validateInputData();
            })
        }
    }

    requestUploadRegulations(path) {
        let url = this.getConfig().getBaseUrl() + ApiService.tournament_upload_file_rule_tour();
        console.log('requestUploadRegulations', url);
        let self = this;
        this.getAppUtil().uploadPdfFile(url, path,
            (jsonData) => {
                if (jsonData != null && jsonData.hasOwnProperty('error_code')) {
                    console.log('requestUploadRegulations', jsonData)
                    if (jsonData['error_code'] === 0) {
                        self.regulationsLink = jsonData['data']
                    } else {

                    }
                }
            }, (error) => {
                try {
                    self.showErrorMsg(error);
                } catch (error) {

                }
            }, (progress) => {
            });
    }

    async onTakePhotoClick() {
        let imageUri = await this.getAppUtil().onTakePhotoClick(false);
        if (!imageUri.didCancel) {
            this.setState({
                posterUrl: imageUri.path
            }, () => {
                if (this.refPosterImg)
                    this.refPosterImg.setNewUri(imageUri.path);
                this.getAppUtil().resizeImage(imageUri.path, imageUri.width, imageUri.height, imageUri.size)
                    .then(({ uri }) => {
                        console.log('uri', uri)
                        this.requestUploadPoster(uri);
                    })
                    .catch(err => {
                        console.log(err);
                        this.requestUploadPoster(imageUri.path);
                    });
                this.validateInputData();
            })
        }

    }

    async onImportGalleryClick() {
        let imageUri = await this.getAppUtil().onImportGalleryClick(false);
        if (!imageUri.didCancel) {
            this.setState({
                posterUrl: imageUri.path
            }, () => {
                if (this.refPosterImg)
                    this.refPosterImg.setNewUri(imageUri.path);
                this.getAppUtil().resizeImage(imageUri.path, imageUri.width, imageUri.height, imageUri.size)
                    .then(({ uri }) => {
                        console.log('uri', uri)
                        this.requestUploadPoster(uri);
                    })
                    .catch(err => {
                        console.log(err);
                        this.requestUploadPoster(imageUri.path);
                    });
                this.validateInputData();
            })
        }
    }

    requestUploadPoster(path) {
        let url = this.getConfig().getBaseUrl() + ApiService.tournament_upload_img_poster();
        console.log('requestUploadPoster', url);
        let self = this;
        this.getAppUtil().upload(url, path,
            (jsonData) => {
                if (jsonData != null && jsonData.hasOwnProperty('error_code')) {
                    console.log('requestUploadPoster', jsonData)
                    if (jsonData['error_code'] === 0) {
                        self.posterLink = jsonData['data']
                    } else {

                    }
                }
            }, (error) => {
                try {
                    self.showErrorMsg(error);
                } catch (error) {

                }
            }, (progress) => {
            });
    }

    onRemovePosterPress() {
        this.setState({
            posterUrl: '',
            isCreateEnable: false
        }, () => {
            this.posterLink = '';
        })
    }

    validateInputData() {
        let {
            isCreateEnable,
            courseName,
            datetime
        } = this.state;
        if (this.facilitySelected && datetime && this.tournamentName && this.numberGolfer > 0 && this.fees && this.phoneNumber) {
            if (!isCreateEnable) {
                this.setState({
                    isCreateEnable: true
                })
            }
        } else if (isCreateEnable) {
            this.setState({
                isCreateEnable: false
            })
        }
    }

    onCreateTournamentPress() {
        let {
            isCreateEnable,
            posterUrl,
            regulationName,
            courseName,
            datetime
        } = this.state;

        let time = moment(datetime, TIME_FORMAT);
        let timestamp = (new Date(time)).getTime() / 1000;
        let fromData = {
            "name": this.tournamentName,
            "facility_id": this.facilitySelected ? this.facilitySelected.id : '',
            "date_played": timestamp,
            "phone_created": this.phoneNumber,
            "fees": this.fees,
            "img_poster": this.posterLink,
            "total_member": this.numberGolfer,
            "rules_tour": this.regulationsLink
        }

        console.log('onCreateTournamentPress', fromData)
        this.loading.showLoading();
        let self = this;
        let url = this.getConfig().getBaseUrl() + ApiService.tournament_create();
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
        flexDirection: 'column'
    },
    txt_title: {
        fontSize: fontSize(15),
        color: '#424242',
        fontWeight: 'bold',
        margin: scale(10)
    },
    view_content: {
        flex: 1,
        // marginLeft: scale(10),
        // marginRight: scale(10),
        paddingBottom: scale(10)
    },
    img_icon: {
        width: scale(20),
        height: scale(20),
        resizeMode: 'contain',
        tintColor: '#858585'
    },
    view_item: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: scale(20)
    },
    txt_item_title: {
        fontSize: fontSize(13),
        color: '#808080',
        marginLeft: scale(10),
    },
    input_text: {
        color: '#060606',
        fontSize: fontSize(13),
        padding: 0,
        marginTop: scale(10),
        flex: 1
    },
    view_line: {
        height: 1,
        backgroundColor: '#D5D5D5',
    },
    view_row: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    txt_select: {
        color: '#00ABA7',
        fontSize: fontSize(13),
        marginTop: scale(10),
        marginBottom: scale(10)
    },
    view_upload: {

    },
    txt_create_tournament: {
        color: '#fff',
        fontSize: fontSize(13),
        paddingTop: scale(10),
        paddingBottom: scale(10),
        paddingLeft: scale(25),
        paddingRight: scale(25)
    },
    touchable_create: {
        backgroundColor: '#00ABA7',
        borderRadius: scale(5)
    },
    view_bottom: {
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: scale(10),
        marginTop: scale(10)
    },
    img_poster: {
        width: width - scale(20),
        height: (width - scale(20)) * 2 / 3,
        resizeMode: 'contain'
    },
    // img_close: {
    //     width: scale(20),
    //     height: scale(20),
    //     resizeMode: 'contain',
    //     tintColor: 'red'
    // },
    touchable_remove_poster: {
        position: 'absolute',
        right: 0,
        top: 0,
        paddingBottom: scale(10),
        paddingLeft: scale(10),
        paddingRight: scale(10)
    },
    datepicker: {
        flex: 1,
        width: width,
        // justifyContent: 'center',
        // alignItems: 'center',
    },
    txt_vnd: {
        color: '#808080',
        fontSize: fontSize(13),
        marginLeft: scale(3),
        padding: 0,
        marginBottom: scale(5)
    },
    touchable_close: {
        position: 'absolute',
        right: scale(5),
        top: scale(5),
        width: scale(40),
        height: scale(40),
        borderRadius: scale(20),
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)'
    },
    img_close: {
        width: scale(20),
        height: scale(20),
        resizeMode: 'contain',
        tintColor: '#fff'
    }
});