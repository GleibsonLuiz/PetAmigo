-- PetAmigo - Schema Inicial
-- PostgreSQL

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE pets (
    id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name        VARCHAR(100) NOT NULL,
    species     VARCHAR(20)  NOT NULL CHECK (species IN ('dog', 'cat', 'bird', 'rabbit', 'other')),
    breed       VARCHAR(100),
    birth_date  DATE         NOT NULL,
    photo_url   TEXT,
    owner_id    UUID         NOT NULL,
    created_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE TABLE vaccines (
    id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name                VARCHAR(100)  NOT NULL,
    target_species      TEXT[]        NOT NULL,
    periodicity_months  INTEGER       NOT NULL CHECK (periodicity_months > 0),
    description         TEXT,
    created_at          TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

CREATE TABLE vaccination_records (
    id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    pet_id            UUID         NOT NULL REFERENCES pets(id) ON DELETE CASCADE,
    vaccine_id        UUID         NOT NULL REFERENCES vaccines(id) ON DELETE RESTRICT,
    application_date  DATE         NOT NULL,
    next_dose_date    DATE         NOT NULL,
    veterinarian      VARCHAR(150),
    notes             TEXT,
    created_at        TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_vaccination_records_pet_id ON vaccination_records(pet_id);
CREATE INDEX idx_vaccination_records_next_dose ON vaccination_records(next_dose_date);
CREATE INDEX idx_pets_owner_id ON pets(owner_id);

-- Seed: vacinas comuns para cães e gatos
INSERT INTO vaccines (name, target_species, periodicity_months, description) VALUES
    ('V8/V10 (Polivalente)',    ARRAY['dog'],         12, 'Cinomose, Parvovirose, Hepatite, Leptospirose e outras'),
    ('Antirrábica',             ARRAY['dog', 'cat'],  12, 'Prevenção contra raiva'),
    ('Gripe Canina',            ARRAY['dog'],          6, 'Bordetella bronchiseptica e Parainfluenza'),
    ('Tríplice Felina (V3)',    ARRAY['cat'],         12, 'Rinotraqueíte, Calicivirose e Panleucopenia'),
    ('Quádrupla Felina (V4)',   ARRAY['cat'],         12, 'V3 + Clamidiose'),
    ('FeLV (Leucemia Felina)',  ARRAY['cat'],         12, 'Prevenção contra leucemia felina');
