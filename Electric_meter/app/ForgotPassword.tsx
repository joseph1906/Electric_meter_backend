import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  ActivityIndicator, StyleSheet, Text,
  TextInput, TouchableOpacity, View, ScrollView
} from 'react-native';
import axios from 'axios';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const API_BASE_URL = 'http://192.168.1.3:5000';

  const handleSendOTP = async () => {
    if (!email.trim()) {
      setErrorMessage('Please enter your email address');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setErrorMessage('Please enter a valid email address');
      return;
    }

    setLoading(true);
    setErrorMessage('');

    try {
      const response = await axios.post(`${API_BASE_URL}/api/forgot-password`, {
        email: email.trim().toLowerCase()
      });

      if (response.data.success) {
        setSuccessMessage('Reset code sent! Check your email.');
        setTimeout(() => {
          router.push({
            pathname: '/ResetPassword',
            params: { email: email.trim().toLowerCase() }
          });
        }, 1500);
      }
    } catch (error: any) {
      const msg = error.response?.data?.message || 'Failed to send reset code. Please try again.';
      setErrorMessage(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Forgot Password</Text>
      <Text style={styles.subtitle}>
        Enter your email address and we will send you a code to reset your password.
      </Text>

      {errorMessage !== '' && (
        <View style={styles.errorBox}>
          <Text style={styles.errorText}>⚠️ {errorMessage}</Text>
        </View>
      )}

      {successMessage !== '' && (
        <View style={styles.successBox}>
          <Text style={styles.successText}>✅ {successMessage}</Text>
        </View>
      )}

      <TextInput
        placeholder="Email Address"
        placeholderTextColor="#999"
        style={styles.input}
        value={email}
        onChangeText={(text) => { setEmail(text); setErrorMessage(''); }}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TouchableOpacity
        style={[styles.button, loading && styles.disabledBtn]}
        onPress={handleSendOTP}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" size="small" />
        ) : (
          <Text style={styles.buttonText}>Send Reset Code</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push('/LoginForm')}>
        <Text style={styles.backToLogin}>← Back to Login</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1B1A31' },
  content: { padding: 30, justifyContent: 'center', flexGrow: 1 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#fff', textAlign: 'center', marginBottom: 10 },
  subtitle: { fontSize: 15, color: '#d9d9d9', textAlign: 'center', marginBottom: 30, lineHeight: 22 },
  input: { borderWidth: 1, borderColor: '#484763', backgroundColor: '#fff', padding: 15, marginBottom: 20, color: '#000', borderRadius: 8, fontSize: 15 },
  button: { backgroundColor: '#484763', padding: 15, borderRadius: 8, alignItems: 'center', marginBottom: 20 },
  buttonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  disabledBtn: { opacity: 0.7 },
  backToLogin: { color: '#81b0ff', textAlign: 'center', fontSize: 14, marginTop: 10 },
  errorBox: { backgroundColor: '#ff4444', padding: 12, borderRadius: 5, marginBottom: 15 },
  errorText: { color: '#fff', fontSize: 14, fontWeight: 'bold', textAlign: 'center' },
  successBox: { backgroundColor: '#27ae60', padding: 12, borderRadius: 5, marginBottom: 15 },
  successText: { color: '#fff', fontSize: 14, fontWeight: 'bold', textAlign: 'center' },
});