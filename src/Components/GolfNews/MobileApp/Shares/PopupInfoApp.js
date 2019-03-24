import React from 'react';
import { View, Text, Image, Animated, Dimensions, StyleSheet } from 'react-native';
import BaseComponent from '../../../../Core/View/BaseComponent';

let { width, height } = Dimensions.get('window');
let body_width = Math.round(3 * width / 4);

export default class PopupInfoApp extends BaseComponent {
    constructor(props) {
        super(props);
        this.state = {
            translateXValue: new Animated.Value(-body_width),
        }
    }

    show() {
        const { translateXValue } = this.state;
        Animated.timing(translateXValue, {
            toValue: 0,
            duration: 100
        }).start();
    }

    hide(_callback = null) {
        const { translateXValue } = this.state;
        Animated.timing(translateXValue, {
            toValue: -body_width,
            duration: 100
        }).start(() => {
            setTimeout(() => {
                if (_callback) {
                    _callback();
                }
            }, 200);
        });
    }

    render() {
        let { translateXValue } = this.state;
        return (
            <Animated.View style={{
                backgroundColor: 'white', width: body_width, height: height,
                position: 'absolute', top: 0, left: 0, bottom: 0, zindex: 1,
                transform: [{ translateX: translateXValue }]
            }}>
                <View style={[styles.item_view, { marginTop: 70 }]}>
                    <Image
                        style={styles.ic_img}
                        source={this.getResourceGolfnews().ic_alert}
                    />

                    <View style={{
                        marginLeft: 10, flexDirection: 'row', width: body_width - 50, height: 60,
                        borderTopColor: '#E0E0E0', borderTopWidth: 1, alignItems: 'center',
                        justifyContent: 'flex-start'
                    }}>
                        <Text style={styles.title_text}>{'Nhận thông báo'}</Text>
                        <Image style={{ width: 50, height: 40, resizeMode: 'contain', marginRight: 10 }}
                            source={this.getResourceGolfnews().notification_on}
                        />
                    </View>
                </View>

                <View style={styles.item_view}>
                    <Image
                        style={styles.ic_img}
                        source={this.getResourceGolfnews().ic_gop_y}
                    />
                    <View style={styles.content_view}>
                        <Text style={styles.title_text_other}>{'Góp ý'}</Text>
                    </View>
                </View>

                <View style={styles.item_view}>
                    <Image
                        style={styles.ic_img}
                        source={this.getResourceGolfnews().ic_vote_golfer}
                    />
                    <View style={styles.content_view}>
                        <Text style={styles.title_text_other}>{'Đánh gia Golfnews'}</Text>
                    </View>
                </View>

                <View style={[styles.item_view]}>
                    <Image
                        style={styles.ic_img}
                        source={this.getResourceGolfnews().ic_introduct}
                    />
                    <View style={[{borderBottomColor: '#E0E0E0', borderBottomWidth: 1 },styles.content_view]}>
                        <Text style={styles.title_text_other}>{'Giới thiệu'}</Text>
                    </View>
                </View>
            </Animated.View>
        );
    }
}

const styles = StyleSheet.create({
    item_view: {
        height: 60,
        width: body_width,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start'
        // alignItems: 'center'
    },

    ic_img: {
        width: 30,
        height: 30,
        resizeMode: 'contain',
        marginLeft: 15
    },

    title_text_other: {
        // flex: 1,
        fontSize: 14,
        color: '#292929',
        textAlign: 'left',
        // backgroundColor : 'blue'
    },

    title_text: {
        flex: 1,
        fontSize: 14,
        color: '#292929',
        textAlign: 'left',
        // backgroundColor : 'blue'
    },
    content_view: {
        marginLeft: 10,
        width: body_width - 50,
        height: 60,
        borderTopColor: '#E0E0E0',
        borderTopWidth: 1,
        justifyContent: 'center',
        alignItems: 'flex-start'
    }
});