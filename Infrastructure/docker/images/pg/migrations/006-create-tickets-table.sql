CREATE TABLE tickets (
    event_id         uuid REFERENCES events(id),
    ticket_type_id   uuid REFERENCES ticket_types(id),
    price            DECIMAL(10, 2) NOT NULL,
    PRIMARY KEY (event_id, ticket_type_id)
);