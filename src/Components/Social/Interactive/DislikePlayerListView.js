import React from 'react';
import {
    Platform,
    StyleSheet,
    Text,
    View,
    FlatList
} from 'react-native';
import FriendStatusItem from '../Item/FriendStatusItem';
import { scale } from '../../../Config/RatioScale';

export default class DislikePlayerListView extends React.Component {

    static defaultProps = {
        dislikeList: [],
        uid: ''
    }

    constructor(props) {
        super(props);
        this.state = {
            dataSource: this.props.dislikeList
        }

        this.onOpenChatPrivate = this.onOpenChatPrivate.bind(this);
    }

    render() {
        let { dataSource } = this.state;
        let { uid } = this.props;

        return (
            <View style={styles.container}>
                <FlatList style={styles.container_flatlist}
                    data={dataSource}
                    onEndReachedThreshold={5}
                    keyboardShouldPersistTaps='always'
                    ItemSeparatorComponent={(sectionId, rowId) => <View key={rowId} style={styles.separator_view} />}
                    enableEmptySections={true}
                    renderItem={({ item }) =>
                        <FriendStatusItem
                            interactType={2}
                            playerStatus={item}
                            uid={uid}
                            onOpenChatPrivate={this.onOpenChatPrivate} />
                    }
                />
            </View>
        );
    }

    onOpenChatPrivate(player, isFriend) {
        console.log('onOpenChatPrivate.isFriend', isFriend);
        let userProfile = player.user_profile;
        if (this.props.navigation)
            this.props.navigation.navigate('chat_private', { name: userProfile.fullname, id_firebase: userProfile.id_firebase, is_friends : isFriend });
    }
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    separator_view: {
        height: 1,
        backgroundColor: '#E3E3E3',
        marginLeft: scale(70)
    },
    container_flatlist: {
    }
});