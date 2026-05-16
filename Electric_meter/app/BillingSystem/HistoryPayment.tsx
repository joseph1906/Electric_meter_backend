import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View, ActivityIndicator, RefreshControl, Alert, Platform } from 'react-native';
import { getLoggedInUserId } from '../utils/storage';

export default function HistoryPayment() {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL;

  useEffect(() => {
    fetchTransactionHistory();
  }, []);

  
const markTokenAsUsed = async (transactionId: string) => {
  Alert.alert(
    'Mark as Used',
    'Have you entered this token on your meter?',
    [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Yes, mark as used',
        onPress: async () => {
          try {
            await fetch(`${API_BASE_URL}/api/mark-token-used/${transactionId}`, {
              method: 'PUT',
            });
            // Update locally without refetching
            setTransactions(prev =>
              prev.map(t =>
                t.TransactionID === transactionId
                  ? { ...t, token_used: 1 }
                  : t
              )
            );
          } catch (e) {
            Alert.alert('Error', 'Could not mark token as used.');
          }
        },
      },
    ]
  );
};

  const fetchTransactionHistory = async () => {
    try {
      const userId = await getLoggedInUserId();
      if (!userId) {
        setError('User not logged in. Please login again.');
        setLoading(false);
        return;
      }
      const response = await fetch(`${API_BASE_URL}/api/user-transactions/${userId}`);
      const data = await response.json();
      if (data.success) {
        setTransactions(data.transactions);
        setError(null);
      } else {
        setError(data.message || 'Failed to load transactions');
      }
    } catch (error) {
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

  const performDelete = async (transactionId: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/soft-delete-transaction/${transactionId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      });
      const data = await response.json();
      if (data.success) {
        setTransactions(prev => prev.filter((t: any) => t.TransactionID !== transactionId));
      } else {
        Platform.OS === 'web' ? window.alert('Failed to delete transaction') : Alert.alert('Error', 'Failed to delete transaction');
      }
    } catch (error) {
      Platform.OS === 'web' ? window.alert('Could not connect to server') : Alert.alert('Error', 'Could not connect to server');
    }
  };

  const handleDeleteTransaction = (transactionId: string) => {
    if (Platform.OS === 'web') {
      if (window.confirm('Are you sure you want to remove this transaction?')) performDelete(transactionId);
    } else {
      Alert.alert('Delete Transaction', 'Are you sure you want to remove this transaction from view?', [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', onPress: () => performDelete(transactionId), style: 'destructive' }
      ]);
    }
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
      {/* ✅ Duplicate title removed — only transaction count shown here */}
      <View style={styles.header}>
        <Text style={styles.subtitle}>{transactions.length} transaction(s)</Text>
      </View>

      {transactions.map((transaction) => (
  <View key={transaction.TransactionID} style={styles.paymentCard}>

    {/* EXISTING — keep this */}
    <View style={styles.paymentHeader}>
      <Text style={styles.paymentMethod}>{transaction.Method}</Text>
      <Text style={styles.paymentAmount}>USD {Number(transaction.Amount).toLocaleString()}</Text>
    </View>

    {/* ADD THIS HERE — token box */}
    {transaction.Token && (
      <View style={styles.tokenBox}>
        <View style={styles.tokenHeader}>
          <Text style={styles.tokenLabel}>⚡ Electricity Token</Text>
          {transaction.token_used ? (
            <View style={styles.usedBadge}>
              <Text style={styles.usedBadgeText}>✅ Used</Text>
            </View>
          ) : (
            <TouchableOpacity
              style={styles.markUsedBtn}
              onPress={() => markTokenAsUsed(transaction.TransactionID)}
            >
              <Text style={styles.markUsedText}>Mark as used</Text>
            </TouchableOpacity>
          )}
        </View>
        <Text style={[styles.tokenValue, transaction.token_used && styles.tokenValueUsed]}>
          {String(transaction.Token).match(/.{1,4}/g)?.join('-')}
        </Text>
      </View>
    )}

    {/* EXISTING — keep this */}
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
          <Text style={styles.detailLabel}>Phone:</Text>
          <Text style={styles.detailValue}>{transaction.Phone_number}</Text>
        </View>
      )}
    </View>

    {/* EXISTING — keep this */}
    <View style={styles.actionContainer}>
      <View style={styles.statusContainer}>
        <Text style={styles.statusText}>✅ Completed</Text>
      </View>
      <TouchableOpacity style={styles.deleteButton} onPress={() => handleDeleteTransaction(transaction.TransactionID)}>
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
  tokenBox: {
  backgroundColor: '#1B1A31',
  borderRadius: 10,
  padding: 14,
  alignItems: 'center',
  marginBottom: 12,
},
tokenHeader: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: 8,
},
tokenLabel: {
  color: '#9ca3af',
  fontSize: 11,
  fontWeight: '600',
  textTransform: 'uppercase',
  letterSpacing: 0.5,
},
tokenValue: {
  color: '#fff',
  fontSize: 18,
  fontWeight: 'bold',
  letterSpacing: 4,
  textAlign: 'center',
},
tokenValueUsed: {
  color: '#6b7280',
  textDecorationLine: 'line-through',
},
usedBadge: {
  backgroundColor: 'rgba(39,174,96,0.2)',
  paddingHorizontal: 8,
  paddingVertical: 3,
  borderRadius: 6,
  borderWidth: 1,
  borderColor: 'rgba(39,174,96,0.4)',
},
usedBadgeText: {
  color: '#27ae60',
  fontSize: 11,
  fontWeight: '600',
},
markUsedBtn: {
  backgroundColor: 'rgba(255,255,255,0.1)',
  paddingHorizontal: 8,
  paddingVertical: 3,
  borderRadius: 6,
},
markUsedText: {
  color: '#9ca3af',
  fontSize: 11,
},
});