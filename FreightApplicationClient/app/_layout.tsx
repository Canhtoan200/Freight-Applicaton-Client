import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { View, ActivityIndicator } from 'react-native';

import { useColorScheme } from '@/hooks/use-color-scheme';

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [isChecking, setIsChecking] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    checkLoginStatus();
  }, []);

  const checkLoginStatus = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem('userToken');
      const user = jsonValue != null ? JSON.parse(jsonValue) : null;
      setIsLoggedIn(!!user?.position);
    } catch (e) {
      console.error("Lỗi kiểm tra trạng thái:", e);
      setIsLoggedIn(false);
    } finally {
      setIsChecking(false);
    }
  };

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
        {isLoggedIn ? (
          <Stack.Screen name="(tabs)" options={{ title: '' }} />
        ) : (
          <Stack.Screen name="index" options={{ title: '' }} />
        )}
        <Stack.Screen name="[...unmatched]" options={{ title: '' }} />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
