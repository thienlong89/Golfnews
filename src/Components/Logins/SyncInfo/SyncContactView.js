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
import Contacts from 'react-native-contacts';

export default class SyncContactView extends BaseComponent {

    static defaultProps = {

    }

    constructor(props) {
        super(props);
        this.onSkipClick = this.onSkipClick.bind(this);
        this.onContactPress = this.onContactPress.bind(this);
        this.contacts = [];
        this.state = {

        }
    }

    render() {
        return (
            <View style={styles.container}>
                <Text allowFontScaling={global.isScaleFont} style={styles.text_suggest} >
                    {this.t('sync_with_contacts')}
                </Text>

                <View style={styles.view_content}>
                    <TouchableOpacity onPress={this.onContactPress}>
                        <View>
                            <Image
                                style={styles.img_sycn}
                                source={this.getResources().ic_sync_contact} />

                            <Text allowFontScaling={global.isScaleFont} style={styles.txt_sync_now}>{this.t('sync_now')}</Text>
                        </View>
                    </TouchableOpacity>
                </View>

                <View style={{ justifyContent: 'center', alignItems: 'center' }}>
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

    onContactPress() {
        Contacts.getAllWithoutPhotos((err, contacts) => {
            if (err) throw err;

            // contacts returned
            console.log(contacts)
            for (let contact of contacts) {
                try {
                    this.contacts.push(contact.phoneNumbers[0].number)
                } catch (error) {
                    console.log('onContactPress.error', error);
                }
            }
            if (this.props.onContactCallback) {
                this.props.onContactCallback(this.contacts);
            }
        })
    }

    onSkipClick() {
        if (this.props.onContactCallback) {
            this.props.onContactCallback(this.contacts);
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
        color: '#00ABA7',
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