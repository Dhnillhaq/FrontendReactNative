/**
 * React Native App for Production Management with OCR
 * @format
 */

import React from 'react';
import {StatusBar} from 'react-native';
import AppNavigator from './src/navigation/AppNavigator';

function App() {
  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#059669" />
      <AppNavigator />
    </>
  );
}

export default App;
