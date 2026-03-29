export default function EnvelopeChart({ candles, env, w = 680, h = 220 }) {
  if (!candles || candles.length < 2 || !env || !env.upper.length) return null;

  const offset = candles.length - env.upper.length;
  const vis = candles.slice(offset);
  const allV = [...env.upper, ...env.lower, ...vis.map((c) => c.h), ...vis.map((c) => c.l)];
  const mn = Math.min(...allV);
  const mx = Math.max(...allV);
  const rr = mx - mn || 1;
  const cw = Math.max(1, (w - 20) / vis.length - 1);
  const toY = (v) => h - 10 - ((v - mn) / rr) * (h - 20);
  const toX = (i) => 10 + i * ((w - 20) / vis.length) + cw / 2;

  const upperPts = env.upper.map((v, i) => `${toX(i)},${toY(v)}`).join(" ");
  const lowerPts = env.lower.map((v, i) => `${toX(i)},${toY(v)}`).join(" ");
  const midPts = env.mid.map((v, i) => `${toX(i)},${toY(v)}`).join(" ");
  const fillPts =
    env.upper.map((v, i) => `${toX(i)},${toY(v)}`).join(" ") +
    " " +
    [...env.lower].reverse().map((v, i) => `${toX(env.lower.length - 1 - i)},${toY(v)}`).join(" ");

  return (
    <svg width={w} height={h} style={{ display: "block" }}>
      <polygon points={fillPts} fill="rgba(168,85,247,0.06)" />
      <polyline points={upperPts} fill="none" stroke="#a855f7" strokeWidth="1" opacity="0.6" />
      <polyline points={lowerPts} fill="none" stroke="#a855f7" strokeWidth="1" opacity="0.6" />
      <polyline points={midPts} fill="none" stroke="#f5a623" strokeWidth="1.5" opacity="0.8" />
      {vis.map((c, i) => {
        const x = 10 + i * ((w - 20) / vis.length);
        const bull = c.c >= c.o;
        const col = bull ? "#00e89d" : "#ff4976";
        const bT = toY(Math.max(c.o, c.c));
        const bB = toY(Math.min(c.o, c.c));
        return (
          <g key={i}>
            <line x1={x + cw / 2} y1={toY(c.h)} x2={x + cw / 2} y2={toY(c.l)} stroke={col} strokeWidth="0.7" />
            <rect x={x} y={bT} width={cw} height={Math.max(1, bB - bT)} fill={col} rx="0.5" />
          </g>
        );
      })}
      <text x={w - 6} y={toY(env.upper[env.upper.length - 1])} textAnchor="end" fill="#a855f7" fontSize="8">
        MA\u2191
      </text>
      <text x={w - 6} y={toY(env.lower[env.lower.length - 1])} textAnchor="end" fill="#a855f7" fontSize="8">
        MA\u2193
      </text>
      <text x={w - 6} y={toY(env.mid[env.mid.length - 1])} textAnchor="end" fill="#f5a623" fontSize="8">
        MID
      </text>
    </svg>
  );
}
