CREATE TABLE registration_event (
    user_id         uuid REFERENCES users(id),
    event_id        uuid REFERENCES events(id),
    PRIMARY KEY (user_id, event_id)
);