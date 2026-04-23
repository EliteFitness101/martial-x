const metrics = {
  requests: 0,
  failures: 0,
};

export function trackRequest() {
  metrics.requests++;
}

export function trackFailure() {
  metrics.failures++;
}

export function getMetrics() {
  return metrics;
}
