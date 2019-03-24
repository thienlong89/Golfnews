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
    Alert,
    Image,
    ScrollView,
    Dimensions,
    TouchableOpacity
} from 'react-native';
import Touchable from 'react-native-platform-touchable';
import BaseComponent from '../../../Core/View/BaseComponent';
import ApiService from '../../../Networking/ApiService';
import Networking from '../../../Networking/Networking';
import ModalDropdown from 'react-native-modal-dropdown';
import MyView from '../../../Core/View/MyView';
import AccessoriesModel from '../../../Model/User/AccessoriesModel';
import * as Progress from 'react-native-progress';
import { createImageProgress } from 'react-native-image-progress';
import FastImage from 'react-native-fast-image';
const Images = createImageProgress(FastImage);

const TAG = "[Vhandicap-v1] PersionalInfo : ";

import { scale, verticalScale, moderateScale, fontSize } from '../../../Config/RatioScale';
let { width, height } = Dimensions.get('window');


var accessoryList = [];

export default class PersonalAccessories extends BaseComponent {

    static defaultProps = {
        puid: '',
        isMe: true
    }

    constructor(props) {
        super(props);
        this.state = {
            driver: '',
            hybrid: '',
            wooden_sticks: '',
            set_of_iron: '',
            technical_sticks: '',
            putter: '',
            film_ball: '',
            editable: false
        }
        this.onEditClick = this.onEditClick.bind(this);
        this.onDriverItemPress = this.onDriverItemPress.bind(this);
        this.onHybridItemPress = this.onHybridItemPress.bind(this);
        this.onWoodenSticksItemPress = this.onWoodenSticksItemPress.bind(this);
        this.onIronSetItemPress = this.onIronSetItemPress.bind(this);
        this.onTechnicalSticksItemPress = this.onTechnicalSticksItemPress.bind(this);
        this.onPutterItemPress = this.onPutterItemPress.bind(this);
        this.onFilmBallItemPress = this.onFilmBallItemPress.bind(this);
    }

    renderAccessoryItem(dataObj) {
        if (dataObj) {
            console.log('dataObj', dataObj.logo_url)
            if (dataObj.logo_url) {
                console.log('renderAccessoryItem')
                return (
                    // <Image
                    //     style={styles.img_logo}
                    //     source={{ uri: dataObj.logo_url }} />
                    <Images
                        style={styles.img_logo}
                        source={{
                            uri: dataObj.logo_url,
                        }}
                        resizeMode={FastImage.resizeMode.contain}
                        indicator={Progress.Circle}
                    // imageStyle={{ borderRadius: 8 }}
                    />
                )
            } else {
                return (
                    <View style={styles.view_item}>
                        <Text allowFontScaling={global.isScaleFont} style={styles.txt_accessory}>{dataObj}</Text>
                    </View>

                )
            }
        }
        return null;
    }

    renderHeader(editable, isMe) {
        if (isMe) {
            return (
                <View style={styles.item_header_view}>
                    <Text allowFontScaling={global.isScaleFont} style={styles.item_header_text}>{this.t('your_accessories')}</Text>
                    <Touchable onPress={this.onEditClick} style={{ padding: 10 }}>
                        {/* <Image
                            style={[styles.pen_image, { tintColor: editable ? '#00aba7' : '#A5A5A5' }]}
                            source={editable ? this.getResources().btn_save : this.getResources().pen}
                        /> */}
                        <Text style={[styles.txt_edit, { color: editable ? '#00aba7' : '#A5A5A5' }]}>{editable ? this.t('save') : this.t('edit')}</Text>
                    </Touchable>
                </View>
            )
        } else {
            return (
                <View style={styles.item_header_view}>
                    <Text allowFontScaling={global.isScaleFont} style={styles.item_header_text}>{this.t('accessories')}</Text>
                </View>
            )
        }
    }

    renderArrowDown(isMe) {
        if (isMe) {
            return (
                <Image
                    style={styles.img_arrow}
                    source={this.getResources().ic_arrow_down} />
            )
        }
        return null;
    }

    render() {
        let {
            editable,
            driver,
            hybrid,
            wooden_sticks,
            set_of_iron,
            technical_sticks,
            putter,
            film_ball
        } = this.state;
        let {
            isMe
        } = this.props;
        return (
            // <KeyboardAwareScrollView>
            <View style={styles.container_info}>
                {/* {this.renderLoading()} */}
                {this.renderHeader(editable, isMe)}

                <View style={styles.view_content}>
                    <Image
                        style={styles.img_accessories}
                        source={this.getResources().ic_accessories} />

                    <View style={styles.view_content_detail}>
                        {/* <ScrollView style={{ flex: 1 }}> */}
                        <View style={styles.item_body_view}>
                            <Text allowFontScaling={global.isScaleFont} style={styles.item_label}>{this.t('driver')}</Text>

                            <View style={[styles.myview, { flexDirection: 'row', alignItems: 'center' }]}>
                                <TouchableOpacity style={styles.myview}
                                    onPress={this.onDriverItemPress}
                                    disabled={!editable}>
                                    {this.renderAccessoryItem(driver)}
                                </TouchableOpacity>
                                {this.renderArrowDown(isMe)}
                            </View>
                        </View>


                        <View style={styles.item_body_view}>
                            <Text allowFontScaling={global.isScaleFont} style={styles.item_label}>{this.t('hybrid')}</Text>

                            <View style={[styles.myview, { flexDirection: 'row', alignItems: 'center' }]}>
                                <TouchableOpacity style={styles.myview}
                                    onPress={this.onHybridItemPress}
                                    disabled={!editable}>
                                    {/* <Image
                                    style={styles.img_logo}
                                    source={{ uri: hybrid ? hybrid.logo_url : '' }} /> */}
                                    {this.renderAccessoryItem(hybrid)}
                                </TouchableOpacity>
                                {this.renderArrowDown(isMe)}
                            </View>
                        </View>


                        <View style={styles.item_body_view}>
                            <Text allowFontScaling={global.isScaleFont} style={styles.item_label}>{this.t('wooden_sticks')}</Text>

                            <View style={[styles.myview, { flexDirection: 'row', alignItems: 'center' }]}>
                                <TouchableOpacity style={styles.myview}
                                    onPress={this.onWoodenSticksItemPress}
                                    disabled={!editable}>
                                    {/* <Image
                                    style={styles.img_logo}
                                    source={{ uri: wooden_sticks ? wooden_sticks.logo_url : '' }} /> */}
                                    {this.renderAccessoryItem(wooden_sticks)}
                                </TouchableOpacity>
                                {this.renderArrowDown(isMe)}
                            </View>
                        </View>


                        <View style={styles.item_body_view}>
                            <Text allowFontScaling={global.isScaleFont} style={styles.item_label}>{this.t('set_of_iron')}</Text>

                            <View style={[styles.myview, { flexDirection: 'row', alignItems: 'center' }]}>
                                <TouchableOpacity style={styles.myview}
                                    onPress={this.onIronSetItemPress}
                                    disabled={!editable}>
                                    {/* <Image
                                    style={styles.img_logo}
                                    source={{ uri: set_of_iron ? set_of_iron.logo_url : '' }} /> */}
                                    {this.renderAccessoryItem(set_of_iron)}
                                </TouchableOpacity>
                                {this.renderArrowDown(isMe)}
                            </View>
                        </View>


                        <View style={styles.item_body_view}>
                            <Text allowFontScaling={global.isScaleFont} style={styles.item_label}>{this.t('technical_sticks')}</Text>

                            <View style={[styles.myview, { flexDirection: 'row', alignItems: 'center' }]}>
                                <TouchableOpacity style={styles.myview}
                                    onPress={this.onTechnicalSticksItemPress}
                                    disabled={!editable}>
                                    {/* <Image
                                    style={styles.img_logo}
                                    source={{ uri: technical_sticks ? technical_sticks.logo_url : '' }} /> */}
                                    {this.renderAccessoryItem(technical_sticks)}
                                </TouchableOpacity>
                                {this.renderArrowDown(isMe)}
                            </View>
                        </View>


                        <View style={styles.item_body_view}>
                            <Text allowFontScaling={global.isScaleFont} style={styles.item_label}>{this.t('putter')}</Text>

                            <View style={[styles.myview, { flexDirection: 'row', alignItems: 'center' }]}>
                                <TouchableOpacity style={styles.myview}
                                    onPress={this.onPutterItemPress}
                                    disabled={!editable}>
                                    {/* <Image
                                    style={styles.img_logo}
                                    source={{ uri: putter ? putter.logo_url : '' }} /> */}
                                    {this.renderAccessoryItem(putter)}
                                </TouchableOpacity>
                                {this.renderArrowDown(isMe)}
                            </View>
                        </View>

                        <View style={styles.item_body_view}>
                            <Text allowFontScaling={global.isScaleFont} style={styles.item_label}>{this.t('film_ball')}</Text>

                            <View style={[styles.myview, { flexDirection: 'row', alignItems: 'center' }]}>
                                <TouchableOpacity style={styles.myview}
                                    onPress={this.onFilmBallItemPress}
                                    disabled={!editable}>
                                    {/* <Image
                                    style={styles.img_logo}
                                    source={{ uri: putter ? putter.logo_url : '' }} /> */}
                                    {this.renderAccessoryItem(film_ball)}
                                </TouchableOpacity>
                                {this.renderArrowDown(isMe)}
                            </View>
                        </View>
                    </View>
                </View>

                {/* </ScrollView> */}
                {this.renderInternalLoading()}
            </View>
            // </KeyboardAwareScrollView>
        );
    }

    componentDidMount() {
        this.requestUserAccessories();
    }

    requestUserAccessories() {
        let url = this.getConfig().getBaseUrl() + ApiService.user_info_equipment(this.props.puid);
        console.log("url:", url);
        if (this.internalLoading)
            this.internalLoading.showLoading();
        let self = this;
        Networking.httpRequestGet(url, (jsonData) => {
            console.log("requestUserAccessories: ", jsonData);
            if (self.internalLoading)
                self.internalLoading.hideLoading();
            if (jsonData.error_code === 0) {
                let data = jsonData.data;
                if (data) {
                    this.setState({
                        driver: data.Driver,
                        hybrid: data.Hybird,
                        wooden_sticks: data.StickWood,
                        set_of_iron: data.IronSet,
                        technical_sticks: data.StickTechnical,
                        putter: data.Putter,
                        film_ball: data.BallProducer
                    })
                }
            }

        }, () => {
            //time out
            if (self.internalLoading)
                self.internalLoading.hideLoading();
        });
    }

    /**
     * Chinh sửa thông tin
     */
    onEditClick() {
        //dang o che do edit neu kick se gui du lieu len sever
        if (this.state.editable) {
            this.requestUpdateAccessories();
        } else {
            this.setState({
                editable: true
            })
        }
    }

    requestGetAccessories() {
        let url = this.getConfig().getBaseUrl() + ApiService.user_get_list_equipment();
        console.log("url:", url);
        this.internalLoading.showLoading();
        let self = this;
        Networking.httpRequestGet(url, (jsonData) => {
            console.log("requestGetAccessories:", jsonData);
            self.model = new AccessoriesModel(self);
            self.model.parseData(jsonData);
            if (self.model.getErrorCode() === 0) {
                let dataList = self.model.getAccessories();
                if (dataList.length > 0) {
                    accessoryList = dataList;
                    self.setState({
                        editable: true
                    })
                }
            }
            self.internalLoading.hideLoading();
        }, () => {
            //time out
            self.internalLoading.hideLoading();
        });
    }

    onDriverItemPress() {
        if (this.props.onAccessoryPress) {
            this.props.onAccessoryPress(0);
        }
    }

    onDriverSelected(driverObj) {
        if (driverObj) {
            this.setState({
                driver: driverObj
            })
        }
    }

    onHybridItemPress() {
        if (this.props.onAccessoryPress) {
            this.props.onAccessoryPress(1);
        }
    }

    onHybridSelected(hybridObj) {
        if (hybridObj) {
            this.setState({
                hybrid: hybridObj
            })
        }
    }

    onWoodenSticksItemPress() {
        if (this.props.onAccessoryPress) {
            this.props.onAccessoryPress(2);
        }
    }

    onWoodenSticksSelected(woodenSticksObj) {
        if (woodenSticksObj) {
            this.setState({
                wooden_sticks: woodenSticksObj
            })
        }
    }

    onIronSetItemPress() {
        if (this.props.onAccessoryPress) {
            this.props.onAccessoryPress(3);
        }
    }

    onIronSetSelected(ironSetObj) {
        if (ironSetObj) {
            this.setState({
                set_of_iron: ironSetObj
            })
        }
    }

    onTechnicalSticksItemPress() {
        if (this.props.onAccessoryPress) {
            this.props.onAccessoryPress(4);
        }
    }

    onTechnicalSticksSelected(technicalSticksObj) {
        if (technicalSticksObj) {
            this.setState({
                technical_sticks: technicalSticksObj
            })
        }
    }

    onPutterItemPress() {
        if (this.props.onAccessoryPress) {
            this.props.onAccessoryPress(5);
        }
    }

    onPutterSelected(putterObj) {
        if (putterObj) {
            this.setState({
                putter: putterObj
            })
        }
    }

    onFilmBallItemPress() {
        if (this.props.onAccessoryPress) {
            this.props.onAccessoryPress(6);
        }
    }

    onFilmBallSelected(filmObj) {
        if (filmObj) {
            this.setState({
                film_ball: filmObj
            })
        }
    }


    requestUpdateAccessories() {
        this.internalLoading.showLoading();
        let self = this;
        let {
            driver,
            hybrid,
            wooden_sticks,
            set_of_iron,
            technical_sticks,
            putter,
            film_ball
        } = this.state;

        let formData = {
            "driver": driver ? driver.id ? { "id": driver.id } : driver : '',
            "hybird": hybrid ? hybrid.id ? { "id": hybrid.id } : hybrid : '',
            "stick_wood": wooden_sticks ? wooden_sticks.id ? { "id": wooden_sticks.id } : wooden_sticks : '',
            "putter": putter ? putter.id ? { "id": putter.id } : putter : '',
            "sticks_technical": technical_sticks ? technical_sticks.id ? { "id": technical_sticks.id } : technical_sticks : '',
            "iron_set": set_of_iron ? set_of_iron.id ? { "id": set_of_iron.id } : set_of_iron : '',
            "ball_producer": film_ball ? film_ball.id ? { "id": film_ball.id } : film_ball : '',
        }
        let equipment = {
            "equipment": formData
        }
        console.log("requestUpdateAccessories.equipment : ", equipment);

        let url = this.getConfig().getBaseUrl() + ApiService.user_update_info_equipment();
        Networking.httpRequestPost(url, (jsonData) => {
            console.log("jsonData : ", jsonData);
            if (jsonData.hasOwnProperty('error_code')) {
                let error_code = parseInt(jsonData['error_code']);
                if (error_code === 0) {
                    self.setState({
                        editable: false
                    }, () => {
                        if (this.props.onUpdateSuccess) {
                            this.props.onUpdateSuccess();
                        }
                    });
                } else {
                    Alert.alert(
                        self.t('thong_bao'),
                        jsonData['error_msg'],
                        [
                            { text: 'OK', onPress: () => console.log('OK Pressed') },
                        ],
                        { cancelable: true }
                    )
                }
            }
            self.internalLoading.hideLoading();
        }, equipment, () => {
            //time out
            self.internalLoading.hideLoading();
        });
    }

}

const styles = StyleSheet.create({

    container_info: {
        // flex: 1,
        backgroundColor: '#fff',
        marginTop: verticalScale(10),
        marginBottom: verticalScale(10),
        marginLeft: scale(10),
        marginRight: scale(10),
        borderRadius: scale(10),
        paddingBottom: scale(10),
        borderWidth: 1,
        borderColor: '#ebebeb'
        // shadowColor: 'rgba(0, 0, 0, 0.3)',
        // shadowOffset: {
        //     width: 0,
        //     height: 5
        // },
        // shadowRadius: scale(10),
        // shadowOpacity: 1.0,
        // elevation: 1,
    },
    view_content: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff'
    },
    view_content_img: {
        flex: 0.9,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: scale(5),
        marginRight: scale(5)
    },
    img_accessories: {
        flex: 0.9,
        resizeMode: 'contain',
        marginLeft: scale(5),
        marginRight: scale(5)
    },
    view_content_detail: {
        flex: 2
    },
    item_header_view: {
        height: verticalScale(30),
        flexDirection: 'row',
        backgroundColor: '#EDEDED',
        alignItems: 'center',
        borderTopLeftRadius: scale(10),
        borderTopRightRadius: scale(10)
    },
    txt_edit: {
        fontSize: fontSize(15)
    },
    item_header_text: {
        flex: 1,
        fontSize: fontSize(18, scale(4)),//18
        color: '#919191',
        fontWeight: 'bold',
        marginLeft: scale(10),
        textAlign: 'center'
    },
    pen_image: {
        width: scale(20),
        height: verticalScale(20),
        resizeMode: 'contain',
        alignSelf: 'center',
        marginRight: scale(5)
    },
    item_body_view: {
        height: verticalScale(40),
        flexDirection: 'row',
        borderTopColor: '#ebebeb',
        borderTopWidth: 1,
        backgroundColor: '#fff',
        alignItems: 'center'
    },

    item_label: {
        flex: 2.3,
        fontSize: fontSize(16, scale(2)),//16
        color: '#a6a6a6',
        // marginLeft: scale(10),
        //textAlign: 'center',
        //backgroundColor : 'red'
    },
    myview: {
        flex: 3,
        justifyContent: 'center',
        // backgroundColor: 'yellow',
        height: scale(40),
        // alignItems: 'center'
    },

    img_logo: {
        width: null,
        height: scale(35),
        resizeMode: 'contain'
    },
    txt_accessory: {
        fontSize: fontSize(15),
        color: 'black',
    },
    view_item: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    img_arrow: {
        width: scale(11),
        height: scale(11),
        resizeMode: 'contain',
        marginRight: scale(5),
        tintColor: '#B8B8B8'
    }

});