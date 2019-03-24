import React, { PureComponent } from 'react';
import {
    Platform,
    StyleSheet,
    View,
    ActivityIndicator
} from 'react-native';

export default class FooterComponent extends PureComponent {

    static defaultProps = {

    }

    constructor(props) {
        super(props);
        this.isLoading = false;
        this.state = {
            loading: false
        }
    }

    render() {
        if (!this.state.loading) return null;

        return (
            <View style={styles.container}>
                <ActivityIndicator animating size="large" />
            </View>
        );
    }

    setLoading(loading = false) {
        this.isLoading = loading;
        this.setState({
            loading: loading
        })
    }

    getLoading() {
        return this.isLoading;
    }

}

const styles = StyleSheet.create({
    container: {
        paddingVertical: 20,
        borderTopWidth: 1,
        borderColor: "#CED0CE"
    },
});