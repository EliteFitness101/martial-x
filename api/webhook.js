import crypto from "crypto";

export default async function handler(req, res) {
  const hash = crypto
    .createHmac("sha512", process.env.PAYSTACK_SECRET)
    .update(JSON.stringify(req.body))
    .digest("hex");

  if (hash !== req.headers["x-paystack-signature"]) {
    return res.status(401).send("Invalid");
  }

  const event = req.body;

  if (event.event === "charge.success") {
    const data = event.data;

    const ref = data.metadata?.ref || "direct";

    console.log("Referral:", ref);

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
        ref: ref
      })
    });
  }

  res.send("OK");
}
