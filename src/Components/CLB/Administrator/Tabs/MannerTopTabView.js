import React from 'react';
import {
    Platform,
    StyleSheet,
    Text,
    View,
    SectionList
} from 'react-native';
import Touchable from 'react-native-platform-touchable';
import BaseComponent from '../../../../Core/View/BaseComponent';
import Networking from '../../../../Networking/Networking';
import ApiService from '../../../../Networking/ApiService';
import { scale, verticalScale, moderateScale, fontSize } from '../../../../Config/RatioScale';
import MannerClubItemView from '../../Items/MannerClubItemView';
import MannerTopModel from '../../../../Model/CLB/MannerTopModel';

export default class MannerTopTabView extends BaseComponent {

    constructor(props) {
        super(props);

        let { clubName, clubId } = this.props.screenProps.navigation.state.params;
        this.clubName = clubName;
        this.clubId = clubId;
        this.page = 1;
        this.state = {
            memberList: []
        }

        this.onLoadMoreMember = this.onLoadMoreMember.bind(this);
        this.onItemPress = this.onItemPress.bind(this);
    }

    renderSectionHeader(title) {
        return (
            <View style={styles.view_header}>
                <View style={styles.view_stt}>
                    <Text allowFontScaling={global.isScaleFont} style={styles.txt_title}>{this.t('stt')}</Text>
                </View>
                <View style={styles.view_name}>
                    <Text allowFontScaling={global.isScaleFont} style={styles.txt_title}>{this.t('name_title')}</Text>
                </View>
                {/* <View style={styles.view_ranking}>
                    <Text allowFontScaling={global.isScaleFont} style={styles.txt_title}>{this.t('rank_title')}</Text>
                </View> */}
                <View style={styles.view_score}>
                    <Text allowFontScaling={global.isScaleFont} style={styles.txt_title}>{this.t('score_title')}</Text>
                </View>
            </View>
        )
    }

    render() {
        let {
            memberList
        } = this.state;

        return (
            <View style={styles.container}>

                <View style={[styles.separator_view, { marginTop: scale(10), marginLeft: scale(10), marginRight: scale(10) }]} />
                <SectionList
                    renderItem={({ item, index, section }) =>
                        <MannerClubItemView
                            manner={item}
                            index={index + 1}
                            onItemPress={this.onItemPress} />
                    }
                    renderSectionHeader={({ section: { title } }) => this.renderSectionHeader(title)}
                    ItemSeparatorComponent={(sectionId, rowId) => <View key={rowId} style={styles.separator_view} />}
                    sections={[
                        { title: 0, data: memberList }
                    ]}
                    keyExtractor={(item, index) => item + index}
                    onEndReached={this.onLoadMoreMember}
                    onEndReachedThreshold={0.2}
                    stickySectionHeadersEnabled={true}
                    style={styles.flatlist}
                />
                {this.renderMessageBar()}
                {this.renderInternalLoading()}
            </View>
        );
    }


    componentDidMount() {
        this.registerMessageBar();

        this.getListMember();
    }

    componentWillUnmount() {
        this.unregisterMessageBar();
    }

    onLoadMoreMember() {
        this.page++;
        this.getListMember();
    }

    getListMember() {
        this.internalLoading.showLoading();
        let url = this.getConfig().getBaseUrl() + ApiService.club_get_top_manner_club(this.clubId, this.page);
        console.log("url ", url);
        let self = this;
        Networking.httpRequestGet(url, (jsonData) => {
            console.log('getListMember', jsonData)
            self.internalLoading.hideLoading();
            self.model = new MannerTopModel(this);
            self.model.parseData(jsonData);
            if (self.model.getErrorCode() === 0) {
                let memberList = self.model.getMemberList();
                if (memberList.length > 0) {
                    self.setState({
                        memberList: [...self.state.memberList, ...memberList]
                    })
                }

            } else {
                // this.page--;
                self.showErrorMsg(self.model.getErrorMsg())
            }
        }, () => {
            //time out
            if (self.page > 1) self.page--
            self.internalLoading.hideLoading();
            self.showErrorMsg(self.t('time_out'))
        });
    }

    onItemPress(manner, index) {
        let { screenProps } = this.props;
        if (screenProps) {
            screenProps.navigation.navigate('member_profile_navigator',
                {
                    player: manner.User
                })
        }
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    view_header: {
        flexDirection: 'row',
        minHeight: scale(30),
        alignItems: 'center',
        backgroundColor: '#EAEAEA'
    },
    txt_title: {
        color: '#818181',
        fontSize: fontSize(15)
    },
    view_stt: {
        width: scale(50),
        justifyContent: 'center',
        alignItems: 'center'
    },
    view_name: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    view_ranking: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    view_score: {
        width: scale(50),
        justifyContent: 'center',
        alignItems: 'center'
    },
    separator_view: {
        height: 1,
        backgroundColor: '#D6D4D4'
    },
    flatlist: {
        borderColor: '#D6D4D4',
        borderLeftWidth: 1,
        borderTopWidth: 0,
        borderRightWidth: 1,
        borderBottomWidth: 1,
        flexGrow: 0,
        marginLeft: scale(10),
        marginRight: scale(10),
        marginBottom: scale(10)
    },
});