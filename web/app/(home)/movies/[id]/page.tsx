import { getAuthMetadata, movieServiceClient } from "@/lib/grpc";
import SingleMovie from "./single-movie"

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
