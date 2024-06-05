"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { fetchSearchedMovies } from "./actions";

export function SearchMovies() {
  const [searchMoviesQuery, setSearchMoviesQuery] = useState<string>("");

  const { data: searchedMovies, refetch: refetchSearchedMovies } = useQuery({
    queryKey: ["search-movies"],
    queryFn: async () => (await fetchSearchedMovies(searchMoviesQuery)).movies,
  });

  return (
    <>
      <Input
        placeholder="Search for a movie"
        value={searchMoviesQuery}
        onChange={(e) => {
          setSearchMoviesQuery(e.target.value);
          refetchSearchedMovies();
        }}
      />
      <div className="grid grid-auto sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
        {searchMoviesQuery &&
          searchedMovies &&
          searchedMovies.length !== 0 &&
          searchedMovies.map((movie) => (
            <Link key={movie.id} href={`/movies/${movie.id}`} className="m-2">
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
