import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Card } from '../(components)/Card';

// Exemple de fonction simulée getMovies
const getMovies = () => {
  // Remplacer par la vraie logique pour récupérer la liste des films
  return [
    { id: '1', title: 'Movie 1', image: '/path/to/image1.jpg' },
    { id: '2', title: 'Movie 2', image: '/path/to/image2.jpg' },
    { id: '3', title: 'Movie 3', image: '/path/to/image3.jpg' },
    // Ajoutez autant de films que nécessaire
  ];
};

const MoviesPage = () => {
  const movies = getMovies();

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl font-bold mb-6">Movies</h1>
      <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {movies.map((movie) => (
          <Link key={movie.id} href={`/movies/${movie.id}`}>
            {/* <div className="block bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300">
              <Image src={movie.image} alt={movie.title} className="w-full h-64 object-cover" width="300" height="300" />
              <div className="p-4">
                <h2 className="text-xl font-bold">{movie.title}</h2>
              </div>
            </div> */}
            <Card src={movie.image} alt={movie.title} className="">{movie.title}</Card>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default MoviesPage;
