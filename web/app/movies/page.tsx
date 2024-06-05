import MoviesPage, {MoviesResponse} from '@/components/movies/infinitescroll';
import { getMovies } from '@/lib/grpc';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { getUser } from '@/lib/session';
import ReactQueryProvider from "@/components/queryprovider";

export default async function Movies() {
    const res = getUser();
    if (!res) {
        redirect("/login");
    }
    const token = cookies().get("sessionToken");
    if (!token) {
        redirect("/login");
    }

    const offset = 0;
    const limit = 30;
    const movies = await getMovies(token.value, { offset, limit }) as MoviesResponse;
    
    return (
        <ReactQueryProvider>
            <MoviesPage initialData={movies.movies} />
        </ReactQueryProvider>
    )
}
