import { useContext } from "react";
import { MarketContext } from "../../context/MarketContext";
import { MODE_COLORS, BIAS_COLORS } from "../../constants";
import { Gauge } from "../../components/charts";
import Badge from "../../components/ui/Badge";
import { fmtP } from "../../utils";
import { color, font } from "../../styles/tokens";
import * as mixins from "../../styles/mixins";

export default function AgentDetail({ agent, positions: allPositions }) {
  const { envelopes, atr } = useContext(MarketContext);

  if (!agent) {
    return (
      <div style={{ textAlign: "center", padding: 40, color: color.textBlack }}>
        Select an agent to view details
      </div>
    );
  }

  const ap = allPositions.filter((p) => p.agentId === agent.id);
  const apnl = ap.reduce((s, p) => s + p.pnl, 0);
  const lastAtr = atr.length > 0 ? atr[atr.length - 1] : 0;

  return (
    <div>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
            <span style={{ fontSize: font.size.xxl, fontWeight: 700, color: color.textBright }}>{agent.name}</span>
            <Badge color={MODE_COLORS[agent.mode]} filled>
              {agent.mode}
            </Badge>
            <Badge color={BIAS_COLORS[agent.bias]}>{agent.bias}</Badge>
          </div>
          <div style={{ fontSize: font.size.xs, color: color.textFaint }}>{agent.desc}</div>
        </div>
        <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
          <Gauge
            value={agent.confidence}
            size={48}
            color={agent.confidence > 0.75 ? color.bull : agent.confidence > 0.5 ? color.orange : color.bear}
          />
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: font.size.xl, fontWeight: 700, color: color.textBright }}>
              {agent.trades24h}
            </div>
            <div style={{ fontSize: font.size.xxs, color: color.textGhost }}>24h Trades</div>
          </div>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: font.size.xl, fontWeight: 700, color: color.bull }}>
              {(agent.winRate * 100).toFixed(0)}%
            </div>
            <div style={{ fontSize: font.size.xxs, color: color.textGhost }}>Win Rate</div>
          </div>
          <div style={{ textAlign: "center" }}>
            <div
              style={{
                fontSize: font.size.xl,
                fontWeight: 700,
                color: agent.pnl24h >= 0 ? color.bull : color.bear,
              }}
            >
              {fmtP(agent.pnl24h)}
            </div>
            <div style={{ fontSize: font.size.xxs, color: color.textGhost }}>24h PnL</div>
          </div>
        </div>
      </div>

      {/* Envelope Config */}
      <div style={{ ...mixins.infoBox, marginBottom: 8 }}>
        <div style={{ fontSize: font.size.xs, fontWeight: 700, color: color.purple, marginBottom: 6 }}>
          ENVELOPE CONFIG
        </div>
        <div style={{ fontSize: font.size.xs, color: color.textDim, lineHeight: 1.7 }}>
          <div>{agent.envelopeDesc}</div>
          <div style={{ marginTop: 4, color: color.textMuted }}>
            <span style={{ color: color.orange }}>SL:</span> {agent.params.slMult}\u00D7 ATR \u00B7{" "}
            <span style={{ color: color.bull }}>TP:</span> {agent.params.tpMult}\u00D7 ATR \u00B7{" "}
            <span style={{ color: color.bear }}>Risk:</span> {agent.params.riskPct}% \u00B7 Max Lev:{" "}
            {agent.params.maxLev}\u00D7
          </div>
        </div>
      </div>

      {/* Pullback Logic */}
      <div style={{ ...mixins.infoBox, marginBottom: 8 }}>
        <div style={{ fontSize: font.size.xs, fontWeight: 700, color: color.orange, marginBottom: 6 }}>
          PULLBACK ENTRY LOGIC
        </div>
        <div style={{ fontSize: font.size.xs, color: color.textDim, lineHeight: 1.7 }}>{agent.pullbackLogic}</div>
      </div>

      {/* BiDir Setup */}
      {(agent.bias === "BOTH" || agent.type.includes("BiDir")) && lastAtr > 0 && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 8 }}>
          <div style={{ padding: 10, borderRadius: 6, border: `1px solid ${color.bull}25`, background: `${color.bull}08` }}>
            <div style={{ fontWeight: 700, color: color.bull, fontSize: font.size.sm, marginBottom: 4 }}>
              LONG SETUP
            </div>
            <div style={{ fontSize: font.size.xs, color: color.textDim }}>
              Entry: MA Lower (${envelopes ? envelopes.lower[envelopes.lower.length - 1].toFixed(0) : "..."})
            </div>
            <div style={{ fontSize: font.size.xs, color: color.bull }}>
              TP: +{(lastAtr * agent.params.tpMult).toFixed(0)}
            </div>
            <div style={{ fontSize: font.size.xs, color: color.bear }}>
              SL: -{(lastAtr * agent.params.slMult).toFixed(0)}
            </div>
            <div style={{ fontSize: font.size.xxs, color: color.textFaint, marginTop: 3 }}>
              R:R = {(agent.params.tpMult / agent.params.slMult).toFixed(1)}
            </div>
          </div>
          <div style={{ padding: 10, borderRadius: 6, border: `1px solid ${color.bear}25`, background: `${color.bear}08` }}>
            <div style={{ fontWeight: 700, color: color.bear, fontSize: font.size.sm, marginBottom: 4 }}>
              SHORT SETUP
            </div>
            <div style={{ fontSize: font.size.xs, color: color.textDim }}>
              Entry: MA Upper (${envelopes ? envelopes.upper[envelopes.upper.length - 1].toFixed(0) : "..."})
            </div>
            <div style={{ fontSize: font.size.xs, color: color.bull }}>
              TP: -{(lastAtr * agent.params.tpMult).toFixed(0)}
            </div>
            <div style={{ fontSize: font.size.xs, color: color.bear }}>
              SL: +{(lastAtr * agent.params.slMult).toFixed(0)}
            </div>
            <div style={{ fontSize: font.size.xxs, color: color.textFaint, marginTop: 3 }}>
              R:R = {(agent.params.tpMult / agent.params.slMult).toFixed(1)}
            </div>
          </div>
        </div>
      )}

      {/* Linked Positions */}
      {ap.length > 0 && (
        <div>
          <div style={{ ...mixins.cardTitle, marginBottom: 4 }}>Linked Positions ({ap.length})</div>
          <table style={mixins.table}>
            <thead>
              <tr>
                {["Ex", "Side", "Size", "PnL", "Lev"].map((h) => (
                  <th key={h} style={mixins.th}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {ap.map((p) => (
                <tr key={p.id}>
                  <td style={mixins.td}>{p.exchange}</td>
                  <td style={mixins.td}>
                    <Badge color={p.side === "LONG" ? color.bull : color.bear}>{p.side}</Badge>
                  </td>
                  <td style={mixins.td}>{p.size}</td>
                  <td style={{ ...mixins.td, color: p.pnl >= 0 ? color.bull : color.bear }}>{fmtP(p.pnl)}</td>
                  <td style={mixins.td}>{p.leverage}\u00D7</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
