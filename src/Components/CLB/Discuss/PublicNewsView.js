import React from 'react';
import {
    Platform,
    StyleSheet,
    Text,
    View,
    FlatList,
    LayoutAnimation
} from 'react-native';
import Touchable from 'react-native-platform-touchable';
import BaseComponent from '../../../Core/View/BaseComponent';
import Networking from '../../../Networking/Networking';
import ApiService from '../../../Networking/ApiService';
import PostStatusItemView from '../Items/PostStatusItemView';
import FooterComponent from '../../Common/FooterComponent';
import PostStatusModel from '../../../Model/CLB/PostStatusModel';
import FloatBtnActionView from '../../Common/FloatBtnActionView';
import PostStatusItemModel from '../../../Model/CLB/PostStatusItemModel';
import chunk from 'lodash/chunk';
import UploadPostProgress from '../Items/UploadPostProgress';
import PopupMenuPostInfo from '../../Common/PopupMenuPostInfo';
import PopupYesOrNo from '../../Common/PopupYesOrNo';
import PopupConfirmView from '../../Popups/PopupConfirmView';

export default class PublicNewsView extends BaseComponent {

    static defaultProps = {

    }

    constructor(props) {
        super(props);
        this.onLoadMoreData = this.onLoadMoreData.bind(this);
        this.onCreatePostClick = this.onCreatePostClick.bind(this);
        this.onRefreshTopicDiscuss = this.onRefreshTopicDiscuss.bind(this);
        this.onScrollFlatList = this.onScrollFlatList.bind(this);
        this.onPostCallback = this.onPostCallback.bind(this);
        this.onPostMenuItemPress = this.onPostMenuItemPress.bind(this);
        this.onUpdateCallback = this.onUpdateCallback.bind(this);

        this.page = 1;
        this.flatListOffset = 0;
        this.createIconShowing = false;
        this.state = {
            refreshing: false,
            postList: [],
            isPosting: false
        }
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
                    type={4}
                />
            )
        }
    }

    render() {
        let { postList, refreshing, isPosting } = this.state;

        return (
            <View style={styles.container}>
                <FlatList
                    // data={chunk(postList, 5)}
                    data={postList}
                    onEndReached={this.onLoadMoreData}
                    onEndReachedThreshold={0.1}
                    refreshing={refreshing}
                    onRefresh={this.onRefreshTopicDiscuss}
                    onScroll={this.onScrollFlatList}
                    keyboardShouldPersistTaps='always'
                    ItemSeparatorComponent={(sectionId, rowId) => <View key={rowId} style={styles.separator_view} />}
                    enableEmptySections={true}
                    keyExtractor={(item, index) => item + index}
                    // keyExtractor={chunk => chunk[0].id}
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

                <PopupMenuPostInfo
                    ref={(refPopupMenuPostInfo) => { this.refPopupMenuPostInfo = refPopupMenuPostInfo }}
                    onPostMenuItemPress={this.onPostMenuItemPress} />

                <PopupConfirmView ref={(popupConfirmView) => { this.popupConfirmView = popupConfirmView; }} />

                {this.renderMessageBar()}
                {this.renderInternalLoading()}
            </View>
        );
    }

    componentDidMount() {
        this.registerMessageBar();

        this.requestPublicPost();
        this.popupConfirmView.okCallback = this.onConfirmDeletePosts.bind(this);
    }

    componentWillUnmount() {
        this.unregisterMessageBar();
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

    onLoadMoreData() {
        if (!this.refFooterComponent.getLoading()) {
            this.page++;
            this.requestPublicPost();
        }
    }

    onCreatePostClick() {
        console.log('onCreatePostClick')
        const { screenProps } = this.props;
        if (screenProps != null) {
            let parent = screenProps.parentNavigator;
            parent.navigate('post_status_screen', {
                'isPublic': true,
                PostCallback: this.onPostCallback
            })
        }
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
                this.requestCreatePost(post.content, []);
            }
        });
    }

    onUploadSuccess(post, jsonData) {
        console.log('onUploadSuccess', jsonData);
        if (jsonData.error_code === 0) {
            let uris = jsonData.data.image_paths.map((obj) => {
                return obj.url;
            })

            this.requestCreatePost(post.content, uris);
        }

    }

    requestCreatePost(content, list_img) {

        let self = this;
        let fromData = {
            "content": content,
            "list_img": list_img
        }

        let url = this.getConfig().getBaseUrl() + ApiService.create_public_post();
        Networking.httpRequestPost(url, (jsonData) => {
            if (jsonData.error_code === 0) {
                this.refUploadPostProgress.setUploadProgress(1);
                // jsonData.User = this.getUserInfo().getUserProfile();
                this.model = new PostStatusItemModel();
                this.model.parseData(jsonData.data);
                this.model.user = this.getUserInfo().getUserProfile();
                this.state.postList.unshift(this.model);
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

    onRefreshTopicDiscuss() {

    }

    onEditStatusPress(item, index) {
        if (item.user_id === this.getAppUtil().replaceUser(this.getUserInfo().getId())) {
            this.refPopupMenuPostInfo.show([], { item, index });
        }

    }

    requestPublicPost() {
        this.refFooterComponent.setLoading(true);
        let self = this;
        let url = this.getConfig().getBaseUrl() + ApiService.get_public_post(this.page);
        console.log('url', url);
        Networking.httpRequestGet(url, this.onPublicPostResponse.bind(this), () => {
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

    onPublicPostResponse(jsonData) {

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

    onPostMenuItemPress(type, { item, index }) {
        console.log('onPostMenuItemPress', type, item, index)
        if (type === 'EDIT') {
            const { screenProps } = this.props;
            if (screenProps != null) {
                let parent = screenProps.parentNavigator;
                parent.navigate('post_status_screen', {
                    'isPublic': true,
                    'isUpdate': true,
                    'data': item,
                    PostCallback: this.onUpdateCallback
                })
            }
        } else if (type === 'DELETE') {
            this.popupConfirmView.setMsg(this.t('confirm_delete_post'), { type, item, index });
        }
    }

    onConfirmDeletePosts({ type, item, index }) {
        let self = this;
        let fromData = {
            "id_post": item.id
        }
        this.internalLoading.showLoading();
        let url = this.getConfig().getBaseUrl() + ApiService.remove_public_post();
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

    onUpdateCallback(post) {
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
        let url = this.getConfig().getBaseUrl() + ApiService.update_public_post();
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
    },
    separator_view: {
        height: 8,
        backgroundColor: '#DADADA',
    },
});