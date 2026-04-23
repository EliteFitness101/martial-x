import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

const SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "dev-secret"
);

// 🧠 PUBLIC ROUTES (NO AUTH REQUIRED)
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

// 🔐 VERIFY JWT TOKEN
async function verifyToken(token) {
  try {
    const { payload } = await jwtVerify(token, SECRET);
    return payload;
  } catch (err) {
    return null;
  }
}

export async function middleware(req) {
  const { pathname } = req.nextUrl;

  // ✔ Allow public routes
  const isPublic = PUBLIC_ROUTES.some((route) =>
    pathname.startsWith(route)
  );

  if (isPublic) {
    return NextResponse.next();
  }

  // 🔐 Get token from headers
  const authHeader = req.headers.get("authorization");
  const token = authHeader?.replace("Bearer ", "");

  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // 🧠 Verify token
  const user = await verifyToken(token);

  if (!user) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // 🚨 ROLE-BASED ACCESS CONTROL
  const role = user.role || "user";

  // Admin routes protection
  if (pathname.startsWith("/admin")) {
    if (role !== "admin") {
      return NextResponse.redirect(new URL("/", req.url));
    }
  }

  // Elite-only routes (optional SaaS tier gating)
  if (pathname.startsWith("/elite")) {
    if (!["elite", "admin"].includes(role)) {
      return NextResponse.redirect(new URL("/pricing", req.url));
    }
  }

  return NextResponse.next();
}

// ⚡ Apply middleware globally (but skip static assets)
export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
