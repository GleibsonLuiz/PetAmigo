import { Injectable } from '@nestjs/common';
import { Pool } from 'pg';
import { TutorRepositoryPort } from '../../domain/repositories/tutor.repository';
import { Tutor } from '../../domain/entities/tutor.entity';
import { Pet } from '../../domain/entities/pet.entity';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class TutorRepositoryPg extends TutorRepositoryPort {
  private pool: Pool;

  constructor(private db: DatabaseService) {
    super();
    this.pool = db.getPool();
  }

  async findAll(): Promise<Tutor[]> {
    const { rows } = await this.pool.query(
      'SELECT * FROM tutors ORDER BY created_at DESC',
    );
    return rows.map(this.toTutorDomain);
  }

  async findById(id: string): Promise<Tutor | null> {
    const { rows } = await this.pool.query('SELECT * FROM tutors WHERE id = $1', [id]);
    return rows[0] ? this.toTutorDomain(rows[0]) : null;
  }

  async create(tutor: Partial<Tutor>): Promise<Tutor> {
    const { rows } = await this.pool.query(
      `INSERT INTO tutors (name, email, phone, avatar_url)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [tutor.name, tutor.email, tutor.phone, tutor.avatarUrl],
    );
    return this.toTutorDomain(rows[0]);
  }

  async update(id: string, data: Partial<Tutor>): Promise<Tutor> {
    const fields: string[] = [];
    const values: unknown[] = [];
    let idx = 1;

    if (data.name !== undefined) { fields.push(`name = $${idx++}`); values.push(data.name); }
    if (data.email !== undefined) { fields.push(`email = $${idx++}`); values.push(data.email); }
    if (data.phone !== undefined) { fields.push(`phone = $${idx++}`); values.push(data.phone); }
    if (data.avatarUrl !== undefined) { fields.push(`avatar_url = $${idx++}`); values.push(data.avatarUrl); }

    fields.push('updated_at = NOW()');
    values.push(id);

    const { rows } = await this.pool.query(
      `UPDATE tutors SET ${fields.join(', ')} WHERE id = $${idx} RETURNING *`,
      values,
    );
    return this.toTutorDomain(rows[0]);
  }

  async delete(id: string): Promise<void> {
    await this.pool.query('DELETE FROM tutors WHERE id = $1', [id]);
  }

  async findPetsByTutorId(tutorId: string): Promise<Pet[]> {
    const { rows } = await this.pool.query(
      `SELECT p.* FROM pets p
       JOIN pet_tutors pt ON p.id = pt.pet_id
       WHERE pt.tutor_id = $1
       ORDER BY p.created_at DESC`,
      [tutorId],
    );
    return rows.map(this.toPetDomain);
  }

  async findTutorsByPetId(petId: string): Promise<Tutor[]> {
    const { rows } = await this.pool.query(
      `SELECT t.* FROM tutors t
       JOIN pet_tutors pt ON t.id = pt.tutor_id
       WHERE pt.pet_id = $1`,
      [petId],
    );
    return rows.map(this.toTutorDomain);
  }

  async addPetToTutor(petId: string, tutorId: string, role: string): Promise<void> {
    await this.pool.query(
      `INSERT INTO pet_tutors (pet_id, tutor_id, role)
       VALUES ($1, $2, $3) ON CONFLICT (pet_id, tutor_id) DO NOTHING`,
      [petId, tutorId, role],
    );
  }

  async removePetFromTutor(petId: string, tutorId: string): Promise<void> {
    await this.pool.query(
      'DELETE FROM pet_tutors WHERE pet_id = $1 AND tutor_id = $2',
      [petId, tutorId],
    );
  }

  private toTutorDomain(row: Record<string, unknown>): Tutor {
    const tutor = new Tutor();
    tutor.id = row.id as string;
    tutor.name = row.name as string;
    tutor.email = row.email as string | undefined;
    tutor.phone = row.phone as string | undefined;
    tutor.avatarUrl = row.avatar_url as string | undefined;
    tutor.createdAt = row.created_at as Date;
    tutor.updatedAt = row.updated_at as Date;
    return tutor;
  }

  private toPetDomain(row: Record<string, unknown>): Pet {
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
