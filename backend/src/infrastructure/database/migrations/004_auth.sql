-- PetAmigo - Migration 004: Autenticação

CREATE TABLE users (
    id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email         VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name          VARCHAR(150) NOT NULL,
    role          VARCHAR(20) NOT NULL DEFAULT 'tutor' CHECK (role IN ('tutor', 'admin')),
    tutor_id      UUID REFERENCES tutors(id) ON DELETE SET NULL,
    created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_tutor_id ON users(tutor_id);

-- Admin padrão: admin@petamigo.app / admin123
INSERT INTO users (id, email, password_hash, name, role)
VALUES (
    '00000000-0000-0000-0000-000000000099',
    'admin@petamigo.app',
    '$2b$10$WHwdi1AHrtCcsagjUi4Zp.sEbaH1HFQo8NTBdUx5Z9eRLCloM.AIa',
    'Administrador',
    'admin'
);
