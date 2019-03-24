import React from 'react';
import {
    Platform,
    StyleSheet,
    Text,
    View,
    Dimensions
} from 'react-native';
import Touchable from 'react-native-platform-touchable';
import BaseComponent from '../../../Core/View/BaseComponent';
import Networking from '../../../Networking/Networking';
import ApiService from '../../../Networking/ApiService';

const screenHeight = Dimensions.get('window').height;

export default class EventTabView extends BaseComponent {
	
	static defaultProps = {
        
    }
	
  constructor(props) {
    super(props);
    this.state = {

    }
  }

  render() {
    return (
        <View style={styles.container}>

        </View>
    );
  }
  
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#DADADA',
    minHeight: screenHeight -50,
  },
});