import React from 'react';
import {
    Platform,
    StyleSheet,
    Text,
    View,
    BackHandler,
    ScrollView,
    FlatList,
    PermissionsAndroid,
    TouchableOpacity,
    Keyboard
} from 'react-native';
import Touchable from 'react-native-platform-touchable';
import BaseComponent from '../../Core/View/BaseComponent';
import HeaderView from '../HeaderView';
import Networking from '../../Networking/Networking';
import ApiService from '../../Networking/ApiService';
import { scale, verticalScale, moderateScale, fontSize } from '../../Config/RatioScale';
import PlayerPerformanceItem from './PlayerPerformanceItem';
import PerformanceContentItem from './PerformanceContentItem';
import FloatBtnActionView from '../Common/FloatBtnActionView';
import CustomLoading from '../Common/CustomLoadingView';
import Share from 'react-native-share';
import ViewShot from "react-native-view-shot";
import PlayerPerformanceModel from '../../Model/PlayerInfo/PlayerPerformanceModel';
import SearchFacilityView from './SearchFacilityView';
import CheckHandicapItem from '../Common/CheckHandicapItem';
import MyView from '../../Core/View/MyView';

export default class ComparePerformance extends BaseComponent {

    constructor(props) {
        super(props);

        this.user_ids = [];
        this.userProfile = this.getUserInfo().getUserProfile();
        this.playerProfile = this.props.navigation.state.params.playerProfile;
        this.uid = this.getAppUtil().replaceUser(this.getUserInfo().getUserId());
        this.puid = this.getAppUtil().replaceUser(this.props.navigation.state.params.puid);
        this.isMe = this.uid === this.puid;//this.props.navigation.state.params.isMe;
        this.user_ids = this.isMe ? [this.uid] : [this.uid, this.puid];
        this.refPerformanceContentItem = [];
        this.dataPerformance = [];
        this.facilityId = 0;
        this.facility = '';
        this.state = {
            player: this.isMe ? [-1, this.userProfile, -1, -1, -1] : [-1, this.userProfile, this.playerProfile, -1, -1],
            isSharing: false,
            facilityList: []
        }
        this.dataLabels = [this.t('below_par_percent'), this.t('par_percent'), this.t('below_par_and_par_percent'), this.t('bogey_percent')
            , this.t('double_bogey_percent'), this.t('forecast_hole_fight'), this.t('forecast_stick_fight'), this.t('forecast_nine_first_hole')
            , this.t('forecast_nine_last_hole'), this.t('forecast_flight')];

        this.onBackPress = this.onBackPress.bind(this);
        this.onDeletePlayer = this.onDeletePlayer.bind(this);
        this.onAddPlayerPress = this.onAddPlayerPress.bind(this);
        this.onShareClick = this.onShareClick.bind(this);
        this.facilityCallback = this.facilityCallback.bind(this);
        this.onItemCoursePress = this.onItemCoursePress.bind(this);
    }

    renderItemView = ({ item, index }) => (
        <Text allowFontScaling={global.isScaleFont} style={styles.txt_item}>{item}</Text>
    );

    renderPerformanceContent(isSharing, player) {
        let dataPlayer = player.slice(1, player.length);
        let playerPerformance = dataPlayer.map((dataItem, index) => {
            return (
                <PerformanceContentItem
                    ref={(refPerformanceContentItem) => { this.refPerformanceContentItem[index] = refPerformanceContentItem; }}
                    index={index}
                    dataItem={dataItem}
                />
            )
        })
        if (isSharing) {
            return (
                < View style={styles.view_content} >
                    <PerformanceContentItem
                        defaultData={this.dataLabels} />
                    {playerPerformance}
                </View >
            )
        }
        return (
            <ScrollView style={styles.scrollview_container}>
                < View style={styles.view_content} >
                    <PerformanceContentItem
                        defaultData={this.dataLabels} />
                    {playerPerformance}
                </View >
            </ScrollView>
        )
    }

    renderPerformanceContent2(isSharing, player) {
        let dataPlayer = player.slice(1, player.length);
        let playerPerformance = dataPlayer.map((dataItem, index) => {
            return (
                <PerformanceContentItem
                    ref={(refPerformanceContentItem) => { this.refPerformanceContentItem[index] = refPerformanceContentItem; }}
                    index={index}
                    dataItem={dataItem}
                />
            )
        })
        if (isSharing) {
            return (
                <ScrollView>
                    <View style={{ flex: 1, backgroundColor: '#fff' }}
                        ref={(refContent) => { this.refContent = refContent }}
                        collapsable={false}>

                        <SearchFacilityView
                            ref={(refSearchFacilityView) => { this.refSearchFacilityView = refSearchFacilityView; }}
                            facilityCallback={this.facilityCallback}
                        />

                        <PlayerPerformanceItem
                            playerList={player}
                            onDeletePlayer={this.onDeletePlayer}
                            onAddPlayerPress={this.onAddPlayerPress} />

                        <ScrollView style={styles.scrollview_container}>
                            <View style={styles.view_content}>
                                <PerformanceContentItem
                                    defaultData={this.dataLabels} />
                                {playerPerformance}
                            </View>
                        </ScrollView>
                        {/* {this.renderPerformanceContent(isSharing, player)} */}

                        <View style={styles.view_line}></View>
                        <View style={[styles.view_note, !isSharing && this.facilityId != 0 ? { marginBottom: scale(10), marginRight: scale(70) } : { marginBottom: scale(10), marginRight: scale(10) }]}>
                            <Text allowFontScaling={global.isScaleFont} style={styles.txt_note}>{this.t('forecast_note_1')}</Text>
                            <Text allowFontScaling={global.isScaleFont} style={styles.txt_note}>{this.t('forecast_note_2')}</Text>
                        </View>
                    </View>
                </ScrollView>
            )
        }
        return (
            <View style={{ flex: 1, backgroundColor: '#fff' }}
                ref={(refContent) => { this.refContent = refContent }}
                collapsable={false}>

                <SearchFacilityView
                    ref={(refSearchFacilityView) => { this.refSearchFacilityView = refSearchFacilityView; }}
                    facilityCallback={this.facilityCallback}
                />

                <PlayerPerformanceItem
                    playerList={player}
                    onDeletePlayer={this.onDeletePlayer}
                    onAddPlayerPress={this.onAddPlayerPress} />

                <ScrollView style={styles.scrollview_container}>
                    <View style={styles.view_content}>
                        <PerformanceContentItem
                            defaultData={this.dataLabels} />
                        {playerPerformance}
                    </View>
                </ScrollView>
                {/* {this.renderPerformanceContent(isSharing, player)} */}

                <View style={styles.view_line}></View>
                <View style={[styles.view_note, !isSharing && this.facilityId != 0 ? { marginBottom: scale(10), marginRight: scale(70) } : { marginBottom: scale(10), marginRight: scale(10) }]}>
                    <Text allowFontScaling={global.isScaleFont} style={styles.txt_note}>{this.t('forecast_note_1')}</Text>
                    <Text allowFontScaling={global.isScaleFont} style={styles.txt_note}>{this.t('forecast_note_2')}</Text>
                </View>
            </View>
        )
    }

    render() {
        let {
            player,
            isSharing,
            facilityList
        } = this.state;

        let dataPlayer = player.slice(1, player.length);
        let playerPerformance = dataPlayer.map((dataItem, index) => {
            return (
                <PerformanceContentItem
                    ref={(refPerformanceContentItem) => { this.refPerformanceContentItem[index] = refPerformanceContentItem; }}
                    index={index}
                    dataItem={dataItem}
                />
            )
        })

        return (
            <View style={styles.container}>
                <HeaderView
                    title={this.t('compare_performance')}
                    handleBackPress={this.onBackPress} />
                <View style={{ flex: 1 }}>
                    {this.renderPerformanceContent2(isSharing, player)}

                    <FloatBtnActionView
                        ref={(refFloatActionView) => { this.refFloatActionView = refFloatActionView; }}
                        icon={this.getResources().share_logo}
                        onFloatActionPress={this.onShareClick}
                        text={this.t('share')} />

                    <MyView hide={facilityList.length === 0} style={styles.view_absolute}>
                        <FlatList
                            style={styles.container_flatlist}
                            data={facilityList}
                            onEndReachedThreshold={5}
                            keyboardShouldPersistTaps='always'
                            ItemSeparatorComponent={(sectionId, rowId) => <View key={rowId} style={styles.separator_view} />}
                            // onEndReached={this.onLoadMore.bind(this)}
                            enableEmptySections={true}
                            renderItem={({ item }) =>
                                <CheckHandicapItem facilityCourseModel={item}
                                    onItemClickCallback={this.onItemCoursePress} />
                            }
                        />
                    </MyView>

                    <CustomLoading ref={(customLoading) => { this.customLoading = customLoading; }} />
                    {this.renderMessageBar()}
                    {this.renderInternalLoading()}
                </View>
            </View>
        );
    }

    onBackPress() {
        let { facilityList } = this.state;
        if (facilityList.length === 0 && this.props.navigation) {
            this.props.navigation.goBack();
        } else {
            this.setState({
                facilityList: []
            }, () => {
                Keyboard.dismiss();
            })
        }
    }

    componentDidMount() {
        this.rotateToPortrait();
        this.registerMessageBar();
        this.handleHardwareBackPress();
        this.refFloatActionView.setVisible(false);

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

    requestPerformance() {
        let {
            player
        } = this.state;

        this.internalLoading.showLoading();
        let self = this;
        let fromData = {
            "user_ids": this.user_ids,
        }

        console.log('requestPerformance.fromData', fromData)
        let url = this.getConfig().getBaseUrl() + ApiService.user_performance(this.facilityId);
        console.log('url', url)
        Networking.httpRequestPost(url, (jsonData) => {

            self.internalLoading.hideLoading();
            self.model = new PlayerPerformanceModel(self);
            self.model.parseData(jsonData);
            if (self.model.getErrorCode() === 0) {
                self.dataPerformance = self.model.getPerformanceList();
                player.splice(1, self.dataPerformance.length, ...self.dataPerformance)
                self.setState({
                    player: player
                }, () => {
                    for (let index in self.dataPerformance) {
                        if (self.refPerformanceContentItem[index])
                            self.refPerformanceContentItem[index].setData(self.dataPerformance[index].dataList);
                    }
                })

            } else {
                self.showErrorMsg(jsonData.error_msg);
            }

        }, fromData, () => {
            //time out
            self.internalLoading.hideLoading();
            self.showErrorMsg(self.t('time_out'));
        });
    }

    facilityCallback(facilityList) {
        console.log('facilityList', facilityList);
        this.setState({
            facilityList: facilityList
        }, () => {
            this.refFloatActionView.setVisible(false);
        })
    }

    onItemCoursePress(facility) {
        this.facility = facility;
        console.log('onItemCoursePress', facility);
        this.setState({
            facilityList: []
        }, () => {
            this.refFloatActionView.setVisible(true);
            Keyboard.dismiss();
            this.facilityId = facility.id;
            this.requestPerformance();
            this.refSearchFacilityView.setItemSelected(facility.sub_title)
        })

    }


    onDeletePlayer(index) {
        console.log('onDeletePlayer', index);
        let {
            player
        } = this.state;

        player.splice(index, 1);
        player.push(-1)
        this.dataPerformance.splice(index - 1, 1);
        this.user_ids.splice(index - 1, 1);
        this.setState({
            player: player
        }, () => {
            this.refPerformanceContentItem[this.dataPerformance.length].setData([]);
            for (let index in this.dataPerformance) {
                this.refPerformanceContentItem[index].setData(this.dataPerformance[index].dataList);
            }
        })
    }

    onAddPlayerPress(index) {
        console.log('onAddPlayerPress');
        this.props.navigation.navigate('search_user_view', { onSearchCallback: this.onSearchPlayerCallback.bind(this, index), 'user_ids': this.user_ids });
    }

    onSearchPlayerCallback(index, friendItemModel) {
        console.log('onSearchPlayerCallback', JSON.stringify(friendItemModel));
        let {
            player
        } = this.state;
        player.splice(index, 1, friendItemModel);
        this.user_ids.push(friendItemModel.getId());
        if (this.facilityId != 0) {
            this.requestPerformance();
        } else {
            this.setState({
                player: player
            })
        }

    }

    async onShareClick() {
        if (Platform.OS === 'android') {
            const granted = await PermissionsAndroid.check(
                PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE
            );
            if (!granted) {
                const response = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE
                );
                if (response === 'denied' || response === 'never_ask_again') {
                    return;
                }
            }
        }
        this.setState({
            isSharing: true
        }, () => {
            this.refFloatActionView.setVisible(false);
            this.refSearchFacilityView.setItemSelected(this.facility.sub_title)
            for (let index in this.dataPerformance) {
                if (this.refPerformanceContentItem[index])
                    this.refPerformanceContentItem[index].setData(this.dataPerformance[index].dataList);
            }
            setTimeout(() => {
                this.implementShare();
            }, 500);
        })
    }

    async implementShare() {
        let self = this;
        this.customLoading.showLoading();
        let imageUri = await this.getAppUtil().onSnapshotClick(this.refContent);
        if (imageUri) {
            self.setState({
                isSharing: false
            }, () => {
                self.refFloatActionView.setVisible(true);
                self.refSearchFacilityView.setItemSelected(self.facility.sub_title)
                for (let index in self.dataPerformance) {
                    if (self.refPerformanceContentItem[index])
                        self.refPerformanceContentItem[index].setData(self.dataPerformance[index].dataList);
                }
                Share.open({ url: imageUri })
                    .then(() => { self.customLoading.hideLoading();; })
                    .catch((error) => { self.customLoading.hideLoading();; });
            });

        }
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

    },
    view_note: {
        marginTop: scale(5),
        marginLeft: scale(10)
    },
    txt_note: {
        fontSize: fontSize(16),
        color: '#3A3A3A',
        marginTop: scale(5),
        opacity: 0.8,
        fontStyle: 'italic'
    },
    separator_view: {
        backgroundColor: '#D6D4D4',
        height: 1
    },
    txt_item: {
        flex: 1,
    },
    view_content: {
        flexDirection: 'row'
    },
    view_line: {
        backgroundColor: '#D4D4D4',
        height: 0.5,
    },
    container_flatlist: {
        paddingBottom: 1,
        paddingLeft: 0,
        paddingRight: 0,
        elevation: 2,
        shadowOffset: { width: 0, height: -3 },
        shadowColor: "grey",
        shadowOpacity: 1,
        shadowRadius: scale(8),
        borderRadius: scale(8),
        marginLeft: scale(10),
        marginRight: scale(10),
        marginBottom: scale(10)
    },
    separator_view: {
        height: 1,
        backgroundColor: '#E3E3E3',
        marginLeft: 10,
        marginRight: 10
    },
    view_absolute: {
        position: 'absolute',
        right: 0,
        left: 0,
        top: 60,
        bottom: 0,
        backgroundColor: '#fff'
    }
});