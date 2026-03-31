import { memo } from "react";
import { MODE_COLORS, BIAS_COLORS } from "../../constants";
import Badge from "../../components/ui/Badge";
import StatusDot from "../../components/ui/StatusDot";
import { color, font } from "../../styles/tokens";
import * as mixins from "../../styles/mixins";

function AgentList({ agents, selectedId, onSelect, onToggle }) {
  if (agents.length === 0) {
    return (
      <div style={{ textAlign: "center", padding: 30, color: color.textDark }}>
        No agents match current filter
      </div>
    );
  }

  return (
    <div role="listbox" aria-label="Agent list">
      {agents.map((a) => (
        <div
          key={a.id}
          style={mixins.agentRow(selectedId === a.id)}
          onClick={() => onSelect(a.id)}
          role="option"
          aria-selected={selectedId === a.id}
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              onSelect(a.id);
            }
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 3 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <button
                onClick={(e) => { e.stopPropagation(); onToggle(a.id); }}
                style={{
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                  padding: 0,
                  display: "flex",
                }}
                title={a.active ? "Deactivate agent" : "Activate agent"}
                aria-label={`${a.active ? "Deactivate" : "Activate"} agent ${a.id}`}
              >
                <StatusDot color={a.active ? color.bull : color.textDark} />
              </button>
              <span
                style={{
                  fontWeight: 700,
                  fontSize: font.size.sm,
                  color: selectedId === a.id ? color.bull : color.textDim,
                }}
              >
                {a.id}
              </span>
            </div>
            <Badge color={MODE_COLORS[a.mode]}>{a.mode.slice(0, 4)}</Badge>
          </div>
          <div style={{ fontSize: font.size.xs, color: color.textMuted, marginBottom: 3 }}>{a.name}</div>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: font.size.xxs, color: color.textFaint }}>
            <span>{a.tf} \u00B7 {a.type}</span>
            <Badge color={BIAS_COLORS[a.bias] || color.textDim}>{a.bias}</Badge>
          </div>
          {/* Live stats bar */}
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4, fontSize: font.size.xxs }}>
            <span style={{ color: color.textFaint }}>{a.trades24h}t</span>
            <span style={{ color: color.bull }}>{(a.winRate * 100).toFixed(0)}%</span>
            <span style={{ color: a.pnl24h >= 0 ? color.bull : color.bear }}>
              {a.pnl24h >= 0 ? "+" : ""}{a.pnl24h.toFixed(0)}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}

export default memo(AgentList);
