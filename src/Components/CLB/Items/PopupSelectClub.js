import React from 'react';
import {
    Platform,
    StyleSheet,
    Text,
    View,
    Dimensions,
    Image
} from 'react-native';
import Touchable from 'react-native-platform-touchable';
import BaseComponent from '../../../Core/View/BaseComponent';
import PopupDialog, { SlideAnimation } from 'react-native-popup-dialog';
import MyView from '../../../Core/View/MyView';

export default class PopupSelectClub extends BaseComponent {

    static defaultProps = {
        clubList: []
    }

    constructor(props) {
        super(props);
        this.state = {
            clubList: this.props.clubList
        }
    }

    renderItemMenu(clubList) {

        let menuItem = clubList.map((club, index) => {
            console.log('club.getLogo()', club.logo)
            return (
                <Touchable onPress={this.onClubSelectedPress.bind(this, club)}>
                    <View>
                        <View style={[styles.view_item, index === 0 ? styles.view_first_item : {}]}>
                            <Image
                                style={styles.img_logo}
                                source={{ uri: club.logo }} />
                            <Text allowFontScaling={global.isScaleFont} style={styles.txt_club_name}
                                numberOfLines={1}>{club.name}
                            </Text>
                        </View>
                        <View style={{ height: 1, backgroundColor: '#E0E0E0' }} />
                    </View>
                </Touchable>
            )
        })
        return (
            <View style={styles.container_content}>
                {menuItem}
            </View>
        )
    }

    render() {
        let { clubList } = this.state;

        const slideAnimation = new SlideAnimation({
            slideFrom: 'bottom',
        });


        return (
            <PopupDialog
                ref={(popupDialog) => { this.popupDialog = popupDialog; }}
                dialogAnimation={slideAnimation}
                containerStyle={{ position: 'absolute', bottom: 0 }}
                dialogStyle={[styles.popup_style, { height: clubList.length * 60 }]}>
                <View style={styles.container}>
                    {this.renderItemMenu(clubList)}
                </View>

            </PopupDialog>
        );
    }

    show(clubList = []) {
        if (clubList.length > 0) {
            this.setState({
                clubList: clubList
            }, () => {
                this.popupDialog.show();
            })
        } else {
            this.popupDialog.show();
        }

    }

    dismiss() {
        this.popupDialog.dismiss();
    }

    onClubSelectedPress(club) {
        this.popupDialog.dismiss();
        if (this.props.onClubSelected) {
            this.props.onClubSelected(club);
        }
    }

}

const styles = StyleSheet.create({
    container: {
        justifyContent: 'space-between',
        backgroundColor: '#fff',
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10
    },
    popup_style: {
        position: 'absolute',
        bottom: 0,
        width: Dimensions.get('window').width,
        backgroundColor: 'rgba(0,0,0,0)'
    },
    container_content: {
        backgroundColor: '#FFFFFF',
        borderRadius: 10
    },
    view_first_item: {
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10
    },
    view_item: {
        flexDirection: 'row',
        minHeight: 60,
        backgroundColor: '#fff',
        alignItems: 'center',
        paddingLeft: 10,
        paddingRight: 10
    },
    img_logo: {
        width: 45,
        height: 45,
        resizeMode: 'contain'
    },
    txt_club_name: {
        color: '#252525',
        fontSize: 15,
        fontWeight: 'bold',
        marginLeft: 10
    }

});