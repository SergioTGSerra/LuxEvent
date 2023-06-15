CREATE TABLE ticket_types (
    id             uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    nome           VARCHAR(100) NOT NULL
);