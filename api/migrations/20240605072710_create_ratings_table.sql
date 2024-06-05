-- Add migration script here
CREATE TABLE ratings (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    movie_id INT NOT NULL,
    rating real NOT NULL,
    UNIQUE (user_id, movie_id),
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (movie_id) REFERENCES movies(id)
);
