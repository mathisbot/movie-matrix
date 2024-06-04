import MoviesPage, {MoviesResponse, Movie} from '@/components/movies/clientmovies';
import { getMovies } from '@/lib/grpc';

export default async function Movies() {
    const offset = 0;
    const limit = 30;
    const res = await getMovies({ offset, limit }) as MoviesResponse;
    const movies = (await getMovies({ offset, limit }) as MoviesResponse).movies as Movie[];

    return (
        <MoviesPage initialData={movies} />
    )
}
