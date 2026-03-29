export default function CVDLine({ data, w = 680, h = 48 }) {
  if (!data || data.length < 2) return null;
  const mn = Math.min(...data);
  const mx = Math.max(...data);
  const rr = mx - mn || 1;
  const pts = data
    .map((v, i) => `${5 + (i / (data.length - 1)) * (w - 10)},${h - 4 - ((v - mn) / rr) * (h - 8)}`)
    .join(" ");
  return (
    <svg width={w} height={h} style={{ display: "block" }}>
      <polyline points={pts} fill="none" stroke="#a855f7" strokeWidth="1.5" />
    </svg>
  );
}
