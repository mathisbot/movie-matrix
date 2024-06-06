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
            <h1 className="text-4xl font-bold mb-6">Movies</h1>
            <h2 className="text-2xl font-bold mb-4">Search</h2>
            <SearchMovies />
            <h2 className="text-2xl font-bold mb-4">Recommended for you</h2>
            <RecommendedMovies movieList={recommendedMovies.movies} />
            <h2 className="text-2xl font-bold mb-4 mt-6">Popular</h2>
            <MoviesGrid />
        </div>
        </QueryProvider>
    );
}
