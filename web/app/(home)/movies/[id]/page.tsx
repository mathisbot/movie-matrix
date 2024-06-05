import { getAuthMetadata, movieServiceClient } from "@/lib/grpc";
import Image from "next/image";
import { Card } from "@/components/ui/card";
import { CastingCard } from "./castingCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

function convertRuntime(runtime: number) {
  const hours = Math.floor(runtime / 60);
  const minutes = runtime % 60;
  return `${hours}h ${minutes}m`;
}

export default async function MoviePage({
  params,
}: {
  params: { id: string };
}) {
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
      className="p-7"
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
      {/* <div className="flex flex-row item-center justify-center text-white align-center">
        <h1 className="text-4xl font-bold mb-4">{movie.title}</h1>
      </div> */}
      <div className="flex rounded-xl flex-row bg-white p-5 justify-between items-center align-middle opacity-95">
        {movie.posterUrl && (
          <Image
            src={movie.posterUrl}
            alt={movie.title}
            className="mb-4 mr-2 rounded-xl opacity-100"
            width="350"
            height="525"
          />
        )}
        <Card className="ml-2 p-4 h-full opacity-100">
          <h2 className="mb-4 text-xl">{movie.title}</h2>
          <p className="mb-4">⭐ Rating: {movie.voteAverage.toFixed(1)} /10</p>
          <p className="mb-4">🕰️ Duration: {convertRuntime(movie.runtime)}</p>
          <Tabs defaultValue="synopsis" className="w-full">
            <TabsList>
              <TabsTrigger value="synopsis">Synopsis</TabsTrigger>
              <TabsTrigger value="casting">🙋 Casting</TabsTrigger>
            </TabsList>
            <TabsContent value="synopsis">
              <Card className="w-full p-3 bg-gray-100">
                <p className="mb-4 text-justify">{movie.overview}</p>
              </Card>
            </TabsContent>
            <TabsContent value="casting" className="w-full">
              <Card className="w-full p-3 bg-gray-100">
                <ul className="grid grid-flow-row w-full">
                  {movie.casting.map((actor, index) => (
                    <li key={index}>{JSON.stringify(actor)}</li>
                  ))}
                </ul>
                <CastingCard posterUrl="" name="" role="" />
              </Card>
            </TabsContent>
          </Tabs>
        </Card>
      </div>
    </div>
  );
}
