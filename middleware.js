import { NextResponse } from "next/server";

export function middleware(req) {
  const role = req.cookies.get("role")?.value;
  const sub = req.cookies.get("sub")?.value;

  const path = req.nextUrl.pathname;

  if (path.startsWith("/admin") && role !== "admin") {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  if (path.startsWith("/coach") && sub === "free") {
    return NextResponse.redirect(new URL("/pricing", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/admin/:path*", "/coach/:path*"],
};
