import { NextResponse } from "next/server";

export function middleware(req) {
  const token = req.cookies.get("token")?.value;
  const path = req.nextUrl.pathname;

  const isAppRoute = path.startsWith("/dashboard") || path.startsWith("/coach");

  // Block access to app if not logged in
  if (isAppRoute && !token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/coach/:path*"],
};
