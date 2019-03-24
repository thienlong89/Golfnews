import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View, ScrollView } from 'react-native';
import ScorePreviewRow from './ScorePreviewRow';
import MyView from '../../../Core/View/MyView';
import GestureRecognizer, { swipeDirections } from 'react-native-swipe-gestures';
import AnimatedLinearGradient from 'react-native-animated-linear-gradient';
import Swiper from 'react-native-swiper';
import HoleUserModel from '../../../Model/CreateFlight/Flight/HoleUserModel';

const colorAnimate = {
    left: [
        '#FFFFFF',
        '#00ABA7',
    ],
    right: [
        '#00ABA7',
        '#FFFFFF',
    ]
}

const configGesture = {
    velocityThreshold: 0.3,
    directionalOffsetThreshold: 40
};

export default class ScorePreview extends Component {

    static defaultProps = {
        FlightDetail: {},
        isGrossScoreMode: true,
        isHostUser: false,
        uid: ''
    }

    constructor(props) {
        super(props);
        this.playerPosition = 0;
        this.playerLength = this.props.FlightDetail.getUserRounds().length;
        this.type_flight = this.props.FlightDetail.getTypeFlight() || 1;
        this.state = {
            isGrossScoreMode: this.props.isGrossScoreMode,
            isShowAnimation: false,
            animateDirection: colorAnimate.left
        }
        this.onModeChangePress = this.onModeChangePress.bind(this);
    }

    refreshView() {
        this.setState({})
    }

    setChangeScoreMode(isGrossScoreMode) {
        this.setState({
            isGrossScoreMode: isGrossScoreMode
        });
    }

    setPlayerPosition(position) {
        this.playerPosition = position;
    }

    render() {
        let { isHostUser } = this.props;
        let userRoundModel = this.props.FlightDetail.getUserRounds();
        let holeList = userRoundModel[0].getHoldUserList();
        if (this.type_flight === 2 || this.type_flight === 3) {
            let extrasHole = [];
            for(let i=0; i<9; i++){
                extrasHole.push(new HoleUserModel())
            }
            holeList = [...holeList, ...extrasHole]
        }
        let checkHoleIndex = holeList.find((item) => {
            return item.getHoleIndex() != 0;
        })
        console.log('this.type_flight', this.type_flight)
        if (this.type_flight === 3) {
            let scorePlayerView = userRoundModel.map((item, index) => {
                let isShowConfirm = this.checkState(item, isHostUser);
                return <ScorePreviewRow
                    HoleList={item.getHoldUserList()}
                    rowIndex={index + 2}
                    isGrossScoreMode={this.state.isGrossScoreMode}
                    isShowConfirm={isShowConfirm}
                    onScorePlayerPress={this.onScorePlayerPress.bind(this, item, index)} />
            });

            let scorePlayerView2 = userRoundModel.map((item, index) => {
                let isShowConfirm = this.checkState(item, isHostUser);
                return <ScorePreviewRow
                    HoleList={item.getHoldUserList()}
                    rowIndex={index + 2}
                    isGrossScoreMode={this.state.isGrossScoreMode}
                    isShowConfirm={isShowConfirm}
                    isExtras={true}
                    onScorePlayerPress={this.onScorePlayerPress.bind(this, item, index)} />
            });

            return (
                <View style={styles.container} >
                    < Swiper
                        ref={(swiper) => { this.swiper = swiper; }}
                        showsButtons={false}
                        loop={false}
                        showsPagination={true}
                    // onIndexChanged={this.onViewScoreBoardChange}
                    // index={this.userSelected}
                    // key={scoreBoard.length}
                    >
                        <ScrollView style={styles.container_input}>
                            <ScorePreviewRow
                                HoleList={holeList}
                                rowIndex={0}
                                onModeChangePress={this.onModeChangePress} />
                            <ScorePreviewRow
                                HoleList={holeList}
                                rowIndex={1} />
                            {scorePlayerView}
                            <MyView hide={checkHoleIndex ? false : true}>
                                <ScorePreviewRow
                                    HoleList={holeList}
                                    rowIndex={6} />
                            </MyView>
                        </ScrollView>

                        <ScrollView style={styles.container_input}>
                            <ScorePreviewRow
                                HoleList={holeList}
                                rowIndex={0}
                                onModeChangePress={this.onModeChangePress}
                                isExtras={true} />
                            <ScorePreviewRow
                                HoleList={holeList}
                                rowIndex={1}
                                isExtras={true} />
                            {scorePlayerView2}
                            <MyView hide={checkHoleIndex ? false : true}>
                                <ScorePreviewRow
                                    HoleList={holeList}
                                    rowIndex={6}
                                    isExtras={true} />
                            </MyView>
                        </ScrollView>
                    </Swiper >
                </View>
            )

        } else {
            let scorePlayerView = userRoundModel.map((item, index) => {
                let isShowConfirm = this.checkState(item, isHostUser);
                return <ScorePreviewRow
                    HoleList={item.getHoldUserList()}
                    rowIndex={index + 2}
                    isGrossScoreMode={this.state.isGrossScoreMode}
                    isShowConfirm={isShowConfirm}
                    type_flight={this.type_flight}
                    onScorePlayerPress={this.onScorePlayerPress.bind(this, item, index)} />
            });

            return (
                <View style={styles.container} >
                    <ScrollView style={styles.container_input}>
                        <ScorePreviewRow
                            HoleList={holeList}
                            rowIndex={0}
                            type_flight={this.type_flight}
                            onModeChangePress={this.onModeChangePress} />
                        <ScorePreviewRow
                            HoleList={holeList}
                            rowIndex={1}
                            type_flight={this.type_flight} />
                        {scorePlayerView}
                        <MyView hide={checkHoleIndex ? false : true}>
                            <ScorePreviewRow
                                HoleList={holeList}
                                rowIndex={6}
                                type_flight={this.type_flight} />
                        </MyView>
                    </ScrollView>
                </View>
            );
        }

    }

    onSwipeLeft(state) {
        console.log('onSwipeLeft');
        if (this.playerPosition < this.playerLength - 1) {
            this.playerPosition++;
            if (this.props.onSwipeLeft) {
                this.props.onSwipeLeft(this.playerPosition);
            }
            this.setState({
                animateDirection: colorAnimate.left,
                isShowAnimation: true
            }, () => {
                setTimeout(() => {
                    this.setState({
                        isShowAnimation: false
                    });
                }, 300);
            });
        }

    }

    onSwipeRight(state) {
        console.log('onSwipeRight');
        if (this.playerPosition > 0) {
            this.playerPosition--;
            if (this.props.onSwipeRight) {
                this.props.onSwipeRight(this.playerPosition);
            }
            this.setState({
                animateDirection: colorAnimate.right,
                isShowAnimation: true
            }, () => {
                setTimeout(() => {
                    this.setState({
                        isShowAnimation: false
                    });
                }, 300);
            });
        }

    }

    onModeChangePress(isGrossScoreMode) {
        this.setState({
            isGrossScoreMode: isGrossScoreMode
        });
    }

    checkState(userRound, isHostUser) {
        if (userRound.getState() === 0 && userRound.getSubmitted() === 1 && userRound.getUserId() != this.props.uid && userRound.getConfirmed() != 1) {   // diem tu nhap
            return true;
        } else if (userRound.getState() === 1 && !isHostUser && userRound.getConfirmed() != 1 && userRound.getSubmitted() != 0) {    // diem duoc nhap ho
            return true;
        }
        return false;
    }

    onScorePlayerPress(userRound, index) {
        if (this.props.onScorePlayerPress) {
            this.props.onScorePlayerPress(userRound, index);
        }
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF'
    },
    gesture_recognizer: {
        backgroundColor: '#FFFFFF',
        flex: 1
    },
    container_input: {
        flex: 1
    },

});