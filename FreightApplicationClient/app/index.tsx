import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { 
  StyleSheet, 
  Text, 
  View, 
  TextInput, 
  TouchableOpacity, 
  Alert, // Thêm thông báo
  ActivityIndicator, // Hiệu ứng xoay xoay khi đang đợi
  SafeAreaView
} from 'react-native';

export default function App() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');  
  const [loading, setLoading] = useState(false); // Trạng thái chờ API

  const handleLogin = async () => {
    // 1. Kiểm tra đầu vào cơ bản
    if (!email || !password) {
      Alert.alert("Thông báo", "Vui lòng nhập đầy đủ Gmail và Mật khẩu");
      return;
    }

    setLoading(true); // Bắt đầu load

    try {
      // 2. Gửi request đến API
      const response = await fetch('https://freight-application-server.onrender.com/api/v1/login', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          password: password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // 3. Đăng nhập thành công
        console.log('Token nhận được:', data.data);
        const storeData = async (value: string) => {
          try {
            await AsyncStorage.setItem('userToken', value);
          } catch (e) {
            console.error("Lỗi lưu token", e);
          }
        };
        const token = typeof data.data === 'string' ? data.data : JSON.stringify(data.data);
        await storeData(token);
        router.replace('/(tabs)');
      } else {
        // 4. Lỗi từ server (sai mật khẩu, user không tồn tại...)
        Alert.alert("Lỗi đăng nhập", data.message || "Thông tin không chính xác");
      }
    } catch (error) {
      // 5. Lỗi kết nối (mất mạng, server sập...)
      Alert.alert("Lỗi kết nối", "Không thể kết nối đến máy chủ");
      console.error(error);
    } finally {
      setLoading(false); // Tắt hiệu ứng load
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.loginBox}>
        
        {/* Logo công ty */}
        <View style={styles.logoBox}>
          <Text style={styles.logoText}>Logo công ty</Text>
        </View>

        {/* Ô nhập Gmail */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Gmail:</Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        {/* Ô nhập Mật khẩu */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Mật khẩu:</Text>
          <TextInput
            style={styles.input}
            value={password}
            onChangeText={setPassword}
            secureTextEntry={true}
          />
        </View>

        {/* Nút Đăng nhập */}
        <TouchableOpacity 
          style={[styles.btnLogin, { backgroundColor: loading ? '#ccc' : '#fff' }]} 
          onPress={handleLogin}
          disabled={loading} // Khóa nút khi đang gửi request
        >
          {loading ? (
            <ActivityIndicator color="#000" />
          ) : (
            <Text style={styles.btnText}>Đăng nhập</Text>
          )}
        </TouchableOpacity>


        {/* Nút Đăng nhập cho khách */}
        <TouchableOpacity style={styles.btnGuest}>
          <Text style={styles.btnText}>Đăng nhập cho khách</Text>
        </TouchableOpacity>

      </View>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loginBox: {
    width: '85%',
    padding: 20,
    alignItems: 'center',
    // Nếu muốn có viền bao quanh toàn bộ như bản vẽ:
    borderWidth: 1,
    borderColor: '#000',
  },
  logoBox: {
    borderWidth: 1,
    borderColor: '#000',
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginBottom: 40,
  },
  logoText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  inputGroup: {
    width: '100%',
    marginBottom: 20,
  },
  label: {
    textAlign: 'center',
    marginBottom: 8,
    fontSize: 16,
  },
  input: {
    width: '100%',
    height: 40,
    borderWidth: 1,
    borderColor: '#000',
    paddingHorizontal: 10,
  },
  btnLogin: {
    borderWidth: 1,
    borderColor: '#000',
    paddingVertical: 8,
    paddingHorizontal: 30,
    marginBottom: 30,
    marginTop: 10,
  },
  btnGuest: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#000',
    paddingVertical: 12,
    alignItems: 'center',
  },
  btnText: {
    fontSize: 16,
  },
});