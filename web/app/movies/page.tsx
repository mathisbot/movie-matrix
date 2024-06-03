import React from 'react';
import Link from 'next/link';
import { Card } from '../(components)/Card';

const MoviesPage = () => {
    const getMovies = () => {
        // TODO: Replace with real call to API
        return [
            { id: "1", title: "Movie 1", image: "/path/to/image1.jpg" },
            { id: "2", title: "Movie 2", image: "/path/to/image2.jpg" },
            { id: "3", title: "Movie 3", image: "/path/to/image3.jpg" },
            { id: "4", title: "Movie 4", image: "/path/to/image4.jpg" },
            { id: "5", title: "Movie 5", image: "/path/to/image5.jpg" },
            { id: "6", title: "Movie 6", image: "/path/to/image6.jpg" },
      ];
    };
    const movies = getMovies();

    return (
        <div className="container mx-auto p-4">
        <h1 className="text-4xl font-bold mb-6">Movies</h1>
        <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-5 gap-3">
            {movies.map((movie) => (
            <Link key={movie.id} href={`/movies/${movie.id}`}>
                <Card src={movie.image} alt={movie.title} className="">{movie.title}</Card>
            </Link>
            ))}
        </div>
        </div>
    );
};

export default MoviesPage;
