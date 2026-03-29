import { Card, CardHead, CardBody, CardTitle } from "../../components/ui/Card";
import { color, font } from "../../styles/tokens";

export default function AggrVision({ trades }) {
  const buyVol = trades.filter((t) => t.side === "buy").reduce((a, t) => a + t.size, 0).toFixed(1);
  const sellVol = trades.filter((t) => t.side === "sell").reduce((a, t) => a + t.size, 0).toFixed(1);
  const liqCount = trades.filter((t) => t.liquidation).length;

  return (
    <Card>
      <CardHead>
        <CardTitle>aggr.trade Vision \u00B7 CVD Heatmap</CardTitle>
      </CardHead>
      <CardBody>
        {/* Heatmap */}
        <div style={{ marginBottom: 8 }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: `repeat(${Math.min(trades.length, 20)}, 1fr)`,
              gap: 2,
              marginBottom: 4,
            }}
          >
            {trades.slice(-20).map((t, i) => {
              const intensity = Math.min(1, t.size / 5);
              const bg =
                t.side === "buy"
                  ? `rgba(0,232,157,${0.15 + intensity * 0.85})`
                  : `rgba(255,73,118,${0.15 + intensity * 0.85})`;
              return (
                <div
                  key={i}
                  style={{
                    height: 20 + intensity * 30,
                    background: bg,
                    borderRadius: 2,
                    position: "relative",
                  }}
                >
                  {t.liquidation && (
                    <div
                      style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        height: 2,
                        background: color.orange,
                      }}
                    />
                  )}
                </div>
              );
            })}
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontSize: font.size.xxs,
              color: color.textFaint,
            }}
          >
            <span>\u2190 Older</span>
            <span>Buy pressure \u25A0 Sell pressure \u25A0</span>
            <span>Newer \u2192</span>
          </div>
        </div>

        {/* Metrics */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginTop: 10 }}>
          {[
            { l: "Buy Vol", v: buyVol, c: color.bull },
            { l: "Sell Vol", v: sellVol, c: color.bear },
            { l: "Liquidations", v: liqCount, c: color.orange },
          ].map((m, i) => (
            <div
              key={i}
              style={{
                textAlign: "center",
                padding: 8,
                background: color.surfaceAlt,
                borderRadius: 5,
                border: `1px solid ${color.border}`,
              }}
            >
              <div style={{ fontSize: font.size.xl, fontWeight: 700, color: m.c }}>{m.v}</div>
              <div style={{ fontSize: font.size.xxs, color: color.textGhost, marginTop: 2 }}>{m.l}</div>
            </div>
          ))}
        </div>

        {/* Sweep Detection */}
        <div
          style={{
            marginTop: 10,
            padding: 8,
            background: color.surfaceAlt,
            borderRadius: 5,
            border: `1px solid ${color.border}`,
          }}
        >
          <div style={{ fontSize: font.size.xs, fontWeight: 700, color: color.purple, marginBottom: 4 }}>
            SWEEP DETECTION
          </div>
          <div style={{ fontSize: font.size.xs, color: color.textDim, lineHeight: 1.6 }}>
            {liqCount > 2
              ? "\u25CF Multiple liquidations detected \u2014 potential sweep in progress. Agents monitoring for reversal."
              : "\u25CB No significant liquidation clusters. Normal flow conditions."}
          </div>
        </div>
      </CardBody>
    </Card>
  );
}
