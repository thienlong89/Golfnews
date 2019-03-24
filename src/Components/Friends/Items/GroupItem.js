import React from 'react';
import {
    Text,
    // View,
    TouchableWithoutFeedback,
    Dimensions
} from 'react-native';
import BaseComponent from '../../../Core/View/BaseComponent';
import Touchable from 'react-native-platform-touchable';
import styles from '../../../Styles/Friends/Items/StyleGroupItem';
import MyView from '../../../Core/View/MyView';
import { Avatar } from 'react-native-elements';
import ApiService from '../../../Networking/ApiService';
import Networking from '../../../Networking/Networking';
import ItemLoading from '../../Common/ItemLoadingView';
// import PopupConfirmView from '../../Popups/PopupConfirmView';
import { View } from 'react-native-animatable';

const screenWidth = Dimensions.get('window').width;
const ANIMATE_TIME = 800;
export default class GroupItem extends BaseComponent {
    constructor(props) {
        super(props);
        this.state = {

        }

        this.onItemClick = this.onItemClick.bind(this);
        this.onItemPressAndHole = this.onItemPressAndHole.bind(this);
    }

    static defaultProps = {
        groupId: '',
        groupName: '',
        totalMember: 0,
        logoUrl: '',
        index: 0
    }

    onItemPressAndHole() {
        let { onItemLongPress, data, index } = this.props;
        if (onItemLongPress && data) {
            onItemLongPress(data, index)
        }
    }

    onItemClick() {
        let { onItemClick, data } = this.props;
        if (onItemClick && data) {
            onItemClick(data)
        }
    }

    render() {
        let { data } = this.props;
        let logo = data.getLogo();
        let groupName = data.getName();
        let totalMember = data.getTotalMember();
        return (
            // <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                <Touchable style={{ height: this.getRatioAspect().verticalScale(60) }}
                    onPress={this.onItemClick}
                    onLongPress={this.onItemPressAndHole}>
                    <View style={[styles.container_content]}>
                        <View style={styles.logo_view}>
                            <Avatar
                                style={styles.logo_image}
                                width={this.getRatioAspect().verticalScale(50)}
                                height={this.getRatioAspect().verticalScale(50)}
                                avatarStyle={styles.avatar_style}
                                rounded={true}
                                containerStyle={[{ backgroundColor: '#CCCCCC' }]}
                                overlayContainerStyle={{backgroundColor: '#EAEAEA'}}
                                source={logo ? { uri: logo } : this.getResources().avatar_default_larger}
                            />
                        </View>
                        <View style={styles.container_content_body}>
                            <Text allowFontScaling={global.isScaleFont} style={styles.group_name_text}>{groupName}</Text>
                            <Text allowFontScaling={global.isScaleFont} style={styles.member_text}>{totalMember} {this.t('member_title')}</Text>
                        </View>
                    </View>
                </Touchable>

                // <ItemLoading ref={(itemLoading) => { this.itemLoading = itemLoading; }} top={this.getRatioAspect().verticalScale(20)} right={this.getRatioAspect().scale(15)} />
            // </View>
        );
    }
}