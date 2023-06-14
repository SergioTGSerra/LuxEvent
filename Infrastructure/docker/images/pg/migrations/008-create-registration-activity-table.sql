CREATE TABLE registration_activity (
    user_id         uuid REFERENCES users(id),
    activity_id     uuid REFERENCES activities(id),
    PRIMARY KEY (user_id, activity_id)
);