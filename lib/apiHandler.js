import { error } from "./apiResponse";

export function apiHandler(fn) {
  return async (req) => {
    try {
      return await fn(req);
    } catch (err) {
      console.error("API ERROR:", err);

      return error(
        err?.message || "Internal Server Error",
        500
      );
    }
  };
}
