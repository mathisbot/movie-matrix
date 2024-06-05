import Image from 'next/image';
import { fetchMovieById } from '../actions';
import { Card } from '@/components/ui/card';

interface SingleMovie {
    id: number;
    title: string;
    overview: string;
    voteAverage: number;
    runtime: number;
    releaseDate: string;
    posterUrl: string;
    backdropUrl: string;
    casting: string[];
    genres: string[];
}

interface SingleMovieResponse {
    movie: SingleMovie;
}

const MoviePage = async ({ params }: { params: { id: string } }) => {
    const fromIdToMovie = async (id: string) => {
        const realId = parseInt(id);
        const movie = await fetchMovieById(realId) as SingleMovieResponse;
        return movie.movie as SingleMovie;
    };
    
    const defaultMovie = {
        id: 0,
        title: "Unknown",
        overview: "Unknown",
        voteAverage: 0,
        runtime: 0,
        releaseDate: "Unknown",
        posterUrl: "Unknown",
        backdropUrl: "Unknown",
        casting: [],
        genres: [],
    } as SingleMovie;
    
    const id  = params.id;

    const movie = await fromIdToMovie(id) || defaultMovie;
    if (!movie) {
        return <div>Movie not found</div>;
    }

    return (
        <div className="p-4 h-screen" style={{backgroundImage: `url(${movie.backdropUrl})`, backgroundSize: "cover" }}>
            <div className='flex flex-row item-center justify-center text-white'>
                <h1 className="text-4xl font-bold mb-4">{movie.title}</h1>
            </div>
            <div className='flex flex-row items-center justify-center bg-white border-spacing-1'>
                <Image src={movie.posterUrl} alt={movie.title} className="mb-4 rounded-xl h-full" width="350" height="525"  />
                <div>
                    <p className="mb-4">🙋 Casting: {movie.casting}</p>
                    <p className="mb-4">⭐ Rating: {movie.voteAverage.toFixed(1)}</p>
                    <p className="mb-4">🕰️ Duration: {movie.runtime}</p>
                    <p>{movie.overview}</p>
                </div>
            </div>
        </div>
    );
};

export default MoviePage;
