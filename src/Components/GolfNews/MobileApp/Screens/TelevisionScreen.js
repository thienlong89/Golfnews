import React from 'react';
import { View, Image, Text, BackHandler, WebView, StyleSheet, StatusBar, TouchableWithoutFeedback } from 'react-native';
import BaseComponent from '../../../../Core/View/BaseComponent';
import BaseScreen from './BaseScreen';
import Video from 'react-native-video';
import PropStatic from '../../../../Constant/PropsStatic';
// import Video from 'react-native-video-player';

export default class TelevisionScreen extends BaseScreen {
    constructor(props) {
        super(props);
        // this.props.navigation.setParams({ visible: true });
        this.state = {
            paused: false
        }

        this.onVideoClick = this.onVideoClick.bind(this);
        this.showBar = false;
    }

    static navigationOptions = ({ navigation }) => {
        const { params } = navigation.state;
        console.log('...........................params 2: ', params);
        if (!params) {
            return {
                tabBarVisible: true
            }
        }
        return {
            // title: params.title,
            // tabBarLabel: params.title
            tabBarVisible : params.visible
            // headerRight: <Button
            //                  title="Refresh"
            //                  onPress={ () => params.handleRefresh() } />

        };
    };

    setVisible(visible) {
        console.log("........................set title : ", visible);
        this.props.navigation.setParams({
            visible: visible
        });
    }

    componentDidMount() {
        if (this.header) {
            this.header.setHeader('Truyền hình');
        }
        this.backHandler = BackHandler.addEventListener('hardwareBackPress', this.onBackClick.bind(this));
        this.rotateToLandscape();
        this.player.presentFullscreenPlayer();
        this.showFull();
        console.log('....................... chay qua day : ');
        // this.props.navigation.addListener('focus', this._onFocus);
        // this.props.navigation.addListener('blur', this._onBlur);
        // this.player.seek(0);

        // this.props.navigation.addEventListener('focus_view',this._onFocus);
        this.props.navigation.addListener('didFocus', this._onFocus);
        // this.props.navigation.addListener('didBlur', this._handleDidBlur.bind(this));
        this.props.navigation.addListener('didBlur', this._onBlur);
        
    }

    onVideoClick(){
        this.showBar = !this.showBar;
        this.showBar ? this.showStatus() : this.hideStatus();
        console.log('................................ kick vao video : ');
    }

    componentWillUnmount() {
        if (this.backHandler) this.backHandler.remove();

        // this.props.navigation.removeListener('blur', this._onBlur);
        // this.props.navigation.removeListener('focus', this._onFocus);
    }

    showFull() {
        this.rotateToLandscape();
        if (this.header) {
            this.header.hide();
        }
        StatusBar.setHidden(true);
        this.setVisible(false);

        // navigationOptions = ({ navigation }) => {
        //     const { params } = navigation.state;
        //     console.log('...........................params : ', params);
        //     if (!params) {
        //         return {
        //             title: I18n.t("golf_course"),
        //             tabBarLabel: I18n.t("golf_course")
        //         }
        //     }
        //     return {
        //         title: params.title,
        //         tabBarLabel: params.title
        //     };
        // };
    }

    showSmall() {
        this.rotateToPortrait();
        if (this.header) {
            this.header.show();
        }
        StatusBar.setHidden(false);
    }

    showStatus(){
        if (this.header) {
            this.header.show();
        }
        StatusBar.setHidden(false);
        this.setVisible(true);

        this.timeOut = setTimeout(()=>
        {
            this.hideStatus();
        },10000);
    }

    hideStatus(){
        if (this.header) {
            this.header.hide();
        }
        StatusBar.setHidden(true);
        this.setVisible(false);
        if(this.timeOut){
            clearTimeout(this.timeOut);
        }
    }

    _onFocus = () => {
        // Update focus state. Latter state update is to refresh the content once
        // focus state is updated. Temp fix for react navigation tab swiping issues.
        // See https://github.com/react-community/react-navigation/issues/1257
        BackHandler.addEventListener('hardwareBackPress', () => {
            BackHandler.exitApp();
            return true;
        });
        this.showFull();

        // TelevisionScreen.navigationOptions = ({ navigation }) => {
        //     let tabBarVisible = true;
        //     // if (navigation.state.routes.length > 1) {
        //     //   navigation.state.routes.map(route => {
        //     //     if (route.routeName === "CustomHide") {
        //     //       tabBarVisible = false;
        //     //     } else {
        //     //       tabBarVisible = true;
        //     //     }
        //     //   });
        //     // }

        //     return {
        //         tabBarVisible
        //     };
        // };


        if (this.player) {
            let { paused } = this.state;
            if (!paused) return;
            this.setState({
                paused: false
            });
        }
    };

    _onBlur = () => {
        this.showSmall();
        if (this.player) {
            let { paused } = this.state;
            if (paused) return;
            this.setState({
                paused: true
            })
        }
    };

    onBackClick() {
        let infoApp = PropStatic.getComponentInfoApp();
        if(infoApp && infoApp.isShowed()){
            infoApp.hideChild();
            return true;
        }
        let { navigation } = this.props;
        if (navigation) {
            navigation.goBack();
        }
        return true;
    }

    sendRequestLivesStream() {
        let url = this.getConfig().getBaseUrl() + this.getApiService().get_link_livestream();
        let self = this;
        this.showLoading();
        console.log('........................ url link live stream : ', url);
        Networking.httpRequestGet(url, (jsonData) => {
            self.hideLoading();
            let { status, data } = jsonData;
            if (!status) return;
            if (status.code && parseInt(status.code) === 200) {
                let { stream_url, stream_name } = data;
                self.rotateToLandscape();
                self.setState({
                    paused: false,
                    show: true,
                    link_livestream: stream_url
                }, () => {
                    if (self.header) {
                        self.header.setHeader('Truyền hình ' + stream_name);
                    }
                })
            }
        }, () => {
            self.hideLoading();
        });
    }

    renderVideo() {
        let { show, paused, link_livestream } = this.state;
        if (!show) return null;
        return (
            <View style={{ flex: 1, backgroundColor: 'white' }}>
                <TouchableWithoutFeedback onPress={this.onVideoClick}>
                    <Video source={{ uri: link_livestream }}
                        // <Video source={{ uri: `http://cmn-cdn1live.092cd841.vboost.vn/Gchannel/playlist.m3u8` }}   // Can be a URL or a local file.
                        ref={(ref) => {
                            this.player = ref
                        }}
                        controls={false}
                        resizeMode='cover'
                        muted={false}
                        paused={paused}
                        onLoadStart={() => {
                            // console.log('................................ bat dau load video  : ');
                        }}

                        // onEnd={()=>{
                        //     console.log('............... end ');
                        //     this.player.seek(0);
                        // }} 
                        onLoad={() => {
                            console.log('............... end ');
                            this.player.presentFullscreenPlayer();
                        }}                         // Store reference
                        // onBuffer={this.onBuffer}                // Callback when remote video is buffering
                        onError={(error) => {
                            console.log('....................load user loi ,', error);
                        }}               // Callback when video cannot be loaded
                        style={styles.backgroundVideo} />
                </TouchableWithoutFeedback>
            </View>
        );
    }

    //https://www.youtube.com/watch?v=ZDjZ1Ry9Wvs

    render() {
        let { paused } = this.state;
        return (
            <View style={{ flex: 1 }}>
                {this.renderHeader()}
                {/* <View style={{ flex: 1, backgroundColor: 'white' }}>
                    
                    <TouchableWithoutFeedback onPress={this.onVideoClick}>
                        <Video source={{ uri: `http://cmn-cdn1live.092cd841.vboost.vn/Gchannel/playlist.m3u8` }}   // Can be a URL or a local file.
                            ref={(ref) => {
                                this.player = ref
                            }}
                            controls={true}
                            // resizeMode='stretch'
                            resizeMode='cover'
                            muted={false}
                            paused={paused}
                            onLoadStart={() => {
                                console.log('................................ bat dau load video  : ');
                            }}

                            // onEnd={()=>{
                            //     console.log('............... end ');
                            //     this.player.seek(0);
                            // }} 
                            // onLoad={()=>{
                            //     console.log('............... end ');
                            //     this.player.seek(0);
                            // }}                         // Store reference
                            // onBuffer={this.onBuffer}                // Callback when remote video is buffering
                            onError={(error) => {
                                console.log('....................load user loi ,', error);
                            }}               // Callback when video cannot be loaded
                            style={styles.backgroundVideo} />
                    </TouchableWithoutFeedback>
                </View> */}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    backgroundVideo: {
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
    },
});