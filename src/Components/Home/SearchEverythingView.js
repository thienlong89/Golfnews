import React from 'react';
import {
    Platform,
    StyleSheet,
    Text,
    View,
    BackHandler,
    FlatList,
    ScrollView
} from 'react-native';
import Touchable from 'react-native-platform-touchable';
import BaseComponent from '../../Core/View/BaseComponent';
import HeaderView from '../HeaderView';
import Networking from '../../Networking/Networking';
import ApiService from '../../Networking/ApiService';
import { scale, verticalScale, moderateScale, fontSize } from '../../Config/RatioScale';
import HeaderSearchView from '../HeaderSearchView';
import SearchAllModel from '../../Model/User/SearchAllModel';
import GroupItem from '../Friends/Items/GroupItem';
import CLBItem from '../Friends/Items/CLBItem';
import FriendItem from '../Friends/Items/FriendItem';
import FacilityCourseItem from '../Facilities/FacilityCourseItem';
import DataManager from '../../Core/Manager/DataManager';
import Constant from '../../Constant/Constant';

export default class SearchEverythingView extends BaseComponent {

    static defaultProps = {

    }

    constructor(props) {
        super(props);
        this.inputData = '';
        this.state = {
            groups: [],
            clubs: [],
            users: [],
            facilities: []
        }

        this.onLoadLocalComplete = this.onLoadLocalComplete.bind(this);
        this.onBackPress = this.onBackPress.bind(this);
        this.onChangeSearchText = this.onChangeSearchText.bind(this);
        this.onItemGroupClick = this.onItemGroupClick.bind(this);
        this.onItemClubClick = this.onItemClubClick.bind(this);
        this.onSeeMoreUserPress = this.onSeeMoreUserPress.bind(this);
        this.onSeeMoreGroupPress = this.onSeeMoreGroupPress.bind(this);
        this.onSeeMoreClubPress = this.onSeeMoreClubPress.bind(this);
        this.onSeeMoreFacilitiesPress = this.onSeeMoreFacilitiesPress.bind(this);
    }

    renderGroupView(groups = []) {
        if (groups.length > 0) {
            return (
                <View style={styles.container_section}>
                    <View style={styles.view_section_header}>
                        <Text allowFontScaling={global.isScaleFont} style={styles.txt_title_header}>{this.t('group')}</Text>
                        <Text allowFontScaling={global.isScaleFont} style={styles.txt_see_more}
                            onPress={this.onSeeMoreGroupPress}>{this.t('xem_them')}</Text>
                    </View>
                    <View style={styles.line} />
                    <FlatList
                        data={groups}
                        keyboardShouldPersistTaps='always'
                        ItemSeparatorComponent={(sectionId, rowId) => <View key={rowId} style={styles.separator_view}></View>}
                        renderItem={({ item, index }) =>
                            <GroupItem
                                data={item}
                                index={index}
                                onItemClick={this.onItemGroupClick}
                            />
                        }
                    />
                </View>
            )
        }
        return null;
    }

    renderClubView(clubs = []) {
        if (clubs.length > 0) {
            return (
                <View style={styles.container_section}>
                    <View style={styles.view_section_header}>
                        <Text allowFontScaling={global.isScaleFont} style={styles.txt_title_header}>{this.t('club_name')}</Text>
                        <Text allowFontScaling={global.isScaleFont} style={styles.txt_see_more}
                            onPress={this.onSeeMoreClubPress}>{this.t('xem_them')}</Text>
                    </View>
                    <View style={styles.line} />
                    <FlatList
                        data={clubs}
                        keyboardShouldPersistTaps='always'
                        ItemSeparatorComponent={(sectionId, rowId) => <View key={rowId} style={styles.separator_view}></View>}
                        renderItem={({ item, index }) =>
                            <CLBItem
                                data={item}
                                onItemClickCallback={this.onItemClubClick}
                                clbId={item.getId()}
                                clbName={item.getName()}
                                totalMember={item.getTotalMember()}
                                logoUrl={item.getLogo()} />
                        }
                    />
                </View>
            )
        }
        return null;
    }

    renderUserView(users = []) {
        if (users.length > 0) {
            return (
                <View style={styles.container_section}>
                    <View style={styles.view_section_header}>
                        <Text allowFontScaling={global.isScaleFont} style={styles.txt_title_header}>{this.t('player')}</Text>
                        <Text allowFontScaling={global.isScaleFont} style={styles.txt_see_more}
                            onPress={this.onSeeMoreUserPress}>{this.t('xem_them')}</Text>
                    </View>
                    <View style={styles.line} />
                    <FlatList
                        data={users}
                        keyboardShouldPersistTaps='always'
                        ItemSeparatorComponent={(sectionId, rowId) => <View key={rowId} style={styles.separator_view}></View>}
                        renderItem={({ item, index }) =>
                            <Touchable onPress={this.onItemUserClick.bind(this, item)}>
                                <FriendItem
                                    data={item} />
                            </Touchable>
                        }
                        contentContainerStyle={{ paddingBottom: scale(10) }}
                    />
                </View>
            )
        }
        return null;
    }

    renderFacilitiesView(facilities = []) {
        if (facilities.length > 0) {
            return (
                <View style={styles.container_section}>
                    <View style={styles.view_section_header}>
                        <Text allowFontScaling={global.isScaleFont} style={styles.txt_title_header}>{this.t('golf_course')}</Text>
                        <Text allowFontScaling={global.isScaleFont} style={styles.txt_see_more}
                            onPress={this.onSeeMoreFacilitiesPress}>{this.t('xem_them')}</Text>
                    </View>
                    <View style={styles.line} />
                    <FlatList
                        data={facilities}
                        keyboardShouldPersistTaps='always'
                        ItemSeparatorComponent={(sectionId, rowId) => <View key={rowId} style={styles.separator_view}></View>}
                        renderItem={({ item, index }) =>
                            <Touchable onPress={this.onCourseItemClick.bind(this, item, index)}>
                                <FacilityCourseItem facilityCourseModel={item} />
                            </Touchable>
                        }
                        contentContainerStyle={{ paddingBottom: scale(10) }}
                    />
                </View>
            )
        }
        return null;
    }

    render() {
        let {
            groups,
            clubs,
            users,
            facilities
        } = this.state;

        return (
            <View style={styles.container}>
                <HeaderSearchView
                    isHideCancelBtn={true}
                    onChangeSearchText={this.onChangeSearchText}
                    onCancelSearch={this.onBackPress}
                    menuTitle={this.t('done')} />
                <ScrollView>
                    <View style={{ flex: 1 }}>
                        {this.renderClubView(clubs)}
                        {this.renderGroupView(groups)}
                        {this.renderUserView(users)}
                        {this.renderFacilitiesView(facilities)}
                        {this.renderInternalLoading()}
                    </View>
                </ScrollView>

                {this.renderMessageBar()}
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

        DataManager.loadLocalData([Constant.SEARCH_ALL.QUERY], this.onLoadLocalComplete);
        
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

    onLoadLocalComplete(err, result){
        console.log('onLoadLocalComplete', result)
        let value = result[0][1];
        console.log('onLoadLocalComplete', value)
        this.requestSearch(value);
    }

    onChangeSearchText(input) {
        this.inputData = input;
        this.requestSearch(input);
    }

    requestSearch(query) {
        this.internalLoading.showLoading();
        let self = this;
        let url = this.getConfig().getBaseUrl() + ApiService.user_search_all(query);
        console.log('url: ', url);
        Networking.httpRequestGet(url, (jsonData) => {
            console.log('jsonData: ', jsonData);
            self.internalLoading.hideLoading();
            self.model = new SearchAllModel(self);
            self.model.parseData(jsonData);
            if (self.model.getErrorCode() === 0) {
                let groups = self.model.getGroups();
                let clubs = self.model.getClubs();
                let users = self.model.getUsers();
                let facilities = self.model.getFacilities();
                self.setState({
                    groups: groups,
                    clubs: clubs,
                    users: users,
                    facilities: facilities
                })
            } else {
                self.showErrorMsg(self.model.getErrorMsg())
            }
        }, () => {
            //time out
            self.internalLoading.hideLoading();
        });
    }

    onItemGroupClick(group) {
        console.log('onItemGroupClick', group)
        let {
            navigation
        } = this.props;
        if (navigation) {
            navigation.navigate('global_chat', {
                id: group.id,
                type: 3,
                name: group.name,
                categoriz: 'group',
                // refresh: this.refresh.bind(this, data),
                data: group
            });
        }
        this.saveKeyword();
    }

    onItemClubClick(data) {
        let { id, name, logo, totalMember } = data;
        let {
            navigation
        } = this.props;
        if (navigation) {
            navigation.navigate('introduce_club_view', {
                clubId: id,
                clubName: name,
                logoUrl: logo,
                // isAdmin: self.checkIsAdminClub(list_user_admin_club),
                // isGeneralSecretary: self.checkIsGeneralSecretaryClub(list_user_general_secretary_club),
                // isModerator: self.checkIsModeratorClub(list_user_moderator_club),
                // isAccepted: true,
                // isMember: true,
                totalMember: totalMember
            });
        }
        this.saveKeyword();
    }

    onItemUserClick(user) {
        let {
            navigation
        } = this.props;
        if (navigation && user) {
            navigation.navigate('player_info', { "puid": user.id });
        }
        this.saveKeyword();
    }

    onCourseItemClick(facilityCourseModel, itemId) {
        let {
            navigation
        } = this.props;
        if (navigation) {
            navigation.navigate('review_facility', { id: facilityCourseModel.id, title: facilityCourseModel.sub_title });
        }
        this.saveKeyword();
    }


    onSeeMoreUserPress() {
        let {
            navigation
        } = this.props;
        if (navigation) {
            navigation.navigate('search_by_filter_view', {
                'keyword': this.inputData,
                'type': 1
            });
        }
        this.saveKeyword();
    }

    onSeeMoreClubPress() {
        let {
            navigation
        } = this.props;
        if (navigation) {
            navigation.navigate('search_by_filter_view', {
                'keyword': this.inputData,
                'type': 2
            });
        }
        this.saveKeyword();
    }

    onSeeMoreGroupPress() {
        let {
            navigation
        } = this.props;
        if (navigation) {
            navigation.navigate('search_by_filter_view', {
                'keyword': this.inputData,
                'type': 3
            });
        }
        this.saveKeyword();
    }

    onSeeMoreFacilitiesPress() {
        let {
            navigation
        } = this.props;
        if (navigation) {
            navigation.navigate('search_by_filter_view', {
                'keyword': this.inputData,
                'type': 4
            });
        }
        this.saveKeyword();
    }

    saveKeyword() {
        if (this.inputData) {
            DataManager.saveLocalData([[Constant.SEARCH_ALL.QUERY, this.inputData]], (error) => console.log('saveLocalData', error));
        }

    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        flexDirection: 'column'
    },
    container_section: {
        margin: scale(10),
        borderWidth: 1,
        borderRadius: scale(10),
        borderColor: '#D6D4D4'
    },
    view_section_header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingLeft: scale(10)
    },
    txt_title_header: {
        color: 'black',
        fontSize: fontSize(15),
        fontWeight: 'bold'
    },
    txt_see_more: {
        color: '#00ABA7',
        fontSize: fontSize(15),
        padding: scale(10)
    },
    line: {
        backgroundColor: '#D6D4D4',
        height: 1
    },
    separator_view: {
        backgroundColor: '#D6D4D4',
        height: 1,
        marginLeft: scale(10),
        marginRight: scale(10)
    }
});