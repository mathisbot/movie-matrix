import { NextRequest, NextResponse } from "next/server";

export const config = {
  matcher:
    "/((?!_next/static|_next/image|favicon.ico|login|signup|api/user).*)",
};

const webUrl = process.env.WEB_URL!;

export async function middleware(request: NextRequest) {
  const sessionCookie = request.cookies.get("sessionToken");

  const pathname = new URL(request.url).pathname;

  if (pathname === "/") {
    return NextResponse.next();
  }

  if (!sessionCookie) {
    return redirectToLogin(request);
  }

  const user: { username: string } | undefined = await fetch(
    `${webUrl}/api/user`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ token: sessionCookie.value }),
    }
  ).then((res) => res.json());

  if (!user) {
    return redirectToLogin(request);
  }

  return NextResponse.next();
}

function redirectToLogin(request: NextRequest) {
  return NextResponse.redirect(new URL("/login", request.url));
}
