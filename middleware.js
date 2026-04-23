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

// 🧠 GLOBAL AGI MEMORY LAYER (replace with Redis + DB in prod)
const globalBrain = {
  ipMemory: new Map(),        // IP → behavior history
  userMemory: new Map(),      // user → evolving profile
  attackPatterns: new Map(),  // pattern → frequency
};

// 🔐 VERIFY TOKEN
async function verify(token) {
  try {
    const { payload } = await jwtVerify(token, SECRET);
    return payload;
  } catch {
    return null;
  }
}

// 🧠 AGI PATTERN DETECTOR
function detectPatterns(ip, userId, ua) {
  const key = `${ip}-${userId}`;

  const record = globalBrain.ipMemory.get(key) || {
    hits: 0,
    suspicious: 0,
    lastSeen: Date.now(),
  };

  record.hits++;

  // pattern learning
  if (record.hits % 20 === 0) record.suspicious++;

  globalBrain.ipMemory.set(key, record);

  return record;
}

// 🌍 AGI RISK MODEL (self-adjusting weights)
function computeAGIRisk(user, req, pattern) {
  let risk = 0;

  const ua = req.headers.get("user-agent") || "";
  const parser = new UAParser(ua);
  const device = parser.getDevice().type || "desktop";

  // base anomaly signals
  if (!ua) risk += 20;
  if (device === "unknown") risk += 25;
  if (!user?.id) risk += 50;

  // pattern intelligence
  if (pattern.hits > 50) risk += 30;
  if (pattern.suspicious > 3) risk += 40;

  return risk;
}

// 🧠 SELF-ADJUSTING SECURITY THRESHOLDS
function adaptiveThreshold(globalStats) {
  const base = 100;

  // system becomes stricter under attack load
  if (globalStats.attackPressure > 1000) return base - 30;
  if (globalStats.attackPressure > 500) return base - 15;

  return base;
}

// 💰 REVENUE-AWARE PROTECTION LAYER
function revenueAI(user, pathname, risk) {
  if (pathname.startsWith("/api/coach")) {
    if (user.subscription === "free") return "BLOCK";

    // protect elite users from false positives
    if (user.subscription === "elite" && risk < 60) {
      return "ALLOW";
    }

    if (risk > 80 && user.subscription === "elite") {
      return "LIMIT";
    }
  }

  return "ALLOW";
}

// 🧠 AGI DECISION ENGINE
function agiDecision(risk, threshold, pattern) {
  // predictive blocking (before threshold hit)
  if (pattern.hits > 80 && risk > 60) return "BLOCK";

  if (risk > threshold) return "BLOCK";
  if (risk > threshold * 0.7) return "QUARANTINE";
  if (risk > threshold * 0.5) return "LIMIT";

  return "ALLOW";
}

// 🔁 SYSTEM SELF-LEARNING UPDATE
function updateBrain(ip, userId, risk) {
  const key = `${ip}-${userId}`;

  const prev = globalBrain.userMemory.get(userId) || {
    avgRisk: 0,
    sessions: 0,
  };

  prev.avgRisk = (prev.avgRisk + risk) / 2;
  prev.sessions += 1;

  globalBrain.userMemory.set(userId, prev);
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

  // 🧠 PATTERN ANALYSIS
  const pattern = detectPatterns(ip, user.id, req.headers.get("user-agent"));

  // 🧠 RISK COMPUTATION
  const risk = computeAGIRisk(user, req, pattern);

  // 🔁 UPDATE LEARNING SYSTEM
  updateBrain(ip, user.id, risk);

  // 🌐 SYSTEM LOAD SIMULATION (attack pressure model)
  const globalStats = {
    attackPressure: pattern.hits * risk,
  };

  const threshold = adaptiveThreshold(globalStats);

  // 🧠 AGI DECISION
  const decision = agiDecision(risk, threshold, pattern);

  // 💰 REVENUE AI OVERRIDE
  const revenueDecision = revenueAI(user, pathname, risk);

  if (revenueDecision === "BLOCK") {
    return NextResponse.redirect(new URL("/pricing", req.url));
  }

  if (revenueDecision === "LIMIT") {
    return new NextResponse(
      JSON.stringify({
        error: "Revenue protection: temporary limit applied",
      }),
      { status: 429 }
    );
  }

  // 🚫 BLOCK
  if (decision === "BLOCK") {
    return new NextResponse("🚫 AI Security System Blocked Request", {
      status: 403,
    });
  }

  // ⚠️ QUARANTINE
  if (decision === "QUARANTINE") {
    return NextResponse.redirect(
      new URL("/login?security=quarantine", req.url)
    );
  }

  // 🔐 ADMIN CONTROL
  if (pathname.startsWith("/admin") && user.role !== "admin") {
    return NextResponse.redirect(new URL("/", req.url));
  }

  // 💎 ELITE CONTROL
  if (pathname.startsWith("/elite")) {
    if (!["elite", "admin"].includes(user.role)) {
      return NextResponse.redirect(new URL("/pricing", req.url));
    }
  }

  return NextResponse.next();
}

// ⚡ MATCH ALL NON-STATIC ROUTES
export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
