'use client'

import React, {useEffect, useState} from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import Image from 'next/image';
import { fetchMovies } from '@/app/movies/actions';
import {useQuery} from '@tanstack/react-query';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { fetchSearchedMovies } from '@/app/movies/actions';

export interface Movie {
    id: number;
    title: string;
    posterUrl: string;
    voteAverage: number;
}

export interface MoviesResponse {
    movies: Movie[];
}

const SearchMoviesPage = ()  => {
    const [searchMoviesQuery, setSearchMoviesQuery] = useState<string>("");

    const {
        data: searchedMovies,
        refetch: refetchSearchedMovies,
    } = useQuery({
        queryKey: ['movies'],
        queryFn: async () => {
            console.log(searchMoviesQuery)
            const res = await fetchSearchedMovies(searchMoviesQuery);
            return res;
        },
    });

    function handleInput(e: React.ChangeEvent<HTMLInputElement>) {
        setSearchMoviesQuery(e.target.value);
        refetchSearchedMovies();
        console.log(searchedMovies);
    }
    
    return (
        <>
            <Input placeholder="Search for a movie" onChange={handleInput} value={searchMoviesQuery} />
            <div className="grid grid-auto sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
                {searchMoviesQuery && searchedMovies && searchedMovies.length !== 0 && searchedMovies.map((movie: Movie) => (
                        <Link key={movie.id} href={`/movies/${movie.id}`} className="m-2">
                        <Card className="transform transition-transform duration-300 hover:scale-110">
                            <Image src={movie.posterUrl} alt={movie.title} className="w-full object-cover rounded-xl" width="500" height="750" />
                        </Card>
                    </Link>
                ))}
            </div>
        </>
    );
};
    
export default SearchMoviesPage;
