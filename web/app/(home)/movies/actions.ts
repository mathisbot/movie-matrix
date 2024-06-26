"use server";

import { getAuthMetadata, movieServiceClient } from "@/lib/grpc";
import { revalidatePath } from "next/cache";

const limitPerFetch = 50;

export async function fetchMovies({
  pageParam = 0,
  genre = "*",
}: {
  pageParam?: number;
  genre?: string;
}) {
  const offset = pageParam * limitPerFetch;
  const limit = limitPerFetch;

  return await movieServiceClient.getPopularMovies(
    { offset, limit, genre },
    getAuthMetadata()
  );
}

export const fetchSearchedMovies = async (query: string) => {
  const limit = 15;

  return await movieServiceClient.searchMovie(
    { query, limit },
    getAuthMetadata()
  );
};

export const voteMovie = async (movieId: number, vote: number) => {
  const request = { movieId, vote };
  const result = await movieServiceClient.voteMovie(request, getAuthMetadata());

  revalidatePath("/movies");

  return result;
};

export async function fetchRecommendedMovies(limit: number) {
  return await movieServiceClient.getRecommandedMovies(
    { limit },
    getAuthMetadata()
  );
}
