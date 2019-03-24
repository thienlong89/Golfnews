import React from 'react';
import {
    Platform,
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    Image
} from 'react-native';
import Touchable from 'react-native-platform-touchable';
import BaseComponent from '../../../Core/View/BaseComponent';
import Networking from '../../../Networking/Networking';
import ApiService from '../../../Networking/ApiService';
import { scale, verticalScale, fontSize } from '../../../Config/RatioScale';

export default class SyncFacebookView extends BaseComponent {

    static defaultProps = {

    }

    constructor(props) {
        super(props);
        this.onSkipClick = this.onSkipClick.bind(this);
        this.onSyncFacebookPress = this.onSyncFacebookPress.bind(this);
        this.friendIds = [];
        this.state = {

        }
    }

    render() {
        return (
            <View style={styles.container}>
                <Text allowFontScaling={global.isScaleFont} style={styles.text_suggest} >
                    {this.t('sync_with_facebook')}
                </Text>

                <View style={styles.view_content}>
                    <TouchableOpacity onPress={this.onSyncFacebookPress}>
                        <View>
                            <Image
                                style={styles.img_sycn}
                                source={this.getResources().ic_sync_facebook} />

                            <Text allowFontScaling={global.isScaleFont} style={styles.txt_sync_now}>{this.t('sync_now')}</Text>
                        </View>
                    </TouchableOpacity>
                </View>

                <View style={{justifyContent: 'center',  alignItems: 'center'}}>
                    <TouchableOpacity style={styles.touchable_skip}
                        onPress={this.onSkipClick}>
                        <Text allowFontScaling={global.isScaleFont} style={styles.txt_complete}>
                            {this.t('skip')}
                        </Text>
                    </TouchableOpacity>
                </View>

            </View>
        );
    }

    onSyncFacebookPress(){

    }

    onSkipClick() {
        if(this.props.onSyncCallback){
            this.props.onSyncCallback(this.friendIds);
        }
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    text_suggest: {
        color: '#3B3B3B',
        textAlign: 'center',
        fontSize: fontSize(17),
        fontWeight: 'bold'
    },
    view_content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    txt_sync_now: {
        color: '#3B5998',
        fontSize: fontSize(17),
        marginTop: 10
    },
    touchable_skip: {
        backgroundColor: '#AEAEAE',
        minHeight: 45,
        borderRadius: 20,
        minWidth: 150,
        justifyContent: 'center',
        alignItems: 'center'
    },
    txt_complete: {
        color: '#fff',
        fontSize: fontSize(17)
    }
});