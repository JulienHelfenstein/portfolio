import { NextResponse, type NextRequest } from "next/server";
import { ACCESS_COOKIE, accessDigest } from "@/lib/access";

// Protège tout le tier privé. Sans PRIVATE_ACCESS_TOKEN configuré, l'espace privé est fermé.
export async function proxy(request: NextRequest) {
  const token = process.env.PRIVATE_ACCESS_TOKEN;
  const cookie = request.cookies.get(ACCESS_COOKIE)?.value;

  if (token && cookie && cookie === (await accessDigest(token))) {
    const response = NextResponse.next();
    response.headers.set("X-Robots-Tag", "noindex, nofollow");
    return response;
  }
  return NextResponse.redirect(new URL("/", request.url));
}

export const config = {
  matcher: ["/private/:path*"],
};
