import React from 'react';
import {
    Platform,
    StyleSheet,
    Text,
    View,
    BackHandler,
    FlatList,
    SectionList
} from 'react-native';
import Touchable from 'react-native-platform-touchable';
import BaseComponent from '../../../Core/View/BaseComponent';
import HeaderView from '../../HeaderView';
import Networking from '../../../Networking/Networking';
import ApiService from '../../../Networking/ApiService';
import { scale, verticalScale, moderateScale, fontSize } from '../../../Config/RatioScale';
import AdminMemberItem from '../Items/AdminMemberItem';
import SearchInputText from '../../Common/SearchInputText';
import ClubMemberModel from '../../../Model/CLB/ClubMemberModel';

export default class AdminListMemberView extends BaseComponent {

    static defaultProps = {

    }

    constructor(props) {
        super(props);

        this.clubId = this.props.navigation.state.params.clubId;
        this.page = 1;
        this.localMemberList = [];
        this.state = {
            memberList: []
        }

        this.onBackPress = this.onBackPress.bind(this);
        this.onChangeSearchText = this.onChangeSearchText.bind(this);
        this.onLoadMoreMember = this.onLoadMoreMember.bind(this);
        this.onMemberPress = this.onMemberPress.bind(this);
    }

    renderSectionHeader() {
        return (
            <View>
                <View style={styles.separator_view} />
                <View style={styles.view_header_list}>
                    <View style={styles.view_stt}>
                        <Text allowFontScaling={global.isScaleFont} style={styles.txt_title_list}>{this.t('stt')}</Text>
                    </View>
                    <View style={styles.view_line} />
                    <View style={styles.view_player_name}>
                        <Text allowFontScaling={global.isScaleFont} style={styles.txt_title_list}>{this.t('member_name_title')}</Text>
                    </View>
                    <View style={styles.view_line} />
                    <View style={styles.view_birthday}>
                        <Text allowFontScaling={global.isScaleFont} style={styles.txt_title_list}>{this.t('birthday')}</Text>
                    </View>
                    <View style={styles.view_line} />
                    <View style={styles.view_hdc}>
                        <Text allowFontScaling={global.isScaleFont} style={styles.txt_title_list}>{this.t('hdc_index')}</Text>
                    </View>
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
                <HeaderView
                    title={this.t('danh_sach_thanh_vien')}
                    handleBackPress={this.onBackPress} />
                <View style={{ flex: 1 }}>


                    {/* <View style={styles.border_search}>
                        <SearchInputText
                            autoFocus={false}
                            placeholder={this.t('search_member')}
                            onChangeSearchText={this.onChangeSearchText}
                        />
                    </View> */}
                    {/* <View style={{ backgroundColor: '#DADADA', height: 1 }} /> */}

                    <SectionList
                        renderItem={({ item, index, section }) =>
                            <AdminMemberItem
                                player={item}
                                index={index + 1}
                                onItemPress={this.onMemberPress}
                            />
                        }
                        renderSectionHeader={({ section: { title } }) => this.renderSectionHeader(title)}
                        ItemSeparatorComponent={(sectionId, rowId) => <View key={rowId} style={styles.separator_view} />}
                        sections={[
                            { title: 0, data: memberList },
                        ]}
                        // SectionSeparatorComponent={(sectionId, rowId) => <View key={rowId} style={{height: 10, backgroundColor: 'red'}} />}
                        keyExtractor={(item, index) => item + index}
                        onEndReached={this.onLoadMoreMember}
                        onEndReachedThreshold={0.2}
                        stickySectionHeadersEnabled={true}
                        style={styles.section_view}
                    />
                    <View style={{ backgroundColor: '#DADADA', height: 1, marginBottom: 10, marginLeft: 10, marginRight: 10 }} />
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

        this.getListMember();
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

    onChangeSearchText(input) {
        console.log('onChangeSearchText', input)
    }

    onLoadMoreMember() {
        this.page++;
        this.getListMember();
    }

    getListMember() {
        this.internalLoading.showLoading();
        let url = this.getConfig().getBaseUrl() + ApiService.list_member_club_with_star(this.clubId, this.page);
        console.log("url ", url);
        let self = this;
        Networking.httpRequestGet(url, (jsonData) => {
            this.model = new ClubMemberModel(this);
            this.model.parseData(jsonData);
            if (this.model.getErrorCode() === 0) {
                let memberList = this.model.getMemberList();
                if (memberList.length > 0) {
                    this.setState({
                        memberList: [...this.state.memberList, ...memberList],
                    }, () => {

                    })
                }

            } else {
                // this.page--;
                this.showErrorMsg(this.model.getErrorMsg())
            }
            this.internalLoading.hideLoading();
        }, () => {
            //time out
            if (self.page > 1) self.page--;
            self.internalLoading.hideLoading();
            self.showErrorMsg(self.t('time_out'))
        });
    }

    onMemberPress(player) {
        // let { screenProps } = this.props;
        if (this.props.navigation) {
            this.props.navigation.navigate('member_profile_navigator',
                {
                    player: player
                })
        }
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    border_search: {
        borderWidth: 1,
        borderRadius: scale(8),
        borderColor: '#A1A1A1',
        margin: scale(10)
    },
    separator_view: {
        height: 1,
        backgroundColor: '#DADADA',
        // marginLeft: scale(10),
        // marginRight: scale(10)
    },
    view_header_list: {
        flexDirection: 'row',
        backgroundColor: '#E8E8E8',
        minHeight: scale(35)
    },
    view_stt: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    view_player_name: {
        flex: 5,
        justifyContent: 'center',
        alignItems: 'center'
    },
    view_birthday: {
        flex: 2.5,
        justifyContent: 'center',
        alignItems: 'center'
    },
    view_hdc: {
        flex: 2.1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    txt_title_list: {
        color: '#707070',
        fontWeight: 'bold',
        fontSize: fontSize(13)
    },
    view_line: {
        backgroundColor: '#D4D4D4',
        width: 1
    },
    section_view: {
        marginLeft: 10,
        marginRight: 10,
        marginTop: 10,
        backgroundColor: '#fff',
        borderColor: '#D4D4D4',
        borderLeftWidth: 1,
        borderRightWidth: 1,
        borderBottomWidth: 0,
        borderTopWidth: 0
    }
});