import { getAuthMetadata, movieServiceClient } from "@/lib/grpc";
import Image from "next/image";
import { Card } from "@/components/ui/card";

function convertRuntime(runtime: number) {
  const hours = Math.floor(runtime / 60);
  const minutes = runtime % 60;
  return `${hours}h ${minutes}m`;
}

export default async function MoviePage({ params }: { params: { id: string } }) {
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
      className="p-5 min-h-screen"
      style={
        movie.backdropUrl
          ? {
              backgroundImage: `url(${movie.backdropUrl})`,
              backgroundSize: "cover",
              backgroundRepeat: "repeat-y",
            }
          : {}
      }
    >
      <div className="flex flex-row item-center justify-center text-white align-center">
        <h1 className="text-4xl font-bold mb-4">{movie.title}</h1>
      </div>
      <div className="flex rounded-xl flex-row items-center bg-white p-4 justify-between">
        {movie.posterUrl && (
          <Image
            src={movie.posterUrl}
            alt={movie.title}
            className="mb-4 mr-2 rounded-xl"
            width="350"
            height="525"
          />
        )}
        <Card className="ml-2 p-4 h-full">
          <h2 className="mb-4 text-xl">{movie.title}</h2>
          <p className="mb-4">⭐ Rating: {movie.voteAverage.toFixed(1)} /10</p>
          <p className="mb-4">🕰️ Duration: {convertRuntime(movie.runtime)}</p>
          <p className="mb-4">{movie.overview}</p>
          <p className="mb-4 text-lg">🙋 Casting:</p>
          <ul>
            {movie.casting.map((actor, index) => (
              <li key={index}>{JSON.stringify(actor)}</li>
            ))}
          </ul>
        </Card>
      </div>
    </div>
  );
}
