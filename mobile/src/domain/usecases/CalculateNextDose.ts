import { VaccinationSchedule, VaccinationRecord } from '../entities/Vaccination';

export function calculateNextDoseDate(
  applicationDate: Date,
  periodicityMonths: number,
): Date {
  const next = new Date(applicationDate);
  next.setMonth(next.getMonth() + periodicityMonths);
  return next;
}

export function buildVaccinationSchedule(
  record: VaccinationRecord,
  periodicityMonths: number,
): VaccinationSchedule {
  const nextDoseDate = calculateNextDoseDate(
    new Date(record.applicationDate),
    periodicityMonths,
  );
  const now = new Date();
  const diffMs = nextDoseDate.getTime() - now.getTime();
  const daysUntilNextDose = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

  return {
    vaccinationRecord: record,
    nextDoseDate,
    daysUntilNextDose,
    isOverdue: daysUntilNextDose < 0,
  };
}
