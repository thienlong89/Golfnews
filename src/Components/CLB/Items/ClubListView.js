import React from 'react';
import {
    Platform,
    StyleSheet,
    Text,
    View,
    FlatList
} from 'react-native';
import Touchable from 'react-native-platform-touchable';
import BaseComponent from '../../../Core/View/BaseComponent';
import Networking from '../../../Networking/Networking';
import ApiService from '../../../Networking/ApiService';
import CLBItem from '../../Friends/Items/CLBItem';
import ClubInfoListModel from '../../../Model/CLB/ClubInfoListModel';

export default class ClubListView extends BaseComponent {

    static defaultProps = {

    }

    constructor(props) {
        super(props);
        this.onClubItemPress = this.onClubItemPress.bind(this);
        this.state = {
            clubList: []
        }
    }

    render() {
        let { clubList } = this.state;

        return (
            <View style={styles.container}>
                <FlatList
                    data={clubList}
                    keyboardShouldPersistTaps='always'
                    ItemSeparatorComponent={(sectionId, rowId) => <View key={rowId} style={styles.separator_view} />}
                    // keyExtractor={this._keyExtractor}
                    renderItem={({ item }) =>
                        // <Touchable onPress={this.onClubItemPress.bind(this, item)}>
                        <CLBItem
                            data={item}
                            clbId={item.getClub().getId()}
                            clbName={item.getClub().getName()}
                            totalMember={item.getClub().getTotalMember()}
                            logoUrl={item.getClub().getLogo()}
                            onItemClickCallback={this.onClubItemPress} />
                        // </Touchable>

                    }
                />
                {this.renderInternalLoading()}
            </View>
        );
    }



    componentDidMount() {
        this.requestGetClubList();
    }

    requestGetClubList() {
        //this.customLoading.showLoading();
        this.internalLoading.showLoading();
        let url = this.getConfig().getBaseUrl() + ApiService.club_list_join();
        let self = this;
        console.log("url : ", url);
        Networking.httpRequestGet(url, this.onGetClubListResponse.bind(this), () => {
            //time out
            //this.customLoading.hideLoading();
            self.internalLoading.hideLoading();
        });
    }

    onGetClubListResponse(jsonData) {
        this.internalLoading.hideLoading();
        this.model = new ClubInfoListModel(this);
        this.model.parseData(jsonData);
        if (this.model.getErrorCode() === 0) {
            this.setState({
                clubList: this.model.getClubList()
            }, () => {
                if (this.props.clubListCallback) {
                    this.props.clubListCallback(this.model.getClubList());
                }
            })
        } else {
            this.showErrorMsg(this.model.getErrorMsg())
        }
    }

    onClubItemPress(item) {
        console.log('onClubItemPress', item)
        if (this.props.onClubItemPress) {
            this.props.onClubItemPress(item);
        }
    }

}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#FFFFFF',
    },
});