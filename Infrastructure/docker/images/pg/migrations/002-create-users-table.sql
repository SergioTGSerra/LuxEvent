CREATE TABLE users (
     id             uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
     name           VARCHAR(100) NOT NULL,
     username       VARCHAR(100) NOT NULL,
     password       VARCHAR(100) NOT NULL,
     email          VARCHAR(100) NOT NULL,
     birth_date     DATE NOT NULL
);