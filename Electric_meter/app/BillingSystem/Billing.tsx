import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator, Alert, Image, Modal,
  ScrollView, StyleSheet, Text,
  TextInput, TouchableOpacity, View
} from 'react-native';

const API_URL = process.env.EXPO_PUBLIC_API_URL;
// ✅ Add your free API key here
const EXCHANGE_API_KEY = process.env.EXPO_PUBLIC_EXCHANGE_API_KEY;

type PaymentMethod = 'MTN' | 'Airtel' | null;
type Currency = 'USD' | 'CDF';

export default function Billing() {
  const [amount, setAmount] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>(null);
  const [currency, setCurrency] = useState<Currency>('USD');
  const [loading, setLoading] = useState(false);

  // ✅ Live exchange rate state
  const [exchangeRate, setExchangeRate] = useState<number>(2800); // fallback rate
  const [rateLoading, setRateLoading] = useState(false);
  const [rateError, setRateError] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<string>('');

  const [showPaymentPopup, setShowPaymentPopup] = useState(false);
  const [showTokenPopup, setShowTokenPopup] = useState(false);

  const [generatedToken, setGeneratedToken] = useState('');
  const [generatedUnits, setGeneratedUnits] = useState('');
  const [transactionId, setTransactionId] = useState('');

  // ✅ Fetch live rate on component mount
  useEffect(() => {
    fetchExchangeRate();
  }, []);

  const fetchExchangeRate = async () => {
    setRateLoading(true);
    setRateError(false);

    try {
      // ====================================================
      // Option 1 — ExchangeRate-API (Free — 1500/month)
      // Sign up at exchangerate-api.com to get key
      // ====================================================
      const response = await fetch(
        `https://v6.exchangerate-api.com/v6/${EXCHANGE_API_KEY}/pair/USD/CDF`
      );
      const data = await response.json();

      if (data.result === 'success') {
        setExchangeRate(data.conversion_rate);
        setLastUpdated(new Date().toLocaleTimeString());
        console.log('✅ Live rate fetched: 1 USD =', data.conversion_rate, 'CDF');
      } else {
        throw new Error('Rate fetch failed');
      }

    } catch (error) {
      console.log('⚠️ Rate fetch failed, using fallback:', exchangeRate);
      setRateError(true);

      // ====================================================
      // Option 2 — Fallback: fetch from your own backend
      // Uncomment this if you want to cache rates server-side
      //
      // try {
      //   const backupResponse = await fetch(`${API_URL}/api/exchange-rate`);
      //   const backupData = await backupResponse.json();
      //   if (backupData.success) {
      //     setExchangeRate(backupData.rate);
      //     setLastUpdated(new Date().toLocaleTimeString());
      //   }
      // } catch (e) {
      //   console.log('Backup rate also failed, using hardcoded fallback');
      // }
      // ====================================================
    } finally {
      setRateLoading(false);
    }
  };

  const getAmountInUSD = () => {
    const num = parseFloat(amount);
    if (currency === 'USD') return num;
    return num / exchangeRate;
  };

  const formatAmount = (value: string | number) => {
    const num = parseFloat(String(value));
    if (isNaN(num)) return '';
    if (currency === 'USD') return `$${num.toFixed(2)}`;
    return `${num.toLocaleString()} FC`;
  };

  const quickAmounts = currency === 'USD'
    ? ['1', '5', '10', '20']
    : [
        Math.round(exchangeRate * 1).toString(),
        Math.round(exchangeRate * 5).toString(),
        Math.round(exchangeRate * 10).toString(),
        Math.round(exchangeRate * 20).toString(),
      ];

  const handleBuyNow = () => {
    const num = parseFloat(amount);
    const minAmount = currency === 'USD' ? 1 : exchangeRate;

    if (!amount || num < minAmount) {
      Alert.alert(
        'Error',
        `Minimum amount is ${currency === 'USD' ? '$1' : `${Math.round(exchangeRate).toLocaleString()} FC`}`
      );
      return;
    }
    if (!selectedMethod) {
      Alert.alert('Error', 'Please select a payment method');
      return;
    }
    setShowPaymentPopup(true);
  };

  const handlePaymentSubmit = async () => {
    if (!phoneNumber || phoneNumber.length < 10) {
      Alert.alert('Error', 'Please enter a valid phone number');
      return;
    }

    setLoading(true);
    setShowPaymentPopup(false);

    try {
      const stored = await AsyncStorage.getItem('user');
      const user = stored ? JSON.parse(stored) : null;
      const amountInUSD = getAmountInUSD();

      const paymentResponse = await fetch(`${API_URL}/api/process-payment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phoneNumber,
          amount: parseFloat(amount),
          amountUSD: amountInUSD,
          currency,
          method: selectedMethod,
          userId: user?.id,
        }),
      });

      const paymentData = await paymentResponse.json();
      if (!paymentData.success) {
        Alert.alert('Payment Failed', paymentData.message);
        setLoading(false);
        return;
      }

      const tokenResponse = await fetch(`${API_URL}/api/generate-electricity-token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          meterNumber: user?.MeterNumber,
          amount: amountInUSD,
          currency,
          userId: user?.id,
        }),
      });

      const tokenData = await tokenResponse.json();
      if (!tokenData.success) {
        Alert.alert('Token Error', tokenData.message);
        setLoading(false);
        return;
      }

      setGeneratedToken(tokenData.token);
      setGeneratedUnits(tokenData.units);
      setTransactionId(tokenData.transactionId);
      setShowTokenPopup(true);

    } catch (error) {
      Alert.alert('Error', 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleViewReceipt = () => {
    setShowTokenPopup(false);
    router.push({
      pathname: '/BillingSystem/Printable',
      params: {
        token: generatedToken,
        units: generatedUnits,
        amount: amount,
        currency: currency,
        exchangeRate: exchangeRate.toString(),
        method: selectedMethod,
        phoneNumber: phoneNumber,
        transactionId: transactionId,
      }
    });
  };

  const formatToken = (token: string) =>
    token.match(/.{1,4}/g)?.join('-') || token;

  return (
    <ScrollView style={styles.container}>

      <Text style={styles.title}>Buy Electricity</Text>

      {/* ✅ Live Exchange Rate Banner */}
      <View style={[styles.rateBanner, rateError && styles.rateBannerError]}>
        {rateLoading ? (
          <View style={styles.rateRow}>
            <ActivityIndicator size="small" color="#fff" />
            <Text style={styles.rateText}>  Fetching live rate...</Text>
          </View>
        ) : (
          <View style={styles.rateRow}>
            <Text style={styles.rateText}>
              💱 1 USD = {exchangeRate.toLocaleString()} FC
              {rateError ? ' (offline rate)' : ' (live)'}
            </Text>
            <TouchableOpacity onPress={fetchExchangeRate} style={styles.refreshBtn}>
              <Text style={styles.refreshText}>🔄</Text>
            </TouchableOpacity>
          </View>
        )}
        {lastUpdated && !rateError && (
          <Text style={styles.rateUpdated}>Updated: {lastUpdated}</Text>
        )}
      </View>

      {/* Currency Selector */}
      <View style={styles.card}>
        <Text style={styles.label}>Select Currency</Text>
        <View style={styles.currencyRow}>
          <TouchableOpacity
            style={[styles.currencyBtn, currency === 'USD' && styles.currencyBtnActive]}
            onPress={() => { setCurrency('USD'); setAmount(''); }}>
            <Text style={[styles.currencyText, currency === 'USD' && styles.currencyTextActive]}>
              🇺🇸 USD ($)
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.currencyBtn, currency === 'CDF' && styles.currencyBtnActive]}
            onPress={() => { setCurrency('CDF'); setAmount(''); }}>
            <Text style={[styles.currencyText, currency === 'CDF' && styles.currencyTextActive]}>
              🇨🇩 CDF (FC)
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Amount Input */}
      <View style={styles.card}>
        <Text style={styles.label}>
          Amount ({currency === 'USD' ? 'USD $' : 'Franc Congolais FC'})
        </Text>
        <View style={styles.inputRow}>
          <Text style={styles.currencySymbol}>
            {currency === 'USD' ? '$' : 'FC'}
          </Text>
          <TextInput
            style={styles.input}
            placeholder={currency === 'USD' ? 'e.g 5.00' : 'e.g 14000'}
            keyboardType="numeric"
            value={amount}
            onChangeText={setAmount}
          />
        </View>

        {/* Quick amounts — auto calculated from live rate */}
        <View style={styles.quickAmounts}>
          {quickAmounts.map((val, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.quickBtn, amount === val && styles.quickBtnActive]}
              onPress={() => setAmount(val)}>
              <Text style={[styles.quickBtnText, amount === val && styles.quickBtnTextActive]}>
                {currency === 'USD'
                  ? `$${val}`
                  : `${parseInt(val).toLocaleString()} FC`
                }
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Live conversion */}
        {amount && parseFloat(amount) > 0 && (
          <View style={styles.conversionBox}>
            <Text style={styles.conversionText}>
              {currency === 'CDF'
                ? `≈ $${(parseFloat(amount) / exchangeRate).toFixed(2)} USD`
                : `≈ ${(parseFloat(amount) * exchangeRate).toLocaleString()} FC`
              }
            </Text>
            <Text style={styles.conversionRate}>
              Rate: 1 USD = {exchangeRate.toLocaleString()} FC
            </Text>
          </View>
        )}
      </View>

      {/* Payment Method */}
      <View style={styles.card}>
        <Text style={styles.label}>Payment Method</Text>
        <TouchableOpacity
          style={[styles.methodBtn, selectedMethod === 'MTN' && styles.methodBtnActive]}
          onPress={() => setSelectedMethod('MTN')}>
          <Text style={styles.methodText}>📱 MTN Mobile Money</Text>
          {selectedMethod === 'MTN' && <Text style={styles.checkmark}>✓</Text>}
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.methodBtn, selectedMethod === 'Airtel' && styles.methodBtnActive]}
          onPress={() => setSelectedMethod('Airtel')}>
          <Text style={styles.methodText}>📱 Airtel Money</Text>
          {selectedMethod === 'Airtel' && <Text style={styles.checkmark}>✓</Text>}
        </TouchableOpacity>
      </View>

      {/* Units Preview */}
      {amount && parseFloat(amount) > 0 && (
        <View style={styles.previewCard}>
          <Text style={styles.previewLabel}>You will get approximately:</Text>
          <Text style={styles.previewUnits}>
            {(getAmountInUSD() / 0.5).toFixed(2)} Units
          </Text>
          <Text style={styles.previewNote}>
            * Final units determined by electricity provider
          </Text>
          <View style={styles.previewDivider} />
          <Text style={styles.previewSummary}>
            Paying: {formatAmount(amount)}
          </Text>
        </View>
      )}

      {/* Buy Button */}
      <TouchableOpacity
        style={[styles.buyBtn, loading && styles.buyBtnDisabled]}
        onPress={handleBuyNow}
        disabled={loading}>
        {loading ? (
          <View style={styles.loadingRow}>
            <ActivityIndicator color="#fff" size="small" />
            <Text style={styles.loadingText}>Processing...</Text>
          </View>
        ) : (
          <Text style={styles.buyBtnText}>
            Buy Now {amount ? `— ${formatAmount(amount)}` : ''}
          </Text>
        )}
      </TouchableOpacity>

      {/* POPUP 1 — Confirm Payment */}
      <Modal visible={showPaymentPopup} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>Confirm Payment</Text>

            <View style={styles.summaryBox}>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Amount:</Text>
                <Text style={styles.summaryValue}>{formatAmount(amount)}</Text>
              </View>
              {currency === 'CDF' && (
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>In USD:</Text>
                  <Text style={styles.summaryValue}>
                    ${getAmountInUSD().toFixed(2)}
                  </Text>
                </View>
              )}
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Rate:</Text>
                <Text style={styles.summaryValue}>
                  1 USD = {exchangeRate.toLocaleString()} FC
                </Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Method:</Text>
                <Text style={styles.summaryValue}>{selectedMethod}</Text>
              </View>
            </View>

            <Text style={styles.modalSubtitle}>
              Enter your {selectedMethod} number:
            </Text>

            <TextInput
              style={styles.modalInput}
              placeholder="e.g 0771234567"
              keyboardType="phone-pad"
              value={phoneNumber}
              onChangeText={setPhoneNumber}
              maxLength={12}
            />

            <Text style={styles.modalNote}>
              ⚠️ You will receive a prompt on your phone to confirm payment
            </Text>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.modalCancelBtn}
                onPress={() => setShowPaymentPopup(false)}>
                <Text style={styles.modalCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalConfirmBtn}
                onPress={handlePaymentSubmit}>
                <Text style={styles.modalConfirmText}>Confirm & Pay</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* POPUP 2 — Token */}
      <Modal visible={showTokenPopup} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.successIcon}>✅</Text>
            <Text style={styles.modalTitle}>Payment Successful!</Text>
            <Text style={styles.modalSubtitle}>Your electricity token:</Text>

            <View style={styles.tokenBox}>
              <Text style={styles.tokenText}>{formatToken(generatedToken)}</Text>
            </View>

            <Text style={styles.unitsText}>⚡ {generatedUnits} Units</Text>
            <Text style={styles.tokenInstruction}>
              Enter this code on your electric meter
            </Text>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.modalCancelBtn}
                onPress={() => setShowTokenPopup(false)}>
                <Text style={styles.modalCancelText}>Close</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalConfirmBtn}
                onPress={handleViewReceipt}>
                <Text style={styles.modalConfirmText}>View Receipt</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container:          { flex: 1, backgroundColor: '#f5f5f5' },
  back:               { width: 20, height: 18, marginTop: 15, marginLeft: 15 },
  title:              { fontSize: 24, fontWeight: 'bold', color: '#1B1A31', textAlign: 'center', marginVertical: 20 },
  card:               { backgroundColor: '#fff', margin: 15, padding: 20, borderRadius: 12, elevation: 2 },
  label:              { fontSize: 16, fontWeight: '600', color: '#333', marginBottom: 10 },

  // Rate banner
  rateBanner:         { backgroundColor: '#1B1A31', margin: 15, padding: 12, borderRadius: 10 },
  rateBannerError:    { backgroundColor: '#e67e22' },
  rateRow:            { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  rateText:           { color: '#fff', fontSize: 14, fontWeight: '600' },
  rateUpdated:        { color: '#aaa', fontSize: 11, marginTop: 4 },
  refreshBtn:         { padding: 4 },
  refreshText:        { fontSize: 18 },

  // Currency
  currencyRow:        { flexDirection: 'row', gap: 10 },
  currencyBtn:        { flex: 1, borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 12, alignItems: 'center' },
  currencyBtnActive:  { borderColor: '#1B1A31', backgroundColor: '#1B1A31' },
  currencyText:       { fontSize: 15, fontWeight: '600', color: '#333' },
  currencyTextActive: { color: '#fff' },

  // Amount
  inputRow:           { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#ddd', borderRadius: 8, paddingHorizontal: 12 },
  currencySymbol:     { fontSize: 18, fontWeight: 'bold', color: '#333', marginRight: 8 },
  input:              { flex: 1, padding: 12, fontSize: 18, color: '#333' },
  quickAmounts:       { flexDirection: 'row', justifyContent: 'space-between', marginTop: 12, flexWrap: 'wrap', gap: 8 },
  quickBtn:           { borderWidth: 1, borderColor: '#484763', borderRadius: 8, paddingVertical: 8, paddingHorizontal: 10 },
  quickBtnActive:     { backgroundColor: '#484763' },
  quickBtnText:       { color: '#484763', fontSize: 12, fontWeight: '600' },
  quickBtnTextActive: { color: '#fff' },
  conversionBox:      { marginTop: 10, alignItems: 'flex-end' },
  conversionText:     { fontSize: 14, color: '#484763', fontWeight: '600' },
  conversionRate:     { fontSize: 11, color: '#888' },

  // Method
  methodBtn:          { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 15, marginBottom: 8 },
  methodBtnActive:    { borderColor: '#484763', backgroundColor: '#f0f0ff' },
  methodText:         { fontSize: 16, color: '#333' },
  checkmark:          { fontSize: 18, color: '#484763', fontWeight: 'bold' },

  // Preview
  previewCard:        { backgroundColor: '#e8f5e9', margin: 15, padding: 20, borderRadius: 12, alignItems: 'center' },
  previewLabel:       { fontSize: 14, color: '#555' },
  previewUnits:       { fontSize: 32, fontWeight: 'bold', color: '#27ae60', marginVertical: 8 },
  previewNote:        { fontSize: 11, color: '#888', textAlign: 'center' },
  previewDivider:     { height: 1, backgroundColor: '#c8e6c9', width: '100%', marginVertical: 10 },
  previewSummary:     { fontSize: 14, fontWeight: '600', color: '#2c3e50' },

  // Buy button
  buyBtn:             { backgroundColor: '#1B1A31', margin: 15, padding: 18, borderRadius: 12, alignItems: 'center' },
  buyBtnDisabled:     { opacity: 0.6 },
  buyBtnText:         { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  loadingRow:         { flexDirection: 'row', alignItems: 'center', gap: 10 },
  loadingText:        { color: '#fff', fontSize: 16 },

  // Modal
  modalOverlay:       { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  modalBox:           { backgroundColor: '#fff', borderRadius: 16, padding: 25, width: '88%', alignItems: 'center' },
  modalTitle:         { fontSize: 20, fontWeight: 'bold', color: '#1B1A31', marginBottom: 8, textAlign: 'center' },
  modalSubtitle:      { fontSize: 14, color: '#666', textAlign: 'center', marginBottom: 15 },
  summaryBox:         { backgroundColor: '#f5f5f5', borderRadius: 8, padding: 15, width: '100%', marginBottom: 15 },
  summaryRow:         { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  summaryLabel:       { fontSize: 14, color: '#666' },
  summaryValue:       { fontSize: 14, fontWeight: 'bold', color: '#1B1A31' },
  modalInput:         { borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 12, fontSize: 18, width: '100%', textAlign: 'center', letterSpacing: 2 },
  modalNote:          { fontSize: 12, color: '#e67e22', textAlign: 'center', marginTop: 10, marginBottom: 15 },
  modalButtons:       { flexDirection: 'row', gap: 10, marginTop: 15, width: '100%' },
  modalCancelBtn:     { flex: 1, borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 12, alignItems: 'center' },
  modalCancelText:    { color: '#666', fontWeight: '600' },
  modalConfirmBtn:    { flex: 1, backgroundColor: '#1B1A31', borderRadius: 8, padding: 12, alignItems: 'center' },
  modalConfirmText:   { color: '#fff', fontWeight: '600' },
  successIcon:        { fontSize: 40, marginBottom: 10 },
  tokenBox:           { backgroundColor: '#1B1A31', borderRadius: 12, padding: 20, marginVertical: 15, width: '100%', alignItems: 'center' },
  tokenText:          { color: '#fff', fontSize: 22, fontWeight: 'bold', letterSpacing: 4 },
  unitsText:          { fontSize: 20, fontWeight: 'bold', color: '#27ae60', marginBottom: 10 },
  tokenInstruction:   { fontSize: 13, color: '#666', textAlign: 'center', marginBottom: 10 },
});