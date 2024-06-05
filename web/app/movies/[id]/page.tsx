import { getAuthMetadata, movieServiceClient } from "@/lib/grpc";
import Image from "next/image";

export async function MoviePage({ params }: { params: { id: string } }) {
  const parsedId = parseInt(params.id);

  if (isNaN(parsedId)) {
    return <div>Invalid movie id</div>;
  }

  const { movie } = await movieServiceClient.getMovie(
    { id: parsedId },
    getAuthMetadata()
  );

  if (!movie) {
    return <div>Movie not found</div>;
  }

  return (
    <div
      className="p-4 h-screen"
      style={{
        backgroundImage: `url(${movie.backdropUrl})`,
        backgroundSize: "cover",
      }}
    >
      <div className="flex flex-row item-center justify-center text-white">
        <h1 className="text-4xl font-bold mb-4">{movie.title}</h1>
      </div>
      <div className="flex flex-row items-center justify-center bg-white border-spacing-1">
        {movie.posterUrl && (
          <Image
            src={movie.posterUrl}
            alt={movie.title}
            className="mb-4 rounded-xl h-full"
            width="350"
            height="525"
          />
        )}
        <div>
          <p className="mb-4">🙋 Casting: {JSON.stringify(movie.casting)}</p>
          <p className="mb-4">⭐ Rating: {movie.voteAverage.toFixed(1)}</p>
          <p className="mb-4">🕰️ Duration: {movie.runtime}</p>
          <p>{movie.overview}</p>
        </div>
      </div>
    </div>
  );
}

export default MoviePage;
