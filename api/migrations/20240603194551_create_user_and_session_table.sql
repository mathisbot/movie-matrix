-- Add migration script here
CREATE TABLE users(
   id SERIAL PRIMARY KEY,
   username TEXT NOT NULL UNIQUE,
   password TEXT NOT NULL
);

CREATE TABLE sessions(
   id SERIAL PRIMARY KEY,
   user_id integer NOT NULL,
   expires_at timestamptz NOT NULL,
   CONSTRAINT user_id_fkey FOREIGN KEY (user_id) REFERENCES users(id)
);