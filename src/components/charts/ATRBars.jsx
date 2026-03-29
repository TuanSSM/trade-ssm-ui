export default function ATRBars({ data, w = 680, h = 48 }) {
  if (!data || !data.length) return null;
  const mx = Math.max(...data);
  return (
    <svg width={w} height={h} style={{ display: "block" }}>
      {data.map((v, i) => {
        const bw = Math.max(1, (w - 10) / data.length - 0.5);
        const bh = (v / mx) * (h - 6);
        return (
          <rect
            key={i}
            x={5 + i * ((w - 10) / data.length)}
            y={h - 3 - bh}
            width={bw}
            height={bh}
            fill="#06b6d4"
            opacity="0.5"
            rx="0.5"
          />
        );
      })}
    </svg>
  );
}
