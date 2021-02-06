import 'react-native-gesture-handler';

import React from 'react';
import {View, StatusBar, StyleSheet} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';

import AppProvider from './hooks';
import Routes from './routes';

const App: React.FC = () => (
  <NavigationContainer>
    <StatusBar barStyle="light-content" backgroundColor="#312e38" />
    <AppProvider>
      <View style={styles.background}>
        <Routes />
      </View>
    </AppProvider>
  </NavigationContainer>
);

const styles = StyleSheet.create({
  background: {
    backgroundColor: '#312e38',
    flex: 1,
  },
});

export default App;
