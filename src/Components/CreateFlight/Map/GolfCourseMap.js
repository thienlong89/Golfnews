import React from 'react';
import {
    Platform,
    StyleSheet,
    Text,
    View,
    Dimensions,
    Linking,
    Alert,
    AppState
} from 'react-native';
import Touchable from 'react-native-platform-touchable';
import BaseComponent from '../../../Core/View/BaseComponent';
import HeaderView from '../../HeaderView';
import Networking from '../../../Networking/Networking';
import ApiService from '../../../Networking/ApiService';
import MapView, { Marker } from 'react-native-maps';
//import Polyline from '@mapbox/polyline';
import { Location, Permissions } from '../../../Core/Common/ExpoUtils';
import UserInfo from '../../../Config/UserInfo';
import IntentActivityAndroid from '../../../Core/Common/IntentActivityAndroid';

const { width, height } = Dimensions.get('window');
const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

export default class GolfCourseMap extends BaseComponent {

    static defaultProps = {

    }

    constructor(props) {
        super(props);
        this.facilityModel = this.props.navigation.state.params.facilityModel;
        console.log('facilityModel', this.facilityModel);
        this.state = {
            appState: AppState.currentState,
            region: {
                latitude: this.getUserInfo().getLatitude(),
                longitude: this.getUserInfo().getLongitude(),
                latitudeDelta: LATITUDE_DELTA,
                longitudeDelta: LONGITUDE_DELTA,
            },

            markers: [],
        }
    }

    render() {
        let { region } = this.state;
        return (
            <View style={styles.container}>
                <HeaderView title={this.facilityModel.getSubTitle()} handleBackPress={this.onBackPress.bind(this)} />
                <View style={{ flex: 1 }}>
                    <MapView
                        ref={(mapView) => { this.mapView = mapView; }}
                        region={region}
                        style={{ backgroundColor: '#fff', flex: 1 }}
                    >
                        <Marker
                            coordinate={{
                                latitude: region.latitude,
                                longitude: region.longitude,
                            }}
                            image={this.getResources().ic_mark_current}
                        />
                        <Marker
                            coordinate={{
                                latitude: this.facilityModel.getLatitude(),
                                longitude: this.facilityModel.getLongitude()
                            }}
                            title={this.facilityModel.getSubTitle()}
                            image={this.getResources().ic_mark_course}
                        />
                        {/* <MapView.Polyline
                            coordinates={this.state.markers}
                            strokeWidth={6}
                            strokeColor="red" /> */}
                    </MapView>
                    {this.renderInternalLoading()}
                </View>
                
            </View>
        );
    }

    onBackPress() {
        if (this.props.navigation != null) {
            this.props.navigation.goBack();
        }
        return true;
    }

    componentDidMount() {
        AppState.addEventListener('change', this._handleAppStateChange);
        console.log('GolfCourseMap', this.state.region.latitude, this.state.region.longitude);
        if (!this.state.region.latitude && !this.state.region.longitude) {
            this._getLocationAsync();
        } else {
            this.requestDrawDirection();
        }
    }

    componentWillUnmount() {
        AppState.removeEventListener('change', this._handleAppStateChange);
    }

    _handleAppStateChange = (nextAppState) => {
        if (this.state.appState.match(/background/) && nextAppState === 'active') {
            this._getLocationAsync();
        }
        this.setState({ appState: nextAppState });
    }

    _getLocationAsync = async () => {
        try {
            let { status } = await Permissions.askAsync(Permissions.LOCATION);
            if (status !== 'granted') {
                this.setState({
                    errorMessage: 'Permission to access location was denied',
                    showTab: true
                });
                console.log('errorMessage', 'Permission to access location was denied');
            } else {
                console.log('Permission.accepted');

                Location.getCurrentPositionAsync({}, this.saveLocation.bind(this), (errorCallback) => {
                    if (errorCallback && errorCallback.code === 2) {
                        Alert.alert(
                            this.t('gps_off'),
                            this.t('notify_gps_off'),
                            [
                                { text: this.t('cancel'), onPress: () => { this.props.navigation.goBack(); }, style: 'cancel' },
                                {
                                    text: this.t('ok'), onPress: () => {
                                        if (Platform.OS === 'ios') {
                                            Linking.openURL('app-settings:');
                                        } else {
                                            IntentActivityAndroid.startActivityAsync(IntentActivityAndroid.ACTION_LOCATION_SOURCE_SETTINGS);
                                        }
                                    }
                                }
                            ],
                            {
                                cancelable: false
                            }
                        );
                    }
                });

            }
        } catch (error) {
            console.log(error);
        }
    };


    saveLocation(location) {
        console.log('location', location);
        if (location.coords && location.coords.latitude && location.coords.longitude) {
            UserInfo.setLatitude(location.coords.latitude);
            UserInfo.setLongitude(location.coords.longitude);

            this.setState({
                region: {
                    latitude: location.coords.latitude,
                    longitude: location.coords.longitude,
                    latitudeDelta: LATITUDE_DELTA,
                    longitudeDelta: LONGITUDE_DELTA,
                }
            }, () => {
                this.mapView.animateToRegion(this.state.region);
                this.requestDrawDirection();
            })
            console.log('latitude', UserInfo.getLatitude(), 'longitude', UserInfo.getLongitude());
        }

    }

    requestDrawDirection() {
        let desLatitude = this.facilityModel.getLatitude();
        let desLongitude = this.facilityModel.getLongitude();
        if (desLatitude && desLongitude) {
            let { latitude, longitude } = this.state.region;
            this.getDirections(`${latitude},${longitude}`, `${desLatitude},${desLongitude}`);
        }
    }

    async getDirections(startLoc = ',', destinationLoc = ',') {

        try {
            this.internalLoading.showLoading();
            let resp = await fetch(`https://maps.googleapis.com/maps/api/directions/json?origin=${startLoc}&destination=${destinationLoc}`);
            console.log('getDirections.resp', resp);
            let respJson = await resp.json();
            this.internalLoading.hideLoading();
            // let points = Polyline.decode(respJson.routes[0].overview_polyline.points);
            // let coords = points.map((point, index) => {
            //     return {
            //         latitude: point[0],
            //         longitude: point[1]
            //     }
            // })
            // console.log('getDirections.coords', coords);
            this.setState({ markers: coords })
            return coords
        } catch (error) {
            console.log('getDirections', error);
            return error
        }
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
});