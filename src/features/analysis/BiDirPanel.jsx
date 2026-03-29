import { useContext } from "react";
import { MarketContext } from "../../context/MarketContext";
import { MODES, MODE_COLORS } from "../../constants";
import { Card, CardHead, CardBody, CardTitle } from "../../components/ui/Card";
import { color, font } from "../../styles/tokens";

export default function BiDirPanel({ agents }) {
  const { envelopes, atr } = useContext(MarketContext);

  if (!envelopes || atr.length === 0) return null;

  const a14 = atr[atr.length - 1];

  return (
    <Card>
      <CardHead>
        <CardTitle>Bidirectional Setup</CardTitle>
      </CardHead>
      <CardBody>
        {MODES.map((m) => {
          const mp = agents.find((a) => a.mode === m)?.params;
          if (!mp) return null;
          return (
            <div
              key={m}
              style={{
                padding: 8,
                marginBottom: 6,
                background: color.surfaceAlt,
                borderRadius: 5,
                border: `1px solid ${MODE_COLORS[m]}20`,
              }}
            >
              <div style={{ fontWeight: 600, fontSize: font.size.xs, color: MODE_COLORS[m], marginBottom: 4 }}>
                {m}
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6, fontSize: font.size.xs, color: color.textDim }}>
                <div>
                  LONG @ MA\u2193 ${envelopes.lower[envelopes.lower.length - 1].toFixed(0)} \u2192 TP +
                  {(a14 * mp.tpMult).toFixed(0)} / SL -{(a14 * mp.slMult).toFixed(0)}
                </div>
                <div>
                  SHORT @ MA\u2191 ${envelopes.upper[envelopes.upper.length - 1].toFixed(0)} \u2192 TP -
                  {(a14 * mp.tpMult).toFixed(0)} / SL +{(a14 * mp.slMult).toFixed(0)}
                </div>
              </div>
            </div>
          );
        })}
      </CardBody>
    </Card>
  );
}
