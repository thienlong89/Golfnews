import React from 'react';
import {
    Platform,
    StyleSheet,
    Text,
    View,
    ScrollView,
    Image,
    TouchableOpacity,
    Dimensions,
    BackHandler,
    FlatList,
    LayoutAnimation
} from 'react-native';
import Touchable from 'react-native-platform-touchable';
import BaseComponent from '../../../Core/View/BaseComponent';
import Networking from '../../../Networking/Networking';
import ApiService from '../../../Networking/ApiService';
import HeaderView from '../../HeaderView';
import MyView from '../../../Core/View/MyView';
import PopupYesOrNo from '../../Common/PopupYesOrNo';
import PostStatusItemView from '../Items/PostStatusItemView';
import FooterComponent from '../../Common/FooterComponent';
import PostStatusModel from '../../../Model/CLB/PostStatusModel';
import FloatBtnActionView from '../../Common/FloatBtnActionView';
import UploadPostProgress from '../Items/UploadPostProgress';
import PostStatusItemModel from '../../../Model/CLB/PostStatusItemModel';
import EmptyDataView from '../../../Core/Common/EmptyDataView';
// import PostStatusRealm from '../../../DbLocal/PostStatusRealm';
import PopupMenuPostInfo from '../../Common/PopupMenuPostInfo';

const screenHeight = Dimensions.get('window').height;
const screenWidth = Dimensions.get('window').width;

export default class TopicDiscussClubView extends BaseComponent {

    constructor(props) {
        super(props);
        this.userProfile = this.getUserInfo().getUserProfile();
        let { clubName, clubId, totalMember, isAdmin, topic } = this.props.navigation.state.params;
        console.log('TopicDiscussClubView.params', this.props.navigation.state.params)
        this.clubName = clubName;
        this.clubId = clubId;
        this.isAdmin = isAdmin;
        this.totalMember = totalMember;
        this.topic = topic;
        this.page = 1;
        this.flatListOffset = 0;
        this.createIconShowing = false;
        this.finishLoadMore = false;
        this.state = {
            refreshing: false,
            postList: [],
            isPosting: false
        }

        this.onCreatePostClick = this.onCreatePostClick.bind(this);
        this.onLoadMoreData = this.onLoadMoreData.bind(this);
        this.onBackPress = this.onBackPress.bind(this);
        this.onRefreshTopicDiscuss = this.onRefreshTopicDiscuss.bind(this);
        this.onScrollFlatList = this.onScrollFlatList.bind(this);
        this.onPostMenuItemPress = this.onPostMenuItemPress.bind(this);
        this.onConfirmDeletePost = this.onConfirmDeletePost.bind(this);
        this.onUpdateCallback = this.onUpdateCallback.bind(this);
    }

    renderFooter = () => {
        return (
            <FooterComponent
                ref={(refFooterComponent) => { this.refFooterComponent = refFooterComponent }} />
        )
    };

    renderItemPost(item, index, isPosting) {
        if (index === 0 && isPosting) {
            return (
                <UploadPostProgress ref={(refUploadPostProgress) => { this.refUploadPostProgress = refUploadPostProgress }} />
            )
        } else {
            return (
                <PostStatusItemView
                    postStatus={item}
                    onEditStatusPress={this.onEditStatusPress.bind(this, item, index)}
                    type={3}
                />
            )
        }
    }

    render() {

        let { postList, isPosting, refreshing } = this.state;

        return (
            <View style={styles.container}>

                <HeaderView
                    title={this.topic.name}
                    handleBackPress={this.onBackPress}
                    iconMenu={this.getResources().ic_group_info}
                    iconMenuStyle={styles.icon_menu_style} />


                <View style={{ flex: 1 }}>
                    <FlatList
                        data={postList}
                        onEndReached={this.onLoadMoreData}
                        onEndReachedThreshold={3}
                        refreshing={refreshing}
                        onRefresh={this.onRefreshTopicDiscuss}
                        onScroll={this.onScrollFlatList}
                        keyboardShouldPersistTaps='always'
                        ItemSeparatorComponent={(sectionId, rowId) => <View key={rowId} style={styles.separator_view} />}
                        enableEmptySections={true}
                        keyExtractor={(item, index) => item + index}
                        ListFooterComponent={this.renderFooter}
                        renderItem={({ item, index }) =>
                            this.renderItemPost(item, index, isPosting)
                        }
                    />

                    <FloatBtnActionView
                        ref={(refFloatActionView) => { this.refFloatActionView = refFloatActionView; }}
                        icon={this.getResources().ic_writing}
                        isShowing={true}
                        onFloatActionPress={this.onCreatePostClick} />

                    <EmptyDataView
                        ref={(refEmptyDataView) => this.refEmptyDataView = refEmptyDataView}
                    />

                </View>

                <PopupMenuPostInfo
                    ref={(refPopupMenuPostInfo) => { this.refPopupMenuPostInfo = refPopupMenuPostInfo }}
                    onPostMenuItemPress={this.onPostMenuItemPress} />

                <PopupYesOrNo
                    ref={(refPopupYesOrNo) => { this.refPopupYesOrNo = refPopupYesOrNo; }}
                    content={this.t('confirm_delete_post')}
                    confirmText={this.t('agree')}
                    cancelText={this.t('cancel')}
                    onConfirmClick={this.onConfirmDeletePost} />

                {this.renderMessageBar()}
                {this.renderInternalLoading()}

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

        this.requestTopicClub();
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

    onRefreshTopicDiscuss() {
        console.log('onRefreshTopicDiscuss');
        this.setState({
            refreshing: true
        }, () => {
            this.page = 1;
            this.requestTopicClub();
        })
    }

    onLoadMoreData() {
        if (!this.refFooterComponent.getLoading()) {
            this.page++;
            this.requestTopicClub();
        }

    }

    requestTopicClub() {
        this.refFooterComponent.setLoading(true);
        let self = this;
        let url = this.getConfig().getBaseUrl() + ApiService.get_post_by_topic(this.clubId, this.topic.id, this.page);
        console.log('url', url);
        Networking.httpRequestGet(url, this.onTopicClubResponse.bind(this), () => {
            //time out
            self.showErrorMsg(self.t('time_out'));
            if (self.refFooterComponent)
                self.refFooterComponent.setLoading(false);
            if (self.state.postList.length === 0) {
                self.refEmptyDataView.showEmptyView();
            }
            if (this.state.refreshing) {
                this.setState({
                    refreshing: false
                })
            }

        });
    }

    onTopicClubResponse(jsonData) {

        this.model = new PostStatusModel(this);
        this.model.parseData(jsonData);
        if (this.model.getErrorCode() === 0) {
            let lsData = this.model.getPostList();
            if (lsData.length > 0) {
                this.setState({
                    postList: [...this.state.postList, ...this.model.getPostList()],
                    refreshing: false
                }, () => {
                    // try {
                    //     PostStatusRealm.save(this.topic.id, lsData);
                    //     console.log('PostStatusRealm', PostStatusRealm.getAllPostStatus(this.topic.id))
                    // } catch (error) {
                    //     console.log('PostStatusRealm.error', error)
                    // }
                })
            } else if (this.state.postList.length === 0) {
                this.refEmptyDataView.showEmptyView();
                if (this.state.refreshing) {
                    this.setState({
                        refreshing: false
                    })
                }
            }

        } else {
            // console.log('showErrorMsg8')
            this.showErrorMsg(jsonData['error_msg']);
            if (this.state.refreshing) {
                this.setState({
                    refreshing: false
                })
            }
        }
        if (this.refFooterComponent)
            this.refFooterComponent.setLoading(false);

    }

    onScrollFlatList(event) {
        const CustomLayoutLinear = {
            duration: 100,
            create: { type: LayoutAnimation.Types.linear, property: LayoutAnimation.Properties.opacity },
            update: { type: LayoutAnimation.Types.linear, property: LayoutAnimation.Properties.opacity },
            delete: { type: LayoutAnimation.Types.linear, property: LayoutAnimation.Properties.opacity }
        }
        // Check if the user is scrolling up or down by confronting the new scroll position with your own one
        const currentOffset = event.nativeEvent.contentOffset.y
        const direction = (currentOffset > 0 && currentOffset > this.flatListOffset)
            ? 'down'
            : 'up'
        // If the user is scrolling down (and the action-button is still visible) hide it
        const isActionButtonVisible = direction === 'up'
        if (isActionButtonVisible !== this.createIconShowing) {
            LayoutAnimation.configureNext(CustomLayoutLinear)
            this.createIconShowing = isActionButtonVisible;
            this.refFloatActionView.setVisible(this.createIconShowing);
        }
        // Update your scroll position
        this.flatListOffset = currentOffset
    }

    onCreatePostClick() {
        this.props.navigation.navigate('post_status_screen', {
            'topic': this.topic,
            ...this.props.navigation.state.params,
            PostCallback: this.onPostCallback.bind(this)
        })
    }

    onPostCallback(post) {
        this.setState({
            isPosting: true
        }, () => {
            if (post.imgs.length > 0) {
                let self = this;
                let url = this.getConfig().getBaseUrl() + ApiService.club_upload_post();
                console.log('onPostCallback.post', post);
                console.log('onPostCallback.url', url)
                this.getAppUtil().upload_mutil(url, post.imgs,
                    this.onUploadSuccess.bind(this, post),
                    (error) => {
                        // self.progressUpload.hideLoading();
                        // self.showErrorMsg(error);
                        console.log('onPostCallback.error', error)
                        self.refUploadPostProgress.setUploadProgress(0);
                    }, (progress) => {
                        // self.progressUpload.setProgress(progress);
                        console.log('progress', progress)
                        self.refUploadPostProgress.setUploadProgress(progress);
                    });
            } else {
                this.requestCreatePost(this.clubId, post.topic, post.content, []);
            }
        });

    }

    onUploadSuccess(post, jsonData) {
        console.log('onUploadSuccess', jsonData);
        if (jsonData.error_code === 0) {
            let uris = jsonData.data.image_paths.map((obj) => {
                return obj.url;
            })

            this.requestCreatePost(this.clubId, post.topic, post.content, uris);
        }

    }

    requestCreatePost(club_id, id_topic, content, list_img) {

        let self = this;
        let fromData = {
            "club_id": club_id,
            "id_topic": id_topic,
            "content": content,
            "list_img": list_img
        }

        let url = this.getConfig().getBaseUrl() + ApiService.create_post_topic();
        Networking.httpRequestPost(url, (jsonData) => {
            console.log('requestCreatePost', jsonData)
            if (jsonData.error_code === 0) {
                this.refUploadPostProgress.setUploadProgress(1);
                // jsonData.User = this.getUserInfo().getUserProfile();
                this.model = new PostStatusItemModel();
                this.model.parseData(jsonData.data);
                this.state.postList.unshift(this.model);
                console.log('requestCreatePost.postList', this.state.postList)
                this.setState({
                    postList: this.state.postList,
                    isPosting: false
                })
            } else {
                self.showErrorMsg(jsonData.error_msg);
                this.refUploadPostProgress.setUploadProgress(0);
            }

        }, fromData, () => {
            //time out
            this.refUploadPostProgress.setUploadProgress(0);
        });
    }

    onEditStatusPress(item, index) {
        this.refPopupMenuPostInfo.show([], { item, index });
    }

    onPostMenuItemPress(type, { item, index }) {
        console.log('onPostMenuItemPress', type, item, index)
        if (type === 'EDIT') {
            this.props.navigation.navigate('post_status_screen', {
                'topic': this.topic,
                ...this.props.navigation.state.params,
                'isPublic': false,
                'isUpdate': true,
                'data': item,
                PostCallback: this.onUpdateCallback
            })
        } else if (type === 'DELETE') {
            this.refPopupYesOrNo.show({ item, index });
        }
    }

    onConfirmDeletePost(type, { item, index }) {
        let self = this;
        let fromData = {
            "club_id": item.club_id,
            "id_post": item.id
        }
        this.internalLoading.showLoading();
        let url = this.getConfig().getBaseUrl() + ApiService.remove_post_club();
        Networking.httpRequestPost(url, (jsonData) => {
            console.log('requestCreatePost', jsonData)
            if (jsonData.error_code === 0) {
                self.state.postList.splice(index, 1);
                self.setState({
                    postList: self.state.postList
                })
            } else {
                self.showErrorMsg(jsonData.error_msg);
            }
            self.internalLoading.hideLoading();
        }, fromData, () => {
            //time out
            self.internalLoading.hideLoading();
            self.showErrorMsg(self.t('time_out'));
        });
    }

    onUpdateCallback(post){
        console.log('requestUpdatePost.post', post)
        let imgLocalList = post.imgs.filter((img) => {
            return !img.toString().startsWith('http');
        })

        let imgServerList = post.imgs.filter((img) => {
            return img.toString().startsWith('http');
        })

        console.log('onUpdateCallback', imgLocalList, imgServerList)
        if (imgLocalList.length > 0) {
            let self = this;
            let url = this.getConfig().getBaseUrl() + ApiService.club_upload_post();
            console.log('onPostCallback.url', url)
            this.getAppUtil().upload_mutil(url, imgLocalList,
                this.onUploadUpdateSuccess.bind(this, post, imgServerList),
                (error) => {
                    // self.progressUpload.hideLoading();
                    // self.showErrorMsg(error);
                    console.log('onPostCallback.error', error)
                    // self.refUploadPostProgress.setUploadProgress(0);
                }, (progress) => {
                    // self.progressUpload.setProgress(progress);
                    console.log('progress', progress)
                    // self.refUploadPostProgress.setUploadProgress(progress);
                });
        } else {
            this.requestUpdatePost(post, imgServerList);
        }
    }

    onUploadUpdateSuccess(post, imgServerList, jsonData) {
        console.log('onUploadSuccess', jsonData);
        if (jsonData.error_code === 0) {
            let uris = jsonData.data.image_paths.map((obj) => {
                return obj.url;
            })

            this.requestUpdatePost(post, [...imgServerList, ...uris]);
        }

    }

    requestUpdatePost(post, imgs) {
        let self = this;
        let fromData = {
            "id_post": post.id,
            "content": post.content,
            "list_img": imgs
        }
        
        console.log('requestUpdatePost.fromData', fromData)
        let url = this.getConfig().getBaseUrl() + ApiService.update_post_club();
        Networking.httpRequestPost(url, (jsonData) => {
            console.log('requestUpdatePost', jsonData)
            if (jsonData.error_code === 0) {
                let item = this.state.postList.find((obj) => {
                    return obj.id = post.id;
                });
                if (item) {
                    item.content = post.content;
                    item.img_content = post.imgs;
                    self.setState({
                        postList: this.state.postList,
                        isPosting: false
                    })
                }
            } else {
                // self.showErrorMsg(jsonData.error_msg);
                // this.refUploadPostProgress.setUploadProgress(0);
            }

        }, fromData, () => {
            //time out
            // this.refUploadPostProgress.setUploadProgress(0);
        });
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        minHeight: screenHeight,
    },
    separator_view: {
        height: 8,
        backgroundColor: '#DADADA',
    },
    icon_menu_style: {
        width: 25,
        height: 25,
        resizeMode: 'contain'
    }
});