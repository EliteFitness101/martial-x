export async function withRetry(fn, retries = 2) {
  try {
    return await fn();
  } catch (err) {
    if (retries <= 0) throw err;

    return await withRetry(fn, retries - 1);
  }
}
