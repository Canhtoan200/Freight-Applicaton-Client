import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useEffect, useState } from 'react'; // Thêm useEffect và useState
import AsyncStorage from '@react-native-async-storage/async-storage';
import { View, ActivityIndicator } from 'react-native';

export default function RootLayout() { // Bỏ 'async' ở đây
  const colorScheme = useColorScheme();
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true); // Trạng thái đang kiểm tra token

  useEffect(() => {
    checkLoginStatus();
  }, []);

  const checkLoginStatus = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem('userToken');
      const user = jsonValue != null ? JSON.parse(jsonValue) : null;

      if (user && user.data && user.data.position === 'Admin') {
        // Nếu là Admin, chuyển thẳng vào trang admin
        router.replace('/(admins)');
      } else {
        // Nếu không phải admin hoặc chưa login, để họ ở trang Login (index)
        console.log("Chưa đăng nhập hoặc không phải Admin");
      }
    } catch (e) {
      console.error("Lỗi kiểm tra trạng thái:", e);
    } finally {
      setIsChecking(false); // Kiểm tra xong, cho phép hiện giao diện
    }
  };

  // Trong lúc đang kiểm tra Token, hiện màn hình chờ (Loading)
  if (isChecking) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack screenOptions={{ headerShown: false }}>
        {/* Để các trang tự điều hướng */}
        <Stack.Screen name="index" /> 
        <Stack.Screen name="(admins)" />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
