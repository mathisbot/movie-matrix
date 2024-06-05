"server-only";

import { Metadata, createChannel, createClient } from "nice-grpc";
import { UserServiceDefinition } from "@/services/user";
import { MovieServiceDefinition } from "@/services/movie";
import { getSessionToken } from "./session";

const channel = createChannel(process.env.API_URL!);

export const userServiceClient = createClient(UserServiceDefinition, channel);
export const movieServiceClient = createClient(MovieServiceDefinition, channel);

export function getAuthMetadata() {
  const token = getSessionToken();

  if (!token) {
    throw new Error("No session token found");
  }

  return {
    metadata: Metadata({ authorization: `Bearer ${token}` }),
  };
}
