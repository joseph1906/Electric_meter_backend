import AsyncStorage from '@react-native-async-storage/async-storage';
import { DrawerContentScrollView, DrawerItemList, createDrawerNavigator } from '@react-navigation/drawer';
import { useRouter } from 'expo-router';
import React from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Billing from './BillingSystem/Billing';
import HistoryPayment from './BillingSystem/HistoryPayment';
import Dashboard from './Dashboard';
import Profile from './Profile';

const Drawer = createDrawerNavigator();

function CustomDrawerContent(props: any) {
  const router = useRouter();

  const handleLogout = async () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            await AsyncStorage.clear();
            router.replace('/LoginForm');
          },
        },
      ]
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#1B1A31' }}>
      <DrawerContentScrollView {...props} contentContainerStyle={{ flexGrow: 1 }}>
        <DrawerItemList {...props} />
          {/* Logout at the bottom */}
      <View style={{ padding: 16, paddingBottom: 40 }}>
        <TouchableOpacity
        style={styles.logoutBtn}
        onPress={handleLogout}
        activeOpacity={0.8}
      >
        <Text style={styles.logoutIcon}>🚪</Text>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
      </View>
      </DrawerContentScrollView>  
    </View>
  );
}

function DrawerNavigator() {
  return (
    <Drawer.Navigator
      initialRouteName="Dashboard"
      drawerContent={(props) => <CustomDrawerContent {...props} />}
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
          <TouchableOpacity
            onPress={() => navigation.toggleDrawer()}
            style={{ marginLeft: 16, padding: 4, gap: 5 }}
          >
            <View style={{ width: 24, height: 2.5, backgroundColor: '#1B1A31', borderRadius: 2 }} />
            <View style={{ width: 24, height: 2.5, backgroundColor: '#1B1A31', borderRadius: 2 }} />
            <View style={{ width: 24, height: 2.5, backgroundColor: '#1B1A31', borderRadius: 2 }} />
          </TouchableOpacity>
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
        options={{ drawerLabel: '📊 Dashboard', title: 'Dashboard' }}
      />
      <Drawer.Screen
        name="Profile"
        component={Profile}
        options={{ drawerLabel: '👤 Profile', title: 'Profile' }}
      />
      <Drawer.Screen
        name="HistoryPayment"
        component={HistoryPayment}
        options={{ drawerLabel: '📜 History Payment', title: 'Payment History' }}
      />
      <Drawer.Screen
        name="Billing"
        component={Billing}
        options={{ drawerLabel: '💰 Billing Payment', title: 'Billing' }}
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

const styles = StyleSheet.create({
  logoutBtn: {
  flexDirection: 'row',
  alignItems: 'center',
  gap: 12,
  marginHorizontal: 10,
  marginBottom: 32,
  paddingVertical: 14,
  paddingHorizontal: 16,
  borderRadius: 8,
  backgroundColor: 'rgba(185, 28, 28, 0.15)',
  borderWidth: 1,
  borderColor: 'rgba(185, 28, 28, 0.3)',
},
logoutIcon: {
  fontSize: 16,
  width: 24,           // ← same icon width as drawer item icons
  textAlign: 'center',
},
logoutText: {
  fontSize: 14,        // ← same font size as drawerLabelStyle
  fontWeight: '600',
  color: '#fca5a5',
},
});