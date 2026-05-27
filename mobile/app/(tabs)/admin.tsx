import { Redirect } from 'expo-router';
import { useAuthStore } from '../../src/presentation/stores/authStore';
import { AdminScreen } from '../../src/presentation/screens/AdminScreen';

export default function AdminTab() {
  const user = useAuthStore((s) => s.user);
  if (user?.role !== 'admin') return <Redirect href="/(tabs)" />;
  return <AdminScreen />;
}
