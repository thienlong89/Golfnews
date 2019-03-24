import React, { PureComponent } from 'react';
import {
    Platform,
    StyleSheet,
    Text,
    View,
    Dimensions
} from 'react-native';
import ProgressBar from 'react-native-progress/Bar';

const screenWidth = Dimensions.get('window').width;

export default class UploadPostProgress extends PureComponent {

    static defaultProps = {

    }

    constructor(props) {
        super(props);
        this.state = {
            progressValue: 0
        }
    }

    render() {
        let { progressValue } = this.state;
        if (progressValue < 1 && progressValue > 0) {
            return (
                <View style={styles.container}>
                    <ProgressBar
                        progress={progressValue}
                        width={screenWidth - 40} />
                </View>
            );
        } else {
            return null;
        }

    }

    setUploadProgress(progress = 0) {
        this.setState({
            progressValue: progress
        })
    }

}

const styles = StyleSheet.create({
    container: {
        width: screenWidth,
        minHeight: 30,
        backgroundColor: '#FFFFFF',
        justifyContent: 'center',
        alignItems: 'center'
    },
});