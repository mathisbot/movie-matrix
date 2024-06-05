'server-only'

import { getUser as grpcGetUser, getMovies as grpcGetMovies } from "./grpc";
import { cache } from "react";
import { cookies } from "next/headers";

interface SessionToken {
    session_id: number;
    exp: number;
}

export interface User {
    username: string;
}

function parseToken(token: string): SessionToken {
    const [header, payload, signature] = token.split(".");
    const decodedPayload = Buffer.from(payload, "base64").toString();
    return JSON.parse(decodedPayload);
}

function hasExpired(token: SessionToken): boolean {
    return Date.now() > token.exp*1000;
}

function isValid(token: string): boolean {
    const parsedToken = parseToken(token);
    const valid = !hasExpired(parsedToken);
    return valid;
}

export const getUser = cache(async () => {
    const token = cookies().get("sessionToken");
    if (!token) {
        return null;
    }
    if (!isValid(token.value)) {
        return null;
    }
    let resUser = null;
    try {
        resUser = await grpcGetUser({sessionToken: token.value});
    }
    catch (e) {
        // Cookie may be invalid
        cookies().delete("sessionToken");
    }
    return resUser;
});
