export function logAPI({ route, user, status, time }) {
  console.log("📡 API LOG:", {
    route,
    user: user?.id || "anonymous",
    status,
    time: `${time}ms`,
  });
}
