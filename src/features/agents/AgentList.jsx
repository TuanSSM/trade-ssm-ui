import { MODE_COLORS, BIAS_COLORS } from "../../constants";
import Badge from "../../components/ui/Badge";
import StatusDot from "../../components/ui/StatusDot";
import { color, font } from "../../styles/tokens";
import * as mixins from "../../styles/mixins";

export default function AgentList({ agents, selectedId, onSelect }) {
  return (
    <div>
      {agents.map((a) => (
        <div key={a.id} style={mixins.agentRow(selectedId === a.id)} onClick={() => onSelect(a.id)}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 3 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <StatusDot color={a.active ? color.bull : color.textDark} />
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
            <span>
              {a.tf} \u00B7 {a.type}
            </span>
            <Badge color={BIAS_COLORS[a.bias] || color.textDim}>{a.bias}</Badge>
          </div>
        </div>
      ))}
    </div>
  );
}
