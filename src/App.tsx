/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import {StatusBar, View} from 'react-native';
import {CalculatorScreen} from './presentation/screens/CalculatorScreen';
import {globalStyles} from './config/theme/global.styles';

function App() {
  return (
    <View style={globalStyles.background}>
      <StatusBar barStyle={'dark-content'} backgroundColor={'black'} />
      <CalculatorScreen />
    </View>
  );
}

export default App;
