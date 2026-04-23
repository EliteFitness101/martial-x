import { supabase } from "@/lib/supabase";

// Save user memory automatically
export async function saveMemory(userId, message, response) {
  await supabase.from("memory").insert([
    {
      user_id: userId,
      input: message,
      output: response,
    },
  ]);
}

// Fetch past behavior context
export async function getMemory(userId) {
  const { data } = await supabase
    .from("memory")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(20);

  return data;
}
