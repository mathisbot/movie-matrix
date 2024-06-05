import Image from 'next/image';
import { fetchMovieById } from '../actions';
import { Card } from '@/components/ui/card';
import { getUser } from '@/lib/session';
import { redirect } from 'next/navigation';

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

function convertRuntime(runtime: number) {
    const hours = Math.floor(runtime / 60);
    const minutes = runtime % 60;
    return `${hours}h ${minutes}m`;
}

const SingleMoviePage = async ({ params }: { params: { id: string } }) => {
    let res = await getUser();
    if (!res) {
        redirect("/login");
    }

    const fromIdToMovie = async (id: string) => {
        try {
            const realId = parseInt(id);
            const movie = await fetchMovieById(realId) as SingleMovieResponse;
            return movie.movie as SingleMovie;
        }
        catch {
            return null;
        }
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
        <>
            <div className="p-5 min-h-screen" style={{backgroundImage: `url(${movie.backdropUrl})`, backgroundSize: "cover", backgroundRepeat: "repeat-y" }}>
                <div className='flex flex-row item-center justify-center text-white align-center'>
                    <h1 className="text-4xl font-bold mb-4">{movie.title}</h1>
                </div>
                <div className='flex rounded-xl flex-row items-center bg-white p-4 justify-between'>
                    <Image src={movie.posterUrl} alt={movie.title} className="mb-4 mr-2 rounded-xl" width="350" height="525"  />
                    <Card className='ml-2 p-4 h-full'>
                        <h2 className='mb-4 text-xl'>{movie.title}</h2>
                        <p className="mb-4">⭐ Rating: {movie.voteAverage.toFixed(1)} /10</p>
                        <p className="mb-4">🕰️ Duration: {convertRuntime(movie.runtime)}</p>
                        <p className='mb-4'>{movie.overview}</p>
                        <p className="mb-4 text-lg">🙋 Casting:</p>
                        <ul>
                            {movie.casting.map((actor, index) => <li key={index}>{actor}</li>)}
                        </ul>
                    </Card>
                </div>
            </div>
        </>
    );
};

export default SingleMoviePage;
