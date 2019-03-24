import React from 'react';
import { Text, View } from 'react-native';
import BaseComponent from '../../../Core/View/BaseComponent';
import Touchable from 'react-native-platform-touchable';
import styles from '../../../Styles/LeaderBoard/Items/StyleLeaderBoardCLBItem';
// import MyImage from '../../../Core/Common/MyImage';
import MyView from '../../../Core/View/MyView';
import { Avatar } from 'react-native-elements';
import { verticalScale, fontSize, scale } from '../../../Config/RatioScale';
import CustomAvatar from '../../Common/CustomAvatar';

export default class LeaderBoardCLBItem extends BaseComponent {
    constructor(props) {
        super(props);
        this.onItemClick = this.onItemClick.bind(this);
    }

    static defaultProps = {
        id: '',
        clbName: '',
        totalMember: 0,
        logoUrl: '',
        score: '',
        rank: '',
        manners: '',
    }

    checkUriLogo(logo) {
        return (logo && logo.length) ? logo : '';
    }

    // shouldComponentUpdate() {
    //     return false;
    // }

    onItemClick() {
        let { data, onItemClickCallback } = this.props;
        if (onItemClickCallback && data) {
            onItemClickCallback(data);
        }
    }

    render() {
        let { rank, logoUrl, clbName, totalMember, score, country_image } = this.props.data;
        return (
            <Touchable onPress={this.onItemClick}>
                <View style={styles.container}>
                    <View style={styles.rank_view}>
                        <Text allowFontScaling={global.isScaleFont} style={styles.rank_text}>{rank}</Text>
                    </View>
                    {/* <MyImage
                    style={styles.logo_image}
                    uri={this.checkUriLogo(logoUrl)}
                    imageDefault={this.getResources().avatar_event_default}
                /> */}

                    <View style={{ height: verticalScale(60), width: verticalScale(50), alignItems: 'center', justifyContent: 'center' }}>
                        <Avatar containerStyle={{ marginLeft: scale(10) }}
                            overlayContainerStyle={{ backgroundColor: 'rgba(0,0,0,0)' }}
                            width={verticalScale(40)}
                            height={verticalScale(40)}
                            rounded={true}
                            source={{ uri: logoUrl }} />
                        <MyView style={{ position: 'absolute', left: scale(-2), top: verticalScale(5) }} hide={!country_image.length}>
                            <Avatar
                                containerStyle={{ position: 'absolute', left: 0, top: 0 }}
                                width={verticalScale(20)}
                                height={verticalScale(20)}
                                rounded={true}
                                source={{ uri: country_image }}
                                resizeMode={'center'}
                            />
                        </MyView>
                    </View>
                    {/* <View style={{ height: 60, width: 50, alignItems: 'center', justifyContent: 'center' }}>
                    <Avatar containerStyle={{ marginLeft: 10 }}
                        width={40}
                        height={40}
                        rounded={true}
                        source={{ uri: avatar }}>
                    </Avatar>
                    <Avatar
                        containerStyle={{ position: 'absolute', left: 5, top: 5 }}
                        width={20}
                        height={20}
                        rounded={true}
                        source={{ uri: country_img }}
                    />
                </View> */}
                    <View style={styles.club_name_container}>
                        <Text allowFontScaling={global.isScaleFont} style={styles.club_name_text}> {clbName}</Text>
                    </View>
                    <View style={styles.member_view}>
                        <Text allowFontScaling={global.isScaleFont} style={styles.member_text}>{totalMember}</Text>
                    </View>
                    <View style={styles.score_view}>
                        <Text allowFontScaling={global.isScaleFont} style={styles.score_text}>{score}</Text>
                    </View>
                    {/* <View style={styles.ranking_mamnner_view}>
                        <Image
                            style={styles.ranking_mamnner_image}
                            source={AppUtil.getSourceRankingManner(this.props.manners)}
                        />
                    </View> */}
                </View>
            </Touchable>
        );
    }
}