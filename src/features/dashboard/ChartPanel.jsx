import { useRef, useState, useEffect, useMemo, memo } from "react";
import { TIMEFRAMES } from "../../constants";
import { Card, CardHead, CardBody, CardTitle } from "../../components/ui/Card";
import { LightweightChart, ATRBars, CVDLine } from "../../components/charts";
import { color, font } from "../../styles/tokens";
import * as mixins from "../../styles/mixins";

function ChartPanel({
  candles, envelopes, atr, cvd,
  tf, setTF, envEMA, setEnvEMA, envMult, setEnvMult,
}) {
  const chartRef = useRef(null);
  const [chartWidth, setChartWidth] = useState(680);

  useEffect(() => {
    if (!chartRef.current) return;
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setChartWidth(Math.floor(entry.contentRect.width));
      }
    });
    observer.observe(chartRef.current);
    return () => observer.disconnect();
  }, []);

  const subChartWidth = Math.floor((chartWidth - 16) / 2);

  const overlays = useMemo(() => {
    if (!envelopes) return [];
    return [
      { data: envelopes.upper.slice(-60), color: color.bear + "80", lineWidth: 1 },
      { data: envelopes.lower.slice(-60), color: color.bull + "80", lineWidth: 1 },
      { data: envelopes.mid.slice(-60), color: color.orange + "60", lineWidth: 1 },
    ];
  }, [envelopes]);

  return (
    <Card>
      <CardHead>
        <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
          <CardTitle>BTC/USDT \u00B7 ATR Envelope</CardTitle>
          <span style={{ fontSize: font.size.xxs, color: color.purple }}>
            EMA({envEMA}) \u00B1 ATR\u00D7{envMult}
          </span>
        </div>
        <div style={{ display: "flex", gap: 3, flexWrap: "wrap" }}>
          {TIMEFRAMES.map((t) => (
            <button key={t} style={mixins.tfBtn(tf === t)} onClick={() => setTF(t)} aria-label={`Timeframe ${t}`}>
              {t}
            </button>
          ))}
        </div>
      </CardHead>
      <CardBody>
        <div ref={chartRef}>
          <LightweightChart
            candles={candles.slice(-60)}
            overlays={overlays}
            width={chartWidth}
            height={220}
          />
        </div>
        <div style={{ display: "flex", gap: 8, marginTop: 6, alignItems: "center", flexWrap: "wrap" }}>
          <span style={{ fontSize: font.size.xxs, color: color.textFaint }}>EMA:</span>
          {[9, 14, 21, 55].map((p) => (
            <button key={p} style={mixins.tfBtn(envEMA === p)} onClick={() => setEnvEMA(p)} aria-label={`EMA period ${p}`}>
              {p}
            </button>
          ))}
          <span style={{ fontSize: font.size.xxs, color: color.textFaint, marginLeft: 8 }}>ATR\u00D7:</span>
          {[1.5, 2.0, 2.5, 3.0].map((m) => (
            <button key={m} style={mixins.tfBtn(envMult === m)} onClick={() => setEnvMult(m)} aria-label={`ATR multiplier ${m}`}>
              {m}
            </button>
          ))}
        </div>
        <div style={{ marginTop: 8, borderTop: `1px solid ${color.border}`, paddingTop: 6 }}>
          <div style={{ display: "flex", gap: 16 }}>
            <div style={{ flex: 1 }}>
              <div style={{ ...mixins.cardTitle, marginBottom: 3 }}>ATR(14)</div>
              <ATRBars data={atr} w={subChartWidth} h={40} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ ...mixins.cardTitle, marginBottom: 3 }}>CVD</div>
              <CVDLine data={cvd} w={subChartWidth} h={40} />
            </div>
          </div>
        </div>
      </CardBody>
    </Card>
  );
}

export default memo(ChartPanel);
