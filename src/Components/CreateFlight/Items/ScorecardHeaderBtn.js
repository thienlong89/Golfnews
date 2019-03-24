import React from 'react';
import { Platform, StyleSheet, Text, View, Image, Dimensions } from 'react-native';
import Touchable from 'react-native-platform-touchable';
import BaseComponent from '../../../Core/View/BaseComponent';
import MyView from '../../../Core/View/MyView';
import Networking from '../../../Networking/Networking';
import ApiService from '../../../Networking/ApiService';

import { scale, verticalScale, moderateScale, fontSize } from '../../../Config/RatioScale';
let { width, height } = Dimensions.get('window');

export default class ScorecardHeaderBtn extends BaseComponent {

    static defaultProps = {
        flightId: '',
        hideDelete: false,
        hideEdit: false,
        hideImageIcon: false,
        isLiked: 0,
        postStatus: '',
        hideComment: false
    }

    constructor(props) {
        super(props);
        this.state = {
            isLiked: this.props.isLiked === 0 ? false : true
        }

        this.onShareScoreClick = this.onShareScoreClick.bind(this);
        this.onDeleteFlight = this.onDeleteFlight.bind(this);
        this.onEditFlight = this.onEditFlight.bind(this);
        this.onViewScorecardImage = this.onViewScorecardImage.bind(this);
        this.onDiscussFlightClick = this.onDiscussFlightClick.bind(this);
    }

    setLikeStatus(isLiked = false) {
        this.setState({
            isLiked: isLiked
        });
    }

    renderCommentBtn(hideComment, postStatus) {
        if (!hideComment && postStatus) {
            let commentCount = postStatus ? postStatus.getCommentCount() : 0;
            return (
                <Touchable style={styles.toucable_icon_header} onPress={this.onDiscussFlightClick}>
                    <View style={styles.view_comment}>
                        <Text allowFontScaling={global.isScaleFont} style={styles.comment_count}>{commentCount != 0 ? commentCount : ''}</Text>
                        <Image
                            style={styles.icon_header}
                            source={this.getResources().ic_comment}
                        />
                    </View>
                </Touchable>
            )
        }
        return null;
    }

    render() {
        let {
            postStatus,
            hideComment
        } = this.props;

        return (
            <View style={styles.container_header_right}>
                {this.renderCommentBtn(hideComment, postStatus)}
                <Touchable style={styles.toucable_icon_header} onPress={this.onShareScoreClick}>
                    <Image
                        style={styles.icon_header}
                        source={this.getResources().ic_share}
                    />
                </Touchable>
                <MyView hide={this.props.hideDelete}>
                    <Touchable style={styles.toucable_icon_header} onPress={this.onDeleteFlight}>
                        <Image
                            style={styles.icon_header}
                            source={this.getResources().ic_trash}
                        />
                    </Touchable>
                </MyView>

                <MyView hide={this.props.hideEdit}>
                    <Touchable style={styles.toucable_icon_header} onPress={this.onEditFlight}>
                        <Image
                            style={styles.icon_header}
                            source={this.getResources().pen}
                        />
                    </Touchable>
                </MyView>

                <MyView hide={this.props.hideImageIcon}>
                    <Touchable style={styles.toucable_icon_header} onPress={this.onViewScorecardImage}>
                        <Image
                            style={styles.icon_header}
                            source={this.getResources().ic_picture_blue}
                        />
                    </Touchable>
                </MyView>

            </View>
        );
    }

    onShareScoreClick() {
        if (this.props.onShareScoreClick) {
            this.props.onShareScoreClick();
        }
    }

    onDeleteFlight() {
        if (this.props.onDeleteFlight) {
            this.props.onDeleteFlight();
        }
    }

    onEditFlight() {
        if (this.props.onEditFlight) {
            this.props.onEditFlight();
        }
    }

    onViewScorecardImage() {
        if (this.props.onViewScorecardImage) {
            this.props.onViewScorecardImage();
        }
    }

    onDiscussFlightClick() {
        if (this.props.onDiscussFlightClick) {
            this.props.onDiscussFlightClick();
        }
    }

    onLikeScoreCResponse(jsonData) {
        if (jsonData != null && jsonData.hasOwnProperty('error_code')) {
            if (jsonData['error_code'] === 0) {
                this.setLikeStatus(!this.state.isLiked);
            } else {
                this.showErrorMsg(jsonData['error_msg']);
            }
        }

    }

}

const styles = StyleSheet.create({
    container_header_right: {
        flexDirection: 'row'
    },
    icon_header: {
        height: verticalScale(25),
        width: scale(25),
        resizeMode: 'contain',
        tintColor: '#00ABA7'
    },
    toucable_icon_header: {
        paddingTop: verticalScale(5),
        paddingBottom: verticalScale(5),
        paddingLeft: scale(10),
        paddingRight: scale(10)
    },
    comment_count: {
        fontSize: fontSize(15),
        color: '#00ABA7',
        marginRight: scale(3)
    },
    view_comment: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    }
});