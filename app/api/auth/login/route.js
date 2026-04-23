import { createToken } from "@/lib/auth";
import { createUser, getUserByEmail } from "@/lib/db";
import { cookies } from "next/headers";

export async function POST(req) {
  const { email } = await req.json();

  // 🧠 1. CHECK USER
  let user = await getUserByEmail(email);

  // 🧠 2. CREATE IF NOT EXISTS
  if (!user) {
    user = await createUser({
      id: crypto.randomUUID(),
      email,
      role: "user",
      subscription: "free",
    });
  }

  // 🔐 3. CREATE JWT
  const token = await createToken(user);

  // 🍪 4. STORE COOKIE
  cookies().set("token", token, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
  });

  return Response.json({ user });
}
