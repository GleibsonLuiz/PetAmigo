import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { Pool } from 'pg';
import { DatabaseService } from '../../infrastructure/database/database.service';

interface UserRow {
  id: string;
  email: string;
  password_hash: string;
  name: string;
  role: string;
  tutor_id: string | null;
}

@Injectable()
export class AuthService {
  private pool: Pool;

  constructor(
    private db: DatabaseService,
    private jwtService: JwtService,
  ) {
    this.pool = db.getPool();
  }

  async register(name: string, email: string, password: string) {
    const { rows: existing } = await this.pool.query(
      'SELECT id FROM users WHERE email = $1',
      [email.toLowerCase()],
    );
    if (existing.length) throw new ConflictException('E-mail já cadastrado');

    const hash = await bcrypt.hash(password, 10);

    const { rows: tutorRows } = await this.pool.query(
      `INSERT INTO tutors (name, email) VALUES ($1, $2) RETURNING id`,
      [name, email.toLowerCase()],
    );
    const tutorId = tutorRows[0].id;

    const { rows } = await this.pool.query(
      `INSERT INTO users (email, password_hash, name, role, tutor_id)
       VALUES ($1, $2, $3, 'tutor', $4) RETURNING id, email, name, role, tutor_id`,
      [email.toLowerCase(), hash, name, tutorId],
    );

    const user = rows[0];
    return this.buildResponse(user);
  }

  async login(email: string, password: string) {
    const { rows } = await this.pool.query(
      'SELECT * FROM users WHERE email = $1',
      [email.toLowerCase()],
    );
    if (!rows.length) throw new UnauthorizedException('E-mail ou senha inválidos');

    const user = rows[0] as UserRow;
    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) throw new UnauthorizedException('E-mail ou senha inválidos');

    return this.buildResponse(user);
  }

  async findAllUsers() {
    const { rows } = await this.pool.query(
      `SELECT u.id, u.email, u.name, u.role, u.tutor_id, u.created_at,
              t.phone as tutor_phone,
              (SELECT COUNT(*) FROM pet_tutors pt WHERE pt.tutor_id = u.tutor_id) as pet_count
       FROM users u
       LEFT JOIN tutors t ON u.tutor_id = t.id
       ORDER BY u.created_at DESC`,
    );
    return rows;
  }

  async getStats() {
    const { rows } = await this.pool.query(`
      SELECT
        (SELECT COUNT(*) FROM users WHERE role = 'tutor') as total_tutors,
        (SELECT COUNT(*) FROM users WHERE role = 'admin') as total_admins,
        (SELECT COUNT(*) FROM pets) as total_pets,
        (SELECT COUNT(*) FROM vaccination_records) as total_vaccinations,
        (SELECT COUNT(*) FROM grooming_records) as total_groomings,
        (SELECT COUNT(*) FROM users WHERE created_at >= NOW() - INTERVAL '30 days') as new_users_30d
    `);
    return rows[0];
  }

  private buildResponse(user: any) {
    const payload = { sub: user.id, email: user.email, role: user.role, tutorId: user.tutor_id };
    return {
      token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        tutorId: user.tutor_id,
      },
    };
  }
}
