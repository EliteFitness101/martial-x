import { NextResponse } from "next/server";
import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";

// 🧠 ROUTE GROUPS
const PUBLIC_ROUTES = [
  "/",
  "/pricing",
  "/login",
  "/signup",
  "/api/coach",
  "/api/webhook",
  "/_next",
  "/favicon.ico",
];

const ADMIN_ROUTES = ["/admin"];
const ELITE_ROUTES = ["/elite"];

export async function middleware(req) {
  const { pathname } = req.nextUrl;

  // ✔ Allow public routes
  if (PUBLIC_ROUTES.some((r) => pathname.startsWith(r))) {
    return NextResponse.next();
  }

  // 🧠 Supabase session check (REAL AUTH)
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  // 🚫 No session → redirect
  if (!session) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  const user = session.user;

  // 🧠 USER METADATA (role + subscription)
  const role = user?.user_metadata?.role || "user";
  const plan = user?.user_metadata?.subscription || "free";

  // 🔐 ADMIN PROTECTION
  if (ADMIN_ROUTES.some((r) => pathname.startsWith(r))) {
    if (role !== "admin") {
      return NextResponse.redirect(new URL("/", req.url));
    }
  }

  // 💎 ELITE ROUTE PROTECTION
  if (ELITE_ROUTES.some((r) => pathname.startsWith(r))) {
    if (!["elite", "admin"].includes(role) && plan !== "elite") {
      return NextResponse.redirect(new URL("/pricing", req.url));
    }
  }

  // 🚨 SUBSCRIPTION ENFORCEMENT (API LEVEL CONTROL)
  if (pathname.startsWith("/api")) {
    if (pathname.includes("coach") && plan === "free") {
      return NextResponse.redirect(new URL("/pricing", req.url));
    }
  }

  return res;
}

// ⚡ Match everything except static assets
export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
