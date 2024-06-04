'use client'

import React, {useEffect, useState} from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import Image from 'next/image';
import { fetchMovies } from '@/app/movies/actions';
import {InfiniteData, useInfiniteQuery, QueryClientProvider, QueryClient} from '@tanstack/react-query';

export interface Movie {
    id: number;
    title: string;
    posterUrl: string;
    voteAverage: number;
}

export interface MoviesResponse {
    movies: Movie[];
}

const queryclient = new QueryClient();

const MoviesPage = ({initialData}: {initialData: Movie[]})  => {
    const infiniteInitialData: InfiniteData<Movie[]> = {
        pages: [initialData],
        pageParams: [0],
    }

    const {
        data,
        isFetchingNextPage,
        fetchNextPage,
        hasNextPage,
    }: {
        data: InfiniteData<Movie[]>;
        isFetchingNextPage: boolean;
        fetchNextPage: () => void;
        hasNextPage: boolean | undefined;
    } = useInfiniteQuery({
        queryKey: ['movies'],
        queryFn: fetchMovies as any,
        getNextPageParam: (lastPage: Movie[], pages) => {
            return lastPage.length < 20 ? undefined : pages.length;
        },
        initialData: infiniteInitialData,
    });
    
    useEffect(() => {
        const handleScroll = () => {
            if (
                window.innerHeight + document.documentElement.scrollTop !== document.documentElement.offsetHeight ||
                isFetchingNextPage
            ) {
                return;
            }
          fetchNextPage();
        };
    
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [fetchNextPage, isFetchingNextPage]);
    
    return (
        <QueryClientProvider client={queryclient}>
            <div className="container mx-auto p-4">
                <h1 className="text-4xl font-bold mb-6">Movies</h1>
                <div className="grid grid-auto sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
                    {data!.pages.map((page, pageIndex) =>
                        page.map((movie) => (
                            <Link key={movie.id} href={`/movies/${movie.id}`} className="m-2">
                                <Card className="transform transition-transform duration-300 hover:scale-110">
                                    <Image src={movie.posterUrl} alt={movie.title} className="w-full object-cover rounded-xl" width="500" height="750" />
                                    <div className="p-4 min-h-[115px]">
                                        <h2 className="text-xl font-bold">{movie.title}</h2>
                                        <h3>⭐ {movie.voteAverage.toFixed(1)}/10</h3>
                                    </div>
                                </Card>
                            </Link>
                        ))
                    )}
                    {isFetchingNextPage && <div>Loading...</div>}
                </div>
            </div>
        </QueryClientProvider>
    );
};
    
export default MoviesPage;
