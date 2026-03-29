import { MODES, MODE_COLORS } from "../../constants";
import { Card, CardHead, CardBody, CardTitle } from "../../components/ui/Card";
import { color, font } from "../../styles/tokens";

export default function ModeRiskProfiles({ agents }) {
  return (
    <Card>
      <CardHead>
        <CardTitle>Mode Risk Profiles</CardTitle>
      </CardHead>
      <CardBody>
        {MODES.map((m) => {
          const ma = agents.filter((a) => a.mode === m);
          const mp = ma[0]?.params;
          if (!mp) return null;
          return (
            <div
              key={m}
              style={{
                padding: 8,
                marginBottom: 8,
                background: color.surfaceAlt,
                borderRadius: 5,
                border: `1px solid ${MODE_COLORS[m]}20`,
              }}
            >
              <div style={{ fontWeight: 700, color: MODE_COLORS[m], fontSize: font.size.sm, marginBottom: 4 }}>
                {m}
              </div>
              <div style={{ fontSize: font.size.xs, color: color.textMuted, lineHeight: 1.7 }}>
                <div>
                  EMA({mp.emaPeriod}) \u00B1 ATR\u00D7{mp.atrMult}
                </div>
                <div>
                  SL: {mp.slMult}\u00D7ATR \u00B7 TP: {mp.tpMult}\u00D7ATR \u00B7 R:R{" "}
                  {(mp.tpMult / mp.slMult).toFixed(1)}
                </div>
                <div>
                  Risk/Trade: {mp.riskPct}% \u00B7 Max Lev: {mp.maxLev}\u00D7
                </div>
                <div>
                  Agents: {ma.length} \u00B7 Active: {ma.filter((a) => a.active).length}
                </div>
              </div>
            </div>
          );
        })}
      </CardBody>
    </Card>
  );
}
