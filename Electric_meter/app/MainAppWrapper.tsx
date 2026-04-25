import React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Navigator from './DrawerIndex'; // Import your drawer navigator

export default function MainAppWrapper() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Navigator />
    </GestureHandlerRootView>
  );
}