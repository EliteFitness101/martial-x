import { createToken } from "@/lib/auth";
import { cookies } from "next/headers";

export async function POST(req) {
  const body = await req.json();

  // ⚠️ Replace with DB check (Supabase later)
  const user = {
    id: "user_123",
    role: "user",
    subscription: "free",
    email: body.email,
  };

  const token = await createToken(user);

  // 🍪 STORE SECURE COOKIE (NOT localStorage)
  cookies().set("token", token, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
  });

  return Response.json({
    success: true,
    user,
  });
}
