import { NextResponse } from "next/server";
import { upgradeUser } from "@/services/subscription";

export async function POST(req) {
  const body = await req.json();

  if (body.event === "charge.success") {
    const email = body.data.customer.email;

    await upgradeUser(email, "elite");
  }

  return NextResponse.json({ ok: true });
}
