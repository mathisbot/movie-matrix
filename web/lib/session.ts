"server-only";

import { cache } from "react";
import { cookies } from "next/headers";
import { userServiceClient } from "./grpc";

interface SessionToken {
  session_id: number;
  exp: number;
}

function parseToken(token: string): SessionToken {
  const [header, payload, signature] = token.split(".");
  const decodedPayload = Buffer.from(payload, "base64").toString();
  return JSON.parse(decodedPayload);
}

function hasExpired(token: SessionToken): boolean {
  return Date.now() > token.exp * 1000;
}

function isValid(token: string): boolean {
  const parsedToken = parseToken(token);
  const valid = !hasExpired(parsedToken);
  return valid;
}

export function getSessionToken(): string | undefined {
  const token = cookies().get("sessionToken");
  if (!token) {
    return undefined;
  }
  if (!isValid(token.value)) {
    return undefined;
  }
  return token.value;
}

export const getUser = cache(async (token?: string) => {
  if (!token) {
    const cookieToken = cookies().get("sessionToken");

    if (!cookieToken) {
      return null;
    }

    token = cookieToken.value;
  }

  if (!isValid(token)) {
    return null;
  }
  try {
    const user = await userServiceClient.getUser({
      sessionToken: token,
    });
    return { username: user.username };
  } catch {
    return null;
  }
});
