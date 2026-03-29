import { useContext } from "react";
import { MarketContext } from "../../context/MarketContext";
import { TIMEFRAMES } from "../../constants";
import { calcEnvelopes } from "../../utils";
import { Spark } from "../../components/charts";
import { Card, CardHead, CardBody, CardTitle } from "../../components/ui/Card";
import Badge from "../../components/ui/Badge";
import { color, font } from "../../styles/tokens";

export default function MultiTFScan() {
  const { series, envEMA, envMult } = useContext(MarketContext);

  return (
    <Card style={{ gridColumn: "1/3" }}>
      <CardHead>
        <CardTitle>Multi-Timeframe ATR Envelope Scan</CardTitle>
      </CardHead>
      <CardBody style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        {TIMEFRAMES.map((t) => {
          const tc = series[t] || [];
          const tcl = tc.map((c) => c.c);
          if (tcl.length < 22) return null;

          const te = calcEnvelopes(tcl, tc, envEMA, 14, envMult);
          const p = tcl[tcl.length - 1];
          const mu = te.upper[te.upper.length - 1];
          const ml = te.lower[te.lower.length - 1];
          const mid = te.mid[te.mid.length - 1];
          const pos = p > mu ? "ABOVE MA\u2191" : p < ml ? "BELOW MA\u2193" : p > mid ? "UPPER HALF" : "LOWER HALF";
          const col = p > mu ? color.purple : p < ml ? color.bear : p > mid ? color.bull : color.orange;
          const longOk = p <= ml * 1.003;
          const shortOk = p >= mu * 0.997;

          return (
            <div
              key={t}
              style={{
                flex: "1 1 130px",
                background: color.surfaceAlt,
                border: `1px solid ${color.border}`,
                borderRadius: 6,
                padding: 10,
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                <span style={{ fontWeight: 700, fontSize: font.size.lg - 1, color: "#aaa" }}>{t}</span>
                <Badge color={col}>{pos}</Badge>
              </div>
              <Spark data={tcl.slice(-30)} color={col} w={100} h={22} />
              <div style={{ marginTop: 6, fontSize: font.size.xxs, color: color.textFaint }}>
                <div>
                  MA\u2191: ${mu.toFixed(0)} | MA\u2193: ${ml.toFixed(0)}
                </div>
                <div style={{ marginTop: 3, display: "flex", gap: 6 }}>
                  <span style={{ color: longOk ? color.bull : color.textDark }}>
                    \u25CF LONG {longOk ? "READY" : "WAIT"}
                  </span>
                  <span style={{ color: shortOk ? color.bear : color.textDark }}>
                    \u25CF SHORT {shortOk ? "READY" : "WAIT"}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </CardBody>
    </Card>
  );
}
