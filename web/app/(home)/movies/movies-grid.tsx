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
            data: await fetchMovies({ pageParam, genreSearch }),
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

    const [genreSearch, setGenreSearch] = useState<string>("");

    const handleGenreChange = (value: string) => {
        setGenreSearch(value);
    }

    // useEffect(() => {
    //     if (queryClient && queryClient.getQueryData(["movies"])) {
    //         queryClient.setQueryData(["movies"], { pages: [] });
    //         fetchNextPage();
    //     }
    // }, [genreSearch, fetchNextPage, queryClient]);

    return (
        <>
        <div className="mr-2 px-2 space-x-2 flex flex-row align-middl items-center">
            <p>Filter by{" "}</p>
            <Select onValueChange={handleGenreChange}>
                <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Genre..." />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="*">All</SelectItem>
                    <SelectItem value="action">Action</SelectItem>
                    <SelectItem value="aventure">Aventure</SelectItem>
                    <SelectItem value="sci-fi">Science Fiction</SelectItem>
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
