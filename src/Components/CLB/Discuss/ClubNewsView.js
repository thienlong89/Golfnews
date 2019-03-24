import React from 'react';
import {
    Platform,
    StyleSheet,
    Text,
    View,
    FlatList,
    ScrollView
} from 'react-native';
import Touchable from 'react-native-platform-touchable';
import BaseComponent from '../../../Core/View/BaseComponent';
import Networking from '../../../Networking/Networking';
import ApiService from '../../../Networking/ApiService';
import ClubListView from '../Items/ClubListView';
import ClubPostListView from '../Items/ClubPostListView';

export default class ClubNewsView extends BaseComponent {

    constructor(props) {
        super(props);
        this.state = {
        }
        this.onClubItemPress = this.onClubItemPress.bind(this);
        this.clubListCallback = this.clubListCallback.bind(this);
    }

    renderClubList() {
        return (
            <ClubListView
                onClubItemPress={this.onClubItemPress}
                clubListCallback={this.clubListCallback} />
        )
    }

    render() {



        return (
            <View style={styles.container}>
                {/* <ScrollView contentContainerStyle={styles.scrollview_container}
                    style={{ flexGrow: 1 }}> */}
                <View style={{ backgroundColor: '#DADADA', height: 8 }} />
                {this.renderClubList()}

                <View style={styles.view_space}>
                    <Text allowFontScaling={global.isScaleFont} style={styles.txt_new_post}>
                        {this.t('new_post')}
                    </Text>
                </View>
                <ClubPostListView
                    ref={(refClubPostListView) => { this.refClubPostListView = refClubPostListView }}
                    {...this.props}
                />
                {/* </ScrollView> */}
                {/* {this.renderMessageBar()}
                {this.renderInternalLoading()} */}

            </View>
        );
    }

    componentDidMount() {
    }

    clubListCallback(clubList) {
        if (clubList.length > 0) {
            this.refClubPostListView.setClubList(clubList);
        }
    }

    onClubItemPress(data) {
        console.log('onClubItemPress')
        let club = data.getClub() ? data.getClub() : {};
        this.clbId = club.getId();
        this.clbName = club.getName();
        this.logoUrl = club.getLogo();
        let totalMember = club.getTotalMember();

        let { parentNavigator } = this.props.screenProps;
        parentNavigator.navigate('introduce_club_view',
            {
                clubId: this.clbId,
                clubName: this.clbName,
                logoUrl: this.logoUrl,
                isAdmin: data.getIsUserAdmin(),
                isAccepted: data.getIsAccepted() === 1,
                isMember: data.getIsAccepted() === 1,
                invitation_id: data.getId(),
                totalMember: totalMember,
                callback: this.onClubDetailCallback.bind(this)
            });
    }

    onClubDetailCallback(clubId) {
        let index = this.state.clubList.findIndex((club) => {
            let id = club.getClub() ? club.getClub().getId() : '';
            return clubId === id;
        });
        if (index != -1) {
            this.state.clubList.splice(index, 1);
            this.setState({
                clubList: this.state.clubList
            })
        }
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    separator_view: {
        height: 1,
        backgroundColor: '#E3E3E3'
    },
    scrollview_container: {
        backgroundColor: '#fff',
    },
    view_space: {
        backgroundColor: '#DADADA',
        paddingLeft: 10,
        marginTop: 5
    },
    txt_new_post: {
        color: 'black',
        fontSize: 15,
        paddingTop: 8,
        paddingBottom: 8
    }
});