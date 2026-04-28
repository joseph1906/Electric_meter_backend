import { moderateScale, verticalScale } from '@/assets/styling/scaling';
import { router, useLocalSearchParams } from 'expo-router';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function PrintPage() {
  // ✅ Get data passed from Billing screen
  const { token, units, amount, method, phoneNumber, transactionId } = useLocalSearchParams();

  // Format token as XXXX-XXXX-XXXX-XXXX
  const formatToken = (t: string) => {
    return String(t).match(/.{1,4}/g)?.join('-') || t;
  };

  if (!token) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>No payment data available.</Text>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.push('/DrawerIndex')}>
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <TouchableOpacity onPress={() => router.push('/DrawerIndex')}>
        <Image
          source={require("@/assets/images/left-arrow.png")}
          style={styles.back}
        />
      </TouchableOpacity>

      <View style={styles.receiptContainer}>
        <Text style={styles.header}>PAYMENT RECEIPT</Text>
        <View style={styles.divider} />

        {/* ✅ Token displayed prominently */}
        <Text style={styles.tokenLabel}>Your Electricity Token:</Text>
        <View style={styles.tokenBox}>
          <Text style={styles.tokenText}>{formatToken(String(token))}</Text>
        </View>

        <Text style={styles.tokenInstruction}>
          Enter this 16-digit code on your electric meter
        </Text>

        <View style={styles.divider} />

        {/* ✅ Units */}
        <View style={styles.unitsBox}>
          <Text style={styles.unitsLabel}>⚡ Units Purchased</Text>
          <Text style={styles.unitsValue}>{Number(units).toFixed(2)} Units</Text>
        </View>

        <View style={styles.divider} />

        {/* Transaction Details */}
        <View style={styles.detailRow}>
          <Text style={styles.label}>Payment Method:</Text>
          <Text style={styles.value}>{method}</Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.label}>Amount Paid:</Text>
          <Text style={styles.amountValue}>
            UGX {Number(amount).toLocaleString()}
          </Text>
        </View>

        {phoneNumber && (
          <View style={styles.detailRow}>
            <Text style={styles.label}>Phone Number:</Text>
            <Text style={styles.value}>{phoneNumber}</Text>
          </View>
        )}

        <View style={styles.detailRow}>
          <Text style={styles.label}>Transaction ID:</Text>
          <Text style={styles.value}>{transactionId}</Text>
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
        onPress={() => router.push('/BillingSystem/HistoryPayment')}>
        <Text style={styles.historyButtonText}>View Payment History</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container:        { flex: 1, backgroundColor: '#f5f5f5' },
  back:             { width: moderateScale(20), height: verticalScale(18), marginTop: 10, marginLeft: 10 },
  receiptContainer: { backgroundColor: 'white', margin: 20, padding: 25, borderRadius: 15, elevation: 3 },
  header:           { fontSize: 24, fontWeight: 'bold', textAlign: 'center', color: '#2c3e50', marginBottom: 10 },
  divider:          { height: 1, backgroundColor: '#ecf0f1', marginVertical: 15 },

  // Token styles
  tokenLabel:       { fontSize: 16, fontWeight: '600', color: '#555', textAlign: 'center', marginBottom: 10 },
  tokenBox:         { backgroundColor: '#1B1A31', borderRadius: 12, padding: 20, alignItems: 'center', marginBottom: 10 },
  tokenText:        { color: '#fff', fontSize: 24, fontWeight: 'bold', letterSpacing: 4 },
  tokenInstruction: { fontSize: 13, color: '#888', textAlign: 'center', marginBottom: 5 },

  // Units styles
  unitsBox:         { alignItems: 'center', paddingVertical: 10 },
  unitsLabel:       { fontSize: 16, color: '#555', marginBottom: 5 },
  unitsValue:       { fontSize: 32, fontWeight: 'bold', color: '#27ae60' },

  // Detail rows
  detailRow:        { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12, paddingVertical: 5 },
  label:            { fontSize: 15, fontWeight: '600', color: '#7f8c8d', flex: 1 },
  value:            { fontSize: 15, fontWeight: '500', color: '#2c3e50', flex: 1, textAlign: 'right' },
  amountValue:      { fontSize: 18, fontWeight: 'bold', color: '#27ae60', flex: 1, textAlign: 'right' },
  statusContainer:  { flexDirection: 'row', justifyContent: 'space-between', backgroundColor: '#d5f4e6', padding: 15, borderRadius: 8, marginVertical: 10 },
  statusLabel:      { fontSize: 16, fontWeight: '600', color: '#27ae60' },
  statusValue:      { fontSize: 16, fontWeight: 'bold', color: '#27ae60' },
  thankYou:         { fontSize: 18, fontWeight: 'bold', textAlign: 'center', color: '#2c3e50', marginVertical: 20, fontStyle: 'italic' },

  errorText:        { fontSize: 18, textAlign: 'center', color: '#e74c3c', marginTop: 50 },
  backButton:       { backgroundColor: '#1B1A31', margin: 20, padding: 15, borderRadius: 8, alignItems: 'center' },
  backButtonText:   { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  historyButton:    { backgroundColor: '#484763', margin: 20, padding: 15, borderRadius: 8, alignItems: 'center' },
  historyButtonText:{ color: '#fff', fontSize: 16, fontWeight: 'bold' },
});