CREATE TABLE events (
     id                 uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
     name               VARCHAR(100) NOT NULL,
     description        VARCHAR(255) NOT NULL,
     date               DATE NOT NULL,
     local              VARCHAR(255) NOT NULL,
     maxParticipants    INTEGER NOT NULL,
     created_by         uuid REFERENCES users(id),
     category_id        uuid REFERENCES categories(id)
);