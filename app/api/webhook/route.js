import crypto from "crypto";

export async function POST(req) {
  const body = await req.json();

  const hash = crypto
    .createHmac("sha512", process.env.PAYSTACK_SECRET)
    .update(JSON.stringify(body))
    .digest("hex");

  if (hash !== req.headers.get("x-paystack-signature")) {
    return new Response("Invalid", { status: 401 });
  }

  if (body.event === "charge.success") {
    const data = body.data;

    const ref = data.metadata?.ref || "direct";

    await fetch(`${process.env.SUPABASE_URL}/rest/v1/customers`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: process.env.SUPABASE_KEY,
        Authorization: `Bearer ${process.env.SUPABASE_KEY}`
      },
      body: JSON.stringify({
        email: data.customer.email,
        amount: data.amount / 100,
        reference: data.reference,
        ref
      })
    });
  }

  return new Response("OK");
}
