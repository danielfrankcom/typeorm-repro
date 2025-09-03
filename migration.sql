DROP TABLE IF EXISTS vet_specialty;
DROP TABLE IF EXISTS vet;
DROP TABLE IF EXISTS specialty;

CREATE TABLE specialty (
    name VARCHAR(80) PRIMARY KEY
);

CREATE TABLE vet (
    id SERIAL PRIMARY KEY,
    name VARCHAR(30) NOT NULL
);

CREATE TABLE vet_specialty (
    id SERIAL PRIMARY KEY,
    vet_id INTEGER,
    specialty_name VARCHAR(80)
);
