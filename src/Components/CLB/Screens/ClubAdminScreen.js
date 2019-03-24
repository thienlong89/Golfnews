import React from 'react';
import {
    Platform,
    StyleSheet,
    Text,
    View,
    FlatList,
    TouchableOpacity,
    Image
} from 'react-native';
import Touchable from 'react-native-platform-touchable';
import BaseComponent from '../../../Core/View/BaseComponent';
import HeaderView from '../../HeaderView';
import Networking from '../../../Networking/Networking';
import ApiService from '../../../Networking/ApiService';
import LoadingView from '../../../Core/Common/LoadingView';
import ClubMemberModel from '../../../Model/CLB/ClubMemberModel';
import ClubMemberItem from '../Items/ClubMemberItem';

export default class ClubAdminScreen extends BaseComponent {

    constructor(props) {
        super(props);
        let { clubName, clubId, isAdmin } = this.props.screenProps.navigation.state.params;
        this.clubId = clubId;
        this.isAdmin = isAdmin;
        this.page = 1;
        this.state = {
            dataSource: []
        }
    }

    renderFooterComponent() {
        return (
            <TouchableOpacity style={{ flex: 1 }}>
                <View style={{paddingTop: 10}}>
                    <View style={styles.separator_view} />
                    <View style={styles.view_add_admin}>
                        <View style={styles.view_circle}>
                            <Image
                                style={styles.img_icon_add}
                                source={this.getResources().ic_add_member} />
                        </View>
                        <Text allowFontScaling={global.isScaleFont} style={styles.txt_add_admin}>{this.t('add_admin')}</Text>
                    </View>
                </View>

            </TouchableOpacity>
        )
    }

    render() {
        let { dataSource } = this.state;

        return (
            <View style={styles.container}>

                <FlatList
                    ListFooterComponent={this.renderFooterComponent.bind(this)}
                    data={dataSource}
                    onEndReachedThreshold={5}
                    keyboardShouldPersistTaps='always'
                    ItemSeparatorComponent={(sectionId, rowId) => <View key={rowId} style={styles.separator_view} />}
                    enableEmptySections={true}
                    renderItem={({ item }) =>
                        <ClubMemberItem
                            member={item} />
                    }
                />

                <LoadingView ref={(customLoading) => { this.customLoading = customLoading; }}
                    isShowOverlay={false} />
                {this.renderMessageBar()}
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

    getListMember() {
        this.customLoading.showLoading();
        let url = this.getConfig().getBaseUrl() + ApiService.club_list_member_new(this.clubId, this.page);
        console.log("url ", url);
        let self = this;
        Networking.httpRequestGet(url, this.onResponseData.bind(this), () => {
            //time out
            self.customLoading.hideLoading();
        });
    }

    onResponseData(jsonData) {
        this.model = new ClubMemberModel(this);
        this.model.parseData(jsonData);
        if (this.model.getErrorCode() === 0) {
            this.setState({
                dataSource: this.model.getAdminList()
            })

        }
        this.customLoading.hideLoading();
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    separator_view: {
        height: 1,
        backgroundColor: '#E3E3E3'
    },
    view_add_admin: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 10,
        paddingLeft: 10,
        paddingRight: 10
    },
    view_circle: {
        width: 50,
        height: 50,
        borderColor: '#00ABA7',
        borderRadius: 25,
        borderWidth: 2,
        justifyContent: 'center',
        alignItems: 'center'
    },
    img_icon_add: {
        width: 30,
        height: 30,
        resizeMode: 'contain',
        tintColor: '#00ABA7'
    },
    txt_add_admin: {
        fontSize: 15,
        color: '#00ABA7',
        marginLeft: 15
    }
});