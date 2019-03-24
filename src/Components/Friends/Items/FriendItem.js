import React from 'react';
import {
    Text,
    View,
    TouchableOpacity,
    Image
} from 'react-native';
import BaseComponent from '../../../Core/View/BaseComponent';
import HideShowView from '../../../Core/View/MyView';
import Touchable from 'react-native-platform-touchable';
import AppUtil from '../../../Config/AppUtil';
import styles from '../../../Styles/Friends/Items/StyleFriendItem';
import MyImage from '../../../Core/Common/MyImage';
import { Avatar } from 'react-native-elements';
import TeeView from '../../Common/TeeView';
import FastImage from 'react-native-fast-image';
import CustomAvatar from '../../Common/CustomAvatar';


export default class FriendItem extends BaseComponent {
    constructor(props) {
        super(props);

        this.state = {
            hide: true
        }

        this.onRemoveItem = this.onRemoveItem.bind(this);
        this.onChangeTee = this.onChangeTee.bind(this);
    }

    static defaultProps = {
        userName: '',
        userId: '',
        eHandicap_member_id: '',
        fullname: '',
        avatar: '',
        handicap: '',
        //facility_handicap: '16',
        default_tee_id: '',
        // onClickCallback : null,
        data: {},
        isCanDelete: false,
        isHideDelete: true,
        me: false
    }

    onChangeTee() {
        let { data, onChangeTeePress } = this.props;
        if (onChangeTeePress, data) {
            onChangeTeePress(data);
        }
    }

    /**
     * render lai item khi check cap
     */
    reRender() {
        this.setState({});
    }

   
    render() {
        // let friend = this.props.friendObj;
        //console.log("friend props : ",this.props);
        let { data } = this.props;
        let { avatar, fullname, default_tee_id, handicap, teeObject, facility_handicap, userId } = data;
        this.Logger().log('friend............................ ', teeObject);
        return (
            <View style={[styles.container, { backgroundColor: this.props.me ? '#e7ebf4' : "#fff" }]}>
                <CustomAvatar
                    view_style={styles.view_style}
                    containerStyle={styles.avatar_image}
                    avatarStyle={styles.avatar_style}
                    uri={avatar}
                    puid={userId}
                    width={this.getRatioAspect().scale(60)}
                    height={this.getRatioAspect().scale(60)}
                />
                {/* <FastImage
                    style={{width:this.getRatioAspect().scale(60), height: this.getRatioAspect().scale(60), borderRadius: this.getRatioAspect().scale(30), backgroundColor: '#CACACA' }}
                    source={{ uri: (avatar && avatar.length) ? avatar: 'https://staging-api-s2.golfervn.com/api/v3/avatar?type=normal&imagename=/12-10-2' }}
                    resizeMode={FastImage.resizeMode.contain}
                /> */}

                <View style={styles.container_content_view}>
                    <Text allowFontScaling={global.isScaleFont} style={styles.fullname_text}>{fullname}</Text>
                    <Text allowFontScaling={global.isScaleFont} style={styles.user_id_text}>{this.showUserId()}</Text>
                    {/* <View style={styles.container_handicap}> */}
                    {/* <View style={styles.handicap_view}> */}
                        {/* <View style={[styles.tee_view, { backgroundColor: AppUtil.getColorTee(default_tee_id) }]} /> */}
                        <Text allowFontScaling={global.isScaleFont} style={styles.handicap_text}>{this.t('hdc')}: {this.getAppUtil().handicap_display(handicap)}</Text>
                    {/* </View> */}
                    {/* </View> */}
                </View>

                <Touchable onPress={this.onChangeTee}
                    style={styles.touchable_tee_view}>
                    <TeeView
                        ref={(refTeeView) => { this.refTeeView = refTeeView }}
                        teeObject={teeObject}
                    />
                </Touchable>

                <View style={styles.container_content_bottom}>
                    <HideShowView hide={facility_handicap !== undefined ? false : true} style={(!this.props.isCanDelete || !this.props.isHideDelete) ? styles.container_handicap_facility : styles.container_handicap_facility_delete}>
                        <View style={styles.handicap_facility_view}>
                            <Text allowFontScaling={global.isScaleFont} style={styles.handicap_facility_text}>{this.getAppUtil().handicap_display(facility_handicap)}</Text>
                        </View>
                    </HideShowView>
                    <HideShowView hide={this.props.isHideDelete}>
                        <TouchableOpacity style={styles.touchable_icon_remove} onPress={this.onRemoveItem}>
                            <Image
                                style={styles.icon_remove}
                                source={this.getResources().ic_remove}
                            />
                        </TouchableOpacity>
                    </HideShowView>
                </View>
                {/* </View> */}
            </View>
        );
    }

    showUserId() {
        let { data } = this.props;
        return (data.eHandicap_member_id && data.eHandicap_member_id.length) ? data.userId + '-' + data.eHandicap_member_id : data.userId;
    }

    onRemoveItem() {
        if (this.props.onRemoveItemClick != null) {
            this.props.onRemoveItemClick();
        }
    }

    onChangeTeePress() {
        if (this.props.onChangeTeePress) {
            this.props.onChangeTeePress(this.props.default_tee_id);
        }
    }
}