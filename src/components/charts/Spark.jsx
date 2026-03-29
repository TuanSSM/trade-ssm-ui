export default function Spark({ data, color, w = 100, h = 24 }) {
  if (!data || data.length < 2) return null;
  const mn = Math.min(...data);
  const mx = Math.max(...data);
  const r = mx - mn || 1;
  const pts = data.map((v, i) => `${(i / (data.length - 1)) * w},${h - ((v - mn) / r) * h}`).join(" ");
  return (
    <svg width={w} height={h} style={{ display: "block" }}>
      <polyline points={pts} fill="none" stroke={color} strokeWidth="1.5" />
    </svg>
  );
}
