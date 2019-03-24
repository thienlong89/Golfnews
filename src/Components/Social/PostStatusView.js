import React from 'react';
import {
    Platform,
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    Image,
    TextInput,
    ScrollView,
    Dimensions,
    Keyboard,
    BackHandler
} from 'react-native';
import Touchable from 'react-native-platform-touchable';
import BaseComponent from '../../Core/View/BaseComponent';
import SocialHeaderView from './Item/SocialHeaderView';
// import Networking from '../../Networking/Networking';
// import ApiService from '../../Networking/ApiService';
import CustomAvatar from '../Common/CustomAvatar';
import PhotoGridView from '../Common/PhotoGridView';
import PopupYesOrNo from '../Common/PopupYesOrNo';
import AppUtil from '../../Config/AppUtil';
import PopupAttachImage from '../Common/PopupAttachImage';
import ModalDropdown from 'react-native-modal-dropdown';
import PopupSelectClub from '../CLB/Items/PopupSelectClub';

const screenWidth = Dimensions.get('window').width;

export default class PostStatusView extends BaseComponent {

    constructor(props) {
        super(props);
        this.userProfile = this.getUserInfo().getUserProfile();
        const { params } = this.props.navigation.state;

        this.isPublic = params.isPublic || false;
        this.isUpdate = params.isUpdate || false;
        this.data = params.data || null;


        this.topicSelected = params.topic || '';
        this.defaultTopicName = this.topicSelected ? this.topicSelected.name : this.t('select_topic');
        this.clubList = params.clubList ? params.clubList : [];
        // this.imgs = [];
        this.clubSelected = this.data? this.data.club: '';
        this.state = {
            images: this.data ? this.data.img_content : [],
            inputChange: this.data ? this.data.content : ''
        }

        this.onCreatePostImg = this.onCreatePostImgPress.bind(this);
        this.onCancelPostPress = this.onCancelPostPress.bind(this);
        this.onCreatePostPress = this.onCreatePostPress.bind(this);
        this.onClubSelectedPress = this.onClubSelectedPress.bind(this);
        this.onPostStatusChange = this.onPostStatusChange.bind(this);
        this.onConfirmCancelPost = this.onConfirmCancelPost.bind(this);
        this.onTakePhotoClick = this.onTakePhotoClick.bind(this);
        this.onImportGalleryClick = this.onImportGalleryClick.bind(this);
    }

    renderModal() {
        const { params } = this.props.navigation.state;
        if (this.isPublic) {
            return null;
        } else if (params.topic) {
            return (
                <Text allowFontScaling={global.isScaleFont} style={styles.dropdown_text}>{params.topic.name}</Text>
            )
        } else {
            return (
                <View style={styles.view_topics}>
                    <ModalDropdown
                        ref={(refTopicModal) => { this.refTopicModal = refTopicModal; }}
                        defaultValue={this.defaultTopicName}
                        style={styles.style_btn_dropdown}
                        textStyle={styles.txt_default}
                        dropdownStyle={styles.dropdown_list}
                        options={global.topics}
                        renderButtonText={(rowData) => rowData.name}
                        renderRow={(rowData, index, isSelected) =>
                            <View style={{ backgroundColor: isSelected ? '#99E6FF' : '#FFFFFF' }}>
                                <Touchable onPress={this.onTopicItemSelected.bind(this, rowData, index)}>
                                    <Text allowFontScaling={global.isScaleFont} style={styles.dropdown_text}>{rowData.name}</Text>
                                </Touchable>
                            </View>
                        }
                    />

                    <Image
                        style={styles.img_arrow_down}
                        source={this.getResources().arrow_right}
                    />
                </View>
            )
        }
    }

    render() {

        let playerName = this.userProfile.getFullName();
        let avatar = this.userProfile.getAvatar();

        return (
            <View style={styles.container}>
                <View style={{ flex: 1 }}>

                    <SocialHeaderView
                        centerTitle={this.isUpdate? this.t('update'): this.t('create_posts')}
                        onCancelPostPress={this.onCancelPostPress}
                        onCreatePostPress={this.onCreatePostPress}
                        rightTitle={this.isUpdate? this.t('save'): this.t('share')} />

                    {this.renderModal()}

                    <View style={{ backgroundColor: '#D2D2D2', height: 1 }} />

                    <View style={styles.view_top}>
                        <CustomAvatar
                            width={40}
                            height={40}
                            uri={avatar} />
                        <View style={styles.view_top_center}>
                            <Text allowFontScaling={global.isScaleFont} style={styles.txt_player_name}>
                                {playerName}
                            </Text>
                            {/* <Text style={styles.txt_date_time}>
                                {'cong khai'}
                            </Text> */}
                        </View>
                        <View style={styles.view_top_right}>
                            <TouchableOpacity style={styles.touchable_image}
                                onPress={this.onCreatePostImg}>
                                <Image
                                    style={styles.img_photo}
                                    source={this.getResources().ic_picture}
                                />
                            </TouchableOpacity>
                        </View>
                    </View>

                    <ScrollView contentContainerStyle={{}}>
                        <TextInput allowFontScaling={global.isScaleFont}
                            ref={(textInput) => { this.textInput = textInput; }}
                            style={styles.input_post}
                            placeholder={this.t('your_status')}
                            placeholderTextColor='#888888'
                            underlineColorAndroid='rgba(0,0,0,0)'
                            onKeyDown={this.handleKeyDown}
                            multiline={true}
                            value={this.state.inputChange}
                            onChangeText={this.onPostStatusChange} />

                        <View style={{ flex: 1 }}>
                            <PhotoGridView source={this.state.images}
                                onPressImage={source => this.showImage(source.uri)} />
                        </View>
                    </ScrollView>
                </View>
                <PopupYesOrNo
                    ref={(popupCancelPost) => { this.popupCancelPost = popupCancelPost; }}
                    content={this.t('cancel_post')}
                    confirmText={this.t('agree')}
                    cancelText={this.t('cancel')}
                    onConfirmClick={this.onConfirmCancelPost} />

                <PopupAttachImage
                    ref={(popupAttachImage) => { this.popupAttachImage = popupAttachImage; }}
                    onTakePhotoClick={this.onTakePhotoClick}
                    onImportGalleryClick={this.onImportGalleryClick} />

                <PopupSelectClub
                    ref={(refPopupSelectClub) => { this.refPopupSelectClub = refPopupSelectClub }}
                    onClubSelected={this.onClubSelectedPress}
                // clubList={this.clubList}
                />
                {this.renderMessageBar()}
            </View>
        );
    }

    componentDidMount() {
        this.registerMessageBar();
        this.handleHardwareBackPress();
    }

    onBackPress() {
        if (this.props.navigation != null) {
            this.props.navigation.goBack();
        }
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

    onTopicItemSelected(topic, index) {
        console.log('onTopicItemSelected', topic)
        this.topicSelected = topic;
        this.refTopicModal.select(index);
        this.refTopicModal.hide();
    }

    handleKeyDown(e) {
        if (e.keyCode === ENTER_KEY) {
        }
    }

    onPostStatusChange(input) {
        this.setState({
            inputChange: input
        })
    }

    onCreatePostImgPress() {
        Keyboard.dismiss();
        this.popupAttachImage.show();
    }

    onTakePhotoClick = async () => {
        let imageUri = await AppUtil.onTakePhotoClick(false);
        if (!imageUri.didCancel) {
            // this.imgs.push(imageUri);
            this.setState({
                images: [...this.state.images, imageUri.path]
            })
        }

    }

    onImportGalleryClick = async () => {
        let imageUris = await AppUtil.onImportGalleryClick(false, true);
        if (!imageUris.didCancel) {
            // console.log('onImportGalleryClick', imageUris);
            // this.imgs = [...this.imgs, ...imageUris];
            let listData = imageUris.map((imageUri) => {
                return imageUri.path;
            })
            this.setState({
                images: [...this.state.images, ...listData]
            })
        }
    }

    showImage(uri) {

    }

    onCancelPostPress() {
        if (this.state.inputChange || this.state.images.length > 0) {
            this.popupCancelPost.show();
        } else {
            this.onBackPress();
        }
    }

    onConfirmCancelPost() {
        this.onBackPress();
    }

    onClubSelectedPress(club) {
        this.clubSelected = club;
        this.onPostCallBack();
    }

    onCreatePostPress() {
        if (this.isPublic) {
            let post = {
                content: this.state.inputChange,
                imgs: this.state.images,
                id: this.data ? this.data.id : ''
            }

            let { params } = this.props.navigation.state;
            if (params.PostCallback) {
                params.PostCallback(post);
            }
            this.onBackPress();
        } else if (this.topicSelected.id) {
            if (this.clubList.length > 0) {
                let clubs = this.clubList.map((clubItem) => {
                    return clubItem.club
                })
                this.refPopupSelectClub.show(clubs);
            } else {
                this.onPostCallBack();
            }
        } else {
            this.showErrorMsg(this.t('not_yet_select_topic'))
        }

    }

    onPostCallBack() {
        let post = {
            topic: this.topicSelected.id,
            content: this.state.inputChange,
            imgs: this.state.images,
            club: this.clubSelected,
            id: this.data ? this.data.id : ''
        }

        let { params } = this.props.navigation.state;
        if (params.PostCallback) {
            params.PostCallback(post);
        }
        this.onBackPress();
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    view_top: {
        flexDirection: 'row',
        padding: 10
    },
    input_post: {
        fontSize: (Platform.OS === 'ios') ? 16 : 15,
        lineHeight: (Platform.OS === 'ios') ? 20 : 20,
        paddingTop: 10,
        paddingBottom: 10,
        paddingLeft: 10,
        paddingRight: 10,
        color: '#292929'
    },
    view_top_center: {
        height: 40,
        flex: 1,
        paddingRight: 10,
        paddingLeft: 10
    },
    txt_player_name: {
        color: 'black',
        fontWeight: 'bold',
        fontSize: 15
    },
    txt_date_time: {
        color: '#AEAEAE',
        fontSize: 13
    },
    view_top_right: {

    },
    touchable_image: {
        justifyContent: 'flex-end',
        alignItems: 'center'
    },
    img_photo: {
        width: 25,
        height: 25,
        resizeMode: 'contain',
        tintColor: '#8F8F8F'
    },
    view_topics: {
        width: screenWidth,
        height: 50,
        flexDirection: 'row',
        marginRight: 10,
        marginLeft: 10,
        alignItems: 'center',
        // justifyContent: 'space-between'
    },
    txt_default: {
        fontSize: 16,
        color: '#8f8e94',
        textAlign: 'left',
        marginLeft: 0,
        textAlignVertical: 'center',
    },
    dropdown_text: {
        //marginVertical: 10,
        //marginHorizontal: 6,
        padding: 10,
        fontSize: 16,
        color: '#8f8e94',
        textAlign: 'left',
        marginLeft: 0,
        textAlignVertical: 'center',
    },
    style_btn_dropdown: {
        width: screenWidth
    },
    dropdown_list: {

    },
    img_arrow_down: {
        position: 'absolute',
        right: 10,
        marginRight: 10,
        width: 20,
        height: 20,
        resizeMode: 'contain'
    }
});