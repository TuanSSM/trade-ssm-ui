export function fmt(n) {
  if (n >= 1e6) return `${(n / 1e6).toFixed(2)}M`;
  if (n >= 1e3) return `${(n / 1e3).toFixed(1)}K`;
  return n.toFixed(2);
}

export function fmtP(n) {
  return (n >= 0 ? "+" : "") + n.toFixed(2);
}
