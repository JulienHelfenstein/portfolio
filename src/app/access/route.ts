import { NextResponse, type NextRequest } from "next/server";
import { ACCESS_COOKIE, accessDigest } from "@/lib/access";

// Lien à partager : /access?key=<PRIVATE_ACCESS_TOKEN> → pose le cookie et ouvre l'espace privé.
export async function GET(request: NextRequest) {
  const token = process.env.PRIVATE_ACCESS_TOKEN;
  const key = request.nextUrl.searchParams.get("key");

  if (!token || key !== token) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  const response = NextResponse.redirect(new URL("/private", request.url));
  response.cookies.set(ACCESS_COOKIE, await accessDigest(token), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
  return response;
}
