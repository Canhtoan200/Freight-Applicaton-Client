import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, Alert, ActivityIndicator } from 'react-native';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

type Props = NativeStackScreenProps<any, any>;

export default function LoginScreen({ navigation }: Props) {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const API_URL = 'http://localhost:8080/api/v1/login';

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Validation', 'Please enter email and password.');
      return;
    }
    setLoading(true);
    try {
      const resp = await axios.post(
        API_URL,
        { email, password },
        { headers: { 'Content-Type': 'application/json' }, timeout: 10000 }
      );

      // adapt to your server response format; most examples return { data: { token: '...' } }
      const token = resp.data?.data?.token ?? resp.data?.token ?? null;
      if (!token) {
        setLoading(false);
        const message = resp.data?.error ?? 'Invalid login or no token returned';
        Alert.alert('Login failed', message);
        return;
      }

      await SecureStore.setItemAsync('authToken', token);
      setLoading(false);
      // Navigate to your main app screen (replace 'Home' with your route name)
      navigation?.replace?.('Home');
    } catch (err: any) {
      setLoading(false);
      const message = err.response?.data?.error ?? err.message ?? 'Login failed';
      Alert.alert('Login error', message);
    }
  };

  const handleGuest = () => {
    navigation?.replace?.('Home');
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.select({ ios: 'padding', android: undefined })}>
      <View style={styles.logoBox}>
        <Text style={styles.logoText}>Logo công ty</Text>
      </View>

      <View style={styles.form}>
        <Text style={styles.label}>Gmail:</Text>
        <TextInput
          style={styles.input}
          placeholder="email@example.com"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
        />

        <Text style={[styles.label, { marginTop: 18 }]}>Mật khẩu:</Text>
        <TextInput
          style={styles.input}
          placeholder="********"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        <TouchableOpacity style={styles.loginButton} onPress={handleLogin} disabled={loading}>
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.loginText}>Đăng nhập</Text>}
        </TouchableOpacity>

        <TouchableOpacity style={styles.guestButton} onPress={handleGuest}>
          <Text style={styles.guestText}>Đăng nhập cho khách</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 24, backgroundColor: '#fff', justifyContent: 'center' },
  logoBox: { alignItems: 'center', marginBottom: 36, borderWidth: 1, borderColor: '#333', width: 180, height: 80, justifyContent: 'center' },
  logoText: { fontSize: 16, color: '#333' },

  form: { marginTop: 12 },
  label: { textAlign: 'center', marginBottom: 8, color: '#333' },
  input: { borderWidth: 1, borderColor: '#333', paddingHorizontal: 12, paddingVertical: 10, borderRadius: 4, height: 44, alignSelf: 'stretch' },

  loginButton: { marginTop: 20, alignSelf: 'center', backgroundColor: '#333', paddingHorizontal: 28, paddingVertical: 10, borderRadius: 6 },
  loginText: { color: '#fff', fontWeight: '600' },

  guestButton: { marginTop: 30, borderWidth: 1, borderColor: '#333', paddingVertical: 14, borderRadius: 6, alignItems: 'center' },
  guestText: { color: '#333', fontWeight: '600' },
});
