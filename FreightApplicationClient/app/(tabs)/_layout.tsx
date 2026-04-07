import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useEffect, useState } from 'react'; // Thêm useEffect và useState
import AsyncStorage from '@react-native-async-storage/async-storage';
import { View, ActivityIndicator } from 'react-native';

export default function TabsLayout() { // Bỏ 'async' ở đây
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

      // Kiểm tra an toàn hơn
      if (!user?.data?.position) {
        router.replace('/');  // Chưa đăng nhập, tới trang login
        return;
      }

      const position = user.data.position;
      
      // Dùng object mapping thay vì nhiều else if
      const routeMap: Record<string, string> = {
        'Admin': '/(admins)',
        'Accountant': '/(accountants)',
        'Partner': '/(businessPartners)',
        'Driver': '/(drivers)',
        'Guest': '/(guests)',
        'QAStaff': '/(QAStaffs)'
      };

      const route = routeMap[position];
      if (route) {
        router.replace(route as any);
      } else {
        router.replace('/');  // Position không hợp lệ, tới login
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
