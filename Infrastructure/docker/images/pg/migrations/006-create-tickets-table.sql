CREATE TABLE tickets (
    id               uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_id         uuid REFERENCES events(id),
    ticket_type_id   uuid REFERENCES ticket_types(id),
    price            DECIMAL(10, 2) NOT NULL,
    max_participants INTEGER
);