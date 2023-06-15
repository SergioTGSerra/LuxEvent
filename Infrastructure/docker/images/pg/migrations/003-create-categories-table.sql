CREATE TABLE categories (
     id             uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
     name           VARCHAR(100) NOT NULL
);