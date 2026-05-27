import { useEffect } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { StatusBar } from 'expo-status-bar';
import { useNotificationSetup } from '../src/presentation/hooks/useNotifications';
import { useAuthStore } from '../src/presentation/stores/authStore';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      retry: 2,
    },
  },
});

function AuthGate({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const segments = useSegments();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  useEffect(() => {
    const inAuthGroup = segments[0] === 'login';

    if (!isAuthenticated && !inAuthGroup) {
      router.replace('/login');
    } else if (isAuthenticated && inAuthGroup) {
      router.replace('/(tabs)');
    }
  }, [isAuthenticated, segments]);

  return <>{children}</>;
}

export default function RootLayout() {
  useNotificationSetup();

  return (
    <QueryClientProvider client={queryClient}>
      <StatusBar style="light" />
      <AuthGate>
        <Stack
          screenOptions={{
            headerStyle: { backgroundColor: '#6C63FF' },
            headerTintColor: '#FFF',
            headerTitleStyle: { fontWeight: '700' },
            headerShadowVisible: false,
            contentStyle: { backgroundColor: '#F5F6FA' },
          }}
        >
          <Stack.Screen name="login" options={{ headerShown: false }} />
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen
            name="pet/new"
            options={{
              title: 'Novo Pet',
              presentation: 'modal',
              headerStyle: { backgroundColor: '#6C63FF' },
            }}
          />
          <Stack.Screen
            name="pet/[id]"
            options={{
              title: '',
              headerTransparent: true,
            }}
          />
          <Stack.Screen
            name="pet/[id]/weight"
            options={{
              title: 'Registrar Peso',
              presentation: 'modal',
              headerStyle: { backgroundColor: '#6C63FF' },
            }}
          />
          <Stack.Screen
            name="pet/[id]/card"
            options={{
              title: 'Carteira de Vacinação',
              headerStyle: { backgroundColor: '#6C63FF' },
            }}
          />
          <Stack.Screen
            name="tutor/new"
            options={{
              title: 'Novo Tutor',
              presentation: 'modal',
              headerStyle: { backgroundColor: '#6C63FF' },
            }}
          />
          <Stack.Screen
            name="tutor/[id]"
            options={{
              title: 'Editar Tutor',
            }}
          />
          <Stack.Screen
            name="pet/[id]/vaccination"
            options={{
              title: 'Registrar Vacina',
              presentation: 'modal',
              headerStyle: { backgroundColor: '#6C63FF' },
            }}
          />
          <Stack.Screen
            name="pet/[id]/grooming"
            options={{
              title: 'Registrar Banho',
              presentation: 'modal',
              headerStyle: { backgroundColor: '#00ACC1' },
            }}
          />
        </Stack>
      </AuthGate>
    </QueryClientProvider>
  );
}
