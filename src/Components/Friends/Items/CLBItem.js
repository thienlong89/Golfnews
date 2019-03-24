import React from 'react';
import { Text, View, Image } from 'react-native';
import BaseComponent from '../../../Core/View/BaseComponent';
import Touchable from 'react-native-platform-touchable';
import styles from '../../../Styles/Friends/Items/StyleCLBItem';
// import MyImage from '../../../Core/Common/MyImage';
import { Avatar } from 'react-native-elements';

export default class CLBItem extends BaseComponent {
    constructor(props) {
        super(props);
        this.onItemClick = this.onItemClick.bind(this);
    }

    static defaultProps = {
        clbId: '',
        clbName: '',
        totalMember: 0,
        logoUrl: '',
        clickCallback: null
    }

    // shouldComponentUpdate(){
    //     return false;
    // }

    checkUriLogo(logo) {
        return (logo && logo.length) ? logo : '';
    }

    onItemClick() {
        let { onItemClickCallback, data } = this.props;
        if (onItemClickCallback) {
            onItemClickCallback(data);
        }
    }

    render() {
        let { logoUrl, clbName, totalMember } = this.props;
        console.log('CLBItem', this.props);
        return (
            <Touchable onPress={this.onItemClick}>
                <View style={styles.container_view}>
                    {/* <View style={styles.avatar_view}>
                    <MyImage
                        style={styles.avatar_view_image}
                        uri={this.checkUriLogo(this.props.logoUrl)}
                        imageDefault={this.getResources().avatar_event_default}
                    //source={this.checkUriLogo(this.props.logoUrl)}
                    />
                </View> */}
                    <Image
                        style={styles.avatar_view_image}
                        source={this.checkUriLogo(logoUrl).length ? { uri: this.checkUriLogo(logoUrl) } : this.getResources().avatar_default_larger} />
                    {/* <Avatar
                        containerStyle={styles.avatar_view_image}
                        width={this.getRatioAspect().verticalScale(50)}
                        height={this.getRatioAspect().verticalScale(50)}
                        rounded={true}
                        source={this.checkUriLogo(logoUrl).length ? { uri: this.checkUriLogo(logoUrl) } : this.getResources().avatar_event_default}
                    /> */}

                    <View style={styles.container_content_view}>
                        <Text allowFontScaling={global.isScaleFont} style={styles.text_name}>{clbName}</Text>
                        <Text allowFontScaling={global.isScaleFont} style={styles.text_member}>{totalMember} {this.t('member_title')}</Text>
                    </View>
                </View>
            </Touchable>
        );
    }
}