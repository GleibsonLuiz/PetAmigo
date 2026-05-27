-- PetAmigo - Migration 003: Banho e Tosa

CREATE TABLE grooming_records (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    pet_id          UUID         NOT NULL REFERENCES pets(id) ON DELETE CASCADE,
    service_type    VARCHAR(30)  NOT NULL CHECK (service_type IN ('bath', 'bath_grooming', 'hygienic_grooming', 'full_grooming')),
    location        VARCHAR(200) NOT NULL,
    grooming_date   DATE         NOT NULL,
    next_date       DATE,
    price           DECIMAL(10,2),
    notes           TEXT,
    created_at      TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_grooming_records_pet_id ON grooming_records(pet_id);
CREATE INDEX idx_grooming_records_next_date ON grooming_records(next_date);
