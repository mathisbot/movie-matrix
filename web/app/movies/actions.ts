"use server";

import { getAuthMetadata, movieServiceClient } from "@/lib/grpc";

const limitPerFetch = 50;

export async function fetchMovies({ pageParam = 0 }) {
  const offset = pageParam * limitPerFetch;
  const limit = limitPerFetch;

  return await movieServiceClient.getMovies(
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
