import { View, StyleSheet, Image, ListView } from 'react-native';
import BaseComponent from '../../Core/View/BaseComponent';

export default class DialogView extends BaseComponent{
    constructor(props) {
        super(props);
        self = this;
        /// this.sendData();
    }

    static navigationOptions = ({ navigation, navigationOptions }) => {
        //const { params } = navigation.state;

        return {
            // title: params ? params.otherParam : 'A Nested Details Screen',
            /* These values are used instead of the shared configuration! */
            headerLeft: (
                <Touchable style={{ width: 34, height: 34,paddingLeft : 7 }} onPress={() => {
                    navigation.goBack();
                }}>
                    <Image
                        style={{ width: 20, height: 34 }}
                        source={require('../../Images/ic_back_large.png')} />
                </Touchable>
            ),
            headerStyle: {
                backgroundColor: '#00aba7',
            },
            //headerTintColor: navigationOptions.headerStyle.backgroundColor,
        };
    };

    static defaultPrors = {
        onBackCallback: null
    }

    sendData(groupId) {
        let url = this.getConfig().getBaseUrl() + `group/list_member?uid=${UserInfo.getUserId()}&group_id=${groupId}&page=${this.state.page}&number=10`;
        console.log("clb url : ", url);
        Networking.httpRequestGet(url, this.onResponse);
    }

    onResponse(jsonData) {
        self.model = new FriendModel(self);
        self.model.parseData(jsonData);
        if (self.model.getErrorCode() === 0) {
            listUsers = [];
            let i = 0, length = self.model.getListFriendData().length;
            //console.log("leng friends : ",length);
            for (; i < length; i++) {
                let objData = self.model.getListFriendData()[i];
                let obj = {
                    avatar: objData.getAvatar(),
                    fullname: objData.getFullname(),
                    userId: objData.getUserId(),
                    handicap: objData.getHandicap(),
                    member_id: objData.getMemberId(),
                }
                listUsers.push(obj);
            }
            console.log("du lieu list friends : ", listUsers.length);
            self.setState({
                dataSource: self.state.dataSource.cloneWithRows(listUsers),
            });
        }
    }

    componentDidMount() {
        const { params } = this.props.navigation.state;
        console.log("chay vao day ", params);
        this.setState({ groupId: params.groupId });
        this.sendData(params.groupId);
    }

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.container_top}>
                    <Touchable style={styles.container_header_view_search_image}>
                        <Image
                            style={styles.container_header_view_search_image}
                            source={this.getResources().ic_Search}
                        />
                    </Touchable>
                    <View style={styles.container_header_view_check_handicap}>
                        <CheckHandicap />
                    </View>
                    <Touchable style={styles.container_header_view_checkbox} onPress={this.onCheckListClick}>
                        <View style={styles.container_header_view_checkbox_view}>
                            <Image
                                style={styles.container_header_view_checkbox_view_image}
                                source={this.getResources().s_normal}
                            />
                        </View>
                    </Touchable>
                </View>
                <View style={styles.container_content}>
                    <ListView style={styles.container_content_listview}
                        dataSource={this.state.dataSource}
                        enableEmptySections={true}
                        keyboardShouldPersistTaps='always'
                        renderRow={(rowData) =>
                            <GroupItemAdd
                                userId={rowData.user_id}
                                fullname={rowData.fullname}
                                avatar={rowData.avatar}
                                handicap={rowData.handicap}
                                eHandicap_member_id={rowData.member_id}
                                isAdd={false} />
                        }
                    />
                </View>
            </View>
        );
    }
}