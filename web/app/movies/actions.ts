'use server'

import { getMovies } from "@/lib/grpc";
import { MoviesResponse, Movie } from "../../components/movies/clientmovies";

const limitPerFetch = 20;
const baseOffset = 30;

export const fetchMovies = async ({pageParam = 0}) => {
    const offset = pageParam * limitPerFetch + baseOffset;
    const limit = limitPerFetch
    const movies = (await getMovies({ offset, limit }) as MoviesResponse).movies as Movie[];
    return movies
}
