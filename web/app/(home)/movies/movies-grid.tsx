"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import Image from "next/image";
import { useInfiniteQuery } from "@tanstack/react-query";
import { Loader } from "lucide-react";
import { fetchMovies } from "./actions";

export function MoviesGrid() {
    const { data, isFetchingNextPage, fetchNextPage } = useInfiniteQuery({
        queryKey: ["movies"],
        queryFn: async ({ pageParam = 0 }) => ({
        data: await fetchMovies({ pageParam }),
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

    return (
        <>
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
