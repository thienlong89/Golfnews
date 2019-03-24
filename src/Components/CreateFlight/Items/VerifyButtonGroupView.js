import React from 'react';
import { Platform, StyleSheet, Text, View,Dimensions } from 'react-native';
import Touchable from 'react-native-platform-touchable';
import BaseComponent from '../../../Core/View/BaseComponent';
import MyView from '../../../Core/View/MyView';
import {scale, verticalScale, fontSize} from '../../../Config/RatioScale';

export default class VerifyButtonGroupView extends BaseComponent {

  static defaultProps = {
    existMe: false
  }

  constructor(props) {
    super(props);
    this.state = {
      isShowSubmitScore: false,
      isShowDenyScore: false,
      isShowVerifyScore: false,
      existMe: this.props.existMe
    }
  }

  setVerifyState(isShowSubmitScore, isShowDenyScore, isShowVerifyScore, existMe) {
    this.setState({
      isShowSubmitScore: isShowSubmitScore,
      isShowDenyScore: isShowDenyScore,
      isShowVerifyScore: isShowVerifyScore,
      existMe: existMe
    });
  }

  render() {
    let {isShowSubmitScore, isShowDenyScore, isShowVerifyScore, existMe} = this.state;
    return (
      <View style={styles.submit_score_container}>
        <MyView hide={!isShowSubmitScore || !existMe}>
          <Touchable style={styles.touchable_submit_score}
            onPress={this.submitScorecardClick.bind(this)}>
            <Text allowFontScaling={global.isScaleFont} style={styles.text_submit_score}>{this.t('submit_score')}</Text>
          </Touchable>
        </MyView>
        <MyView hide={!isShowDenyScore || !existMe}>
          <Touchable style={styles.touchable_deny_view}
            onPress={this.denyScorecardClick.bind(this)}>
            <Text allowFontScaling={global.isScaleFont} style={styles.text_deny_score}>{this.t('deny')}</Text>
          </Touchable>
        </MyView>
        <MyView hide={!isShowVerifyScore || !existMe}>
          <Touchable style={styles.touchable_submit_score}
            onPress={this.verifyScorecardClick.bind(this)}>
            <Text allowFontScaling={global.isScaleFont} style={styles.text_submit_score}>{this.t('signature')}</Text>
          </Touchable>
        </MyView>

      </View>
    );
  }

  submitScorecardClick() {
    if (this.props.submitScorecardClick) {
      this.props.submitScorecardClick();
    }
  }

  denyScorecardClick() {
    if (this.props.denyScorecardClick) {
      this.props.denyScorecardClick();
    }
  }

  verifyScorecardClick() {
    if (this.props.verifyScorecardClick) {
      this.props.verifyScorecardClick();
    }
  }

}

const styles = StyleSheet.create({
  submit_score_container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginRight:  scale(5)
  },
  touchable_deny_view: {
    paddingTop: verticalScale(5),
    paddingBottom: verticalScale(5),
    borderWidth: 1,
    borderColor: 'red',
    backgroundColor: 'white',
    minWidth: scale(80),
    justifyContent: 'center',
    alignItems: 'center'
  },
  text_deny_score: {
    color: 'red',
    fontSize: fontSize(15,scale(1)),// 15,
  },
  touchable_submit_score: {
    paddingTop: verticalScale(6),
    paddingBottom: verticalScale(6),
    backgroundColor: '#00ABA7',
    borderRadius: scale(3),
    minWidth: scale(80),
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: scale(10)
  },
  text_submit_score: {
    color: '#FFFFFF',
    fontSize: fontSize(15,scale(1)),// 15,
    paddingRight: scale(3),
    paddingLeft: scale(3)
  },
});