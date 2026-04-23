import { cookies } from "next/headers";
import { jwtVerify } from "jose";

const secret = new TextEncoder().encode(process.env.JWT_SECRET);

export async function POST(req) {
  const token = cookies().get("token")?.value;

  if (!token) {
    return new Response("Unauthorized", { status: 401 });
  }

  try {
    const { payload } = await jwtVerify(token, secret);

    return Response.json({
      message: "AI Coach Active",
      user: payload,
    });
  } catch {
    return new Response("Invalid token", { status: 401 });
  }
}
