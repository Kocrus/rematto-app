import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { C } from '../lib/theme';
import { inicializarPurchases } from '../lib/purchases';

export default function RootLayout() {
  useEffect(() => {
    inicializarPurchases();
  }, []);

  return (
    <>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: C.bg },
        }}
      >
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="onboarding" options={{ gestureEnabled: false }} />
        <Stack.Screen name="elegir-rol" options={{ gestureEnabled: false }} />
        <Stack.Screen
          name="publicar"
          options={{
            headerShown: true,
            headerTitle: '',
            headerBackTitle: 'Volver',
            headerShadowVisible: false,
            headerTintColor: C.text,
            headerStyle: { backgroundColor: C.bg },
          }}
        />
        <Stack.Screen
          name="mis-remates"
          options={{
            headerShown: true,
            headerTitle: '',
            headerBackTitle: 'Volver',
            headerShadowVisible: false,
            headerTintColor: C.text,
            headerStyle: { backgroundColor: C.bg },
          }}
        />
        <Stack.Screen
          name="pro"
          options={{
            headerShown: true,
            headerTitle: '',
            headerBackTitle: 'Volver',
            headerShadowVisible: false,
            headerTintColor: C.text,
            headerStyle: { backgroundColor: C.bg },
            presentation: 'modal',
          }}
        />
        <Stack.Screen
          name="aprender/index"
          options={{
            headerShown: true,
            headerTitle: '',
            headerBackTitle: 'Volver',
            headerShadowVisible: false,
            headerTintColor: C.text,
            headerStyle: { backgroundColor: C.bg },
          }}
        />
        <Stack.Screen
          name="aprender/[slug]"
          options={{
            headerShown: true,
            headerTitle: '',
            headerBackTitle: 'Guías',
            headerShadowVisible: false,
            headerTintColor: C.text,
            headerStyle: { backgroundColor: C.bg },
          }}
        />
        <Stack.Screen
          name="legal/terminos"
          options={{
            headerShown: true,
            headerTitle: '',
            headerBackTitle: 'Volver',
            headerShadowVisible: false,
            headerTintColor: C.text,
            headerStyle: { backgroundColor: C.bg },
          }}
        />
        <Stack.Screen
          name="remate/[id]"
          options={{
            headerShown: true,
            headerTitle: '',
            headerBackTitle: 'Volver',
            headerShadowVisible: false,
            headerTintColor: C.text,
            headerStyle: { backgroundColor: C.bg },
          }}
        />
      </Stack>
    </>
  );
}
