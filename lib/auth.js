import { SignJWT, jwtVerify } from "jose";
import { getUserByEmail } from "./db";

const secret = new TextEncoder().encode(process.env.JWT_SECRET);

// 🔐 CREATE TOKEN (pull fresh DB state)
export async function createToken(user) {
  const dbUser = await getUserByEmail(user.email);

  return await new SignJWT({
    id: dbUser.id,
    email: dbUser.email,
    role: dbUser.role,
    subscription: dbUser.subscription,
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
