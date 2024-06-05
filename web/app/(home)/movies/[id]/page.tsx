import { getAuthMetadata, movieServiceClient } from "@/lib/grpc";
import Image from "next/image";
import { Card } from "@/components/ui/card";
import { CastingCard } from "./casting-card";
import SingleMovie from "./single-movie"
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
    return <div>Movie ID not found.</div>;
  }

  const { movie } = await movieServiceClient.getMovie(
    { id: parsedId },
    getAuthMetadata()
  );

  if (!movie) {
    return <div>Movie not found.</div>;
  }

  return (
      <SingleMovie movie={movie}></SingleMovie>
  );
}
