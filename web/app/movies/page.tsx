import { MoviesGrid } from './movies-grid';
import {SearchMovies} from './search-movies';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { getUser } from '@/lib/session';
import ReactQueryProvider from "@/components/query-provider";

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
    
    return (
        <>
            <div className="container mx-auto p-4 mt-3">
                <h1 className="text-4xl font-bold mb-6">Movies</h1>
                <h2 className='text-2xl font-bold mb-4'>Search</h2>
                <ReactQueryProvider>
                    <SearchMovies />
                </ReactQueryProvider>
                <h2 className='text-2xl font-bold mb-4 mt-6'>Recommended for you</h2>
                <ReactQueryProvider>
                    <MoviesGrid />
                </ReactQueryProvider>
            </div>
        </>
    )
}
