import React from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  Animated,
  ScrollView,
  TouchableOpacity
} from 'react-native';
import Touchable from 'react-native-platform-touchable';
import BaseComponent from '../../Core/View/BaseComponent';
import HeaderSearchClbView from './Items/HeaderSearchClbView';
import ClbNavigatorHeader from './Items/ClbNavigatorHeader';

import IntroduceTabView from './Tab/IntroduceTabView';
import CheckHandicapTabView from './Tab/CheckHandicapTabView';
import DiscussTabView from './Tab/DiscussTabView';
import EventTabView from './Tab/EventTabView';
import PhotoAlbumTabView from './Tab/PhotoAlbumTabView';

import ClbTabView from './Items/ClbTabView';
import Swiper from 'react-native-swiper';

const HEADER_COLLAPSED_HEIGHT = 0;

export default class ClubInfoTabScreen extends BaseComponent {

  static defaultProps = {

  }

  constructor(props) {
    super(props);
    this.refScrollView = [];
    this.currentTab = 0;
    this.tabViewList = [IntroduceTabView, CheckHandicapTabView, DiscussTabView, EventTabView, PhotoAlbumTabView];
    this.state = {
      scrollY: new Animated.Value(0),
      header_expanded_height: 200
    }
  }

  render() {

    const headerHeight = this.state.scrollY.interpolate({
      inputRange: [0, this.state.header_expanded_height - HEADER_COLLAPSED_HEIGHT],
      outputRange: [this.state.header_expanded_height, HEADER_COLLAPSED_HEIGHT],
      extrapolate: 'clamp'
    });
    const headerTitleOpacity = this.state.scrollY.interpolate({
      inputRange: [0, this.state.header_expanded_height - HEADER_COLLAPSED_HEIGHT],
      outputRange: [0, 1],
      extrapolate: 'clamp'
    });
    const heroTitleOpacity = this.state.scrollY.interpolate({
      inputRange: [0, this.state.header_expanded_height - HEADER_COLLAPSED_HEIGHT],
      outputRange: [1, 0],
      extrapolate: 'clamp'
    });

    let tabView = this.tabViewList.map((TabItem, index) => {
      return (
        <ScrollView
          ref={(refScrollView) => { this.refScrollView[index] = refScrollView }}
          contentContainerStyle={{ paddingTop: this.state.header_expanded_height }}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: this.state.scrollY } } }],
            {
              // useNativeDriver: true,
              listener: event => {
                const offsetY = event.nativeEvent.contentOffset.y
                // do something special
                this.refClbTabView.setPosition(offsetY);
              },
            },
          )}
          scrollEventThrottle={16}>

          <View style={{ flex: 1 }}>
            <TabItem {...this.props}
            // navigation={this.props.screenProps.parentNavigator}
            />
          </View>

        </ScrollView>
      )
    })

    return (
      <View style={styles.container}>
        <HeaderSearchClbView
          onPressBack={this.onBackPress.bind(this)} />

        <View style={{ flex: 1 }}>
          <Animated.View style={[{
            backgroundColor: '#FFF',
            position: 'absolute',
            right: 0,
            top: 0,
            left: 0,
            zIndex: 2
          }, { height: headerHeight }]}>

            <Animated.View style={[{ opacity: heroTitleOpacity, backgroundColor: '#FFFFFF' }]}>
              <ClbNavigatorHeader />
            </Animated.View>
          </Animated.View>

          <View style={{ flex: 1 }}>

            <ClbTabView
              ref={(refClbTabView) => { this.refClbTabView = refClbTabView }}
              onClubTabPress={this.onClubTabPress.bind(this)} />

            <Swiper
              ref={(swiper) => { this.swiper = swiper; }}
              showsButtons={false}
              loop={false}
              showsPagination={false}
              onIndexChanged={(index) => this.onViewPagerChange(index)}>

              {tabView}

            </Swiper>
          </View>
        </View>

      </View>
    );
  }

  onBackPress() {
    if (this.props.navigation != null) {
      this.props.navigation.goBack();
    }
  }

  onViewPagerChange(pageIndex) {
    this.currentTab = pageIndex;
    this.refScrollView.map((ref) => {
      ref.scrollTo({ x: 0, y: this.state.header_expanded_height - 50, animated: true })
    });
    this.refClbTabView.setTabSelected(pageIndex);
  }

  onClubTabPress(position) {
    this.swiper.scrollBy(position - this.currentTab);
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
});