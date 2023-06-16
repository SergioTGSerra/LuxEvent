CREATE TABLE registrations_activities (
    id              uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id         uuid REFERENCES users(id),
    activity_id     uuid REFERENCES activities(id)
);