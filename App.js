import React from 'react';
// import { LoginStack } from './src/Router/LoginRouter';
// import BackgroundTask from 'react-native-background-task';
// import DataManager from './src/Core/Manager/DataManager';
// import Constant from './src/Constant/Constant';
// import HomeView from './src/Components/GolfNews/MobileApp/HomeView';
import Main from './src/Components/GolfNews/Main';

// import Sentry from 'react-native-sentry';
// Sentry.config('https://809a7d47507246c5a4243d6fd33944bd:2dc79bff4d7e46dd8f9861c6934ea894@sentry.io/1206687').install();

// require('./I18n/I18n.js');
require('./src/Config/Global');
// const KEYS = [Constant.USER.USER_ID, Constant.USER.TOKEN, Constant.USER.USER_TYPE];

export default class App extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Main />
    );
  }
}