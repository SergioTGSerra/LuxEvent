CREATE TABLE event_ticket_types (
    event_id         uuid REFERENCES events(id),
    ticker_type_id   uuid REFERENCES ticket_type(id),
    price            DECIMAL(10, 2) NOT NULL,
    PRIMARY KEY (event_id, ticker_type_id)
);