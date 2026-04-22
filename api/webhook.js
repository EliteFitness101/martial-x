import crypto from "crypto";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).send("Method Not Allowed");
  }

  try {
    // Verify Paystack
    const hash = crypto
      .createHmac("sha512", process.env.PAYSTACK_SECRET)
      .update(JSON.stringify(req.body))
      .digest("hex");

    if (hash !== req.headers["x-paystack-signature"]) {
      return res.status(401).send("Invalid signature");
    }

    const event = req.body;

    if (event.event === "charge.success") {
      const data = event.data;

      const email = data.customer.email;
      const amount = data.amount / 100;
      const reference = data.reference;

      console.log("✅ Payment:", email);

      // =========================
      // SAVE TO SUPABASE
      // =========================
      await fetch(`${process.env.SUPABASE_URL}/rest/v1/customers`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "apikey": process.env.SUPABASE_KEY,
          "Authorization": `Bearer ${process.env.SUPABASE_KEY}`
        },
        body: JSON.stringify({
          email,
          amount,
          reference
        })
      });

      // =========================
      // WHATSAPP MESSAGE
      // =========================
      console.log("📲 Send WhatsApp to:", email);

      // (we’ll automate this next)

    }

    return res.status(200).send("OK");

  } catch (error) {
    console.error(error);
    return res.status(500).send("Error");
  }
}
