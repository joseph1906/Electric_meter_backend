import { Stack } from 'expo-router';
import React from 'react';
import { StatusBar } from 'react-native';
import { PaymentProvider } from './BillingSystem/CentralPayment';

export default function Layout() {
  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <PaymentProvider>
        <Stack>
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen name="LoginForm" options={{ headerShown: false }} />      
          <Stack.Screen name="RegistrationForm" options={{ headerShown: false }} />
          <Stack.Screen name="ElectricMeterForm" options={{ headerShown: false }} />
          <Stack.Screen name="Chart" options={{ headerShown: false }} />    
          <Stack.Screen name="Debug" options={{ headerShown: false }} />
          
          <Stack.Screen name="BillingSystem/Billing" options={{ headerShown: false }} />
          <Stack.Screen name="BillingSystem/Airtel" options={{ headerShown: false }} />
          <Stack.Screen name="BillingSystem/MTN" options={{ headerShown: false }} />
          <Stack.Screen name="BillingSystem/Visa" options={{ headerShown: false }} />
          <Stack.Screen name="BillingSystem/MasterCard" options={{ headerShown: false }} />
          <Stack.Screen name="BillingSystem/PayPal" options={{ headerShown: false }} />
          <Stack.Screen name="BillingSystem/PayUg" options={{ headerShown: false }} />
          <Stack.Screen name="BillingSystem/Printable" options={{ headerShown: false }} />
          <Stack.Screen name="BillingSystem/HistoryPayment" options={{ headerShown: false }} />
          
          {/* This is the key - use redirect instead of component */}
          <Stack.Screen name="DrawerIndex" options={{ headerShown: false }} />
          
          <Stack.Screen name="ChartOne" options={{ headerShown: false }} />
        </Stack>
      </PaymentProvider>
    </>
  );
}