import { NextResponse } from "next/server";

export function middleware(request) {
  const { pathname } = request.nextUrl;

  // 🧠 Allow public routes (NO AUTH REQUIRED)
  const publicPaths = [
    "/",
    "/pricing",
    "/api/coach",
    "/api/webhook",
    "/_next",
    "/favicon.ico",
  ];

  const isPublic = publicPaths.some((path) =>
    pathname.startsWith(path)
  );

  if (isPublic) {
    return NextResponse.next();
  }

  // 🔐 Admin protection (simple gate for now)
  if (pathname.startsWith("/(admin)") || pathname.startsWith("/admin")) {
    const auth = request.headers.get("authorization");

    // You can upgrade this later to JWT/Supabase session
    if (!auth || auth !== "Bearer admin-token") {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  return NextResponse.next();
}

// ⚡ Apply middleware ONLY to app routes (not static files)
export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
