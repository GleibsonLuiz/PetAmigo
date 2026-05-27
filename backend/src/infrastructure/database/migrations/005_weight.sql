-- PetAmigo - Migration 005: Registro de peso

CREATE TABLE weight_records (
    id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    pet_id      UUID        NOT NULL REFERENCES pets(id) ON DELETE CASCADE,
    weight_kg   DECIMAL(6,2) NOT NULL CHECK (weight_kg > 0),
    recorded_at DATE        NOT NULL,
    notes       TEXT,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_weight_records_pet_id ON weight_records(pet_id);
CREATE INDEX idx_weight_records_date ON weight_records(pet_id, recorded_at DESC);
