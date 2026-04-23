import { supabase } from "@/lib/supabase";

export async function upgradeUser(email, plan) {
  await supabase
    .from("users")
    .update({
      subscription_tier: plan,
    })
    .eq("email", email);
}
