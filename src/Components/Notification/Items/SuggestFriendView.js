import React from 'react';
import {
    Platform,
    StyleSheet,
    Text,
    View,
    FlatList
} from 'react-native';
import BasePureComponent from '../../../Core/View/BasePureComponent';
import Networking from '../../../Networking/Networking';
import ApiService from '../../../Networking/ApiService';
import NotifyFriendItem from '../Items/NotifyFriendItem';

export default class SuggestFriendView extends BasePureComponent {

    static defaultProps = {

    }

    constructor(props) {
        super(props);

        this.state = {
            listUser: []
        }
    }

    render() {
        let {
            listUser
        } = this.state;
        if (listUser.length > 0) {
            return (
                <View style={styles.container}>
                    <View style={styles.view_line_big} />
                    <Text allowFontScaling={global.isScaleFont} style={styles.txt_suggest_friend}>{this.t('people_may_know')}</Text>
                    <View style={styles.view_line} />
                    <FlatList
                        data={listUser}
                        // onEndReached={this.onLoadMoreData}
                        // onEndReachedThreshold={3}
                        // refreshing={refreshing}
                        // onRefresh={this.onRefreshTopicDiscuss}
                        // onScroll={this.onScrollFlatList}
                        keyboardShouldPersistTaps='always'
                        // ItemSeparatorComponent={(sectionId, rowId) => <View key={rowId} style={styles.separator_view} />}
                        enableEmptySections={true}
                        keyExtractor={(item, index) => item + index}
                        // keyExtractor={chunk => chunk[0].id}
                        // ListFooterComponent={this.renderFooter}
                        renderItem={({ item, index }) =>
                            <NotifyFriendItem
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
        if (this.props.navigation) {
            this.props.navigation.goBack();
        }
    }

    componentDidMount() {
        this.requestSuggestFriend();
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
                }
            }

        });
    }
}

const styles = StyleSheet.create({
    container: {
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