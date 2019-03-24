import React from 'react';
import {
    Platform,
    StyleSheet,
    Text,
    View,
    FlatList,
    BackHandler
} from 'react-native';
import BasePureComponent from '../../Core/View/BasePureComponent';
import Networking from '../../Networking/Networking';
import ApiService from '../../Networking/ApiService';
import HeaderView from '../HeaderView';
import SuggestItemView from './SuggestItemView';

export default class SuggestFriendView extends BasePureComponent {

    static defaultProps = {

    }

    constructor(props) {
        super(props);

        this.state = {
            listUser: []
        }
        this.onBackPress = this.onBackPress.bind(this);
    }

    render() {
        let {
            listUser
        } = this.state;
        if (listUser.length > 0) {
            return (
                <View style={styles.container}>
                    <HeaderView
                        title={this.t('people_may_know')}
                        onMenuHeaderClick={this.onBackPress}
                        showBack={false}
                        menuTitle={this.t('done')} />
                    <FlatList
                        data={listUser}
                        // onEndReached={this.onLoadMoreData}
                        // onEndReachedThreshold={3}
                        // refreshing={refreshing}
                        // onRefresh={this.onRefreshTopicDiscuss}
                        // onScroll={this.onScrollFlatList}
                        keyboardShouldPersistTaps='always'
                        ItemSeparatorComponent={(sectionId, rowId) => <View key={rowId} style={styles.view_line} />}
                        enableEmptySections={true}
                        keyExtractor={(item, index) => item + index}
                        // ListFooterComponent={this.renderFooter}
                        renderItem={({ item, index }) =>
                            <SuggestItemView
                                player={item}
                                type={1} />
                        }
                    />
                </View>
            );
        } else {
            return null;
        }

    }

    onBackPress() {
        this.props.navigation.replace('LeaderBoardView', { 'isNewUser': true });
    }

    componentDidMount() {
        this.rotateToPortrait();
        this.handleHardwareBackPress();

        this.requestSuggestFriend();
    }

    componentWillUnmount() {
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


    requestSuggestFriend() {
        let url = this.getConfig().getBaseUrl() + ApiService.get_list_friends_suggest();
        let self = this;
        console.log('url', url)
        Networking.httpRequestGet(url, (jsonData) => {
            console.log("dong y loi moi", jsonData);
            if (jsonData['error_code'] === 0) {
                let data = jsonData['data'];
                if (data && data.length > 0) {
                    this.setState({
                        listUser: data
                    })
                } else {
                    this.props.navigation.replace('LeaderBoardView', { 'isNewUser': true });
                }
            } else {
                this.props.navigation.replace('LeaderBoardView', { 'isNewUser': true });
            }

        }, () => {
            this.props.navigation.replace('LeaderBoardView', { 'isNewUser': true });
        });
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        flexDirection: 'column'
    },
    txt_suggest_friend: {
        color: '#6E6E6E',
        fontSize: 16,
        marginLeft: 10,
        marginRight: 10,
        marginTop: 8,
        marginBottom: 8,
        fontWeight: 'bold'
    },
    view_line: {
        height: 1,
        backgroundColor: '#D6D4D4'
    },
    view_line_big: {
        height: 8,
        backgroundColor: '#D0D0D0'
    }
});