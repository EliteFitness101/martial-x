import { supabase } from "@/lib/supabase";

export async function addXP(userId, amount, action) {
  await supabase.from("xp_logs").insert([
    { user_id: userId, xp: amount, action },
  ]);

  const { data: user } = await supabase
    .from("users")
    .select("xp, level")
    .eq("id", userId)
    .single();

  const newXP = (user.xp || 0) + amount;
  const newLevel = Math.floor(newXP / 100);

  await supabase
    .from("users")
    .update({ xp: newXP, level: newLevel })
    .eq("id", userId);
}
