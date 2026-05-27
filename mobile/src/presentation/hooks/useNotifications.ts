import { useEffect } from 'react';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { VaccinationRecord } from '../../domain/entities/Vaccination';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export async function requestNotificationPermissions(): Promise<boolean> {
  if (Platform.OS === 'web') return false;
  const { status: existing } = await Notifications.getPermissionsAsync();
  if (existing === 'granted') return true;
  const { status } = await Notifications.requestPermissionsAsync();
  return status === 'granted';
}

export async function scheduleVaccineReminder(
  petName: string,
  vaccineName: string,
  nextDoseDate: Date,
  recordId: string,
) {
  if (Platform.OS === 'web') return;

  const reminderDate = new Date(nextDoseDate);
  reminderDate.setDate(reminderDate.getDate() - 3);

  if (reminderDate > new Date()) {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: `💉 Vacina de ${petName} em 3 dias`,
        body: `A dose de ${vaccineName} é em ${nextDoseDate.toLocaleDateString('pt-BR')}.`,
        data: { type: 'vaccine_reminder', recordId },
      },
      trigger: { date: reminderDate, type: Notifications.SchedulableTriggerInputTypes.DATE },
    });
  }

  if (nextDoseDate > new Date()) {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: `💉 Vacina de ${petName} é hoje!`,
        body: `Leve ${petName} para tomar ${vaccineName}.`,
        data: { type: 'vaccine_due', recordId },
      },
      trigger: { date: nextDoseDate, type: Notifications.SchedulableTriggerInputTypes.DATE },
    });
  }
}

export function useNotificationSetup() {
  useEffect(() => {
    requestNotificationPermissions();
  }, []);
}

export async function checkOverdueAndNotify(
  vaccinations: VaccinationRecord[],
  getPetName: (petId: string) => string,
) {
  if (Platform.OS === 'web') return;

  const now = new Date();
  const overdue = vaccinations.filter((v) => new Date(v.nextDoseDate) < now);

  if (overdue.length > 0) {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: `⚠️ ${overdue.length} vacina${overdue.length > 1 ? 's' : ''} atrasada${overdue.length > 1 ? 's' : ''}`,
        body: overdue
          .slice(0, 3)
          .map((v) => `${getPetName(v.petId)}: ${v.vaccine?.name}`)
          .join(', '),
        data: { type: 'overdue_summary' },
      },
      trigger: null,
    });
  }
}
