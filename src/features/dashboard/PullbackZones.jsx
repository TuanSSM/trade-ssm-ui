import { color, font } from "../../styles/tokens";
import * as mixins from "../../styles/mixins";
import Badge from "../../components/ui/Badge";

export default function PullbackZones({ pullback }) {
  if (!pullback) return null;

  const zones = [
    { l: "MA Upper", v: pullback.mu, d: pullback.distU, zone: pullback.atZoneU },
    { l: "MA Mid", v: pullback.mid, d: pullback.distM, zone: Math.abs(pullback.distM) < 0.15 },
    { l: "MA Lower", v: pullback.ml, d: pullback.distL, zone: pullback.atZoneL },
  ];

  return (
    <div>
      {zones.map((z, i) => (
        <div
          key={i}
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 8,
          }}
        >
          <div>
            <div style={{ fontWeight: 600, color: "#aaa", fontSize: font.size.sm }}>{z.l}</div>
            <div style={{ fontSize: font.size.xs, color: color.textFaint }}>${z.v.toFixed(2)}</div>
          </div>
          <div style={{ textAlign: "right" }}>
            <Badge color={z.zone ? color.orange : z.d > 0 ? color.bull : color.bear}>
              {z.zone ? "AT ZONE" : z.d > 0 ? "ABOVE" : "BELOW"}
            </Badge>
            <div style={{ fontSize: font.size.xs, color: z.d >= 0 ? color.bull : color.bear, marginTop: 2 }}>
              {z.d >= 0 ? "+" : ""}
              {z.d.toFixed(3)}%
            </div>
          </div>
        </div>
      ))}
      <div
        style={{
          marginTop: 8,
          padding: 8,
          background: color.surfaceAlt,
          borderRadius: 5,
          border: `1px solid ${color.border}`,
        }}
      >
        <div style={{ fontSize: font.size.xs, fontWeight: 700, color: color.orange, marginBottom: 4 }}>
          PULLBACK SIGNALS
        </div>
        <div
          style={{
            fontSize: font.size.xs,
            color: pullback.longSignal ? color.bull : color.textGhost,
            marginBottom: 3,
          }}
        >
          {pullback.longSignal ? "\u25CF" : "\u25CB"} LONG:{" "}
          {pullback.longSignal ? "Price at MA Lower zone \u2014 watch for entry" : "Not at pullback zone"}
        </div>
        <div style={{ fontSize: font.size.xs, color: pullback.shortSignal ? color.bear : color.textGhost }}>
          {pullback.shortSignal ? "\u25CF" : "\u25CB"} SHORT:{" "}
          {pullback.shortSignal ? "Price at MA Upper zone \u2014 watch for fade" : "Not at rejection zone"}
        </div>
      </div>
    </div>
  );
}
