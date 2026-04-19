import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, Alert, ActivityIndicator } from 'react-native';
import { TextInput } from 'react-native-paper';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const API_BASE_URL = 'http://192.168.1.4:5000';

const handleSubmit = async () => {
    setErrorMessage('');

    if (!email.trim()) {
      setErrorMessage('Email is required');
      return;
    }
    if (!password) {
      setErrorMessage('Password is required');
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(`${API_BASE_URL}/api/login`, {
        Email: email.trim().toLowerCase(),
        Password: password,
      });

      if (response.data.success) {
        // Clear old data first
        await AsyncStorage.removeItem('user');
        // Save new correct user data
        await AsyncStorage.setItem('user', JSON.stringify(response.data.user));
        console.log('Saved user:', JSON.stringify(response.data.user)); // verify in terminal
        router.push('/DrawerIndex');
      }

    } catch (error: any) {
      console.log('❌ Login error:', error.response?.data || error.message);

      if (error.response?.data?.message) {
        setErrorMessage(error.response.data.message);
      } else if (error.request) {
        setErrorMessage(`Cannot connect to server at ${API_BASE_URL}`);
      } else {
        setErrorMessage('An unexpected error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>

      {/* ✅ Inline error box */}
      {errorMessage !== '' && (
        <View style={styles.errorBox}>
          <Text style={styles.errorText}>⚠️ {errorMessage}</Text>
        </View>
      )}

      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={(text) => { setEmail(text); setErrorMessage(''); }}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={(text) => { setPassword(text); setErrorMessage(''); }}
        secureTextEntry
      />

      <TouchableOpacity onPress={() => router.push('/RegistrationForm')}>
        <Text style={styles.Text}>Don't have an account? Register now</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={handleSubmit}
        style={[styles.button, loading && styles.disabledBtn]}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" size="large" />
        ) : (
          <Text style={styles.loginText}>Login</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#D9D9D9",
    justifyContent: "center"
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: "#1B1A31"
  },
  Text: {
    color: "#1B1A31",
    fontSize: 17,
    fontWeight: "bold"
  },
  input: {
    height: 50,
    marginBottom: 10,
    backgroundColor: "#D9D9D9",
  },
  button: {
    marginTop: 20,
    backgroundColor: "#1B1A31",
    padding: 10,
    borderRadius: 5,
    alignItems: "center"
  },
  disabledBtn: {
    opacity: 0.7,
  },
  loginText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff"
  },
  errorBox: {
    backgroundColor: '#ff4444',
    padding: 12,
    borderRadius: 5,
    marginBottom: 15,
  },
  errorText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});