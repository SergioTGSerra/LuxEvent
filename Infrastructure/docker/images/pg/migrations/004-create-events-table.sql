CREATE TABLE events (
    id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name                VARCHAR(100) NOT NULL,
    description         VARCHAR(255) NOT NULL,
    event_date          TIMESTAMP NOT NULL,
    location            VARCHAR(255) NOT NULL,
    max_participants    INTEGER NOT NULL,
    created_by          UUID REFERENCES Users(id),
    category_id         UUID REFERENCES Categories(id)
);