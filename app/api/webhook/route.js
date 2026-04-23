import crypto from "crypto";
import { success, error } from "@/lib/apiResponse";
import { apiHandler } from "@/lib/apiHandler";
import { logAPI } from "@/lib/logger";

export const POST = apiHandler(async (req) => {
  const rawBody = await req.text();
  const signature = req.headers.get("x-paystack-signature");

  const hash = crypto
    .createHmac("sha512", process.env.PAYSTACK_SECRET)
    .update(rawBody)
    .digest("hex");

  if (hash !== signature) {
    return error("Invalid signature", 401);
  }

  const event = JSON.parse(rawBody);

  logAPI({
    route: "webhook",
    status: "success",
    time: 0,
  });

  if (event.event === "charge.success") {
    console.log("💰 PAYMENT SUCCESS:", event.data.customer.email);
  }

  return success({}, "webhook processed");
});
