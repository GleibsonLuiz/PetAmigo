import { Injectable } from '@nestjs/common';
import { Pool } from 'pg';
import { PetRepositoryPort } from '../../domain/repositories/pet.repository';
import { Pet } from '../../domain/entities/pet.entity';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class PetRepositoryPg extends PetRepositoryPort {
  private pool: Pool;

  constructor(private db: DatabaseService) {
    super();
    this.pool = db.getPool();
  }

  async findAll(ownerId: string): Promise<Pet[]> {
    const { rows } = await this.pool.query(
      'SELECT * FROM pets WHERE owner_id = $1 ORDER BY created_at DESC',
      [ownerId],
    );
    return rows.map(this.toDomain);
  }

  async findById(id: string): Promise<Pet | null> {
    const { rows } = await this.pool.query('SELECT * FROM pets WHERE id = $1', [id]);
    return rows[0] ? this.toDomain(rows[0]) : null;
  }

  async create(pet: Partial<Pet>): Promise<Pet> {
    const { rows } = await this.pool.query(
      `INSERT INTO pets (name, species, breed, birth_date, photo_url, owner_id)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [pet.name, pet.species, pet.breed, pet.birthDate, pet.photoUrl, pet.ownerId],
    );
    return this.toDomain(rows[0]);
  }

  async update(id: string, data: Partial<Pet>): Promise<Pet> {
    const fields: string[] = [];
    const values: unknown[] = [];
    let idx = 1;

    if (data.name !== undefined) { fields.push(`name = $${idx++}`); values.push(data.name); }
    if (data.species !== undefined) { fields.push(`species = $${idx++}`); values.push(data.species); }
    if (data.breed !== undefined) { fields.push(`breed = $${idx++}`); values.push(data.breed); }
    if (data.birthDate !== undefined) { fields.push(`birth_date = $${idx++}`); values.push(data.birthDate); }
    if (data.photoUrl !== undefined) { fields.push(`photo_url = $${idx++}`); values.push(data.photoUrl); }

    fields.push(`updated_at = NOW()`);
    values.push(id);

    const { rows } = await this.pool.query(
      `UPDATE pets SET ${fields.join(', ')} WHERE id = $${idx} RETURNING *`,
      values,
    );
    return this.toDomain(rows[0]);
  }

  async delete(id: string): Promise<void> {
    await this.pool.query('DELETE FROM pets WHERE id = $1', [id]);
  }

  private toDomain(row: Record<string, unknown>): Pet {
    const pet = new Pet();
    pet.id = row.id as string;
    pet.name = row.name as string;
    pet.species = row.species as string;
    pet.breed = row.breed as string | undefined;
    pet.birthDate = row.birth_date as Date;
    pet.photoUrl = row.photo_url as string | undefined;
    pet.ownerId = row.owner_id as string;
    pet.createdAt = row.created_at as Date;
    pet.updatedAt = row.updated_at as Date;
    return pet;
  }
}
