import { Injectable } from '@nestjs/common';
import { Pool } from 'pg';
import { GroomingRepositoryPort } from '../../domain/repositories/grooming.repository';
import { GroomingRecord } from '../../domain/entities/grooming-record.entity';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class GroomingRepositoryPg extends GroomingRepositoryPort {
  private pool: Pool;

  constructor(private db: DatabaseService) {
    super();
    this.pool = db.getPool();
  }

  async findByPetId(petId: string): Promise<GroomingRecord[]> {
    const { rows } = await this.pool.query(
      'SELECT * FROM grooming_records WHERE pet_id = $1 ORDER BY grooming_date DESC',
      [petId],
    );
    return rows.map(this.toDomain);
  }

  async findById(id: string): Promise<GroomingRecord | null> {
    const { rows } = await this.pool.query('SELECT * FROM grooming_records WHERE id = $1', [id]);
    return rows[0] ? this.toDomain(rows[0]) : null;
  }

  async create(record: Partial<GroomingRecord>): Promise<GroomingRecord> {
    const { rows } = await this.pool.query(
      `INSERT INTO grooming_records (pet_id, service_type, location, grooming_date, next_date, price, notes)
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [record.petId, record.serviceType, record.location, record.groomingDate, record.nextDate, record.price, record.notes],
    );
    return this.toDomain(rows[0]);
  }

  async update(id: string, data: Partial<GroomingRecord>): Promise<GroomingRecord> {
    const fields: string[] = [];
    const values: unknown[] = [];
    let idx = 1;

    if (data.serviceType !== undefined) { fields.push(`service_type = $${idx++}`); values.push(data.serviceType); }
    if (data.location !== undefined) { fields.push(`location = $${idx++}`); values.push(data.location); }
    if (data.groomingDate !== undefined) { fields.push(`grooming_date = $${idx++}`); values.push(data.groomingDate); }
    if (data.nextDate !== undefined) { fields.push(`next_date = $${idx++}`); values.push(data.nextDate); }
    if (data.price !== undefined) { fields.push(`price = $${idx++}`); values.push(data.price); }
    if (data.notes !== undefined) { fields.push(`notes = $${idx++}`); values.push(data.notes); }

    values.push(id);

    const { rows } = await this.pool.query(
      `UPDATE grooming_records SET ${fields.join(', ')} WHERE id = $${idx} RETURNING *`,
      values,
    );
    return this.toDomain(rows[0]);
  }

  async delete(id: string): Promise<void> {
    await this.pool.query('DELETE FROM grooming_records WHERE id = $1', [id]);
  }

  async findUpcoming(petIds: string[]): Promise<GroomingRecord[]> {
    if (!petIds.length) return [];
    const { rows } = await this.pool.query(
      `SELECT * FROM grooming_records
       WHERE pet_id = ANY($1) AND next_date >= CURRENT_DATE
       ORDER BY next_date ASC`,
      [petIds],
    );
    return rows.map(this.toDomain);
  }

  private toDomain(row: Record<string, unknown>): GroomingRecord {
    const r = new GroomingRecord();
    r.id = row.id as string;
    r.petId = row.pet_id as string;
    r.serviceType = row.service_type as GroomingRecord['serviceType'];
    r.location = row.location as string;
    r.groomingDate = row.grooming_date as Date;
    r.nextDate = row.next_date as Date | undefined;
    r.price = row.price ? Number(row.price) : undefined;
    r.notes = row.notes as string | undefined;
    r.createdAt = row.created_at as Date;
    return r;
  }
}
