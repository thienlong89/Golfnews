import React, { Component } from 'react';
import {
    Platform,
    StyleSheet,
    Text,
    View,
    ActivityIndicator
} from 'react-native';
import { scale, verticalScale, moderateScale } from '../../../Config/RatioScale';

export default class FooterComponent extends Component {

    static defaultProps = {

    }

    constructor(props) {
        super(props);

        this.state = {
            loading: true
        }

    }

    render() {
        if (!this.state.loading) return null;

        return (
            <View
                style={{
                    paddingVertical: 20,
                    borderTopWidth: 1,
                    borderColor: "#CED0CE",
                    height: 40
                }}
            >
                <ActivityIndicator animating size="large" color={'gray'} />
            </View>
        );
    }

    setLoadingState(isLoading = false) {
        console.log('setLoadingState', isLoading)
        this.setState({
            loading: isLoading
        }, () => {
            if (isLoading) {
                setTimeout(() => {
                    this.setState({
                        loading: false
                    })
                }, 3000);
            }

        })
    }


}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#FFFFFF',
    },
});