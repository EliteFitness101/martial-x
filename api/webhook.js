import crypto from "crypto";

export default async function handler(req, res) {
  // Only allow POST
  if (req.method !== "POST") {
    return res.status(405).send("Method Not Allowed");
  }

  try {
    // 🔐 Verify Paystack signature
    const hash = crypto
      .createHmac("sha512", process.env.PAYSTACK_SECRET)
      .update(JSON.stringify(req.body))
      .digest("hex");

    const signature = req.headers["x-paystack-signature"];

    if (hash !== signature) {
      console.error("❌ Invalid Paystack signature");
      return res.status(401).send("Invalid signature");
    }

    // ✅ Event data
    const event = req.body;

    // 🎯 Handle successful payment
    if (event.event === "charge.success") {

      const data = event.data;

      const email = data.customer.email;
      const amount = data.amount / 100;
      const reference = data.reference;

      console.log("✅ Payment Verified");
      console.log("Email:", email);
      console.log("Amount:", amount);
      console.log("Reference:", reference);

      // ============================
      // 🚀 FUTURE AUTOMATIONS
      // ============================

      // 👉 1. Save to database (Supabase)
      // 👉 2. Send WhatsApp message
      // 👉 3. Unlock AI access
      // 👉 4. Trigger email delivery

    }

    // Always respond OK
    return res.status(200).send("OK");

  } catch (error) {
    console.error("🔥 Webhook Error:", error);
    return res.status(500).send("Server Error");
  }
}
