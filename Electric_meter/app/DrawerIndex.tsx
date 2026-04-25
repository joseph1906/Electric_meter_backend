import { createDrawerNavigator } from '@react-navigation/drawer';
import React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Pressable, View } from 'react-native';
import Billing from './BillingSystem/Billing';
import HistoryPayment from './BillingSystem/HistoryPayment';
import Dashboard from "./Dashboard";
import Profile from './Profile';

const Drawer = createDrawerNavigator();

function DrawerNavigator() {
  return (
    <Drawer.Navigator 
      initialRouteName='Dashboard'
      screenOptions={({ navigation }) => ({
        headerStyle: {
          backgroundColor: '#FFFFFF',
        },
        headerTitleStyle: {
          fontWeight: 'bold',
          color: '#1B1A31',
          fontSize: 20,
        },
        headerLeft: () => (
          <Pressable
            onPress={() => navigation.toggleDrawer()}
            style={{ marginLeft: 16, padding: 4, gap: 5 }}
          >
            <View style={{ width: 24, height: 2.5, backgroundColor: '#1B1A31', borderRadius: 2 }} />
            <View style={{ width: 24, height: 2.5, backgroundColor: '#1B1A31', borderRadius: 2 }} />
            <View style={{ width: 24, height: 2.5, backgroundColor: '#1B1A31', borderRadius: 2 }} />
          </Pressable>
        ),
        drawerStyle: {
          backgroundColor: '#1B1A31',
          width: 280,
        },
        drawerLabelStyle: {
          color: '#D9D9D9',
          fontSize: 16,
        },
        drawerActiveTintColor: '#fff',
        drawerInactiveTintColor: '#D9D9D9',
        drawerActiveBackgroundColor: '#333',
      })}
    >
      <Drawer.Screen 
        name="Dashboard" 
        component={Dashboard}
        options={{
          drawerLabel: '📊 Dashboard',
          title: 'Dashboard',
        }}
      />
      <Drawer.Screen 
        name="Profile" 
        component={Profile}
        options={{
          drawerLabel: '👤 Profile',
          title: 'Profile',
        }}
      />
      <Drawer.Screen 
        name="HistoryPayment" 
        component={HistoryPayment}
        options={{
          drawerLabel: '📜 History Payment',
          title: 'Payment History',
        }}
      />
      <Drawer.Screen 
        name='Billing' 
        component={Billing}
        options={{
          drawerLabel: '💰 Billing Payment',
          title: 'Billing',
        }}
      />
    </Drawer.Navigator>
  );
}

export default function DrawerIndex() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <DrawerNavigator />
    </GestureHandlerRootView>
  );
}