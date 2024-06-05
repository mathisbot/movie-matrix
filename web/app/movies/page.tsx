'use server'

import MoviesPage, {MoviesResponse} from '@/components/movies/infinitescroll';
import SearchMoviesPage from '@/components/movies/searchmovies';
import { getMovies, searchMovies } from '@/lib/grpc';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { getUser } from '@/lib/session';
import ReactQueryProvider from "@/components/queryprovider";
import { Navbar } from '@/components/landing/navbar';
import { Footer } from '@/components/landing/footer';

export default async function Movies() {
    const res = await getUser();
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
        <>
            <Navbar loggedIn={true} username={res.username} />
            <div className="container mx-auto p-4 mt-3">
                <h1 className="text-4xl font-bold mb-6">Movies</h1>
                <h2 className='text-2xl font-bold mb-4'>Search</h2>
                <ReactQueryProvider>
                    <SearchMoviesPage />
                </ReactQueryProvider>
                <h2 className='text-2xl font-bold mb-4 mt-6'>Recommended for you</h2>
                <ReactQueryProvider>
                    <MoviesPage initialData={movies.movies} />
                </ReactQueryProvider>
            </div>
            <Footer />
        </>
    )
}
