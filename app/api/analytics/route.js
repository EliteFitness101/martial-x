import { success } from "@/lib/apiResponse";
import { apiHandler } from "@/lib/apiHandler";

export const POST = apiHandler(async (req) => {
  const { users } = await req.json();

  const totalUsers = users.length;
  const eliteUsers = users.filter(u => u.subscription === "elite").length;

  const conversionRate = (eliteUsers / totalUsers) * 100;

  return success({
    totalUsers,
    eliteUsers,
    conversionRate,
  });
});
