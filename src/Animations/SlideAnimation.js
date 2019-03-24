import { Animated,Dimensions } from 'react-native';
import { Animation } from 'react-native-popup-dialog';


export default class SlideAnimation extends Animation {
  constructor({ toValue = -Dimensions.get('window').height/3, slideFrom = 'top' }) {
    super(toValue);
    this.animations = this.createAnimations(slideFrom);
  }

  toValue(toValue, onFinished) {
    Animated.spring(this.animate, {
      toValue,
      velocity: 0,
      tension: 65, //# change speed
      friction: 10,
    }).start(onFinished);
  }

  createAnimations(slideFrom) {
    const transform = [];

    if (['top', 'bottom'].includes(slideFrom)) {
      if (slideFrom === 'bottom') {
        transform.push({
          translateY: this.animate.interpolate({
            inputRange: [0, 1],
            outputRange: [800, 1],
          }),
        });
      } else {
        transform.push({
          translateY: this.animate.interpolate({
            inputRange: [0, 1],
            outputRange: [-800, 1],
          }),
        });
      }
    } else if (['left', 'right'].includes(slideFrom)) {
      if (slideFrom === 'right') {
        transform.push({
          translateX: this.animate.interpolate({
            inputRange: [0, 1],
            outputRange: [800, 1],
          }),
        });
      } else {
        transform.push({
          translateX: this.animate.interpolate({
            inputRange: [0, 1],
            outputRange: [-800, 1],
          }),
        });
      }
    }

    const animations = {
      transform,
    };

    return animations;
  }
}