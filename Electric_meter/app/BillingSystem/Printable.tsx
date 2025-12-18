import { moderateScale, verticalScale } from '@/assets/styling/scaling';
import { router } from 'expo-router';
import { useEffect } from 'react';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { usePaymentContext } from './CentralPayment';

export default function PrintPage() {
  const { lastPayment, addPaymentToHistory } = usePaymentContext();

  useEffect(() => {
    console.log('PrintPage mounted - lastPayment:', lastPayment);
    
    if (lastPayment) {
      console.log('Adding payment to history:', lastPayment);
      addPaymentToHistory(lastPayment);
    } else {
      console.log('No lastPayment found to add to history');
    }
  }, [lastPayment, addPaymentToHistory]);
  

  if (!lastPayment) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>No payment data available.</Text>
        <Text style={styles.subText}>Please complete a payment first.</Text>
      </View>
    );
  }

  const handleBack = () => {}

  const formattedAmount = lastPayment.amount.toLocaleString();
  const formattedUnits = lastPayment.units.toFixed(2);

  return (
    <ScrollView style={styles.container}>
      <TouchableOpacity onPress={handleBack}>
           <Image source={require("@/assets/images/left-arrow.png")}
        style={styles.back}/>
      </TouchableOpacity>
      <View style={styles.receiptContainer}>
        <Text style={styles.header}>PAYMENT RECEIPT</Text>
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
          <Text style={styles.label}>Transaction ID:</Text>
          <Text style={styles.value}>TXN{Math.random().toString(36).substr(2, 9).toUpperCase()}</Text>
        </View>

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
  MainConatiner: {backgroundColor: "#f5f5f5"},

  container: { 
    flex: 1, 
    backgroundColor: '#f5f5f5' 
  },

  back: {
    width: moderateScale(20),
    height: verticalScale(18)
  },

  receiptContainer: { 
    backgroundColor: 'white', 
    margin: 20, padding: 25, 
    borderRadius: 15, 
    shadowColor: '#000', 
    shadowOffset: { 
      width: 0, 
      height: 2 
    }, 
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
   
});