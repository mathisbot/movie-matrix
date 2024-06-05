import { MoviesGrid } from "./movies-grid";
import { SearchMovies } from "./search-movies";
import { QueryProvider } from "@/components/query-provider";

export default async function MoviesPage() {
  return (
    <QueryProvider>
      <div className="container mx-auto p-4 mt-3">
        <h1 className="text-4xl font-bold mb-6">Movies</h1>
        <h2 className="text-2xl font-bold mb-4">Search</h2>
        <SearchMovies />
        <h2 className="text-2xl font-bold mb-4 mt-6">Recommended for you</h2>
        <MoviesGrid />
      </div>
    </QueryProvider>
  );
}
