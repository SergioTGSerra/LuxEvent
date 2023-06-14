CREATE TABLE activities (
    id             uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_id       uuid REFERENCES events(id),
    nome           VARCHAR(100) NOT NULL,
    description    VARCHAR(255) NOT NULL,
    date           DATE NOT NULL
);