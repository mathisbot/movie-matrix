-- Add migration script here
CREATE TABLE movies (
   id integer PRIMARY KEY,
   adult boolean NOT NULL,
   original_language text NOT NULL,
   original_title text NOT NULL,
   backdrop_path text,
   popularity real NOT NULL,
   poster_path text,
   release_date text,
   title text NOT NULL,
   video boolean NOT NULL,
   vote_average real NOT NULL,
   vote_count integer NOT NULL
);

CREATE TABLE genres (
   id integer PRIMARY KEY,
   name text NOT NULL
);

CREATE TABLE movie_genres (
   movie_id integer NOT NULL,
   genre_id integer NOT NULL,
   PRIMARY KEY (movie_id, genre_id),
   FOREIGN KEY (movie_id) REFERENCES movies(id),
   FOREIGN KEY (genre_id) REFERENCES genres(id)
);