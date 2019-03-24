import React from 'react';
import PropTypes from 'prop-types';
import {
  View,
  ViewPropTypes
} from 'react-native';
//import ViewPropTypes from 'react-native';

const MyView = (props) => {
  const { children, hide, style, onLayout } = props;
  if (hide) {
    return null;
  }
  return (
    <View {...this.props} style={style}
      onLayout={onLayout}>
      {children}
    </View>
  );
};

MyView.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.element,
    PropTypes.number,
    PropTypes.arrayOf(PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
      PropTypes.element,
    ])),
  ]).isRequired,
  style: ViewPropTypes.style,
  hide: PropTypes.bool,
  onLayout: PropTypes.func
};

export default MyView;