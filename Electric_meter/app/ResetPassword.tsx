import { router, useLocalSearchParams } from 'expo-router';
import React, { useState, useRef, useEffect } from 'react';
import {
  ActivityIndicator, StyleSheet, Text, TextInput,
  TouchableOpacity, View, ScrollView
} from 'react-native';
import axios from 'axios';

export default function ResetPassword() {
  const { email } = useLocalSearchParams();
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [countdown, setCountdown] = useState(600);
  const [otpVerified, setOtpVerified] = useState(false);
  const inputs = useRef<TextInput[]>([]);

  const API_BASE_URL = 'http://192.168.1.3:5000';

  // Countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 0) { clearInterval(timer); return 0; }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const handleOtpChange = (value: string, index: number) => {
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setErrorMessage('');
    if (value && index < 5) {
      inputs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
      inputs.current[index - 1]?.focus();
    }
  };

  const handleVerifyOTP = async () => {
    const otpCode = otp.join('');

    if (otpCode.length !== 6) {
      setErrorMessage('Please enter all 6 digits');
      return;
    }

    if (countdown === 0) {
      setErrorMessage('OTP has expired. Please request a new one.');
      return;
    }

    setLoading(true);
    setErrorMessage('');

    try {
      const response = await axios.post(`${API_BASE_URL}/api/verify-reset-otp`, {
        email: email,
        otp: otpCode
      });

      if (response.data.success) {
        setOtpVerified(true);
        setSuccessMessage('OTP verified! Now enter your new password.');
      }
    } catch (error: any) {
      const msg = error.response?.data?.message || 'Verification failed. Please try again.';
      setErrorMessage(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!newPassword) {
      setErrorMessage('Please enter a new password');
      return;
    }

    if (newPassword.length < 6) {
      setErrorMessage('Password must be at least 6 characters');
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMessage('Passwords do not match');
      return;
    }

    setLoading(true);
    setErrorMessage('');

    try {
      const response = await axios.post(`${API_BASE_URL}/api/reset-password`, {
        email: email,
        otp: otp.join(''),
        newPassword: newPassword
      });

      if (response.data.success) {
        setSuccessMessage('✅ Password reset successfully!');
        setTimeout(() => {
          router.push('/LoginForm');
        }, 2000);
      }
    } catch (error: any) {
      const msg = error.response?.data?.message || 'Reset failed. Please try again.';
      setErrorMessage(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setResending(true);
    setErrorMessage('');

    try {
      const response = await axios.post(`${API_BASE_URL}/api/forgot-password`, {
        email: email
      });

      if (response.data.success) {
        setCountdown(600);
        setOtp(['', '', '', '', '', '']);
        setOtpVerified(false);
        setSuccessMessage('New reset code sent to your email!');
        setTimeout(() => setSuccessMessage(''), 3000);
        inputs.current[0]?.focus();
      }
    } catch (error: any) {
      const msg = error.response?.data?.message || 'Failed to resend. Please try again.';
      setErrorMessage(msg);
    } finally {
      setResending(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Reset Password</Text>
      <Text style={styles.subtitle}>Enter the code sent to:</Text>
      <Text style={styles.email}>{email}</Text>

      {errorMessage !== '' && (
        <View style={styles.errorBox}>
          <Text style={styles.errorText}>⚠️ {errorMessage}</Text>
        </View>
      )}

      {successMessage !== '' && (
        <View style={styles.successBox}>
          <Text style={styles.successText}>{successMessage}</Text>
        </View>
      )}

      {/* OTP Input */}
      <View style={styles.otpContainer}>
        {otp.map((digit, index) => (
          <TextInput
            key={index}
            ref={(ref) => { if (ref) inputs.current[index] = ref; }}
            style={[styles.otpInput, digit ? styles.otpInputFilled : null, otpVerified ? styles.otpVerified : null]}
            value={digit}
            onChangeText={(value) => handleOtpChange(value.replace(/[^0-9]/g, ''), index)}
            onKeyPress={(e) => handleKeyPress(e, index)}
            keyboardType="numeric"
            maxLength={1}
            textAlign="center"
            editable={!otpVerified}
          />
        ))}
      </View>

      {/* Timer */}
      {!otpVerified && (
        <Text style={[styles.timer, countdown < 60 ? styles.timerRed : null]}>
          {countdown > 0 ? `Code expires in: ${formatTime(countdown)}` : '⚠️ Code has expired'}
        </Text>
      )}

      {/* Verify OTP Button */}
      {!otpVerified && (
        <TouchableOpacity
          style={[styles.button, loading && styles.disabledBtn]}
          onPress={handleVerifyOTP}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <Text style={styles.buttonText}>Verify Code</Text>
          )}
        </TouchableOpacity>
      )}

      {/* New Password Fields - shown after OTP verified */}
      {otpVerified && (
        <View>
          <Text style={styles.passwordLabel}>Enter New Password:</Text>
          <TextInput
            placeholder="New Password (min 6 characters)"
            placeholderTextColor="#999"
            style={styles.input}
            value={newPassword}
            onChangeText={(text) => { setNewPassword(text); setErrorMessage(''); }}
            secureTextEntry
          />
          <TextInput
            placeholder="Confirm New Password"
            placeholderTextColor="#999"
            style={styles.input}
            value={confirmPassword}
            onChangeText={(text) => { setConfirmPassword(text); setErrorMessage(''); }}
            secureTextEntry
          />

          <TouchableOpacity
            style={[styles.button, loading && styles.disabledBtn]}
            onPress={handleResetPassword}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <Text style={styles.buttonText}>Reset Password</Text>
            )}
          </TouchableOpacity>
        </View>
      )}

      {/* Resend Button */}
      {!otpVerified && (
        <TouchableOpacity
          style={[styles.resendButton, resending && styles.disabledBtn]}
          onPress={handleResend}
          disabled={resending}
        >
          {resending ? (
            <ActivityIndicator color="#d9d9d9" size="small" />
          ) : (
            <Text style={styles.resendButtonText}>Resend Code</Text>
          )}
        </TouchableOpacity>
      )}

      <TouchableOpacity onPress={() => router.push('/LoginForm')}>
        <Text style={styles.backToLogin}>← Back to Login</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1B1A31' },
  content: { padding: 30, flexGrow: 1, justifyContent: 'center' },
  title: { fontSize: 28, fontWeight: 'bold', color: '#fff', textAlign: 'center', marginBottom: 10 },
  subtitle: { fontSize: 16, color: '#d9d9d9', textAlign: 'center', marginBottom: 5 },
  email: { fontSize: 16, color: '#81b0ff', textAlign: 'center', fontWeight: 'bold', marginBottom: 30 },
  otpContainer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  otpInput: { width: 48, height: 60, borderWidth: 2, borderColor: '#484763', borderRadius: 10, fontSize: 24, fontWeight: 'bold', color: '#fff', backgroundColor: '#2a2a4a', textAlign: 'center' },
  otpInputFilled: { borderColor: '#81b0ff', backgroundColor: '#353568' },
  otpVerified: { borderColor: '#27ae60', backgroundColor: '#1a3a2a' },
  timer: { fontSize: 14, color: '#d9d9d9', textAlign: 'center', marginBottom: 20 },
  timerRed: { color: '#ff4444' },
  passwordLabel: { fontSize: 16, color: '#d9d9d9', marginBottom: 10, fontWeight: 'bold' },
  input: { borderWidth: 1, borderColor: '#484763', backgroundColor: '#fff', padding: 15, marginBottom: 15, color: '#000', borderRadius: 8, fontSize: 15 },
  button: { backgroundColor: '#484763', padding: 15, borderRadius: 8, alignItems: 'center', marginBottom: 15 },
  buttonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  resendButton: { backgroundColor: 'transparent', padding: 15, borderRadius: 8, alignItems: 'center', borderWidth: 1, borderColor: '#484763', marginBottom: 20 },
  resendButtonText: { color: '#d9d9d9', fontSize: 16 },
  backToLogin: { color: '#81b0ff', textAlign: 'center', fontSize: 14, marginTop: 10 },
  disabledBtn: { opacity: 0.7 },
  errorBox: { backgroundColor: '#ff4444', padding: 12, borderRadius: 5, marginBottom: 15 },
  errorText: { color: '#fff', fontSize: 14, fontWeight: 'bold', textAlign: 'center' },
  successBox: { backgroundColor: '#27ae60', padding: 12, borderRadius: 5, marginBottom: 15 },
  successText: { color: '#fff', fontSize: 14, fontWeight: 'bold', textAlign: 'center' },
});