import { MoviesGrid } from "./movies-grid";
import { SearchMovies } from "./search-movies";
import { RecommendedMovies } from "./recommendation";
import { QueryProvider } from "@/components/query-provider";
import { fetchRecommendedMovies } from "./actions";
import { GetRecommandedMoviesResponse } from "@/services/movie";

const recommendationLimit = 10;

export default async function MoviesPage() {
    const recommendedMovies: GetRecommandedMoviesResponse = await fetchRecommendedMovies(recommendationLimit);

    return (
        <QueryProvider>
        <div className="container mx-auto p-4 mt-3">
            <div className="flex flex-col items-center align-middle justify-center mb-7 space-y-3">
                <h1 className="text-4xl font-bold">Movies</h1>
                <div className="space-x-5 border-gray-100">
                    <a href="#search" className="">Search</a>
                    <a href="#recommended" className="">Recommended</a>
                    <a href="#popular" className="">Popular</a>
                </div>
            </div>
            <h2 className="text-2xl font-bold mb-4" id="search">Search</h2>
            <SearchMovies />
            <h2 className="text-2xl font-bold mb-4" id="recommended">Recommended for you</h2>
            <RecommendedMovies movieList={recommendedMovies.movies} />
            <h2 className="text-2xl font-bold mb-4 mt-6" id="popular">Popular</h2>
            <MoviesGrid />
        </div>
        </QueryProvider>
    );
}
