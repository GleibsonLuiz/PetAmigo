import { Stack } from 'expo-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { StatusBar } from 'expo-status-bar';
import { useNotificationSetup } from '../src/presentation/hooks/useNotifications';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      retry: 2,
    },
  },
});

export default function RootLayout() {
  useNotificationSetup();

  return (
    <QueryClientProvider client={queryClient}>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: '#6C63FF' },
          headerTintColor: '#FFF',
          headerTitleStyle: { fontWeight: '700' },
          headerShadowVisible: false,
          contentStyle: { backgroundColor: '#F5F6FA' },
        }}
      >
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
    </QueryClientProvider>
  );
}
