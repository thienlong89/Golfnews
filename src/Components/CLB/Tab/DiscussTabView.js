import React from 'react';
import {
    Platform,
    StyleSheet,
    Text,
    View,
    ScrollView,
    Dimensions,
    SectionList
} from 'react-native';
import Touchable from 'react-native-platform-touchable';
import BaseComponent from '../../../Core/View/BaseComponent';
import Networking from '../../../Networking/Networking';
import ApiService from '../../../Networking/ApiService';
import PostStatusItemView from '../Items/PostStatusItemView';
import StatusItemView from '../Items/StatusItemView';
import EditPostedPopup from '../../Common/EditPostedPopup';
import PopupConfirm from '../../Common/PopupConfirm';

const screenHeight = Dimensions.get('window').height;

export default class DiscussTabView extends BaseComponent {

    static defaultProps = {

    }

    constructor(props) {
        super(props);
        this.onCreatePostTxt = this.onCreatePostTxtPress.bind(this);
        this.onCreatePostImg = this.onCreatePostImgPress.bind(this);
        this.state = {

        }
    }


    render() {
        return (
            <View style={styles.container}>
                <PostStatusItemView
                    onCreatePostTxtPress={this.onCreatePostTxt}
                    onCreatePostImgPress={this.onCreatePostImg} />
                <SectionList
                    renderItem={({ item, index, section }) =>
                        <StatusItemView
                            onCommentStatusPress={this.onCommentStatusPress.bind(this)}
                            onEditStatusPress={this.onEditStatusPress.bind(this)} />
                    }
                    renderSectionHeader={({ section: { title } }) => (
                        <View style={styles.view_section}>
                            <Text allowFontScaling={global.isScaleFont} style={styles.txt_section}>
                                {title.toString().toUpperCase()}
                            </Text>
                        </View>
                    )}
                    ItemSeparatorComponent={(sectionId, rowId) => <View key={rowId} style={styles.separator_view} />}
                    sections={[
                        { title: this.t('recent_activity'), data: ['item1', 'item2'] },
                        { title: this.t('older_activity'), data: ['item3', 'item4'] },
                    ]}
                    keyExtractor={(item, index) => item + index}
                    stickySectionHeadersEnabled={true}
                />
                <EditPostedPopup
                    ref={(refEditPostedPopup) => { this.refEditPostedPopup = refEditPostedPopup }}
                    onDeletePostPress={this.onDeletePostPress.bind(this)}
                    onEditPostPress={this.onEditPostPress.bind(this)}
                />

                <PopupConfirm
                    ref={(refPopupConfirm) => { this.refPopupConfirm = refPopupConfirm; }}
                    content={this.t('confirm_delete_post')}
                    confirmText={this.t('agree')}
                    cancelText={this.t('cancel')}
                    onConfirmClick={this.onConfirmDeletePost.bind(this)} />
            </View>
        );
    }

    onCreatePostTxtPress() {
        let { navigation } = this.props;
        navigation.navigate('post_status_screen', {});
    }

    onCreatePostImgPress() {
        let { navigation } = this.props;
        navigation.navigate('post_status_screen',
            {
                isPhotoSelect: true
            });
    }

    onCommentStatusPress() {
        let { navigation } = this.props;
        navigation.navigate('comment_club_view',
            {
                isPhotoSelect: true
            });
    }

    onEditStatusPress() {
        console.log('onEditStatusPress');
        this.refEditPostedPopup.show();
    }

    onDeletePostPress() {
        console.log('onDeletePostPress')
        this.refPopupConfirm.show();
    }

    onEditPostPress() {
        console.log('onEditPostPress')
    }

    onConfirmDeletePost(){
        console.log('onConfirmDeletePost')
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        minHeight: screenHeight - 50,
        backgroundColor: '#DADADA',
        paddingTop: 10,
        paddingBottom: 10
    },
    separator_view: {
        height: 8,
        backgroundColor: '#DADADA'
    },
    view_section: {
        height: 40,
        flex: 1,
        backgroundColor: '#DADADA',
        paddingLeft: 10
    },
    txt_section: {
        color: '#3C3C3C',
        fontSize: 16,
        marginTop: 10,
        marginBottom: 10,
        fontWeight: 'bold'
    }
});