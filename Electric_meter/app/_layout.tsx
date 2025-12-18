import { Stack } from 'expo-router';
import React from 'react';
import { PaymentProvider } from './BillingSystem/CentralPayment';

export default function Layout() {
  return (
    <PaymentProvider>
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: '#f5f5f5' },
          headerTintColor: '#000',
          headerTitleStyle: { fontWeight: 'bold' },
        }}
      >
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="LoginForm" options={{headerShown: false,  headerTitle: 'Login'}} />      
        <Stack.Screen name="RegistrationForm" options={{headerShown: false,  headerTitle: 'Register' }} />
        <Stack.Screen name="ElectricMeterForm" options={{headerShown: false,  headerTitle: 'Electric Meter' }} />
        <Stack.Screen name="Chart" options={{headerShown: false,  headerTitle: 'Usage Chart' }} />    
        <Stack.Screen name="Debug" options={{headerShown: false,  headerTitle: 'Debug' }} />
        
        <Stack.Screen name="BillingSystem/Billing" options={{headerShown: false,  headerTitle: 'Billing' }} />
        <Stack.Screen name="BillingSystem/Airtel" options={{headerShown: false,  headerTitle: 'Airtel Payment' }} />
        <Stack.Screen name="BillingSystem/MTN" options={{headerShown: false,  headerTitle: 'MTN Payment' }} />
        <Stack.Screen name="BillingSystem/Visa" options={{headerShown: false,  headerTitle: 'Visa Payment' }} />
        <Stack.Screen name="BillingSystem/MasterCard" options={{headerShown: false,  headerTitle: 'MasterCard Payment' }} />
        <Stack.Screen name="BillingSystem/PayPal" options={{headerShown: false,  headerTitle: 'PayPal Payment' }} />
        <Stack.Screen name="BillingSystem/PayUg" options={{headerShown: false,  headerTitle: 'PayUg Payment' }} />
        <Stack.Screen name="BillingSystem/Printable" options={{headerShown: false,  headerTitle: 'Payment Receipt' }} />
        <Stack.Screen name="BillingSystem/HistoryPayment" options={{headerShown: false, headerTitle:'HistoryPayment'}} />
        <Stack.Screen name='Dashboard' options={{headerShown: false }}/>
        <Stack.Screen name="DrawerIndex" options={{headerShown: false }}/>
        <Stack.Screen name="ChartOne" options={{headerShown: false }}/>
      </Stack>
    </PaymentProvider>
  );
}