"use server";

import { getAuthMetadata, movieServiceClient } from "@/lib/grpc";

const limitPerFetch = 50;

export async function fetchMovies({ pageParam = 0 }) {
  const offset = pageParam * limitPerFetch;
  const limit = limitPerFetch;

  return await movieServiceClient.getPopularMovies(
    { offset, limit },
    getAuthMetadata()
  );
}

export const fetchSearchedMovies = async (query: string) => {
  const limit = 20;

  return await movieServiceClient.searchMovie(
    { query, limit },
    getAuthMetadata()
  );
};

export const voteMovie = async (movieId: number, vote: number) => {
  const request = { movieId, vote };
  return await movieServiceClient.voteMovie(request, getAuthMetadata());
};

export async function fetchRecommendedMovies(limit: number) {
  return await movieServiceClient.getRecommandedMovies({ limit }, getAuthMetadata());
}