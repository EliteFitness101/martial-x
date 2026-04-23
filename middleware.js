import { NextResponse } from "next/server";
import { jwtVerify } from "jose";
import UAParser from "ua-parser-js";

// 🔐 SECRET
const SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "dev-secret"
);

// 🌐 PUBLIC ROUTES
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

// 🧠 GLOBAL CLOUD MEMORY (replace with Redis in production)
const cloudIPReputation = new Map();   // ip → reputation score
const userBehaviorDB = new Map();      // userId → behavior profile

// 🔐 VERIFY TOKEN
async function verify(token) {
  try {
    const { payload } = await jwtVerify(token, SECRET);
    return payload;
  } catch {
    return null;
  }
}

// 🌍 GLOBAL IP REPUTATION ENGINE (self-learning)
function getIPReputation(ip) {
  const current = cloudIPReputation.get(ip) || {
    score: 50,
    hits: 0,
  };

  current.hits += 1;

  // learn from traffic patterns
  if (current.hits > 100) current.score -= 20;
  if (current.hits > 200) current.score -= 40;

  cloudIPReputation.set(ip, current);

  return current.score;
}

// 🧠 USER BEHAVIOR AI ENGINE (adaptive memory)
function analyzeUser(user, req) {
  const ua = req.headers.get("user-agent") || "";
  const parser = new UAParser(ua);
  const device = parser.getDevice().type || "desktop";

  const prev = userBehaviorDB.get(user.id) || {
    risk: 0,
    logins: 0,
    anomalies: 0,
  };

  let risk = 0;

  if (!ua) risk += 20;
  if (device === "unknown") risk += 15;
  if (!user?.id) risk += 50;

  prev.logins += 1;
  prev.risk = Math.min(100, prev.risk + risk);

  if (risk > 30) prev.anomalies += 1;

  userBehaviorDB.set(user.id, prev);

  return prev;
}

// 💰 REVENUE FIREWALL (protect paid endpoints)
function revenueFirewall(user, pathname) {
  if (pathname.startsWith("/api/coach")) {
    if (user.subscription === "free") {
      return "BLOCK";
    }

    if (user.subscription === "elite" && userBehaviorDB.get(user.id)?.anomalies > 5) {
      return "LIMIT";
    }
  }

  return "ALLOW";
}

// 🧠 AI DECISION ENGINE (self-adjusting trust system)
function decisionEngine(ipScore, userProfile) {
  const totalRisk = (100 - ipScore) + (userProfile.risk || 0);

  if (totalRisk > 120) return "BLOCK";
  if (totalRisk > 80) return "QUARANTINE";
  if (totalRisk > 50) return "LIMIT";

  return "ALLOW";
}

// 🔁 SELF-HEALING SYSTEM (trust decay over time)
function decaySystem(userId) {
  const profile = userBehaviorDB.get(userId);
  if (!profile) return;

  profile.risk = Math.max(0, profile.risk - 0.5); // gradual healing
  userBehaviorDB.set(userId, profile);
}

export async function middleware(req) {
  const { pathname } = req.nextUrl;

  // ✔ PUBLIC ROUTES
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

  const userProfile = analyzeUser(user, req);
  const ipScore = getIPReputation(ip);

  // 🔁 self-healing decay
  decaySystem(user.id);

  // 🧠 FINAL AI DECISION
  const decision = decisionEngine(ipScore, userProfile);

  // 💰 REVENUE PROTECTION
  const revenueDecision = revenueFirewall(user, pathname);

  if (revenueDecision === "BLOCK") {
    return NextResponse.redirect(new URL("/pricing", req.url));
  }

  if (revenueDecision === "LIMIT") {
    return new NextResponse(
      JSON.stringify({ error: "Revenue protection active" }),
      { status: 429 }
    );
  }

  // 🚫 GLOBAL BLOCK
  if (decision === "BLOCK") {
    return new NextResponse("🚫 Access denied by AI Security Layer", {
      status: 403,
    });
  }

  // ⚠️ QUARANTINE MODE
  if (decision === "QUARANTINE") {
    return NextResponse.redirect(
      new URL("/login?security=quarantine", req.url)
    );
  }

  // 🔐 ADMIN
  if (pathname.startsWith("/admin") && user.role !== "admin") {
    return NextResponse.redirect(new URL("/", req.url));
  }

  // 💎 ELITE ACCESS
  if (pathname.startsWith("/elite")) {
    if (!["elite", "admin"].includes(user.role)) {
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
