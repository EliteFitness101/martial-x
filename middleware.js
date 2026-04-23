import { NextResponse } from "next/server";
import { jwtVerify } from "jose";
import UAParser from "ua-parser-js";

// 🔐 SECRET
const SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "dev-secret"
);

// 🌍 PUBLIC ROUTES
const PUBLIC_ROUTES = [
  "/",
  "/pricing",
  "/login",
  "/signup",
  "/api/webhook",
  "/api/coach",
  "/_next",
  "/favicon.ico",
];

// 🌐 GLOBAL NETWORK STATE (replace with Redis in production)
const globalIPMap = new Map();       // ip → request volume
const userTrustMap = new Map();      // userId → trust score
const billingAbuseMap = new Map();   // userId → abuse score

// 🔐 VERIFY TOKEN
async function verify(token) {
  try {
    const { payload } = await jwtVerify(token, SECRET);
    return payload;
  } catch {
    return null;
  }
}

// 🌐 GLOBAL IP RISK ENGINE
function computeIPRisk(ip) {
  const count = globalIPMap.get(ip) || 0;
  globalIPMap.set(ip, count + 1);

  if (count > 100) return 60;
  if (count > 50) return 40;
  if (count > 20) return 20;

  return 5;
}

// 🧠 USER BEHAVIOR RISK ENGINE
function computeUserRisk(user, req) {
  let score = 0;

  const ua = req.headers.get("user-agent") || "";
  const parser = new UAParser(ua);
  const device = parser.getDevice().type || "desktop";

  if (!user?.id) score += 60;
  if (!ua) score += 25;
  if (device === "unknown") score += 20;

  return score;
}

// 💳 BILLING ABUSE DETECTOR (REVENUE FIREWALL)
function detectBillingAbuse(userId, pathname) {
  let abuse = billingAbuseMap.get(userId) || 0;

  // simulate API abuse pattern
  if (pathname.startsWith("/api/coach")) {
    abuse += 10;
  }

  billingAbuseMap.set(userId, abuse);

  return abuse;
}

// 🧠 TRUST SCORE ENGINE (GLOBAL DECISION CORE)
function computeTrustScore(ipRisk, userRisk, billingRisk) {
  const score = 100 - (ipRisk + userRisk + billingRisk);
  return Math.max(0, score);
}

// ⚡ ACTION ENGINE
function decideAction(trustScore) {
  if (trustScore < 20) return "BLOCK";
  if (trustScore < 40) return "QUARANTINE";
  if (trustScore < 70) return "LIMIT";
  return "ALLOW";
}

export async function middleware(req) {
  const { pathname } = req.nextUrl;

  // ✔ Public routes bypass
  if (PUBLIC_ROUTES.some((r) => pathname.startsWith(r))) {
    return NextResponse.next();
  }

  const ip = req.headers.get("x-forwarded-for") || "unknown";

  // 🔐 AUTH
  const auth = req.headers.get("authorization");
  const token = auth?.replace("Bearer ", "");

  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  const user = await verify(token);

  if (!user) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  const userId = user.id;
  const role = user.role || "user";
  const plan = user.subscription || "free";

  // 🌍 GLOBAL RISK CALCULATION
  const ipRisk = computeIPRisk(ip);
  const userRisk = computeUserRisk(user, req);
  const billingRisk = detectBillingAbuse(userId, pathname);

  const trustScore = computeTrustScore(ipRisk, userRisk, billingRisk);

  userTrustMap.set(userId, trustScore);

  const decision = decideAction(trustScore);

  // 🚫 BLOCK (HIGH RISK GLOBAL NETWORK)
  if (decision === "BLOCK") {
    return new NextResponse("🚫 Access blocked by Global Security Network", {
      status: 403,
    });
  }

  // ⚠️ QUARANTINE (restricted environment)
  if (decision === "QUARANTINE") {
    return NextResponse.redirect(
      new URL("/login?security=quarantine", req.url)
    );
  }

  // 💳 LIMIT MODE (protect revenue APIs)
  if (decision === "LIMIT") {
    if (pathname.startsWith("/api")) {
      return new NextResponse(
        JSON.stringify({
          error: "Rate limited by global security network",
        }),
        { status: 429 }
      );
    }
  }

  // 🔐 ADMIN CONTROL
  if (pathname.startsWith("/admin") && role !== "admin") {
    return NextResponse.redirect(new URL("/", req.url));
  }

  // 💎 ELITE ACCESS CONTROL
  if (pathname.startsWith("/elite")) {
    if (!["elite", "admin"].includes(role)) {
      return NextResponse.redirect(new URL("/pricing", req.url));
    }
  }

  // 💳 COACH API PROTECTION
  if (pathname.startsWith("/api/coach")) {
    if (plan === "free") {
      return NextResponse.redirect(new URL("/pricing", req.url));
    }
  }

  return NextResponse.next();
}

// ⚡ GLOBAL MATCHER
export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
