import { moderateScale, verticalScale } from '@/assets/styling/scaling';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View, ActivityIndicator } from 'react-native';
import { usePaymentContext } from './CentralPayment';
import { getLoggedInUserId } from '../utils/storage';

export default function PrintPage() {
  const { lastPayment, addPaymentToHistory } = usePaymentContext();
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  
  const API_BASE_URL = 'http://192.168.1.3:5000';

  useEffect(() => {
    const saveTransactionToDatabase = async () => {
      if (!lastPayment) {
        console.log('No payment data to save');
        return;
      }
      
      if (saved) {
        console.log('Already saved this transaction');
        return;
      }
      
      setSaving(true);
      
      try {
        // Get the logged-in user ID from AsyncStorage
        const userId = await getLoggedInUserId();
        console.log('User ID from storage:', userId);
        
        if (!userId) {
          console.log('No user ID found - user not logged in');
          // Still add to local history
          addPaymentToHistory(lastPayment);
          setSaving(false);
          return;
        }
        
        console.log('Saving transaction to database...');
        console.log('Data being sent:', {
          userId: userId,
          phoneNumber: lastPayment.phoneNumber || null,
          method: lastPayment.method,
          amount: lastPayment.amount,
          unitPurchase: lastPayment.units
        });
        
        const response = await fetch(`${API_BASE_URL}/api/record-transaction`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId: userId,
            phoneNumber: lastPayment.phoneNumber || null,
            method: lastPayment.method,
            amount: lastPayment.amount,
            unitPurchase: lastPayment.units
          })
        });
        
        const data = await response.json();
        console.log('Server response:', data);
        
        if (data.success) {
          console.log('✅ Transaction saved to database! ID:', data.transactionId);
          setSaved(true);
          // Add to local history with the database transaction ID
          addPaymentToHistory({
            ...lastPayment,
            id: data.transactionId
          });
        } else {
          console.log('❌ Failed to save to database:', data.message);
          // Still add to local history
          addPaymentToHistory(lastPayment);
        }
      } catch (error) {
        console.error('❌ Error saving transaction:', error);
        // Still add to local history even if DB fails
        addPaymentToHistory(lastPayment);
      } finally {
        setSaving(false);
      }
    };
    
    saveTransactionToDatabase();
  }, [lastPayment]); // Only run once when component mounts

  if (!lastPayment) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>No payment data available.</Text>
        <Text style={styles.subText}>Please complete a payment first.</Text>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.push('/DrawerIndex')}
        >
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const handleBack = () => {
    router.push('/DrawerIndex');
  }

  const formattedAmount = lastPayment.amount.toLocaleString();
  const formattedUnits = lastPayment.units.toFixed(2);

  return (
    <ScrollView style={styles.container}>
      <TouchableOpacity onPress={handleBack}>
        <Image source={require("@/assets/images/left-arrow.png")} style={styles.back}/>
      </TouchableOpacity>
      
      <View style={styles.receiptContainer}>
        <Text style={styles.header}>PAYMENT RECEIPT</Text>
        
        {saving && (
          <View style={styles.savingContainer}>
            <ActivityIndicator size="small" color="#27ae60" />
            <Text style={styles.savingText}>Saving transaction...</Text>
          </View>
        )}
        
        {saved && (
          <View style={styles.savedContainer}>
            <Text style={styles.savedText}>✓ Transaction saved to database</Text>
          </View>
        )}
        
        <View style={styles.divider} />

        <View style={styles.detailRow}>
          <Text style={styles.label}>Payment Method:</Text>
          <Text style={styles.value}>{lastPayment.method}</Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.label}>Amount Paid:</Text>
          <Text style={styles.amountValue}>UGX {formattedAmount}</Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.label}>Units Purchased:</Text>
          <Text style={styles.value}>{formattedUnits} units</Text>
        </View>

        {lastPayment.email && (
          <View style={styles.detailRow}>
            <Text style={styles.label}>Email:</Text>
            <Text style={styles.value}>{lastPayment.email}</Text>
          </View>
        )}

        {lastPayment.cardLastFour && (
          <View style={styles.detailRow}>
            <Text style={styles.label}>Card Number:</Text>
            <Text style={styles.value}>**** **** **** {lastPayment.cardLastFour}</Text>
          </View>
        )}

        {lastPayment.phoneNumber && ( 
          <View style={styles.detailRow}>
            <Text style={styles.label}>Phone Number:</Text>
            <Text style={styles.value}>{lastPayment.phoneNumber}</Text>
          </View>
        )}

        <View style={styles.divider} />
        
        <View style={styles.detailRow}>
          <Text style={styles.label}>Date & Time:</Text>
          <Text style={styles.value}>{new Date().toLocaleString()}</Text>
        </View>

        <View style={styles.statusContainer}>
          <Text style={styles.statusLabel}>Status:</Text>
          <Text style={styles.statusValue}>✅ Payment Successful</Text>
        </View>

        <Text style={styles.thankYou}>Thank you for your purchase!</Text>
      </View>
      
      <TouchableOpacity 
        style={styles.historyButton}
        onPress={() => router.push('/BillingSystem/HistoryPayment')}
      >
        <Text style={styles.historyButtonText}>View Payment History</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#f5f5f5' 
  },
  back: {
    width: moderateScale(20),
    height: verticalScale(18),
    marginTop: 10,
    marginLeft: 10
  },
  receiptContainer: { 
    backgroundColor: 'white', 
    margin: 20, 
    padding: 25, 
    borderRadius: 15, 
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 2 }, 
    shadowOpacity: 0.1, 
    shadowRadius: 6, 
    elevation: 3 
  },
  header: { 
    fontSize: 24, 
    fontWeight: 'bold', 
    textAlign: 'center', 
    color: '#2c3e50', 
    marginBottom: 10 
  },
  divider: { 
    height: 1, 
    backgroundColor: '#ecf0f1', 
    marginVertical: 15 
  },
  detailRow: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    marginBottom: 12, 
    paddingVertical: 5 
  },
  label: { 
    fontSize: 16, 
    fontWeight: '600', 
    color: '#7f8c8d', 
    flex: 1 
  },
  value: { 
    fontSize: 16, 
    fontWeight: '500', 
    color: '#2c3e50', 
    flex: 1, 
    textAlign: 'right' 
  },
  amountValue: { 
    fontSize: 18, 
    fontWeight: 'bold', 
    color: '#27ae60', 
    flex: 1, 
    textAlign: 'right' 
  },
  statusContainer: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    backgroundColor: '#d5f4e6', 
    padding: 15, 
    borderRadius: 8, 
    marginVertical: 10 
  },
  statusLabel: { 
    fontSize: 16, 
    fontWeight: '600', 
    color: '#27ae60' 
  },
  statusValue: { 
    fontSize: 16, 
    fontWeight: 'bold', 
    color: '#27ae60' 
  },
  thankYou: { 
    fontSize: 18, 
    fontWeight: 'bold', 
    textAlign: 'center', 
    color: '#2c3e50', 
    marginVertical: 20, 
    fontStyle: 'italic' 
  },
  errorText: { 
    fontSize: 18, 
    textAlign: 'center', 
    color: '#e74c3c', 
    marginTop: 50 
  },
  subText: { 
    fontSize: 14, 
    textAlign: 'center', 
    color: '#95a5a6', 
    marginTop: 10 
  },
  historyButton: { 
    backgroundColor: '#484763', 
    margin: 20, 
    padding: 15, 
    borderRadius: 8, 
    alignItems: 'center' 
  },
  historyButtonText: { 
    color: '#fff', 
    fontSize: 16, 
    fontWeight: 'bold',
    opacity: 0.8,
  },
  backButton: {
    backgroundColor: '#1B1A31',
    margin: 20,
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  backButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  savingContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    marginBottom: 10,
  },
  savingText: {
    marginLeft: 10,
    color: '#666',
  },
  savedContainer: {
    backgroundColor: '#d5f4e6',
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
    alignItems: 'center',
  },
  savedText: {
    color: '#27ae60',
    fontWeight: 'bold',
  },
});