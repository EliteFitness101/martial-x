import { supabase } from "@/lib/supabase";

export async function addXP(userId, amount) {
  const { data } = await supabase
    .from("users")
    .select("xp")
    .eq("id", userId)
    .single();

  const newXP = (data.xp || 0) + amount;

  await supabase
    .from("users")
    .update({ xp: newXP })
    .eq("id", userId);

  return newXP;
}
