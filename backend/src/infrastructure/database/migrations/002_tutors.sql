-- PetAmigo - Migration 002: Tutores e compartilhamento de pets

CREATE TABLE tutors (
    id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name        VARCHAR(150) NOT NULL,
    email       VARCHAR(255),
    phone       VARCHAR(30),
    avatar_url  TEXT,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE pet_tutors (
    pet_id     UUID NOT NULL REFERENCES pets(id) ON DELETE CASCADE,
    tutor_id   UUID NOT NULL REFERENCES tutors(id) ON DELETE CASCADE,
    role       VARCHAR(20) NOT NULL DEFAULT 'owner' CHECK (role IN ('owner', 'caretaker')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY (pet_id, tutor_id)
);

CREATE INDEX idx_pet_tutors_tutor_id ON pet_tutors(tutor_id);
CREATE INDEX idx_pet_tutors_pet_id ON pet_tutors(pet_id);
CREATE UNIQUE INDEX idx_tutors_email ON tutors(email) WHERE email IS NOT NULL;

-- Migrar dados existentes: criar tutor padrão e associar pets
INSERT INTO tutors (id, name, email)
VALUES ('00000000-0000-0000-0000-000000000001', 'Tutor Padrão', 'default@petamigo.app');

INSERT INTO pet_tutors (pet_id, tutor_id, role)
SELECT id, '00000000-0000-0000-0000-000000000001', 'owner'
FROM pets
WHERE owner_id = '00000000-0000-0000-0000-000000000001';

ALTER TABLE pets
ADD CONSTRAINT fk_pets_owner_tutor FOREIGN KEY (owner_id) REFERENCES tutors(id);
