'server-only'

import { Session } from "inspector";
import { getUser as grpcGetUser } from "./grpc";
import { GetUserRequest } from "@/services/user";
import { RequestListener } from "http";
import { cache } from "react";
import { cookies } from "next/headers";

interface SessionToken {
    session_id: number;
    exp: number;
}

interface User {
    username: string;
}

function parseToken(token: string): SessionToken {
    const [header, payload, signature] = token.split(".");
    const decodedPayload = Buffer.from(payload, "base64").toString();
    return JSON.parse(decodedPayload);
}

function hasExpired(token: SessionToken): boolean {
    return Date.now() > token.exp;
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
    const resUser = await grpcGetUser({sessionToken: token.value});
    return resUser;
});

