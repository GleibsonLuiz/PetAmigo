import { useMemo } from 'react';
import { VaccinationSchedule } from '../../domain/entities/Vaccination';

interface UseVaccinationSchedulerParams {
  lastApplicationDate: Date | string;
  intervalMonths: number;
}

interface UseVaccinationSchedulerResult {
  nextDoseDate: Date;
  daysUntilNextDose: number;
  isOverdue: boolean;
  formattedNextDose: string;
  status: 'overdue' | 'upcoming' | 'ok';
}

export function useVaccinationScheduler({
  lastApplicationDate,
  intervalMonths,
}: UseVaccinationSchedulerParams): UseVaccinationSchedulerResult {
  return useMemo(() => {
    const appDate =
      typeof lastApplicationDate === 'string'
        ? new Date(lastApplicationDate)
        : lastApplicationDate;

    const nextDoseDate = new Date(appDate);
    nextDoseDate.setMonth(nextDoseDate.getMonth() + intervalMonths);

    const now = new Date();
    const diffMs = nextDoseDate.getTime() - now.getTime();
    const daysUntilNextDose = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

    const isOverdue = daysUntilNextDose < 0;
    const isUpcoming = daysUntilNextDose >= 0 && daysUntilNextDose <= 7;

    const formattedNextDose = nextDoseDate.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });

    const status: 'overdue' | 'upcoming' | 'ok' = isOverdue
      ? 'overdue'
      : isUpcoming
        ? 'upcoming'
        : 'ok';

    return {
      nextDoseDate,
      daysUntilNextDose,
      isOverdue,
      formattedNextDose,
      status,
    };
  }, [lastApplicationDate, intervalMonths]);
}
