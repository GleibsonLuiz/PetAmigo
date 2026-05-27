import { Injectable } from '@nestjs/common';
import { Pool } from 'pg';
import { VaccinationRepositoryPort } from '../../domain/repositories/vaccination.repository';
import { VaccinationRecord } from '../../domain/entities/vaccination-record.entity';
import { Vaccine } from '../../domain/entities/vaccine.entity';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class VaccinationRepositoryPg extends VaccinationRepositoryPort {
  private pool: Pool;

  constructor(private db: DatabaseService) {
    super();
    this.pool = db.getPool();
  }

  async findByPetId(petId: string): Promise<VaccinationRecord[]> {
    const { rows } = await this.pool.query(
      `SELECT vr.*, v.name as vaccine_name, v.periodicity_months, v.target_species
       FROM vaccination_records vr
       JOIN vaccines v ON vr.vaccine_id = v.id
       WHERE vr.pet_id = $1
       ORDER BY vr.application_date DESC`,
      [petId],
    );
    return rows.map(this.toRecordDomain);
  }

  async findById(id: string): Promise<VaccinationRecord | null> {
    const { rows } = await this.pool.query(
      'SELECT * FROM vaccination_records WHERE id = $1',
      [id],
    );
    return rows[0] ? this.toRecordDomain(rows[0]) : null;
  }

  async create(record: Partial<VaccinationRecord>): Promise<VaccinationRecord> {
    const { rows } = await this.pool.query(
      `INSERT INTO vaccination_records (pet_id, vaccine_id, application_date, next_dose_date, veterinarian, notes)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [record.petId, record.vaccineId, record.applicationDate, record.nextDoseDate, record.veterinarian, record.notes],
    );
    return this.toRecordDomain(rows[0]);
  }

  async delete(id: string): Promise<void> {
    await this.pool.query('DELETE FROM vaccination_records WHERE id = $1', [id]);
  }

  async getVaccinesBySpecies(species: string): Promise<Vaccine[]> {
    const { rows } = await this.pool.query(
      'SELECT * FROM vaccines WHERE $1 = ANY(target_species) ORDER BY name',
      [species],
    );
    return rows.map(this.toVaccineDomain);
  }

  async findVaccineById(id: string): Promise<Vaccine | null> {
    const { rows } = await this.pool.query('SELECT * FROM vaccines WHERE id = $1', [id]);
    return rows[0] ? this.toVaccineDomain(rows[0]) : null;
  }

  private toRecordDomain(row: Record<string, unknown>): VaccinationRecord {
    const record = new VaccinationRecord();
    record.id = row.id as string;
    record.petId = row.pet_id as string;
    record.vaccineId = row.vaccine_id as string;
    record.applicationDate = row.application_date as Date;
    record.nextDoseDate = row.next_dose_date as Date;
    record.veterinarian = row.veterinarian as string | undefined;
    record.notes = row.notes as string | undefined;
    record.createdAt = row.created_at as Date;
    if (row.vaccine_name) {
      record.vaccine = new Vaccine();
      record.vaccine.id = row.vaccine_id as string;
      record.vaccine.name = row.vaccine_name as string;
      record.vaccine.periodicityMonths = row.periodicity_months as number;
      record.vaccine.targetSpecies = row.target_species as string[];
    }
    return record;
  }

  private toVaccineDomain(row: Record<string, unknown>): Vaccine {
    const vaccine = new Vaccine();
    vaccine.id = row.id as string;
    vaccine.name = row.name as string;
    vaccine.targetSpecies = row.target_species as string[];
    vaccine.periodicityMonths = row.periodicity_months as number;
    vaccine.description = row.description as string | undefined;
    vaccine.createdAt = row.created_at as Date;
    return vaccine;
  }
}
