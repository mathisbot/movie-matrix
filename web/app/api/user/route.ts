import { getUser } from "@/lib/session";
import { NextResponse } from "next/server";

// TODO DELETE WHEN NEXTJS SUPPRORTS NODEJS RUNTIME IN MIDDLEWARE
export async function POST(request: Request) {
  const body = await request.json();

  const token: string | undefined = body.token;

  const user = await getUser(token);

  return NextResponse.json(user);
}
