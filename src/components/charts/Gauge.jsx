export default function Gauge({ value, size = 40, color }) {
  const r = (size - 5) / 2;
  const c = 2 * Math.PI * r;
  const o = c * (1 - value);
  return (
    <svg width={size} height={size}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#12121f" strokeWidth="3.5" />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke={color}
        strokeWidth="3.5"
        strokeDasharray={c}
        strokeDashoffset={o}
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
      />
      <text
        x={size / 2}
        y={size / 2 + 1}
        textAnchor="middle"
        dominantBaseline="middle"
        fill="#ccc"
        fontSize={size * 0.22}
        fontWeight="700"
      >
        {(value * 100).toFixed(0)}
      </text>
    </svg>
  );
}
