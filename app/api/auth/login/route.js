import { createToken } from "@/lib/auth";

export async function POST(req) {
  const body = await req.json();

  // ⚠️ Replace this with DB check (Supabase / Prisma later)
  const user = {
    id: "user_123",
    role: "user",
    subscription: "free",
    email: body.email,
  };

  const token = await createToken(user);

  return Response.json({
    token,
    user,
  });
}
