import * as Notifications from 'expo-notifications';
import { VaccinationSchedule } from '../../domain/entities/Vaccination';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export async function requestNotificationPermissions(): Promise<boolean> {
  const { status: existing } = await Notifications.getPermissionsAsync();
  if (existing === 'granted') return true;

  const { status } = await Notifications.requestPermissionsAsync();
  return status === 'granted';
}

export async function scheduleVaccinationReminder(
  schedule: VaccinationSchedule,
  petName: string,
): Promise<string> {
  const { nextDoseDate, vaccinationRecord } = schedule;
  const vaccineName = vaccinationRecord.vaccine?.name ?? 'Vacina';

  const reminderDate = new Date(nextDoseDate);
  reminderDate.setDate(reminderDate.getDate() - 3);

  if (reminderDate <= new Date()) {
    return scheduleImmediateReminder(petName, vaccineName, nextDoseDate);
  }

  return Notifications.scheduleNotificationAsync({
    content: {
      title: `Vacina de ${petName} se aproxima!`,
      body: `A próxima dose de ${vaccineName} é em ${formatDate(nextDoseDate)}.`,
      data: {
        petId: vaccinationRecord.petId,
        vaccinationId: vaccinationRecord.id,
      },
    },
    trigger: { date: reminderDate, type: Notifications.SchedulableTriggerInputTypes.DATE },
  });
}

async function scheduleImmediateReminder(
  petName: string,
  vaccineName: string,
  doseDate: Date,
): Promise<string> {
  return Notifications.scheduleNotificationAsync({
    content: {
      title: `Vacina de ${petName} pendente!`,
      body: `A dose de ${vaccineName} estava prevista para ${formatDate(doseDate)}.`,
    },
    trigger: null,
  });
}

export async function cancelVaccinationReminder(notificationId: string): Promise<void> {
  await Notifications.cancelScheduledNotificationAsync(notificationId);
}

function formatDate(date: Date): string {
  return date.toLocaleDateString('pt-BR');
}
