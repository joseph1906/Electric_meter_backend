import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View, ActivityIndicator, RefreshControl, Alert } from 'react-native';
import { getLoggedInUserId } from '../utils/storage';

export default function HistoryPayment() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  
  const API_BASE_URL = 'http://192.168.1.9:5000';

  useEffect(() => {
    fetchTransactionHistory();
  }, []);

  const fetchTransactionHistory = async () => {
    try {
      const userId = await getLoggedInUserId();
      console.log('Fetching transactions for user ID:', userId);
      
      if (!userId) {
        setError('User not logged in. Please login again.');
        setLoading(false);
        return;
      }
      
      const response = await fetch(`${API_BASE_URL}/api/user-transactions/${userId}`);
      const data = await response.json();
      
      console.log('Transactions received:', data);
      
      if (data.success) {
        setTransactions(data.transactions);
        setError(null);
      } else {
        setError(data.message || 'Failed to load transactions');
      }
    } catch (error) {
      console.error('Error fetching transactions:', error);
      setError('Network error. Could not connect to server.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchTransactionHistory();
  };

  const handleDeleteTransaction = async (transactionId) => {
    Alert.alert(
      'Delete Transaction',
      'Are you sure you want to permanently delete this transaction?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          onPress: async () => {
            try {
              console.log('Deleting transaction:', transactionId);
              
              const response = await fetch(`${API_BASE_URL}/api/delete-transaction/${transactionId}`, {
                method: 'DELETE',
              });
              
              const data = await response.json();
              console.log('Delete response:', data);
              
              if (data.success) {
                // Remove from local state
                setTransactions(prev => prev.filter(t => t.TransactionID !== transactionId));
                Alert.alert('Success', 'Transaction deleted successfully');
              } else {
                Alert.alert('Error', data.message || 'Failed to delete');
              }
            } catch (error) {
              console.error('Delete error:', error);
              Alert.alert('Error', 'Could not connect to server');
            }
          },
          style: 'destructive'
        }
      ]
    );
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#1B1A31" />
        <Text style={styles.loadingText}>Loading transaction history...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>❌ {error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={fetchTransactionHistory}>
          <Text style={styles.retryButtonText}>Try Again</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.backButton} onPress={() => router.push('/DrawerIndex')}>
          <Text style={styles.backButtonText}>Back to Home</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (transactions.length === 0) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.emptyText}>No payment history found</Text>
        <Text style={styles.emptySubText}>Your payment history will appear here after making payments</Text>
        <TouchableOpacity style={styles.backButton} onPress={() => router.push('/DrawerIndex')}>
          <Text style={styles.backButtonText}>Back to Home</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView 
      style={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      <View style={styles.header}>
        <Text style={styles.title}>Payment History</Text>
        <Text style={styles.subtitle}>{transactions.length} transaction(s)</Text>
      </View>

      {transactions.map((transaction) => (
        <View key={transaction.TransactionID} style={styles.paymentCard}>
          <View style={styles.paymentHeader}>
            <Text style={styles.paymentMethod}>{transaction.Method}</Text>
            <Text style={styles.paymentAmount}>UGX {Number(transaction.Amount).toLocaleString()}</Text>
          </View>
          
          <View style={styles.paymentDetails}>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Units:</Text>
              <Text style={styles.detailValue}>{Number(transaction.Unit_purchase).toFixed(2)} units</Text>
            </View>
            
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Transaction ID:</Text>
              <Text style={styles.detailValue}>{transaction.TransactionID}</Text>
            </View>
            
            {transaction.Phone_number && transaction.Phone_number !== 'N/A' && (
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Phone/Card:</Text>
                <Text style={styles.detailValue}>{transaction.Phone_number}</Text>
              </View>
            )}
          </View>
          
          <View style={styles.actionContainer}>
            <View style={styles.statusContainer}>
              <Text style={styles.statusText}>✅ Completed</Text>
            </View>
            
            <TouchableOpacity 
              style={styles.deleteButton}
              onPress={() => handleDeleteTransaction(transaction.TransactionID)}
            >
              <Text style={styles.deleteButtonText}>Delete</Text>
            </TouchableOpacity>
          </View>
        </View>
      ))}
      
      <TouchableOpacity style={styles.backButton} onPress={() => router.push('/DrawerIndex')}>
        <Text style={styles.backButtonText}>Back to Home</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f5f5f5', padding: 20 },
  header: { backgroundColor: 'white', padding: 20, marginBottom: 10, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 2, elevation: 2 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#2c3e50', marginBottom: 5 },
  subtitle: { fontSize: 14, color: '#7f8c8d' },
  paymentCard: { backgroundColor: 'white', marginHorizontal: 16, marginVertical: 8, padding: 16, borderRadius: 8, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 2, elevation: 2 },
  paymentHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12, paddingBottom: 12, borderBottomWidth: 1, borderBottomColor: '#ecf0f1' },
  paymentMethod: { fontSize: 16, fontWeight: '600', color: '#2c3e50' },
  paymentAmount: { fontSize: 18, fontWeight: 'bold', color: '#27ae60' },
  paymentDetails: { marginBottom: 12 },
  detailRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  detailLabel: { fontSize: 14, color: '#7f8c8d', fontWeight: '500' },
  detailValue: { fontSize: 14, color: '#2c3e50', fontWeight: '400' },
  actionContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 },
  statusContainer: { backgroundColor: '#d5f4e6', padding: 8, borderRadius: 4 },
  statusText: { fontSize: 12, fontWeight: '600', color: '#27ae60' },
  deleteButton: { backgroundColor: '#e74c3c', paddingHorizontal: 20, paddingVertical: 8, borderRadius: 6 },
  deleteButtonText: { color: 'white', fontWeight: 'bold', fontSize: 14 },
  emptyText: { fontSize: 18, textAlign: 'center', color: '#7f8c8d', marginBottom: 10 },
  emptySubText: { fontSize: 14, textAlign: 'center', color: '#bdc3c7', marginHorizontal: 40, marginBottom: 30 },
  loadingText: { marginTop: 10, fontSize: 16, color: '#7f8c8d' },
  errorText: { fontSize: 16, textAlign: 'center', color: '#e74c3c', marginBottom: 20 },
  retryButton: { backgroundColor: '#27ae60', paddingHorizontal: 30, paddingVertical: 12, borderRadius: 8, marginBottom: 10 },
  retryButtonText: { color: 'white', fontSize: 16, fontWeight: 'bold' },
  backButton: { backgroundColor: '#1B1A31', paddingHorizontal: 30, paddingVertical: 12, borderRadius: 8, marginTop: 10, marginBottom: 20, marginHorizontal: 16, alignItems: 'center' },
  backButtonText: { color: 'white', fontSize: 16, fontWeight: 'bold' },
});