import { useContext } from "react";
import { MarketContext } from "../../context/MarketContext";
import { useAgents, usePositions } from "../../hooks";
import { Card, CardHead, CardBody, CardTitle } from "../../components/ui/Card";
import Badge from "../../components/ui/Badge";
import { fmtP } from "../../utils";
import { color, font } from "../../styles/tokens";
import { MODE_COLORS, MODE_ICONS } from "../../constants";
import * as mixins from "../../styles/mixins";

export default function PositionsTab({ modeFilter }) {
  const { agents } = useAgents(modeFilter);
  const { positions } = usePositions(agents);

  const filtered = modeFilter === "ALL" ? positions : positions.filter((p) => p.agentMode === modeFilter);

  return (
    <div style={{ padding: 14 }}>
      <Card>
        <CardHead>
          <CardTitle>All Positions \u00B7 {positions.length}</CardTitle>
          <div style={{ display: "flex", gap: 4 }}>
            <Badge color={color.bull}>{positions.filter((p) => p.side === "LONG").length} LONG</Badge>
            <Badge color={color.bear}>{positions.filter((p) => p.side === "SHORT").length} SHORT</Badge>
          </div>
        </CardHead>
        <div style={{ overflowX: "auto" }}>
          <table style={mixins.table}>
            <thead>
              <tr>
                {["Exchange", "Side", "Size", "Entry", "Current", "Lev", "PnL ($)", "PnL (%)", "Agent", "Mode", "Status"].map(
                  (h) => (
                    <th key={h} style={mixins.th}>
                      {h}
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => (
                <tr key={p.id} className="anim-row">
                  <td style={mixins.td}>
                    <span style={{ fontWeight: 600 }}>{p.exchange}</span>
                  </td>
                  <td style={mixins.td}>
                    <Badge color={p.side === "LONG" ? color.bull : color.bear}>{p.side}</Badge>
                  </td>
                  <td style={mixins.td}>{p.size}</td>
                  <td style={mixins.td}>${p.entry.toLocaleString()}</td>
                  <td style={mixins.td}>${p.current.toLocaleString()}</td>
                  <td style={mixins.td}>{p.leverage}\u00D7</td>
                  <td style={{ ...mixins.td, color: p.pnl >= 0 ? color.bull : color.bear, fontWeight: 600 }}>
                    {fmtP(p.pnl)}
                  </td>
                  <td style={{ ...mixins.td, color: p.pnlPct >= 0 ? color.bull : color.bear }}>
                    {fmtP(p.pnlPct)}%
                  </td>
                  <td style={{ ...mixins.td, fontSize: font.size.xxs, color: color.textDim }}>{p.agentId}</td>
                  <td style={mixins.td}>
                    <span style={{ fontSize: font.size.xxs, color: MODE_COLORS[p.agentMode] }}>
                      {MODE_ICONS[p.agentMode]} {p.agentMode.slice(0, 4)}
                    </span>
                  </td>
                  <td style={mixins.td}>
                    <Badge color={p.status === "ACTIVE" ? color.bull : color.orange}>{p.status}</Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
