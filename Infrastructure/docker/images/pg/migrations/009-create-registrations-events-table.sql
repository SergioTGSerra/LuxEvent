CREATE TABLE registrations_events (
    id              uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id         uuid REFERENCES users(id),
    event_id        uuid REFERENCES events(id),
    ticket_id       uuid REFERENCES tickets(id)
);