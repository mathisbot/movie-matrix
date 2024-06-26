import Link from "next/link";
import { Card } from "@/components/ui/card";
import Image from "next/image";
import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import { MoviePreview } from "@/services/movie";

export function RecommendedMovies({movieList}: {movieList: MoviePreview[]}) {
    return (
        <div className="grid grid-auto sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
        {movieList.map((movie) => (
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
    );
}
