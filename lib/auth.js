import { SignJWT, jwtVerify } from "jose";

const secret = new TextEncoder().encode(process.env.JWT_SECRET);

// 🧠 CREATE TOKEN
export async function createToken(user) {
  return await new SignJWT({
    id: user.id,
    role: user.role || "user",
    subscription: user.subscription || "free",
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(secret);
}

// 🔐 VERIFY TOKEN
export async function verifyToken(token) {
  try {
    const { payload } = await jwtVerify(token, secret);
    return payload;
  } catch {
    return null;
  }
}
