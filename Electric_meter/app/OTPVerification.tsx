import { router, useLocalSearchParams } from 'expo-router';
import React, { useState, useRef, useEffect } from 'react';
import {
  ActivityIndicator, StyleSheet, Text,
  TextInput, TouchableOpacity, View, Alert, Platform
} from 'react-native';
import axios from 'axios';

export default function OTPVerification() {
  const { email } = useLocalSearchParams();
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [countdown, setCountdown] = useState(600); // 10 minutes
  const inputs = useRef<TextInput[]>([]);

  const API_BASE_URL = 'http://192.168.1.2:5000';

  // Countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 0) {
          clearInterval(timer);
          return 0;
        }
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

    // Auto move to next input
    if (value && index < 5) {
      inputs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
      inputs.current[index - 1]?.focus();
    }
  };

  const handleVerify = async () => {
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
      const response = await axios.post(`${API_BASE_URL}/api/verify-otp`, {
        email: email,
        otp: otpCode
      });

      if (response.data.success) {
        setSuccessMessage('✅ Email verified successfully!');
        setTimeout(() => {
          router.push('/LoginForm');
        }, 2000);
      }
    } catch (error: any) {
      const msg = error.response?.data?.message || 'Verification failed. Please try again.';
      setErrorMessage(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setResending(true);
    setErrorMessage('');

    try {
      const response = await axios.post(`${API_BASE_URL}/api/resend-otp`, {
        email: email
      });

      if (response.data.success) {
        setCountdown(600);
        setOtp(['', '', '', '', '', '']);
        setSuccessMessage('New verification code sent to your email!');
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
    <View style={styles.container}>
      <Text style={styles.title}>Verify Your Email</Text>
      <Text style={styles.subtitle}>
        We sent a 6-digit code to:
      </Text>
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

      {/* OTP Input Boxes */}
      <View style={styles.otpContainer}>
        {otp.map((digit, index) => (
          <TextInput
            key={index}
            ref={(ref) => { if (ref) inputs.current[index] = ref; }}
            style={[styles.otpInput, digit ? styles.otpInputFilled : null]}
            value={digit}
            onChangeText={(value) => handleOtpChange(value.replace(/[^0-9]/g, ''), index)}
            onKeyPress={(e) => handleKeyPress(e, index)}
            keyboardType="numeric"
            maxLength={1}
            textAlign="center"
          />
        ))}
      </View>

      {/* Timer */}
      <Text style={[styles.timer, countdown < 60 ? styles.timerRed : null]}>
        {countdown > 0 ? `Code expires in: ${formatTime(countdown)}` : '⚠️ Code has expired'}
      </Text>

      {/* Verify Button */}
      <TouchableOpacity
        style={[styles.verifyButton, loading && styles.disabledBtn]}
        onPress={handleVerify}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" size="small" />
        ) : (
          <Text style={styles.verifyButtonText}>Verify Email</Text>
        )}
      </TouchableOpacity>

      {/* Resend Button */}
      <TouchableOpacity
        style={[styles.resendButton, resending && styles.disabledBtn]}
        onPress={handleResend}
        disabled={resending}
      >
        {resending ? (
          <ActivityIndicator color="#484763" size="small" />
        ) : (
          <Text style={styles.resendButtonText}>Resend Code</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push('/LoginForm')}>
        <Text style={styles.backToLogin}>← Back to Login</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1B1A31', padding: 30, justifyContent: 'center' },
  title: { fontSize: 28, fontWeight: 'bold', color: '#fff', textAlign: 'center', marginBottom: 10 },
  subtitle: { fontSize: 16, color: '#d9d9d9', textAlign: 'center', marginBottom: 5 },
  email: { fontSize: 16, color: '#81b0ff', textAlign: 'center', fontWeight: 'bold', marginBottom: 30 },
  otpContainer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  otpInput: { width: 48, height: 60, borderWidth: 2, borderColor: '#484763', borderRadius: 10, fontSize: 24, fontWeight: 'bold', color: '#fff', backgroundColor: '#2a2a4a', textAlign: 'center' },
  otpInputFilled: { borderColor: '#81b0ff', backgroundColor: '#353568' },
  timer: { fontSize: 14, color: '#d9d9d9', textAlign: 'center', marginBottom: 20 },
  timerRed: { color: '#ff4444' },
  verifyButton: { backgroundColor: '#484763', padding: 15, borderRadius: 8, alignItems: 'center', marginBottom: 15 },
  verifyButtonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  resendButton: { backgroundColor: 'transparent', padding: 15, borderRadius: 8, alignItems: 'center', borderWidth: 1, borderColor: '#484763', marginBottom: 20 },
  resendButtonText: { color: '#d9d9d9', fontSize: 16 },
  backToLogin: { color: '#81b0ff', textAlign: 'center', fontSize: 14 },
  errorBox: { backgroundColor: '#ff4444', padding: 12, borderRadius: 5, marginBottom: 15 },
  errorText: { color: '#fff', fontSize: 14, fontWeight: 'bold', textAlign: 'center' },
  successBox: { backgroundColor: '#27ae60', padding: 12, borderRadius: 5, marginBottom: 15 },
  successText: { color: '#fff', fontSize: 14, fontWeight: 'bold', textAlign: 'center' },
  disabledBtn: { opacity: 0.7 },
});