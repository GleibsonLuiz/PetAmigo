import { Injectable } from '@nestjs/common';
import { Pool } from 'pg';
import { WeightRepositoryPort } from '../../domain/repositories/weight.repository';
import { WeightRecord } from '../../domain/entities/weight-record.entity';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class WeightRepositoryPg extends WeightRepositoryPort {
  private pool: Pool;

  constructor(private db: DatabaseService) {
    super();
    this.pool = db.getPool();
  }

  async findByPetId(petId: string): Promise<WeightRecord[]> {
    const { rows } = await this.pool.query(
      'SELECT * FROM weight_records WHERE pet_id = $1 ORDER BY recorded_at ASC',
      [petId],
    );
    return rows.map(this.toDomain);
  }

  async create(record: Partial<WeightRecord>): Promise<WeightRecord> {
    const { rows } = await this.pool.query(
      `INSERT INTO weight_records (pet_id, weight_kg, recorded_at, notes)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [record.petId, record.weightKg, record.recordedAt, record.notes],
    );
    return this.toDomain(rows[0]);
  }

  async delete(id: string): Promise<void> {
    await this.pool.query('DELETE FROM weight_records WHERE id = $1', [id]);
  }

  private toDomain(row: Record<string, unknown>): WeightRecord {
    const r = new WeightRecord();
    r.id = row.id as string;
    r.petId = row.pet_id as string;
    r.weightKg = Number(row.weight_kg);
    r.recordedAt = row.recorded_at as Date;
    r.notes = row.notes as string | undefined;
    r.createdAt = row.created_at as Date;
    return r;
  }
}
