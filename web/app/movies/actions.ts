'use server'

import { getUser } from "@/lib/session";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getMovie, getMovies, searchMovies } from "@/lib/grpc";
import { MoviesResponse, Movie } from "@/components/movies/infinitescroll";

const limitPerFetch = 10;
const baseOffset = 30;

export const fetchMovies = async ({pageParam = 0}) => {
    const res = getUser();
    if (!res) {
        redirect("/login");
    }
    const token = cookies().get("sessionToken");
    if (!token) {
        redirect("/login");
    }

    const offset = pageParam * limitPerFetch + baseOffset;
    const limit = limitPerFetch
    const movies = await getMovies(token.value, { offset, limit });
    return movies
}

export const fetchMovieById = async (id: number) => {
    const res = getUser();
    if (!res) {
        redirect("/login");
    }
    const token = cookies().get("sessionToken");
    if (!token) {
        redirect("/login");
    }

    const movie = await getMovie(token.value, { id });
    return movie
}

export const fetchSearchedMovies = async (query: string) => {
    const res = getUser();
    if (!res) {
        redirect("/login");
    }
    const token = cookies().get("sessionToken");
    if (!token) {
        redirect("/login");
    }

    const limit = 20;
    const movies = await searchMovies(token.value, { query, limit }) as MoviesResponse;
    return movies.movies as Movie[];
}
