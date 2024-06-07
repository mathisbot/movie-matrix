import { getAuthMetadata, movieServiceClient } from "@/lib/grpc";
import Image from 'next/image';
import Link from 'next/link';
import { Card } from '@/components/ui/card';


export default async function SimilarMovies({movieId}: {movieId: number}) {
    
  const { movies } = await movieServiceClient.getSimilarMovies(
    { movieId, limit: 10 },
    getAuthMetadata()
  );

    return (
        <div className="flex flex-col items-center">
            <h2 className="text-2xl font-bold my-6">Similar Movies</h2>
            <div className="grid grid-auto sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 max-w-[75%]">
                {movies.map((movie) => (
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
        </div>
    );
}
