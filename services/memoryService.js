import { supabase } from "@/lib/supabase";

export async function saveMemory(userId, input, output) {
  await supabase.from("memory").insert([
    { user_id: userId, input, output },
  ]);
}

export async function getMemory(userId) {
  const { data } = await supabase
    .from("memory")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  return data;
}
