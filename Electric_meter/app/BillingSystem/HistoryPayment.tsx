import { router } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { PaymentHistoryItem, usePaymentContext } from './CentralPayment';

export default function HistoryPayment() {
  const { paymentHistory } = usePaymentContext();

  console.log('HistoryPayment - paymentHistory:', paymentHistory);
  console.log('HistoryPayment - paymentHistory length:', paymentHistory.length);

  const formatDate = (dateString: string): string => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return 'Invalid date';
    }
  };

  if (!paymentHistory || paymentHistory.length === 0) {
    console.log('Showing empty state');
    return (
      <View style={styles.container}>
        <Text style={styles.emptyText}>No payment history found</Text>
        <Text style={styles.emptySubText}>Your payment history will appear here after making payments</Text>
        <Text style={styles.debugText}>Debug: History array length: {paymentHistory?.length || 0}</Text>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Payment History</Text>
        <Text style={styles.subtitle}>{paymentHistory.length} transaction(s)</Text>
        <Text style={styles.debugText}>Debug: First payment: {paymentHistory[0]?.method} - UGX {paymentHistory[0]?.amount}</Text>
      </View>

      {paymentHistory.map((payment: PaymentHistoryItem, index: number) => (
        <View key={payment.id || `payment-${index}`} style={styles.paymentCard}>
          <View style={styles.paymentHeader}>
            <Text style={styles.paymentMethod}>{payment.method}</Text>
            <Text style={styles.paymentAmount}>UGX {payment.amount.toLocaleString()}</Text>
          </View>
          
          <View style={styles.paymentDetails}>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Units:</Text>
              <Text style={styles.detailValue}>{payment.units.toFixed(2)} units</Text>
            </View>
            
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Transaction ID:</Text>
              <Text style={styles.detailValue}>{payment.id}</Text>
            </View>
            
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Date & Time:</Text>
              <Text style={styles.detailValue}>
                {payment.timestamp || formatDate(payment.date)}
              </Text>
            </View>
            
            {payment.phoneNumber && (
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Phone:</Text>
                <Text style={styles.detailValue}>{payment.phoneNumber}</Text>
              </View>
            )}
            
            {payment.email && (
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Email:</Text>
                <Text style={styles.detailValue}>{payment.email}</Text>
              </View>
            )}
          </View>
          
          <View style={styles.statusContainer}>
            <Text style={styles.statusText}>✅ Completed</Text>
          </View>
        </View>
      ))}

      <TouchableOpacity 
        style={styles.backButton}
        onPress={() => router.push('/DrawerIndex')}
      >
        <Text style={styles.backButtonText}>Go Back</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: 'white',
    padding: 20,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 14,
    color: '#7f8c8d',
  },
  debugText: {
    fontSize: 12,
    color: '#666',
    fontStyle: 'italic',
    marginTop: 5,
  },
  paymentCard: {
    backgroundColor: 'white',
    marginHorizontal: 16,
    marginVertical: 8,
    padding: 16,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  paymentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#ecf0f1',
  },
  paymentMethod: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
  },
  paymentAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#27ae60',
  },
  paymentDetails: {
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  detailLabel: {
    fontSize: 14,
    color: '#7f8c8d',
    fontWeight: '500',
  },
  detailValue: {
    fontSize: 14,
    color: '#2c3e50',
    fontWeight: '400',
  },
  statusContainer: {
    backgroundColor: '#d5f4e6',
    padding: 8,
    borderRadius: 4,
    alignSelf: 'flex-start',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#27ae60',
  },
  emptyText: {
    fontSize: 18,
    textAlign: 'center',
    color: '#7f8c8d',
    marginTop: 100,
    marginBottom: 10,
  },
  emptySubText: {
    fontSize: 14,
    textAlign: 'center',
    color: '#bdc3c7',
    marginHorizontal: 40,
    marginBottom: 30,
  },
  backButton: {
    backgroundColor: '#1B1A31',
    margin: 20,
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  backButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});