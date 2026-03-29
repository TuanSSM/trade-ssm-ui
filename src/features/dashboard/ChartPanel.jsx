import { TIMEFRAMES } from "../../constants";
import { Card, CardHead, CardBody, CardTitle } from "../../components/ui/Card";
import { EnvelopeChart, ATRBars, CVDLine } from "../../components/charts";
import { color, font } from "../../styles/tokens";
import * as mixins from "../../styles/mixins";

export default function ChartPanel({
  candles,
  envelopes,
  atr,
  cvd,
  tf,
  setTF,
  envEMA,
  setEnvEMA,
  envMult,
  setEnvMult,
}) {
  return (
    <Card style={{ gridColumn: "1/4" }}>
      <CardHead>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <CardTitle>BTC/USDT \u00B7 ATR Envelope</CardTitle>
          <span style={{ fontSize: font.size.xxs, color: color.purple }}>
            EMA({envEMA}) \u00B1 ATR\u00D7{envMult}
          </span>
        </div>
        <div style={{ display: "flex", gap: 3 }}>
          {TIMEFRAMES.map((t) => (
            <button key={t} style={mixins.tfBtn(tf === t)} onClick={() => setTF(t)}>
              {t}
            </button>
          ))}
        </div>
      </CardHead>
      <CardBody>
        <EnvelopeChart
          candles={candles.slice(-60)}
          env={
            envelopes
              ? {
                  upper: envelopes.upper.slice(-60),
                  lower: envelopes.lower.slice(-60),
                  mid: envelopes.mid.slice(-60),
                }
              : null
          }
          w={680}
          h={220}
        />
        <div style={{ display: "flex", gap: 8, marginTop: 6, alignItems: "center" }}>
          <span style={{ fontSize: font.size.xxs, color: color.textFaint }}>EMA:</span>
          {[9, 14, 21, 55].map((p) => (
            <button key={p} style={mixins.tfBtn(envEMA === p)} onClick={() => setEnvEMA(p)}>
              {p}
            </button>
          ))}
          <span style={{ fontSize: font.size.xxs, color: color.textFaint, marginLeft: 8 }}>ATR\u00D7:</span>
          {[1.5, 2.0, 2.5, 3.0].map((m) => (
            <button key={m} style={mixins.tfBtn(envMult === m)} onClick={() => setEnvMult(m)}>
              {m}
            </button>
          ))}
        </div>
        <div style={{ marginTop: 8, borderTop: `1px solid ${color.border}`, paddingTop: 6 }}>
          <div style={{ display: "flex", gap: 16 }}>
            <div style={{ flex: 1 }}>
              <div style={{ ...mixins.cardTitle, marginBottom: 3 }}>ATR(14)</div>
              <ATRBars data={atr} w={320} h={40} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ ...mixins.cardTitle, marginBottom: 3 }}>CVD</div>
              <CVDLine data={cvd} w={320} h={40} />
            </div>
          </div>
        </div>
      </CardBody>
    </Card>
  );
}
