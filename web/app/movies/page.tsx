import QueryProvider from "@/components/query-provider";
import { MoviesGrid } from "./movies-grid";

export default async function MoviesPage() {
  return (
    <QueryProvider>
      <div className="container mx-auto p-4">
        <h1 className="text-4xl font-bold mb-6">Movies</h1>
        <MoviesGrid />
      </div>
    </QueryProvider>
  );
}
