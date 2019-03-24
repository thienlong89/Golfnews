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
import SearchFilterModel from '../../Model/User/SearchFilterModel';
import GroupItem from '../Friends/Items/GroupItem';
import CLBItem from '../Friends/Items/CLBItem';
import FriendItem from '../Friends/Items/FriendItem';
import FacilityCourseItem from '../Facilities/FacilityCourseItem';
import FacilityListModel from '../../Model/Facility/FacilityListModel';

export default class SearchByFilterView extends BaseComponent {

    static defaultProps = {

    }

    constructor(props) {
        super(props);
        let { keyword, type } = this.props.navigation.state.params;
        this.page = 1;
        this.keyword = keyword;
        this.type = type;

        this.state = {
            groups: [],
            clubs: [],
            users: [],
            facilities: []
        }

        this.onBackPress = this.onBackPress.bind(this);
        this.onItemGroupClick = this.onItemGroupClick.bind(this);
        this.onItemClubClick = this.onItemClubClick.bind(this);
        this.loadMoreData = this.loadMoreData.bind(this);
    }

    renderGroupView(groups = []) {
        if (groups.length > 0) {
            return (
                <View style={styles.container_section}>
                    <FlatList
                        data={groups}
                        onEndReached={this.loadMoreData}
                        onEndReachedThreshold={0.2}
                        initialNumToRender={5}
                        keyboardShouldPersistTaps='always'
                        ItemSeparatorComponent={(sectionId, rowId) => <View key={rowId} style={styles.separator_view}></View>}
                        renderItem={({ item, index }) =>
                            <GroupItem
                                data={item}
                                index={index}
                                onItemClick={this.onItemGroupClick}
                            />
                        }
                        contentContainerStyle={{ marginBottom: scale(10), marginTop: scale(10) }}
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

                    <FlatList
                        data={clubs}
                        onEndReached={this.loadMoreData}
                        onEndReachedThreshold={0.2}
                        initialNumToRender={5}
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
                <View style={[styles.container_section, { paddingTop: scale(10), paddingBottom: scale(10) }]}>
                    <FlatList
                        data={users}
                        onEndReached={this.loadMoreData}
                        onEndReachedThreshold={0.2}
                        initialNumToRender={5}
                        keyboardShouldPersistTaps='always'
                        ItemSeparatorComponent={(sectionId, rowId) => <View key={rowId} style={styles.separator_view}></View>}
                        renderItem={({ item, index }) =>
                            <Touchable onPress={this.onItemUserClick.bind(this, item)}>
                                <FriendItem
                                    data={item} />
                            </Touchable>
                        }
                    />
                </View>
            )
        }
        return null;
    }

    renderFacilitiesView(facilities = []) {
        if (facilities.length > 0) {
            return (
                <View style={[styles.container_section, { paddingTop: scale(10), paddingBottom: scale(10) }]}>
                    <FlatList
                        data={facilities}
                        onEndReached={this.loadMoreData}
                        onEndReachedThreshold={0.2}
                        initialNumToRender={5}
                        keyboardShouldPersistTaps='always'
                        ItemSeparatorComponent={(sectionId, rowId) => <View key={rowId} style={styles.separator_view}></View>}
                        renderItem={({ item, index }) =>
                            <Touchable onPress={this.onCourseItemClick.bind(this, item, index)}>
                                <FacilityCourseItem facilityCourseModel={item} />
                            </Touchable>
                        }
                    />
                </View>
            )
        }
        return null;
    }


    renderSwitch(type, users, clubs, groups, facilities) {
        switch (type) {
            case 1:
                return (
                    this.renderUserView(users)
                )
                break;
            case 2:
                return (
                    this.renderClubView(clubs)
                )
                break;
            case 3:
                return (
                    this.renderGroupView(groups)
                )
                break;
            case 4:
                return (
                    this.renderFacilitiesView(facilities)
                )
                break;
            default:
                break;
        }
    }

    renderTitle(type) {
        switch (type) {
            case 1:
                return this.t('player')
            case 2:
                return this.t('club_name')
            case 3:
                return this.t('group')
            case 4:
                return this.t('golf_course')
            default:
                return '';
        }
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
                <HeaderView
                    title={this.renderTitle(this.type)}
                    handleBackPress={this.onBackPress} />
                <View style={{ flex: 1 }}>
                    
                    {this.renderSwitch(this.type, users, clubs, groups, facilities)}
                    {this.renderInternalLoading()}
                </View>

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

        if (this.type === 4) {
            this.requestSearchFacilities();
        } else {
            this.requestSearchFilter();
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

    loadMoreData() {
        this.page++;
        if (this.type === 4) {
            this.requestSearchFacilities();
        } else {
            this.requestSearchFilter();
        }
    }

    requestSearchFilter() {
        this.internalLoading.showLoading();
        let self = this;
        let url = this.getConfig().getBaseUrl() + ApiService.user_filter_search_all(this.keyword, this.type, this.page);
        console.log('url: ', url);
        Networking.httpRequestGet(url, (jsonData) => {
            self.internalLoading.hideLoading();
            self.model = new SearchFilterModel(self);
            self.model.parseData(jsonData, self.type);
            if (self.model.getErrorCode() === 0) {
                if (self.type === 1) {
                    let users = self.model.getUsers();
                    if (users.length > 0) {
                        self.setState({
                            users: [...self.state.users, ...users]
                        })
                    }

                } else if (self.type === 2) {
                    let clubs = self.model.getClubs();
                    if (clubs.length > 0) {
                        self.setState({
                            clubs: [...self.state.clubs, ...clubs],
                        })
                    }

                } else if (self.type === 3) {
                    let groups = self.model.getGroups();
                    if (groups.length > 0) {
                        self.setState({
                            groups: [...self.state.groups, ...groups],
                        })
                    }

                }

            } else {
                self.showErrorMsg(self.model.getErrorMsg())
            }
        }, () => {
            //time out
            self.internalLoading.hideLoading();
        });
    }

    requestSearchFacilities() {
        this.internalLoading.showLoading();
        let self = this;
        let url = this.getConfig().getBaseUrl() + ApiService.search_facility('', '', '', this.keyword, this.page);
        console.log('url: ', url);
        Networking.httpRequestGet(url, (jsonData) => {
            self.internalLoading.hideLoading();
            self.model = new FacilityListModel();
            self.model.parseData(jsonData);
            if (self.model.getErrorCode() === 0) {
                let searchList = self.model.getFacilityList();
                if (searchList.length > 0) {
                    self.setState({
                        facilities: [...self.state.facilities, ...searchList],
                    })
                }
            } else {
                self.showErrorMsg(self.model.getErrorMsg());
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
    }

    onItemUserClick(user) {
        let {
            navigation
        } = this.props;
        if (navigation && user) {
            navigation.navigate('player_info', { "puid": user.id });
        }
    }

    onCourseItemClick(facilityCourseModel, itemId) {
        let {
            navigation
        } = this.props;
        if (navigation) {
            navigation.navigate('review_facility', { id: facilityCourseModel.id, title: facilityCourseModel.sub_title });
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