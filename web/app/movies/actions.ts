"use server";

import { getAuthMetadata, movieServiceClient } from "@/lib/grpc";

const limitPerFetch = 50;

export const fetchMovies = async ({ pageParam = 0 }) => {
  const offset = pageParam * limitPerFetch;
  const limit = limitPerFetch;

  return await movieServiceClient.getMovies(
    { offset, limit },
    getAuthMetadata()
  );
};
