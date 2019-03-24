import React from 'react';
import {
    Platform,
    StyleSheet,
    Text,
    View,
    Image,
    Dimensions,
    SectionList,
    TouchableOpacity,
    Modal,
    TouchableWithoutFeedback
} from 'react-native';
import BaseComponent from '../../Core/View/BaseComponent';
import MemberFlightEventItem from '../CLB/Items/MemberFlightEventItem';
import CustomAvatar from '../Common/CustomAvatar';
import ApiService from '../../Networking/ApiService';
import Networking from '../../Networking/Networking';
import FlightGroupModel from '../../Model/Group/FlightGroupModel';

import { scale, verticalScale, fontSize } from '../../Config/RatioScale';
const { width, height } = Dimensions.get('window');

export default class PopupSwapPlayer extends BaseComponent {

    constructor(props) {
        super(props);
        this.extrasData = null;
        this.page = 1;
        this.groupId = this.props.group_id;
        this.length = 1;
        this.state = {
            userSwap: null,
            showPopup: false,
            memberFlightList: [],
        }
        this.onRequestClose = this.onRequestClose.bind(this);
        this.loadMoreData = this.loadMoreData.bind(this);
        // this.isCallbackPress = this.isCallbackPress.bind(this);
        // this.onShareClick = this.onShareClick.bind(this);
    }

    renderSectionHeader({ index, max_member, group_id, flight_group_id }) {
        console.log('renderSectionHeader', index)
        return (
            <View style={styles.view_section}>
                <Text allowFontScaling={global.isScaleFont} style={styles.txt_section}>
                    {`FLIGHT ${index}`.toUpperCase()}
                </Text>
            </View>
        )
    }

    renderPlayer(userSwap) {

        if (userSwap) {
            let user = userSwap.getUserProfile();
            let avatar = user.getAvatar();
            let fullName = user.getFullName() || '';
            let handicap = user.getUsgaHcIndex() || '';
            let userId = user.getUserId() || '';
            let ehandicapClub = user.getEhandicapMemberId() || '';

            return (
                <View style={styles.view_user_row}>
                    <CustomAvatar
                        width={verticalScale(50)}
                        height={verticalScale(50)}
                        uri={avatar}
                    />

                    <View style={styles.container_content_view}>
                        <Text allowFontScaling={global.isScaleFont} style={styles.fullname_text} numberOfLines={1}>{fullName}</Text>
                        <Text allowFontScaling={global.isScaleFont} style={styles.user_id_text}>{this.showUserId(userId, ehandicapClub)}</Text>
                        <Text allowFontScaling={global.isScaleFont} style={styles.user_id_text}>
                            {this.t('hdc')}: {this.getAppUtil().handicap_display(handicap)}
                        </Text>

                    </View>
                </View>
            )
        }
        return null;
    }

    render() {
        let {
            userSwap,
            showPopup,
            memberFlightList
        } = this.state;

        return (
            <Modal
                visible={showPopup}
                animationType="fade"
                transparent={true}
                onRequestClose={this.onRequestClose}
            >
                <TouchableWithoutFeedback onPress={this.onRequestClose}>
                    <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', alignItems: 'center' }}>
                        <View style={styles.view_content}>
                            <View style={styles.view_user_swap}>
                                <Text allowFontScaling={global.isScaleFont} style={styles.txt_title}>{this.t('select_player_swap')}</Text>
                                {this.renderPlayer(userSwap)}
                            </View>
                            <SectionList
                                renderItem={({ item, index, section }) =>
                                    <MemberFlightEventItem
                                        memberItem={item}
                                        index={index}
                                        isCallbackPress={this.isCallbackPress.bind(this, item, index, section)} />
                                }
                                renderSectionHeader={({ section: { title } }) => this.renderSectionHeader(title)}
                                ItemSeparatorComponent={(sectionId, rowId) => <View key={rowId} style={styles.separator_view} />}
                                sections={memberFlightList}
                                keyExtractor={(item, index) => item + index}
                                onEndReached={this.loadMoreData}
                                onEndReachedThreshold={0.2}
                            />
                        </View>
                        {this.renderLoading()}
                    </View>
                </TouchableWithoutFeedback>
            </Modal>
        );
    }

    showUserId(userId, eHandicap_member_id) {
        return (eHandicap_member_id && eHandicap_member_id.length) ? userId + '-' + eHandicap_member_id : userId;
    }

    isShowing() {
        return this.state.showPopup;
    }

    show(userSwap = {}, memberFlightList = [], page = 1, { title }, length, extrasData = null) {
        this.extrasData = extrasData;
        this.page = page;
        this.length = length;
        console.log('memberFlightList.titleSection', title, this.length);
        if (title) {
            let { index } = title;
            console.log('memberFlightList.index', index);
            if (index && index < memberFlightList.length) {
                memberFlightList.splice(index - 1, 1);
                let listFilter = memberFlightList.filter((flight) => {
                    return flight.title.is_block === 0;
                })
                this.setState({
                    showPopup: true,
                    userSwap: userSwap,
                    memberFlightList: listFilter
                })
            }
        } else {
            this.setState({
                showPopup: true,
                userSwap: userSwap,
                memberFlightList: memberFlightList
            })
        }

    }

    dismiss() {
        this.setState({
            showPopup: false
        })
    }

    onRequestClose() {
        this.setState({
            showPopup: false
        })
    }

    isCallbackPress(player, index, section) {
        console.log('isCallbackPress')
        this.setState({
            showPopup: false
        }, () => {
            if (this.props.onCallbackPress) {
                this.props.onCallbackPress(player, index, section);
            }
        })

    }

    loadMoreData() {
        if (this.state.showPopup) {
            this.page++;
            console.log('loadMoreData', this.page)
            this.requestGroupFlight();
        }

    }

    requestGroupFlight() {
        // if (this.loading) {
        //     this.loading.showLoading();
        // }
        let self = this;
        let url = this.getConfig().getBaseUrl() + ApiService.group_member_flight(this.page);
        let formData = {
            "group_id": this.groupId,
        }
        console.log('requestGroupFlight.url', url)

        Networking.httpRequestPost(url, (jsonData) => {
            // if (this.loading) {
            //     this.loading.hideLoading();
            // }
            self.model = new FlightGroupModel();
            self.model.parseData(self.state.memberFlightList.length + 1, jsonData);
            if (self.model.getErrorCode() === 0) {
                let ls = self.model.getFlightGroup();
                if (ls.length > 0) {
                    if (self.page === 1) {
                        self.state.memberFlightList = [];
                    }
                    self.setState({
                        memberFlightList: [...self.state.memberFlightList, ...ls],
                    }, () => {

                    })
                }

            }
        }, formData, (error) => {
            // self.internalLoading.hideLoading();
        });
    }

}

const styles = StyleSheet.create({
    container: {
        width: scale(320),
        height: scale(220),
    },
    popup_style: {
        width: scale(320),
        height: scale(250),
        backgroundColor: 'rgba(0,0,0,0)',
        borderRadius: 7
    },
    view_section: {
        backgroundColor: '#37B2E7',
        justifyContent: 'space-between',
        marginLeft: scale(10),
        marginRight: scale(10)
    },
    txt_section: {
        color: '#fff',
        fontSize: fontSize(15, scale(1)),
        paddingLeft: scale(5),
        paddingTop: verticalScale(5),
        paddingBottom: verticalScale(5)
    },
    separator_view: {
        height: 1,
        backgroundColor: '#D6D4D4',
        marginRight: scale(10),
        marginLeft: scale(10)
    },
    view_content: {
        backgroundColor: '#fff',
        flex: 1,
        borderRadius: scale(10),
        width: width - scale(40),
        margin: scale(20),
        paddingTop: scale(10),
        paddingBottom: scale(10)
    },
    view_user_swap: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    txt_title: {
        color: 'black',
        fontSize: fontSize(18),
        fontWeight: 'bold'
    },
    view_user_row: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: scale(10),
        marginTop: scale(10)
    },
    container_content_view: {
        justifyContent: 'center',
        marginLeft: scale(8)
    },

    fullname_text: {
        fontWeight: 'bold',
        fontSize: fontSize(15, scale(1)),
        color: '#000'
    },

    user_id_text: {
        color: '#adadad',
        fontSize: fontSize(13, -scale(1))
    },

});