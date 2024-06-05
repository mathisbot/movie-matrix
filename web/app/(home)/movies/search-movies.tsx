"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Loader } from "lucide-react";
import { fetchSearchedMovies } from "./actions";

export function SearchMovies() {
  const [searchMoviesQuery, setSearchMoviesQuery] = useState<string>("");

  const { data: searchedMovies, refetch: refetchSearchedMovies, isFetching } = useQuery({
    queryKey: ["search-movies"],
    queryFn: async () => (await fetchSearchedMovies(searchMoviesQuery)).movies,
  });

  return (
    <>
        <div className="flex flex-row align-middle items-center justify-start mb-3">
          <Input
              placeholder="Search for a movie"
              value={searchMoviesQuery}
              onChange={(e) => {
                setSearchMoviesQuery(e.target.value);
                refetchSearchedMovies();
              }}
            />
            {isFetching && (
            <Loader className="mx-5 size-6 animate-spin " />
            )}
        </div>
          {searchMoviesQuery &&
              (!searchedMovies ||
                  (searchedMovies && searchedMovies.length === 0)) && (
                  <p className="mt-3 ml-3 text-left w-screen">
                      We couldn&apos;t find what you&apos;re looking for...
                  </p>
              )
          }
          <div className="grid grid-auto sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
              {searchMoviesQuery &&
                  searchedMovies &&
                  searchedMovies.length !== 0 &&
                  searchedMovies.map((movie) => (
                      <Link
                          key={movie.id}
                          href={`/movies/${movie.id}`}
                          className="m-2"
                      >
                          <Card className="transform transition-transform duration-300 hover:scale-110">
                              {movie.posterUrl && (
                                  <Image
                                      src={movie.posterUrl}
                                      alt={movie.title}
                                      className="w-full object-cover rounded-xl"
                                      width="500"
                                      height="750"
                                  />
                              )}
                          </Card>
                      </Link>
                  ))}
          </div>
      </>
  );
}
