import { NextResponse } from "next/server";
import { jwtVerify } from "jose";
import UAParser from "ua-parser-js";

// 🧠 SECRET KEY
const SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "dev-secret"
);

// 🧠 ROUTES
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

// 🚨 SIMPLE IN-MEMORY RISK MAP (replace with Redis later)
const ipRiskMap = new Map();

// 🧠 VERIFY JWT
async function verify(token) {
  try {
    const { payload } = await jwtVerify(token, SECRET);
    return payload;
  } catch {
    return null;
  }
}

// 🚨 BASIC ANOMALY SCORING
function getRiskScore(req, user) {
  let score = 0;

  const ip = req.headers.get("x-forwarded-for") || "unknown";
  const ua = req.headers.get("user-agent") || "";
  const parser = new UAParser(ua);
  const device = parser.getDevice().type || "desktop";

  // IP behavior tracking
  const ipCount = ipRiskMap.get(ip) || 0;
  ipRiskMap.set(ip, ipCount + 1);

  if (ipCount > 50) score += 40; // spam behavior

  // suspicious device mismatch
  if (device === "unknown") score += 20;

  // missing user agent
  if (!ua) score += 30;

  // no session history indicator
  if (!user?.id) score += 50;

  return score;
}

// 🧠 DECISION ENGINE
function decide(score) {
  if (score > 80) return "BLOCK";
  if (score > 50) return "CHALLENGE";
  return "ALLOW";
}

export async function middleware(req) {
  const { pathname } = req.nextUrl;

  // ✔ PUBLIC ROUTES
  if (PUBLIC_ROUTES.some((r) => pathname.startsWith(r))) {
    return NextResponse.next();
  }

  const auth = req.headers.get("authorization");
  const token = auth?.replace("Bearer ", "");

  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // 🔐 VERIFY USER
  const user = await verify(token);

  if (!user) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // 🧠 RISK ANALYSIS
  const riskScore = getRiskScore(req, user);
  const decision = decide(riskScore);

  // 🚫 BLOCK HIGH RISK
  if (decision === "BLOCK") {
    return new NextResponse("Access Denied (Security Risk Detected)", {
      status: 403,
    });
  }

  // ⚠️ CHALLENGE (soft block → redirect)
  if (decision === "CHALLENGE") {
    return NextResponse.redirect(new URL("/login?challenge=1", req.url));
  }

  // 🧠 ROLE SYSTEM
  const role = user.role || "user";
  const plan = user.subscription || "free";

  // 🔐 ADMIN PROTECTION
  if (pathname.startsWith("/admin") && role !== "admin") {
    return NextResponse.redirect(new URL("/", req.url));
  }

  // 💎 ELITE ROUTES
  if (pathname.startsWith("/elite")) {
    if (!["elite", "admin"].includes(role)) {
      return NextResponse.redirect(new URL("/pricing", req.url));
    }
  }

  // 💳 API PROTECTION (AI COACH LIMITING)
  if (pathname.startsWith("/api/coach")) {
    if (plan === "free") {
      return NextResponse.redirect(new URL("/pricing", req.url));
    }
  }

  return NextResponse.next();
}

// ⚡ APPLY TO ALL NON-STATIC ROUTES
export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
