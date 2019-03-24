import React from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    Linking,
    Dimensions
} from 'react-native';
import Touchable from 'react-native-platform-touchable';
import BaseComponent from '../../../Core/View/BaseComponent';
import { scale, verticalScale, fontSize } from '../../../Config/RatioScale';
import ApiService from '../../../Networking/ApiService';
import Networking from '../../../Networking/Networking';
import StaticProps from '../../../Constant/PropsStatic';
import { Avatar } from 'react-native-elements';
const { width, height } = Dimensions.get('window');

export default class NewsItem extends BaseComponent {
    constructor(props) {
        super(props);
        // this.state = {
        //     isBold: true
        // }

        this.onItemClick = this.onItemClick.bind(this);
        this.onAdvertisementClick = this.onAdvertisementClick.bind(this);
    }

    static defaultProps = {
        data: null,
        navigation: null,
    }

    onItemClick() {
        let { data, save } = this.props;
        if (!data) return;
        save(data);
        data.is_view = 1;
        // this.setState({
        //     isBold : false
        // });
        this.sendReadedNews();
        this.renderItem();
        let navigation = StaticProps.getAppSceneNavigator();
        navigation.navigate('news_detail', { id: data.id, title: data.title });
    }

    onAdvertisementClick() {
        let { data } = this.props;
        let { type, url } = data;
        if (type === 2 && url) {
            Linking.canOpenURL(url).then(supported => {
                if (supported) {
                    Linking.openURL(url);
                } else {
                    console.log("Don't know how to open URI: " + data.url);
                }
            });
            return;
        }

        let navigation = StaticProps.getAppSceneNavigator();
        if (!navigation || !data) return;
        navigation.navigate('news_detail', { id: data.id, title: data.title, data: data, type: 'Advertisement' });
    }

    componentDidMount() {
        // let {data} = this.props;
        // this.setState({
        //     isBold : global.list_notify_id_readed.find(d=>d===data.id) ? false : true
        // });
    }

    /**
     * send request khi doc tin tuc
     */
    sendReadedNews() {
        let { data } = this.props;
        if (!data || !data.id) return;
        let url = this.getConfig().getBaseUrl() + ApiService.user_readed_news(data.id);
        Networking.httpRequestGet(url, (jsonData) => {
            console.log('tin nhan da doc  : ', jsonData);
        });
    }

    /**
     * render lai tung item
     */
    renderItem() {
        this.setState({});
    }

    // render() {
    //     let { data } = this.props;
    //     // console.log('notifplay news : ',data);
    //     return (
    //         <Touchable onPress={this.onItemClick}>
    //             <View style={styles.container}>
    //                 {/* <Text allowFontScaling={global.isScaleFont} style={[styles.content_text, { fontWeight: this.state.isBold ? 'bold' : 'normal' }]}>{data.shorten_content}</Text> */}
    //                 <Text allowFontScaling={global.isScaleFont} style={[styles.content_text, { fontWeight: data.is_view ? 'normal' : 'bold' }]}>{data.shorten_content}</Text>
    //                 {/* <Text style={[styles.time_published, { fontWeight: this.state.isBold ? 'bold' : 'normal' }]}>{this.t('news_create_time')} : {data.published_time}</Text> */}
    //             </View>
    //         </Touchable>
    //     );
    // }
    getElementNews(data) {
        return (
            <Touchable onPress={this.onItemClick}>
                <View style={{ marginLeft: scale(15), marginRight: scale(15), marginTop: verticalScale(10), backgroundColor: (data.is_view && data.is_view === 1) ? '#fff' : '#ddf6f7', paddingLeft: scale(6), borderColor: 'rgba(0, 0, 0, 0.3)', borderRadius: 5, borderWidth: 1, flexDirection: 'row', alignItems: 'center', paddingTop: verticalScale(5), paddingBottom: verticalScale(5) }}>
                    <View style={{
                        width: verticalScale(50), height: verticalScale(50), borderColor: '#e8e8e8', borderWidth: verticalScale(1), backgroundColor: '#F1f1f1'
                        , justifyContent: 'center', alignItems: 'center'
                    }}>
                        <Image style={{ width: verticalScale(40), height: verticalScale(40), resizeMode: 'contain' }}
                            source={this.getResources().GolfNews_Logo}
                        />
                    </View>
                    <View style={{ flex: 1, justifyContent: 'center' }}>
                        <Text allowFontScaling={global.isScaleFont} style={styles.content_text}>{data.shorten_content}</Text>
                        <Text allowFontScaling={global.isScaleFont} style={styles.time}>{data.published_time}</Text>
                    </View>
                </View>
            </Touchable>
        );
    }

    getSizeBackgroundImage(w, h) {
        let img_w = width - scale(30);//chieu dai cứng của img
        let res_w = w > img_w ? img_w : w;
        let res_h = Math.round((img_w * h) / w);
        return {
            width: res_w,
            height: res_h
        }
    }

    //size ()()
    getElementadvertisement(data) {
        let _w = data.width ? data.width : 1185;//fake
        let _h = data.height ? data.height : 500;//fake
        let img_size = this.getSizeBackgroundImage(_w, _h);
        console.log('=================data.short_content ', data.short_content);
        return (
            <Touchable onPress={this.onAdvertisementClick}>

                <View style={{ marginLeft: scale(15), marginRight: scale(15), marginTop: verticalScale(10), backgroundColor: '#fff', borderColor: 'rgba(0, 0, 0, 0.3)', borderRadius: 5, borderWidth: 1, alignItems: 'center', paddingTop: verticalScale(5) }}>
                    <View style={{
                        minHeight: verticalScale(40),
                        width: width - scale(30),
                        flexDirection: 'row',
                        alignItems: 'center',
                        borderBottomColor: '#dedede',
                        paddingBottom: verticalScale(6),
                        paddingTop: verticalScale(6),
                        borderBottomWidth: 1
                    }}>
                        <Avatar
                            width={verticalScale(30)}
                            height={verticalScale(30)}
                            containerStyle={{ marginLeft: scale(10), backgroundColor: 'transparent' }}
                            avatarStyle={{ backgroundColor: 'transparent' }}
                            rounded
                            source={{ uri: data.logo_url }}
                        >
                        </Avatar>
                        <View style={{ marginLeft: scale(10), justifyContent: 'center', marginRight: scale(10) }}>
                            <Text allowFontScaling={global.isScaleFont} style={{ fontSize: fontSize(14), color: '#1a1a1a', fontWeight: 'bold' }}>{data.title}</Text>
                            <Text allowFontScaling={global.isScaleFont} style={{ fontSize: fontSize(12, -scale(2)), color: '#929292' }}>{data.small_text}</Text>
                        </View>
                    </View>
                    <View style={{ flex: 1 }}>
                        <Text allowFontScaling={global.isScaleFont} style={{ color: '#1a1a1a', fontSize: fontSize(14), marginTop: verticalScale(10), marginLeft: scale(10), marginRight: scale(10) }}>{data.short_content}</Text>
                        <Image
                            style={{
                                width: img_size.width,
                                height: img_size.height,
                                resizeMode: 'contain',
                                marginTop: verticalScale(10),
                                borderBottomLeftRadius: 5,
                                borderBottomRightRadius: 5
                            }}
                            source={{ uri: data.img_background }}
                        />
                    </View>
                </View>
            </Touchable>
        );
    }

    render() {
        let { data } = this.props;
        if (!data) return null;
        let { type } = data;
        console.log('............... type news : ', type);
        return type === 1 ? this.getElementNews(data) : this.getElementadvertisement(data);
        // return (
        //     <Touchable onPress={this.onItemClick}>
        //         <View style={{ marginLeft: scale(15), marginRight: scale(15), marginTop: verticalScale(10), backgroundColor: (data.is_view && data.is_view === 1) ? '#fff' : '#ddf6f7', paddingLeft: scale(6), borderColor: 'rgba(0, 0, 0, 0.3)', borderRadius: 5, borderWidth: 1, flexDirection: 'row', alignItems: 'center', paddingTop: verticalScale(5), paddingBottom: verticalScale(5) }}>
        //             <View style={{
        //                 width: verticalScale(50), height: verticalScale(50), borderColor: '#e8e8e8', borderWidth: verticalScale(1), backgroundColor: '#F1f1f1'
        //                 , justifyContent: 'center', alignItems: 'center'
        //             }}>
        //                 <Image style={{ width: verticalScale(40), height: verticalScale(40), resizeMode: 'contain' }}
        //                     source={this.getResources().GolfNews_Logo}
        //                 />
        //             </View>
        //             <View style={{ flex: 1, justifyContent: 'center' }}>
        //                 <Text allowFontScaling={global.isScaleFont} style={styles.content_text}>{data.shorten_content}</Text>
        //                 <Text allowFontScaling={global.isScaleFont} style={styles.time}>{data.published_time}</Text>
        //             </View>
        //         </View>
        //     </Touchable>
        // );
    }
}

const styles = StyleSheet.create({
    container: {
        // minHeight: verticalScale(40),
        justifyContent: 'center',
        padding: scale(10)
    },

    content_text: {
        // flex: 1,
        marginLeft: scale(10),
        fontSize: fontSize(16, scale(2)),
        color: '#404040',
        //textAlignVertical: 'center'
    },

    time: {
        fontSize: fontSize(14),
        marginLeft: scale(10),
        color: '#929292'
    },

    time_published: {
        height: verticalScale(16),
        //textAlignVertical: 'center',
        fontSize: fontSize(12, -scale(1)),
        color: '#424242',
        bottom: verticalScale(5),
        right: scale(10),
        position: 'absolute'
    }
});