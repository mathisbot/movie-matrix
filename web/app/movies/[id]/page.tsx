'use client'

import React, { useEffect } from 'react';
import Image from 'next/image';

const MoviePage = ({ params }: { params: { id: string } }) => {
    const fromIdToMovie = (id: string) => {
        //TODO: Replace with real call to API
        return {
            title: 'Example Movie',
            image: '/path/to/image.jpg',
            casting: ['Actor 1', 'Actor 2'],
            rating: 4.5,
            duration: '2h 30min',
            description: 'This is an example movie description.'
        };
    };
    
    const defaultMovie = {
        title: '',
        image: '',
        casting: [] as string[],
        rating: 0,
        duration: '',
        description: ''
    };

    const [movie, setMovie] = React.useState(defaultMovie);
    
    const id  = params.id;

    useEffect(() => {
        const movieData = fromIdToMovie(id as string);
        setMovie(movieData);
    }, [id]);

    if (!movie) {
        return <div>Loading...</div>;
    }

    return (
        <div className="p-4">
            <h1 className="text-4xl font-bold mb-4">{movie.title}</h1>
            <Image src={movie.image} alt={movie.title} className="mb-4" width="300" height="300" />
            <p className="mb-4">Casting: {movie.casting.join(', ')}</p>
            <p className="mb-4">Rating: {movie.rating}</p>
            <p className="mb-4">Duration: {movie.duration}</p>
            <p>{movie.description}</p>
        </div>
    );
};

export default MoviePage;
