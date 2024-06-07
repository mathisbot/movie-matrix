"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import Image from "next/image";
import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import { Loader } from "lucide-react";
import { fetchMovies } from "./actions";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function MoviesGrid() {
    const queryClient = useQueryClient();

    const { data, isFetchingNextPage, fetchNextPage } = useInfiniteQuery({
        queryKey: ["movies"],
        queryFn: async ({ pageParam = 0 }) => ({
            data: await fetchMovies({ pageParam, genre: genreSearch }),
            nextCursor: pageParam + 1,
        }),
        getNextPageParam: (lastPage) => lastPage.nextCursor,
        initialPageParam: 0,
    });

    useEffect(() => {
        function onScroll() {
        if (
            window.scrollY + window.innerHeight >=
            document.body.scrollHeight - window.innerHeight / 2 &&
            !isFetchingNextPage
        ) {
            fetchNextPage();
        }
        }

        window.addEventListener("scroll", onScroll);

        return () => {
        window.removeEventListener("scroll", onScroll);
        };
    }, [fetchNextPage, isFetchingNextPage]);

    const [genreSearch, setGenreSearch] = useState<string>("*");

    useEffect(() => {
        if (queryClient) {
            queryClient.removeQueries({queryKey: ["movies"]});
            fetchNextPage();
        }
    }, [genreSearch, queryClient, fetchNextPage]);

    return (
        <>
        <div className="m-3 px-2 space-x-2 flex flex-row align-middl items-center">
            <p>Filter by{" "}</p>
            <Select onValueChange={(v) => setGenreSearch(v)}>
                <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Genre..." />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="*">All</SelectItem>
                    <SelectItem value="Action">Action</SelectItem>
                    <SelectItem value="Animation">Animation</SelectItem>
                    <SelectItem value="Comedy">Comedy</SelectItem>
                    <SelectItem value="Crime">Crime</SelectItem>
                    <SelectItem value="Documentary">Documentary</SelectItem>
                    <SelectItem value="Drama">Drama</SelectItem>
                    <SelectItem value="Family">Family</SelectItem>
                    <SelectItem value="Fantasy">Fantasy</SelectItem>
                    <SelectItem value="History">History</SelectItem>
                    <SelectItem value="Horror">Horror</SelectItem>
                    <SelectItem value="Mystery">Mystery</SelectItem>
                    <SelectItem value="Romance">Romance</SelectItem>
                    <SelectItem value="Science Fiction">Science Fiction</SelectItem>
                    <SelectItem value="TV Movie">TV Movie</SelectItem>
                    <SelectItem value="Thriller">Thriller</SelectItem>
                    <SelectItem value="Western">Western</SelectItem>
                </SelectContent>
            </Select>
        </div>
        <div className="grid grid-auto sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
            {data?.pages.map((page) =>
            (page.data.movies || []).map((movie) => (
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
            ))
            )}
        </div>
        {isFetchingNextPage && (
            <Loader className="mx-auto my-8 size-10 animate-spin " />
        )}
        </>
    );
}
